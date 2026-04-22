"use client";

// Fenstra — Upgraded 2D technical drawing preview
// Renders windows and doors as proper 2D elevation drawings
// with dimensions, opening indicators, and product-specific details

export function WindowPreview({ cfg, small = false, technical = false }) {
  if (!cfg) return null;

  const {
    productType = "window",
    style = "Casement",
    material = "uPVC",
    colour = "#FFFFFF",
    colourName = "White",
    width = 1200,
    height = 1200,
    glazing = "Double Glazed",
    hardware = "Chrome",
  } = cfg;

  // Viewbox sizing — scale to fit while preserving aspect ratio
  const ratio = width / height;
  const baseW = 300;
  const baseH = baseW / ratio;
  const margin = technical ? 60 : 20;
  const vbW = baseW + margin * 2;
  const vbH = baseH + margin * 2;

  const isDoor = ["Composite Front Door", "uPVC Door", "French Doors", "Bifold Doors",
    "Sliding Patio Doors", "Lift & Slide Doors", "Pivot Doors", "Security Doors",
    "Fire Doors", "Shopfront Doors", "Aluminium Commercial Doors", "Automatic Doors",
    "Internal Doors", "Stable Doors"].includes(style);

  const frameThickness = Math.max(3, baseW * 0.025);
  const glassInset = frameThickness + 2;

  // Colour handling
  const frameColour = colour && colour.startsWith("#") ? colour : "#FFFFFF";
  const isWood = ["Oak", "Rosewood", "Walnut", "Golden Oak"].includes(colourName) ||
                 material === "Timber" || material === "Hardwood" || material === "Softwood";
  const glassFill = "#dce8ef";
  const glassStroke = "#b5c7d3";

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      width="100%"
      height="100%"
      style={{ display: "block" }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Wood grain pattern */}
        <pattern id={`wood-${cfg.id || "x"}`} x="0" y="0" width="40" height="6" patternUnits="userSpaceOnUse">
          <rect width="40" height="6" fill={frameColour} />
          <path d="M0,3 Q10,1 20,3 T40,3" stroke="rgba(0,0,0,0.08)" fill="none" strokeWidth="0.5" />
          <path d="M0,5 Q15,4 30,5 T40,5" stroke="rgba(0,0,0,0.05)" fill="none" strokeWidth="0.3" />
        </pattern>
        {/* Glass gradient */}
        <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8f0f5" />
          <stop offset="50%" stopColor="#dce8ef" />
          <stop offset="100%" stopColor="#c8dae4" />
        </linearGradient>
        {/* Subtle shadow */}
        <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
          <feOffset dx="1" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform={`translate(${margin},${margin})`}>
        {/* Outer frame */}
        <rect
          x="0"
          y="0"
          width={baseW}
          height={baseH}
          fill={isWood ? `url(#wood-${cfg.id || "x"})` : frameColour}
          stroke="#1a1a1a"
          strokeWidth="1"
          filter={small ? undefined : "url(#drop-shadow)"}
        />
        {/* Glass area */}
        <rect
          x={glassInset}
          y={glassInset}
          width={baseW - glassInset * 2}
          height={baseH - glassInset * 2}
          fill="url(#glass-grad)"
          stroke={glassStroke}
          strokeWidth="0.5"
        />

        {/* Product-specific internal details */}
        {isDoor ? (
          <DoorFeatures
            style={style}
            baseW={baseW}
            baseH={baseH}
            glassInset={glassInset}
            frameColour={frameColour}
            isWood={isWood}
            cfgId={cfg.id}
            technical={technical}
          />
        ) : (
          <WindowFeatures
            style={style}
            baseW={baseW}
            baseH={baseH}
            glassInset={glassInset}
            frameColour={frameColour}
            isWood={isWood}
            hardware={hardware}
            cfgId={cfg.id}
            technical={technical}
          />
        )}
      </g>

      {/* Dimensions (only in technical mode) */}
      {technical && (
        <DimensionLines
          baseW={baseW}
          baseH={baseH}
          margin={margin}
          widthMm={width}
          heightMm={height}
        />
      )}
    </svg>
  );
}

