import React, { useState } from "react";
import { 
  ClipboardList, 
  Check, 
  AlertTriangle, 
  Calendar, 
  PackageCheck, 
  Layers, 
  Scale, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  CheckCircle2,
  XCircle
} from "lucide-react";

export function WorkOrderCard({ workOrder, verification }) {
  const [showFullComparison, setShowFullComparison] = useState(false);

  if (!workOrder) return null;

  const comparison = verification?.workOrderComparison;

  // Handle both array and object formats of requiredPrep
  const prepList = Array.isArray(workOrder.requiredPrep) 
    ? workOrder.requiredPrep 
    : Object.entries(workOrder.requiredPrep || {})
        .filter(([_, v]) => Boolean(v))
        .map(([k]) => k.replace(/([A-Z])/g, ' $1').toLowerCase());

  return (
    <div className="glass-panel" style={{ padding: "1.1rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      {/* Card Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h4 style={{ fontSize: "0.95rem", color: "#2563eb", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.03em", display: "flex", alignItems: "center", gap: "7px" }}>
          <ClipboardList size={18} /> Work Order vs Physical Reality
        </h4>
        <span className="mono" style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", background: "#f1f5f9", border: "1px solid #cbd5e1", padding: "3px 8px", borderRadius: "4px" }}>
          {workOrder.orderId}
        </span>
      </div>

      {/* Meta Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", fontSize: "0.85rem" }}>
        <div>
          <span style={{ color: "#64748b", fontWeight: 600 }}>SKU: </span>
          <span className="mono" style={{ color: "#0f172a", fontWeight: 700 }}>{workOrder.sku}</span>
        </div>
        <div>
          <span style={{ color: "#64748b", fontWeight: 600 }}>ASIN: </span>
          <span className="mono" style={{ color: "#0f172a", fontWeight: 700 }}>{workOrder.asin}</span>
        </div>
        <div>
          <span style={{ color: "#64748b", fontWeight: 600 }}>Category: </span>
          <span style={{ color: "#334155", fontWeight: 600 }}>{workOrder.category || workOrder.productCategory}</span>
        </div>
        <div>
          <span style={{ color: "#64748b", fontWeight: 600 }}>Opening: </span>
          <span className="mono" style={{ color: "#2563eb", fontWeight: 800 }}>{workOrder.bagOpeningInches || 10}"</span>
        </div>
      </div>

      {/* FEATURE 5: Work Order vs Actual Physical Reality Mismatch Callout */}
      {comparison && (
        <div style={{
          padding: "0.85rem 1rem",
          borderRadius: "var(--radius-md)",
          background: comparison.hasMismatch ? "#fef2f2" : "#ecfdf5",
          border: `1.5px solid ${comparison.hasMismatch ? "#ef4444" : "#10b981"}`,
          fontSize: "0.85rem",
          display: "flex",
          flexDirection: "column",
          gap: "6px"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{
              fontWeight: 800,
              fontSize: "0.85rem",
              color: comparison.hasMismatch ? "#b91c1c" : "#047857",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              {comparison.hasMismatch ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
              {comparison.hasMismatch ? "PREPARATION MISMATCH DETECTED" : "WORK ORDER VERIFIED ALIGNED"}
            </span>

            <button 
              onClick={() => setShowFullComparison(!showFullComparison)}
              style={{
                background: "transparent",
                border: "none",
                color: "#2563eb",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "3px"
              }}
            >
              {showFullComparison ? <>Hide Matrix <ChevronUp size={14} /></> : <>Compare Table <ChevronDown size={14} /></>}
            </button>
          </div>

          <p style={{ margin: 0, color: "#1e293b", fontWeight: 600, lineHeight: 1.4 }}>
            {comparison.mismatchSummary}
          </p>

          {/* Full Comparison Table (Collapsible) */}
          {showFullComparison && (
            <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "5px" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1.3fr 0.9fr 0.9fr 0.8fr",
                fontSize: "0.78rem",
                color: "#475569",
                fontWeight: 800,
                borderBottom: "1.5px solid #cbd5e1",
                paddingBottom: "4px"
              }}>
                <span>Requirement</span>
                <span>Expected (PO)</span>
                <span>Actual (Photo)</span>
                <span style={{ textAlign: "right" }}>Status</span>
              </div>

              {comparison.comparisonRows?.map((row, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.3fr 0.9fr 0.9fr 0.8fr",
                    fontSize: "0.82rem",
                    padding: "4px 0",
                    borderBottom: "1px solid #e2e8f0",
                    alignItems: "center"
                  }}
                >
                  <span style={{ color: "#0f172a", fontWeight: 600 }}>{row.requirement}</span>
                  <span className="mono" style={{ color: "#475569", fontWeight: 600 }}>{row.expected}</span>
                  <span className="mono" style={{ 
                    color: row.actual === "PASS" ? "#047857" : row.actual === "FAIL" ? "#b91c1c" : "#b45309",
                    fontWeight: 700 
                  }}>
                    {row.actual}
                  </span>
                  <span style={{ textAlign: "right" }}>
                    {row.status === "MATCH" ? (
                      <span style={{ color: "#047857", fontWeight: 800, fontSize: "0.78rem" }}>✓ MATCH</span>
                    ) : (
                      <span style={{ color: "#b91c1c", fontWeight: 800, fontSize: "0.78rem" }}>✕ MISMATCH</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mandatory Work Order Tasks Checklist */}
      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "0.65rem 0.85rem", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "0.8rem", color: "#475569", fontWeight: 700, marginBottom: "6px" }}>
          Work Order Required Prep Actions:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {prepList.map((task, i) => (
            <span 
              key={i} 
              style={{ 
                fontSize: "0.8rem", 
                fontWeight: 600,
                background: "#eff6ff", 
                border: "1px solid #bfdbfe", 
                color: "#1d4ed8", 
                padding: "3px 8px", 
                borderRadius: "4px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <Check size={12} /> {task}
            </span>
          ))}
        </div>
      </div>

      {workOrder.hasExpiry && (
        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#7c3aed", display: "flex", alignItems: "center", gap: "5px" }}>
          <Calendar size={14} /> Expected Expiration Date: <strong className="mono">{workOrder.expectedExpiry || "Visible"}</strong>
        </div>
      )}
    </div>
  );
}
