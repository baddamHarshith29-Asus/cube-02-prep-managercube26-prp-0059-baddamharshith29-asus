import assert from "node:assert";
import { extractAndParseJson } from "./services/jsonParser.js";

console.log("Testing extractAndParseJson...");

// 1. Plain
assert.deepStrictEqual(extractAndParseJson('{"a":1}'), { a: 1 });

// 2. Markdown wrapped
assert.deepStrictEqual(extractAndParseJson('```json\n{"b":2}\n```'), { b: 2 });

// 3. Reasoning / think tag
assert.deepStrictEqual(extractAndParseJson('<think>Some chain of thought</think>{"c":3}'), { c: 3 });

// 4. Trailing commas and surrounding text
assert.deepStrictEqual(extractAndParseJson('Here is your response:\n{"d":4, "items": [1, 2, ], }\nHope that helps!'), { d: 4, items: [1, 2] });

// 5. Curly quotes
assert.deepStrictEqual(extractAndParseJson('{\u201Cstatus\u201D: \u201CPASS\u201D}'), { status: "PASS" });

console.log("✓ All jsonParser assertions PASSED cleanly!");
