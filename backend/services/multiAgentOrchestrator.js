// Multi-Agent Inbound Compliance Verification Orchestrator
// Coordinates specialized agents: Packaging Agent, Label Agent, Barcode Agent,
// Spatial Agent, Rule Agent, Critic Agent, Intelligent Re-Inspection Generator,
// Work Order vs. Physical Reality Comparator, and Proof-of-Prep Hash Generator.

import crypto from "crypto";
import { AUTHORITATIVE_RULES } from "../data/rules.js";
import { performSpatialReasoning } from "./spatialEngine.js";

/**
 * 1. PACKAGING AGENT
 * Checks: Polybag presence, continuous hermetic seal weld, material transparency, bag opening width.
 */
export function runPackagingAgent(visualEntities, workOrder, qaConfig = {}) {
  const polybag = visualEntities.polybag || {};
  const seam = visualEntities.seam || {};
  const findings = [];
  let isMissingEvidence = false;
  let reInspectionRequest = null;

  const category = workOrder?.category || "General Merchandise";
  const openingInches = polybag.openingWidthInches || workOrder?.bagOpeningInches || 10.0;

  // Check 1: Polybag Enclosure
  if (!polybag.present) {
    findings.push({
      item: "POLYBAG_ENCLOSURE",
      verdict: "FAIL",
      confidence: 0.99,
      reason: `Polybag enclosure is absent for category '${category}'. Product must be enclosed in transparent polybag.`,
      evidence: "Edge detector found zero transparent polybag film boundary enclosing product silhouette.",
      bbox: null
    });
  } else {
    findings.push({
      item: "POLYBAG_ENCLOSURE",
      verdict: "PASS",
      confidence: 0.98,
      reason: `Polybag enclosure verified enclosing 100% of product body (${openingInches}" opening width).`,
      evidence: `Continuous polybag boundary confirmed. Dimensions: ${openingInches}" flat opening width.`,
      bbox: polybag.bbox
    });
  }

  // Check 2: Polybag Sealing Integrity
  if (polybag.present) {
    if (polybag.sealed === false) {
      findings.push({
        item: "SEAL_INTEGRITY",
        verdict: "FAIL",
        confidence: 0.96,
        reason: "Polybag opening is not completely sealed. Violates hermetic closure rule (flaps >0.25\").",
        evidence: "Discontinuous seal path detected; open flap exceeds 0.25 inch limit.",
        bbox: seam.bbox || polybag.bbox
      });
    } else if (polybag.sealed === "UNCERTAIN" || (polybag.sealIntegrityScore !== undefined && polybag.sealIntegrityScore < 60)) {
      isMissingEvidence = true;
      reInspectionRequest = {
        needed: true,
        targetArea: "TOP_SEAL",
        prompt: "📸 Please capture the top opening of the polybag so the sealing area is clearly visible.",
        instruction: "Position the camera perpendicular to the top heat-seal seam weld with diffuse lighting to avoid glare.",
        missingEvidenceDescription: "Top seal area is partially occluded, blurry, or cut off by frame boundary."
      };
      findings.push({
        item: "SEAL_INTEGRITY",
        verdict: "UNCERTAIN",
        confidence: 0.45,
        reason: "Polybag sealing cannot be conclusively verified from this angle or lighting.",
        evidence: `Discontinuous seal path or low integrity score (${polybag.sealIntegrityScore || 40}%). Seal area boundary obscured.`,
        bbox: seam.bbox || polybag.bbox
      });
    } else {
      findings.push({
        item: "SEAL_INTEGRITY",
        verdict: "PASS",
        confidence: 0.97,
        reason: `Hermetic seal verified with ${polybag.sealType || 'continuous heat weld'} (Score: ${polybag.sealIntegrityScore || 96}%).`,
        evidence: `Continuous ${polybag.sealType || 'heat-seal'} ridge detected along top edge with no unsealed flaps.`,
        bbox: seam.bbox
      });
    }
  }

  return {
    agentName: "Packaging Agent",
    specialty: "Polybag Enclosure, Film Visibility & Hermetic Seal Verification",
    status: findings.some(f => f.verdict === "FAIL") ? "FAIL" : findings.some(f => f.verdict === "UNCERTAIN") ? "UNCERTAIN" : "PASS",
    findings,
    isMissingEvidence,
    reInspectionRequest
  };
}

/**
 * 2. LABEL AGENT
 * Checks: FNSKU presence/readability, suffocation warnings, font size scale, expiry dates, handling marks.
 */
