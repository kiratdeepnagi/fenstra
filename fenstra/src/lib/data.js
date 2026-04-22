// Fenstra — Product Catalogue & Pricing Data
// All configurable in one place. Update prices here to update the whole site.

// ============================================================
// UPVC WINDOW STYLES (Session A)
// ============================================================
export const WINDOW_STYLES = [
  {
    id: "casement",
    name: "uPVC Casement",
    tagline: "Traditional side-hung opening. Our most popular style.",
    basePricePerSqm: 200,
    minPanes: 1,
    maxPanes: 8,
    description: "Versatile and energy-efficient. Available in 1–8 panes with mix of fixed and opening sashes.",
    features: ["Most popular style", "Best value", "1–8 pane configurations"],
  },
  {
    id: "flush-sash",
    name: "uPVC Flush Sash",
    tagline: "Traditional flush appearance with modern performance.",
    basePricePerSqm: 250,
    minPanes: 1,
    maxPanes: 8,
    description: "Sash sits flush with the frame for a timber-effect look. Popular for period properties.",
    features: ["Period property look", "Flush external finish", "1–8 pane configurations"],
  },
  {
    id: "sliding-sash",
    name: "uPVC Vertical Sliding Sash",
    tagline: "Classic Victorian vertical sliders. Heritage style, modern efficiency.",
    basePricePerSqm: 400,
    minPanes: 1,
    maxPanes: 2,
    description: "Authentic vertical sliding operation with modern security and energy performance.",
    features: ["Heritage style", "Tilt for cleaning", "Georgian bar options"],
  },
  {
    id: "tilt-turn",
    name: "uPVC Tilt & Turn",
    tagline: "Dual function — tilt for ventilation, turn for access.",
    basePricePerSqm: 280,
    minPanes: 1,
    maxPanes: 4,
    description: "Inward-opening for easy cleaning. Tilt mode provides secure ventilation.",
    features: ["Inward opening", "Safe ventilation", "Easy cleaning"],
  },
  {
    id: "triple-glazed",
    name: "uPVC Triple Glazed",
    tagline: "Maximum thermal performance. A++ energy rating.",
    basePricePerSqm: 290,
    minPanes: 1,
    maxPanes: 8,
    description: "Triple glazing for premium insulation and acoustic performance.",
    features: ["A++ rated", "U-value 0.9 W/m²K", "Superior acoustic performance"],
  },
  {
    id: "bay-bow",
    name: "uPVC Bay & Bow",
    tagline: "Statement windows that add space and character.",
    basePricePerSqm: 280,
    minPanes: 3,
    maxPanes: 7,
    description: "Projecting bay or curved bow window — adds internal space and architectural interest.",
    features: ["Adds interior space", "3–7 pane configurations", "30° / 45° / 90° angles"],
  },
];

// ============================================================
// COLOURS — white is base, coloured adds a percentage
// ============================================================
export const WINDOW_COLOURS = [
  { id: "white", name: "White", hex: "#FFFFFF", uplift: 0, popular: true },
  { id: "anthracite-grey", name: "Anthracite Grey", hex: "#383E42", uplift: 35, popular: true, ral: "RAL 7016" },
  { id: "agate-grey", name: "Agate Grey", hex: "#B5B3AB", uplift: 35, ral: "RAL 7038" },
  { id: "black", name: "Black", hex: "#1C1C1C", uplift: 35, popular: true, ral: "RAL 9005" },
  { id: "black-brown", name: "Black-Brown", hex: "#3D2B1F", uplift: 35 },
  { id: "cream", name: "Cream", hex: "#F0E8D4", uplift: 35 },
  { id: "chartwell-green", name: "Chartwell Green", hex: "#8BA084", uplift: 35 },
  { id: "golden-oak", name: "Golden Oak", hex: "#C08B3D", uplift: 35, woodEffect: true },
  { id: "irish-oak", name: "Irish Oak", hex: "#8B5A2B", uplift: 35, woodEffect: true },
  { id: "rosewood", name: "Rosewood", hex: "#4A1F1F", uplift: 35, woodEffect: true },
  { id: "whitegrain", name: "Whitegrain", hex: "#F5F2EA", uplift: 15, woodEffect: true },
];

