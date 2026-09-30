import React, { useState } from "react";
import { 
  X, 
  Key, 
  Check, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Server, 
  Compass, 
  RefreshCw,
  AlertTriangle,
  Layers
} from "lucide-react";

export function ApiKeyModal({ 
  isOpen, 
  onClose, 
  geminiKey, 
  setGeminiKey,
  groqKey, 
  setGroqKey,
  groqModel, 
  setGroqModel,
  ollamaUrl, 
  setOllamaUrl,
  ollamaModel, 
  setOllamaModel,
  activeEngine, 
  setActiveEngine
}) {
  const [localGeminiKey, setLocalGeminiKey] = useState(geminiKey || "");
  const [localGroqKey, setLocalGroqKey] = useState(groqKey || "");
  const [localGroqModel, setLocalGroqModel] = useState(groqModel || "qwen/qwen3.8-27b");
  const [localOllamaUrl, setLocalOllamaUrl] = useState(ollamaUrl || "http://localhost:11434");
  const [localOllamaModel, setLocalOllamaModel] = useState(ollamaModel || "llama3.2-vision");
  const [localEngine, setLocalEngine] = useState(activeEngine || "auto");

  // Test states
  const [testResults, setTestResults] = useState({});
  const [testingProvider, setTestingProvider] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async (provider) => {
    setTestingProvider(provider);
    try {
      const payload = {
        provider,
        apiKey: provider === "gemini" ? localGeminiKey : provider === "groq" ? localGroqKey : undefined,
        groqModel: localGroqModel,
        ollamaUrl: localOllamaUrl,
        ollamaModel: localOllamaModel
      };

      const res = await fetch("/api/models/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setTestResults(prev => ({
        ...prev,
        [provider]: data
      }));
    } catch (err) {
      setTestResults(prev => ({
        ...prev,
        [provider]: { success: false, message: err.message }
      }));
    } finally {
      setTestingProvider(null);
    }
  };

  const handleSave = () => {
    setGeminiKey(localGeminiKey.trim());
    setGroqKey(localGroqKey.trim());
    setGroqModel(localGroqModel);
    setOllamaUrl(localOllamaUrl.trim());
    setOllamaModel(localOllamaModel.trim());
    setActiveEngine(localEngine);

    localStorage.setItem("aeroprep_gemini_key", localGeminiKey.trim());
    localStorage.setItem("aeroprep_groq_key", localGroqKey.trim());
    localStorage.setItem("aeroprep_groq_model", localGroqModel);
    localStorage.setItem("aeroprep_ollama_url", localOllamaUrl.trim());
    localStorage.setItem("aeroprep_ollama_model", localOllamaModel.trim());
    localStorage.setItem("aeroprep_active_engine", localEngine);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", padding: "1.75rem", background: "#ffffff", color: "#0f172a" }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #bfdbfe" }}>
              <Cpu size={24} color="#2563eb" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.3rem", color: "#0f172a", margin: 0, fontWeight: 800 }}>
                AI Vision Models &amp; Spatial Geometry Engine Hub
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0, fontWeight: 500 }}>
                Configure Gemini 3.5 Flash, Groq Compliance Critic, Ollama Local Vision, and 2-Stage Spatial Solvers
              </p>
            </div>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: "6px 10px" }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginTop: "1rem" }}>
          
          {/* Architectural Explanation Banner */}
          <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", padding: "1rem 1.25rem", borderRadius: "var(--radius-md)", fontSize: "0.85rem", color: "#334155", lineHeight: 1.5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#2563eb", fontWeight: 800, marginBottom: "4px" }}>
              <Layers size={18} /> 4-Tier Resilient Verification Architecture
            </div>
            All visual detections pass through the built-in <strong>Stage B Spatial Computational Geometry Engine</strong> to calculate curvature $\theta$, seam clearance $\Delta d$, and IoU suppression. If cloud APIs are unavailable, the station gracefully cascades down to <strong>local Ollama</strong> or <strong>zero-token spatial solvers</strong>.
          </div>

          {/* Active Engine Selector */}
          <div>
            <label style={{ fontSize: "0.85rem", color: "#475569", display: "block", marginBottom: "8px", fontWeight: 700 }}>
              ACTIVE INFERENCE ENGINE ROUTING:
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "10px" }}>
              {[
                { id: "auto", name: "⚡ Auto Cascade", desc: "Gemini 3.5 → Groq Critic → Spatial", color: "#2563eb" },
                { id: "gemini", name: "🔷 Google Gemini", desc: "Gemini 3.5 Flash Multimodal Vision", color: "#0284c7" },
                { id: "groq", name: "⚡ Groq Critic", desc: "Qwen 3.8 / Llama Critic (Ultra-Fast)", color: "#d97706" },
                { id: "ollama", name: "🦙 Ollama Local", desc: "Local Offline Private Fallback", color: "#059669" },
                { id: "spatial", name: "📐 Spatial Engine Only", desc: "Deterministic Computational Geometry", color: "#7c3aed" }
              ].map(opt => (
                <div 
                  key={opt.id}
                  onClick={() => setLocalEngine(opt.id)}
                  style={{
                    padding: "0.75rem 0.95rem",
                    borderRadius: "var(--radius-md)",
                    background: localEngine === opt.id ? "#eff6ff" : "#ffffff",
                    border: localEngine === opt.id ? `2px solid ${opt.color}` : "1px solid #cbd5e1",
                    cursor: "pointer",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.88rem", fontWeight: 800, color: localEngine === opt.id ? opt.color : "#0f172a" }}>
                      {opt.name}
                    </span>
                    {localEngine === opt.id && <Check size={16} color={opt.color} />}
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "#64748b", marginTop: "3px", fontWeight: 500 }}>
                    {opt.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Provider 1: Google Gemini API */}
          <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "var(--radius-md)", padding: "1.1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.1rem" }}>🔷</span>
                <span style={{ fontSize: "0.92rem", fontWeight: 800, color: "#0284c7" }}>Google Gemini Multimodal Vision</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "2px 8px", background: "#eff6ff", borderRadius: "4px", color: "#2563eb", border: "1px solid #bfdbfe" }}>
                  gemini-3.5-flash (with auto-fallback to 2.5)
                </span>
              </div>
              <button 
                className="btn-secondary" 
                onClick={() => handleTestConnection("gemini")}
                disabled={testingProvider === "gemini"}
                style={{ fontSize: "0.8rem", padding: "4px 10px" }}
              >
                {testingProvider === "gemini" ? <RefreshCw size={14} className="spin" /> : <Zap size={14} color="#2563eb" />}
                <span>Test Gemini</span>
              </button>
            </div>
            
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input 
                type="password"
                value={localGeminiKey}
                onChange={(e) => setLocalGeminiKey(e.target.value)}
                placeholder="AIzaSy... (Paste Gemini API Key)"
                style={{
                  flex: 1,
                  padding: "0.65rem 0.85rem",
                  background: "#ffffff",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: "var(--radius-sm)",
                  color: "#0f172a",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  outline: "none"
                }}
              />
            </div>

            {testResults.gemini && (
              <div style={{
                marginTop: "8px",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.82rem",
                fontWeight: 600,
                background: testResults.gemini.success ? "#ecfdf5" : "#fef2f2",
                border: `1px solid ${testResults.gemini.success ? "#10b981" : "#ef4444"}`,
                color: testResults.gemini.success ? "#047857" : "#b91c1c"
              }}>
                {testResults.gemini.success ? "✓ " : "✕ "} {testResults.gemini.message}
              </div>
            )}
          </div>

          {/* Provider 2: Groq Cloud API */}
          <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "var(--radius-md)", padding: "1.1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.1rem" }}>⚡</span>
                <span style={{ fontSize: "0.92rem", fontWeight: 800, color: "#d97706" }}>Groq Compliance Critic &amp; Reasoner</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "2px 8px", background: "#fffbeb", borderRadius: "4px", color: "#b45309", border: "1px solid #fcd34d" }}>
                  qwen/qwen3.8-27b
                </span>
              </div>
              <button 
                className="btn-secondary" 
                onClick={() => handleTestConnection("groq")}
                disabled={testingProvider === "groq"}
                style={{ fontSize: "0.8rem", padding: "4px 10px" }}
              >
                {testingProvider === "groq" ? <RefreshCw size={14} className="spin" /> : <Zap size={14} color="#d97706" />}
                <span>Test Groq</span>
              </button>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input 
                type="password"
                value={localGroqKey}
                onChange={(e) => setLocalGroqKey(e.target.value)}
                placeholder="gsk_... (Paste Groq API Key)"
                style={{
                  flex: 1,
                  padding: "0.65rem 0.85rem",
                  background: "#ffffff",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: "var(--radius-sm)",
                  color: "#0f172a",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  outline: "none"
                }}
              />
            </div>

            {testResults.groq && (
              <div style={{
                marginTop: "8px",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.82rem",
                fontWeight: 600,
                background: testResults.groq.success ? "#ecfdf5" : "#fef2f2",
                border: `1px solid ${testResults.groq.success ? "#10b981" : "#ef4444"}`,
                color: testResults.groq.success ? "#047857" : "#b91c1c"
              }}>
                {testResults.groq.success ? "✓ " : "✕ "} {testResults.groq.message}
              </div>
            )}
          </div>

          {/* Provider 3: Ollama Local */}
          <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "var(--radius-md)", padding: "1.1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.1rem" }}>🦙</span>
                <span style={{ fontSize: "0.92rem", fontWeight: 800, color: "#059669" }}>Ollama Local Vision Daemon (Offline Private Fallback)</span>
              </div>
              <button 
                className="btn-secondary" 
                onClick={() => handleTestConnection("ollama")}
                disabled={testingProvider === "ollama"}
                style={{ fontSize: "0.8rem", padding: "4px 10px" }}
              >
                {testingProvider === "ollama" ? <RefreshCw size={14} className="spin" /> : <Server size={14} color="#059669" />}
                <span>Test Ollama</span>
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "10px" }}>
              <input 
                type="text"
                value={localOllamaUrl}
                onChange={(e) => setLocalOllamaUrl(e.target.value)}
                placeholder="http://localhost:11434"
                style={{
                  padding: "0.65rem 0.85rem",
                  background: "#ffffff",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: "var(--radius-sm)",
                  color: "#0f172a",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  outline: "none"
                }}
              />
              <input 
                type="text"
                value={localOllamaModel}
                onChange={(e) => setLocalOllamaModel(e.target.value)}
                placeholder="llama3.2-vision"
                style={{
                  padding: "0.65rem 0.85rem",
                  background: "#ffffff",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: "var(--radius-sm)",
                  color: "#0f172a",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  outline: "none"
                }}
              />
            </div>

            {testResults.ollama && (
              <div style={{
                marginTop: "8px",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.82rem",
                fontWeight: 600,
                background: testResults.ollama.success ? "#ecfdf5" : "#fef2f2",
                border: `1px solid ${testResults.ollama.success ? "#10b981" : "#ef4444"}`,
                color: testResults.ollama.success ? "#047857" : "#b91c1c"
              }}>
                {testResults.ollama.success ? "✓ " : "✕ "} {testResults.ollama.message}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", marginTop: "0.5rem" }}>
            <button className="btn-secondary" onClick={onClose} style={{ padding: "0.65rem 1.25rem", fontSize: "0.88rem" }}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave} style={{ padding: "0.65rem 1.5rem", fontSize: "0.88rem" }}>
              {savedSuccess ? <><Check size={16} /> Saved Successfully!</> : "Save & Apply Routing"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