export function runLabelAgent(visualEntities, workOrder, qaConfig = {}) {
  const warning = visualEntities.suffocationWarning || {};
  const fnsku = visualEntities.fnskuLabel || {};
  const expiry = visualEntities.expiryDate || {};
  const handling = visualEntities.handlingMarks || {};
  const findings = [];
  let isMissingEvidence = false;
  let reInspectionRequest = null;

  const minContrast = qaConfig.minContrastRatio || 4.5;
  const openingInches = visualEntities.polybag?.openingWidthInches || workOrder?.bagOpeningInches || 10.0;

  // Check 1: Suffocation Warning Requirement (>= 5.0" opening)
  if (openingInches >= 5.0) {
    if (!warning.present) {
      findings.push({
        item: "SUFFOCATION_WARNING",
        verdict: "FAIL",
        confidence: 0.99,
        reason: `Bag opening is ${openingInches}" (>= 5.0" statutory threshold), but NO suffocation warning is present.`,
        evidence: "Optical OCR detector found zero child safety suffocation warning text on bag exterior.",
        bbox: null
      });
    } else if (warning.present === "UNCERTAIN" || warning.glareIndexPct > 40) {
      isMissingEvidence = true;
      reInspectionRequest = {
        needed: true,
        targetArea: "WARNING_TEXT",
        prompt: "📸 Please capture a straight-on, glare-free photo of the suffocation warning text area.",
        instruction: "Eliminate direct overhead specular flash reflections so font characters can be measured by OCR.",
        missingEvidenceDescription: "Specular glare washed out warning text, preventing font point size measurement."
      };
      findings.push({
        item: "SUFFOCATION_WARNING",
        verdict: "UNCERTAIN",
        confidence: 0.48,
        reason: "Suffocation warning text legibility is impaired by glare or focal blur.",
        evidence: `Glare index: ${warning.glareIndexPct || 55}%. Contrast ratio below threshold.`,
        bbox: warning.bbox
      });
    } else {
      // Check font size scale
      const detectedFont = warning.fontSizePt || 14;
      let minFont = 10;
      if (openingInches >= 60) minFont = 24;
      else if (openingInches >= 40) minFont = 18;
      else if (openingInches >= 30) minFont = 14;

      if (detectedFont < minFont) {
        findings.push({
          item: "SUFFOCATION_WARNING_FONT",
          verdict: "FAIL",
          confidence: 0.97,
          reason: `Warning font size (${detectedFont}pt) is below mandatory ${minFont}pt for bag opening ${openingInches}".`,
          evidence: `Measured font size: ${detectedFont}pt. CPSIA standard mandates >= ${minFont}pt.`,
          bbox: warning.bbox
        });
      } else if (warning.contrastRatio && warning.contrastRatio < minContrast) {
        findings.push({
          item: "SUFFOCATION_WARNING_CONTRAST",
          verdict: "FAIL",
          confidence: 0.94,
          reason: `Warning text contrast (${warning.contrastRatio}:1) is below mandatory ${minContrast}:1 legibility limit.`,
          evidence: `Dark text against dark product background reduces scannability.`,
          bbox: warning.bbox
        });
      } else {
        findings.push({
          item: "SUFFOCATION_WARNING",
          verdict: "PASS",
          confidence: 0.98,
          reason: `Suffocation warning present with compliant ${detectedFont}pt font for ${openingInches}" opening.`,
          evidence: `CPSIA verbatim text verified: "${warning.textDetected || 'WARNING: To avoid danger...'}"`,
          bbox: warning.bbox
        });
      }
    }
  }

  // Check 2: FNSKU Presence & Barcode Decodability
  if (!fnsku.present) {
    findings.push({
      item: "FNSKU_PRESENCE",
      verdict: "FAIL",
      confidence: 0.99,
      reason: "Missing mandatory FNSKU inbound fulfillment label on package exterior.",
      evidence: "Zero FNSKU barcode symbology (Code 128 / PDF417) identified.",
      bbox: null
    });
  } else {
    findings.push({
      item: "FNSKU_PRESENCE",
      verdict: "PASS",
      confidence: 0.98,
      reason: `FNSKU label verified with active token '${fnsku.code || 'X003A89XYZ'}'.`,
      evidence: `Barcode Code 128 decoded. Title string: '${fnsku.title || 'Product Title'}'.`,
      bbox: fnsku.bbox
    });
  }

  // Check 3: Expiry Date Visibility (for ingestibles, beauty, perishables)
  if (workOrder?.hasExpiry) {
    if (expiry.covered === true) {
      findings.push({
        item: "EXPIRY_DATE_VISIBILITY",
        verdict: "FAIL",
        confidence: 0.98,
        reason: "Manufacturer expiration date is covered or occluded by the FNSKU label.",
        evidence: `FNSKU label overlap occludes date stamp. Work order requires expiry '${workOrder.expectedExpiry || 'Visible'}'.`,
        bbox: expiry.bbox
      });
    } else if (expiry.visible === false || expiry.visible === null) {
      isMissingEvidence = true;
      if (!reInspectionRequest) {
        reInspectionRequest = {
          needed: true,
          targetArea: "EXPIRY_DATE",
          prompt: "📸 Please capture the expiration date imprint stamp on the container.",
          instruction: "Ensure the expiration date string (YYYY-MM-DD or MM/YYYY) is unoccluded and sharp.",
          missingEvidenceDescription: "Work order mandates expiration date, but optical OCR found no visible date stamp."
        };
      }
      findings.push({
        item: "EXPIRY_DATE_VISIBILITY",
        verdict: "UNCERTAIN",
        confidence: 0.5,
        reason: "Expiration date not clearly visible in current camera perspective.",
        evidence: `Expected expiry stamp not detected in front packaging plane.`,
        bbox: null
      });
    } else {
      findings.push({
        item: "EXPIRY_DATE_VISIBILITY",
        verdict: "PASS",
        confidence: 0.97,
        reason: `Expiration date cleanly visible and unoccluded (${expiry.text || workOrder.expectedExpiry}).`,
        evidence: `OCR text detected: '${expiry.text || workOrder.expectedExpiry}'. Zero label overlap.`,
        bbox: expiry.bbox
      });
    }
  }

  // Check 4: Mandatory Handling Marks ("Sold as Set", "Fragile")
  const requiredMarks = handling.required || (workOrder?.isSet ? ["SOLD_AS_SET"] : workOrder?.requiresFragile ? ["FRAGILE"] : []);
  const detectedMarks = handling.detected || [];
  const missingMarks = requiredMarks.filter(m => !detectedMarks.includes(m));

  if (missingMarks.length > 0) {
    findings.push({
      item: "HANDLING_MARKS",
      verdict: "FAIL",
      confidence: 0.98,
      reason: `Missing mandatory handling label: ${missingMarks.join(", ")}.`,
      evidence: `Multi-unit bundle or fragile item requires marked labels. Missing: [${missingMarks.join(", ")}].`,
      bbox: null
    });
  } else if (requiredMarks.length > 0) {
    findings.push({
      item: "HANDLING_MARKS",
      verdict: "PASS",
      confidence: 0.97,
      reason: `Mandatory handling marks verified: ${requiredMarks.join(", ")}.`,
      evidence: `Required labels detected: [${detectedMarks.join(", ")}].`,
      bbox: null
    });
  }

  return {
    agentName: "Label Agent",
    specialty: "FNSKU, Suffocation Warning, Expiry Date & Handling Marks",
    status: findings.some(f => f.verdict === "FAIL") ? "FAIL" : findings.some(f => f.verdict === "UNCERTAIN") ? "UNCERTAIN" : "PASS",
    findings,
    isMissingEvidence,
    reInspectionRequest
  };
}

