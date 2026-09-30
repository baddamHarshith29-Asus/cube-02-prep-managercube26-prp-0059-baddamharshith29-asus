import React, { useState, useEffect } from "react";
import { X, BarChart3, Users, AlertTriangle, TrendingUp, Layers, CheckCircle2 } from "lucide-react";

export function BatchAnalyticsModal({ isOpen, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/batch-analytics")
        .then(res => res.json())
        .then(resData => {
          setData(resData);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error loading batch analytics:", err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "860px" }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(139, 92, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={18} color="#8b5cf6" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.1rem", color: "#f8fafc" }}>Batch Failure-Pattern Clustering &amp; Operator Analytics</h2>
              <p style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Operational Shift Analysis &amp; Systematic Root Cause Diagnostics</p>
            </div>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: "4px 8px" }}>
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Aggregating batch telemetry...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            
            {/* KPI Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
              <div className="glass-panel" style={{ padding: "0.85rem", display: "flex", flexDirection: "column", gap: "3px" }}>
                <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Batch First-Pass Yield</span>
                <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#34d399", fontFamily: "var(--font-display)" }}>
                  {data?.batchSummary?.firstPassYieldPct}%
                </span>
                <span style={{ fontSize: "0.65rem", color: "#64748b" }}>Target SLA: 90%</span>
              </div>

              <div className="glass-panel" style={{ padding: "0.85rem", display: "flex", flexDirection: "column", gap: "3px" }}>
                <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Chargebacks Avoided</span>
                <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#38bdf8", fontFamily: "var(--font-display)" }}>
                  ${data?.batchSummary?.totalDefectFeesAvoidedUsd.toFixed(2)}
                </span>
                <span style={{ fontSize: "0.65rem", color: "#64748b" }}>Unplanned prep fees</span>
              </div>

              <div className="glass-panel" style={{ padding: "0.85rem", display: "flex", flexDirection: "column", gap: "3px" }}>
                <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Receiving Delays Saved</span>
                <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#facc15", fontFamily: "var(--font-display)" }}>
                  {data?.batchSummary?.totalReceivingDaysSaved} Days
                </span>
                <span style={{ fontSize: "0.65rem", color: "#64748b" }}>FC quarantine avoidance</span>
              </div>

              <div className="glass-panel" style={{ padding: "0.85rem", display: "flex", flexDirection: "column", gap: "3px" }}>
                <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Total Units Audited</span>
                <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f8fafc", fontFamily: "var(--font-display)" }}>
                  {data?.batchSummary?.totalAudited}
                </span>
                <span style={{ fontSize: "0.65rem", color: "#64748b" }}>Shift 1 &amp; Shift 2</span>
              </div>
            </div>

            {/* Operator Performance Matrix */}
            <div className="glass-panel" style={{ padding: "0.85rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              <h4 style={{ fontSize: "0.85rem", color: "#f8fafc", display: "flex", alignItems: "center", gap: "6px" }}>
                <Users size={14} color="#06b6d4" /> Operator Compliance Matrix
              </h4>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.65rem" }}>
                {Object.entries(data?.operatorBreakdown || {}).map(([opName, stats], idx) => {
                  const passRate = Math.round((stats.pass / stats.total) * 100);
                  const isHighRisk = passRate < 70;
                  return (
                    <div 
                      key={idx}
                      style={{
                        background: "rgba(0,0,0,0.3)",
                        border: isHighRisk ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-md)",
                        padding: "0.75rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.75rem", color: "#f8fafc" }}>{opName}</span>
                        <span className={isHighRisk ? "badge-fail" : "badge-pass"} style={{ fontSize: "0.65rem" }}>
                          {passRate}% Pass
                        </span>
                      </div>

                      <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                        Units: {stats.total} | {stats.pass} Pass / {stats.fail} Fail
                      </div>

                      <div style={{ fontSize: "0.68rem", color: isHighRisk ? "#f87171" : "#cbd5e1", marginTop: "2px", fontWeight: 600 }}>
                        Primary Pattern: {stats.topDefect}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Systematic Defect Root Cause Clusters */}
            <div className="glass-panel" style={{ padding: "0.85rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              <h4 style={{ fontSize: "0.85rem", color: "#f8fafc", display: "flex", alignItems: "center", gap: "6px" }}>
                <AlertTriangle size={14} color="#ef4444" /> Systematic Defect Clusters &amp; Workstation Root Causes
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(data?.defectClusters || []).map((cluster, i) => (
                  <div key={i} style={{ background: "rgba(0,0,0,0.25)", padding: "0.65rem 0.85rem", borderRadius: "var(--radius-sm)", display: "flex", flexDirection: "column", gap: "3px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                      <span style={{ fontWeight: 700, color: "#f8fafc" }}>{cluster.defect}</span>
                      <span className="mono" style={{ color: "#ef4444", fontWeight: 700 }}>{cluster.clusterPct}% ({cluster.count} units)</span>
                    </div>

                    <div style={{ fontSize: "0.7rem", color: "#38bdf8" }}>
                      Source: {cluster.primarySource}
                    </div>

                    <div style={{ fontSize: "0.7rem", color: "#94a3b8", background: "rgba(255,255,255,0.03)", padding: "4px 6px", borderRadius: "3px" }}>
                      <strong>Workstation Root Cause:</strong> {cluster.rootCause}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn-secondary" onClick={onClose}>Close Batch Analytics</button>
        </div>

      </div>
    </div>
  );
}
