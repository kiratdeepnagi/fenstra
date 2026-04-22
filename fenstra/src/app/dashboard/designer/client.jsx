"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles, ChevronRight, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Field, Toast, useToast } from "@/components/ui";
import { WindowPreview } from "@/components/preview";
import {
  WINDOW_STYLES,
  WINDOW_COLOURS,
  HANDLE_FINISHES,
  CILL_OPTIONS,
  GLAZING_OPTIONS,
  DECORATIVE_OPTIONS,
  HINGE_OPTIONS,
  SECURITY_ADDONS,
  EXTRAS,
  calculateWindowPrice,
  estimateOpeners,
} from "@/lib/data";

const DEFAULT = {
  name: "",
  product: "window",
  styleId: "casement",
  style: "uPVC Casement",
  material: "uPVC",
  width: 1200,
  height: 1200,
  panes: 2,
  openers: 1,
  colourId: "white",
  colour: "White",
  handleId: "chrome",
  cillId: "150",
  glazingId: "clear",
  decorativeId: "none",
  hingeId: "standard",
  securityIds: [],
  extraIds: [],
  trickleVentCount: 0,
  dummySashCount: 0,
  notes: "",
  status: "draft",
};

export function DesignerClient({ initial }) {
  const router = useRouter();
  const supabase = createClient();
  const { toast, show: showToast, clear } = useToast();

  // Merge initial with defaults (for editing)
  const [cfg, setCfg] = useState(() => {
    if (!initial) return DEFAULT;

    // Try to restore full config from the notes JSON (saved with newer designer)
    let savedExtras = {};
    try {
      if (initial.notes && initial.notes.trim().startsWith("{")) {
        savedExtras = JSON.parse(initial.notes);
      }
    } catch (e) {
      // notes is plain text from old designer — ignore
    }

    // Reverse-lookup styleId from style name (for old projects without styleId stored)
    const matchedStyle = WINDOW_STYLES.find(s => s.name === initial.style);
    const fallbackStyleId = matchedStyle?.id || "casement";

    // Reverse-lookup colourId from hex (for old projects)
    const matchedColour = WINDOW_COLOURS.find(c => c.hex.toLowerCase() === (initial.colour || "").toLowerCase());
    const fallbackColourId = matchedColour?.id || "white";

    return {
      ...DEFAULT,
      name: initial.name || "",
      product: initial.product || "window",
      width: initial.width || 1200,
      height: initial.height || 1200,
      status: initial.status || "draft",
      // Try saved extras first, then fallbacks
      styleId: savedExtras.styleId || fallbackStyleId,
      colourId: savedExtras.colourId || fallbackColourId,
      handleId: savedExtras.handleId || "chrome",
      cillId: savedExtras.cillId || "150",
      glazingId: savedExtras.glazingId || "clear",
      decorativeId: savedExtras.decorativeId || "none",
      hingeId: savedExtras.hingeId || "standard",
      panes: savedExtras.panes || 2,
      openers: savedExtras.openers || 1,
      securityIds: Array.isArray(savedExtras.securityIds) ? savedExtras.securityIds : [],
      extraIds: Array.isArray(savedExtras.extraIds) ? savedExtras.extraIds : [],
      trickleVentCount: savedExtras.trickleVentCount || 0,
      dummySashCount: savedExtras.dummySashCount || 0,
      notes: savedExtras.userNotes || (typeof initial.notes === "string" && !initial.notes.trim().startsWith("{") ? initial.notes : ""),
    };
  });

  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);

  // Auto-update openers when panes change
  useEffect(() => {
    setCfg(c => ({ ...c, openers: estimateOpeners(c.panes) }));
  }, [cfg.panes]);

  // Calculate live pricing
  const pricing = useMemo(() => calculateWindowPrice(cfg), [cfg]);

  const style = WINDOW_STYLES.find(s => s.id === cfg.styleId) || WINDOW_STYLES[0];
  const colour = WINDOW_COLOURS.find(c => c.id === cfg.colourId) || WINDOW_COLOURS[0];

  const set = (k, v) => setCfg(c => ({ ...c, [k]: v }));
  const toggleInArray = (key, id) => {
    setCfg(c => {
      const arr = c[key] || [];
      return {
        ...c,
        [key]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id],
      };
    });
  };

  const save = async () => {
    if (!cfg.name) { showToast("Please name your project", "error"); return; }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const payload = {
      user_id: user.id,
      name: cfg.name,
      product: cfg.product,
      style: style.name,
      material: "uPVC",
      width: cfg.width,
      height: cfg.height,
      colour: colour.hex,
      glazing: GLAZING_OPTIONS.find(g => g.id === cfg.glazingId)?.name || "Clear glass",
      hardware: HANDLE_FINISHES.find(h => h.id === cfg.handleId)?.name || "Chrome",
      price: Math.round(pricing.subtotal),
      notes: JSON.stringify({
        styleId: cfg.styleId,
        colourId: cfg.colourId,
        colourName: colour.name,
        handleId: cfg.handleId,
        cillId: cfg.cillId,
        glazingId: cfg.glazingId,
        decorativeId: cfg.decorativeId,
        hingeId: cfg.hingeId,
        panes: cfg.panes,
        openers: cfg.openers,
        securityIds: cfg.securityIds,
        extraIds: cfg.extraIds,
        trickleVentCount: cfg.trickleVentCount,
        dummySashCount: cfg.dummySashCount,
        userNotes: cfg.notes,
      }),
      status: cfg.status || "draft",
    };
    let error;
    if (initial?.id) {
      ({ error } = await supabase.from("projects").update(payload).eq("id", initial.id));
    } else {
      ({ error } = await supabase.from("projects").insert(payload));
    }
    setSaving(false);
    if (error) { showToast(error.message, "error"); return; }
    showToast(initial ? "Project updated" : "Design saved");
    setTimeout(() => { router.push("/dashboard/projects"); router.refresh(); }, 900);
  };

  // Preview config for WindowPreview component
  const previewCfg = {
    ...cfg,
    style: style.name,
    material: "uPVC",
    colour: colour.hex,
    colourName: colour.name,
  };

  return (
    <div>
      <Toast {...toast} onDone={clear} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <Link href="/dashboard" className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 mb-2">
            <ArrowLeft size={14} /> Back to dashboard
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl leading-tight">
            {initial ? "Edit design" : "New uPVC window"}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Configure your window — live price updates as you choose.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="px-4 py-2.5 text-sm font-medium hover:bg-neutral-900/5 rounded-full transition">
            Cancel
          </Link>
          <button
            onClick={save}
            disabled={!cfg.name || saving}
            className="px-5 py-2.5 text-sm font-medium bg-neutral-900 text-neutral-50 rounded-full hover:bg-neutral-800 disabled:opacity-40 transition flex items-center gap-2"
          >
            {saving ? "Saving..." : (<><Check size={14} /> Save project</>)}
          </button>
        </div>
      </div>

      {/* Main layout: left = preview + price, right = configurator */}
      <div className="grid lg:grid-cols-5 gap-6">

        {/* LEFT: Live preview + price summary */}
        <div className="lg:col-span-2 lg:sticky lg:top-6 self-start">
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Preview */}
            <div className="aspect-square p-6" style={{ background: "linear-gradient(135deg, #faf7f2, #eceae5)" }}>
              <WindowPreview cfg={previewCfg} />
            </div>

            {/* Project name input */}
            <div className="p-5 border-t border-neutral-100">
              <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider block mb-2">Project name</label>
              <input
                type="text"
                value={cfg.name}
                onChange={e => set("name", e.target.value)}
                placeholder="e.g. Front bedroom, Kitchen window…"
                className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition"
              />
            </div>

            {/* Live price */}
            <div className="bg-neutral-900 text-neutral-50 p-5">
              <div className="flex justify-between items-center text-xs mb-2 opacity-70">
                <span>Subtotal (ex. VAT)</span>
                <span>£{pricing.subtotal.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-xs mb-3 opacity-70">
                <span>VAT @ 20%</span>
                <span>£{pricing.vat.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                <span className="text-xs font-medium uppercase tracking-wider">Total inc. VAT</span>
                <span className="font-serif text-3xl">£{pricing.total.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Price breakdown */}
          <details className="mt-4 bg-white border border-neutral-200 rounded-xl p-4">
            <summary className="text-xs font-medium cursor-pointer text-neutral-700">Price breakdown</summary>
            <div className="mt-3 space-y-1 text-xs text-neutral-600 font-mono">
              <div className="flex justify-between"><span>Frame ({pricing.areaSqm}m²)</span><span>£{pricing.framePrice}</span></div>
              {parseFloat(pricing.colourUplift) > 0 && <div className="flex justify-between"><span>Colour uplift</span><span>£{pricing.colourUplift}</span></div>}
              {parseFloat(pricing.glazingPrice) > 0 && <div className="flex justify-between"><span>Glazing upgrade</span><span>£{pricing.glazingPrice}</span></div>}
              {parseFloat(pricing.decorativePrice) > 0 && <div className="flex justify-between"><span>Decorative</span><span>£{pricing.decorativePrice}</span></div>}
              {parseFloat(pricing.handlePrice) > 0 && <div className="flex justify-between"><span>Handles</span><span>£{pricing.handlePrice}</span></div>}
              {parseFloat(pricing.hingePrice) > 0 && <div className="flex justify-between"><span>Hinges</span><span>£{pricing.hingePrice}</span></div>}
              {parseFloat(pricing.securityPrice) > 0 && <div className="flex justify-between"><span>Security</span><span>£{pricing.securityPrice}</span></div>}
              {parseFloat(pricing.tricklePrice) > 0 && <div className="flex justify-between"><span>Trickle vents</span><span>£{pricing.tricklePrice}</span></div>}
              {parseFloat(pricing.dummyPrice) > 0 && <div className="flex justify-between"><span>Dummy sashes</span><span>£{pricing.dummyPrice}</span></div>}
              {parseFloat(pricing.extrasPrice) > 0 && <div className="flex justify-between"><span>Extras</span><span>£{pricing.extrasPrice}</span></div>}
            </div>
          </details>
        </div>

        {/* RIGHT: Configurator sections */}
        <div className="lg:col-span-3 space-y-4">

          {/* 1. STYLE */}
          <Section title="1. Window style" subtitle="Choose the window type">
            <div className="grid sm:grid-cols-2 gap-3">
              {WINDOW_STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { set("styleId", s.id); set("style", s.name); if (cfg.panes < s.minPanes) set("panes", s.minPanes); if (cfg.panes > s.maxPanes) set("panes", s.maxPanes); }}
                  className={`text-left p-4 rounded-xl border-2 transition ${cfg.styleId === s.id ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white hover:border-neutral-300"}`}
                >
                  <div className="font-medium text-sm mb-1">{s.name}</div>
                  <div className="text-xs text-neutral-500 mb-2">{s.tagline}</div>
                  <div className="text-xs font-mono text-neutral-700">From £{s.basePricePerSqm}/m²</div>
                </button>
              ))}
            </div>
          </Section>

          {/* 2. DIMENSIONS */}
          <Section title="2. Dimensions" subtitle="Width and height in millimetres">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Width (mm)">
                <input
                  type="number"
                  min="300"
                  max="3000"
                  step="10"
                  value={cfg.width}
                  onChange={e => set("width", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 font-mono"
                />
              </Field>
              <Field label="Height (mm)">
                <input
                  type="number"
                  min="300"
                  max="3000"
                  step="10"
                  value={cfg.height}
                  onChange={e => set("height", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 font-mono"
                />
              </Field>
            </div>
            <div className="mt-3 text-xs text-neutral-500 font-mono">
              Area: {pricing.areaSqm}m²
            </div>
          </Section>

          {/* 3. PANE COUNT */}
          <Section title="3. Pane configuration" subtitle="How many glazed panes?">
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 8].filter(p => p >= style.minPanes && p <= style.maxPanes).map(n => (
                <button
                  key={n}
                  onClick={() => set("panes", n)}
                  className={`aspect-square rounded-lg border-2 font-serif text-2xl transition ${cfg.panes === n ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white hover:border-neutral-300"}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="mt-3 text-xs text-neutral-500">
              Estimated openers: <strong>{cfg.openers}</strong> (we'll confirm during survey)
            </div>
          </Section>

          {/* 4. COLOUR */}
          <Section title="4. Frame colour" subtitle="White is base — coloured adds 35%">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {WINDOW_COLOURS.map(c => (
                <button
                  key={c.id}
                  onClick={() => { set("colourId", c.id); set("colour", c.name); }}
                  className={`text-left p-3 rounded-xl border-2 transition ${cfg.colourId === c.id ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white hover:border-neutral-300"}`}
                >
                  <div className="w-full h-10 rounded-md mb-2 border border-neutral-200" style={{ background: c.hex }} />
                  <div className="text-xs font-medium truncate">{c.name}</div>
                  {c.uplift > 0 && <div className="text-[10px] text-neutral-500">+{c.uplift}%</div>}
                  {c.popular && <div className="text-[10px] text-amber-700">Popular</div>}
                </button>
              ))}
            </div>
          </Section>

          {/* 5. HANDLES */}
          <Section title="5. Handle finish" subtitle="Locking push button — standard 3 finishes free">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {HANDLE_FINISHES.map(h => (
                <button
                  key={h.id}
                  onClick={() => set("handleId", h.id)}
                  className={`text-center p-3 rounded-xl border-2 transition ${cfg.handleId === h.id ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white hover:border-neutral-300"}`}
                >
                  <div className="text-xs font-medium mb-1">{h.name}</div>
                  <div className="text-[10px] text-neutral-500">{h.standard ? "Free" : `+£${h.price}`}</div>
                </button>
              ))}
            </div>
          </Section>

          {/* 6. CILL */}
          <Section title="6. External cill" subtitle="Included in price">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {CILL_OPTIONS.map(c => (
                <button
                  key={c.id}
                  onClick={() => set("cillId", c.id)}
                  className={`py-3 rounded-xl border-2 font-mono text-sm transition ${cfg.cillId === c.id ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white hover:border-neutral-300"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </Section>

          {/* 7. GLAZING */}
          <Section title="7. Glazing type" subtitle="28mm Pilkington EnergiKare as standard">
            <div className="space-y-2">
              {GLAZING_OPTIONS.map(g => (
                <label key={g.id} className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition ${cfg.glazingId === g.id ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white hover:border-neutral-300"}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="glazing" value={g.id} checked={cfg.glazingId === g.id} onChange={() => set("glazingId", g.id)} />
                    <span className="text-sm font-medium">{g.name}</span>
                  </div>
                  <span className="text-xs font-mono text-neutral-500">{g.price === 0 ? "Included" : `+£${g.price}/pane`}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* 8. DECORATIVE */}
          <Section title="8. Decorative glazing (optional)" subtitle="Georgian bars, lead designs">
            <div className="space-y-2">
              {DECORATIVE_OPTIONS.map(d => (
                <label key={d.id} className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition ${cfg.decorativeId === d.id ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white hover:border-neutral-300"}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="decorative" value={d.id} checked={cfg.decorativeId === d.id} onChange={() => set("decorativeId", d.id)} />
                    <span className="text-sm font-medium">{d.name}</span>
                  </div>
                  <span className="text-xs font-mono text-neutral-500">{d.pricePerSqm ? `+£${d.pricePerSqm}/m²` : "Included"}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* 9. HINGES */}
          <Section title="9. Hinge upgrades (optional)" subtitle="For bedrooms, cleaning, etc.">
            <div className="space-y-2">
              {HINGE_OPTIONS.map(h => (
                <label key={h.id} className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition ${cfg.hingeId === h.id ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white hover:border-neutral-300"}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="hinges" value={h.id} checked={cfg.hingeId === h.id} onChange={() => set("hingeId", h.id)} />
                    <span className="text-sm font-medium">{h.name}</span>
                  </div>
                  <span className="text-xs font-mono text-neutral-500">{h.pricePerOpener ? `+£${h.pricePerOpener}/opener` : "Included"}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* 10. SECURITY */}
          <Section title="10. Security add-ons (optional)" subtitle="Enhanced PAS24 options">
            <div className="space-y-2">
              {SECURITY_ADDONS.map(s => (
                <label key={s.id} className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition ${cfg.securityIds.includes(s.id) ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white hover:border-neutral-300"}`}>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={cfg.securityIds.includes(s.id)} onChange={() => toggleInArray("securityIds", s.id)} />
                    <span className="text-sm font-medium">{s.name}</span>
                  </div>
                  <span className="text-xs font-mono text-neutral-500">+£{s.pricePerOpener}/opener</span>
                </label>
              ))}
            </div>
          </Section>

          {/* 11. EXTRAS */}
          <Section title="11. Extras (optional)" subtitle="Energy upgrades, fitting accessories">
            <div className="space-y-2">
              {EXTRAS.map(e => (
                <label key={e.id} className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition ${cfg.extraIds.includes(e.id) ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white hover:border-neutral-300"}`}>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={cfg.extraIds.includes(e.id)} onChange={() => toggleInArray("extraIds", e.id)} />
                    <span className="text-sm font-medium">{e.name}</span>
                  </div>
                  <span className="text-xs font-mono text-neutral-500">
                    {e.priceType === "percent" ? `+${e.priceValue}%` : e.pricePerUnit ? `+£${e.pricePerUnit} ${e.perUnit}` : `+£${e.price}`}
                  </span>
                </label>
              ))}
            </div>

            {/* Counters for trickle vents and dummy sashes */}
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <Field label="Trickle vents (£15 each)">
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={cfg.trickleVentCount}
                  onChange={e => set("trickleVentCount", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-lg"
                />
              </Field>
              <Field label="Dummy sashes (£35 each)">
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={cfg.dummySashCount}
                  onChange={e => set("dummySashCount", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-lg"
                />
              </Field>
            </div>
          </Section>

          {/* 12. NOTES */}
          <Section title="12. Additional notes (optional)" subtitle="Anything specific for our team">
            <textarea
              rows="3"
              value={cfg.notes}
              onChange={e => set("notes", e.target.value)}
              placeholder="e.g. access restrictions, specific colour match required, delivery date preferences…"
              className="w-full px-4 py-3 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition resize-none"
            />
          </Section>

          {/* Save bar */}
          <div className="sticky bottom-4 mt-8">
            <div className="bg-neutral-900 text-neutral-50 rounded-2xl p-5 flex items-center justify-between shadow-xl">
              <div>
                <div className="text-xs opacity-70 uppercase tracking-wider font-mono mb-1">Your quote</div>
                <div className="font-serif text-2xl">£{pricing.total.toLocaleString("en-GB", { minimumFractionDigits: 2 })} <span className="text-xs opacity-60 font-sans">inc. VAT</span></div>
              </div>
              <button
                onClick={save}
                disabled={!cfg.name || saving}
                className="px-6 py-3 bg-amber-300 text-neutral-900 rounded-full font-medium text-sm hover:bg-amber-200 disabled:opacity-40 transition flex items-center gap-2"
              >
                {saving ? "Saving..." : (<><Check size={16} /> {initial ? "Update" : "Save"} project</>)}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="font-serif text-xl leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
