// Live Google Gemini Vision Multimodal Agent Service
// Uses Gemini 1.5/2.0 Flash with visual perception & structured JSON output

import { AUTHORITATIVE_RULES } from "../data/rules.js";
import { extractAndParseJson } from "./jsonParser.js";

export async function analyzeImageWithGemini({ imageBase64, mimeType = "image/jpeg", apiKey, workOrder }) {
  const effectiveKey = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!effectiveKey) {
    return {
      usedLiveAgent: false,
      reason: "No GEMINI_API_KEY provided. Using high-precision built-in spatial heuristic engine."
    };
  }

  const prompt = `
You are the authoritative AI Prep Manager for Inbound Fulfillment (Amazon FBA / Walmart WFS Compliance).
Analyze this packaging and labeling photograph strictly against these authoritative preparation requirements:

AUTHORITATIVE PREP REQUIREMENTS:
1. Polybag: Must enclose product completely and be sealed with continuous heat-seal weld, tape, or permanent adhesive.
2. Suffocation Warning: Polybag opening >= 5.0 inches MUST feature warning: "WARNING: To avoid danger of suffocation, keep this plastic bag away from babies and children. Do not use in cribs, beds, carriages, or playpens. This bag is not a toy." (Font size: <30" total: 10pt; 30-39": 14pt; 40-59": 18pt; >=60": 24pt).
3. FNSKU Placement: Must be on an outermost FLAT surface. FORBIDDEN across curved edges/rims (>15 degrees bend causes laser distortion). Must maintain minimum 0.5-inch clearance from seams, crimps, and bag folds.
4. Original Barcode: Any manufacturer UPC/EAN barcode MUST be completely covered. Zero dual scannable barcodes allowed.
5. Expiry Date: Must be clearly visible without opening bag and NEVER covered by FNSKU label.
6. Handling Marks: Multi-packs require "Sold as Set - Do Not Separate". Fragile ceramics/glass require "Fragile - Handle With Care".
7. EPISTEMIC LIMITATION CONSTRAINT: Physical properties that CANNOT be measured from a 2D optical photo (such as 1.5 mil plastic film gauge thickness) MUST be tagged UNCERTAIN with stated reason, NOT guessed.

Product Context:
${workOrder ? JSON.stringify(workOrder, null, 2) : "General Merchandise SKU"}

Respond strictly with a valid JSON object matching this schema:
{
  "polybag": {
    "present": true,
    "sealed": true,
    "sealType": "heat-seal" | "tape" | "unsealed",
    "sealIntegrityScore": 0-100,
    "openingWidthInches": number,
    "bbox": { "x": number, "y": number, "w": number, "h": number, "label": string }
  },
  "seam": {
    "present": true,
    "bbox": { "x": number, "y": number, "w": number, "h": number }
  },
  "suffocationWarning": {
    "present": true | false | "UNCERTAIN",
    "legible": boolean,
    "legibilityScore": 0-100,
    "fontSizePt": number,
    "contrastRatio": number,
    "glareIndexPct": number,
    "textDetected": string,
    "bbox": { "x": number, "y": number, "w": number, "h": number }
  },
  "fnskuLabel": {
    "present": boolean,
    "code": string,
    "surfaceType": "FLAT" | "SHARP_CURVATURE" | "SEAM_COLLISION",
    "curvatureAngleDeg": number,
    "seamDistanceInches": number,
    "onFoldOrSeam": boolean,
    "bbox": { "x": number, "y": number, "w": number, "h": number }
  },
  "originalBarcode": {
    "covered": boolean | "UNCERTAIN_OCCLUDED",
    "exposedUpcFound": boolean,
    "upcValue": string | null,
    "bbox": { "x": number, "y": number, "w": number, "h": number } | null
  },
  "expiryDate": {
    "applicable": boolean,
    "visible": boolean | null,
    "covered": boolean,
    "text": string | null,
    "bbox": { "x": number, "y": number, "w": number, "h": number } | null
  },
  "handlingMarks": {
    "required": string[],
    "detected": string[],
    "missing": string[]
  },
  "overallVerdict": "PASS" | "FAIL" | "UNCERTAIN",
  "primaryReason": string,
  "confidence": number
}
  `.trim();

  try {
    const cleanBase64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: cleanBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        response_mime_type: "application/json"
      }
    };

    const modelsToTry = [
      process.env.GEMINI_MODEL || "gemini-3.6-flash",
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-2.5-flash",
      "gemini-3.1-flash-lite",
      "gemini-2.5-flash-lite"
    ];

    let lastError = null;
    for (const model of modelsToTry) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${effectiveKey}`;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`Gemini model ${model} returned ${response.status}:`, errText);
          lastError = `Model ${model} returned ${response.status}: ${errText}`;
          continue; // Try next fallback model
        }

        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidateText) {
          lastError = `No candidate text returned by ${model}`;
          continue;
        }

        const parsedJson = extractAndParseJson(candidateText);
        return {
          usedLiveAgent: true,
          modelUsed: model,
          extractedEntities: parsedJson
        };
      } catch (callErr) {
        lastError = callErr.message;
        console.warn(`Failed invoking ${model}:`, callErr.message);
      }
    }

    return {
      usedLiveAgent: false,
      error: `Gemini models failed: ${lastError}`,
      details: lastError
    };
  } catch (err) {
    console.error("Gemini Vision Agent execution failed:", err);
    return {
      usedLiveAgent: false,
      error: err.message
    };
  }
}
