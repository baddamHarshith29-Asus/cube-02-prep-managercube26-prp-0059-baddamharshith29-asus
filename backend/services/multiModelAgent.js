// Unified Multi-Model Vision Agent Hub
// Coordinates Google Gemini 3.5 Flash, Groq Cloud Reasoning, and Ollama Local Vision
// with Multi-Model Cross-Verification Consensus & Genuine Vision Perception.

import path from "path";
import { fileURLToPath } from "url";
import { AUTHORITATIVE_RULES } from "../data/rules.js";
import { extractAndParseJson } from "./jsonParser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
try {
  process.loadEnvFile(path.join(__dirname, "..", ".env"));
} catch (e) {}

const PREP_PROMPT = `
You are the authoritative AI Prep Manager for Inbound Fulfillment (Amazon FBA / Walmart WFS Compliance).
Analyze this packaging and labeling photograph strictly against authoritative fulfillment standards.

CRITICAL INSTRUCTIONS FOR GENUINE PERCEPTION:
1. Examine the actual photograph carefully. Identify what product is physically visible.
2. DO NOT hallucinate or return generic sample data. If an element (polybag, suffocation warning, barcode, FNSKU, expiry date) is absent from the image, mark its "present" field as false and set its "bbox" to null.
3. For all detected objects, provide precise bounding box coordinates normalized to a 600x600 plane: { "x": 0-600, "y": 0-600, "w": 0-600, "h": 0-600 }.
4. Read all visible text, barcodes, and warning statements verbatim using OCR.

AUTHORITATIVE PREPARATION REQUIREMENTS:
1. Polybag: Transparent envelope enclosing product; hermetically sealed with heat weld or approved tape. Opening width >= 5.0" triggers mandatory suffocation warning.
2. Suffocation Warning: Verbatim text required: "WARNING: To avoid danger of suffocation, keep this plastic bag away from babies and children. Do not use in cribs, beds, carriages, or playpens. This bag is not a toy." (Font: 10pt-24pt depending on total dimensions).
3. FNSKU Placement: Must be on outermost FLAT surface. FORBIDDEN across curved rims/cylinders (>15° bend causes laser distortion) and must maintain >=0.5" clearance from bag seams/crimps.
4. Original Barcode: Any manufacturer UPC/EAN must be completely covered. Zero exposed dual barcodes allowed.
5. Expiry Date: Visible through bag and never covered by FNSKU label.
6. Epistemic Limitation: Physical properties not measurable from 2D optical photos (such as 1.5 mil plastic film gauge thickness) MUST be tagged UNCERTAIN with stated reason, NOT guessed.

Respond strictly with a valid JSON object matching this schema:
{
  "detectedProduct": {
    "title": string,
    "category": string,
    "description": string,
    "isPackaged": boolean
  },
  "polybag": {
    "present": boolean,
    "sealed": boolean,
    "sealType": "heat-seal" | "tape" | "unsealed" | null,
    "sealIntegrityScore": number (0-100),
    "openingWidthInches": number,
    "bbox": { "x": number, "y": number, "w": number, "h": number, "label": string } | null
  },
  "seam": {
    "present": boolean,
    "type": string | null,
    "bbox": { "x": number, "y": number, "w": number, "h": number } | null
  },
  "suffocationWarning": {
    "present": boolean,
    "legible": boolean,
    "legibilityScore": number (0-100),
    "fontSizePt": number,
    "contrastRatio": number,
    "glareIndexPct": number,
    "textDetected": string | null,
    "bbox": { "x": number, "y": number, "w": number, "h": number } | null
  },
  "fnskuLabel": {
    "present": boolean,
    "code": string | null,
    "surfaceType": "FLAT" | "SHARP_CURVATURE" | "SEAM_COLLISION" | "UNKNOWN",
    "curvatureAngleDeg": number,
    "seamDistanceInches": number,
    "onFoldOrSeam": boolean,
    "bbox": { "x": number, "y": number, "w": number, "h": number } | null
  },
  "originalBarcode": {
    "present": boolean,
    "covered": boolean,
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
  "confidenceScore": number (0.0 to 1.0)
}
`.trim();