// ============================================================
// WINDOW FEATURES — renders sash splits, glazing bars, handle
// ============================================================
function WindowFeatures({ style, baseW, baseH, glassInset, frameColour, isWood, hardware, cfgId, technical }) {
  const isGeorgian = style.includes("Heritage") || style.includes("Flush Casement");
  const isSash = style.includes("Sliding Sash") || style.includes("Vertical Slider");
  const isBay = style.includes("Bay") || style.includes("Bow");
  const glassX = glassInset;
  const glassY = glassInset;
  const glassW = baseW - glassInset * 2;
  const glassH = baseH - glassInset * 2;
  const barThickness = 2;

  return (
    <>
      {/* Sliding sash — mid rail */}
      {isSash && (
        <>
          <rect
            x="0"
            y={baseH / 2 - barThickness}
            width={baseW}
            height={barThickness * 2}
            fill={isWood ? `url(#wood-${cfgId || "x"})` : frameColour}
            stroke="#1a1a1a"
            strokeWidth="0.5"
          />
          {/* Vertical split in each half */}
          <line x1={baseW / 2} y1={glassY} x2={baseW / 2} y2={baseH / 2 - barThickness} stroke="#b5c7d3" strokeWidth="0.5" />
          <line x1={baseW / 2} y1={baseH / 2 + barThickness} x2={baseW / 2} y2={glassY + glassH} stroke="#b5c7d3" strokeWidth="0.5" />
        </>
      )}

      {/* Georgian bars — classic 6-over-6 or grid */}
      {isGeorgian && !isSash && (
        <>
          {/* Vertical bars */}
          <line x1={glassX + glassW / 3} y1={glassY} x2={glassX + glassW / 3} y2={glassY + glassH}
                stroke="#1a1a1a" strokeWidth={barThickness} opacity="0.6" />
          <line x1={glassX + (glassW * 2) / 3} y1={glassY} x2={glassX + (glassW * 2) / 3} y2={glassY + glassH}
                stroke="#1a1a1a" strokeWidth={barThickness} opacity="0.6" />
          {/* Horizontal bars */}
          <line x1={glassX} y1={glassY + glassH / 2} x2={glassX + glassW} y2={glassY + glassH / 2}
                stroke="#1a1a1a" strokeWidth={barThickness} opacity="0.6" />
        </>
      )}

      {/* Casement — central mullion + handle */}
      {style.includes("Casement") && !isGeorgian && (
        <>
          <line x1={baseW / 2} y1={glassY} x2={baseW / 2} y2={glassY + glassH}
                stroke={frameColour} strokeWidth={barThickness} />
          <line x1={baseW / 2} y1={glassY} x2={baseW / 2} y2={glassY + glassH}
                stroke="#1a1a1a" strokeWidth="0.3" opacity="0.3" />
        </>
      )}

      {/* Tilt & Turn — hinge + handle indicators */}
      {style.includes("Tilt") && (
        <>
          <circle cx={glassX + 8} cy={glassY + 8} r="2" fill="#1a1a1a" opacity="0.4" />
          <circle cx={glassX + 8} cy={glassY + glassH - 8} r="2" fill="#1a1a1a" opacity="0.4" />
        </>
      )}

      {/* Opening indicators (technical mode) */}
      {technical && style.includes("Casement") && !isGeorgian && (
        <>
          {/* Left sash opens right (X pattern fragment) */}
          <OpeningIndicator x={glassX} y={glassY} w={glassW / 2} h={glassH} direction="right" />
          <OpeningIndicator x={glassX + glassW / 2} y={glassY} w={glassW / 2} h={glassH} direction="left" />
        </>
      )}

      {/* Handle marker */}
      {!technical && (style.includes("Casement") || style.includes("Tilt")) && (
        <g>
          <circle cx={glassX + glassW / 2 - 6} cy={glassY + glassH / 2} r="3" fill="#333" />
          <rect x={glassX + glassW / 2 - 8} y={glassY + glassH / 2 - 1} width="6" height="2" fill="#333" />
        </g>
      )}
    </>
  );
}

