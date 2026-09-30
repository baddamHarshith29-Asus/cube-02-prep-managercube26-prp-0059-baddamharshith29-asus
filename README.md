# AeroPrep AI — Inbound Packaging & Labelling Optical Verification Station

An AI-powered, multi-agent inbound shipment verification station for e-commerce fulfillment (Amazon FBA & Walmart WFS). AeroPrep AI inspects inbound packaging photographs in real-time, verifying polybag sealing, child suffocation warnings, FNSKU barcode placement, barcode suppression, expiration dates, and handling marks before shipments leave the prep facility.

---

## 1. Problem Understanding

When sellers and 3PL preparation centers ship products into fulfillment centers like Amazon FBA or Walmart Fulfillment Services (WFS), every single unit must comply with strict inbound packaging and labelling standards. 

Manual human inspection on high-speed warehouse prep lines is error-prone, subjective, and slow. Even minor oversights trigger severe penalties:

- **Unplanned Prep Service Fees & Chargebacks**: Amazon charges between $0.25 to $1.65+ per non-compliant unit for unplanned polybagging, barcode re-labeling, or bubble-wrapping.
- **Inbound Receiving Delays**: Defective cartons are moved to problem-resolution holding areas, delaying inventory availability by 5 to 21 days during peak seasons.
- **Safety & Regulatory Fines**: Bags with a 5.0-inch opening or larger that lack a legible CPSIA child suffocation warning violate federal safety regulations (16 CFR § 1500.121).
- **Dual-Barcode Laser Scanning Clashes**: If the manufacturer's original UPC barcode is left uncovered, warehouse automated conveyor scanners read both barcodes, misrouting or stranding inventory.
- **Curved Surface Distortion**: Applying flat rectangular FNSKU barcodes across curved surfaces (like bottle rims or cylinders with >15° curvature) warps the barcode bars, making optical laser decoders fail.
- **Unjustified Chargeback Disputes**: Sellers frequently receive automated penalty chargebacks with no easy way to prove their packaging was 100% compliant at the moment of prep dispatch.

AeroPrep AI eliminates these issues by providing an automated **"Shift-Left" Quality Assurance station** that catches and fixes packaging defects at the prep table before pallets are dispatched.

---

## 2. Solution Overview

AeroPrep AI combines **Multimodal Vision AI (Google Gemini 3.5/3.6 Flash)**, **Adversarial LLM Reasoning (Groq Cloud Critic)**, and a **Deterministic 2-Stage Spatial Geometry Engine** into an interactive operator station.

### Core Capabilities:
1. **Multi-Agent Inspection Team**: Instead of relying on a single prompt, 6 specialized agents evaluate every unit:
   - **Packaging Agent**: Verifies transparent polybag enclosure, opening width, and continuous hermetic seal weld.
   - **Label Agent**: Verifies FNSKU decodability, verbatim child suffocation warning text, font size scale (10pt–24pt), expiration date visibility, and set labels.
   - **Barcode Agent**: Inspects UPC suppression and verifies that no dual scannable barcodes are exposed.
   - **Spatial Agent**: Measures surface planarity, curvature angles (>15° threshold), and seam clearance margins (>= 0.5 inches).
   - **Rule Agent**: Maps physical detections against authoritative clauses from Amazon FBA 2026, Walmart WFS, and CPSIA.
   - **Critic Agent (Second Opinion)**: Plays devil's advocate to detect false passes, occluded seals, and subtle compliance risks.
2. **Multi-Model Vision AI Cascade**: Real-time image perception via Google Gemini Vision, cross-verified with Groq Cloud Critic, with built-in fallbacks to local Ollama and the Stage B spatial engine.
3. **Interactive Visual Canvas**: High-fidelity rendering with togglable inspection layers (bounding boxes, barcode zones, curvature radar, and spatial coaching vectors).
4. **Intelligent Re-Inspection**: When visual evidence is ambiguous (e.g., top seal cut off by camera frame, specular glare washing out text), the system doesn't guess—it guides the operator with a targeted photo re-inspection prompt.
5. **Work Order vs. Physical Reality Comparator**: Validates what the camera actually sees against purchase order directives (e.g., flagging when a work order specified covering a UPC, but the physical UPC remains exposed).
6. **Dispute Defense Packet & Cryptographic Ledger**: Automatically anchors every completed inspection into a SHA-256 tamper-evident hash chain with an exportable dispute justification packet.
7. **Batch Analytics & Failure Clustering**: Aggregates shift yield, chargeback fees saved, and Pareto defect clustering to identify faulty workstation jigs or training gaps.

---

## 3. Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- Optional: API keys for Google Gemini and Groq Cloud (a built-in spatial geometry engine runs offline if no keys are provided).

### Installation Steps

1. **Clone or Open the Repository**:
   ```bash
   cd "cube sydon"
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**:
   In `backend/.env`, configure your port and API keys (template already provided):
   ```env
   PORT=5001
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-3.6-flash
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Install Frontend Dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

5. **Run the Automated Regression Test Suite**:
   Verify that all 10 authoritative compliance scenarios, cryptographic ledger hashing, and multi-agent systems pass:
   ```bash
   cd ../backend
   node test.js
   ```

---

## 4. Usage Instructions

### Running the Application Locally

1. **Start the Backend Server** (Port `5001`):
   ```bash
   cd backend
   node server.js
   ```
   *Expected output*: `PrepManager AI Backend running at http://localhost:5001`

2. **Start the Frontend Development Server** (Port `3000`):
   ```bash
   cd frontend
   npm run dev
   ```
   *Expected output*: `VITE ready in ~250ms -> http://localhost:3000/`

