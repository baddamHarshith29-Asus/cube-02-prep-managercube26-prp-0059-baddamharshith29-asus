/**
 * Resilient JSON Parser for LLM & Vision Model Outputs
 * Handles:
 * - Markdown code blocks (```json ... ``` or ``` ... ```)
 * - Reasoning tags (<think>...</think> from models like DeepSeek / Qwen)
 * - Leading / trailing conversational text
 * - Trailing commas in objects and arrays
 * - Smart / curly quotes (“ ” ‘ ’)
 * - Unicode control characters and escapes
 */

export function extractAndParseJson(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("No text content provided to parse JSON.");
  }

  // 1. Remove reasoning / thought blocks (<think>...</think>)
  let cleaned = rawText.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  // 2. Strip markdown code fences if wrapped
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = cleaned.match(codeBlockRegex);
  if (match && match[1]) {
    cleaned = match[1].trim();
  }

  // 3. Fast path: Direct JSON.parse
  try {
    return JSON.parse(cleaned);
  } catch (initialErr) {
    // 4. Bracket-extraction path: Find the outermost '{' ... '}' or '[' ... ']'
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    const firstBracket = cleaned.indexOf("[");
    const lastBracket = cleaned.lastIndexOf("]");

    let candidate = null;
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      if (firstBracket !== -1 && firstBracket < firstBrace && lastBracket > lastBrace) {
        candidate = cleaned.slice(firstBracket, lastBracket + 1);
      } else {
        candidate = cleaned.slice(firstBrace, lastBrace + 1);
      }
    } else if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      candidate = cleaned.slice(firstBracket, lastBracket + 1);
    }

    if (candidate) {
      try {
        return JSON.parse(candidate);
      } catch (candErr) {
        // 5. Sanitization pass: remove trailing commas, fix curly quotes
        const sanitized = candidate
          .replace(/,\s*([}\]])/g, "$1") // trailing commas
          .replace(/[\u201C\u201D]/g, '"') // curly double quotes
          .replace(/[\u2018\u2019]/g, "'") // curly single quotes
          .replace(/[\x00-\x1F\x7F-\x9F]/g, (c) => (c === "\n" || c === "\r" || c === "\t" ? c : "")); // strip invalid control chars

        try {
          return JSON.parse(sanitized);
        } catch (sanitizedErr) {
          throw new Error(
            `Failed to parse LLM JSON: ${sanitizedErr.message}. Candidate snippet: ${candidate.slice(0, 160)}...`
          );
        }
      }
    }

    throw new Error(
      `No valid JSON structure found in LLM output. Initial error: ${initialErr.message}. Output was: ${rawText.slice(0, 160)}...`
    );
  }
}
