import React, { useState } from "react";
import { X, UserCheck, MessageSquare, Check, AlertCircle } from "lucide-react";

export function OperatorOverrideModal({ isOpen, onClose, currentScenario, workOrder, onOverrideSuccess }) {
  const [overrideVerdict, setOverrideVerdict] = useState("PASS");
  const [reasonCategory, setReasonCategory] = useState("TACTILE_VERIFIED");
  const [customNotes, setCustomNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullReason = `${reasonCategory}: ${customNotes || 'Human operator visual inspection confirmed compliance under warehouse floor lighting.'}`;

    fetch("/api/override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inspectionId: `INSP-OVR-${Date.now().toString().slice(-4)}`,
        sku: workOrder?.sku || currentScenario?.productName,
        operatorId: workOrder?.operator || "Operator A (Station 04)",
        overrideVerdict,
        reason: fullReason
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsSubmitting(false);
        onOverrideSuccess?.(data);
        onClose();
      })
      .catch(err => {
        console.error("Error submitting override:", err);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(245, 158, 11, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UserCheck size={18} color="#f59e0b" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.1rem", color: "#f8fafc" }}>Human Operator Override (HITL Loop)</h2>
              <p style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Continuous Calibration &amp; Review Queue Feedback</p>
            </div>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: "4px 8px" }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ fontSize: "0.78rem", color: "#cbd5e1" }}>
            Provide floor justification to override the AI optical verdict. Logged entries train and calibrate edge-case confidence thresholds.
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block", marginBottom: "4px" }}>
              OVERRIDE VERDICT TO:
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setOverrideVerdict("PASS")}
                className={`btn-secondary ${overrideVerdict === "PASS" ? "active" : ""}`}
                style={{ flex: 1, borderColor: overrideVerdict === "PASS" ? "#10b981" : "", background: overrideVerdict === "PASS" ? "rgba(16, 185, 129, 0.2)" : "" }}
              >
                PASS (Override Failure)
              </button>
              <button
                type="button"
                onClick={() => setOverrideVerdict("FAIL")}
                className={`btn-secondary ${overrideVerdict === "FAIL" ? "active" : ""}`}
                style={{ flex: 1, borderColor: overrideVerdict === "FAIL" ? "#ef4444" : "", background: overrideVerdict === "FAIL" ? "rgba(239, 68, 68, 0.2)" : "" }}
              >
                FAIL (Manual Rejection)
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block", marginBottom: "4px" }}>
              REASON CATEGORY:
            </label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "0.55rem 0.75rem",
                background: "#020617",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                color: "#f8fafc",
                fontSize: "0.8rem",
                outline: "none"
              }}
            >
              <option value="TACTILE_VERIFIED">Physical micrometer gauge confirmed 1.5 mil bag thickness</option>
              <option value="REAR_SURFACE_VERIFIED">Secondary warning sticker or barcode confirmed on rear face</option>
              <option value="OPTICAL_SHADOW_ARTIFACT">Camera flash or lighting shadow caused false seam contour</option>
              <option value="CURVATURE_WITHIN_TOLERANCE">Handheld laser scanner read barcode successfully in 1 pass</option>
              <option value="SUPERVISOR_SPECIAL_DISPENSATION">Warehouse Quality Supervisor signed off exception waiver</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block", marginBottom: "4px" }}>
              OPERATOR NOTES / REMARKS:
            </label>
            <textarea
              rows="3"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. Verified with caliper: 1.6 mil. Barcode scanned cleanly with Honeywell Xenon 1950g."
              style={{
                width: "100%",
                padding: "0.55rem 0.75rem",
                background: "#020617",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                color: "#f8fafc",
                fontSize: "0.8rem",
                outline: "none",
                fontFamily: "var(--font-sans)"
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.85rem" }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              <Check size={14} /> Commit Human Override
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
