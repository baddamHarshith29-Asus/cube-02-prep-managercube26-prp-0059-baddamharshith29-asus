# AeroPrep AI — System Architecture & Engineering Specifications

This document outlines the architectural design, component structure, data flow, agent interactions, and key engineering decisions behind the AeroPrep AI Inbound Packaging & Labelling Optical Verification Station.

---

## 1. System Architecture

AeroPrep AI is designed as a modular, decoupled architecture consisting of an **Interactive Visual Inspection Client (Frontend)**, a **RESTful Coordination Server (Backend)**, a **Hierarchical Multi-Agent Inspection Team**, and a **Multi-Model Vision AI Cascade**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   AeroPrep AI Frontend (React 19 + Vite)               │
│  - Visual Inspection Canvas (SVG + Canvas Overlays)                    │
│  - Multi-Angle Switcher (FRONT, BACK, TOP_SEAL)                        │
│  - Spatial Coaching Vectors & Curvature Radar                          │
│  - Dispute Defense Packet Generator & Certificate Viewer               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST (/api)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Express.js Backend & API Gateway                     │
│  - Health, Rules, Work Orders, Scenarios Endpoints                     │
│  - Image Ingestion (Multer) & Base64 Stream Controller                 │
│  - Human-in-the-Loop Override Queue                                    │
│  - Cryptographic Provenance Ledger (SHA-256 Hash Chain)                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Dispatches to
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                Master Director Agent (Orchestration Hub)                │
│                                                                        │
│   ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│   │  Packaging Agent  │  │    Label Agent    │  │   Barcode Agent   │  │
│   │ (Seals, Polybags) │  │  (FNSKU, Warning) │  │ (UPC Suppression) │  │
│   └─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘  │
│             │                      │                      │            │
│             └──────────────────────┼──────────────────────┘            │
│                                    ▼                                   │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │             Spatial Agent (2-Stage Geometry Engine)             │  │
│   │  Stage A: Boundary Extraction | Stage B: Vector Calculations    │  │
│   └────────────────────────────────┬────────────────────────────────┘  │
│                                    ▼                                   │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │            Rule Agent (Authoritative Clause Mapping)            │  │
│   │  CPSIA 16 CFR § 1500.121 | Amazon FBA 2026 | Walmart WFS Guide │  │
│   └────────────────────────────────┬────────────────────────────────┘  │
│                                    ▼                                   │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │             Critic Agent (Adversarial Self-Critique)            │  │
│   │   Second-opinion audit, consensus scoring, downgrade triggers   │  │
│   └────────────────────────────────┬────────────────────────────────┘  │
│                                    ▼                                   │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │             Proof-of-Prep Cryptographic Certificate             │  │
│   │        SHA-256 Digest | Immutable Provenance Block Chain        │  │
│   └─────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Vision & Reasoning Cascade
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Multi-Model Vision & LLM Cascade                      │
│                                                                        │
│   [Primary Vision]         [Compliance Critic]      [Local / Offline]  │
│   Google Gemini 3.6/3.5    Groq Cloud Reasoning     Ollama Local /     │
│   Flash Vision API         (Qwen 3.8 / Llama 3.3)   Deterministic      │
│                                                     Spatial Engine     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Components Breakdown

### 2.1 Frontend Client (`/frontend`)
The user interface is built with **React 19**, styled using **Vanilla CSS design tokens** (glassmorphism, high-contrast dark mode for industrial screens), and bundled via **Vite**:

- **`VisualInspectionCanvas.jsx`**: The core interactive viewport. It renders realistic package scenes (via high-fidelity vector SVGs or uploaded photos) with togglable visual layers:
  - Bounding boxes for polybags, seams, FNSKUs, warnings, and original barcodes.
  - Spatial coaching vectors (e.g., arrow showing required shift away from seam).
  - Curvature radar showing surface angle deviation.
- **`App.jsx`**: Main application state controller managing active scenarios, work orders, multi-angle perspectives, voice synthesis announcements, and verification runs.
- **Modals & Tooling**:
  - `RulesModal.jsx`: Displays authoritative regulatory clauses and legal citations.
  - `DisputePacketModal.jsx`: Generates formal Amazon Seller Central & WFS inbound dispute texts with cryptographic hash proofs.
  - `CertificateModal.jsx`: Displays printable Proof-of-Prep compliance certificates with verification tokens.
  - `BatchAnalyticsModal.jsx`: Operator-level defect aggregation and shift yield tracking.
  - `ApiKeyModal.jsx`: Live connection testing and configuration for Gemini, Groq, Ollama, and spatial engines.
  - `OperatorOverrideModal.jsx`: Human-in-the-loop review queue for manual supervisor overrides.

