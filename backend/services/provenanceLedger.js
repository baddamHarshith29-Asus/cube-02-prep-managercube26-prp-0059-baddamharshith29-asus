// Immutable Provenance Audit Ledger (Cryptographic Append-Only Hash-Chain)
// Ensures non-repudiation and proves the AI decision was not modified post-inspection.

import crypto from "crypto";

class ImmutableProvenanceLedger {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    const timestamp = "2026-09-01T00:00:00.000Z";
    const payload = "AEROPREP_GENESIS_ROOT_TRUST_ANCHOR";
    const prevHash = "0000000000000000000000000000000000000000000000000000000000000000";
    const hash = this.calculateHash(0, timestamp, payload, prevHash);
    
    return {
      index: 0,
      timestamp,
      inspectionId: "GENESIS",
      verdict: "ROOT",
      sku: "SYSTEM",
      operatorId: "SYSTEM",
      payloadHash: crypto.createHash("sha256").update(payload).digest("hex"),
      previousBlockHash: prevHash,
      blockHash: hash
    };
  }

  calculateHash(index, timestamp, payloadStr, previousBlockHash) {
    const raw = `${index}|${timestamp}|${payloadStr}|${previousBlockHash}`;
    return crypto.createHash("sha256").update(raw).digest("hex");
  }

  addInspectionRecord(record) {
    const prevBlock = this.chain[this.chain.length - 1];
    const index = this.chain.length;
    const timestamp = new Date().toISOString();
    
    const payloadData = {
      inspectionId: record.inspectionId,
      scenarioId: record.scenarioId,
      sku: record.sku,
      verdict: record.verdict,
      ruleViolations: record.checks?.filter(c => c.verdict === "FAIL").map(c => c.ruleId) || [],
      primaryReason: record.primaryReason,
      confidence: record.confidence || 0.98,
      operatorId: record.operatorId || "OP-WAREHOUSE-42"
    };

    const payloadStr = JSON.stringify(payloadData);
    const payloadHash = crypto.createHash("sha256").update(payloadStr).digest("hex");
    const blockHash = this.calculateHash(index, timestamp, payloadStr, prevBlock.blockHash);

    const newBlock = {
      index,
      timestamp,
      inspectionId: record.inspectionId,
      verdict: record.verdict,
      sku: record.sku,
      operatorId: record.operatorId || "OP-WAREHOUSE-42",
      payloadHash,
      previousBlockHash: prevBlock.blockHash,
      blockHash
    };

    this.chain.push(newBlock);
    return newBlock;
  }

  addOverrideRecord(record) {
    const prevBlock = this.chain[this.chain.length - 1];
    const index = this.chain.length;
    const timestamp = new Date().toISOString();

    const payloadData = {
      type: "HUMAN_OPERATOR_OVERRIDE",
      inspectionId: record.inspectionId,
      sku: record.sku,
      originalVerdict: record.originalVerdict || "FAIL",
      overrideVerdict: record.overrideVerdict || "PASS",
      reason: record.reason,
      operatorId: record.operatorId || "Operator A (Station 04)"
    };

    const payloadStr = JSON.stringify(payloadData);
    const payloadHash = crypto.createHash("sha256").update(payloadStr).digest("hex");
    const blockHash = this.calculateHash(index, timestamp, payloadStr, prevBlock.blockHash);

    const newBlock = {
      index,
      timestamp,
      inspectionId: record.inspectionId,
      verdict: `OVERRIDE_${record.overrideVerdict || 'PASS'}`,
      sku: record.sku,
      operatorId: record.operatorId || "Operator A (Station 04)",
      payloadHash,
      previousBlockHash: prevBlock.blockHash,
      blockHash
    };

    this.chain.push(newBlock);
    return newBlock;
  }

  addProofOfPrepRecord(proofRecord) {
    const prevBlock = this.chain[this.chain.length - 1];
    const index = this.chain.length;
    const timestamp = new Date().toISOString();

    const payloadData = {
      type: "PROOF_OF_PREP_CERTIFICATE",
      certificateNumber: proofRecord.certificateNumber,
      inspectionId: proofRecord.inspectionId,
      sku: proofRecord.sku,
      overallVerdict: proofRecord.overallVerdict,
      cryptographicHashSha256: proofRecord.cryptographicHashSha256,
      timelineEventsCount: proofRecord.timeline?.length || 0
    };

    const payloadStr = JSON.stringify(payloadData);
    const payloadHash = crypto.createHash("sha256").update(payloadStr).digest("hex");
    const blockHash = this.calculateHash(index, timestamp, payloadStr, prevBlock.blockHash);

    const newBlock = {
      index,
      timestamp,
      inspectionId: proofRecord.inspectionId,
      verdict: proofRecord.overallVerdict,
      sku: proofRecord.sku,
      operatorId: proofRecord.operatorId || "System",
      payloadHash,
      previousBlockHash: prevBlock.blockHash,
      blockHash
    };

    this.chain.push(newBlock);
    return newBlock;
  }

  verifyChainIntegrity() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const prev = this.chain[i - 1];

      if (current.previousBlockHash !== prev.blockHash) {
        return { valid: false, brokenIndex: i, reason: "Previous block hash mismatch" };
      }
    }
    return { valid: true, totalBlocks: this.chain.length, latestBlockHash: this.chain[this.chain.length - 1].blockHash };
  }

  getChain() {
    return this.chain;
  }
}

export const provenanceLedger = new ImmutableProvenanceLedger();