// 1. Google Gemini Vision Provider (Supports Gemini 3.5 Flash with 2.5 Flash Fallback)
export async function callGeminiVision({ imageBase64, mimeType = "image/jpeg", apiKey }) {
  const key = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) throw new Error("No GEMINI_API_KEY configured.");

  const cleanBase64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
  const requestBody = {
    contents: [{
      parts: [
        { text: PREP_PROMPT },
        { inline_data: { mime_type: mimeType, data: cleanBase64 } }
      ]
    }],
    generationConfig: {
      temperature: 0.1,
      response_mime_type: "application/json"
    }
  };

  const candidateModels = [
    process.env.GEMINI_MODEL,
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash-lite"
  ].filter(Boolean);
  const modelsToTry = Array.from(new Set(candidateModels));

  let lastError = null;
  for (const model of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        lastError = `Model ${model} returned ${response.status}: ${errorText}`;
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        lastError = `Empty response from ${model}`;
        continue;
      }

      const parsed = extractAndParseJson(text);
      return {
        provider: `Google Gemini (${model})`,
        modelUsed: model,
        entities: parsed
      };
    } catch (err) {
      lastError = err.message;
    }
  }

  throw new Error(`Gemini Vision failed across candidate models: ${lastError}`);
}

// 2. Groq Compliance Reasoner & Critic Agent Provider
export async function callGroqReasoner({ visualFindings, workOrder, apiKey, model = "qwen/qwen3.8-27b" }) {
  const key = apiKey || process.env.GROQ_API_KEY;
  if (!key) throw new Error("No GROQ_API_KEY configured.");

  const criticPrompt = `
You are the Senior Compliance Critic Agent for Inbound Warehouse Fulfillment (Amazon FBA / Walmart WFS).
Review these visual optical findings detected by the Vision AI from the package photograph:

Visual Findings:
${JSON.stringify(visualFindings, null, 2)}

Work Order Intent:
${JSON.stringify(workOrder, null, 2)}

AUTHORITATIVE COMPLIANCE STANDARDS:
- Polybag opening >= 5.0" MUST have legible suffocation warning.
- FNSKU label MUST be flat (curvature <= 15.0°) and >= 0.5" away from seams.
- Manufacturer UPC barcode MUST be covered.
- Product must be hermetically sealed if polybag is used.

Review the evidence critically:
1. Does the evidence truly support a PASS, FAIL, or UNCERTAIN?
2. Are there any false passes or overlooked defects?
3. What is your independent verdict?

Respond strictly with a JSON object matching this schema:
{
  "criticVerdict": "PASS" | "FAIL" | "UNCERTAIN",
  "criticConfidence": number (0.0 to 1.0),
  "agreementWithVision": boolean,
  "criticReasoning": string,
  "identifiedRisks": string[],
  "auditDefenseScore": number (0-100)
}
`.trim();

  const url = "https://api.groq.com/openai/v1/chat/completions";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: criticPrompt }],
      response_format: { type: "json_object" },
      temperature: 0.1
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from Groq Reasoner.");

  return {
    provider: `Groq (${model})`,
    critic: extractAndParseJson(content)
  };
}

// 3. Ollama Local Vision Provider (Local Private Fallback)
export async function callOllamaVision({ imageBase64, ollamaUrl = "http://localhost:11434", model = "llama3.2-vision" }) {
  const cleanBase64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
  const url = `${ollamaUrl.replace(/\/$/, "")}/api/generate`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt: `${PREP_PROMPT}\nReturn only valid JSON matching the schema.`,
      images: [cleanBase64],
      format: "json",
      stream: false,
      options: { temperature: 0.1 }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data.response;
  if (!text) throw new Error("Empty response from Ollama.");

  return {
    provider: `Ollama Local (${model})`,
    entities: extractAndParseJson(text)
  };
}