3. **Open the Web Application**:
   Navigate to [http://localhost:3000/](http://localhost:3000/) in your web browser.

---

### Step-by-Step User Workflows

#### 1. Exploring Pre-Loaded Authoritative Scenarios (1–10)
- In the left sidebar, click through any of the **10 Authoritative Scenarios**:
  - **Scenario 1 (PASS)**: Teddy bear in sealed polybag with verbatim warning and flat FNSKU.
  - **Scenario 2 (FAIL)**: Heavyweight hoodie in a 14" polybag lacking suffocation warning.
  - **Scenario 3 (FAIL)**: FNSKU placed directly over the top heat-seal seam weld (<0.5" clearance).
  - **Scenario 4 (FAIL)**: FNSKU wrapped across a 38.4° curved bottle rim.
  - **Scenario 5 (FAIL)**: Polybag with small 8pt warning text (mandates >=14pt).
  - **Scenario 6 (FAIL)**: Exposed original manufacturer UPC barcode on electronics box.
  - **Scenario 7 (FAIL)**: FNSKU label occluding manufacturer expiration date.
  - **Scenario 8 (FAIL)**: Kitchen utensils in unsealed polybag (gap exceeds 0.25").
  - **Scenario 9 (UNCERTAIN)**: Camera frame cuts off top seal; triggers **Intelligent Re-Inspection**.
  - **Scenario 10 (FAIL)**: Ceramic mug pair without mandatory "Sold as Set" handling sticker.
- Observe the **Live Inspection Verdict**, **Dual-Agent Agreement Score**, **Remediation Guide**, and **Visual Coaching Vectors**.

#### 2. Testing Live Vision AI with Custom Package Images
- Click **"Upload Image"** on the top navigation bar or drag-and-drop any photo from the [`test_images/`](file:///c:/Users/bhars/Downloads/cube%20sydon/test_images) folder:
  - `sample_1_compliant_polybag.jpg` — Compliant plush toy in sealed polybag (PASS).
  - `sample_2_curved_bottle.jpg` — Unbagged liquid bottle with curved FNSKU (FAIL).
  - `sample_3_dual_barcode_box.jpg` — Headphones with exposed UPC barcode (FAIL).
  - `sample_4_hoodie_no_warning.jpg` — Folded apparel hoodie without warning (FAIL).
  - `sample_5_unsealed_polybag.jpg` — Kitchen utensil set with gaping open top (FAIL).
  - `sample_6_covered_expiry.jpg` — Multivitamins with FNSKU covering expiry (FAIL).
  - `sample_7_sold_as_set.jpg` — Twin mug bundle with "Sold as Set" label (PASS).
- The system will call the **Gemini Vision + Groq Critic Cascade**, extract bounding boxes, decode barcode text, and render real-time compliance results.

#### 3. Resolving Missing Evidence via Re-Inspection
- When inspecting **Scenario 9** (or an image where the seal is occluded), the system flags **`UNCERTAIN`**.
- An amber **Intelligent Re-Inspection Banner** appears with a targeted prompt: *"Please capture the top opening of the polybag so the sealing area is clearly visible."*
- Click **"Simulate Targeted Capture"** or upload the follow-up photo to resolve the evidence gap into a conclusive verdict.

#### 4. Generating Dispute Packets & Proof-of-Prep Certificates
- When inspecting a compliant or resolved unit, click **"Generate Dispute Pack"**.
- View the pre-formatted **Amazon Seller Central / WFS Inbound Dispute Submission** complete with SHA-256 cryptographic proof, PO alignment, and rule citation.
- Click **"Proof-of-Prep Certificate"** to view and print an audit certificate with a QR code and tamper-evident ledger block index.

#### 5. Station Analytics & Shift Reports
- Click **"Analytics"** in the top bar to inspect:
  - First-Pass Yield (Target SLA: >=90%)
  - Total unplanned prep chargebacks avoided ($)
  - Pareto defect distribution chart (identifying top failure modes)
  - Recent inspection audit stream

---

## 5. Assumptions & Limitations

1. **Epistemic Limitation of 2D Cameras (Film Thickness)**:
   - Standard retail optical cameras cannot measure the microscopic physical thickness of a plastic film (e.g., verifying the mandatory 1.5 mil / 0.0381 mm thickness requirement).
   - *Design Choice*: The system explicitly tags this rule as **`UNCERTAIN (Epistemic Limitation)`** rather than hallucinating a guess, prompting operators to maintain a periodic physical micrometer batch audit.
2. **Single-Perspective Optical Occlusion**:
   - A single 2D camera perspective cannot see the back of a box or polybag.
   - *Design Choice*: The system includes a **Multi-Angle Verification Mode** (`FRONT`, `BACK`, `TOP_SEAL`) so operators can confirm barcode suppression on all sides.
3. **Lighting & Glare Thresholds**:
   - Extreme specular reflection from overhead warehouse high-bay lighting can obscure black barcode bars or fine warning text.
   - *Design Choice*: The spatial engine computes a glare index; if glare exceeds 40%, the system flags text contrast as uncertain and guides the operator to adjust angle/lighting.
4. **Barcode Decodability vs. Contrast**:
   - FNSKU validation verifies standard Code 128 symbology structures, quiet zone margins, and surface planarity. It assumes the camera resolution is at least 720p for optical character recognition.
5. **Offline Operation Mode**:
   - If internet connectivity or API keys are unavailable, the system automatically falls back to its built-in **Stage B Spatial Computational Geometry Engine**, guaranteeing zero downtime on warehouse packing lines.
