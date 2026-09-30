// Authoritative Inbound Preparation Rules Database with Verbatim Requirement Clauses
// Sourced from Amazon FBA Inbound Compliance Standard (2026 Edition),
// Walmart Fulfillment Services (WFS) Supplier Guide, CPSIA, and ASTM D3951.

export const AUTHORITATIVE_RULES = [
  {
    id: "RULE-POLY-01",
    category: "Polybag Presence",
    title: "Mandatory Polybagging by Product Category",
    standard: "Amazon FBA Manual § 4.2.1",
    verbatimClause: "All products that are plush, textile/apparel, loose sets, powders, or liquids without secondary seal must be completely enclosed in a transparent polybag to prevent contamination, moisture, and dust during fulfillment center handling.",
    visuallyVerifiable: true,
    severity: "HIGH",
    applicableCategories: ["Toys / Plush", "Apparel / Textiles", "Beauty / Haircare Sets", "Baby Products", "Powders / Pellets"],
    economicFeeUsd: 0.85,
    delayRiskDays: 5,
    criteria: [
      "Bag must be completely transparent or translucent enough for barcode scanning",
      "Bag must not protrude more than 3.0 inches past product dimensions",
      "Must enclose 100% of product body with no exposed parts"
    ],
    resolutionAngleRequired: "Front and rear full-body perspective"
  },
  {
    id: "RULE-SEAL-02",
    category: "Polybag Sealing",
    title: "Hermetic Sealing & Closure Integrity",
    standard: "Amazon FBA Manual § 4.3.2 / ASTM D3951 § 7.1",
    verbatimClause: "Polybags must be completely sealed using a continuous heat-seal weld, permanent peel-and-seal adhesive strip, or heavy-duty packaging tape. Bags must not be open, loosely folded, or easily peelable. Ziplock bags alone without tape are strictly prohibited.",
    visuallyVerifiable: true,
    severity: "HIGH",
    applicableCategories: ["ALL"],
    economicFeeUsd: 0.45,
    delayRiskDays: 3,
    criteria: [
      "Continuous heat seal line or taped closure across 100% of opening width",
      "No gaps, loose flaps, or unsealed openings greater than 0.25 inches",
      "Ziplock closure alone is prohibited unless taped shut along entire zipper ridge"
    ],
    resolutionAngleRequired: "Top edge close-up showing seal weld continuity"
  },
  {
    id: "RULE-WARN-03",
    category: "Suffocation Warning",
    title: "Mandatory Suffocation Warning for Bags >= 5\" Opening",
    standard: "Amazon FBA Manual § 4.4.1 / CPSIA 16 CFR § 1500.121",
    verbatimClause: "Polybags with an opening of 5.0 inches or greater (measured flat) MUST have a printed suffocation warning or a prominent warning label stating: 'WARNING: To avoid danger of suffocation, keep this plastic bag away from babies and children. Do not use in cribs, beds, carriages, or playpens. This bag is not a toy.'",
    visuallyVerifiable: true,
    severity: "CRITICAL",
    applicableCategories: ["ALL"],
    economicFeeUsd: 0.50,
    delayRiskDays: 4,
    criteria: [
      "Mandatory if bag opening dimension >= 5.0 inches flat",
      "Required verbatim wording must be present in English (or bilingual as needed)",
      "Minimum font size scale: >=60\" total: 24pt; 40-59\": 18pt; 30-39\": 14pt; <30\": 10pt",
      "Warning must be placed in a prominent, unoccluded exterior position"
    ],
    resolutionAngleRequired: "Frontal macro shot of warning text under diffuse non-glare lighting"
  },
  {
    id: "RULE-WARN-LEG-04",
    category: "Warning Visibility & Legibility",
    title: "Suffocation Warning Contrast & Position Legibility",
    standard: "Amazon FBA Manual § 4.4.3 / Walmart WFS § 3.2.2",
    verbatimClause: "The suffocation warning must be legible against the product color beneath it with high visual contrast (minimum 4.5:1 ratio). Warnings must not be folded into bottom gussets, obscured by plastic wrinkles, or placed across bag seams where ink becomes distorted.",
    visuallyVerifiable: true,
    severity: "HIGH",
    applicableCategories: ["ALL"],
    economicFeeUsd: 0.40,
    delayRiskDays: 3,
    criteria: [
      "Optical contrast ratio >= 4.5:1 against background product color or white sticker backing",
      "Must not be tucked into bottom or side gusset creases",
      "Must not be covered by other shipping labels, tape, or reflective glare"
    ],
    resolutionAngleRequired: "Planar view perpendicular to warning surface without specular glare"
  },
  {
    id: "RULE-FNSKU-SURF-05",
    category: "FNSKU Label Placement",
    title: "FNSKU Placement on Planar Non-Curved Surface",
    standard: "Amazon FBA Manual § 5.1.2 / GS1 Standard § 6.2.1",
    verbatimClause: "FNSKU labels must be applied on an outermost flat planar surface of the product package. Placing a barcode label across a curved edge, corner contour, or cylindrical shoulder with curvature exceeding 15 degrees causes laser scanner distortion and is strictly non-compliant.",
    visuallyVerifiable: true,
    severity: "CRITICAL",
    applicableCategories: ["ALL"],
    economicFeeUsd: 0.65,
    delayRiskDays: 7,
    criteria: [
      "Affixed onto outermost planar flat surface",
      "Surface curvature angle must not exceed 15.0 degrees across barcode width",
      "Barcode parallel bars must not be warped, stretched, or truncated by curved edges",
      "Quiet zone margins of at least 0.25 inches (6.35mm) required around barcode"
    ],
    resolutionAngleRequired: "Profile angle shot showing label flatness relative to package edges"
  },
  {
    id: "RULE-FNSKU-SEAM-06",
    category: "FNSKU Seam Clearance",
    title: "Prohibition of FNSKU Placement Over Seams or Creases",
    standard: "Amazon FBA Manual § 5.2.4",
    verbatimClause: "FNSKU labels must maintain a minimum 0.5-inch clearance from any bag seam, heat-seal crimp, or perforated bag fold. Placing barcodes over seams causes label wrinkling and prevents automated inbound scanner reads.",
    visuallyVerifiable: true,
    severity: "HIGH",
    applicableCategories: ["ALL"],
    economicFeeUsd: 0.40,
    delayRiskDays: 4,
    criteria: [
      "Minimum 0.5-inch (12.7mm) clearance from any packaging seam, fold flap, or heat-seal weld",
      "Zero label creasing, puckering, or ridge deformation allowed across barcode"
    ],
    resolutionAngleRequired: "Close-up showing spacing between label borders and heat-seal seam"
  },
  {
    id: "RULE-UPC-COV-07",
    category: "Original Barcode Covered",
    title: "Complete Suppression of Manufacturer Barcodes",
    standard: "Amazon FBA Manual § 5.3.1 / Walmart WFS § 4.1.3",
    verbatimClause: "Any original manufacturer barcode (UPC, EAN, ISBN, JAN) must be completely covered and obscured. No competing scannable barcodes may be visible on the exterior packaging. Having dual scannable barcodes results in immediate receiving failure and misdirected stock.",
    visuallyVerifiable: true,
    severity: "CRITICAL",
    applicableCategories: ["ALL"],
    economicFeeUsd: 0.75,
    delayRiskDays: 8,
    criteria: [
      "Zero visible competing 1D or 2D manufacturer barcodes on packaging",
      "FNSKU must be the sole scannable inventory barcode",
      "Covering label must be completely opaque; underlying barcode must not show through"
    ],
    resolutionAngleRequired: "Both front and reverse side photographs to verify all 6 faces"
  },
  {
    id: "RULE-EXP-VIS-08",
    category: "Expiry-Date Visibility",
    title: "Expiration Date Visibility and Non-Obscuration",
    standard: "Amazon FBA Manual § 6.2.3 / FDA 21 CFR § 101",
    verbatimClause: "For ingestible, topical, health, and grocery products, expiration dates must be visible to receiving personnel without opening the polybag. FNSKU stickers or prep labels MUST NOT cover or obscure the expiration date or lot code. Violations result in immediate disposal.",
    visuallyVerifiable: true,
    severity: "CRITICAL",
    applicableCategories: ["Health & Supplements", "Grocery & Gourmet Food", "Beauty / Cosmetics", "Baby Food"],
    economicFeeUsd: 1.50,
    delayRiskDays: 14,
    criteria: [
      "Expiration date must be legible from exterior without opening polybag",
      "FNSKU label or handling stickers MUST NEVER overlap or cover expiration text",
      "Format must be MM-YYYY or YYYY-MM-DD in standard legible font",
      "If underlying date is obscured by frosted plastic, a secondary 36pt expiration label must be affixed on polybag exterior"
    ],
    resolutionAngleRequired: "Macro shot of expiration date stamp and FNSKU boundary"
  },
  {
    id: "RULE-HAND-MARK-09",
    category: "Required Handling Marks",
    title: "Bundle & Safety Handling Marks",
    standard: "Amazon FBA Manual § 7.2.1 & § 7.5.3",
    verbatimClause: "Multi-packs or bundled sets must feature a prominent 'Sold as Set - Do Not Separate' or 'Ready to Ship' label across the primary closure. Fragile glass/ceramic items require 'Fragile - Handle With Care' markings. Items exceeding 50 lbs require 'Team Lift' labels.",
    visuallyVerifiable: true,
    severity: "HIGH",
    applicableCategories: ["Bundles / Sets", "Home & Kitchen / Ceramics", "Heavy Goods", "Liquids"],
    economicFeeUsd: 0.50,
    delayRiskDays: 5,
    criteria: [
      "Sets/Bundles: 'Sold as Set - Do Not Separate' label affixed over opening seam",
      "Glass/Ceramics: 'Fragile - Handle With Care' label + 3-layer bubble wrap",
      "Liquids: 'This Side Up' orientation directional arrows",
      "Heavy (>50 lbs): 'Team Lift' label"
    ],
    resolutionAngleRequired: "Full set view showing bundle seal and handling stickers"
  },
  {
    id: "RULE-THICK-LIMIT-10",
    category: "Physical Properties & Thickness",
    title: "Polybag Film Gauge (1.5 mil Requirement)",
    standard: "Amazon FBA Manual § 4.2.3",
    verbatimClause: "Polybags must have a minimum thickness of 1.5 mil (0.0381 mm) to prevent puncturing and tearing during conveyor distribution.",
    visuallyVerifiable: false,
    visualFeasibilityExplanation: "Optical 2D photography cannot measure plastic film micron/mil thickness without destructive tactile micrometry or calibrated laser interferometry. Agent must declare UNCERTAIN — Insufficient Evidence rather than guessing.",
    severity: "MEDIUM",
    applicableCategories: ["ALL"],
    economicFeeUsd: 0.0,
    delayRiskDays: 0,
    criteria: [
      "Requires physical thickness caliper / micrometer test",
      "Optical image alone cannot confirm 1.5 mil compliance"
    ],
    resolutionAngleRequired: "Non-optical physical micrometer measurement required at prep station"
  }
];