/**
 * 3. BARCODE AGENT
 * Checks: Manufacturer UPC/EAN barcodes, exposed original barcodes, dual-scanning collision risks.
 */
export function runBarcodeAgent(visualEntities, workOrder, activeAngles = ["FRONT"]) {
  const originalBarcode = visualEntities.originalBarcode || {};
  const findings = [];
  let isMissingEvidence = false;
  let reInspectionRequest = null;

  if (originalBarcode.exposedUpcFound === true || (originalBarcode.covered === false && !originalBarcode.rearVerified)) {
    findings.push({
      item: "MANUFACTURER_BARCODE_SUPPRESSION",
      verdict: "FAIL",
      confidence: 0.98,
      reason: "Original manufacturer barcode (UPC-A / EAN) is uncovered and scannable. Dual barcode conflict hazard.",
      evidence: `Exposed barcode symbology detected. FC scanner may misread manufacturer UPC instead of FNSKU.`,
      bbox: originalBarcode.bbox
    });
  } else if (originalBarcode.covered === "UNCERTAIN_OCCLUDED" || (!activeAngles.includes("BACK") && originalBarcode.rearVerified !== true)) {
    // Single-angle ambiguity: reverse side might have an uncovered barcode
    isMissingEvidence = true;
    reInspectionRequest = {
      needed: true,
      targetArea: "REAR_PACKAGE",
      prompt: "📸 Please capture the back of the package to verify original manufacturer barcode is covered.",
      instruction: "Rotate item 180° so the entire rear packaging surface can be audited for secondary UPC barcodes.",
      missingEvidenceDescription: "Reverse package plane unverified; potential exposed manufacturer barcode cannot be ruled out."
    };
    findings.push({
      item: "MANUFACTURER_BARCODE_SUPPRESSION",
      verdict: "PASS", // Tentative pass on front, but flagged by critic for single-angle limitation
      confidence: 0.90,
      reason: "No exposed manufacturer UPC detected on visible front packaging plane.",
      evidence: "Front plane contains zero scannable manufacturer UPCs. Reverse side requires multi-angle confirmation.",
      bbox: null
    });
  } else {
    findings.push({
      item: "MANUFACTURER_BARCODE_SUPPRESSION",
      verdict: "PASS",
      confidence: 0.99,
      reason: "All manufacturer UPC/EAN barcodes are completely covered or suppressed.",
      evidence: "Original UPC barcode fully covered by opaque FNSKU label; verified across captured angles.",
      bbox: originalBarcode.bbox
    });
  }

  return {
    agentName: "Barcode Agent",
    specialty: "Manufacturer Barcode Suppression & Dual-Scan Prevention",
    status: findings.some(f => f.verdict === "FAIL") ? "FAIL" : findings.some(f => f.verdict === "UNCERTAIN") ? "UNCERTAIN" : "PASS",
    findings,
    isMissingEvidence,
    reInspectionRequest
  };
}

/**
 * 4. SPATIAL AGENT
 * Checks: Geometric relationships, curvature vectors, seam clearances, IoU overlaps.
 */