### 2.2 Backend Gateway (`/backend/server.js`)
An **Express.js** server running on port `5001` that coordinates API traffic:
- **Image Ingestion**: Uses `multer` to handle multipart file uploads and direct Base64 camera streams up to 15MB.
- **Vite Proxy Integration**: Proxies requests seamlessly from development port `3000` to backend port `5001`.
- **Health & Telemetry**: Exposes `/api/health`, `/api/rules`, `/api/workorders`, and `/api/stats`.
- **Cryptographic Provenance Anchor**: Appends every verified unit into an in-memory hash-chained ledger.

### 2.3 Specialized Agent Services (`/backend/services`)
1. **`multiAgentOrchestrator.js`**: The brains of the system. Implements the 6 domain agents and the Master Director Agent.
2. **`spatialEngine.js`**: Implements the deterministic 2-stage spatial geometry engine (Intersection-over-Union, surface normal angles, seam collision clearance).
3. **`provenanceLedger.js`**: An immutable, hash-linked block ledger that calculates SHA-256 digests for every inspection and operator override.
4. **`multiModelAgent.js`**: Unified hub connecting Google Gemini Vision, Groq Cloud Reasoning, and local Ollama into a resilient cascade.
5. **`jsonParser.js`**: Resilient JSON parser that sanitizes LLM markdown fences, `<think>` reasoning tags, and trailing commas.
6. **`svgRenderer.js`**: High-fidelity vector SVG generator for realistic synthetic scenario simulation.

---

## 3. Data Flow

Here is the exact journey of an inspection request through the system:

```
[Camera / File Upload]
        │
        ▼ (Multipart or Base64)
[POST /api/upload or /api/analyze-live]
        │
        ▼
[Multi-Model Vision Cascade] ───► Google Gemini Vision API
        │                               │ (Perceives objects, OCRs text)
        │                               ▼
        │                       Structured JSON Detections
        │                               │
        │                               ▼
        │                       Groq Cloud Critic
        │                               │ (Challenges findings & verifies consensus)
        │                               ▼
        │                       Fused Perception Findings
        │
        ▼
[Master Director Multi-Agent Verification]
        │
        ├── 1. Packaging Agent (Checks film continuity, hermetic weld)
        ├── 2. Label Agent (Checks FNSKU decodability, warning text & font size)
        ├── 3. Barcode Agent (Checks original barcode suppression)
        ├── 4. Spatial Agent (Computes curvature angle & seam distance)
        ├── 5. Rule Agent (Evaluates Amazon FBA & CPSIA requirements)
        └── 6. Critic Agent (Second opinion, flags false passes / missing evidence)
        │
        ▼
[Verdict Decision Logic]
   ├── If any critical rule fails ──────────────► FAIL + Remediation Guidance
   ├── If visual evidence is ambiguous ─────────► UNCERTAIN + Re-Inspection Prompt
   └── If all rules passed ─────────────────────► PASS + Proof-of-Prep Certificate
        │
        ▼
[Cryptographic Ledger Block Creation]
   - Hash(Timestamp + SKU + Verdict + RuleChecks + PrevHash) ──► SHA-256 Digest
        │
        ▼
[Response Dispatched to Frontend]
   - Canvas overlays drawn, voice announcement played, coaching vectors rendered
```

---

## 4. Model & Agent Usage

### 4.1 Specialized Multi-Agent Inspection Team

Rather than asking an LLM a vague general prompt like *"is this package ok?"*, AeroPrep AI breaks the problem down into isolated domain responsibilities:

| Agent Name | Primary Specialty | Key Verification Checks |
| :--- | :--- | :--- |
| **Packaging Agent** | Polybag & Closure Integrity | Verifies polybag enclosure, seal type (heat weld vs tape), seal path continuity, and bag opening width in inches. |
| **Label Agent** | Barcodes, Text & Markings | Decodes FNSKU barcode tokens, verifies CPSIA verbatim warning text, measures font point sizes against bag dimensions, and checks expiration date visibility. |
| **Barcode Agent** | Barcode Suppression | Detects whether original manufacturer UPC/EAN barcodes are exposed or fully occluded to prevent dual-barcode laser scan errors. |
| **Spatial Agent** | Geometric Vectors & Clearance | Calculates surface normal curvature angles ($\le 15.0^\circ$), seam weld distance clearance ($\ge 0.5''$), and bounding box overlap IoU. |
| **Rule Agent** | Statutory Clause Mapping | Maps physical findings against legal rules (CPSIA 16 CFR § 1500.121, Amazon FBA Manual § 5.2, ASTM D3951). |
| **Critic Agent** | Second Opinion & Quality Audit | Acts as an adversarial compliance auditor. Challenges edge cases, reviews low-contrast text, and downgrades questionable passes. |
| **Director Agent** | Master Coordination | Synthesizes agent findings, generates the final verdict, determines re-inspection needs, and compiles proof-of-prep certificates. |

