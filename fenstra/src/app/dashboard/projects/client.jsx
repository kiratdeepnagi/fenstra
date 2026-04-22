"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Plus, Download, Trash2, Edit } from "lucide-react";
import { Header, StatusPill, EmptyCard, Toast, useToast } from "@/components/ui";
import { WindowPreview } from "@/components/preview";

export default function ProjectsClient({ initialProjects = [], profile }) {
  const [projects, setProjects] = useState(initialProjects);
  const [busy, setBusy] = useState(null);
  const { toast, show, clear } = useToast();
  const router = useRouter();
  const supabase = createClient();

  async function deleteProject(id) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setBusy(id);
    const { error } = await supabase.from("projects").delete().eq("id", id);
    setBusy(null);
    if (error) return show("Could not delete — try again", "error");
    setProjects((prev) => prev.filter((p) => p.id !== id));
    show("Project deleted");
    router.refresh();
  }

  function exportTechnicalQuote(project) {
    const quoteRef = `FQ-${String(project.id).slice(-6).toUpperCase()}`;
    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    const area = ((project.width || 0) * (project.height || 0) / 1000000).toFixed(2);
    const subtotal = project.price || 0;
    const vat = subtotal * 0.2;
    const total = subtotal + vat;
    const uValue = project.glazing === "Triple Glazed" ? "0.8" : project.glazing === "Double Glazed" ? "1.2" : "1.4";

    // Try to parse extra config from notes JSON (saved by upgraded designer)
    let extras = {};
    try {
      if (project.notes && project.notes.trim().startsWith("{")) {
        extras = JSON.parse(project.notes);
      }
    } catch (e) { /* plain text notes */ }
    const colourName = extras.colourName || project.colourName || project.colour || "—";
    const userNotes = extras.userNotes || (typeof project.notes === "string" && !project.notes.trim().startsWith("{") ? project.notes : "");

    // Build inline SVG for the drawing
    const cfg = { ...project, id: project.id };
    const w = project.width || 1200;
    const h = project.height || 1200;
    const ratio = w / h;
    const baseW = 400;
    const baseH = baseW / ratio;
    const margin = 70;
    const vbW = baseW + margin * 2;
    const vbH = baseH + margin * 2;

    const isDoor = ["Composite Front Door", "uPVC Door", "French Doors", "Bifold Doors",
      "Sliding Patio Doors", "Lift & Slide Doors", "Pivot Doors", "Security Doors",
      "Fire Doors", "Shopfront Doors", "Stable Doors", "Internal Doors"].includes(project.style);

    const frameColour = project.colour && project.colour.startsWith("#") ? project.colour : "#FFFFFF";
    const isWood = ["Oak", "Rosewood", "Walnut", "Golden Oak", "Irish Oak", "Golden Oak", "Whitegrain"].includes(colourName) ||
                   ["Timber", "Hardwood", "Softwood"].includes(project.material);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Quote ${quoteRef} — Fenstra</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    color: #1a1a1a;
    background: #f5f3ee;
    padding: 20px;
    line-height: 1.5;
  }
  .page {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 50px 55px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
    min-height: 1120px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 24px;
    border-bottom: 2px solid #1a1a1a;
    margin-bottom: 32px;
  }
  .logo-row { display: flex; align-items: center; gap: 12px; }
  .logo-disc {
    width: 44px; height: 44px; border-radius: 50%;
    background: #1a1a1a; display: flex; align-items: center; justify-content: center;
  }
  .logo-disc span {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 26px;
    color: #f5e6c8;
    font-weight: 500;
  }
  .brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    font-weight: 500;
    letter-spacing: -0.5px;
  }
  .quote-meta { text-align: right; font-size: 12px; }
  .quote-ref {
    font-family: monospace;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  .validity {
    display: inline-block;
    background: #faf3e0;
    color: #8a6a1e;
    padding: 3px 10px;
    border-radius: 100px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 6px;
  }
  h2 {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 500;
    letter-spacing: -0.5px;
    margin-bottom: 8px;
  }
  .subtitle { color: #666; font-size: 13px; margin-bottom: 32px; }
  .drawing-box {
    background: linear-gradient(135deg, #faf7f2, #eceae5);
    border-radius: 12px;
    padding: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 32px;
    min-height: 280px;
  }
  .drawing-box svg { max-width: 100%; height: auto; max-height: 320px; }
  .section-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #8a6a1e;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
  }
  .specs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 28px;
    margin-bottom: 32px;
  }
  .spec-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px dotted #ddd;
    font-size: 13px;
  }
  .spec-label { color: #666; }
  .spec-value { font-weight: 500; }
  .price-block {
    background: #1a1a1a;
    color: #fafaf7;
    border-radius: 12px;
    padding: 24px 28px;
    margin-bottom: 28px;
  }
  .price-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 14px;
  }
  .price-row.total {
    margin-top: 10px;
    padding-top: 14px;
    border-top: 1px solid rgba(255,255,255,0.2);
    font-size: 15px;
  }
  .price-row.total .val {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 500;
  }
  .terms {
    background: #faf7f2;
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 24px;
  }
  .terms ul { list-style: none; padding: 0; }
  .terms li {
    padding: 4px 0 4px 16px;
    position: relative;
    font-size: 12px;
    color: #555;
  }
  .terms li:before {
    content: "—";
    position: absolute;
    left: 0;
    color: #8a6a1e;
  }
  .footer {
    padding-top: 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    color: #666;
  }
  .phone {
    font-family: monospace;
    font-weight: 600;
    color: #1a1a1a;
    font-size: 13px;
  }
  .badges {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .badge {
    background: white;
    border: 1px solid #ddd;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  @media print {
    body { background: white; padding: 0; }
    .page { box-shadow: none; max-width: none; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="logo-row">
      <div class="logo-disc"><span>F</span></div>
      <div class="brand-name">Fenstra</div>
    </div>
    <div class="quote-meta">
      <div class="quote-ref">${quoteRef}</div>
      <div style="color:#666">Issued ${today}</div>
      <div class="validity">Valid 30 days</div>
    </div>
  </div>

  <h2>${project.name || "Window & Door Quotation"}</h2>
  <p class="subtitle">Prepared for ${profile?.full_name || "Customer"} · ${profile?.email || ""}</p>

  <!-- Technical Drawing -->
  <div class="drawing-box">
    <svg viewBox="0 0 ${vbW} ${vbH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e8f0f5"/>
          <stop offset="100%" stop-color="#c8dae4"/>
        </linearGradient>
      </defs>
      <g transform="translate(${margin},${margin})">
        <rect x="0" y="0" width="${baseW}" height="${baseH}" fill="${frameColour}" stroke="#1a1a1a" stroke-width="1.5"/>
        <rect x="8" y="8" width="${baseW - 16}" height="${baseH - 16}" fill="url(#g)" stroke="#b5c7d3" stroke-width="0.5"/>
        ${isDoor ? renderDoorSvg(project.style, baseW, baseH, frameColour) : renderWindowSvg(project.style, baseW, baseH)}
      </g>
      ${renderDimensionsSvg(baseW, baseH, margin, w, h)}
    </svg>
  </div>

  <!-- Specifications -->
  <div class="section-title">Specifications</div>
  <div class="specs">
    <div class="spec-row"><span class="spec-label">Product</span><span class="spec-value">${isDoor ? "Door" : "Window"}</span></div>
    <div class="spec-row"><span class="spec-label">Style</span><span class="spec-value">${project.style || "—"}</span></div>
    <div class="spec-row"><span class="spec-label">Material</span><span class="spec-value">${project.material || "—"}</span></div>
    <div class="spec-row"><span class="spec-label">Colour</span><span class="spec-value">${colourName}</span></div>
    <div class="spec-row"><span class="spec-label">Width</span><span class="spec-value">${w} mm</span></div>
    <div class="spec-row"><span class="spec-label">Height</span><span class="spec-value">${h} mm</span></div>
    <div class="spec-row"><span class="spec-label">Area</span><span class="spec-value">${area} m²</span></div>
    <div class="spec-row"><span class="spec-label">Glazing</span><span class="spec-value">${project.glazing || "—"}</span></div>
    <div class="spec-row"><span class="spec-label">Hardware</span><span class="spec-value">${project.hardware || "—"}</span></div>
    <div class="spec-row"><span class="spec-label">U-Value</span><span class="spec-value">${uValue} W/m²K</span></div>
  </div>

  <!-- Pricing -->
  <div class="price-block">
    <div class="price-row"><span>Subtotal (ex. VAT)</span><span>£${subtotal.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</span></div>
    <div class="price-row"><span>VAT @ 20%</span><span>£${vat.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</span></div>
    <div class="price-row total"><span>Total inc. VAT</span><span class="val">£${total.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</span></div>
  </div>

  <!-- Terms -->
  <div class="section-title">Terms & Notes</div>
  <div class="terms">
    <ul>
      <li>Price subject to confirmation after on-site survey</li>
      <li>PAS24 security compliance · Part L Building Regs compliant</li>
      <li>10-year manufacturer's guarantee on frames and glazing</li>
      <li>Lead time typically 2–4 weeks from confirmed order</li>
      <li>Quote valid for 30 days from date of issue</li>
      <li>Installation by FENSA/CERTASS-registered fitters</li>
    </ul>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div>
      <div>Fenstra Windows &amp; Doors</div>
      <div class="phone">📞 0800 088 6341</div>
    </div>
    <div class="badges">
      <span class="badge">FENSA</span>
      <span class="badge">CERTASS</span>
      <span class="badge">PAS24</span>
      <span class="badge">Part L</span>
    </div>
  </div>
</div>
<script>
  window.addEventListener("load", function() {
    setTimeout(function() { window.print(); }, 500);
  });
</script>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (!win) return show("Please allow popups to download the quote", "error");
    win.document.open();
    win.document.write(html);
    win.document.close();
  }

  if (projects.length === 0) {
    return (
      <div>
        <Toast message={toast?.message} kind={toast?.kind} onDone={clear} />
        <div className="flex items-center justify-between mb-6">
          <Header title="My projects" subtitle="Your saved window &amp; door designs." />
        </div>
        <Link href="/dashboard/designer">
          <EmptyCard msg="You haven't saved any designs yet." cta="Create your first design" />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Toast message={toast?.message} kind={toast?.kind} onDone={clear} />
      <div className="flex items-center justify-between mb-6">
        <Header title="My projects" subtitle={`${projects.length} saved ${projects.length === 1 ? "design" : "designs"}.`} />
        <Link href="/dashboard/designer" className="flex items-center gap-1.5 text-sm font-medium bg-neutral-900 text-neutral-50 px-4 py-2 rounded-full hover:bg-neutral-800 transition">
          <Plus size={14} /> New design
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <div key={p.id} className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm group relative">
            <Link href={`/dashboard/designer?id=${p.id}`} className="block">
              <div className="h-40 rounded-xl mb-3 p-3" style={{ background: "linear-gradient(135deg, #eceae5, #faf7f2)" }}>
                <WindowPreview cfg={p} small />
              </div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="font-medium text-sm truncate">{p.name}</div>
                <StatusPill status={p.status} />
              </div>
              <div className="text-xs text-neutral-500 mb-2">{p.material} · {p.style}</div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono">{p.width}×{p.height}mm</span>
                <span className="font-serif text-lg">£{p.price?.toLocaleString()}</span>
              </div>
            </Link>

            {/* Action buttons (show on hover) */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => exportTechnicalQuote(p)}
                disabled={busy === p.id}
                className="p-2 bg-white border border-neutral-200 rounded-full hover:bg-neutral-900 hover:text-white transition disabled:opacity-50"
                title="Download quote as PDF"
                aria-label="Download quote"
              >
                <Download size={14} />
              </button>
              <Link
                href={`/dashboard/designer?id=${p.id}`}
                className="p-2 bg-white border border-neutral-200 rounded-full hover:bg-neutral-900 hover:text-white transition"
                title="Edit project"
                aria-label="Edit project"
              >
                <Edit size={14} />
              </Link>
              <button
                onClick={() => deleteProject(p.id)}
                disabled={busy === p.id}
                className="p-2 bg-white border border-neutral-200 rounded-full hover:bg-red-600 hover:text-white hover:border-red-600 transition disabled:opacity-50"
                title="Delete project"
                aria-label="Delete project"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// SVG helper functions for PDF drawing
// ============================================================
function renderWindowSvg(style, baseW, baseH) {
  const isGeorgian = style?.includes("Heritage") || style?.includes("Flush Casement");
  const isSash = style?.includes("Sliding Sash") || style?.includes("Vertical Slider");
  let out = "";

  if (isSash) {
    out += `<rect x="0" y="${baseH / 2 - 3}" width="${baseW}" height="6" fill="#1a1a1a" opacity="0.15"/>`;
    out += `<line x1="${baseW / 2}" y1="8" x2="${baseW / 2}" y2="${baseH / 2 - 3}" stroke="#b5c7d3" stroke-width="0.5"/>`;
    out += `<line x1="${baseW / 2}" y1="${baseH / 2 + 3}" x2="${baseW / 2}" y2="${baseH - 8}" stroke="#b5c7d3" stroke-width="0.5"/>`;
  } else if (isGeorgian) {
    out += `<line x1="${baseW / 3}" y1="8" x2="${baseW / 3}" y2="${baseH - 8}" stroke="#1a1a1a" stroke-width="1.5" opacity="0.5"/>`;
    out += `<line x1="${(baseW * 2) / 3}" y1="8" x2="${(baseW * 2) / 3}" y2="${baseH - 8}" stroke="#1a1a1a" stroke-width="1.5" opacity="0.5"/>`;
    out += `<line x1="8" y1="${baseH / 2}" x2="${baseW - 8}" y2="${baseH / 2}" stroke="#1a1a1a" stroke-width="1.5" opacity="0.5"/>`;
  } else if (style?.includes("Casement")) {
    out += `<line x1="${baseW / 2}" y1="8" x2="${baseW / 2}" y2="${baseH - 8}" stroke="#1a1a1a" stroke-width="1" opacity="0.3"/>`;
    // Opening indicators
    out += `<g stroke="#1a1a1a" stroke-width="0.6" fill="none" stroke-dasharray="3,2" opacity="0.5">`;
    out += `<line x1="${baseW / 2}" y1="8" x2="8" y2="${baseH / 2}"/>`;
    out += `<line x1="${baseW / 2}" y1="${baseH - 8}" x2="8" y2="${baseH / 2}"/>`;
    out += `<line x1="${baseW / 2}" y1="8" x2="${baseW - 8}" y2="${baseH / 2}"/>`;
    out += `<line x1="${baseW / 2}" y1="${baseH - 8}" x2="${baseW - 8}" y2="${baseH / 2}"/>`;
    out += `</g>`;
  }
  return out;
}

function renderDoorSvg(style, baseW, baseH, frameColour) {
  if (style === "Composite Front Door" || style === "uPVC Door") {
    const topH = baseH * 0.35;
    const midH = baseH * 0.25;
    return `
      <rect x="8" y="8" width="${baseW - 16}" height="${topH}" fill="url(#g)" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect x="8" y="${8 + topH}" width="${baseW - 16}" height="${midH}" fill="${frameColour}" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect x="18" y="${14 + topH}" width="${baseW - 36}" height="${midH - 12}" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="0.5"/>
      <rect x="8" y="${8 + topH + midH}" width="${baseW - 16}" height="${baseH - 16 - topH - midH}" fill="${frameColour}" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect x="18" y="${16 + topH + midH}" width="${baseW - 36}" height="${baseH - 32 - topH - midH}" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="0.5"/>
      <rect x="${baseW / 2 - 30}" y="${8 + topH + midH / 2 - 4}" width="60" height="8" fill="#1a1a1a" opacity="0.7"/>
      <circle cx="${baseW / 2}" cy="${8 + topH + 18}" r="4" fill="#d4af37"/>
      <rect x="${baseW - 28}" y="${8 + topH + midH / 2 + 14}" width="14" height="5" fill="#1a1a1a" rx="1"/>
      <circle cx="${baseW - 20}" cy="${8 + topH + midH / 2 + 16}" r="3" fill="#d4af37"/>
    `;
  }
  if (style === "Stable Doors") {
    const topH = baseH * 0.45;
    return `
      <rect x="8" y="8" width="${baseW - 16}" height="${topH}" fill="url(#g)" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect x="0" y="${8 + topH - 3}" width="${baseW}" height="6" fill="${frameColour}" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect x="8" y="${11 + topH}" width="${baseW - 16}" height="${baseH - 22 - topH}" fill="${frameColour}" stroke="#1a1a1a" stroke-width="0.5"/>
    `;
  }
  if (style?.includes("French") || style?.includes("Patio") || style?.includes("Bifold") || style?.includes("Slide")) {
    const panels = style.includes("Bifold") ? 3 : 2;
    const panelW = (baseW - 16) / panels;
    let out = "";
    for (let i = 0; i < panels; i++) {
      out += `<rect x="${8 + panelW * i}" y="8" width="${panelW}" height="${baseH - 16}" fill="url(#g)" stroke="#1a1a1a" stroke-width="0.5"/>`;
    }
    return out;
  }
  return `<rect x="18" y="18" width="${baseW - 36}" height="${baseH - 36}" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="0.5"/>`;
}

function renderDimensionsSvg(baseW, baseH, margin, widthMm, heightMm) {
  const tickSize = 5;
  const offset = 25;
  return `
    <g stroke="#1a1a1a" stroke-width="0.6" fill="#1a1a1a">
      <line x1="${margin}" y1="${margin + baseH + offset}" x2="${margin + baseW}" y2="${margin + baseH + offset}"/>
      <line x1="${margin}" y1="${margin + baseH + offset - tickSize}" x2="${margin}" y2="${margin + baseH + offset + tickSize}"/>
      <line x1="${margin + baseW}" y1="${margin + baseH + offset - tickSize}" x2="${margin + baseW}" y2="${margin + baseH + offset + tickSize}"/>
      <line x1="${margin}" y1="${margin + baseH}" x2="${margin}" y2="${margin + baseH + offset + tickSize}" stroke-dasharray="2,2" opacity="0.5"/>
      <line x1="${margin + baseW}" y1="${margin + baseH}" x2="${margin + baseW}" y2="${margin + baseH + offset + tickSize}" stroke-dasharray="2,2" opacity="0.5"/>
      <text x="${margin + baseW / 2}" y="${margin + baseH + offset + 14}" text-anchor="middle" font-size="11" font-family="monospace" stroke="none">${widthMm} mm</text>
      <line x1="${margin + baseW + offset}" y1="${margin}" x2="${margin + baseW + offset}" y2="${margin + baseH}"/>
      <line x1="${margin + baseW + offset - tickSize}" y1="${margin}" x2="${margin + baseW + offset + tickSize}" y2="${margin}"/>
      <line x1="${margin + baseW + offset - tickSize}" y1="${margin + baseH}" x2="${margin + baseW + offset + tickSize}" y2="${margin + baseH}"/>
      <line x1="${margin + baseW}" y1="${margin}" x2="${margin + baseW + offset + tickSize}" y2="${margin}" stroke-dasharray="2,2" opacity="0.5"/>
      <line x1="${margin + baseW}" y1="${margin + baseH}" x2="${margin + baseW + offset + tickSize}" y2="${margin + baseH}" stroke-dasharray="2,2" opacity="0.5"/>
      <text x="${margin + baseW + offset + 14}" y="${margin + baseH / 2}" text-anchor="middle" font-size="11" font-family="monospace" stroke="none" transform="rotate(90, ${margin + baseW + offset + 14}, ${margin + baseH / 2})">${heightMm} mm</text>
    </g>
  `;
}