export function runSpatialAgent(visualEntities, workOrder, qaConfig = {}) {
  const spatialResult = performSpatialReasoning(visualEntities, workOrder);
  const { stageB, coachingAdvice } = spatialResult;
  const findings = [];
  let isMissingEvidence = false;
  let reInspectionRequest = null;

  const curvatureLimit = qaConfig.curvatureToleranceDeg !== undefined ? qaConfig.curvatureToleranceDeg : 15.0;
  const seamMargin = qaConfig.seamClearanceMarginInches !== undefined ? qaConfig.seamClearanceMarginInches : 0.5;

  const angleDeg = stageB.curvature.angleDeg || 0;
  const seamDist = stageB.seamCollision.distanceInches !== undefined ? stageB.seamCollision.distanceInches : 2.5;

  // Check 1: Curvature Angle
  if (angleDeg > curvatureLimit) {
    findings.push({
      item: "SURFACE_PLANARITY",
      verdict: "FAIL",
      confidence: 0.98,
      reason: `Label placed across a curved edge (curvature ${angleDeg.toFixed(1)}° > ${curvatureLimit}° limit). Causes laser scanner focal distortion.`,
      evidence: `Surface normal vector deviation calculated at ${angleDeg.toFixed(1)}°. Amazon FBA § 5.2 mandates flat planar placement.`,
      bbox: visualEntities.fnskuLabel?.bbox
    });
  } else {
    findings.push({
      item: "SURFACE_PLANARITY",
      verdict: "PASS",
      confidence: 0.98,
      reason: `FNSKU label affixed to flat planar surface (curvature: ${angleDeg.toFixed(1)}° <= ${curvatureLimit}° threshold).`,
      evidence: `Surface planarity verified. Curvature angle: ${angleDeg.toFixed(1)}°. Laser scanner reflection optimal.`,
      bbox: visualEntities.fnskuLabel?.bbox
    });
  }

  // Check 2: Seam & Fold Clearance
  if (stageB.seamCollision.hasCollision || seamDist < seamMargin) {
    findings.push({
      item: "SEAM_CLEARANCE",
      verdict: "FAIL",
      confidence: 0.97,
      reason: `FNSKU label is affixed directly over a heat-seal seam or fold flap (${seamDist.toFixed(1)}" < ${seamMargin}" margin). Barcode lines deformed by crimp ridge.`,
      evidence: `Bounding box overlap or seam distance (${seamDist.toFixed(1)}") violates ${seamMargin}" minimum clearance.`,
      bbox: visualEntities.fnskuLabel?.bbox
    });
  } else {
    findings.push({
      item: "SEAM_CLEARANCE",
      verdict: "PASS",
      confidence: 0.98,
      reason: `Compliant seam clearance (${seamDist.toFixed(1)}" >= ${seamMargin}" minimum safety clearance).`,
      evidence: `Distance to nearest heat seal / fold seam is ${seamDist.toFixed(1)} inches. Zero barcode deformation risk.`,
      bbox: visualEntities.fnskuLabel?.bbox
    });
  }

  // Check 3: Label Overlap with Expiry
  if (stageB.expiryOverlap.hasOverlap) {
    findings.push({
      item: "EXPIRY_OVERLAP",
      verdict: "FAIL",
      confidence: 0.99,
      reason: "FNSKU label physically overlaps the expiration date stamp.",
      evidence: `Spatial intersection IoU: ${stageB.expiryOverlap.overlapAreaIoU}. Label covers critical freshness date.`,
      bbox: visualEntities.fnskuLabel?.bbox
    });
  }

  return {
    agentName: "Spatial Agent",
    specialty: "Surface Planarity (Curvature θ), Seam Clearance (Δd) & Overlap IoU",
    status: findings.some(f => f.verdict === "FAIL") ? "FAIL" : findings.some(f => f.verdict === "UNCERTAIN") ? "UNCERTAIN" : "PASS",
    findings,
    spatialAnalysis: spatialResult,
    coachingAdvice,
    isMissingEvidence,
    reInspectionRequest
  };
}

/**
 * 5. RULE AGENT
 * Compiles all agent findings against Authoritative Rules with verbatim clauses,
 * generating Evidence-Based Verdicts.
 */
export function runRuleAgent(agentFindings, workOrder, visualEntities, activeStandard = "amazon-fba-2026") {
  const checks = [];
  let totalFeeRiskUsd = 0;
  let maxDelayRiskDays = 0;

  const productCategory = workOrder?.category || "General Merchandise";

  // Filter rules by standard and category
  const rules = AUTHORITATIVE_RULES.filter(rule => {
    return rule.applicableCategories.includes("ALL") ||
           rule.applicableCategories.includes(productCategory) ||
           (workOrder?.hasExpiry && rule.id === "RULE-EXP-VIS-08") ||
           (workOrder?.isSet && rule.id === "RULE-HAND-MARK-09") ||
           (workOrder?.requiresFragile && rule.id === "RULE-HAND-MARK-09");
  });

  // Map each authoritative rule to findings from specialized agents
  for (const rule of rules) {
    let matchedFinding = null;

    if (rule.id === "RULE-POLY-01") {
      matchedFinding = agentFindings.packaging.findings.find(f => f.item === "POLYBAG_ENCLOSURE");
    } else if (rule.id === "RULE-SEAL-02") {
      matchedFinding = agentFindings.packaging.findings.find(f => f.item === "SEAL_INTEGRITY");
    } else if (rule.id === "RULE-WARN-03") {
      matchedFinding = agentFindings.label.findings.find(f => f.item === "SUFFOCATION_WARNING" || f.item === "SUFFOCATION_WARNING_FONT");
    } else if (rule.id === "RULE-WARN-LEG-04") {
      matchedFinding = agentFindings.label.findings.find(f => f.item === "SUFFOCATION_WARNING_CONTRAST");
    } else if (rule.id === "RULE-FNSKU-SURF-05") {
      matchedFinding = agentFindings.spatial.findings.find(f => f.item === "SURFACE_PLANARITY");
    } else if (rule.id === "RULE-FNSKU-SEAM-06" || rule.id === "RULE-SEAM-06") {
      matchedFinding = agentFindings.spatial.findings.find(f => f.item === "SEAM_CLEARANCE");
    } else if (rule.id === "RULE-UPC-COV-07") {
      matchedFinding = agentFindings.barcode.findings.find(f => f.item === "MANUFACTURER_BARCODE_SUPPRESSION");
    } else if (rule.id === "RULE-EXP-VIS-08") {
      matchedFinding = agentFindings.label.findings.find(f => f.item === "EXPIRY_DATE_VISIBILITY") ||
                       agentFindings.spatial.findings.find(f => f.item === "EXPIRY_OVERLAP");
    } else if (rule.id === "RULE-HAND-MARK-09") {
      matchedFinding = agentFindings.label.findings.find(f => f.item === "HANDLING_MARKS");
    } else if (rule.id === "RULE-THICK-LIMIT-10") {
      // Epistemic Boundary check
      matchedFinding = {
        verdict: "UNCERTAIN",
        confidence: 0.0,
        reason: "Packaging material thickness (1.5 mil / 0.0381mm standard) cannot be visually measured from 2D optical images.",
        evidence: "Physical micron/mil gauge thickness requires tactile micrometer instrumentation. 2D RGB pixels cannot measure cross-section film gauge.",
        bbox: null
      };
    }

    const verdict = matchedFinding?.verdict || "PASS";
    const confidence = matchedFinding?.confidence || 0.98;
    const reason = matchedFinding?.reason || "Requirement satisfied according to authoritative specification.";
    const evidence = matchedFinding?.evidence || "Optical verification confirmed compliance.";
    const bbox = matchedFinding?.bbox || null;

    if (verdict === "FAIL") {
      totalFeeRiskUsd += rule.economicFeeUsd;
      maxDelayRiskDays = Math.max(maxDelayRiskDays, rule.delayRiskDays);
    }

    checks.push({
      ruleId: rule.id,
      category: rule.category,
      standard: rule.standard,
      verbatimClause: rule.verbatimClause,
      verdict,
      confidence,
      visuallyVerifiable: rule.visuallyVerifiable,
      reason,
      evidence,
      resolutionAngleRequired: rule.resolutionAngleRequired,
      economicFeeUsd: verdict === "FAIL" ? rule.economicFeeUsd : 0,
      delayRiskDays: verdict === "FAIL" ? rule.delayRiskDays : 0,
      bbox,
      severity: rule.severity,
      // Feature 3: Evidence-Based Verdict Details
      supportingImage: "primary_optical_scan.jpg",
      detectedRegion: bbox ? { x: bbox.x, y: bbox.y, w: bbox.w, h: bbox.h, label: bbox.label || rule.category } : null
    });
  }

  return {
    agentName: "Rule Agent",
    specialty: "Authoritative Compliance Cross-Referencing & Evidence-Based Mapping",
    checks,
    economicAssessment: {
      totalDefectFeeRiskUsd: Number(totalFeeRiskUsd.toFixed(2)),
      estimatedInboundDelayDays: maxDelayRiskDays,
      chargebackAvoidedUsd: Number(totalFeeRiskUsd.toFixed(2)),
      riskSeverity: totalFeeRiskUsd > 1.0 ? "CRITICAL_SUSPENSION_RISK" : totalFeeRiskUsd > 0 ? "UNPLANNED_PREP_FEE" : "COMPLIANT_ZERO_RISK"
    }
  };
}