// ============================================================
// DOOR FEATURES — panels, letterbox, knocker, handle, hinges
// ============================================================
function DoorFeatures({ style, baseW, baseH, glassInset, frameColour, isWood, cfgId, technical }) {
  const glassX = glassInset;
  const glassY = glassInset;
  const glassW = baseW - glassInset * 2;
  const glassH = baseH - glassInset * 2;

  // Composite Front Door — distinctive layout
  if (style === "Composite Front Door" || style === "uPVC Door") {
    const topGlassH = glassH * 0.35;
    const midPanelH = glassH * 0.25;
    const bottomPanelH = glassH - topGlassH - midPanelH;

    return (
      <>
        {/* Top glass panel */}
        <rect
          x={glassX}
          y={glassY}
          width={glassW}
          height={topGlassH}
          fill="url(#glass-grad)"
          stroke="#1a1a1a"
          strokeWidth="0.5"
        />
        {/* Decorative glass pattern */}
        <DecorativeGlass x={glassX} y={glassY} w={glassW} h={topGlassH} />

        {/* Middle solid panel (with moulding) */}
        <rect
          x={glassX}
          y={glassY + topGlassH}
          width={glassW}
          height={midPanelH}
          fill={isWood ? `url(#wood-${cfgId || "x"})` : frameColour}
          stroke="#1a1a1a"
          strokeWidth="0.3"
        />
        {/* Moulding detail */}
        <rect
          x={glassX + 10}
          y={glassY + topGlassH + 6}
          width={glassW - 20}
          height={midPanelH - 12}
          fill="none"
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="0.5"
        />

        {/* Bottom solid panel */}
        <rect
          x={glassX}
          y={glassY + topGlassH + midPanelH}
          width={glassW}
          height={bottomPanelH}
          fill={isWood ? `url(#wood-${cfgId || "x"})` : frameColour}
          stroke="#1a1a1a"
          strokeWidth="0.3"
        />
        {/* Moulding detail */}
        <rect
          x={glassX + 10}
          y={glassY + topGlassH + midPanelH + 8}
          width={glassW - 20}
          height={bottomPanelH - 16}
          fill="none"
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="0.5"
        />

        {/* Letterbox (centred on middle panel) */}
        <rect
          x={baseW / 2 - 25}
          y={glassY + topGlassH + midPanelH / 2 - 3}
          width="50"
          height="6"
          fill="#1a1a1a"
          opacity="0.7"
        />

        {/* Knocker (above letterbox) */}
        <circle
          cx={baseW / 2}
          cy={glassY + topGlassH + 15}
          r="3"
          fill="#d4af37"
        />

        {/* Handle (right side) */}
        <g>
          <rect
            x={baseW - glassInset - 18}
            y={glassY + topGlassH + midPanelH / 2 + 10}
            width="12"
            height="4"
            fill="#1a1a1a"
            rx="1"
          />
          <circle
            cx={baseW - glassInset - 12}
            cy={glassY + topGlassH + midPanelH / 2 + 12}
            r="2.5"
            fill="#d4af37"
          />
        </g>

        {/* Hinges (left side) */}
        <rect x={glassX - 1} y={glassY + 20} width="3" height="10" fill="#888" />
        <rect x={glassX - 1} y={baseH / 2 - 5} width="3" height="10" fill="#888" />
        <rect x={glassX - 1} y={baseH - glassInset - 30} width="3" height="10" fill="#888" />

        {/* Opening indicator */}
        {technical && (
          <OpeningIndicator x={glassX} y={glassY} w={glassW} h={glassH} direction="right" />
        )}
      </>
    );
  }

  // Stable Door — split horizontally
  if (style === "Stable Doors") {
    const topH = glassH * 0.45;
    return (
      <>
        {/* Top door */}
        <rect x={glassX} y={glassY} width={glassW} height={topH}
              fill="url(#glass-grad)" stroke="#1a1a1a" strokeWidth="0.5" />
        {/* Split rail */}
        <rect x="0" y={glassY + topH - 3} width={baseW} height="6"
              fill={isWood ? `url(#wood-${cfgId || "x"})` : frameColour}
              stroke="#1a1a1a" strokeWidth="0.5" />
        {/* Bottom door panel */}
        <rect x={glassX} y={glassY + topH + 3} width={glassW} height={glassH - topH - 3}
              fill={isWood ? `url(#wood-${cfgId || "x"})` : frameColour}
              stroke="#1a1a1a" strokeWidth="0.3" />
        <rect x={glassX + 10} y={glassY + topH + 10} width={glassW - 20} height={glassH - topH - 20}
              fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
        {/* Handles for both halves */}
        <circle cx={baseW - glassInset - 12} cy={glassY + topH / 2} r="2.5" fill="#d4af37" />
        <circle cx={baseW - glassInset - 12} cy={glassY + topH + 3 + (glassH - topH) / 2} r="2.5" fill="#d4af37" />
      </>
    );
  }

  // French / Patio / Bifold — multi-panel glass
  if (style.includes("French") || style.includes("Patio") || style.includes("Bifold") || style.includes("Slide")) {
    const panels = style.includes("Bifold") ? 3 : 2;
    const panelW = glassW / panels;
    return (
      <>
        {Array.from({ length: panels }).map((_, i) => (
          <g key={i}>
            <rect
              x={glassX + panelW * i}
              y={glassY}
              width={panelW}
              height={glassH}
              fill="url(#glass-grad)"
              stroke="#1a1a1a"
              strokeWidth="0.5"
            />
            {/* Handle on inside edges */}
            {i === 0 && (
              <rect
                x={glassX + panelW - 6}
                y={glassY + glassH / 2 - 8}
                width="3"
                height="16"
                fill="#d4af37"
                rx="1"
              />
            )}
            {technical && (
              <OpeningIndicator
                x={glassX + panelW * i}
                y={glassY}
                w={panelW}
                h={glassH}
                direction={i % 2 === 0 ? "right" : "left"}
              />
            )}
          </g>
        ))}
      </>
    );
  }

  // Generic door fallback — simple panel
  return (
    <>
      <rect x={glassX + 10} y={glassY + 10} width={glassW - 20} height={glassH - 20}
            fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
      <circle cx={baseW - glassInset - 12} cy={baseH / 2 + 15} r="2.5" fill="#d4af37" />
    </>
  );
}

