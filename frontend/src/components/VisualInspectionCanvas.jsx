import React, { useState, useEffect } from "react";
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Crosshair, 
  Layers, 
  Compass, 
  Scan, 
  RotateCw, 
  Camera, 
  CheckCircle2, 
  AlertTriangle,
  Upload,
  Sparkles,
  Users,
  ShieldCheck
} from "lucide-react";

export function VisualInspectionCanvas({
  scenario,
  visualEntities,
  isScanning,
  customImageUrl,
  spatialAnalysis,
  activeAngles = ["FRONT"],
  onRequestAngle,
  coachingAdvice,
  reInspection,
  onResolveReInspection,
  multiAgentTeam,
  onTriggerCameraCapture,
  onUploadImage
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLayers, setActiveLayers] = useState({
    polybag: true,
    seams: true,
    warning: true,
    fnsku: true,
    originalBarcode: true,
    expiry: true,
    curvatureRadar: true,
    coachingVectors: true
  });
  const [selectedBox, setSelectedBox] = useState(null);

  // Live Visual Scanning Progress Steps
  const [scanStep, setScanStep] = useState(0);
  const [scanPct, setScanPct] = useState(0);

  useEffect(() => {
    if (isScanning) {
      setScanStep(0);
      setScanPct(15);
      const timer1 = setTimeout(() => { setScanStep(1); setScanPct(38); }, 350);
      const timer2 = setTimeout(() => { setScanStep(2); setScanPct(64); }, 800);
      const timer3 = setTimeout(() => { setScanStep(3); setScanPct(85); }, 1300);
      const timer4 = setTimeout(() => { setScanStep(4); setScanPct(98); }, 1800);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    } else {
      setScanPct(0);
      setScanStep(0);
    }
  }, [isScanning]);

  const toggleLayer = (layerKey) => {
    setActiveLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleZoom = (delta) => {
    setZoomLevel(prev => Math.min(Math.max(prev + delta, 0.75), 2.0));
  };

  const entities = visualEntities || scenario?.visualEntities || {};

  return (
    <div className="center-viewport">
      {/* FEATURE 1: Intelligent Re-Inspection Assistant Prompt */}
      {reInspection?.needed && reInspection?.request && (
        <div style={{
          background: "#fffbeb",
          border: "1.5px solid #f59e0b",
          borderRadius: "var(--radius-md)",
          padding: "0.85rem 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          boxShadow: "0 2px 8px rgba(245, 158, 11, 0.12)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#f59e0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <Camera size={18} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#b45309", letterSpacing: "0.02em" }}>
                📸 INTELLIGENT RE-INSPECTION REQUESTED BY AI
              </div>
              <div style={{ fontSize: "0.88rem", color: "#1e293b", fontWeight: 700, marginTop: "2px" }}>
                {reInspection.request.prompt}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#475569", marginTop: "1px" }}>
                Target: <strong style={{ color: "#0284c7" }}>{reInspection.request.targetArea}</strong> — {reInspection.request.instruction}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <button 
              className="btn-primary" 
              onClick={() => onTriggerCameraCapture?.(reInspection.request.targetArea)}
              style={{ fontSize: "0.8rem", padding: "6px 12px", background: "linear-gradient(135deg, #d97706, #b45309)", color: "#ffffff", fontWeight: 700 }}
              title="Open station camera to capture requested angle"
            >
              <Camera size={14} /> Snap Frame
            </button>

            <label 
              className="btn-secondary" 
              style={{ fontSize: "0.8rem", padding: "6px 12px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "5px" }}
              title="Upload photo for the requested target area"
            >
              <Upload size={14} /> Upload
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: "none" }} 
                onChange={(e) => e.target.files[0] && onUploadImage?.(e.target.files[0], reInspection.request.targetArea)}
              />
            </label>

            <button 
              className="btn-secondary" 
              onClick={() => onResolveReInspection?.(reInspection.request.targetArea)}
              style={{ fontSize: "0.8rem", padding: "6px 12px", borderColor: "#10b981", color: "#047857", background: "#ecfdf5", fontWeight: 700 }}
              title="Simulate follow-up frame to test re-inspection resolution"
            >
              <Sparkles size={14} /> Auto-Resolve
            </button>
          </div>
        </div>
      )}

      {/* FEATURE 2: Multi-Agent Inspection Team Visualizer HUD */}
      {multiAgentTeam && (
        <div style={{
          background: "#ffffff",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          padding: "0.55rem 0.95rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.82rem",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#0f172a", fontWeight: 800 }}>
            <Users size={16} color="#7c3aed" />
            <span>AI SQUAD:</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            {multiAgentTeam.agents?.map((agent, idx) => {
              const isPass = agent.status === "PASS" || agent.status === "CONSENSUS";
              const isFail = agent.status === "FAIL" || agent.status === "CRITIQUE_DISAGREEMENT";
              return (
                <span 
                  key={idx}
                  style={{
                    background: isPass ? "#ecfdf5" : isFail ? "#fef2f2" : "#fffbeb",
                    border: `1px solid ${isPass ? "#10b981" : isFail ? "#ef4444" : "#f59e0b"}`,
                    color: isPass ? "#047857" : isFail ? "#b91c1c" : "#b45309",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: 700
                  }}
                  title={`${agent.name}: ${agent.specialty}`}
                >
                  {agent.name.replace(" Agent", "")}: {agent.status}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Visual Canvas Toolbar */}
      <div className="layer-toolbar">
        <div className="layer-chips">
          <span style={{ color: "#475569", fontWeight: 800, fontSize: "0.8rem", marginRight: "4px" }}>LAYERS:</span>
          
          <button 
            className={`chip ${activeLayers.polybag ? "active" : ""}`}
            onClick={() => toggleLayer("polybag")}
            style={{ borderColor: activeLayers.polybag ? "#0284c7" : "" }}
          >
            📦 Polybag
          </button>
          
          <button 
            className={`chip ${activeLayers.seams ? "active" : ""}`}
            onClick={() => toggleLayer("seams")}
            style={{ borderColor: activeLayers.seams ? "#6366f1" : "" }}
          >
            ⚡ Seam Weld
          </button>

          <button 
            className={`chip ${activeLayers.warning ? "active" : ""}`}
            onClick={() => toggleLayer("warning")}
            style={{ borderColor: activeLayers.warning ? "#d97706" : "" }}
          >
            ⚠️ Warning
          </button>

          <button 
            className={`chip ${activeLayers.fnsku ? "active" : ""}`}
            onClick={() => toggleLayer("fnsku")}
            style={{ borderColor: activeLayers.fnsku ? "#059669" : "" }}
          >
            🏷️ FNSKU
          </button>

          <button 
            className={`chip ${activeLayers.originalBarcode ? "active" : ""}`}
            onClick={() => toggleLayer("originalBarcode")}
            style={{ borderColor: activeLayers.originalBarcode ? "#dc2626" : "" }}
          >
            🔍 UPC Barcode
          </button>

          <button 
            className={`chip ${activeLayers.expiry ? "active" : ""}`}
            onClick={() => toggleLayer("expiry")}
            style={{ borderColor: activeLayers.expiry ? "#9333ea" : "" }}
          >
            📅 Expiry
          </button>

          <button 
            className={`chip ${activeLayers.curvatureRadar ? "active" : ""}`}
            onClick={() => toggleLayer("curvatureRadar")}
            style={{ borderColor: activeLayers.curvatureRadar ? "#ea580c" : "" }}
          >
            📐 Geometry Vector
          </button>

          <button 
            className={`chip ${activeLayers.coachingVectors ? "active" : ""}`}
            onClick={() => toggleLayer("coachingVectors")}
            style={{ borderColor: activeLayers.coachingVectors ? "#0284c7" : "" }}
          >
            🧭 Shift-Left Coach
          </button>
        </div>

        {/* Zoom Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
          <button className="btn-secondary" style={{ padding: "0.35rem 0.65rem" }} onClick={() => handleZoom(-0.25)} title="Zoom Out">
            <ZoomOut size={15} />
          </button>
          <span className="mono" style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155", minWidth: "45px", textAlign: "center" }}>
            {Math.round(zoomLevel * 100)}%
          </span>
          <button className="btn-secondary" style={{ padding: "0.35rem 0.65rem" }} onClick={() => handleZoom(0.25)} title="Zoom In">
            <ZoomIn size={15} />
          </button>
          <button className="btn-secondary" style={{ padding: "0.35rem 0.65rem" }} onClick={() => setZoomLevel(1)} title="Reset Zoom">
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* Quick Test Samples Bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.45rem 0.85rem",
        background: "#f8fafc",
        border: "1px dashed #cbd5e1",
        borderRadius: "var(--radius-md)",
        fontSize: "0.82rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#334155", fontWeight: 700 }}>
          <Sparkles size={15} color="#2563eb" />
          <span>TRY REAL TEST SAMPLES:</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button 
            className="btn-secondary" 
            style={{ fontSize: "0.78rem", padding: "4px 10px", background: "#ffffff", borderColor: "#cbd5e1" }}
            onClick={() => {
              fetch('/samples/sample_1_compliant_polybag.jpg')
                .then(r => r.blob())
                .then(blob => onUploadImage?.(new File([blob], 'sample_1_compliant_polybag.jpg', { type: 'image/jpeg' })));
            }}
            title="Teddy Bear in sealed polybag with suffocation warning & flat FNSKU"
          >
            🧸 1. Compliant Polybag
          </button>
          <button 
            className="btn-secondary" 
            style={{ fontSize: "0.78rem", padding: "4px 10px", background: "#ffffff", borderColor: "#cbd5e1" }}
            onClick={() => {
              fetch('/samples/sample_2_curved_bottle.jpg')
                .then(r => r.blob())
                .then(blob => onUploadImage?.(new File([blob], 'sample_2_curved_bottle.jpg', { type: 'image/jpeg' })));
            }}
            title="Bottle with FNSKU label wrapped over curved cylindrical neck"
          >
            🧴 2. Curved Rim Defect
          </button>
          <button 
            className="btn-secondary" 
            style={{ fontSize: "0.78rem", padding: "4px 10px", background: "#ffffff", borderColor: "#cbd5e1" }}
            onClick={() => {
              fetch('/samples/sample_3_dual_barcode_box.jpg')
                .then(r => r.blob())
                .then(blob => onUploadImage?.(new File([blob], 'sample_3_dual_barcode_box.jpg', { type: 'image/jpeg' })));
            }}
            title="Retail box with exposed manufacturer UPC barcode next to FNSKU"
          >
            📦 3. Dual Barcode Defect
          </button>
        </div>
      </div>

      {/* Main Visual Viewport Container */}
      <div className="viewport-card">
        
        {/* VISUAL REAL-TIME AI ANALYSIS PROGRESS HUD OVERLAY */}
        {isScanning && (
          <>
            {/* Scanning Laser Beam Line */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, transparent, #2563eb, #0284c7, transparent)",
              boxShadow: "0 0 20px #2563eb",
              zIndex: 35,
              animation: "scanBeam 1.8s infinite ease-in-out"
            }} />

            {/* Comprehensive Visual Pipeline HUD */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(6px)",
              zIndex: 30,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
              gap: "1.1rem"
            }}>
              {/* Radar Scanner Icon */}
              <div style={{ position: "relative", width: "68px", height: "68px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: "2px dashed #2563eb",
                  animation: "spin 3s linear infinite"
                }} />
                <div style={{
                  position: "absolute",
                  inset: "6px",
                  borderRadius: "50%",
                  border: "2px solid #0284c7",
                  opacity: 0.6,
                  animation: "pulse-dot 1.5s ease infinite"
                }} />
                <Scan size={30} color="#2563eb" />
              </div>

              {/* Title & Live Percentage Counter */}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                  <span>AI INBOUND VERIFICATION IN PROGRESS</span>
                  <span className="mono" style={{ color: "#2563eb", background: "#eff6ff", padding: "2px 8px", borderRadius: "4px", border: "1px solid #bfdbfe", fontSize: "0.9rem" }}>
                    {scanPct}%
                  </span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "3px", fontWeight: 500 }}>
                  Multi-Agent Optical Perception &amp; Authoritative Audit Pipeline
                </div>
              </div>

              {/* Animated Glowing Progress Bar */}
              <div style={{
                width: "100%",
                maxWidth: "460px",
                height: "9px",
                background: "#e2e8f0",
                borderRadius: "999px",
                overflow: "hidden"
              }}>
                <div style={{
                  width: `${scanPct}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #2563eb, #0284c7, #10b981)",
                  borderRadius: "999px",
                  transition: "width 0.35s ease",
                  boxShadow: "0 0 10px rgba(37, 99, 235, 0.4)"
                }} />
              </div>

              {/* Real-Time Visual Stages Pipeline */}
              <div style={{
                width: "100%",
                maxWidth: "480px",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "var(--radius-md)",
                padding: "0.95rem 1.15rem",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}>
                {[
                  { label: "Optical Ingestion & Normalization", detail: "Enhancing 600x600 reference plane" },
                  { label: "Google Gemini 3.6 Multimodal Vision", detail: "Perceiving polybags, barcodes, FNSKU & text" },
                  { label: "Stage B Spatial Computational Geometry", detail: "Vector solvers for curvature θ & seam margins" },
                  { label: "Groq Cloud Compliance Critic Review", detail: "Adversarial verification against Amazon FBA 2026 rules" },
                  { label: "Proof-of-Prep Cryptographic Ledger", detail: "Synthesizing SHA-256 trust anchor" }
                ].map((stage, idx) => {
                  const isDone = scanStep > idx;
                  const isCurrent = scanStep === idx;
                  return (
                    <div key={idx} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      fontSize: "0.82rem",
                      opacity: isDone || isCurrent ? 1 : 0.4,
                      color: isCurrent ? "#0f172a" : isDone ? "#047857" : "#64748b",
                      fontWeight: isCurrent ? 800 : isDone ? 700 : 500
                    }}>
                      {isDone ? (
                        <CheckCircle2 size={16} color="#10b981" />
                      ) : isCurrent ? (
                        <div className="status-dot" style={{ width: "10px", height: "10px", background: "#2563eb", boxShadow: "0 0 8px #2563eb" }} />
                      ) : (
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", border: "1.5px solid #cbd5e1" }} />
                      )}
                      <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>{stage.label}</span>
                        {isCurrent && (
                          <span style={{ fontSize: "0.72rem", color: "#2563eb", fontWeight: 800, background: "#eff6ff", padding: "1px 7px", borderRadius: "4px" }}>
                            ACTIVE
                          </span>
                        )}
                        {isDone && (
                          <span style={{ fontSize: "0.72rem", color: "#047857", fontWeight: 800 }}>
                            VERIFIED
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Agents Squad Ticker */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "#334155", background: "#f8fafc", padding: "5px 14px", borderRadius: "999px", border: "1px solid #cbd5e1" }}>
                <div className="status-dot" style={{ width: "7px", height: "7px" }} />
                <span>Squad Active: <strong>Packaging</strong> • <strong>Label</strong> • <strong>Barcode</strong> • <strong>Spatial</strong> • <strong>Critic</strong></span>
              </div>
            </div>
          </>
        )}

        {/* SVG or Image Viewport Wrapper */}
        <div 
          className="viewport-svg-wrapper"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {customImageUrl ? (
            <img 
              src={customImageUrl} 
              alt="Custom Inbound Photograph" 
              style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "10px" }}
            />
          ) : scenario?.imageSvg ? (
            <div 
              style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
              dangerouslySetInnerHTML={{ __html: scenario.imageSvg }}
            />
          ) : (
            <div style={{ color: "#64748b", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <Scan size={36} color="#94a3b8" />
              <span style={{ fontSize: "0.92rem", fontWeight: 600 }}>Optical inspection ready</span>
            </div>
          )}

          {/* SPATIAL BOUNDING BOX OVERLAYS (600x600 coordinate reference) */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            
            {/* 1. Polybag Box */}
            {activeLayers.polybag && entities.polybag?.bbox && (
              <div 
                className="bbox-marker"
                style={{
                  left: `${(entities.polybag.bbox.x / 600) * 100}%`,
                  top: `${(entities.polybag.bbox.y / 600) * 100}%`,
                  width: `${(entities.polybag.bbox.w / 600) * 100}%`,
                  height: `${(entities.polybag.bbox.h / 600) * 100}%`,
                  border: "2px dashed #0284c7",
                  background: "rgba(2, 132, 199, 0.08)"
                }}
              >
                <div className="bbox-marker-label" style={{ background: "#0284c7", color: "#ffffff" }}>
                  📦 POLYBAG [{entities.polybag.openingWidthInches || 10}"]
                </div>
              </div>
            )}

            {/* 2. Seam Box */}
            {activeLayers.seams && entities.seam?.bbox && (
              <div 
                className="bbox-marker"
                style={{
                  left: `${(entities.seam.bbox.x / 600) * 100}%`,
                  top: `${(entities.seam.bbox.y / 600) * 100}%`,
                  width: `${(entities.seam.bbox.w / 600) * 100}%`,
                  height: `${(entities.seam.bbox.h / 600) * 100}%`,
                  border: "2px solid #6366f1",
                  background: "rgba(99, 102, 241, 0.12)"
                }}
              >
                <div className="bbox-marker-label" style={{ background: "#6366f1", color: "#ffffff" }}>
                  ⚡ HEAT-SEAL RIDGE
                </div>
              </div>
            )}

            {/* 3. Suffocation Warning Box */}
            {activeLayers.warning && entities.suffocationWarning?.bbox && (
              <div 
                className="bbox-marker"
                style={{
                  left: `${(entities.suffocationWarning.bbox.x / 600) * 100}%`,
                  top: `${(entities.suffocationWarning.bbox.y / 600) * 100}%`,
                  width: `${(entities.suffocationWarning.bbox.w / 600) * 100}%`,
                  height: `${(entities.suffocationWarning.bbox.h / 600) * 100}%`,
                  border: entities.suffocationWarning.legible === false ? "2.5px solid #ef4444" : "2.5px solid #d97706",
                  background: entities.suffocationWarning.legible === false ? "rgba(239, 68, 68, 0.15)" : "rgba(217, 119, 6, 0.12)"
                }}
              >
                <div className="bbox-marker-label" style={{ 
                  background: entities.suffocationWarning.legible === false ? "#ef4444" : "#d97706", 
                  color: "#ffffff" 
                }}>
                  ⚠️ WARNING {entities.suffocationWarning.legible === false ? "[FAIL: ILLEGIBLE]" : `[${entities.suffocationWarning.fontSizePt || 14}pt PASS]`}
                </div>
              </div>
            )}

            {/* 4. FNSKU Label Box */}
            {activeLayers.fnsku && entities.fnskuLabel?.bbox && (
              <div 
                className="bbox-marker"
                style={{
                  left: `${(entities.fnskuLabel.bbox.x / 600) * 100}%`,
                  top: `${(entities.fnskuLabel.bbox.y / 600) * 100}%`,
                  width: `${(entities.fnskuLabel.bbox.w / 600) * 100}%`,
                  height: `${(entities.fnskuLabel.bbox.h / 600) * 100}%`,
                  border: (entities.fnskuLabel.curvatureAngleDeg > 15 || entities.fnskuLabel.onFoldOrSeam) ? "2.5px solid #ef4444" : "2.5px solid #10b981",
                  background: (entities.fnskuLabel.curvatureAngleDeg > 15 || entities.fnskuLabel.onFoldOrSeam) ? "rgba(239, 68, 68, 0.18)" : "rgba(16, 185, 129, 0.12)"
                }}
              >
                <div className="bbox-marker-label" style={{ 
                  background: (entities.fnskuLabel.curvatureAngleDeg > 15 || entities.fnskuLabel.onFoldOrSeam) ? "#ef4444" : "#10b981", 
                  color: "#ffffff" 
                }}>
                  🏷️ FNSKU: {entities.fnskuLabel.code || "X00..."} {entities.fnskuLabel.curvatureAngleDeg > 15 ? `[FAIL: ${entities.fnskuLabel.curvatureAngleDeg}° CURVED]` : "[FLAT PASS]"}
                </div>
              </div>
            )}

            {/* 5. Original Barcode (UPC) Box */}
            {activeLayers.originalBarcode && entities.originalBarcode?.bbox && (
              <div 
                className="bbox-marker"
                style={{
                  left: `${(entities.originalBarcode.bbox.x / 600) * 100}%`,
                  top: `${(entities.originalBarcode.bbox.y / 600) * 100}%`,
                  width: `${(entities.originalBarcode.bbox.w / 600) * 100}%`,
                  height: `${(entities.originalBarcode.bbox.h / 600) * 100}%`,
                  border: entities.originalBarcode.exposedUpcFound ? "2.5px solid #ef4444" : "2px dashed #64748b",
                  background: entities.originalBarcode.exposedUpcFound ? "rgba(239, 68, 68, 0.22)" : "transparent"
                }}
              >
                <div className="bbox-marker-label" style={{ 
                  background: entities.originalBarcode.exposedUpcFound ? "#ef4444" : "#475569", 
                  color: "#ffffff" 
                }}>
                  {entities.originalBarcode.exposedUpcFound ? "🚨 EXPOSED UPC [FAIL: UNCOVERED]" : "✓ UPC COVERED"}
                </div>
              </div>
            )}

            {/* 6. Expiry Date Box */}
            {activeLayers.expiry && entities.expiryDate?.bbox && (
              <div 
                className="bbox-marker"
                style={{
                  left: `${(entities.expiryDate.bbox.x / 600) * 100}%`,
                  top: `${(entities.expiryDate.bbox.y / 600) * 100}%`,
                  width: `${(entities.expiryDate.bbox.w / 600) * 100}%`,
                  height: `${(entities.expiryDate.bbox.h / 600) * 100}%`,
                  border: entities.expiryDate.covered ? "2.5px solid #ef4444" : "2px solid #7c3aed",
                  background: entities.expiryDate.covered ? "rgba(239, 68, 68, 0.18)" : "rgba(124, 58, 237, 0.12)"
                }}
              >
                <div className="bbox-marker-label" style={{ 
                  background: entities.expiryDate.covered ? "#ef4444" : "#7c3aed", 
                  color: "#ffffff" 
                }}>
                  📅 EXPIRY {entities.expiryDate.covered ? "[FAIL: COVERED BY LABEL]" : "[VISIBLE PASS]"}
                </div>
              </div>
            )}

            {/* Feature 5: Pre-Shipment Live Coaching Pointer Overlay on Canvas */}
            {activeLayers.coachingVectors && entities.fnskuLabel?.curvatureAngleDeg > 15 && (
              <div style={{
                position: "absolute",
                left: "260px",
                top: "160px",
                padding: "8px 12px",
                background: "#0284c7",
                color: "#ffffff",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.78rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 15px rgba(2, 132, 199, 0.35)",
                pointerEvents: "auto"
              }}>
                <RotateCw size={14} />
                <span>COACHING: Rotate 90° Clockwise to Flatten</span>
              </div>
            )}

            {/* Feature 3: Spatial Computational Geometry HUD Radar */}
            {activeLayers.curvatureRadar && entities.fnskuLabel && (
              <div style={{
                position: "absolute",
                bottom: "16px",
                right: "16px",
                padding: "10px 14px",
                background: "#ffffff",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                pointerEvents: "auto",
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                display: "flex",
                flexDirection: "column",
                gap: "5px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#2563eb", fontWeight: 800 }}>
                  <Crosshair size={14} /> STAGE B: COMPUTATIONAL GEOMETRY
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                  <span style={{ color: "#64748b" }}>Surface Vector Angle:</span>
                  <span style={{ 
                    color: (entities.fnskuLabel.curvatureAngleDeg || 0) > 15 ? "#b91c1c" : "#047857",
                    fontWeight: 700
                  }}>
                    {(entities.fnskuLabel.curvatureAngleDeg || 0).toFixed(1)}° {(entities.fnskuLabel.curvatureAngleDeg || 0) > 15 ? "(EXCEEDS 15°)" : "(FLAT OK)"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                  <span style={{ color: "#64748b" }}>Seam Margin Buffer:</span>
                  <span style={{ 
                    color: entities.fnskuLabel.onFoldOrSeam ? "#b91c1c" : "#047857",
                    fontWeight: 700
                  }}>
                    {entities.fnskuLabel.seamDistanceInches !== undefined ? `${entities.fnskuLabel.seamDistanceInches}"` : "N/A"} {entities.fnskuLabel.onFoldOrSeam ? "(SEAM OVERLAP!)" : "(> 0.5\")"}
                  </span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Feature 11: Multi-Angle Active Evidence Bar (Front / Back / Seam Detail) */}
        <div style={{
          position: "absolute",
          bottom: "12px",
          left: "12px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(255, 255, 255, 0.95)",
          padding: "6px 12px",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-medium)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          zIndex: 20
        }}>
          <span style={{ fontSize: "0.78rem", color: "#475569", fontWeight: 800 }}>ANGLES:</span>
          
          <button 
            className="chip active"
            style={{ fontSize: "0.78rem", padding: "3px 10px", borderColor: "#10b981", color: "#047857", background: "#ecfdf5", fontWeight: 700 }}
          >
            ✓ Front (Primary)
          </button>

          {activeAngles.includes("BACK") ? (
            <button 
              className="chip active"
              style={{ fontSize: "0.78rem", padding: "3px 10px", borderColor: "#10b981", color: "#047857", background: "#ecfdf5", fontWeight: 700 }}
            >
              ✓ Back (Verified)
            </button>
          ) : (
            <button 
              className="btn-secondary"
              onClick={() => onRequestAngle?.("BACK")}
              style={{ fontSize: "0.78rem", padding: "3px 10px", background: "#fffbeb", borderColor: "#f59e0b", color: "#b45309", fontWeight: 700 }}
              title="Request active evidence: capture reverse angle to verify UPC barcode coverage"
            >
              + Ingest Back Angle (Resolve UPC)
            </button>
          )}
        </div>

        {/* HUD Crosshairs Overlay */}
        <div style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          fontSize: "0.76rem",
          fontWeight: 700,
          fontFamily: "var(--font-mono)",
          color: "#2563eb",
          background: "rgba(255, 255, 255, 0.92)",
          padding: "5px 10px",
          borderRadius: "6px",
          border: "1px solid #bfdbfe",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          pointerEvents: "none"
        }}>
          OPTICAL PIPELINE: MULTI-AGENT CASCADE &amp; GEOMETRIC INTEGRITY
        </div>

      </div>
    </div>
  );
}
