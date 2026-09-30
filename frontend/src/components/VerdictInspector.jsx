import React, { useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  FileCheck, 
  Volume2, 
  Download, 
  AlertOctagon, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  Wrench, 
  DollarSign, 
  Scale, 
  ShieldCheck, 
  RotateCw, 
  Compass, 
  UserCheck, 
  FileText, 
  Clock,
  Lock,
  Layers,
  Camera,
  Activity
} from "lucide-react";

export function VerdictInspector({
  verification,
  workOrder,
  onGenerateCertificate,
  onPlayVoiceAnnouncement,
  onExportJson,
  onOpenDisputePack,
  onOpenOverrideModal
}) {
  const [expandedRule, setExpandedRule] = useState(null);

  if (!verification) {
    return (
      <div className="right-sidebar">
        <div className="glass-panel" style={{ padding: "1.75rem", textAlign: "center", color: "#64748b" }}>
          <AlertOctagon size={36} style={{ margin: "0 auto 10px" }} />
          <p style={{ fontSize: "0.95rem" }}>No verification data available. Select a scenario or ingest a package photograph.</p>
        </div>
      </div>
    );
  }

  const { 
    overallVerdict, 
    primaryReason, 
    checks, 
    remediationSteps, 
    coachingAdvice, 
    critiqueResult, 
    economicAssessment,
    proofOfPrep,
    inspectionTimeline,
    reInspection
  } = verification;

  const isPass = overallVerdict === "PASS";
  const isFail = overallVerdict === "FAIL";
  const isUncertain = overallVerdict === "UNCERTAIN";

  const toggleRuleExpand = (ruleId) => {
    setExpandedRule(prev => prev === ruleId ? null : ruleId);
  };

  return (
    <div className="right-sidebar">
      
      {/* 1. HERO VERDICT BANNER WITH ECONOMIC IMPACT */}
      <div className={`verdict-hero ${overallVerdict.toLowerCase()}`}>
        <div className="verdict-title-row">
          <div className="verdict-status-title">
            {isPass && <CheckCircle2 size={30} color="#047857" />}
            {isFail && <XCircle size={30} color="#b91c1c" />}
            {isUncertain && <HelpCircle size={30} color="#b45309" />}
            <span>PREP STATUS: {overallVerdict}</span>
          </div>
          
          <button 
            onClick={onPlayVoiceAnnouncement} 
            className="btn-secondary" 
            style={{ padding: "6px 12px", fontSize: "0.82rem", background: "#ffffff", borderColor: "#cbd5e1" }}
            title="Play Audio Announcement"
          >
            <Volume2 size={15} color="#2563eb" /> Voice PA
          </button>
        </div>

        {/* Primary Explanation */}
        <div className="verdict-primary-reason">
          {primaryReason}
        </div>

        {/* Economic Layer Banner (Dollars & Days of Delay) */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: isFail ? "#fef2f2" : isUncertain ? "#fffbeb" : "#ecfdf5",
          padding: "0.65rem 0.95rem",
          borderRadius: "var(--radius-md)",
          fontSize: "0.84rem",
          fontWeight: 600,
          border: `1.5px solid ${isFail ? "#ef4444" : isUncertain ? "#f59e0b" : "#10b981"}`
        }}>
          {isFail && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#991b1b" }}>
                <DollarSign size={16} color="#dc2626" />
                <span>Est. Penalty Risk: <strong>${economicAssessment?.totalDefectFeeRiskUsd?.toFixed(2)}</strong></span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#c2410c" }}>
                <Clock size={15} color="#ea580c" />
                <span>+{economicAssessment?.estimatedInboundDelayDays} Days FC Quarantine</span>
              </div>
            </>
          )}

          {isUncertain && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#92400e" }}>
              <HelpCircle size={16} color="#d97706" />
              <span>Inspection Incomplete: Follow-up photograph needed before shipment</span>
            </div>
          )}

          {isPass && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#065f46" }}>
              <Sparkles size={16} color="#059669" />
              <span>Compliant: $0.00 Inbound Defect Risk | Certified for Pallet Dispatch</span>
            </div>
          )}
        </div>
      </div>

      {/* FEATURE 4: Self-Critique / Second Opinion (Critic Agent) Panel */}
      {critiqueResult && (
        <div style={{
          padding: "0.85rem 1rem",
          background: critiqueResult.consensusReached ? "#f0fdf4" : "#fffbeb",
          border: `1.5px solid ${critiqueResult.consensusReached ? "#86efac" : "#fcd34d"}`,
          borderRadius: "var(--radius-md)",
          fontSize: "0.85rem",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 800, color: critiqueResult.consensusReached ? "#047857" : "#b45309", display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={16} /> DUAL-AGENT CRITIQUE: {critiqueResult.consensusReached ? "CONSENSUS CONFIRMED" : "CRITIC CHALLENGE"}
            </span>
            <span className="mono" style={{ color: "#2563eb", fontWeight: 800 }}>
              Confidence: {Math.round((critiqueResult.consensusConfidenceScore || 0.98) * 100)}%
            </span>
          </div>

          <div style={{ color: "#1e293b", fontWeight: 600, lineHeight: 1.4 }}>
            {critiqueResult.downgradeApplied 
              ? `Adversarial Critic downgraded verdict: ${critiqueResult.downgradeReason}`
              : `Independent critic verified zero conflicting visual artifacts, specular glare, or occluded planes.`}
          </div>

          {critiqueResult.criticObservations?.length > 0 && (
            <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "3px" }}>
              {critiqueResult.criticObservations.map((obs, idx) => (
                <div key={idx} style={{ fontSize: "0.78rem", color: "#475569", display: "flex", alignItems: "flex-start", gap: "5px" }}>
                  <span style={{ color: obs.severity === "CRITICAL_DOWNGRADE" ? "#dc2626" : "#d97706", fontWeight: 800 }}>•</span>
                  <span>{obs.critique}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FEATURE 5: Pre-Shipment Live Coaching Directives (Shift-Left) */}
      {coachingAdvice && coachingAdvice.length > 0 && (
        <div className="glass-panel" style={{ padding: "0.85rem 1rem", display: "flex", flexDirection: "column", gap: "0.55rem", borderLeft: "4px solid #2563eb" }}>
          <h4 style={{ fontSize: "0.88rem", color: "#2563eb", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.03em", display: "flex", alignItems: "center", gap: "7px" }}>
            <Compass size={16} /> Pre-Shipment Live Coaching (Shift-Left)
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {coachingAdvice.map((advice, idx) => (
              <div key={idx} style={{ fontSize: "0.84rem", color: "#1e293b", fontWeight: 600, lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: "7px" }}>
                <RotateCw size={14} color="#0284c7" style={{ marginTop: "2px", flexShrink: 0 }} />
                <span>{advice.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEATURE 3: Evidence-Based Verdicts List */}
      <div className="glass-panel" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1, minHeight: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a" }}>
            Evidence-Based Checks ({checks?.length || 0})
          </h4>
          <span className="mono" style={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569" }}>
            {checks?.filter(c => c.verdict === "PASS").length}P / {checks?.filter(c => c.verdict === "FAIL").length}F / {checks?.filter(c => c.verdict === "UNCERTAIN").length}U
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", overflowY: "auto", maxHeight: "330px", paddingRight: "3px" }}>
          {checks?.map((chk, i) => {
            const isExpanded = expandedRule === chk.ruleId;
            return (
              <div key={i} className="check-card">
                <div className="check-header" onClick={() => toggleRuleExpand(chk.ruleId)} style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <span className="mono" style={{ fontSize: "0.76rem", color: "#2563eb", fontWeight: 800 }}>{chk.ruleId}</span>
                    <span className="check-title">{chk.category}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <span className="mono" style={{ fontSize: "0.74rem", fontWeight: 700, color: "#64748b" }}>
                      {Math.round((chk.confidence || 0.98) * 100)}%
                    </span>
                    {chk.verdict === "PASS" && <span className="badge-pass">PASS</span>}
                    {chk.verdict === "FAIL" && <span className="badge-fail">FAIL</span>}
                    {chk.verdict === "UNCERTAIN" && <span className="badge-uncertain">UNCERTAIN</span>}
                    {isExpanded ? <ChevronUp size={15} color="#475569" /> : <ChevronDown size={15} color="#475569" />}
                  </div>
                </div>

                <div className="check-reason">
                  {chk.reason}
                </div>

                {/* Evidence String & Image Reference */}
                {chk.evidence && (
                  <div className="check-evidence">
                    <strong>EVIDENCE:</strong> {chk.evidence}
                  </div>
                )}

                {/* Detected Region / Bounding Box & Image Tag */}
                {chk.detectedRegion && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.74rem", color: "#64748b", fontFamily: "var(--font-mono)" }}>
                    <span>📍 Region: [{chk.detectedRegion.x}, {chk.detectedRegion.y}, {chk.detectedRegion.w}x{chk.detectedRegion.h}]</span>
                    <span>• {chk.supportingImage || "primary_scan.jpg"}</span>
                  </div>
                )}

                {/* Required Resolution Angle if UNCERTAIN */}
                {chk.verdict === "UNCERTAIN" && chk.resolutionAngleRequired && (
                  <div style={{
                    fontSize: "0.78rem",
                    color: "#92400e",
                    background: "#fffbeb",
                    padding: "5px 8px",
                    borderRadius: "4px",
                    borderLeft: "3px solid #f59e0b"
                  }}>
                    <strong>Resolution Required:</strong> {chk.resolutionAngleRequired}
                  </div>
                )}

                {/* Verbatim Standard Clause */}
                {isExpanded && chk.verbatimClause && (
                  <div style={{
                    background: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                    padding: "7px 10px",
                    fontSize: "0.76rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px"
                  }}>
                    <span style={{ color: "#2563eb", fontWeight: 700 }}>
                      STANDARD: {chk.standard}
                    </span>
                    <p style={{ color: "#334155", fontStyle: "italic", margin: 0, lineHeight: 1.35 }}>
                      "{chk.verbatimClause}"
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FEATURE 6: Cryptographic Proof-of-Prep Anchor Badge */}
      {proofOfPrep && (
        <div style={{
          background: "#f0fdf4",
          border: "1px solid #86efac",
          borderRadius: "var(--radius-sm)",
          padding: "0.55rem 0.85rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.78rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#047857", fontWeight: 800 }}>
            <Lock size={14} color="#059669" />
            <span>PROOF-OF-PREP ANCHOR:</span>
          </div>
          <span className="mono" style={{ color: "#2563eb", fontSize: "0.74rem", fontWeight: 700 }} title={proofOfPrep.cryptographicHashSha256}>
            SHA-256: {proofOfPrep.cryptographicHashSha256?.slice(0, 16)}...
          </span>
        </div>
      )}

      {/* Action Controls & Dispute Packaging */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.55rem", marginTop: "auto" }}>
        {/* Dispute Defense Pack Button */}
        <button 
          className="btn-primary" 
          onClick={onOpenDisputePack}
          style={{ width: "100%", fontSize: "0.84rem", padding: "0.65rem 0.5rem", background: "linear-gradient(135deg, #0284c7, #2563eb)" }}
          title="Generate Inbound Defect Dispute Packet"
        >
          <FileText size={15} />
          <span>Dispute Pack</span>
        </button>

        {/* Human Operator Override Button */}
        <button 
          className="btn-secondary" 
          onClick={onOpenOverrideModal}
          style={{ width: "100%", fontSize: "0.84rem", padding: "0.65rem 0.5rem" }}
          title="Challenge AI with Floor Justification"
        >
          <UserCheck size={15} color="#d97706" />
          <span>HITL Override</span>
        </button>

        {/* Official Proof-of-Prep Certificate */}
        <button 
          className="btn-secondary" 
          onClick={onGenerateCertificate}
          style={{ width: "100%", fontSize: "0.84rem", padding: "0.65rem 0.5rem" }}
          title="Print & View Certified Proof-of-Prep Report"
        >
          <FileCheck size={15} color="#059669" />
          <span>Proof Certificate</span>
        </button>

        {/* Export JSON Audit */}
        <button 
          className="btn-secondary" 
          onClick={onExportJson}
          style={{ width: "100%", fontSize: "0.84rem", padding: "0.65rem 0.5rem" }}
        >
          <Download size={15} color="#2563eb" />
          <span>Export Audit</span>
        </button>
      </div>

    </div>
  );
}
