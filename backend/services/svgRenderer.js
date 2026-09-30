// SVG Visual Renderer for Realistic High-Fidelity Test Scenario Package Photographs

export function generateScenarioSvg(scenarioId) {
  switch (scenarioId) {
    case "scenario-1":
      // PASS: Plush toy, heat seal, suffocation warning, flat FNSKU, covered UPC
      return `
<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </radialGradient>
    <linearGradient id="polybagGloss" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18" />
      <stop offset="35%" stop-color="#ffffff" stop-opacity="0.05" />
      <stop offset="60%" stop-color="#38bdf8" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.15" />
    </linearGradient>
    <pattern id="heatCrimp" width="8" height="20" patternUnits="userSpaceOnUse">
      <line x1="2" y1="0" x2="2" y2="20" stroke="#94a3b8" stroke-width="1.5" stroke-opacity="0.5" />
      <line x1="6" y1="0" x2="6" y2="20" stroke="#cbd5e1" stroke-width="1.5" stroke-opacity="0.7" />
    </pattern>
    <linearGradient id="bearFur" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#a06048" />
      <stop offset="100%" stop-color="#693b2a" />
    </linearGradient>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Background Warehouse Inspection Table Surface -->
  <rect width="600" height="600" fill="url(#bgGlow)" />
  <circle cx="300" cy="300" r="240" fill="#1e293b" opacity="0.4" />

  <!-- PRODUCT: Plush Teddy Bear inside Polybag -->
  <g id="product_teddy" filter="url(#softShadow)">
    <!-- Ears -->
    <circle cx="210" cy="180" r="45" fill="url(#bearFur)" />
    <circle cx="210" cy="180" r="25" fill="#fbcfe8" opacity="0.6" />
    <circle cx="390" cy="180" r="45" fill="url(#bearFur)" />
    <circle cx="390" cy="180" r="25" fill="#fbcfe8" opacity="0.6" />
    <!-- Head -->
    <ellipse cx="300" cy="240" rx="110" ry="95" fill="url(#bearFur)" />
    <!-- Eyes -->
    <ellipse cx="260" cy="225" rx="9" ry="12" fill="#111827" />
    <circle cx="258" cy="221" r="3" fill="#ffffff" />
    <ellipse cx="340" cy="225" rx="9" ry="12" fill="#111827" />
    <circle cx="338" cy="221" r="3" fill="#ffffff" />
    <!-- Muzzle & Nose -->
    <ellipse cx="300" cy="265" rx="42" ry="32" fill="#d6a27e" />
    <path d="M288 255 Q300 248 312 255 Q300 270 288 255 Z" fill="#29140c" />
    <path d="M300 266 L300 278 M290 278 Q300 286 310 278" stroke="#29140c" stroke-width="3" fill="none" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="300" cy="390" rx="135" ry="125" fill="url(#bearFur)" />
    <ellipse cx="300" cy="395" rx="85" ry="75" fill="#d6a27e" opacity="0.8" />
    <!-- Paws -->
    <circle cx="180" cy="450" r="40" fill="url(#bearFur)" />
    <circle cx="420" cy="450" r="40" fill="url(#bearFur)" />
    <ellipse cx="180" cy="455" rx="20" ry="15" fill="#d6a27e" />
    <ellipse cx="420" cy="455" rx="20" ry="15" fill="#d6a27e" />
  </g>

  <!-- POLYBAG CONTAINER -->
  <rect id="polybag_outline" x="80" y="30" width="440" height="540" rx="14" fill="url(#polybagGloss)" stroke="#38bdf8" stroke-width="2" stroke-opacity="0.45" />

  <!-- Heat Seal Seam Top Ridge -->
  <g id="heat_seal_seam">
    <rect x="80" y="30" width="440" height="22" rx="4" fill="url(#heatCrimp)" stroke="#64748b" stroke-width="1.5" />
    <rect x="80" y="33" width="440" height="3" fill="#ffffff" opacity="0.5" />
    <text x="300" y="46" font-family="monospace" font-size="10" fill="#94a3b8" text-anchor="middle" font-weight="bold">HEAT-SEAL HERMETIC CRIMP [PASS]</text>
  </g>

  <!-- Polybag Plastic Wrinkles / Sheen -->
  <path d="M90 70 Q160 110 110 200 Q200 160 280 220" stroke="#ffffff" stroke-width="2" stroke-opacity="0.25" fill="none" />
  <path d="M510 100 Q440 180 480 300" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.25" fill="none" />
  <path d="M120 480 Q220 430 320 490" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.2" fill="none" />

  <!-- FNSKU LABEL (AFFIXED ON FLAT SURFACE, COVERING ORIGINAL UPC) -->
  <g id="fnsku_label" transform="translate(160, 160)">
    <rect width="280" height="140" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#softShadow)" />
    <text x="14" y="24" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0f172a">FNSKU: X003A89XYZ</text>
    <text x="14" y="40" font-family="sans-serif" font-size="9.5" fill="#475569">Cuddly Soft Teddy Bear 12in - New</text>
    <!-- 1D Barcode Pattern -->
    <g transform="translate(14, 52)">
      <rect x="0" y="0" width="4" height="52" fill="#0f172a" />
      <rect x="7" y="0" width="2" height="52" fill="#0f172a" />
      <rect x="12" y="0" width="6" height="52" fill="#0f172a" />
      <rect x="22" y="0" width="3" height="52" fill="#0f172a" />
      <rect x="29" y="0" width="7" height="52" fill="#0f172a" />
      <rect x="40" y="0" width="2" height="52" fill="#0f172a" />
      <rect x="46" y="0" width="5" height="52" fill="#0f172a" />
      <rect x="55" y="0" width="3" height="52" fill="#0f172a" />
      <rect x="62" y="0" width="8" height="52" fill="#0f172a" />
      <rect x="74" y="0" width="2" height="52" fill="#0f172a" />
      <rect x="80" y="0" width="5" height="52" fill="#0f172a" />
      <rect x="90" y="0" width="3" height="52" fill="#0f172a" />
      <rect x="97" y="0" width="6" height="52" fill="#0f172a" />
      <rect x="107" y="0" width="2" height="52" fill="#0f172a" />
      <rect x="113" y="0" width="7" height="52" fill="#0f172a" />
      <rect x="124" y="0" width="4" height="52" fill="#0f172a" />
      <rect x="132" y="0" width="2" height="52" fill="#0f172a" />
      <rect x="138" y="0" width="8" height="52" fill="#0f172a" />
      <rect x="150" y="0" width="3" height="52" fill="#0f172a" />
      <rect x="157" y="0" width="5" height="52" fill="#0f172a" />
      <rect x="166" y="0" width="2" height="52" fill="#0f172a" />
      <rect x="172" y="0" width="6" height="52" fill="#0f172a" />
      <rect x="182" y="0" width="4" height="52" fill="#0f172a" />
      <rect x="190" y="0" width="7" height="52" fill="#0f172a" />
      <rect x="201" y="0" width="2" height="52" fill="#0f172a" />
      <rect x="207" y="0" width="5" height="52" fill="#0f172a" />
      <rect x="216" y="0" width="8" height="52" fill="#0f172a" />
      <rect x="228" y="0" width="3" height="52" fill="#0f172a" />
      <rect x="235" y="0" width="5" height="52" fill="#0f172a" />
      <rect x="244" y="0" width="6" height="52" fill="#0f172a" />
    </g>
    <text x="140" y="118" font-family="monospace" font-size="12" letter-spacing="3" fill="#0f172a" text-anchor="middle">X003A89XYZ</text>
    <text x="270" y="132" font-family="sans-serif" font-size="8" fill="#15803d" text-anchor="end" font-weight="bold">✓ FLAT SURFACE</text>
  </g>

  <!-- SUFFOCATION WARNING BOX (14PT, HIGH CONTRAST, COMPLIANT) -->
  <g id="suffocation_warning_box" transform="translate(130, 410)">
    <rect width="340" height="90" rx="4" fill="#ffffff" fill-opacity="0.95" stroke="#0f172a" stroke-width="1.5" />
    <path d="M14 20 L24 38 L4 38 Z" fill="#eab308" stroke="#ca8a04" stroke-width="1" />
    <text x="14" y="34" font-family="sans-serif" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">!</text>
    <text x="32" y="32" font-family="sans-serif" font-size="14" font-weight="bold" fill="#b91c1c">WARNING</text>
    <text x="14" y="52" font-family="sans-serif" font-size="11" font-weight="600" fill="#0f172a">To avoid danger of suffocation, keep this bag away from</text>
    <text x="14" y="67" font-family="sans-serif" font-size="11" font-weight="600" fill="#0f172a">babies and children. Do not use in cribs, beds, carriages,</text>
    <text x="14" y="82" font-family="sans-serif" font-size="11" font-weight="600" fill="#0f172a">or playpens. This bag is not a toy.</text>
  </g>

  <!-- Status HUD Badge -->
  <rect x="20" y="20" width="130" height="34" rx="6" fill="#15803d" fill-opacity="0.9" />
  <text x="85" y="42" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">VERDICT: PASS</text>
</svg>
      `;

    case "scenario-2":
      // FAIL: Apparel Hoodie in 14" polybag, MISSING SUFFOCATION WARNING
      return `
<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow2" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#090d16" />
    </radialGradient>
    <linearGradient id="polybagGloss2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.04" />
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.12" />
    </linearGradient>
    <filter id="softShadow2" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <rect width="600" height="600" fill="url(#bgGlow2)" />

  <!-- PRODUCT: Black Fleece Folded Hoodie -->
  <g id="product_hoodie" filter="url(#softShadow2)">
    <rect x="110" y="80" width="380" height="440" rx="18" fill="#18181b" stroke="#27272a" stroke-width="2" />
    <!-- Fabric Texture Folds -->
    <path d="M120 180 Q300 210 480 180" stroke="#27272a" stroke-width="4" fill="none" />
    <path d="M130 290 Q300 320 470 290" stroke="#27272a" stroke-width="4" fill="none" />
    <path d="M140 400 Q300 425 460 400" stroke="#27272a" stroke-width="4" fill="none" />
    <!-- Hoodie Strings / Neckline detail -->
    <ellipse cx="300" cy="115" rx="55" ry="25" fill="#09090b" />
    <path d="M285 130 L275 185" stroke="#71717a" stroke-width="3" stroke-linecap="round" />
    <path d="M315 130 L325 185" stroke="#71717a" stroke-width="3" stroke-linecap="round" />
    <text x="300" y="105" font-family="sans-serif" font-size="11" fill="#71717a" text-anchor="middle" font-weight="bold">HEAVYWEIGHT FLEECE XL</text>
  </g>

  <!-- 14 INCH POLYBAG -->
  <rect x="70" y="40" width="460" height="520" rx="14" fill="url(#polybagGloss2)" stroke="#38bdf8" stroke-width="2" stroke-opacity="0.5" />
  
  <!-- Adhesive Tape Strip Closure Top -->
  <rect x="70" y="40" width="460" height="25" fill="#f8fafc" fill-opacity="0.3" stroke="#94a3b8" stroke-width="1" />
  <text x="300" y="57" font-family="monospace" font-size="11" fill="#cbd5e1" text-anchor="middle" font-weight="bold">ADHERED FLAP CLOSURE (14.0" OPENING)</text>

  <!-- FNSKU Label (Valid Placement) -->
  <g transform="translate(160, 220)">
    <rect width="280" height="140" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
    <text x="14" y="24" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0f172a">FNSKU: X004B77KLP</text>
    <text x="14" y="40" font-family="sans-serif" font-size="9" fill="#475569">Heavyweight Fleece Hoodie Black XL - New</text>
    <!-- Barcode lines -->
    <g transform="translate(14, 52)">
      <rect x="0" y="0" width="4" height="52" fill="#0f172a" />
      <rect x="8" y="0" width="3" height="52" fill="#0f172a" />
      <rect x="15" y="0" width="6" height="52" fill="#0f172a" />
      <rect x="25" y="0" width="4" height="52" fill="#0f172a" />
      <rect x="33" y="0" width="8" height="52" fill="#0f172a" />
      <rect x="48" y="0" width="3" height="52" fill="#0f172a" />
      <rect x="56" y="0" width="6" height="52" fill="#0f172a" />
      <rect x="68" y="0" width="4" height="52" fill="#0f172a" />
      <rect x="78" y="0" width="7" height="52" fill="#0f172a" />
      <rect x="92" y="0" width="3" height="52" fill="#0f172a" />
      <rect x="100" y="0" width="5" height="52" fill="#0f172a" />
      <rect x="112" y="0" width="8" height="52" fill="#0f172a" />
      <rect x="126" y="0" width="3" height="52" fill="#0f172a" />
      <rect x="135" y="0" width="6" height="52" fill="#0f172a" />
      <rect x="148" y="0" width="4" height="52" fill="#0f172a" />
      <rect x="160" y="0" width="7" height="52" fill="#0f172a" />
      <rect x="174" y="0" width="3" height="52" fill="#0f172a" />
      <rect x="184" y="0" width="5" height="52" fill="#0f172a" />
      <rect x="195" y="0" width="8" height="52" fill="#0f172a" />
      <rect x="210" y="0" width="4" height="52" fill="#0f172a" />
      <rect x="220" y="0" width="6" height="52" fill="#0f172a" />
      <rect x="234" y="0" width="3" height="52" fill="#0f172a" />
      <rect x="242" y="0" width="7" height="52" fill="#0f172a" />
    </g>
    <text x="140" y="118" font-family="monospace" font-size="12" letter-spacing="3" fill="#0f172a" text-anchor="middle">X004B77KLP</text>
  </g>

  <!-- MISSING WARNING CALLOUT AREA (DASHED RED) -->
  <g transform="translate(130, 410)">
    <rect width="340" height="90" rx="8" fill="#ef4444" fill-opacity="0.1" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="8 6" />
    <circle cx="170" cy="45" r="24" fill="#ef4444" fill-opacity="0.2" />
    <text x="170" y="52" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ef4444" text-anchor="middle">✕</text>
    <text x="170" y="78" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f87171" text-anchor="middle">MISSING SUFFOCATION WARNING (OPENING: 14" &gt;= 5")</text>
  </g>

  <rect x="20" y="20" width="130" height="34" rx="6" fill="#dc2626" fill-opacity="0.9" />
  <text x="85" y="42" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">VERDICT: FAIL</text>
</svg>
      `;

    case "scenario-3":
      // FAIL: Obscured / Illegible Warning folded into bottom gusset
      return `
<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow3" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </radialGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bgGlow3)" />

  <!-- Product Silhouette -->
  <ellipse cx="300" cy="280" rx="140" ry="160" fill="#78350f" opacity="0.8" />
  <circle cx="210" cy="180" r="40" fill="#78350f" opacity="0.8" />
  <circle cx="390" cy="180" r="40" fill="#78350f" opacity="0.8" />

  <!-- Polybag Outer -->
  <rect x="80" y="30" width="440" height="540" rx="14" fill="#ffffff" fill-opacity="0.08" stroke="#38bdf8" stroke-width="2" />
  <rect x="80" y="30" width="440" height="22" fill="#475569" opacity="0.6" />

  <!-- FNSKU Label on Top -->
  <g transform="translate(160, 160)">
    <rect width="280" height="140" rx="6" fill="#ffffff" />
    <text x="20" y="30" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0f172a">FNSKU: X003A89XYZ</text>
    <rect x="20" y="45" width="240" height="50" fill="#1e293b" opacity="0.8" />
    <text x="140" y="115" font-family="monospace" font-size="12" fill="#0f172a" text-anchor="middle">X003A89XYZ</text>
  </g>

  <!-- Folded & Crumpled Bottom Gusset -->
  <g id="bottom_crease">
    <path d="M80 500 Q200 480 300 520 Q400 490 520 500 L520 570 L80 570 Z" fill="#334155" fill-opacity="0.85" />
    <!-- Crease lines -->
    <path d="M80 505 Q220 535 340 510 L520 540" stroke="#000000" stroke-width="4" fill="none" opacity="0.7" />
    <path d="M100 525 Q250 490 400 535" stroke="#cbd5e1" stroke-width="2.5" fill="none" opacity="0.5" />
    <path d="M150 545 Q300 515 480 550" stroke="#000000" stroke-width="3" fill="none" opacity="0.6" />
  </g>

  <!-- Obscured & Mangled Suffocation Warning In Gusset Fold -->
  <g transform="translate(120, 505)">
    <rect width="360" height="50" rx="4" fill="#f8fafc" fill-opacity="0.35" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 2" />
    <text x="20" y="24" font-family="sans-serif" font-size="10" font-weight="bold" fill="#475569" opacity="0.4">WAR... [INK WORN OFF &amp; FOLDED INTO GUSSET SEAM]</text>
    <text x="20" y="40" font-family="sans-serif" font-size="9" fill="#334155" opacity="0.3">suffocat... playpens... [TEXT TRUNCATED BY CREASE]</text>
    <!-- Red Warning Callout -->
    <rect x="250" y="8" width="100" height="20" rx="4" fill="#ef4444" />
    <text x="300" y="22" font-family="sans-serif" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">ILLEGIBLE 31%</text>
  </g>

  <rect x="20" y="20" width="130" height="34" rx="6" fill="#dc2626" fill-opacity="0.9" />
  <text x="85" y="42" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">VERDICT: FAIL</text>
</svg>
      `;

    case "scenario-4":
      // FAIL: FNSKU label placed across curved cylindrical edge / bottle shoulder
      return `
<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow4" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
    <linearGradient id="bottleShade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="15%" stop-color="#38bdf8" />
      <stop offset="60%" stop-color="#0369a1" />
      <stop offset="100%" stop-color="#0c4a6e" />
    </linearGradient>
    <linearGradient id="bentLabel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#94a3b8" />
      <stop offset="35%" stop-color="#f8fafc" />
      <stop offset="70%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bgGlow4)" />

  <!-- Cylindrical Shampoo Bottle with curved 3D shoulder -->
  <g id="cylinder_product">
    <!-- Cap -->
    <rect x="240" y="60" width="120" height="45" rx="6" fill="#0f172a" stroke="#334155" stroke-width="2" />
    <path d="M260 60 L340 60" stroke="#38bdf8" stroke-width="3" />
    <!-- Rounded Curved Shoulder -->
    <path d="M140 190 Q140 110 240 105 L360 105 Q460 110 460 190 L460 520 Q460 540 300 540 Q140 540 140 520 Z" fill="url(#bottleShade)" />
    <!-- Specular highlight streak down bottle curvature -->
    <line x1="200" y1="120" x2="200" y2="520" stroke="#ffffff" stroke-width="8" stroke-opacity="0.3" stroke-linecap="round" />
  </g>

  <!-- Clear Shrink-wrap polybag -->
  <rect x="90" y="40" width="420" height="520" rx="14" fill="#ffffff" fill-opacity="0.08" stroke="#38bdf8" stroke-width="2" stroke-opacity="0.4" />

  <!-- DEFORMED FNSKU LABEL BENT ACROSS 90° CORNER/CURVATURE -->
  <g id="bent_fnsku_label">
    <!-- Curved Label Path wrapping around shoulder -->
    <path d="M75 160 Q140 150 170 150 L250 175 L250 315 L170 295 Q140 305 75 320 Z" fill="url(#bentLabel)" stroke="#ef4444" stroke-width="2.5" />
    <!-- Curving distorted barcode bars -->
    <g stroke="#0f172a" stroke-linecap="round">
      <path d="M85 180 Q120 175 140 175 L140 285 Q120 285 85 295" stroke-width="4" />
      <path d="M95 180 Q125 175 145 175 L145 285 Q125 285 95 295" stroke-width="2" />
      <path d="M102 180 Q130 175 152 175 L152 285 Q130 285 102 295" stroke-width="6" />
      <path d="M115 180 Q138 175 160 175 L160 285 Q138 285 115 295" stroke-width="3" />
      <path d="M125 180 Q145 175 168 175 L168 285 Q145 285 125 295" stroke-width="5" />
      <!-- Straight section on flat front -->
      <line x1="180" y1="180" x2="180" y2="280" stroke-width="3" />
      <line x1="190" y1="182" x2="190" y2="282" stroke-width="5" />
      <line x1="202" y1="185" x2="202" y2="285" stroke-width="2" />
      <line x1="210" y1="187" x2="210" y2="287" stroke-width="6" />
      <line x1="225" y1="190" x2="225" y2="290" stroke-width="4" />
      <line x1="238" y1="192" x2="238" y2="292" stroke-width="5" />
    </g>
    <!-- Curvature Annotation -->
    <path d="M125 140 Q150 120 175 140" fill="none" stroke="#ef4444" stroke-width="3" marker-end="url(#arrow)" />
    <rect x="65" y="115" width="165" height="24" rx="4" fill="#ef4444" />
    <text x="147" y="131" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#ffffff" text-anchor="middle">CURVATURE: 38.4° (MAX 15°)</text>
  </g>

  <!-- Suffocation Warning (Compliant) on Lower Half -->
  <g transform="translate(130, 420)">
    <rect width="340" height="80" rx="4" fill="#ffffff" fill-opacity="0.95" stroke="#0f172a" stroke-width="1.5" />
    <text x="170" y="24" font-family="sans-serif" font-size="12" font-weight="bold" fill="#b91c1c" text-anchor="middle">WARNING: Keep away from babies...</text>
    <text x="170" y="46" font-family="sans-serif" font-size="10" fill="#0f172a" text-anchor="middle">To avoid danger of suffocation, keep this plastic bag away</text>
    <text x="170" y="62" font-family="sans-serif" font-size="10" fill="#0f172a" text-anchor="middle">from babies and children. This bag is not a toy.</text>
  </g>

  <rect x="20" y="20" width="130" height="34" rx="6" fill="#dc2626" fill-opacity="0.9" />
  <text x="85" y="42" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">VERDICT: FAIL</text>
</svg>
      `;

    case "scenario-5":
      // FAIL: FNSKU placed on heat-seal seam
      return `
<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow5" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </radialGradient>
    <pattern id="heatCrimp5" width="8" height="26" patternUnits="userSpaceOnUse">
      <line x1="2" y1="0" x2="2" y2="26" stroke="#94a3b8" stroke-width="2" />
      <line x1="6" y1="0" x2="6" y2="26" stroke="#cbd5e1" stroke-width="2" />
    </pattern>
  </defs>
  <rect width="600" height="600" fill="url(#bgGlow5)" />

  <!-- Product Box Inside -->
  <rect x="130" y="90" width="340" height="420" rx="10" fill="#3b82f6" opacity="0.75" stroke="#60a5fa" stroke-width="2" />
  <circle cx="300" cy="270" r="60" fill="#ffffff" opacity="0.3" />

  <!-- Polybag Outline -->
  <rect x="80" y="30" width="440" height="540" rx="14" fill="#ffffff" fill-opacity="0.08" stroke="#38bdf8" stroke-width="2" />

  <!-- Heat Seal Seam Ridge Across Top -->
  <rect x="80" y="30" width="440" height="26" fill="url(#heatCrimp5)" stroke="#64748b" stroke-width="2" />

  <!-- FNSKU LABEL WRINKLED DIRECTLY OVER TOP HEAT SEAL RIDGE -->
  <g transform="translate(160, 20)">
    <!-- Wrinkled deformed label over seam -->
    <path d="M0 0 L280 0 L280 130 L0 130 Z" fill="#ffffff" stroke="#ef4444" stroke-width="2.5" />
    <!-- Crimp mark showing through label -->
    <rect x="0" y="10" width="280" height="26" fill="#cbd5e1" fill-opacity="0.5" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4 2" />
    <text x="140" y="27" font-family="monospace" font-size="10" font-weight="bold" fill="#b91c1c" text-anchor="middle">⚠️ PLACED OVER HEAT-SEAL RIDGE</text>
    
    <!-- Deformed Barcode in Center -->
    <g transform="translate(15, 45)">
      <rect x="0" y="0" width="5" height="45" fill="#0f172a" />
      <rect x="10" y="0" width="3" height="45" fill="#0f172a" />
      <rect x="18" y="0" width="7" height="45" fill="#0f172a" />
      <!-- Wrinkle distortion across bars -->
      <path d="M-10 15 Q120 5 260 20" stroke="#ef4444" stroke-width="2" fill="none" />
      <rect x="30" y="0" width="4" height="45" fill="#0f172a" />
      <rect x="42" y="0" width="8" height="45" fill="#0f172a" />
      <rect x="58" y="0" width="3" height="45" fill="#0f172a" />
      <rect x="70" y="0" width="6" height="45" fill="#0f172a" />
      <rect x="85" y="0" width="4" height="45" fill="#0f172a" />
      <rect x="100" y="0" width="7" height="45" fill="#0f172a" />
      <rect x="115" y="0" width="3" height="45" fill="#0f172a" />
      <rect x="130" y="0" width="5" height="45" fill="#0f172a" />
      <rect x="145" y="0" width="8" height="45" fill="#0f172a" />
      <rect x="160" y="0" width="4" height="45" fill="#0f172a" />
      <rect x="175" y="0" width="6" height="45" fill="#0f172a" />
      <rect x="190" y="0" width="3" height="45" fill="#0f172a" />
      <rect x="205" y="0" width="7" height="45" fill="#0f172a" />
      <rect x="220" y="0" width="4" height="45" fill="#0f172a" />
      <rect x="235" y="0" width="6" height="45" fill="#0f172a" />
    </g>
    <text x="140" y="112" font-family="monospace" font-size="12" letter-spacing="3" fill="#0f172a" text-anchor="middle">X003A89XYZ</text>
  </g>

  <!-- Suffocation Warning (Valid) at Bottom -->
  <g transform="translate(130, 410)">
    <rect width="340" height="90" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.5" />
    <text x="170" y="32" font-family="sans-serif" font-size="13" font-weight="bold" fill="#b91c1c" text-anchor="middle">WARNING: Avoid danger of suffocation</text>
    <text x="170" y="55" font-family="sans-serif" font-size="10.5" fill="#0f172a" text-anchor="middle">Keep bag away from babies &amp; children. Do not use in cribs.</text>
    <text x="170" y="75" font-family="sans-serif" font-size="10.5" fill="#0f172a" text-anchor="middle">This bag is not a toy. [Compliant 14pt]</text>
  </g>

  <rect x="20" y="20" width="130" height="34" rx="6" fill="#dc2626" fill-opacity="0.9" />
  <text x="85" y="42" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">VERDICT: FAIL</text>
</svg>
      `;

    case "scenario-6":
      // FAIL: Original manufacturer barcode visible (uncovered UPC-A)
      return `
<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow6" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </radialGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bgGlow6)" />

  <!-- Product Box Inside -->
  <rect x="90" y="100" width="420" height="420" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2" />
  <text x="300" y="135" font-family="sans-serif" font-size="14" font-weight="bold" fill="#94a3b8" text-anchor="middle">TECH GADGET PREMIUM PACKAGING</text>

  <!-- Polybag Outline -->
  <rect x="80" y="30" width="440" height="540" rx="14" fill="#ffffff" fill-opacity="0.08" stroke="#38bdf8" stroke-width="2" />
  <rect x="80" y="30" width="440" height="22" fill="#475569" opacity="0.6" />

  <!-- FNSKU Label Placed on Top Right -->
  <g transform="translate(260, 150)">
    <rect width="240" height="120" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
    <text x="14" y="22" font-family="sans-serif" font-size="10" font-weight="bold" fill="#0f172a">FNSKU: X003A89XYZ</text>
    <rect x="14" y="32" width="210" height="45" fill="#0f172a" opacity="0.8" />
    <text x="120" y="98" font-family="monospace" font-size="11" fill="#0f172a" text-anchor="middle">X003A89XYZ</text>
  </g>

  <!-- EXPOSED ORIGINAL MANUFACTURER UPC-A BARCODE ON BOTTOM LEFT (CRITICAL VIOLATION) -->
  <g transform="translate(110, 260)">
    <rect width="140" height="85" rx="4" fill="#ffffff" stroke="#ef4444" stroke-width="2.5" />
    <rect x="0" y="0" width="140" height="18" fill="#ef4444" />
    <text x="70" y="13" font-family="sans-serif" font-size="8.5" font-weight="bold" fill="#ffffff" text-anchor="middle">EXPOSED ORIGINAL UPC!</text>
    <!-- UPC Barcode lines -->
    <g transform="translate(15, 24)">
      <line x1="5" y1="0" x2="5" y2="38" stroke="#000" stroke-width="2" />
      <line x1="12" y1="0" x2="12" y2="38" stroke="#000" stroke-width="3" />
      <line x1="20" y1="0" x2="20" y2="38" stroke="#000" stroke-width="1.5" />
      <line x1="28" y1="0" x2="28" y2="38" stroke="#000" stroke-width="3" />
      <line x1="36" y1="0" x2="36" y2="38" stroke="#000" stroke-width="2" />
      <line x1="45" y1="0" x2="45" y2="38" stroke="#000" stroke-width="4" />
      <line x1="55" y1="0" x2="55" y2="38" stroke="#000" stroke-width="2" />
      <line x1="65" y1="0" x2="65" y2="38" stroke="#000" stroke-width="3" />
      <line x1="75" y1="0" x2="75" y2="38" stroke="#000" stroke-width="1.5" />
      <line x1="85" y1="0" x2="85" y2="38" stroke="#000" stroke-width="4" />
      <line x1="95" y1="0" x2="95" y2="38" stroke="#000" stroke-width="2" />
      <line x1="105" y1="0" x2="105" y2="38" stroke="#000" stroke-width="3" />
    </g>
    <text x="70" y="76" font-family="monospace" font-size="9" fill="#000000" text-anchor="middle">0 12345 67890 5</text>
  </g>

  <!-- Suffocation Warning (Valid) -->
  <g transform="translate(130, 410)">
    <rect width="340" height="85" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.5" />
    <text x="170" y="28" font-family="sans-serif" font-size="12" font-weight="bold" fill="#b91c1c" text-anchor="middle">WARNING: Avoid danger of suffocation</text>
    <text x="170" y="50" font-family="sans-serif" font-size="10" fill="#0f172a" text-anchor="middle">Keep bag away from babies &amp; children. Do not use in cribs.</text>
    <text x="170" y="68" font-family="sans-serif" font-size="10" fill="#0f172a" text-anchor="middle">This bag is not a toy.</text>
  </g>

  <rect x="20" y="20" width="130" height="34" rx="6" fill="#dc2626" fill-opacity="0.9" />
  <text x="85" y="42" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">VERDICT: FAIL</text>
</svg>
      `;

    case "scenario-7":
      // FAIL: Expiration Date covered by FNSKU label
      return `
<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow7" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </radialGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bgGlow7)" />

  <!-- Amber Supplement Gummy Bottle -->
  <rect x="180" y="100" width="240" height="420" rx="30" fill="#d97706" opacity="0.85" stroke="#f59e0b" stroke-width="3" />
  <rect x="230" y="60" width="140" height="45" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
  <text x="300" y="88" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">TAMPER-SEAL CAP</text>

  <!-- Bottle Label Graphic -->
  <rect x="190" y="180" width="220" height="280" fill="#fef3c7" stroke="#fbbf24" stroke-width="1.5" />
  <text x="300" y="215" font-family="sans-serif" font-size="13" font-weight="bold" fill="#92400e" text-anchor="middle">IMMUNE VIT-C GUMMIES</text>

  <!-- Expiration Stamp Underneath (Partially Covered!) -->
  <g transform="translate(230, 205)">
    <rect width="140" height="45" rx="4" fill="#fee2e2" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 2" />
    <text x="10" y="24" font-family="monospace" font-size="11" font-weight="bold" fill="#b91c1c">EXP: 11/2027</text>
    <text x="10" y="38" font-family="monospace" font-size="9" fill="#7f1d1d">LOT #9842A</text>
  </g>

  <!-- FNSKU LABEL OVERLAPPING AND COVERING EXPIRY DATE -->
  <g transform="translate(170, 220)">
    <rect width="260" height="140" rx="6" fill="#ffffff" stroke="#ef4444" stroke-width="2.5" />
    <rect x="0" y="0" width="260" height="20" fill="#ef4444" />
    <text x="130" y="14" font-family="sans-serif" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">⚠️ LABEL COVERS EXPIRATION DATE!</text>
    
    <text x="14" y="38" font-family="sans-serif" font-size="10" font-weight="bold" fill="#0f172a">FNSKU: X0088KV99Q</text>
    <rect x="14" y="48" width="230" height="42" fill="#0f172a" opacity="0.8" />
    <text x="130" y="112" font-family="monospace" font-size="12" fill="#0f172a" text-anchor="middle">X0088KV99Q</text>
    <text x="130" y="130" font-family="sans-serif" font-size="9" fill="#dc2626" font-weight="bold" text-anchor="middle">NON-COMPLIANT OVERLAP</text>
  </g>

  <!-- Polybag Envelope -->
  <rect x="110" y="40" width="380" height="520" rx="14" fill="#ffffff" fill-opacity="0.08" stroke="#38bdf8" stroke-width="2" />
  <rect x="110" y="40" width="380" height="20" fill="#475569" opacity="0.6" />

  <rect x="20" y="20" width="130" height="34" rx="6" fill="#dc2626" fill-opacity="0.9" />
  <text x="85" y="42" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">VERDICT: FAIL</text>
</svg>
      `;

    case "scenario-8":
      // FAIL: Missing "Sold as Set - Do Not Separate" label on 2-pack bundle
      return `
<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow8" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </radialGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bgGlow8)" />

  <!-- TWIN PACK: Bottle 1 (Shampoo) and Bottle 2 (Conditioner) -->
  <g transform="translate(130, 80)">
    <!-- Bottle 1 -->
    <rect x="0" y="40" width="160" height="380" rx="16" fill="#0284c7" stroke="#38bdf8" stroke-width="2" />
    <rect x="50" y="10" width="60" height="35" rx="4" fill="#0f172a" />
    <text x="80" y="180" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">SHAMPOO</text>
    <text x="80" y="200" font-family="sans-serif" font-size="10" fill="#bae6fd" text-anchor="middle">16.9 fl oz</text>

    <!-- Bottle 2 -->
    <rect x="180" y="40" width="160" height="380" rx="16" fill="#0369a1" stroke="#38bdf8" stroke-width="2" />
    <rect x="230" y="10" width="60" height="35" rx="4" fill="#0f172a" />
    <text x="260" y="180" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">CONDITIONER</text>
    <text x="260" y="200" font-family="sans-serif" font-size="10" fill="#bae6fd" text-anchor="middle">16.9 fl oz</text>
  </g>

  <!-- Clear Polybag enclosing both bottles -->
  <rect x="80" y="30" width="440" height="540" rx="14" fill="#ffffff" fill-opacity="0.08" stroke="#38bdf8" stroke-width="2" />
  <rect x="80" y="30" width="440" height="22" fill="#475569" opacity="0.6" />

  <!-- FNSKU Label Centered -->
  <g transform="translate(170, 160)">
    <rect width="260" height="130" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
    <text x="14" y="22" font-family="sans-serif" font-size="10" font-weight="bold" fill="#0f172a">FNSKU: X009J77XYZ</text>
    <text x="14" y="36" font-family="sans-serif" font-size="8.5" fill="#475569">Argan Shampoo &amp; Conditioner 2PK</text>
    <rect x="14" y="46" width="230" height="44" fill="#0f172a" opacity="0.85" />
    <text x="130" y="112" font-family="monospace" font-size="11" fill="#0f172a" text-anchor="middle">X009J77XYZ</text>
  </g>

  <!-- MISSING "SOLD AS SET - DO NOT SEPARATE" CALLOUT -->
  <g transform="translate(120, 310)">
    <rect width="360" height="85" rx="8" fill="#ef4444" fill-opacity="0.12" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="6 4" />
    <circle cx="180" cy="35" r="20" fill="#ef4444" fill-opacity="0.2" />
    <text x="180" y="42" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ef4444" text-anchor="middle">✕</text>
    <text x="180" y="68" font-family="sans-serif" font-size="11" font-weight="bold" fill="#f87171" text-anchor="middle">MISSING: "SOLD AS SET - DO NOT SEPARATE" LABEL</text>
  </g>

  <!-- Suffocation Warning (Compliant) -->
  <g transform="translate(130, 420)">
    <rect width="340" height="80" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.5" />
    <text x="170" y="24" font-family="sans-serif" font-size="12" font-weight="bold" fill="#b91c1c" text-anchor="middle">WARNING: Avoid danger of suffocation</text>
    <text x="170" y="46" font-family="sans-serif" font-size="10" fill="#0f172a" text-anchor="middle">Keep bag away from babies &amp; children. Do not use in cribs.</text>
    <text x="170" y="62" font-family="sans-serif" font-size="10" fill="#0f172a" text-anchor="middle">This bag is not a toy. [Pass]</text>
  </g>

  <rect x="20" y="20" width="130" height="34" rx="6" fill="#dc2626" fill-opacity="0.9" />
  <text x="85" y="42" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">VERDICT: FAIL</text>
</svg>
      `;

    case "scenario-9":
      // UNCERTAIN: High specular flash glare & bag gauge thickness limitation
      return `
<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow9" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </radialGradient>
    <radialGradient id="flashGlare" cx="45%" cy="70%" r="40%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="25%" stop-color="#ffffff" stop-opacity="0.8" />
      <stop offset="60%" stop-color="#ffffff" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bgGlow9)" />

  <!-- Product Silhouette -->
  <ellipse cx="300" cy="300" rx="140" ry="160" fill="#78350f" opacity="0.75" />

  <!-- Polybag Outline -->
  <rect x="80" y="30" width="440" height="540" rx="14" fill="#ffffff" fill-opacity="0.08" stroke="#38bdf8" stroke-width="2" />
  <rect x="80" y="30" width="440" height="22" fill="#475569" opacity="0.6" />

  <!-- FNSKU Label on Top -->
  <g transform="translate(160, 160)">
    <rect width="280" height="140" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
    <text x="14" y="24" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0f172a">FNSKU: X003A89XYZ</text>
    <rect x="14" y="44" width="250" height="48" fill="#0f172a" opacity="0.8" />
    <text x="140" y="116" font-family="monospace" font-size="12" fill="#0f172a" text-anchor="middle">X003A89XYZ</text>
  </g>

  <!-- Suffocation Warning Region -->
  <g transform="translate(130, 410)">
    <rect width="340" height="90" rx="4" fill="#ffffff" fill-opacity="0.9" stroke="#0f172a" stroke-width="1.5" />
    <text x="30" y="30" font-family="sans-serif" font-size="13" font-weight="bold" fill="#b91c1c">WARNING: Suffocation Danger</text>
    <text x="30" y="52" font-family="sans-serif" font-size="10" fill="#0f172a">Keep bag away from babies &amp; children...</text>
  </g>

  <!-- MASSIVE SPECULAR CAMERA FLASH GLARE (OPTICAL OCCLUSION) -->
  <circle cx="280" cy="430" r="160" fill="url(#flashGlare)" />
  <path d="M220 370 L340 490 M340 370 L220 490" stroke="#ffffff" stroke-width="12" stroke-opacity="0.7" stroke-linecap="round" />

  <!-- Callout for Visual Epistemics -->
  <g transform="translate(120, 520)">
    <rect width="360" height="35" rx="6" fill="#f59e0b" fill-opacity="0.9" />
    <text x="180" y="22" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#000000" text-anchor="middle">⚡ UNCERTAIN: SPECULAR GLARE + 1.5 MIL UNMEASURABLE</text>
  </g>

  <rect x="20" y="20" width="150" height="34" rx="6" fill="#f59e0b" fill-opacity="0.95" />
  <text x="95" y="42" font-family="sans-serif" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">STATUS: UNCERTAIN</text>
</svg>
      `;

    case "scenario-10":
      // FAIL: Fragile ceramic mug lacks 3-layer bubble wrap & "Fragile" mark
      return `
<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow10" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </radialGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bgGlow10)" />

  <!-- Ceramic Mug Product Graphic -->
  <g transform="translate(180, 140)">
    <!-- Mug Body -->
    <rect x="0" y="0" width="180" height="220" rx="14" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="3" />
    <!-- Mug Handle -->
    <path d="M180 30 C250 30 250 170 180 170" fill="none" stroke="#f1f5f9" stroke-width="26" stroke-linecap="round" />
    <path d="M180 30 C250 30 250 170 180 170" fill="none" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round" />
    <!-- Ceramic Rim & Coffee inside -->
    <ellipse cx="90" cy="15" rx="80" ry="18" fill="#451a03" stroke="#cbd5e1" stroke-width="2" />
    <text x="90" y="110" font-family="sans-serif" font-size="12" font-weight="bold" fill="#64748b" text-anchor="middle">STONEWARE 16OZ</text>
  </g>

  <!-- Loose Thin Polybag (No Bubble Cushioning Cushion!) -->
  <rect x="90" y="40" width="420" height="520" rx="14" fill="#ffffff" fill-opacity="0.08" stroke="#38bdf8" stroke-width="2" />
  <rect x="90" y="40" width="420" height="20" fill="#475569" opacity="0.6" />

  <!-- FNSKU Label Attached -->
  <g transform="translate(170, 170)">
    <rect width="260" height="130" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
    <text x="14" y="24" font-family="sans-serif" font-size="10" font-weight="bold" fill="#0f172a">FNSKU: X0019MM881</text>
    <rect x="14" y="38" width="230" height="46" fill="#0f172a" opacity="0.85" />
    <text x="130" y="110" font-family="monospace" font-size="11" fill="#0f172a" text-anchor="middle">X0019MM881</text>
  </g>

  <!-- MISSING BUBBLE WRAP & FRAGILE MARK CALLOUT -->
  <g transform="translate(110, 320)">
    <rect width="380" height="90" rx="8" fill="#ef4444" fill-opacity="0.12" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="6 4" />
    <text x="190" y="32" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ef4444" text-anchor="middle">⚠️ VIOLATION: NO BUBBLE WRAP CUSHIONING</text>
    <text x="190" y="52" font-family="sans-serif" font-size="10" fill="#fca5a5" text-anchor="middle">Ceramic item requires 3-layer bubble wrap passing 3-ft drop test.</text>
    <text x="190" y="72" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#ef4444" text-anchor="middle">MISSING: 'FRAGILE - HANDLE WITH CARE' MARK</text>
  </g>

  <!-- Suffocation Warning (Present) -->
  <g transform="translate(130, 430)">
    <rect width="340" height="70" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.5" />
    <text x="170" y="24" font-family="sans-serif" font-size="11" font-weight="bold" fill="#b91c1c" text-anchor="middle">WARNING: Avoid danger of suffocation</text>
    <text x="170" y="44" font-family="sans-serif" font-size="9.5" fill="#0f172a" text-anchor="middle">Keep bag away from babies. This bag is not a toy.</text>
  </g>

  <rect x="20" y="20" width="130" height="34" rx="6" fill="#dc2626" fill-opacity="0.9" />
  <text x="85" y="42" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">VERDICT: FAIL</text>
</svg>
      `;

    default:
      return `<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="600" fill="#0f172a"/><text x="300" y="300" fill="#94a3b8" font-family="sans-serif" font-size="16" text-anchor="middle">Inbound Package Visual Scan</text></svg>`;
  }
}