// ============================================================
// HANDLE FINISHES (included in base price for standard 3)
// ============================================================
export const HANDLE_FINISHES = [
  { id: "chrome", name: "Chrome", price: 0, standard: true },
  { id: "gold", name: "Gold", price: 0, standard: true },
  { id: "white", name: "White", price: 0, standard: true },
  { id: "black", name: "Black", price: 15 },
  { id: "brushed-chrome", name: "Brushed Chrome", price: 15 },
  { id: "smoked", name: "Smoked Chrome", price: 15 },
];

// ============================================================
// CILL OPTIONS (included in base price, customer picks size)
// ============================================================
export const CILL_OPTIONS = [
  { id: "85", name: "85mm", size: 85, price: 0, standard: true },
  { id: "150", name: "150mm", size: 150, price: 0, standard: true },
  { id: "180", name: "180mm", size: 180, price: 0, standard: true },
  { id: "220", name: "220mm", size: 220, price: 0, standard: true },
  { id: "none", name: "No cill", size: 0, price: 0 },
];

// ============================================================
// GLAZING OPTIONS
// ============================================================
export const GLAZING_OPTIONS = [
  { id: "clear", name: "Clear glass", price: 0, standard: true },
  { id: "obscure-level-1", name: "Obscure Level 1 (low privacy)", price: 25 },
  { id: "obscure-level-3", name: "Obscure Level 3 (medium privacy)", price: 30 },
  { id: "obscure-level-5", name: "Obscure Level 5 (full privacy)", price: 35 },
  { id: "toughened", name: "Toughened safety glass", price: 45 },
  { id: "laminated", name: "Laminated safety glass", price: 65 },
  { id: "acoustic", name: "Acoustic glass (noise reduction)", price: 85 },
];

// ============================================================
// DECORATIVE GLAZING (Georgian bars, lead, etc.)
// ============================================================
export const DECORATIVE_OPTIONS = [
  { id: "none", name: "None", price: 0, standard: true },
  { id: "georgian-integral", name: "Integral Georgian bars", pricePerSqm: 40 },
  { id: "georgian-astragal", name: "External Astragal bars", pricePerSqm: 60 },
  { id: "square-lead", name: "Square lead design", pricePerSqm: 50 },
  { id: "diamond-lead", name: "Diamond lead design", pricePerSqm: 55 },
];

// ============================================================
// HINGE OPTIONS
// ============================================================
export const HINGE_OPTIONS = [
  { id: "standard", name: "Standard hinges", price: 0, standard: true },
  { id: "easy-clean", name: "Easy-clean hinges", pricePerOpener: 12 },
  { id: "fire-escape", name: "Fire-escape (90° egress) hinges", pricePerOpener: 15 },
  { id: "child-restrictor", name: "Child restrictors", pricePerOpener: 10 },
  { id: "mega-trojan", name: "Mega Trojan egress (oversized sashes)", pricePerOpener: 25 },
];

// ============================================================
// SECURITY ADD-ONS
// ============================================================
export const SECURITY_ADDONS = [
  { id: "shootbolt", name: "Shootbolt locking (PAS24)", pricePerOpener: 15 },
  { id: "sash-jammers", name: "Sash jammers", pricePerOpener: 8 },
  { id: "restrictors", name: "Window restrictors", pricePerOpener: 10 },
];

// ============================================================
// EXTRAS
// ============================================================
export const EXTRAS = [
  { id: "a-plus-rating", name: "A+ Energy Rating upgrade", priceType: "percent", priceValue: 10 },
  { id: "trickle-vents", name: "Trickle vents", pricePerUnit: 15, perUnit: "each" },
  { id: "dummy-sash", name: "Dummy sash (equal sight lines)", pricePerUnit: 35, perUnit: "per sash" },
  { id: "fit-pack", name: "Fit pack (screws, packers)", price: 15 },
  { id: "survey", name: "Professional survey", price: 75 },
  { id: "delivery", name: "Delivery within 50 miles", price: 35 },
];