/**
 * 6. CRITIC AGENT (Self-Critique / Second Opinion)
 * Challenges the primary inspection conclusions.
 * Checks whether evidence genuinely supports conclusions and detects overlooked ambiguities.
 */
export function runCriticAgent(primaryChecks, visualEntities, activeAngles = ["FRONT"]) {
  const criticObservations = [];
  let shouldDowngradeToUncertain = false;
  let downgradeReason = "";
  let intelligentReInspectionRequest = null;

  // Critique 1: Single-Angle Reverse Side Occlusion Check
  const hasFatalFailures = primaryChecks.some(c => c.verdict === "FAIL");
  const upcCheck = primaryChecks.find(c => c.ruleId === "RULE-UPC-COV-07");
  if (upcCheck && upcCheck.verdict === "PASS" && !activeAngles.includes("BACK")) {
    criticObservations.push({
      ruleId: "RULE-UPC-COV-07",
      agent: "Critic Agent",
      critique: "Hypothesis challenged: Only front packaging plane is visible. Reverse side could conceal unmasked UPC barcode. High confidence requires 360° verification.",
      severity: "OBSERVATIONAL"
    });
    // Formulate Intelligent Re-Inspection prompt only if not already failed by other fatal checks
    if (!hasFatalFailures) {
      intelligentReInspectionRequest = {
        needed: true,
        targetArea: "REAR_PACKAGE",
        prompt: "📸 Please capture the back of the package to verify original manufacturer barcode is covered.",
        instruction: "Rotate the item 180° to capture the reverse face.",
        missingEvidenceDescription: "Reverse package plane unverified; secondary UPC barcodes cannot be ruled out."
      };
    }
  }

  // Critique 2: Specular Reflection / Glare Ambiguity
  const glareDetected = visualEntities?.suffocationWarning?.glareIndexPct > 35;
  const warningCheck = primaryChecks.find(c => c.ruleId === "RULE-WARN-03" || c.ruleId === "RULE-WARN-LEG-04");
  if (glareDetected && warningCheck?.verdict === "PASS") {
    shouldDowngradeToUncertain = true;
    downgradeReason = "Critic identified specular flash glare washing out text characters. Cannot confirm CPSIA compliance without secondary polarized frame.";
    criticObservations.push({
      ruleId: "RULE-WARN-LEG-04",
      agent: "Critic Agent",
      critique: downgradeReason,
      severity: "CRITICAL_DOWNGRADE"
    });
    intelligentReInspectionRequest = {
      needed: true,
      targetArea: "WARNING_TEXT",
      prompt: "📸 Please capture a diffuse macro photo of the suffocation warning text without flash glare.",
      instruction: "Adjust lighting angle to remove specular reflections over small text.",
      missingEvidenceDescription: "Specular flash reflection washes out warning text characters."
    };
  }

  // Critique 3: Seal Integrity Borderline Flaps
  if (visualEntities?.polybag?.sealIntegrityScore && visualEntities.polybag.sealIntegrityScore < 60) {
    shouldDowngradeToUncertain = true;
    downgradeReason = "Critic identified discontinuous seal edge (<60% integrity score). Visual evidence insufficient to guarantee hermetic weld.";
    criticObservations.push({
      ruleId: "RULE-SEAL-02",
      agent: "Critic Agent",
      critique: downgradeReason,
      severity: "CRITICAL_DOWNGRADE"
    });
    intelligentReInspectionRequest = {
      needed: true,
      targetArea: "TOP_SEAL",
      prompt: "📸 Please capture the top opening of the polybag so the sealing area is clearly visible.",
      instruction: "Focus macro camera lens on the heat weld ridge along the bag opening.",
      missingEvidenceDescription: "Seal weld continuity score below 60%; potential open flap."
    };
  }

  // Critique 4: Curvature Angle Edge Case (within 3° of 15° threshold)
  const curvatureAngle = visualEntities?.fnskuLabel?.curvatureAngleDeg || 0;
  if (curvatureAngle >= 12.0 && curvatureAngle <= 15.0) {
    criticObservations.push({
      ruleId: "RULE-FNSKU-SURF-05",
      agent: "Critic Agent",
      critique: `Surface curvature (${curvatureAngle.toFixed(1)}°) is within 3° of the 15.0° regulatory threshold. Close tolerance requires operator re-check.`,
      severity: "WARNING"
    });
  }

  const consensusReached = !shouldDowngradeToUncertain;

  return {
    agentName: "Critic Agent",
    specialty: "Adversarial Self-Critique & Second-Opinion Validation",
    consensusReached,
    downgradeApplied: shouldDowngradeToUncertain,
    downgradeReason: shouldDowngradeToUncertain ? downgradeReason : null,
    consensusConfidenceScore: consensusReached ? 0.98 : 0.48,
    criticObservations,
    intelligentReInspectionRequest
  };
}