export const WORK_ORDERS = [
  {
    orderId: "WO-98421",
    asin: "B09X8K2M1L",
    sku: "PLUSH-TEDDY-BRWN-01",
    productName: "Cuddly Soft Teddy Bear 12in",
    category: "Toys / Plush",
    operator: "Operator A (Station 04)",
    batchId: "BATCH-2026-09A",
    requiredPrep: ["Polybag", "Suffocation Warning (>=5\")", "FNSKU Label", "Cover UPC"],
    isSet: false,
    hasExpiry: false,
    requiresFragile: false,
    bagOpeningInches: 10.0
  },
  {
    orderId: "WO-98422",
    asin: "B07T4Z98QP",
    sku: "APP-HOODIE-BLK-XL",
    productName: "Heavyweight Fleece Hoodie Black XL",
    category: "Apparel / Textiles",
    operator: "Operator B (Station 02)",
    batchId: "BATCH-2026-09B",
    requiredPrep: ["Polybag", "Suffocation Warning (>=5\")", "FNSKU Label", "Cover UPC"],
    isSet: false,
    hasExpiry: false,
    requiresFragile: false,
    bagOpeningInches: 14.0
  },
  {
    orderId: "WO-98423",
    asin: "B089KLP321",
    sku: "SUPP-GUMMY-VITC-60CT",
    productName: "Organic Vitamin C Immune Gummies 60ct",
    category: "Health & Supplements",
    operator: "Operator C (Station 01)",
    batchId: "BATCH-2026-09C",
    requiredPrep: ["Polybag", "FNSKU Label", "Cover UPC", "Verify Expiry Date Visible"],
    isSet: false,
    hasExpiry: true,
    expectedExpiry: "2027-11-30",
    requiresFragile: false,
    bagOpeningInches: 4.5
  },
  {
    orderId: "WO-98424",
    asin: "B0CL88123X",
    sku: "BNDL-SHAMP-COND-2PK",
    productName: "Hydrating Argan Shampoo & Conditioner 2-Pack Bundle",
    category: "Beauty / Haircare Sets",
    operator: "Operator B (Station 02)",
    batchId: "BATCH-2026-09B",
    requiredPrep: ["Polybag", "Sold as Set Label", "Suffocation Warning (>=5\")", "FNSKU Label", "Cover UPC", "Cap Double-Seal"],
    isSet: true,
    hasExpiry: true,
    expectedExpiry: "2026-08-15",
    requiresFragile: false,
    bagOpeningInches: 8.5
  },
  {
    orderId: "WO-98425",
    asin: "B01N0X789Y",
    sku: "CERAM-MUG-16OZ-WHT",
    productName: "Artisan Stoneware Coffee Mug 16oz",
    category: "Home & Kitchen / Ceramics",
    operator: "Operator A (Station 04)",
    batchId: "BATCH-2026-09A",
    requiredPrep: ["Bubble Wrap (3 layers)", "Fragile Label", "FNSKU Label", "Cover UPC", "Drop Test Proof"],
    isSet: false,
    hasExpiry: false,
    requiresFragile: true,
    bagOpeningInches: 6.0
  }
];
