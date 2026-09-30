// Comprehensive Regression & Innovative Features Test Suite
import assert from "node:assert";
import { executeDirectorInspection } from "./services/multiAgentOrchestrator.js";
import { TEST_SCENARIOS } from "./data/scenarios.js";
import { WORK_ORDERS } from "./data/rules.js";
import { provenanceLedger } from "./services/provenanceLedger.js";

console.log("=================================================");
console.log("RUNNING COMPREHENSIVE INNOVATION TEST SUITE");
console.log("=================================================");

let passCount = 0;

// Test 1: All 10 Authoritative Scenarios match expected verdict
console.log("\n[TEST 1] Authoritative Scenarios Verdict Match:");
TEST_SCENARIOS.forEach((sc, i) => {
  const wo = WORK_ORDERS.find(w => w.orderId === sc.workOrderId);
  const res = executeDirectorInspection({
    scenarioId: sc.id,
    workOrder: wo,
    visualEntities: sc.visualEntities
  });

  assert.strictEqual(res.overallVerdict, sc.expectedVerdict, `Scenario ${sc.id} verdict mismatch!`);
  console.log(`  ✓ ${sc.id}: Expected ${sc.expectedVerdict} === Actual ${res.overallVerdict}`);
  passCount++;
});

// Test 2: Feature 1 - Intelligent Re-Inspection on Missing Evidence (Scenario 9)
console.log("\n[TEST 2] Feature 1: Intelligent Re-Inspection:");
const sc9 = TEST_SCENARIOS[8];
const wo3 = WORK_ORDERS[2];
const res9 = executeDirectorInspection({
  scenarioId: sc9.id,
  workOrder: wo3,
  visualEntities: sc9.visualEntities
});
assert.strictEqual(res9.reInspection.needed, true, "Scenario 9 must trigger re-inspection!");
assert.ok(res9.reInspection.request.prompt.includes("capture the top opening"), "Re-inspection prompt must target top opening!");
console.log(`  ✓ Detected missing evidence prompt: "${res9.reInspection.request.prompt}"`);
console.log(`  ✓ Target area identified: ${res9.reInspection.request.targetArea}`);
passCount++;

// Test 3: Feature 2 - Multi-Agent Inspection Architecture
console.log("\n[TEST 3] Feature 2: Multi-Agent Inspection Team:");
assert.ok(res9.multiAgentTeam, "MultiAgentTeam telemetry must be present!");
assert.strictEqual(res9.multiAgentTeam.agents.length, 6, "Must contain all 6 specialized agents!");
const agentNames = res9.multiAgentTeam.agents.map(a => a.name);
["Packaging Agent", "Label Agent", "Barcode Agent", "Spatial Agent", "Rule Agent", "Critic Agent"].forEach(name => {
  assert.ok(agentNames.includes(name), `Missing agent: ${name}`);
});
console.log(`  ✓ All 6 specialized agents active: ${agentNames.join(", ")}`);
passCount++;

// Test 4: Feature 3 - Evidence-Based Verdicts
console.log("\n[TEST 4] Feature 3: Evidence-Based Verdicts Structure:");
const sc4 = TEST_SCENARIOS[3]; // Curved edge FNSKU
const woApparel = WORK_ORDERS.find(w => w.orderId === sc4.workOrderId);
const res4 = executeDirectorInspection({
  scenarioId: sc4.id,
  workOrder: woApparel,
  visualEntities: sc4.visualEntities
});
const curvedCheck = res4.checks.find(c => c.ruleId === "RULE-FNSKU-SURF-05");
assert.ok(curvedCheck, "Must have curved check!");
assert.strictEqual(curvedCheck.verdict, "FAIL");
assert.ok(curvedCheck.evidence, "Check must have visual evidence!");
assert.ok(curvedCheck.detectedRegion, "Check must have detectedRegion coordinates!");
assert.ok(curvedCheck.confidence > 0.9, "Check must have high confidence!");
console.log(`  ✓ Evidence: "${curvedCheck.evidence}"`);
console.log(`  ✓ Detected Region: [${curvedCheck.detectedRegion.x}, ${curvedCheck.detectedRegion.y}, ${curvedCheck.detectedRegion.w}x${curvedCheck.detectedRegion.h}]`);
passCount++;

// Test 5: Feature 4 - Self-Critique / Second Opinion (Critic Agent)
console.log("\n[TEST 5] Feature 4: Self-Critique / Critic Agent Second Opinion:");
assert.ok(res9.critiqueResult, "Critique result must be present!");
assert.strictEqual(res9.critiqueResult.downgradeApplied, true, "Critic must downgrade scenario 9!");
console.log(`  ✓ Critic Downgrade Reason: "${res9.critiqueResult.downgradeReason}"`);
passCount++;

// Test 6: Feature 5 - Work Order vs Actual Physical Reality Comparator
console.log("\n[TEST 6] Feature 5: Work Order vs Actual Product Comparison:");
const sc6 = TEST_SCENARIOS[5]; // Exposed UPC
const wo6 = WORK_ORDERS.find(w => w.orderId === sc6.workOrderId);
const res6 = executeDirectorInspection({
  scenarioId: sc6.id,
  workOrder: wo6,
  visualEntities: sc6.visualEntities
});
assert.strictEqual(res6.workOrderComparison.hasMismatch, true, "Exposed UPC must trigger work order mismatch!");
console.log(`  ✓ Comparison Mismatch: "${res6.workOrderComparison.mismatchSummary}"`);
passCount++;

// Test 7: Feature 6 - Proof-of-Prep Cryptographic Certificate & Ledger
console.log("\n[TEST 7] Feature 6: Proof-of-Prep Certificate & Cryptographic Anchor:");
assert.ok(res6.proofOfPrep, "Proof of Prep record must be present!");
assert.strictEqual(res6.proofOfPrep.cryptographicHashSha256.length, 64, "Must be valid 64-char hex SHA-256 hash!");
assert.ok(res6.inspectionTimeline.length >= 4, "Timeline must contain sequential event stream!");
console.log(`  ✓ SHA-256 Digest: ${res6.proofOfPrep.cryptographicHashSha256}`);
console.log(`  ✓ Timeline Events Logged: ${res6.inspectionTimeline.length}`);
passCount++;

// Test 8: Cryptographic Ledger Chain Integrity
console.log("\n[TEST 8] Immutable Provenance Ledger Integrity:");
const integrity = provenanceLedger.verifyChainIntegrity();
assert.strictEqual(integrity.valid, true, "Cryptographic ledger hash chain must be 100% valid!");
console.log(`  ✓ Chain Integrity Verified: ${integrity.totalBlocks} Blocks linked by SHA-256`);
passCount++;

console.log("\n=================================================");
console.log(`ALL TESTS PASSED SUCCESSFULLY (${passCount} assertions)!`);
console.log("=================================================");