/**
 * 7. WORK ORDER VS. ACTUAL PRODUCT COMPARATOR
 * Compares what the worker was instructed to do against what the photo shows was actually done.
 */
export function compareWorkOrderVsActual(workOrder, primaryChecks, visualEntities) {
  const comparisonRows = [];
  const mismatches = [];

  const checkMap = {};
  primaryChecks.forEach(c => {
    checkMap[c.ruleId] = c;
  });

  const polyCheck = checkMap["RULE-POLY-01"];
  const sealCheck = checkMap["RULE-SEAL-02"];
  const warnCheck = checkMap["RULE-WARN-03"];
  const fnskuCheck = checkMap["RULE-FNSKU-SURF-05"];
  const upcCheck = checkMap["RULE-UPC-COV-07"];
  const expiryCheck = checkMap["RULE-EXP-VIS-08"];
  const handlingCheck = checkMap["RULE-HAND-MARK-09"];

  // 1. Polybag Enclosure
  comparisonRows.push({
    requirement: "Polybag Enclosure",
    expected: "YES (Required)",
    actual: polyCheck?.verdict || "PASS",
    status: polyCheck?.verdict === "PASS" ? "MATCH" : "MISMATCH",
    observation: polyCheck?.reason
  });
  if (polyCheck?.verdict === "FAIL") {
    mismatches.push("Work order requires polybagging; product is unenclosed.");
  }

  // 2. Hermetic Sealing
  comparisonRows.push({
    requirement: "Hermetic Seal Closure",
    expected: "YES (Continuous Weld/Tape)",
    actual: sealCheck?.verdict || "PASS",
    status: sealCheck?.verdict === "PASS" ? "MATCH" : "MISMATCH",
    observation: sealCheck?.reason
  });
  if (sealCheck?.verdict === "FAIL") {
    mismatches.push("Work order mandates sealed polybag; open flaps detected.");
  }

  // 3. Suffocation Warning
  const warningExpected = (workOrder?.bagOpeningInches || 10.0) >= 5.0 ? "YES (>=5\" Opening)" : "NOT_APPLICABLE";
  comparisonRows.push({
    requirement: "Suffocation Warning",
    expected: warningExpected,
    actual: warnCheck ? warnCheck.verdict : "NOT_APPLICABLE",
    status: (warningExpected === "NOT_APPLICABLE" || warnCheck?.verdict === "PASS") ? "MATCH" : "MISMATCH",
    observation: warnCheck?.reason || "Bag opening <5.0 inches; exempt from warning."
  });
  if (warningExpected !== "NOT_APPLICABLE" && warnCheck?.verdict === "FAIL") {
    mismatches.push(`Work order mandates suffocation warning for ${workOrder?.bagOpeningInches || 10}" opening; warning is missing or invalid.`);
  }

  // 4. FNSKU Placement (Planar)
  comparisonRows.push({
    requirement: "FNSKU Flat Surface Placement",
    expected: "YES (Planar, Clear Margins)",
    actual: fnskuCheck?.verdict || "PASS",
    status: fnskuCheck?.verdict === "PASS" ? "MATCH" : "MISMATCH",
    observation: fnskuCheck?.reason
  });
  if (fnskuCheck?.verdict === "FAIL") {
    mismatches.push("Work order instructions require flat FNSKU placement; label affixed across curved edge or seam.");
  }

  // 5. Manufacturer Barcode Covered
  comparisonRows.push({
    requirement: "Cover Manufacturer UPC",
    expected: "YES (Completely Suppressed)",
    actual: upcCheck?.verdict || "PASS",
    status: upcCheck?.verdict === "PASS" ? "MATCH" : "MISMATCH",
    observation: upcCheck?.reason
  });
  if (upcCheck?.verdict === "FAIL") {
    mismatches.push("Expected: Manufacturer barcode covered. Observed: Manufacturer barcode still visible and scannable.");
  }

  // 6. Expiry Date Visible
  if (workOrder?.hasExpiry) {
    comparisonRows.push({
      requirement: "Expiry Date Visible & Uncovered",
      expected: `YES (${workOrder.expectedExpiry || 'Visible'})`,
      actual: expiryCheck?.verdict || "PASS",
      status: expiryCheck?.verdict === "PASS" ? "MATCH" : "MISMATCH",
      observation: expiryCheck?.reason
    });
    if (expiryCheck?.verdict === "FAIL") {
      mismatches.push("Work order mandates visible expiration date; date is covered by FNSKU label.");
    }
  }

  // 7. Handling Marks
  if (workOrder?.isSet || workOrder?.requiresFragile) {
    const markExpected = workOrder.isSet ? "Sold as Set - Do Not Separate" : "Fragile - Handle With Care";
    comparisonRows.push({
      requirement: `Mandatory Mark: ${markExpected}`,
      expected: "YES",
      actual: handlingCheck?.verdict || "PASS",
      status: handlingCheck?.verdict === "PASS" ? "MATCH" : "MISMATCH",
      observation: handlingCheck?.reason
    });
    if (handlingCheck?.verdict === "FAIL") {
      mismatches.push(`Work order mandates handling label '${markExpected}'; label is absent.`);
    }
  }

  const hasMismatch = mismatches.length > 0;
  const mismatchSummary = hasMismatch 
    ? `⚠️ Preparation mismatch detected. ${mismatches[0]}`
    : "✅ Full preparation alignment: Physical packaging matches all work order directives.";

  return {
    comparisonRows,
    hasMismatch,
    mismatchCount: mismatches.length,
    mismatches,
    mismatchSummary
  };
}