// ============================================================
// Decorative glass pattern (leaded / diamond pattern)
// ============================================================
function DecorativeGlass({ x, y, w, h }) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const size = Math.min(w, h) * 0.3;
  return (
    <g stroke="rgba(26,26,26,0.35)" strokeWidth="0.5" fill="none">
      <polygon points={`${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}`} />
      <line x1={x} y1={cy} x2={x + w} y2={cy} />
      <line x1={cx} y1={y} x2={cx} y2={y + h} />
    </g>
  );
}

// ============================================================
// Opening indicator — dashed diagonal (CAD convention)
// ============================================================
function OpeningIndicator({ x, y, w, h, direction = "right" }) {
  // Direction = side where the hinge is (opposite side opens)
  const p1 = direction === "right"
    ? { x: x + w, y: y } // top-right
    : { x: x, y: y };    // top-left
  const p2 = direction === "right"
    ? { x: x + w, y: y + h } // bottom-right (hinge side)
    : { x: x, y: y + h };    // bottom-left (hinge side)
  const apex = direction === "right"
    ? { x: x, y: y + h / 2 }     // opens to left
    : { x: x + w, y: y + h / 2 }; // opens to right

  return (
    <g stroke="#1a1a1a" strokeWidth="0.5" fill="none" strokeDasharray="3,2" opacity="0.6">
      <line x1={p1.x} y1={p1.y} x2={apex.x} y2={apex.y} />
      <line x1={p2.x} y1={p2.y} x2={apex.x} y2={apex.y} />
    </g>
  );
}

// ============================================================
// Dimension lines — engineering drawing convention
// ============================================================
function DimensionLines({ baseW, baseH, margin, widthMm, heightMm }) {
  const tickSize = 4;
  const offset = 20;
  const fontSize = 11;

  return (
    <g stroke="#1a1a1a" strokeWidth="0.5" fill="#1a1a1a">
      {/* Horizontal (width) — below */}
      <g>
        <line x1={margin} y1={margin + baseH + offset} x2={margin + baseW} y2={margin + baseH + offset} />
        <line x1={margin} y1={margin + baseH + offset - tickSize} x2={margin} y2={margin + baseH + offset + tickSize} />
        <line x1={margin + baseW} y1={margin + baseH + offset - tickSize} x2={margin + baseW} y2={margin + baseH + offset + tickSize} />
        {/* Extension lines */}
        <line x1={margin} y1={margin + baseH} x2={margin} y2={margin + baseH + offset + tickSize} strokeDasharray="2,2" opacity="0.5" />
        <line x1={margin + baseW} y1={margin + baseH} x2={margin + baseW} y2={margin + baseH + offset + tickSize} strokeDasharray="2,2" opacity="0.5" />
        {/* Text */}
        <text
          x={margin + baseW / 2}
          y={margin + baseH + offset + 14}
          textAnchor="middle"
          fontSize={fontSize}
          fontFamily="monospace"
          stroke="none"
        >
          {widthMm} mm
        </text>
      </g>

      {/* Vertical (height) — right */}
      <g>
        <line x1={margin + baseW + offset} y1={margin} x2={margin + baseW + offset} y2={margin + baseH} />
        <line x1={margin + baseW + offset - tickSize} y1={margin} x2={margin + baseW + offset + tickSize} y2={margin} />
        <line x1={margin + baseW + offset - tickSize} y1={margin + baseH} x2={margin + baseW + offset + tickSize} y2={margin + baseH} />
        {/* Extension lines */}
        <line x1={margin + baseW} y1={margin} x2={margin + baseW + offset + tickSize} y2={margin} strokeDasharray="2,2" opacity="0.5" />
        <line x1={margin + baseW} y1={margin + baseH} x2={margin + baseW + offset + tickSize} y2={margin + baseH} strokeDasharray="2,2" opacity="0.5" />
        {/* Text (rotated) */}
        <text
          x={margin + baseW + offset + 14}
          y={margin + baseH / 2}
          textAnchor="middle"
          fontSize={fontSize}
          fontFamily="monospace"
          stroke="none"
          transform={`rotate(90, ${margin + baseW + offset + 14}, ${margin + baseH / 2})`}
        >
          {heightMm} mm
        </text>
      </g>
    </g>
  );
}
