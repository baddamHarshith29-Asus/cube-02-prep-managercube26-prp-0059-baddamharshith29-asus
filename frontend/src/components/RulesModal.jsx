import React, { useState } from "react";
import { X, BookOpen, ExternalLink, ShieldCheck, AlertTriangle, DollarSign, Clock, Camera } from "lucide-react";

export function RulesModal({ isOpen, onClose, rules = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  if (!isOpen) return null;

  const categories = ["ALL", ...new Set(rules.map(r => r.category))];
  const filtered = selectedCategory === "ALL" 
    ? rules 
    : rules.filter(r => r.category === selectedCategory);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "840px", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen size={18} color="#06b6d4" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.1rem", color: "#f8fafc" }}>Authoritative Inbound Prep Rulebook</h2>
              <p style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Amazon FBA Compliance Standard 2026, Walmart WFS Matrix &amp; CPSIA</p>
            </div>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: "4px 8px" }}>
            <X size={16} />
          </button>
        </div>

        {/* Categories Bar */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`chip ${selectedCategory === cat ? "active" : ""}`}
              style={{ fontSize: "0.7rem", padding: "3px 8px" }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Rules Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "550px", overflowY: "auto", paddingRight: "4px" }}>
          {filtered.map(rule => (
            <div 
              key={rule.id}
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "0.85rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="mono" style={{ fontSize: "0.75rem", color: "#38bdf8", fontWeight: 700 }}>{rule.id}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f8fafc" }}>{rule.title}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className="mono" style={{ fontSize: "0.68rem", color: "#94a3b8", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: "4px" }}>
                    {rule.standard}
                  </span>
                  {rule.visuallyVerifiable ? (
                    <span className="badge-pass" style={{ fontSize: "0.65rem" }}>Visually Verifiable</span>
                  ) : (
                    <span className="badge-uncertain" style={{ fontSize: "0.65rem" }}>Physical Limitation</span>
                  )}
                </div>
              </div>

              {/* Verbatim Requirement Text */}
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.6rem 0.8rem", borderRadius: "4px", borderLeft: "3px solid #0284c7" }}>
                <div style={{ fontSize: "0.68rem", color: "#38bdf8", fontWeight: 700, marginBottom: "2px" }}>
                  VERBATIM REQUIREMENT CLAUSE:
                </div>
                <p style={{ fontSize: "0.78rem", color: "#e2e8f0", lineHeight: 1.4, margin: 0, fontStyle: "italic" }}>
                  "{rule.verbatimClause || rule.description}"
                </p>
              </div>

              {/* Economic & Delay Risk Metadata */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "0.7rem" }}>
                {rule.economicFeeUsd > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#f87171" }}>
                    <DollarSign size={13} />
                    <span>Non-Compliance Penalty: <strong>${rule.economicFeeUsd.toFixed(2)}/unit</strong></span>
                  </div>
                )}
                {rule.delayRiskDays > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#f97316" }}>
                    <Clock size={13} />
                    <span>Quarantine Delay: <strong>+{rule.delayRiskDays} Days</strong></span>
                  </div>
                )}
                {rule.resolutionAngleRequired && (
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#38bdf8" }}>
                    <Camera size={13} />
                    <span>Resolution Angle: {rule.resolutionAngleRequired}</span>
                  </div>
                )}
              </div>

              {rule.criteria && (
                <div style={{ background: "rgba(0, 0, 0, 0.2)", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)", fontSize: "0.72rem", color: "#94a3b8" }}>
                  <div style={{ fontWeight: 600, color: "#cbd5e1", marginBottom: "3px" }}>Mandatory Compliance Criteria:</div>
                  <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                    {rule.criteria.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {rule.visualFeasibilityExplanation && (
                <div style={{ fontSize: "0.72rem", color: "#fbbf24", background: "rgba(245, 158, 11, 0.1)", padding: "4px 8px", borderRadius: "4px", borderLeft: "2px solid #f59e0b" }}>
                  ⚠️ Epistemic Limitation: {rule.visualFeasibilityExplanation}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn-secondary" onClick={onClose}>
            Close Rulebook
          </button>
        </div>
      </div>
    </div>
  );
}