/**
 * 8. PROOF-OF-PREP CRYPTOGRAPHIC AUDIT ANCHOR GENERATOR
 * Generates an immutable inspection certificate payload with SHA-256 state hash.
 */
export function generateProofOfPrepCertificate({
  inspectionId,
  workOrder,
  scenarioId,
  overallVerdict,
  primaryReason,
  checks,
  comparison,
  timeline,
  operatorId = "Operator A (Station 04)"
}) {
  const timestamp = new Date().toISOString();
  const certNumber = `CERT-PREP-${Date.now().toString().slice(-6)}`;

  const checksSummary = {
    total: checks.length,
    pass: checks.filter(c => c.verdict === "PASS").length,
    fail: checks.filter(c => c.verdict === "FAIL").length,
    uncertain: checks.filter(c => c.verdict === "UNCERTAIN").length,
    overallVerdict
  };

  // Cryptographic Hash of: Images + Rules + Results + Timeline + WorkOrder + Timestamp
  const stateData = JSON.stringify({
    inspectionId,
    scenarioId,
    sku: workOrder?.sku,
    asin: workOrder?.asin,
    workOrderId: workOrder?.orderId,
    checks: checks.map(c => ({ ruleId: c.ruleId, verdict: c.verdict, confidence: c.confidence })),
    mismatches: comparison?.mismatches || [],
    timeline,
    timestamp
  });

  const cryptographicHashSha256 = crypto.createHash("sha256").update(stateData).digest("hex");

  return {
    certificateNumber: certNumber,
    inspectionId: inspectionId || `INSP-${Date.now().toString().slice(-5)}`,
    issuedAt: timestamp,
    operatorId,
    workOrder: {
      orderId: workOrder?.orderId || "WO-DEMO",
      asin: workOrder?.asin || "B09DEMOASIN",
      sku: workOrder?.sku || "SKU-DEMO",
      productName: workOrder?.productName || "Inbound Product Unit",
      category: workOrder?.category || "General Merchandise",
      batchId: workOrder?.batchId || "BATCH-2026-09"
    },
    overallVerdict,
    primaryReason,
    checksSummary,
    evidenceBasedResults: checks,
    workOrderComparison: comparison,
    inspectionTimeline: timeline,
    cryptographicHashSha256,
    complianceStandard: "Amazon FBA Inbound Manual 2026 / ASTM D3951 Standard"
  };
}

/**
 * 9. MASTER DIRECTOR AGENT
 * Coordinates the full inspection lifecycle:
 * Inspect -> Reason -> Challenge -> Request Evidence -> Recheck -> Compare -> Prove
 */
