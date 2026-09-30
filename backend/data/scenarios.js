// 10 Comprehensive Inbound Packaging & Labelling Test Scenarios
// Accurately modeling all required test cases from the specification

export const TEST_SCENARIOS = [
  {
    id: "scenario-1",
    title: "Scenario 1: Fully Compliant Preparation (PASS)",
    subtitle: "Plush Toy in Sealed Polybag with Warning & Flat FNSKU",
    workOrderId: "WO-98421",
    productName: "Cuddly Soft Teddy Bear 12in",
    productCategory: "Toys / Plush",
    expectedVerdict: "PASS",
    primaryReason: "Polybag is airtight sealed; suffocation warning is compliant (>5\" opening) and legible; FNSKU is on flat surface; manufacturer UPC is fully covered.",
    imagePreviewDescription: "Brown plush teddy bear sealed in transparent 1.5mil polybag with clean top heat-seal, prominent suffocation warning box, and centered flat FNSKU label over original UPC.",
    productColor: "#8D5B4C",
    type: "PASS_ALL",
    visualEntities: {
      polybag: {
        present: true,
        sealed: true,
        sealType: "continuous-heat-weld",
        sealIntegrityScore: 98,
        openingWidthInches: 10.0,
        bbox: { x: 80, y: 30, w: 440, h: 540, label: "Polybag Boundary (Sealed)" }
      },
      seam: {
        present: true,
        type: "heat-seal-ridge",
        bbox: { x: 80, y: 30, w: 440, h: 22, label: "Heat Seal Weld" }
      },
      suffocationWarning: {
        present: true,
        legible: true,
        legibilityScore: 96,
        fontSizePt: 14,
        contrastRatio: 7.4,
        textDetected: "WARNING: To avoid danger of suffocation, keep this bag away from babies and children. Do not use in cribs, beds, carriages, or playpens. This bag is not a toy.",
        bbox: { x: 130, y: 410, w: 340, h: 90, label: "Suffocation Warning (Pass: 14pt, >5\" opening)" }
      },
      fnskuLabel: {
        present: true,
        code: "X003A89XYZ",
        title: "Cuddly Soft Teddy Bear 12in - New",
        surfaceType: "FLAT",
        curvatureAngleDeg: 2.1,
        seamDistanceInches: 2.8,
        onFoldOrSeam: false,
        bbox: { x: 160, y: 160, w: 280, h: 140, label: "FNSKU Label (Pass: Flat Surface, Clear Margins)" }
      },
      originalBarcode: {
        covered: true,
        exposedUpcFound: false,
        scannableUpcCount: 0,
        bbox: { x: 175, y: 175, w: 250, h: 110, label: "Original UPC Covered by FNSKU", status: "COVERED" }
      },
      expiryDate: {
        applicable: false,
        visible: null,
        covered: false,
        text: null,
        bbox: null
      },
      handlingMarks: {
        required: [],
        detected: ["SUFFOCATION_WARNING"],
        missing: []
      },
      physicalProperties: {
        filmThicknessMil: {
          claimed: 1.5,
          visuallyMeasurable: false,
          epistemicStatus: "UNCERTAIN_PHYSICAL_LIMITATION",
          explanation: "Plastic thickness (1.5 mil requirement) cannot be optically measured from 2D camera pixels. Operator must perform periodic micrometer batch audit."
        }
      }
    }
  },
  {
    id: "scenario-2",
    title: "Scenario 2: Missing Suffocation Warning (FAIL)",
    subtitle: "Heavyweight Hoodie in 14\" Opening Polybag without Warning",
    workOrderId: "WO-98422",
    productName: "Heavyweight Fleece Hoodie Black XL",
    productCategory: "Apparel / Textiles",
    expectedVerdict: "FAIL",
    primaryReason: "Polybag opening is 14.0 inches (exceeds 5.0 inch threshold), but NO suffocation warning is present on the packaging.",
    imagePreviewDescription: "Folded black fleece hoodie inside sealed polybag. Opening measures 14 inches flat. FNSKU label is attached, but entire bag is devoid of mandatory child safety suffocation warning.",
    productColor: "#212529",
    type: "FAIL_WARNING_MISSING",
    visualEntities: {
      polybag: {
        present: true,
        sealed: true,
        sealType: "adhesive-tape-strip",
        sealIntegrityScore: 94,
        openingWidthInches: 14.0,
        bbox: { x: 70, y: 40, w: 460, h: 520, label: "Polybag Boundary (14.0\" Opening)" }
      },
      seam: {
        present: true,
        type: "adhesive-fold",
        bbox: { x: 70, y: 40, w: 460, h: 25, label: "Tape Closure Seam" }
      },
      suffocationWarning: {
        present: false,
        legible: false,
        legibilityScore: 0,
        fontSizePt: 0,
        contrastRatio: 0,
        textDetected: null,
        bbox: null
      },
      fnskuLabel: {
        present: true,
        code: "X004B77KLP",
        title: "Heavyweight Fleece Hoodie Black XL - New",
        surfaceType: "FLAT",
        curvatureAngleDeg: 1.8,
        seamDistanceInches: 2.2,
        onFoldOrSeam: false,
        bbox: { x: 160, y: 220, w: 280, h: 140, label: "FNSKU Label (Valid Placement)" }
      },
      originalBarcode: {
        covered: true,
        exposedUpcFound: false,
        scannableUpcCount: 0,
        bbox: null
      },
      expiryDate: {
        applicable: false,
        visible: null,
        covered: false,
        text: null,
        bbox: null
      },
      handlingMarks: {
        required: ["SUFFOCATION_WARNING"],
        detected: [],
        missing: ["SUFFOCATION_WARNING"]
      },
      physicalProperties: {
        filmThicknessMil: {
          claimed: 1.5,
          visuallyMeasurable: false,
          epistemicStatus: "UNCERTAIN_PHYSICAL_LIMITATION",
          explanation: "Visual optical evidence cannot verify 1.5 mil thickness standard."
        }
      }
    }
  },
  {
    id: "scenario-3",
    title: "Scenario 3: Obscured / Illegible Warning (FAIL)",
    subtitle: "Safety Text Folded into Bottom Gusset & Low Contrast",
    workOrderId: "WO-98421",
    productName: "Cuddly Soft Teddy Bear 12in",
    productCategory: "Toys / Plush",
    expectedVerdict: "FAIL",
    primaryReason: "Suffocation warning text is obscured: folded into bottom seam gusset with severe ink degradation and contrast ratio (2.1:1) below minimum threshold.",
    imagePreviewDescription: "Polybagged toy with suffocation warning positioned directly over the folded bottom gusset; bottom lines of text are cut off by plastic crease and unreadable.",
    productColor: "#7B4F39",
    type: "FAIL_WARNING_OBSCURED",
    visualEntities: {
      polybag: {
        present: true,
        sealed: true,
        sealType: "continuous-heat-weld",
        sealIntegrityScore: 92,
        openingWidthInches: 10.0,
        bbox: { x: 80, y: 30, w: 440, h: 540, label: "Polybag Boundary" }
      },
      seam: {
        present: true,
        type: "gusset-crease",
        bbox: { x: 80, y: 510, w: 440, h: 40, label: "Bottom Gusset Seam" }
      },
      suffocationWarning: {
        present: true,
        legible: false,
        legibilityScore: 31,
        fontSizePt: 8,
        contrastRatio: 2.1,
        textDetected: "WARN... suffo... [UNREADABLE FOLDED FRAGMENT]",
        bbox: { x: 120, y: 505, w: 360, h: 50, label: "Suffocation Warning (FAIL: Obscured in Gusset)" }
      },
      fnskuLabel: {
        present: true,
        code: "X003A89XYZ",
        title: "Cuddly Soft Teddy Bear 12in",
        surfaceType: "FLAT",
        curvatureAngleDeg: 3.0,
        seamDistanceInches: 2.5,
        onFoldOrSeam: false,
        bbox: { x: 160, y: 160, w: 280, h: 140, label: "FNSKU Label" }
      },
      originalBarcode: {
        covered: true,
        exposedUpcFound: false,
        scannableUpcCount: 0,
        bbox: null
      },
      expiryDate: { applicable: false, visible: null, covered: false, text: null, bbox: null },
      handlingMarks: { required: [], detected: [], missing: [] },
      physicalProperties: { filmThicknessMil: { visuallyMeasurable: false, epistemicStatus: "UNCERTAIN_PHYSICAL_LIMITATION" } }
    }
  },
  {
    id: "scenario-4",
    title: "Scenario 4: Incorrect FNSKU Placement — Curved Edge (FAIL)",
    subtitle: "FNSKU Label Bent Across 90° Cylindrical Bottle Shoulder",
    workOrderId: "WO-98424",
    productName: "Hydrating Argan Shampoo & Conditioner 2-Pack Bundle",
    productCategory: "Beauty / Haircare Sets",
    expectedVerdict: "FAIL",
    primaryReason: "FNSKU barcode label is wrapped across a sharp curved cylinder corner (surface curvature 38.4° > 15° limit), rendering optical laser scan invalid.",
    imagePreviewDescription: "Cylindrical bottle where operator slapped the FNSKU sticker directly over the rounded curved shoulder corner. The barcode lines curve abruptly around 90 degrees.",
    productColor: "#0D6EFD",
    type: "FAIL_FNSKU_CURVED",
    visualEntities: {
      polybag: {
        present: true,
        sealed: true,
        sealType: "shrink-wrap-sealed",
        sealIntegrityScore: 90,
        openingWidthInches: 8.5,
        bbox: { x: 90, y: 40, w: 420, h: 520, label: "Shrink Polybag" }
      },
      seam: {
        present: true,
        type: "shrink-overlap",
        bbox: { x: 90, y: 40, w: 420, h: 20, label: "Shrink Seam" }
      },
      suffocationWarning: {
        present: true,
        legible: true,
        legibilityScore: 92,
        fontSizePt: 14,
        contrastRatio: 6.8,
        textDetected: "WARNING: Keep this plastic bag away from babies...",
        bbox: { x: 130, y: 420, w: 340, h: 80, label: "Suffocation Warning (Pass)" }
      },
      fnskuLabel: {
        present: true,
        code: "X009J77XYZ",
        title: "Hydrating Argan Shampoo 2PK",
        surfaceType: "SHARP_CURVATURE",
        curvatureAngleDeg: 38.4,
        seamDistanceInches: 1.8,
        onFoldOrSeam: false,
        bbox: { x: 75, y: 150, w: 180, h: 170, label: "FNSKU Label (FAIL: Placed Across Curved Edge, 38.4° Bend)" }
      },
      originalBarcode: {
        covered: true,
        exposedUpcFound: false,
        scannableUpcCount: 0,
        bbox: null
      },
      expiryDate: {
        applicable: true,
        visible: true,
        covered: false,
        text: "EXP 08/2026",
        bbox: { x: 340, y: 350, w: 120, h: 40, label: "Expiry Date (Visible)" }
      },
      handlingMarks: {
        required: ["SOLD_AS_SET"],
        detected: ["SOLD_AS_SET", "SUFFOCATION_WARNING"],
        missing: []
      },
      physicalProperties: { filmThicknessMil: { visuallyMeasurable: false, epistemicStatus: "UNCERTAIN_PHYSICAL_LIMITATION" } }
    }
  },
  {
    id: "scenario-5",
    title: "Scenario 5: FNSKU Placed on Heat-Seal Seam (FAIL)",
    subtitle: "Label Affixed Directly Over Raised Polybag Crimp Seam",
    workOrderId: "WO-98421",
    productName: "Cuddly Soft Teddy Bear 12in",
    productCategory: "Toys / Plush",
    expectedVerdict: "FAIL",
    primaryReason: "FNSKU label is affixed directly over the bag's heat-seal seam weld (clearance 0.0\"), distorting barcode parallel lines and risking label peel-off.",
    imagePreviewDescription: "Polybagged unit where FNSKU sticker was pasted right on top of the heat-seal closure seam. The raised plastic bead wrinkles the barcode in the center.",
    productColor: "#8D5B4C",
    type: "FAIL_FNSKU_ON_SEAM",
    visualEntities: {
      polybag: {
        present: true,
        sealed: true,
        sealType: "continuous-heat-weld",
        sealIntegrityScore: 94,
        openingWidthInches: 10.0,
        bbox: { x: 80, y: 30, w: 440, h: 540, label: "Polybag Boundary" }
      },
      seam: {
        present: true,
        type: "heat-seal-ridge",
        bbox: { x: 80, y: 30, w: 440, h: 26, label: "Heat Seal Seam Ridge" }
      },
      suffocationWarning: {
        present: true,
        legible: true,
        legibilityScore: 95,
        fontSizePt: 14,
        contrastRatio: 7.2,
        textDetected: "WARNING: To avoid danger of suffocation...",
        bbox: { x: 130, y: 410, w: 340, h: 90, label: "Suffocation Warning (Pass)" }
      },
      fnskuLabel: {
        present: true,
        code: "X003A89XYZ",
        title: "Cuddly Soft Teddy Bear 12in",
        surfaceType: "SEAM_COLLISION",
        curvatureAngleDeg: 4.5,
        seamDistanceInches: 0.0,
        onFoldOrSeam: true,
        bbox: { x: 160, y: 20, w: 280, h: 130, label: "FNSKU Label (FAIL: Overlaps Heat-Seal Seam Ridge)" }
      },
      originalBarcode: {
        covered: true,
        exposedUpcFound: false,
        scannableUpcCount: 0,
        bbox: null
      },
      expiryDate: { applicable: false, visible: null, covered: false, text: null, bbox: null },
      handlingMarks: { required: [], detected: ["SUFFOCATION_WARNING"], missing: [] },
      physicalProperties: { filmThicknessMil: { visuallyMeasurable: false, epistemicStatus: "UNCERTAIN_PHYSICAL_LIMITATION" } }
    }
  },
  {
    id: "scenario-6",
    title: "Scenario 6: Original Manufacturer Barcode Visible (FAIL)",
    subtitle: "Dual Barcode Hazard: Uncovered UPC-A Beside FNSKU",
    workOrderId: "WO-98421",
    productName: "Cuddly Soft Teddy Bear 12in",
    productCategory: "Toys / Plush",
    expectedVerdict: "FAIL",
    primaryReason: "Original manufacturer UPC barcode (012345678905) remains fully exposed and scannable adjacent to the FNSKU, violating Amazon FBA dual-barcode prohibition.",
    imagePreviewDescription: "Operator affixed FNSKU label on top right corner, leaving original manufacturer UPC-A barcode clearly exposed on bottom left. Both barcodes are scannable simultaneously.",
    productColor: "#8D5B4C",
    type: "FAIL_UPC_EXPOSED",
    visualEntities: {
      polybag: {
        present: true,
        sealed: true,
        sealType: "continuous-heat-weld",
        sealIntegrityScore: 96,
        openingWidthInches: 10.0,
        bbox: { x: 80, y: 30, w: 440, h: 540, label: "Polybag Boundary" }
      },
      seam: {
        present: true,
        type: "heat-seal-ridge",
        bbox: { x: 80, y: 30, w: 440, h: 22, label: "Heat Seal Weld" }
      },
      suffocationWarning: {
        present: true,
        legible: true,
        legibilityScore: 94,
        fontSizePt: 14,
        contrastRatio: 7.0,
        textDetected: "WARNING: To avoid danger of suffocation...",
        bbox: { x: 130, y: 410, w: 340, h: 85, label: "Suffocation Warning (Pass)" }
      },
      fnskuLabel: {
        present: true,
        code: "X003A89XYZ",
        title: "Cuddly Soft Teddy Bear 12in",
        surfaceType: "FLAT",
        curvatureAngleDeg: 1.5,
        seamDistanceInches: 2.1,
        onFoldOrSeam: false,
        bbox: { x: 260, y: 150, w: 240, h: 120, label: "FNSKU Label (Pass Placement)" }
      },
      originalBarcode: {
        covered: false,
        exposedUpcFound: true,
        scannableUpcCount: 1,
        upcValue: "012345678905",
        bbox: { x: 110, y: 260, w: 140, h: 80, label: "Exposed Original UPC (FAIL: Uncovered)", status: "EXPOSED_FAIL" }
      },
      expiryDate: { applicable: false, visible: null, covered: false, text: null, bbox: null },
      handlingMarks: { required: [], detected: ["SUFFOCATION_WARNING"], missing: [] },
      physicalProperties: { filmThicknessMil: { visuallyMeasurable: false, epistemicStatus: "UNCERTAIN_PHYSICAL_LIMITATION" } }
    }
  },
  {
    id: "scenario-7",
    title: "Scenario 7: Expiration Date Covered by FNSKU Label (FAIL)",
    subtitle: "Critical Compliance Failure: Lot Expiration Date Occluded",
    workOrderId: "WO-98423",
    productName: "Organic Vitamin C Immune Gummies 60ct",
    productCategory: "Health & Supplements",
    expectedVerdict: "FAIL",
    primaryReason: "Expiration date stamped on bottle ('EXP: 11/2027') is partially covered and obscured by the FNSKU label, triggering immediate warehouse rejection.",
    imagePreviewDescription: "Supplement bottle in polybag. FNSKU label was pasted directly over the manufacturer expiration date block, blocking '2027' and lot code digits.",
    productColor: "#D97706",
    type: "FAIL_EXPIRY_COVERED",
    visualEntities: {
      polybag: {
        present: true,
        sealed: true,
        sealType: "heat-seal",
        sealIntegrityScore: 95,
        openingWidthInches: 4.5,
        bbox: { x: 110, y: 40, w: 380, h: 520, label: "Polybag Boundary (<5\" opening)" }
      },
      seam: {
        present: true,
        type: "heat-seal",
        bbox: { x: 110, y: 40, w: 380, h: 20, label: "Top Seal" }
      },
      suffocationWarning: {
        present: false,
        legible: null,
        legibilityScore: null,
        fontSizePt: null,
        contrastRatio: null,
        textDetected: null,
        exemption: "Opening < 5.0 inches (4.5\" opening exempt from warning)",
        bbox: null
      },
      fnskuLabel: {
        present: true,
        code: "X0088KV99Q",
        title: "Organic Vitamin C Gummies 60ct",
        surfaceType: "FLAT",
        curvatureAngleDeg: 2.2,
        seamDistanceInches: 1.5,
        onFoldOrSeam: false,
        bbox: { x: 170, y: 220, w: 260, h: 140, label: "FNSKU Label (Overlapping Expiry)" }
      },
      originalBarcode: {
        covered: true,
        exposedUpcFound: false,
        scannableUpcCount: 0,
        bbox: null
      },
      expiryDate: {
        applicable: true,
        visible: false,
        covered: true,
        textDetectedPartial: "EXP 11/... [OCCLUDED]",
        bbox: { x: 230, y: 205, w: 140, h: 45, label: "Expiration Date (FAIL: Covered by FNSKU)", status: "COVERED_FAIL" }
      },
      handlingMarks: { required: [], detected: [], missing: [] },
      physicalProperties: { filmThicknessMil: { visuallyMeasurable: false, epistemicStatus: "UNCERTAIN_PHYSICAL_LIMITATION" } }
    }
  },
  {
    id: "scenario-8",
    title: "Scenario 8: Missing 'Sold as Set' Handling Mark (FAIL)",
    subtitle: "2-Pack Multi-Unit Bundle Lacks Mandatory 'Do Not Separate' Mark",
    workOrderId: "WO-98424",
    productName: "Hydrating Argan Shampoo & Conditioner 2-Pack Bundle",
    productCategory: "Beauty / Haircare Sets",
    expectedVerdict: "FAIL",
    primaryReason: "Multi-item bundle lacks mandatory 'Sold as Set - Do Not Separate' or 'Ready to Ship' label. Warehouse receiving risks separating units into single bottles.",
    imagePreviewDescription: "Twin shampoo and conditioner bottles polybagged together. Polybag is sealed and FNSKU attached, but mandatory bright neon 'Sold as Set' label is missing.",
    productColor: "#0284C7",
    type: "FAIL_MISSING_HANDLING_MARK",
    visualEntities: {
      polybag: {
        present: true,
        sealed: true,
        sealType: "continuous-heat-weld",
        sealIntegrityScore: 96,
        openingWidthInches: 8.5,
        bbox: { x: 80, y: 30, w: 440, h: 540, label: "Bundle Polybag Boundary" }
      },
      seam: {
        present: true,
        type: "heat-seal",
        bbox: { x: 80, y: 30, w: 440, h: 22, label: "Top Weld" }
      },
      suffocationWarning: {
        present: true,
        legible: true,
        legibilityScore: 93,
        fontSizePt: 14,
        contrastRatio: 6.9,
        textDetected: "WARNING: To avoid danger of suffocation...",
        bbox: { x: 130, y: 420, w: 340, h: 80, label: "Suffocation Warning (Pass)" }
      },
      fnskuLabel: {
        present: true,
        code: "X009J77XYZ",
        title: "Argan Shampoo & Conditioner 2PK",
        surfaceType: "FLAT",
        curvatureAngleDeg: 2.0,
        seamDistanceInches: 2.5,
        onFoldOrSeam: false,
        bbox: { x: 170, y: 160, w: 260, h: 130, label: "FNSKU Label (Pass Placement)" }
      },
      originalBarcode: {
        covered: true,
        exposedUpcFound: false,
        scannableUpcCount: 0,
        bbox: null
      },
      expiryDate: {
        applicable: true,
        visible: true,
        covered: false,
        text: "EXP 08/2026",
        bbox: { x: 330, y: 330, w: 120, h: 40, label: "Expiry Date (Visible)" }
      },
      handlingMarks: {
        required: ["SOLD_AS_SET"],
        detected: ["SUFFOCATION_WARNING"],
        missing: ["SOLD_AS_SET"]
      },
      physicalProperties: { filmThicknessMil: { visuallyMeasurable: false, epistemicStatus: "UNCERTAIN_PHYSICAL_LIMITATION" } }
    }
  },
  {
    id: "scenario-9",
    title: "Scenario 9: Visually Ambiguous / Unmeasurable Evidence (UNCERTAIN)",
    subtitle: "High Specular Flash Glare & Bag Thickness Physical Limitation",
    workOrderId: "WO-98421",
    productName: "Cuddly Soft Teddy Bear 12in",
    productCategory: "Toys / Plush",
    expectedVerdict: "UNCERTAIN",
    primaryReason: "Visual evidence cannot support definitive verdict: Severe camera flash glare blocks 65% of safety text; plastic film gauge (1.5 mil) cannot be optically measured.",
    imagePreviewDescription: "Photograph with blinding camera flash glare blinding the warning label area. Reflection obscures barcode lines and text characters. Visual epistemics require human re-check.",
    productColor: "#8D5B4C",
    type: "UNCERTAIN_AMBIGUOUS_EVIDENCE",
    visualEntities: {
      polybag: {
        present: true,
        sealed: "UNCERTAIN_OBSCURED",
        sealType: "glare-obscured",
        sealIntegrityScore: 52,
        openingWidthInches: 10.0,
        bbox: { x: 80, y: 30, w: 440, h: 540, label: "Polybag Boundary (Glare-Affected)" }
      },
      seam: {
        present: true,
        type: "partially-occluded",
        bbox: { x: 80, y: 30, w: 440, h: 22, label: "Top Seam (Washout)" }
      },
      suffocationWarning: {
        present: "UNCERTAIN",
        legible: false,
        legibilityScore: 38,
        fontSizePt: 12,
        contrastRatio: 1.4,
        glareIndexPct: 68,
        textDetected: "WA... [WASHED OUT BY SPECULAR REFLECTION] ...toy",
        bbox: { x: 130, y: 410, w: 340, h: 90, label: "Warning Region (UNCERTAIN: Glare Reflection Obscuration)" }
      },
      fnskuLabel: {
        present: true,
        code: "X003A89XYZ",
        title: "Cuddly Soft Teddy Bear",
        surfaceType: "FLAT",
        curvatureAngleDeg: 2.0,
        seamDistanceInches: 2.4,
        onFoldOrSeam: false,
        bbox: { x: 160, y: 160, w: 280, h: 140, label: "FNSKU Label (Readable)" }
      },
      originalBarcode: {
        covered: "UNCERTAIN_OCCLUDED",
        exposedUpcFound: false,
        scannableUpcCount: 0,
        explanation: "Reverse side of item not photographed; cannot visually guarantee no exposed barcode on unobserved back plane.",
        bbox: null
      },
      expiryDate: { applicable: false, visible: null, covered: false, text: null, bbox: null },
      handlingMarks: { required: [], detected: [], missing: [] },
      physicalProperties: {
        filmThicknessMil: {
          visuallyMeasurable: false,
          epistemicStatus: "UNCERTAIN_PHYSICAL_LIMITATION",
          explanation: "Plastic thickness (1.5 mil standard) cannot be verified from 2D image without micrometer gauge."
        }
      }
    }
  },
  {
    id: "scenario-10",
    title: "Scenario 10: Fragile Ceramic Mug Lacks Bubble Wrap & Fragile Mark (FAIL)",
    subtitle: "Ceramic Item in Thin Polybag Lacks Required 3-Layer Bubble Wrap",
    workOrderId: "WO-98425",
    productName: "Artisan Stoneware Coffee Mug 16oz",
    productCategory: "Home & Kitchen / Ceramics",
    expectedVerdict: "FAIL",
    primaryReason: "Fragile ceramic product packaged in thin unpadded polybag without mandatory 3-layer bubble wrap protection and missing 'Fragile' handling mark.",
    imagePreviewDescription: "Stoneware mug packaged loosely in transparent polybag without protective bubble wrap cushioning or 'Fragile' caution stickers.",
    productColor: "#F8FAFC",
    type: "FAIL_FRAGILE_PREP",
    visualEntities: {
      polybag: {
        present: true,
        sealed: true,
        sealType: "heat-seal",
        sealIntegrityScore: 92,
        openingWidthInches: 6.0,
        bbox: { x: 90, y: 40, w: 420, h: 520, label: "Polybag (No Bubble Cushioning)" }
      },
      seam: {
        present: true,
        type: "heat-seal",
        bbox: { x: 90, y: 40, w: 420, h: 20, label: "Top Seal" }
      },
      suffocationWarning: {
        present: true,
        legible: true,
        legibilityScore: 91,
        fontSizePt: 10,
        contrastRatio: 6.5,
        textDetected: "WARNING: Keep this bag away from babies...",
        bbox: { x: 130, y: 430, w: 340, h: 70, label: "Suffocation Warning (Pass)" }
      },
      fnskuLabel: {
        present: true,
        code: "X0019MM881",
        title: "Artisan Stoneware Coffee Mug 16oz",
        surfaceType: "FLAT",
        curvatureAngleDeg: 3.5,
        seamDistanceInches: 1.9,
        onFoldOrSeam: false,
        bbox: { x: 170, y: 170, w: 260, h: 130, label: "FNSKU Label" }
      },
      originalBarcode: {
        covered: true,
        exposedUpcFound: false,
        scannableUpcCount: 0,
        bbox: null
      },
      expiryDate: { applicable: false, visible: null, covered: false, text: null, bbox: null },
      handlingMarks: {
        required: ["FRAGILE"],
        detected: ["SUFFOCATION_WARNING"],
        missing: ["FRAGILE"]
      },
      physicalProperties: {
        bubbleWrapPresent: false,
        dropTestProof: "FAIL_MISSING_CUSHIONING",
        filmThicknessMil: { visuallyMeasurable: false, epistemicStatus: "UNCERTAIN_PHYSICAL_LIMITATION" }
      }
    }
  }
];
