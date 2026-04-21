const BASE = {
  window: { Casement: 320, "Flush Casement": 420, "Tilt & Turn": 540, "Sliding Sash": 680, "Vertical Slider": 720, "Bay Windows": 980, "Bow Windows": 1100, "Secondary Glazing": 280, "Roof Lanterns": 1450, Skylights: 620, "Fixed Windows": 240, "Shopfront Glazing": 380, "Curtain Walling": 520, "Heritage Slimline": 780, "Triple Glazed": 540, "Acoustic Windows": 640 },
  door: { "Composite Front Doors": 1400, "uPVC Doors": 780, "French Doors": 1600, Bifold: 1800, "Sliding Patio Doors": 2200, "Lift & Slide Doors": 3400, "Pivot Doors": 3800, "Security Doors": 1650, "Fire Doors": 1200, "Shopfront Doors": 1900, "Aluminium Commercial Doors": 2100, "Automatic Doors": 4500, "Internal Doors": 380, "Stable Doors": 1350 },
};

const MATERIAL_MULT = { uPVC: 1.0, Aluminium: 1.35, Timber: 1.25, Hardwood: 1.45, Softwood: 1.1, Composite: 1.3, Steel: 1.6, "Metal framed systems": 1.55, "Heritage steel-look": 1.7, "Hybrid systems": 1.5 };
const GLAZING_ADD  = { "Double Glazed": 0, "Triple Glazed": 180, "Acoustic Glass": 260, Toughened: 90, Laminated: 140 };
const HARDWARE_ADD = { Standard: 0, Premium: 120, Luxury: 280 };

export function calcPrice(cfg) {
  const { product, style, material, width, height, glazing, hardware, colour } = cfg;
  if (!style || !material) return 0;
  const base = BASE[product]?.[style] || 400;
  const mult = MATERIAL_MULT[material] || 1;
  const area = (width * height) / 1_000_000;
  const areaFactor = Math.max(1, area / 1.5);
  const subtotal = base * mult * areaFactor;
  const colourAdd = colour?.includes("9016") ? 0 : 85;
  return Math.round(subtotal + (GLAZING_ADD[glazing] || 0) + (HARDWARE_ADD[hardware] || 0) + colourAdd);
}