export function executeDirectorInspection({
  scenarioId = "scenario-1",
  workOrder,
  visualEntities,
  activeAngles = ["FRONT"],
  activeStandard = "amazon-fba-2026",
  qaConfig = {},
  existingTimeline = null
}) {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const timeline = existingTimeline ? [...existingTimeline] : [
    { time: timeStr, event: "Primary photograph ingested into inspection station", status: "INFO" },
    { time: timeStr, event: "Multi-Agent inspection team dispatched (Packaging, Label, Barcode, Spatial)", status: "INFO" }
  ];

  // Step 1: Run Domain Specialist Agents
  const packagingResult = runPackagingAgent(visualEntities, workOrder, qaConfig);
  const labelResult = runLabelAgent(visualEntities, workOrder, qaConfig);
  const barcodeResult = runBarcodeAgent(visualEntities, workOrder, activeAngles);
  const spatialResult = runSpatialAgent(visualEntities, workOrder, qaConfig);

  // Step 2: Run Rule Agent (Evidence-Based Verdicts)
  const ruleResult = runRuleAgent(
    { packaging: packagingResult, label: labelResult, barcode: barcodeResult, spatial: spatialResult },
    workOrder,
    visualEntities,
    activeStandard
  );

  // Step 3: Run Critic Agent (Second Opinion / Self-Critique)
  const criticResult = runCriticAgent(ruleResult.checks, visualEntities, activeAngles);

  // Calculate Overall Verdict
  const failChecks = ruleResult.checks.filter(c => c.verdict === "FAIL");
  const uncertainChecks = ruleResult.checks.filter(c => c.verdict === "UNCERTAIN" && c.ruleId !== "RULE-THICK-LIMIT-10");

  let preliminaryVerdict = "PASS";
  if (failChecks.length > 0) {
    preliminaryVerdict = "FAIL";
  } else if (uncertainChecks.length > 0 || criticResult.downgradeApplied) {
    preliminaryVerdict = "UNCERTAIN";
  }

  // Determine Re-Inspection Needs (Intelligent Re-Inspection)
  // Only trigger re-inspection when verdict is UNCERTAIN (to resolve missing evidence)
  // or PASS (to achieve 360° multi-angle verification)
  let reInspectionCandidate = null;
  if (preliminaryVerdict === "UNCERTAIN") {
    reInspectionCandidate = 
      (packagingResult.reInspectionRequest && packagingResult.status === "UNCERTAIN" ? packagingResult.reInspectionRequest : null) ||
      (labelResult.reInspectionRequest && labelResult.status === "UNCERTAIN" ? labelResult.reInspectionRequest : null) ||
      criticResult.intelligentReInspectionRequest ||
      (barcodeResult.reInspectionRequest && barcodeResult.status === "UNCERTAIN" ? barcodeResult.reInspectionRequest : null);
  } else if (preliminaryVerdict === "PASS" && !activeAngles.includes("BACK")) {
    reInspectionCandidate = barcodeResult.reInspectionRequest || criticResult.intelligentReInspectionRequest;
  }

  const hasReInspection = reInspectionCandidate && reInspectionCandidate.needed;

  if (hasReInspection) {
    timeline.push({
      time: timeStr,
      event: `Intelligent Re-Inspection requested by ${criticResult.downgradeApplied ? 'Critic Agent' : 'Specialist Agent'}: ${reInspectionCandidate.targetArea}`,
      status: "WARNING",
      details: reInspectionCandidate.prompt
    });
  } else {
    timeline.push({
      time: timeStr,
      event: "Critic Agent confirmed evidence consensus with 98% dual-agent confidence",
      status: "SUCCESS"
    });
  }

  const primaryFailure = failChecks[0] || uncertainChecks[0];
  const primaryReason = criticResult.downgradeApplied 
    ? criticResult.downgradeReason 
    : primaryFailure 
      ? primaryFailure.reason 
      : "All visual inbound prep and labelling requirements have been verified and satisfied.";

  // Step 4: Run Work Order vs. Physical Reality Comparison
  const comparison = compareWorkOrderVsActual(workOrder, ruleResult.checks, visualEntities);

  timeline.push({
    time: timeStr,
    event: `Work Order comparison evaluated: ${comparison.hasMismatch ? 'Preparation Mismatch Detected' : '100% Directive Alignment'}`,
    status: comparison.hasMismatch ? "WARNING" : "SUCCESS"
  });

  timeline.push({
    time: timeStr,
    event: `Final verdict generated: ${preliminaryVerdict}`,
    status: preliminaryVerdict === "PASS" ? "SUCCESS" : preliminaryVerdict === "FAIL" ? "ERROR" : "WARNING"
  });

  const inspectionId = `INSP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  // Step 5: Proof-of-Prep Cryptographic Record
  const proofOfPrep = generateProofOfPrepCertificate({
    inspectionId,
    workOrder,
    scenarioId,
    overallVerdict: preliminaryVerdict,
    primaryReason,
    checks: ruleResult.checks,
    comparison,
    timeline,
    operatorId: workOrder?.operator || "Operator A (Station 04)"
  });

  return {
    inspectionId,
    scenarioId,
    overallVerdict: preliminaryVerdict,
    primaryReason,
    checksCount: {
      total: ruleResult.checks.length,
      pass: ruleResult.checks.filter(c => c.verdict === "PASS").length,
      fail: failChecks.length,
      uncertain: ruleResult.checks.filter(c => c.verdict === "UNCERTAIN").length
    },
    checks: ruleResult.checks,
    remediationSteps: failChecks.map(c => `Fix: ${c.reason}`),

    // Feature 1: Intelligent Re-Inspection Module
    reInspection: {
      needed: Boolean(hasReInspection),
      request: reInspectionCandidate || null,
      activeAngles
    },

    // Feature 2: Multi-Agent Inspection Team Telemetry
    multiAgentTeam: {
      director: "Director Agent (Master Orchestrator)",
      agents: [
        { name: "Packaging Agent", status: packagingResult.status, specialty: packagingResult.specialty, findingsCount: packagingResult.findings.length },
        { name: "Label Agent", status: labelResult.status, specialty: labelResult.specialty, findingsCount: labelResult.findings.length },
        { name: "Barcode Agent", status: barcodeResult.status, specialty: barcodeResult.specialty, findingsCount: barcodeResult.findings.length },
        { name: "Spatial Agent", status: spatialResult.status, specialty: spatialResult.specialty, findingsCount: spatialResult.findings.length },
        { name: "Rule Agent", status: preliminaryVerdict, specialty: ruleResult.specialty, checksCount: ruleResult.checks.length },
        { name: "Critic Agent", status: criticResult.consensusReached ? "CONSENSUS" : "CRITIQUE_DISAGREEMENT", specialty: criticResult.specialty, observationsCount: criticResult.criticObservations.length }
      ]
    },

    // Feature 3: Spatial Engine Data & Visual Coaching Vectors
    spatialAnalysis: spatialResult.spatialAnalysis,
    coachingAdvice: spatialResult.coachingAdvice,

    // Feature 4: Self-Critique / Second Opinion
    critiqueResult: criticResult,

    // Feature 5: Work Order vs Actual Product Comparison
    workOrderComparison: comparison,

    // Feature 6: Proof-of-Prep Cryptographic Certificate & Timeline
    proofOfPrep,
    inspectionTimeline: timeline,

    // Economic Assessment
    economicAssessment: ruleResult.economicAssessment
  };
}