// ============================================================
// PRICING ENGINE
// ============================================================
export function calculateWindowPrice(config) {
  const {
    styleId,
    width = 1200,
    height = 1200,
    panes = 1,
    openers = 1,
    colourId = "white",
    handleId = "chrome",
    cillId = "150",
    glazingId = "clear",
    decorativeId = "none",
    hingeId = "standard",
    securityIds = [],
    extraIds = [],
    trickleVentCount = 0,
    dummySashCount = 0,
  } = config;

  const style = WINDOW_STYLES.find((s) => s.id === styleId) || WINDOW_STYLES[0];
  const colour = WINDOW_COLOURS.find((c) => c.id === colourId) || WINDOW_COLOURS[0];
  const handle = HANDLE_FINISHES.find((h) => h.id === handleId) || HANDLE_FINISHES[0];
  const cill = CILL_OPTIONS.find((c) => c.id === cillId) || CILL_OPTIONS[0];
  const glazing = GLAZING_OPTIONS.find((g) => g.id === glazingId) || GLAZING_OPTIONS[0];
  const decorative = DECORATIVE_OPTIONS.find((d) => d.id === decorativeId) || DECORATIVE_OPTIONS[0];
  const hinge = HINGE_OPTIONS.find((h) => h.id === hingeId) || HINGE_OPTIONS[0];

  const areaSqm = (width * height) / 1_000_000;

  // Base frame price
  const framePrice = style.basePricePerSqm * areaSqm;

  // Colour uplift (percentage of frame price)
  const colourUplift = framePrice * (colour.uplift / 100);

  // Glazing
  const glazingPrice = glazing.price * panes;

  // Decorative
  const decorativePrice = decorative.pricePerSqm ? decorative.pricePerSqm * areaSqm : 0;

  // Handles (first 3 finishes are free)
  const handlePrice = handle.price * openers;

  // Hinges (per opener)
  const hingePrice = hinge.pricePerOpener ? hinge.pricePerOpener * openers : 0;

  // Security add-ons (per opener each)
  const securityPrice = securityIds.reduce((sum, id) => {
    const item = SECURITY_ADDONS.find((s) => s.id === id);
    return sum + (item?.pricePerOpener || 0) * openers;
  }, 0);

  // Cill
  const cillPrice = cill.price;

  // Extras (variable)
  let extrasPrice = 0;
  extraIds.forEach((id) => {
    const item = EXTRAS.find((e) => e.id === id);
    if (!item) return;
    if (item.priceType === "percent") {
      extrasPrice += framePrice * (item.priceValue / 100);
    } else if (item.price) {
      extrasPrice += item.price;
    }
  });

  // Trickle vents
  const tricklePrice = trickleVentCount * 15;
  // Dummy sashes
  const dummyPrice = dummySashCount * 35;

  const subtotal =
    framePrice +
    colourUplift +
    glazingPrice +
    decorativePrice +
    handlePrice +
    hingePrice +
    securityPrice +
    cillPrice +
    extrasPrice +
    tricklePrice +
    dummyPrice;

  const vat = subtotal * 0.2;
  const total = subtotal + vat;

  return {
    areaSqm: areaSqm.toFixed(2),
    framePrice: framePrice.toFixed(2),
    colourUplift: colourUplift.toFixed(2),
    glazingPrice: glazingPrice.toFixed(2),
    decorativePrice: decorativePrice.toFixed(2),
    handlePrice: handlePrice.toFixed(2),
    hingePrice: hingePrice.toFixed(2),
    securityPrice: securityPrice.toFixed(2),
    cillPrice: cillPrice.toFixed(2),
    extrasPrice: extrasPrice.toFixed(2),
    tricklePrice: tricklePrice.toFixed(2),
    dummyPrice: dummyPrice.toFixed(2),
    subtotal: parseFloat(subtotal.toFixed(2)),
    vat: parseFloat(vat.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
}

// Calculate opener count from panes (estimate — most customers pick 50% openers)
export function estimateOpeners(panes) {
  if (panes === 1) return 1;
  if (panes === 2) return 1;
  if (panes === 3) return 2;
  if (panes === 4) return 2;
  if (panes === 5) return 3;
  if (panes === 6) return 3;
  if (panes === 8) return 4;
  return Math.ceil(panes / 2);
}

// Legacy exports for backward compatibility with existing code
export const WINDOW_STYLES_LEGACY = WINDOW_STYLES.map(s => s.name);
export const DOOR_STYLES = [
  "Composite Front Door", "uPVC Door", "French Doors", "Bifold Doors",
  "Sliding Patio Doors", "Stable Doors"
];
export const MATERIALS = ["uPVC", "Aluminium", "Timber", "Composite"];
export const COLOURS = WINDOW_COLOURS;
export const GLAZING = GLAZING_OPTIONS.map(g => g.name);
export const HARDWARE = HANDLE_FINISHES.map(h => h.name);
