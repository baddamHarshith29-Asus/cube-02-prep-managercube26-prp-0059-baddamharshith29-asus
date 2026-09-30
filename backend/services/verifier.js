// Unified Inbound Preparation Verification Entry Point
// Dispatches to Multi-Agent Orchestrator (Packaging, Label, Barcode, Spatial, Rule & Critic Agents)
// with First-Class Intelligent Re-Inspection, Work Order Comparison, and Proof-of-Prep Cryptography.

import { executeDirectorInspection } from "./multiAgentOrchestrator.js";

export function verifyPreparation(inputData) {
  const {
    scenarioId = "scenario-1",
    workOrder,
    visualEntities,
    customOverrides = {},
    activeAngles = ["FRONT"],
    activeStandard = "amazon-fba-2026",
    qaConfig = {},
    existingTimeline = null
  } = inputData;

  const targetEntities = { ...(visualEntities || {}), ...(customOverrides || {}) };

  return executeDirectorInspection({
    scenarioId,
    workOrder,
    visualEntities: targetEntities,
    activeAngles,
    activeStandard,
    qaConfig,
    existingTimeline
  });
}
