// Adversarial Self-Critique Engine (Dual-Agent Reliability Pass)
// Verifier Agent vs. Critic Agent
// If Critic identifies valid counter-evidence or visual ambiguities, auto-downgrades to UNCERTAIN.

export function runAdversarialCritique(primaryVerdictResult, visualEntities) {
  const { overallVerdict, checks } = primaryVerdictResult;
  const criticObservations = [];
  let shouldDowngradeToUncertain = false;
  let downgradeReason = "";

  // Critique Check 1: Single-Angle Reverse Side Occlusion
  // Does the photo only show 1 side while claiming no exposed UPC exists?
  const upcCheck = checks.find(c => c.ruleId === "RULE-UPC-COV-07");
  if (upcCheck && upcCheck.verdict === "PASS") {
    criticObservations.push({
      ruleId: "RULE-UPC-COV-07",
      agent: "Critic-Adversary",
      critique: "Hypothesis challenged: Only front packaging plane is visible. Reverse side could conceal unmasked UPC barcode. High confidence requires 360° verification.",
      severity: "OBSERVATIONAL"
    });
  }

  // Critique Check 2: Specular Reflection / Glare Ambiguity
  // If glare is present, critic argues that warning or seal cannot be declared 100% compliant
  const warningCheck = checks.find(c => c.ruleId === "RULE-WARN-03" || c.ruleId === "RULE-WARN-LEG-04");
  const glareDetected = visualEntities?.suffocationWarning?.glareIndexPct > 35;
  if (glareDetected && (warningCheck?.verdict === "PASS")) {
    shouldDowngradeToUncertain = true;
    downgradeReason = "Critic identified specular flash glare washing out text characters. Cannot confirm CPSIA compliance without secondary polarized frame.";
    criticObservations.push({
      ruleId: "RULE-WARN-LEG-04",
      agent: "Critic-Adversary",
      critique: downgradeReason,
      severity: "CRITICAL_DOWGRADE"
    });
  }

  // Critique Check 3: Seal Integrity Borderline Flaps
  if (visualEntities?.polybag?.sealIntegrityScore && visualEntities.polybag.sealIntegrityScore < 60) {
    shouldDowngradeToUncertain = true;
    downgradeReason = "Critic identified discontinuous seal edge (<60% integrity score). Visual evidence insufficient to guarantee hermetic weld.";
    criticObservations.push({
      ruleId: "RULE-SEAL-02",
      agent: "Critic-Adversary",
      critique: downgradeReason,
      severity: "CRITICAL_DOWGRADE"
    });
  }

  // Critique Check 4: Curvature Angle Edge Case
  const curvatureAngle = visualEntities?.fnskuLabel?.curvatureAngleDeg || 0;
  if (curvatureAngle >= 12.0 && curvatureAngle <= 15.0) {
    criticObservations.push({
      ruleId: "RULE-FNSKU-SURF-05",
      agent: "Critic-Adversary",
      critique: `Surface curvature (${curvatureAngle.toFixed(1)}°) is within 3° of the 15.0° regulatory threshold. Close tolerance requires operator re-check.`,
      severity: "WARNING"
    });
  }

  const consensusReached = !shouldDowngradeToUncertain;
  const finalVerdict = shouldDowngradeToUncertain ? "UNCERTAIN" : overallVerdict;

  return {
    criticActive: true,
    consensusReached,
    primaryVerdict: overallVerdict,
    finalVerdict,
    downgradeApplied: shouldDowngradeToUncertain,
    downgradeReason: shouldDowngradeToUncertain ? downgradeReason : null,
    consensusConfidenceScore: consensusReached ? 0.98 : 0.48,
    criticObservations
  };
}
