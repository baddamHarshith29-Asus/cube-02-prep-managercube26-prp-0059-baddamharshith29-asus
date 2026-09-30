import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";

import { Header } from "./components/Header.jsx";
import { ScenarioSelector } from "./components/ScenarioSelector.jsx";
import { VisualInspectionCanvas } from "./components/VisualInspectionCanvas.jsx";
import { VerdictInspector } from "./components/VerdictInspector.jsx";
import { WorkOrderCard } from "./components/WorkOrderCard.jsx";
import { RulesModal } from "./components/RulesModal.jsx";
import { AnalyticsModal } from "./components/AnalyticsModal.jsx";
import { QASandboxModal } from "./components/QASandboxModal.jsx";
import { CertificateModal } from "./components/CertificateModal.jsx";
import { CameraCaptureModal } from "./components/CameraCaptureModal.jsx";
import { DisputePacketModal } from "./components/DisputePacketModal.jsx";
import { BatchAnalyticsModal } from "./components/BatchAnalyticsModal.jsx";
import { ProvenanceLedgerModal } from "./components/ProvenanceLedgerModal.jsx";
import { OperatorOverrideModal } from "./components/OperatorOverrideModal.jsx";
import { ApiKeyModal } from "./components/ApiKeyModal.jsx";

export default function App() {
  const [scenarios, setScenarios] = useState([]);
  const [rules, setRules] = useState([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState("scenario-1");
  const [currentScenario, setCurrentScenario] = useState(null);
  const [currentWorkOrder, setCurrentWorkOrder] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [customImageUrl, setCustomImageUrl] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeStandard, setActiveStandard] = useState("amazon-fba-2026");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [activeAngles, setActiveAngles] = useState(["FRONT"]);
  const [reInspectionTarget, setReInspectionTarget] = useState(null);

  // Multi-Model AI and Spatial Geometry Engine States
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem("aeroprep_gemini_key") || "");
  const [groqKey, setGroqKey] = useState(localStorage.getItem("aeroprep_groq_key") || "");
  const [groqModel, setGroqModel] = useState(localStorage.getItem("aeroprep_groq_model") || "qwen/qwen3.8-27b");
  const [ollamaUrl, setOllamaUrl] = useState(localStorage.getItem("aeroprep_ollama_url") || "http://localhost:11434");
  const [ollamaModel, setOllamaModel] = useState(localStorage.getItem("aeroprep_ollama_model") || "llama3.2-vision");
  const [activeEngine, setActiveEngine] = useState(localStorage.getItem("aeroprep_active_engine") || "auto");
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);

  // Modals
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);

  const [activeCertificate, setActiveCertificate] = useState(null);
  const [activeDisputePacket, setActiveDisputePacket] = useState(null);

  // QA Config
  const [qaConfig, setQaConfig] = useState({
    curvatureToleranceDeg: 15.0,
    minContrastRatio: 4.5,
    seamClearanceMarginInches: 0.5,
    enforceEpistemics: true
  });

  // Load Initial Scenarios and Rules from Backend
  useEffect(() => {
    fetch("/api/scenarios")
      .then(res => res.json())
      .then(data => {
        setScenarios(data.scenarios || []);
      })
      .catch(err => console.error("Error loading scenarios:", err));

    fetch("/api/rules")
      .then(res => res.json())
      .then(data => {
        setRules(data.rules || []);
      })
      .catch(err => console.error("Error loading rules:", err));
  }, []);

  // When selectedScenarioId or activeStandard changes, fetch scenario details
  useEffect(() => {
    if (!selectedScenarioId) return;

    setIsScanning(true);
    setCustomImageUrl(null);
    setActiveAngles(["FRONT"]);
    setReInspectionTarget(null);

    const queryParams = new URLSearchParams({
      standard: activeStandard,
      qaConfig: JSON.stringify(qaConfig)
    });

    fetch(`/api/scenarios/${selectedScenarioId}?${queryParams.toString()}`)
      .then(res => res.json())
      .then(data => {
        setCurrentScenario(data.scenario);
        setCurrentWorkOrder(data.workOrder);
        setVerificationResult(data.verification);
        setIsScanning(false);

        // Audio announcement if enabled
        if (audioEnabled && data.verification) {
          playSpeechAnnouncement(data.verification);
        }

        // Confetti if PASS
        if (data.verification?.overallVerdict === "PASS") {
          triggerPassConfetti();
        }
      })
      .catch(err => {
        console.error("Error loading scenario details:", err);
        setIsScanning(false);
      });
  }, [selectedScenarioId, activeStandard]);

  // Pass Confetti Animation
  const triggerPassConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#10b981", "#06b6d4", "#3b82f6"]
      });
    } catch (e) {
      // Ignore if canvas-confetti is not loaded
    }
  };

  // Web Speech API Voice Announcement
  const playSpeechAnnouncement = (result) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    let text = "";
    if (result.overallVerdict === "PASS") {
      text = "Inbound unit verified. All packaging and labeling requirements passed. Ready for pallet dispatch.";
    } else if (result.overallVerdict === "FAIL") {
      text = `Prep status failed. ${result.primaryReason}`;
    } else {
      text = `Prep status uncertain. Visual evidence gap detected. ${result.reInspection?.request?.prompt || 'Manual re-inspection required.'}`;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // FEATURE 1: Handle Intelligent Re-Inspection Auto-Resolve
  const handleResolveReInspection = (targetArea) => {
    if (!currentScenario) return;

    setIsScanning(true);
    fetch("/api/re-inspect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenarioId: currentScenario.id,
        workOrderId: currentWorkOrder?.orderId,
        targetArea: targetArea || "TOP_SEAL",
        activeAngles,
        qaConfig
      })
    })
      .then(res => res.json())
      .then(data => {
        setVerificationResult(data.verification);
        setActiveAngles(data.activeAngles || activeAngles);
        setIsScanning(false);

        if (audioEnabled && data.verification) {
          playSpeechAnnouncement(data.verification);
        }

        if (data.verification?.overallVerdict === "PASS") {
          triggerPassConfetti();
        }
      })
      .catch(err => {
        console.error("Error resolving re-inspection:", err);
        setIsScanning(false);
      });
  };

  // Handle Follow-Up Upload for Re-Inspection
  const handleReInspectUpload = (file, targetArea) => {
    const objectUrl = URL.createObjectURL(file);
    setCustomImageUrl(objectUrl);
    handleResolveReInspection(targetArea);
  };

  // Handle Custom Upload Image (Initial)
  const handleUploadImage = (file, optionalTargetArea) => {
    if (optionalTargetArea) {
      handleReInspectUpload(file, optionalTargetArea);
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setIsScanning(true);
    const objectUrl = URL.createObjectURL(file);
    setCustomImageUrl(objectUrl);
    setSelectedScenarioId(null);
    setActiveAngles(["FRONT"]);

    fetch("/api/upload", {
      method: "POST",
      headers: {
        ...(geminiKey ? { "x-gemini-api-key": geminiKey } : {}),
        ...(groqKey ? { "x-groq-api-key": groqKey } : {}),
        "x-groq-model": groqModel,
        "x-ollama-url": ollamaUrl,
        "x-ollama-model": ollamaModel,
        "x-preferred-provider": activeEngine
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        const dynamicWo = data.workOrder || {
          orderId: `WO-UPLOAD-${Date.now().toString().slice(-4)}`,
          sku: data.visualEntities?.fnskuLabel?.code || "SKU-UPLOADED",
          asin: "B0" + Math.random().toString(36).substring(2, 10).toUpperCase(),
          productName: data.visualEntities?.detectedProduct?.title || file.name.replace(/\.[^/.]+$/, ""),
          productCategory: data.visualEntities?.detectedProduct?.category || "General Merchandise",
          operator: "Operator A (Station 04)",
          batchId: "BATCH-UPLOAD",
          bagOpeningInches: data.visualEntities?.polybag?.openingWidthInches || 10.0,
          requiredPrep: {
            polybag: data.visualEntities?.polybag?.present ?? true,
            suffocationWarning: (data.visualEntities?.polybag?.openingWidthInches || 10.0) >= 5.0,
            coverBarcode: true,
            fnskuLabel: true,
            bubbleWrap: false,
            setCreationLabel: false,
            keepExpiryVisible: false
          }
        };

        setCurrentWorkOrder(dynamicWo);
        setCurrentScenario({
          id: "custom-upload",
          title: dynamicWo.productName,
          subtitle: `Verified via ${data.usedProvider || "Google Gemini 3.5 Flash"} (Consensus: ${data.modelConsensus?.consensusVerdict || data.verification?.overallVerdict || "ANALYZED"})`,
          productName: dynamicWo.productName,
          productCategory: dynamicWo.productCategory,
          visualEntities: data.visualEntities
        });
        setVerificationResult(data.verification);
        setIsScanning(false);

        if (audioEnabled && data.verification) {
          playSpeechAnnouncement(data.verification);
        }
      })
      .catch(err => {
        console.error("Error uploading image:", err);
        setIsScanning(false);
      });
  };

  // Handle Camera Capture Data
  const handleCaptureImage = (dataUrl) => {
    setCustomImageUrl(dataUrl);

    if (reInspectionTarget) {
      // Resolve re-inspection with camera frame
      handleResolveReInspection(reInspectionTarget);
      setReInspectionTarget(null);
      return;
    }

    setSelectedScenarioId(null);
    setIsScanning(true);
    setActiveAngles(["FRONT"]);

    fetch("/api/analyze-live", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageBase64: dataUrl,
        preferredProvider: activeEngine,
        geminiKey,
        groqKey,
        groqModel,
        ollamaUrl,
        ollamaModel,
        workOrderId: currentWorkOrder?.orderId || "WO-98421"
      })
    })
      .then(res => res.json())
      .then(data => {
        const dynamicWo = data.workOrder || currentWorkOrder;
        setCurrentWorkOrder(dynamicWo);
        setCurrentScenario({
          id: "custom-camera",
          title: dynamicWo?.productName || "Live Camera Inbound Snapshot",
          subtitle: `Verified via ${data.usedProvider || "Google Gemini 3.5 Flash"}`,
          productName: dynamicWo?.productName || "Station Photographed Item",
          productCategory: dynamicWo?.productCategory || "Inbound Goods",
          visualEntities: data.visualEntities || {}
        });
        setVerificationResult(data.verification);
        setIsScanning(false);

        if (audioEnabled && data.verification) {
          playSpeechAnnouncement(data.verification);
        }
      })
      .catch(err => {
        console.error("Error verifying camera capture:", err);
        setIsScanning(false);
      });
  };

  // Request / Ingest Back Angle Photo to Resolve Ambiguity
  const handleRequestAngle = (angle) => {
    if (!currentScenario) return;

    setIsScanning(true);
    const newAngles = [...activeAngles, angle];
    setActiveAngles(newAngles);

    fetch("/api/multi-angle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenarioId: currentScenario.id,
        activeAngles: newAngles
      })
    })
      .then(res => res.json())
      .then(data => {
        setVerificationResult(data.verification);
        setIsScanning(false);
        if (audioEnabled && data.verification) {
          playSpeechAnnouncement(data.verification);
        }
      })
      .catch(err => {
        console.error("Error requesting multi-angle:", err);
        setIsScanning(false);
      });
  };

  // Generate Dispute Defense Pack
  const handleOpenDisputePack = () => {
    if (!verificationResult) return;

    fetch("/api/appeal-package", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inspectionId: `INSP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        scenarioId: currentScenario?.id || "scenario-1",
        workOrderId: currentWorkOrder?.orderId || "WO-98421",
        activeStandard
      })
    })
      .then(res => res.json())
      .then(packet => {
        setActiveDisputePacket(packet);
        setIsDisputeOpen(true);
      })
      .catch(err => console.error("Error generating dispute pack:", err));
  };

  // Generate Inbound Compliance Certificate
  const handleGenerateCertificate = () => {
    if (!verificationResult) return;

    fetch("/api/certificate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inspectionId: verificationResult?.inspectionId || `INSP-${Date.now().toString().slice(-5)}`,
        scenarioId: currentScenario?.id || "custom-upload",
        workOrderId: currentWorkOrder?.orderId || "WO-UPLOAD",
        productName: currentWorkOrder?.productName || currentScenario?.productName || "Custom Inbound SKU",
        sku: currentWorkOrder?.sku || "SKU-UPLOADED",
        asin: currentWorkOrder?.asin || "B0CUSTOM",
        verdict: verificationResult.overallVerdict,
        operatorId: currentWorkOrder?.operator || "Operator A (Station 04)"
      })
    })
      .then(res => res.json())
      .then(cert => {
        setActiveCertificate(cert);
        setIsCertOpen(true);
      })
      .catch(err => console.error("Error creating certificate:", err));
  };

  // Apply QA Sandbox Config to dynamically re-verify with configured tolerances
  const handleApplySandboxConfig = () => {
    if (!currentScenario) return;

    setIsScanning(true);
    fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenarioId: currentScenario.id,
        workOrderId: currentWorkOrder?.orderId,
        visualEntities: currentScenario.visualEntities,
        activeAngles,
        activeStandard,
        qaConfig
      })
    })
      .then(res => res.json())
      .then(data => {
        setVerificationResult(data.verification);
        setIsScanning(false);
      })
      .catch(err => {
        console.error("Error re-verifying with sandbox config:", err);
        setIsScanning(false);
      });
  };

  // Reset QA Defaults
  const handleResetQaDefaults = () => {
    setQaConfig({
      curvatureToleranceDeg: 15.0,
      minContrastRatio: 4.5,
      seamClearanceMarginInches: 0.5,
      enforceEpistemics: true
    });
  };

  // Export JSON Audit Log
  const handleExportJson = () => {
    if (!verificationResult) return;
    const exportData = {
      app: "AeroPrep AI Inbound Verification Station",
      timestamp: new Date().toISOString(),
      scenario: currentScenario,
      workOrder: currentWorkOrder,
      verification: verificationResult
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AeroPrep-Audit-${currentScenario?.id || "unit"}-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="app-root">
      {/* Header HUD */}
      <Header 
        activeStandard={activeStandard}
        setActiveStandard={setActiveStandard}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenSandbox={() => setIsSandboxOpen(true)}
        onOpenDisputePack={handleOpenDisputePack}
        onOpenBatchClusters={() => setIsBatchOpen(true)}
        onOpenLedger={() => setIsLedgerOpen(true)}
        apiKey={geminiKey || groqKey}
        activeEngine={activeEngine}
        onOpenApiKeyModal={() => setIsApiKeyOpen(true)}
      />

      {/* Main 3-Column Layout */}
      <main className="main-station-container">
        {/* Left Column: Test Scenarios Suite & Ingest */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", overflow: "hidden" }}>
          <ScenarioSelector 
            scenarios={scenarios}
            selectedScenarioId={selectedScenarioId}
            onSelectScenario={(id) => setSelectedScenarioId(id)}
            onUploadImage={handleUploadImage}
            onTriggerCameraCapture={() => {
              setReInspectionTarget(null);
              setIsCameraOpen(true);
            }}
            isAnalyzing={isScanning}
          />

          {/* Work Order vs Physical Reality Card */}
          <WorkOrderCard 
            workOrder={currentWorkOrder}
            verification={verificationResult}
          />
        </div>

        {/* Center Column: High-Tech Visual Spatial Inspection Canvas */}
        <VisualInspectionCanvas 
          scenario={currentScenario}
          visualEntities={currentScenario?.visualEntities}
          isScanning={isScanning}
          customImageUrl={customImageUrl}
          spatialAnalysis={verificationResult?.spatialAnalysis}
          activeAngles={activeAngles}
          onRequestAngle={handleRequestAngle}
          coachingAdvice={verificationResult?.coachingAdvice}
          reInspection={verificationResult?.reInspection}
          onResolveReInspection={handleResolveReInspection}
          multiAgentTeam={verificationResult?.multiAgentTeam}
          onTriggerCameraCapture={(targetArea) => {
            setReInspectionTarget(targetArea);
            setIsCameraOpen(true);
          }}
          onUploadImage={handleUploadImage}
        />

        {/* Right Column: AI Compliance Verdict & Evidence Inspector */}
        <VerdictInspector 
          verification={verificationResult}
          workOrder={currentWorkOrder}
          onGenerateCertificate={handleGenerateCertificate}
          onPlayVoiceAnnouncement={() => verificationResult && playSpeechAnnouncement(verificationResult)}
          onExportJson={handleExportJson}
          onOpenDisputePack={handleOpenDisputePack}
          onOpenOverrideModal={() => setIsOverrideOpen(true)}
        />
      </main>

      {/* Modals */}
      <RulesModal 
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        rules={rules}
      />

      <AnalyticsModal 
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      <QASandboxModal 
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
        qaConfig={qaConfig}
        setQaConfig={setQaConfig}
        onResetDefaults={handleResetQaDefaults}
        onApplyConfig={handleApplySandboxConfig}
      />

      <CertificateModal 
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        certificate={activeCertificate}
        scenario={currentScenario}
        workOrder={currentWorkOrder}
        verification={verificationResult}
      />

      <CameraCaptureModal 
        isOpen={isCameraOpen}
        onClose={() => {
          setIsCameraOpen(false);
          setReInspectionTarget(null);
        }}
        onCaptureImage={handleCaptureImage}
      />

      <DisputePacketModal 
        isOpen={isDisputeOpen}
        onClose={() => setIsDisputeOpen(false)}
        disputePacket={activeDisputePacket}
      />

      <BatchAnalyticsModal 
        isOpen={isBatchOpen}
        onClose={() => setIsBatchOpen(false)}
      />

      <ProvenanceLedgerModal 
        isOpen={isLedgerOpen}
        onClose={() => setIsLedgerOpen(false)}
      />

      <OperatorOverrideModal 
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        currentScenario={currentScenario}
        workOrder={currentWorkOrder}
        onOverrideSuccess={(data) => {
          if (verificationResult) {
            setVerificationResult(prev => ({
              ...prev,
              overallVerdict: data.overrideRecord.overrideVerdict,
              primaryReason: `[HUMAN OVERRIDE APPLIED]: ${data.overrideRecord.reason}`
            }));
          }
        }}
      />

      <ApiKeyModal 
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        geminiKey={geminiKey}
        setGeminiKey={setGeminiKey}
        groqKey={groqKey}
        setGroqKey={setGroqKey}
        groqModel={groqModel}
        setGroqModel={setGroqModel}
        ollamaUrl={ollamaUrl}
        setOllamaUrl={setOllamaUrl}
        ollamaModel={ollamaModel}
        setOllamaModel={setOllamaModel}
        activeEngine={activeEngine}
        setActiveEngine={setActiveEngine}
      />
    </div>
  );
}