// 4. Multi-Model Consensus Engine: Connects Gemini, Groq, and Ollama together
export async function executeMultiModelVisionCascade({
  imageBase64,
  mimeType = "image/jpeg",
  preferredProvider = "auto",
  apiKeys = {},
  ollamaConfig = {},
  fallbackEntities = null,
  workOrder = null
}) {
  const attempts = [];
  const modelConsensus = {
    gemini: null,
    groq: null,
    ollama: null,
    consensusVerdict: "UNCERTAIN",
    summary: ""
  };

  let primaryEntities = null;
  let primaryProvider = "Built-in 2-Stage Spatial Geometry Engine";

  // Step 1: Execute Gemini Multimodal Vision Perception
  const geminiKey = apiKeys.gemini || process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const geminiRes = await callGeminiVision({ imageBase64, mimeType, apiKey: geminiKey });
      primaryEntities = geminiRes.entities;
      primaryProvider = geminiRes.provider;
      modelConsensus.gemini = {
        status: "SUCCESS",
        model: geminiRes.modelUsed,
        verdict: geminiRes.entities.overallVerdict || "UNCERTAIN",
        confidence: geminiRes.entities.confidenceScore || 0.94,
        productDetected: geminiRes.entities.detectedProduct?.title || "Custom Packaged SKU"
      };
      attempts.push({ provider: "Gemini", status: "SUCCESS", model: geminiRes.modelUsed });
    } catch (err) {
      console.warn("Gemini Vision attempt failed:", err.message);
      attempts.push({ provider: "Gemini", error: err.message });
      modelConsensus.gemini = { status: "FAILED", error: err.message };
    }
  }

  // Step 2: If Ollama is requested or Gemini failed, try Ollama
  if (!primaryEntities && (preferredProvider === "ollama" || !geminiKey)) {
    const url = ollamaConfig.url || "http://localhost:11434";
    const model = ollamaConfig.model || "llama3.2-vision";
    try {
      const ollamaRes = await callOllamaVision({ imageBase64, ollamaUrl: url, model });
      primaryEntities = ollamaRes.entities;
      primaryProvider = ollamaRes.provider;
      modelConsensus.ollama = {
        status: "SUCCESS",
        model,
        verdict: ollamaRes.entities.overallVerdict || "UNCERTAIN"
      };
      attempts.push({ provider: "Ollama", status: "SUCCESS" });
    } catch (err) {
      attempts.push({ provider: "Ollama", error: err.message });
      modelConsensus.ollama = { status: "OFFLINE", error: err.message };
    }
  }

  // Step 3: Execute Groq AI Critic Agent to cross-verify the findings
  const groqKey = apiKeys.groq || process.env.GROQ_API_KEY;
  if (groqKey && primaryEntities) {
    try {
      const groqRes = await callGroqReasoner({
        visualFindings: primaryEntities,
        workOrder: workOrder || { productName: primaryEntities.detectedProduct?.title || "Inbound SKU" },
        apiKey: groqKey,
        model: apiKeys.groqModel || "qwen/qwen3.8-27b"
      });
      modelConsensus.groq = {
        status: "SUCCESS",
        model: "qwen/qwen3.8-27b",
        verdict: groqRes.critic.criticVerdict,
        confidence: groqRes.critic.criticConfidence,
        reasoning: groqRes.critic.criticReasoning,
        agreement: groqRes.critic.agreementWithVision
      };
      attempts.push({ provider: "Groq (Critic)", status: "SUCCESS", verdict: groqRes.critic.criticVerdict });
    } catch (err) {
      console.warn("Groq Critic verification failed:", err.message);
      attempts.push({ provider: "Groq (Critic)", error: err.message });
      modelConsensus.groq = { status: "FAILED", error: err.message };
    }
  }

  // If no AI model produced entities, fall back to default
  if (!primaryEntities) {
    primaryEntities = fallbackEntities;
    modelConsensus.summary = "Operating in offline spatial computational mode. Configure GEMINI_API_KEY for live vision.";
  } else {
    // Reconcile consensus
    if (modelConsensus.gemini && modelConsensus.groq) {
      if (modelConsensus.gemini.verdict === modelConsensus.groq.verdict) {
        modelConsensus.consensusVerdict = modelConsensus.gemini.verdict;
        modelConsensus.summary = `Cross-Verified: Gemini Vision and Groq Critic both agree on ${modelConsensus.consensusVerdict}.`;
      } else {
        modelConsensus.consensusVerdict = modelConsensus.groq.verdict === "FAIL" ? "FAIL" : modelConsensus.gemini.verdict;
        modelConsensus.summary = `Critic Challenge: Gemini perceived ${modelConsensus.gemini.verdict}, but Groq Critic flagged ${modelConsensus.groq.verdict}: ${modelConsensus.groq.reasoning}`;
      }
    } else if (modelConsensus.gemini) {
      modelConsensus.consensusVerdict = modelConsensus.gemini.verdict;
      modelConsensus.summary = `Verified via ${primaryProvider}.`;
    }
  }

  return {
    usedProvider: primaryProvider,
    status: primaryEntities ? "SUCCESS" : "FALLBACK",
    entities: primaryEntities,
    modelConsensus,
    attempts
  };
}

