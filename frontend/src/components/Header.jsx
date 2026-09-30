import React from "react";
import { 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  BarChart3, 
  Sliders, 
  Layers,
  Lock,
  Users,
  FileText,
  Sparkles
} from "lucide-react";

export function Header({ 
  activeStandard, 
  setActiveStandard, 
  audioEnabled, 
  setAudioEnabled,
  onOpenRules,
  onOpenAnalytics,
  onOpenSandbox,
  onOpenDisputePack,
  onOpenBatchClusters,
  onOpenLedger,
  apiKey,
  activeEngine = "auto",
  onOpenApiKeyModal
}) {

  return (
    <header className="app-header">
      <div className="logo-group">
        <div className="logo-badge">
          <ShieldCheck size={26} color="#ffffff" />
        </div>
        <div className="brand-text">
          <h1>
            AeroPrep AI <span className="version-tag">STATION v3.0</span>
          </h1>
          <p>Autonomous Fulfillment Compliance, Vision Multi-Agent &amp; Audit Defense</p>
        </div>
      </div>

      <div className="station-meta-hud">
        {/* Compliance Standard Selector */}
        <div className="meta-pill" style={{ padding: "0.35rem 0.75rem" }}>
          <Layers size={16} color="#2563eb" />
          <select 
            value={activeStandard}
            onChange={(e) => setActiveStandard(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "#0f172a",
              fontSize: "0.85rem",
              fontWeight: 600,
              fontFamily: "var(--font-sans)",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="amazon-fba-2026" style={{ background: "#ffffff", color: "#0f172a" }}>Amazon FBA Inbound Standard (2026)</option>
            <option value="walmart-wfs" style={{ background: "#ffffff", color: "#0f172a" }}>Walmart WFS Prep Matrix</option>
            <option value="astm-commercial" style={{ background: "#ffffff", color: "#0f172a" }}>ASTM D3951 Commercial Packaging</option>
          </select>
        </div>

        {/* Audio PA Voice Toggle */}
        <button 
          className="meta-pill" 
          onClick={() => setAudioEnabled(!audioEnabled)}
          style={{ cursor: "pointer", border: audioEnabled ? "1px solid #2563eb" : "1px solid var(--border-subtle)" }}
          title={audioEnabled ? "Warehouse Voice Announcer Active" : "Warehouse Voice Announcer Muted"}
        >
          {audioEnabled ? (
            <>
              <Volume2 size={16} color="#2563eb" />
              <span style={{ color: "#2563eb", fontWeight: 700 }}>PA Voice: ON</span>
            </>
          ) : (
            <>
              <VolumeX size={16} color="#64748b" />
              <span style={{ fontWeight: 600 }}>PA Voice: OFF</span>
            </>
          )}
        </button>

        {/* Dispute Defense Pack */}
        <button className="btn-secondary" onClick={onOpenDisputePack} style={{ borderColor: "#bfdbfe" }}>
          <FileText size={15} color="#2563eb" />
          <span>Dispute Pack</span>
        </button>

        {/* Batch Clusters */}
        <button className="btn-secondary" onClick={onOpenBatchClusters} style={{ borderColor: "#ddd6fe" }}>
          <Users size={15} color="#7c3aed" />
          <span>Batch Clusters</span>
        </button>

        {/* Immutable Provenance Ledger */}
        <button className="btn-secondary" onClick={onOpenLedger} style={{ borderColor: "#a7f3d0" }}>
          <Lock size={15} color="#059669" />
          <span>Ledger Proof</span>
        </button>

        {/* Rulebook Explorer */}
        <button className="btn-secondary" onClick={onOpenRules}>
          <BookOpen size={15} color="#0284c7" />
          <span>Rulebook</span>
        </button>

        {/* QA Sandbox */}
        <button className="btn-secondary" onClick={onOpenSandbox}>
          <Sliders size={15} color="#d97706" />
          <span>QA Config</span>
        </button>

        {/* AI Multi-Model & Spatial Hub Button */}
        <button 
          className="btn-secondary" 
          onClick={onOpenApiKeyModal}
          style={{ 
            borderColor: "#bfdbfe",
            background: "#eff6ff"
          }}
          title="Configure Gemini 3.5 Flash, Groq Cloud, Ollama Offline, and Spatial Engine"
        >
          <Sparkles size={15} color="#2563eb" />
          <span style={{ color: "#1d4ed8", fontWeight: 700 }}>
            {activeEngine === "auto" ? "Gemini 3.5 + Groq" : activeEngine === "gemini" ? "Gemini 3.5 Flash" : activeEngine === "groq" ? "Groq Critic" : activeEngine === "ollama" ? "Ollama Local" : "Spatial Engine"}
          </span>
        </button>

        {/* Station Online Health */}
        <div className="meta-pill">
          <div className="status-dot"></div>
          <span className="mono" style={{ color: "#059669", fontWeight: 700 }}>ONLINE</span>
          <span style={{ color: "#64748b", fontWeight: 600 }}>| OP-42</span>
        </div>
      </div>
    </header>
  );
}
