import React, { useState } from "react";
import { X, ShieldCheck, Download, Copy, Check, FileText, ExternalLink } from "lucide-react";

export function DisputePacketModal({ isOpen, onClose, disputePacket }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !disputePacket) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(disputePacket.disputeSubmissionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([disputePacket.disputeSubmissionText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AeroPrep-Inbound-Dispute-${disputePacket.disputePacketId}.txt`;
    a.click();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "760px" }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={18} color="#06b6d4" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.1rem", color: "#f8fafc" }}>Inbound Defect Appeal &amp; Dispute Pack</h2>
              <p style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Amazon Seller Central &amp; WFS Inbound Chargeback Defense</p>
            </div>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: "4px 8px" }}>
            <X size={16} />
          </button>
        </div>

        {/* Info Banner */}
        <div style={{ background: "rgba(6, 182, 212, 0.08)", border: "1px solid rgba(6, 182, 212, 0.25)", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", fontSize: "0.78rem", color: "#e2e8f0" }}>
          <strong>Audit Defense System:</strong> When Amazon FBA or Walmart WFS mistakenly assesses unplanned prep fees ($0.30–$1.85/unit) weeks after receiving, this cryptographic defense packet provides conclusive optical proof of pre-shipment compliance.
        </div>

        {/* Pre-formatted Dispute Letter Box */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
            <span style={{ color: "#94a3b8", fontWeight: 600 }}>SUBMISSION-READY DISPUTE BRIEF</span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn-secondary" onClick={handleCopy} style={{ padding: "3px 8px", fontSize: "0.7rem" }}>
                {copied ? <><Check size={12} color="#10b981" /> Copied!</> : <><Copy size={12} /> Copy Brief</>}
              </button>
              <button className="btn-secondary" onClick={handleDownload} style={{ padding: "3px 8px", fontSize: "0.7rem" }}>
                <Download size={12} /> Download .TXT
              </button>
            </div>
          </div>

          <pre style={{
            background: "#020617",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "1rem",
            fontSize: "0.72rem",
            color: "#38bdf8",
            fontFamily: "var(--font-mono)",
            whiteSpace: "pre-wrap",
            maxHeight: "260px",
            overflowY: "auto",
            lineHeight: 1.45
          }}>
            {disputePacket.disputeSubmissionText}
          </pre>
        </div>

        {/* Cryptographic Ledger Block Anchor */}
        {disputePacket.ledgerBlock && (
          <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.65rem 0.85rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "0.7rem" }}>
            <div style={{ color: "#94a3b8", fontWeight: 600, marginBottom: "3px" }}>IMMUTABLE PROVENANCE HASH ANCHOR</div>
            <div className="mono" style={{ color: "#10b981", wordBreak: "break-all" }}>
              BLOCK #{disputePacket.ledgerBlock.index} | {disputePacket.ledgerBlock.blockHash}
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn-secondary" onClick={onClose}>Close Dispute Pack</button>
        </div>

      </div>
    </div>
  );
}
