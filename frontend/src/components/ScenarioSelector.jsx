import React, { useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Upload, 
  Camera, 
  Search, 
  Package, 
  Tag, 
  AlertTriangle,
  Sparkles
} from "lucide-react";

export function ScenarioSelector({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  onUploadImage,
  onTriggerCameraCapture,
  isAnalyzing
}) {
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredScenarios = scenarios.filter(sc => {
    const matchesFilter = 
      filter === "ALL" || 
      (filter === "PASS" && sc.expectedVerdict === "PASS") ||
      (filter === "FAIL" && sc.expectedVerdict === "FAIL") ||
      (filter === "UNCERTAIN" && sc.expectedVerdict === "UNCERTAIN");

    const matchesSearch = 
      sc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sc.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sc.productCategory.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUploadImage(file);
    }
  };

  return (
    <div className="left-sidebar">
      {/* Station Inbound Capture Card */}
      <div className="glass-panel" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: "0.85rem", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "6px" }}>
            <Camera size={15} /> Inbound Scanner Ingestion
          </h3>
          <span className="mono" style={{ fontSize: "0.7rem", color: "#64748b" }}>STATION 04</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {/* File Upload Button */}
          <label className="btn-secondary" style={{ cursor: "pointer", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <Upload size={14} color="#06b6d4" />
            <span>Upload Photo</span>
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: "none" }} 
              onChange={handleFileUpload}
              disabled={isAnalyzing}
            />
          </label>

          {/* Live Camera Button */}
          <button 
            className="btn-secondary" 
            onClick={onTriggerCameraCapture}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
            disabled={isAnalyzing}
          >
            <Camera size={14} color="#10b981" />
            <span>Live Camera</span>
          </button>
        </div>
      </div>

      {/* Test Scenarios Suite Header */}
      <div className="glass-panel" style={{ padding: "0.85rem", display: "flex", flexDirection: "column", gap: "0.65rem", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: "0.9rem", color: "#f8fafc", display: "flex", alignItems: "center", gap: "6px" }}>
              <Package size={16} color="#8b5cf6" /> Test Scenarios Suite
            </h3>
            <p style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Authoritative Test Scenarios ({scenarios.length} Matrix)</p>
          </div>
          <span className="badge-pass" style={{ fontSize: "0.65rem" }}>FBA 2026 Ready</span>
        </div>

        {/* Search input */}
        <div style={{ position: "relative" }}>
          <Search size={13} color="#64748b" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text"
            placeholder="Search SKU, error, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.45rem 0.65rem 0.45rem 2rem",
              background: "rgba(0, 0, 0, 0.3)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              color: "#f8fafc",
              fontSize: "0.75rem",
              outline: "none"
            }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", gap: "0.35rem" }}>
          {["ALL", "PASS", "FAIL", "UNCERTAIN"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`chip ${filter === f ? "active" : ""}`}
              style={{ flex: 1, textAlign: "center", padding: "0.25rem 0.2rem", fontSize: "0.68rem" }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Scenarios List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", overflowY: "auto", maxHeight: "calc(100vh - 290px)", paddingRight: "4px" }}>
          {filteredScenarios.map((sc, idx) => {
            const isSelected = sc.id === selectedScenarioId;
            return (
              <div 
                key={sc.id}
                onClick={() => onSelectScenario(sc.id)}
                className={`scenario-item ${isSelected ? "active" : ""}`}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: isSelected ? "#38bdf8" : "#e2e8f0" }}>
                    #{idx + 1} {sc.productName}
                  </span>
                  
                  {sc.expectedVerdict === "PASS" && (
                    <span className="badge-pass">
                      <CheckCircle2 size={11} /> PASS
                    </span>
                  )}
                  {sc.expectedVerdict === "FAIL" && (
                    <span className="badge-fail">
                      <XCircle size={11} /> FAIL
                    </span>
                  )}
                  {sc.expectedVerdict === "UNCERTAIN" && (
                    <span className="badge-uncertain">
                      <HelpCircle size={11} /> UNCERTAIN
                    </span>
                  )}
                </div>

                <div style={{ fontSize: "0.69rem", color: "#94a3b8", lineHeight: 1.25 }}>
                  {sc.subtitle}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.65rem", color: "#64748b", marginTop: "2px" }}>
                  <span className="mono">{sc.productCategory}</span>
                  <span className="mono" style={{ color: "#38bdf8" }}>{sc.workOrderId}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
