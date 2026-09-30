import React, { useRef, useState, useEffect } from "react";
import { X, Camera, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export function CameraCaptureModal({ isOpen, onClose, onCaptureImage }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [capturedPreview, setCapturedPreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setCameraError(null);
      setCapturedPreview(null);
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "environment" }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn("Camera access error:", err);
      setCameraError("Webcam not accessible or permission denied. You can also upload a photograph file directly.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedPreview(dataUrl);
  };

  const handleConfirm = () => {
    if (capturedPreview) {
      onCaptureImage(capturedPreview);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "680px" }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Camera size={18} color="#06b6d4" />
            <h3 style={{ fontSize: "1rem", color: "#f8fafc" }}>Live Inbound Station Camera Ingest</h3>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: "4px 8px" }}>
            <X size={16} />
          </button>
        </div>

        {/* Camera Viewport or Error */}
        <div style={{ position: "relative", width: "100%", height: "380px", background: "#000", borderRadius: "var(--radius-md)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          
          {cameraError ? (
            <div style={{ padding: "1.5rem", textAlign: "center", color: "#f87171", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <AlertCircle size={32} />
              <p style={{ fontSize: "0.85rem" }}>{cameraError}</p>
              <button className="btn-secondary" onClick={startCamera} style={{ marginTop: "8px" }}>
                <RefreshCw size={14} /> Retry Camera
              </button>
            </div>
          ) : capturedPreview ? (
            <img src={capturedPreview} alt="Captured Inbound Item" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {/* Alignment Guides HUD Overlay */}
              <div style={{ position: "absolute", inset: "20px", border: "2px dashed rgba(6, 182, 212, 0.6)", borderRadius: "8px", pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "160px", height: "90px", border: "1.5px solid rgba(16, 185, 129, 0.8)", borderRadius: "4px" }} />
                <span style={{ position: "absolute", bottom: "10px", fontSize: "0.7rem", color: "#38bdf8", fontFamily: "var(--font-mono)", background: "rgba(0,0,0,0.6)", padding: "2px 6px", borderRadius: "4px" }}>
                  ALIGN PRODUCT &amp; FNSKU IN FRAME
                </span>
              </div>
            </>
          )}

          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
            Ensure ambient lighting with zero harsh flash glare.
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {capturedPreview ? (
              <>
                <button className="btn-secondary" onClick={() => setCapturedPreview(null)}>
                  <RefreshCw size={14} /> Retake
                </button>
                <button className="btn-primary" onClick={handleConfirm}>
                  <CheckCircle2 size={14} /> Verify Photograph
                </button>
              </>
            ) : (
              <button className="btn-primary" onClick={captureFrame} disabled={!!cameraError}>
                <Camera size={14} /> Capture Inspection Frame
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
