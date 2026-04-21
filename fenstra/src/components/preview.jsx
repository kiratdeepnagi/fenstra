"use client";
import { COLOURS } from "@/lib/data";

export function WindowPreview({ cfg, small = false }) {
  const {
    product = "window",
    style = "Flush Casement",
    width = 1200,
    height = 1200,
    colour = COLOURS[0].name,
    glazing = "Double Glazed",
  } = cfg || {};

  const frameColour = COLOURS.find((c) => c.name === colour)?.hex || "#293133";
  const aspect = Math.max(0.5, Math.min(3, width / height));
  const vbW = 240;
  const vbH = vbW / aspect;
  const frameW = small ? 8 : 10;
  const isDoor = product === "door";
  const isMulti = ["Bifold", "Sliding Patio Doors", "Lift & Slide Doors", "French Doors"].includes(style);
  const panels = isMulti ? Math.max(2, Math.min(6, Math.round(width / 800))) : 1;
  const glassTint = glazing === "Triple Glazed" ? "#c5d3db" : glazing === "Acoustic Glass" ? "#b8c8d1" : "#d8e3e8";
  const uid = small ? "s" : "l";

  return (
    <svg viewBox={`0 0 ${vbW} ${vbH}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={glassTint} stopOpacity="0.9" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="100%" stopColor={glassTint} stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={`frame-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={frameColour} stopOpacity="1" />
          <stop offset="100%" stopColor={frameColour} stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width={vbW - 8} height={vbH - 8} fill={`url(#frame-${uid})`} rx="1" />
      <g>
        {Array.from({ length: panels }).map((_, i) => {
          const pw = (vbW - 8 - frameW * 2) / panels;
          const x = 4 + frameW + pw * i;
          const y = 4 + frameW;
          const h = vbH - 8 - frameW * 2;
          return (
            <g key={i}>
              <rect x={x} y={y} width={pw - (i < panels - 1 ? frameW / 2 : 0)} height={h} fill={`url(#glass-${uid})`} />
              {i < panels - 1 && <rect x={x + pw - frameW / 2} y={y} width={frameW / 2} height={h} fill={frameColour} />}
              {isDoor && i === panels - 1 && <circle cx={x + pw - 10} cy={y + h / 2} r={small ? 1.2 : 1.8} fill="#c9a063" />}
              {!isDoor && style === "Sliding Sash" && (
                <line x1={x} y1={y + h / 2} x2={x + pw} y2={y + h / 2} stroke={frameColour} strokeWidth={frameW * 0.6} />
              )}
              {!isDoor && (style === "Heritage Slimline" || style === "Flush Casement") && (
                <>
                  <line x1={x} y1={y + h / 3} x2={x + pw} y2={y + h / 3} stroke={frameColour} strokeWidth="0.8" opacity="0.6" />
                  <line x1={x + pw / 2} y1={y} x2={x + pw / 2} y2={y + h} stroke={frameColour} strokeWidth="0.8" opacity="0.6" />
                </>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
