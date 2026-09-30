import React from "react";
import { X, Sliders, RotateCcw, Check, Sparkles } from "lucide-react";

export function QASandboxModal({ 
  isOpen, 
  onClose, 
  qaConfig, 
  setQaConfig, 
  onResetDefaults, 
  onApplyConfig 
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(139, 92, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sliders size={18} color="#8b5cf6" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.1rem", color: "#f8fafc" }}>QA Inspection Sandbox &amp; Thresholds</h2>
              <p style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Calibrate Optical &amp; Spatial Geometric Tolerances</p>
            </div>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: "4px 8px" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", padding: "0.5rem 0" }}>
          
          {/* Curvature Tolerance Slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
              <span style={{ fontWeight: 600, color: "#f8fafc" }}>Surface Curvature Angle Limit</span>
              <span className="mono" style={{ color: "#38bdf8", fontWeight: 700 }}>{qaConfig.curvatureToleranceDeg}°</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="45" 
              step="1"
              value={qaConfig.curvatureToleranceDeg}
              onChange={(e) => setQaConfig(prev => ({ ...prev, curvatureToleranceDeg: parseFloat(e.target.value) }))}
              style={{ accentColor: "#06b6d4" }}
            />
            <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
              GS1 Standard mandates flat placement. Labels bent beyond this angle trigger FAIL for scanner focal distortion.
            </span>
          </div>

          {/* Minimum Contrast Ratio */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
              <span style={{ fontWeight: 600, color: "#f8fafc" }}>Minimum Text Contrast Ratio</span>
              <span className="mono" style={{ color: "#facc15", fontWeight: 700 }}>{qaConfig.minContrastRatio}:1</span>
            </div>
            <input 
              type="range" 
              min="2.0" 
              max="7.0" 
              step="0.5"
              value={qaConfig.minContrastRatio}
              onChange={(e) => setQaConfig(prev => ({ ...prev, minContrastRatio: parseFloat(e.target.value) }))}
              style={{ accentColor: "#facc15" }}
            />
            <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
              WCAG / CPSIA legibility baseline. Warns when ink contrast against dark product is below threshold.
            </span>
          </div>

          {/* Seam Clearance Margin */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
              <span style={{ fontWeight: 600, color: "#f8fafc" }}>Seam Clearance Margin</span>
              <span className="mono" style={{ color: "#818cf8", fontWeight: 700 }}>{qaConfig.seamClearanceMarginInches}"</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="1.5" 
              step="0.1"
              value={qaConfig.seamClearanceMarginInches}
              onChange={(e) => setQaConfig(prev => ({ ...prev, seamClearanceMarginInches: parseFloat(e.target.value) }))}
              style={{ accentColor: "#818cf8" }}
            />
            <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
              Minimum required distance from heat-seal ridges, gusset creases, and bag fold flaps.
            </span>
          </div>

          {/* Epistemic Rigor Toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", background: "rgba(245, 158, 11, 0.08)", borderRadius: "var(--radius-md)", border: "1px dashed rgba(245, 158, 11, 0.3)" }}>
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#fbbf24" }}>
                Strict Epistemic Limitation Enforcement
              </div>
              <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                Force agent to declare UNCERTAIN for non-optically measurable physical gauge (1.5 mil)
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={qaConfig.enforceEpistemics}
              onChange={(e) => setQaConfig(prev => ({ ...prev, enforceEpistemics: e.target.checked }))}
              style={{ width: "18px", height: "18px", accentColor: "#f59e0b", cursor: "pointer" }}
            />
          </div>

        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.85rem" }}>
          <button className="btn-secondary" onClick={onResetDefaults} style={{ gap: "4px" }}>
            <RotateCcw size={14} /> Reset Defaults
          </button>
          
          <button className="btn-primary" onClick={() => { onApplyConfig(); onClose(); }} style={{ gap: "4px" }}>
            <Check size={14} /> Apply Calibration
          </button>
        </div>
      </div>
    </div>
  );
}
