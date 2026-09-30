import React, { useState, useEffect } from "react";
import { X, BarChart3, TrendingUp, AlertTriangle, ShieldCheck, DollarSign } from "lucide-react";

export function AnalyticsModal({ isOpen, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/stats")
        .then(res => res.json())
        .then(data => {
          setStats(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error loading stats:", err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "780px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BarChart3 size={18} color="#10b981" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.1rem", color: "#f8fafc" }}>Warehouse Inbound Station Analytics</h2>
              <p style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Optical Verification Yield &amp; Non-Compliance Defect Avoidance</p>
            </div>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: "4px 8px" }}>
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Loading analytics telemetry...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
              <div className="glass-panel" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>First-Pass Yield</span>
                <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "#34d399", fontFamily: "var(--font-display)" }}>
                  {stats?.firstPassYieldPct || 85}%
                </span>
                <span style={{ fontSize: "0.68rem", color: "#64748b" }}>Target SLA: &gt;= 90%</span>
              </div>

              <div className="glass-panel" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Chargebacks Avoided</span>
                <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "#38bdf8", fontFamily: "var(--font-display)" }}>
                  ${(stats?.totalChargebackFeesSavedUsd || 142.50).toFixed(2)}
                </span>
                <span style={{ fontSize: "0.68rem", color: "#64748b" }}>Unplanned prep penalties</span>
              </div>

              <div className="glass-panel" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Total Units Audited</span>
                <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f8fafc", fontFamily: "var(--font-display)" }}>
                  {stats?.totalInspections || 48}
                </span>
                <span style={{ fontSize: "0.68rem", color: "#64748b" }}>Current shift volume</span>
              </div>
            </div>

            {/* Top Defects Pareto Breakdown */}
            <div className="glass-panel" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              <h4 style={{ fontSize: "0.85rem", color: "#f8fafc", display: "flex", alignItems: "center", gap: "6px" }}>
                <AlertTriangle size={15} color="#ef4444" /> Top Detected Inbound Defects (Pareto Distribution)
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(stats?.topDefects || []).map((def, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                      <span style={{ color: "#e2e8f0" }}>{def.name}</span>
                      <span className="mono" style={{ color: "#f87171", fontWeight: 700 }}>{def.pct}% ({def.count} units)</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: `${def.pct}%`, height: "100%", background: "linear-gradient(90deg, #ef4444, #f97316)", borderRadius: "3px" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Audit Log */}
            <div className="glass-panel" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              <h4 style={{ fontSize: "0.85rem", color: "#f8fafc" }}>Recent Inbound Verification Stream</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", maxHeight: "180px", overflowY: "auto" }}>
                {(stats?.recentInspections || []).map((insp, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", background: "rgba(0,0,0,0.2)", borderRadius: "4px", fontSize: "0.72rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className="mono" style={{ color: "#38bdf8" }}>{insp.id}</span>
                      <span style={{ color: "#f8fafc" }}>{insp.productName}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {insp.verdict === "PASS" && <span className="badge-pass" style={{ fontSize: "0.62rem" }}>PASS</span>}
                      {insp.verdict === "FAIL" && <span className="badge-fail" style={{ fontSize: "0.62rem" }}>FAIL</span>}
                      {insp.verdict === "UNCERTAIN" && <span className="badge-uncertain" style={{ fontSize: "0.62rem" }}>UNCERTAIN</span>}
                      <span className="mono" style={{ color: "#64748b" }}>{new Date(insp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn-secondary" onClick={onClose}>Close Dashboard</button>
        </div>
      </div>
    </div>
  );
}