---

### 4.2 Multi-Model Vision Cascade

To balance perception accuracy, speed, and reliability, the system implements a **multi-model cascade**:

1. **Stage 1: Google Gemini Vision (`gemini-3.6-flash` / `gemini-3.5-flash`)**:
   - Ingests high-resolution images.
   - Extracts semantic elements (product category, polybag presence, seal type, warning text, barcode strings).
   - Generates normalized bounding box coordinates `{ x, y, w, h }` on a 600x600 coordinate plane.
2. **Stage 2: Groq Cloud AI Critic (`qwen/qwen3.8-27b`)**:
   - Receives the visual findings from Stage 1 alongside the Work Order purchase intent.
   - Performs rapid chain-of-thought compliance auditing in ~450ms.
   - Compares its independent verdict with Gemini's perception to achieve dual-agent consensus.
3. **Stage 3: Offline Spatial Geometry Engine (Fallback)**:
   - If internet access is unavailable or API quotas are exhausted, the built-in deterministic spatial engine takes over.
   - Processes pixel matrices and feature points to maintain packing station uptime.

---

## 5. Important Engineering Decisions

### 5.1 Decoupled 2-Stage Spatial Geometry Engine
- **Why**: LLMs are notoriously imprecise when calculating exact geometric distances, surface normal angles, and coordinate overlaps from raw pixels.
- **Decision**: AeroPrep AI delegates visual perception (identifying objects and reading text) to Gemini, but delegates **all mathematical measurements** to a dedicated Stage B Spatial Engine:
  - Curvature angles are calculated mathematically against the 15.0° threshold.
  - Seam clearance is calculated using coordinate bounding distance against the 0.5-inch requirement.
  - Label overlap with expiration dates is calculated using Intersection-over-Union (IoU) algorithms.

### 5.2 Resilient LLM Text & JSON Parser (`jsonParser.js`)
- **Why**: Different LLMs (and different versions) often wrap JSON responses in markdown code blocks (```````json ... ```````), prepend conversational text, output reasoning tags (`<think>...</think>`), or include trailing commas that cause standard `JSON.parse()` to throw fatal syntax errors.
- **Decision**: Built a custom multi-pass parser:
  1. Strips reasoning blocks (`<think>...</think>`).
  2. Extracts content inside markdown fences if present.
  3. Locates the outermost JSON object braces (`{` to `}`).
  4. Automatically sanitizes trailing commas and curly quotes before parsing.

### 5.3 Epistemic Uncertainty Tagging (Honest AI)
- **Why**: Amazon FBA rules mandate a minimum 1.5 mil (0.0381 mm) plastic bag film thickness. However, no standard 2D optical camera can measure microscopic plastic film gauge.
- **Decision**: Rather than allowing the AI to hallucinate or guess film thickness, the system is programmed with strict **epistemic limitation constraints**:
  - The thickness rule is explicitly tagged **`UNCERTAIN (Epistemic Physical Limitation)`**.
  - The UI informs the operator that optical verification cannot measure film gauge and instructs them to maintain periodic physical micrometer caliper batch audits.

### 5.4 Intelligent Re-Inspection on Missing Evidence
- **Why**: In real warehouses, camera frames can accidentally cut off the top seam of a bag, or specular glare from overhead lights can temporarily wash out font characters. Failing a good product or passing a bad product due to bad lighting is costly.
- **Decision**: When evidence is obscured, the system returns an **`UNCERTAIN`** preliminary verdict and automatically generates a targeted **Intelligent Re-Inspection request**:
  - Targets the specific defect area (`TOP_SEAL`, `WARNING_TEXT`, `REAR_PACKAGE`).
  - Provides clear camera positioning instructions to the warehouse operator.
  - Seamlessly fuses the follow-up photograph with previous evidence to reach a conclusive PASS or FAIL.

### 5.5 Cryptographic SHA-256 Provenance Ledger
- **Why**: Inbound chargeback disputes with Amazon Seller Central or Walmart WFS often fail because sellers cannot prove that their prep was compliant at the moment the unit left their facility.
- **Decision**: Every verified unit generates a **Proof-of-Prep Record** linked to an immutable hash chain:
  $$\text{Block Hash} = \text{SHA256}(\text{Index} + \text{PrevHash} + \text{Timestamp} + \text{SKU} + \text{Verdict} + \text{Checks})$$
  This cryptographic digest is embedded directly into the exportable Dispute Defense Packet and printed on Proof-of-Prep audit certificates, providing mathematically verifiable evidence for chargeback appeals.