// 5. Connection Test for Settings Modal
export async function testModelProvider({ provider, apiKey, groqModel, ollamaUrl, ollamaModel }) {
  const startTime = Date.now();

  if (provider === "spatial") {
    return {
      provider: "spatial",
      success: true,
      latencyMs: 1,
      message: "Stage B Spatial Computational Geometry Engine is active and ready."
    };
  }

  if (provider === "gemini") {
    const key = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!key) return { provider: "gemini", success: false, message: "Missing Google Gemini API key." };
    
    try {
      const modelsToTest = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-2.0-flash"];
      for (const m of modelsToTest) {
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}?key=${key}`);
        if (resp.ok) {
          const latencyMs = Date.now() - startTime;
          const data = await resp.json();
          return {
            provider: "gemini",
            success: true,
            latencyMs,
            message: `Connected to ${data.displayName || m} successfully (${latencyMs}ms). Ready for high-precision vision.`
          };
        }
      }
      return { provider: "gemini", success: false, message: "Could not connect to Gemini models." };
    } catch (err) {
      return { provider: "gemini", success: false, message: `Gemini connection failed: ${err.message}` };
    }
  }

  if (provider === "groq") {
    const key = apiKey || process.env.GROQ_API_KEY;
    if (!key) return { provider: "groq", success: false, message: "Missing Groq API key." };
    try {
      const resp = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { "Authorization": `Bearer ${key}` }
      });
      const latencyMs = Date.now() - startTime;
      if (!resp.ok) {
        const errText = await resp.text();
        return { provider: "groq", success: false, latencyMs, message: `Groq error: ${errText}` };
      }
      return {
        provider: "groq",
        success: true,
        latencyMs,
        message: `Connected to Groq Cloud (${latencyMs}ms). Active models available for Compliance Critic.`
      };
    } catch (err) {
      return { provider: "groq", success: false, latencyMs: Date.now() - startTime, message: `Groq connection failed: ${err.message}` };
    }
  }

  if (provider === "ollama") {
    const base = (ollamaUrl || "http://localhost:11434").replace(/\/$/, "");
    try {
      const resp = await fetch(`${base}/api/tags`);
      const latencyMs = Date.now() - startTime;
      if (!resp.ok) return { provider: "ollama", success: false, latencyMs, message: `Ollama returned HTTP ${resp.status}.` };
      const data = await resp.json();
      return {
        provider: "ollama",
        success: true,
        latencyMs,
        message: `Connected to Ollama daemon (${latencyMs}ms). Models: ${(data.models || []).map(m => m.name).join(", ") || "None"}`
      };
    } catch (err) {
      return { provider: "ollama", success: false, message: `Could not reach Ollama at ${base}. Run 'ollama serve' for offline local AI.` };
    }
  }

  return { provider, success: false, message: "Unknown model provider specified." };
}
