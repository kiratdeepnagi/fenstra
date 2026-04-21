"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Field, Toast, useToast } from "@/components/ui";
import { WindowPreview } from "@/components/preview";
import { WINDOW_STYLES, DOOR_STYLES, MATERIALS, COLOURS, GLAZING, HARDWARE } from "@/lib/data";
import { calcPrice } from "@/lib/pricing";

const DEFAULT = {
  name: "",
  product: "window",
  style: "Flush Casement",
  material: "Aluminium",
  width: 1200,
  height: 1200,
  colour: "RAL 7016 Anthracite Grey",
  glazing: "Double Glazed",
  hardware: "Standard",
  notes: "",
  status: "draft",
};

export function DesignerClient({ initial }) {
  const router = useRouter();
  const supabase = createClient();
  const { toast, show: showToast, clear } = useToast();
  const [cfg, setCfg] = useState(initial || DEFAULT);
  const [saving, setSaving] = useState(false);

  const price = useMemo(() => calcPrice(cfg), [cfg]);
  const styles = cfg.product === "window" ? WINDOW_STYLES : DOOR_STYLES;
  const set = (k, v) => setCfg({ ...cfg, [k]: v });

  const save = async () => {
    if (!cfg.name) { showToast("Please name your project", "error"); return; }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const payload = {
      user_id: user.id,
      name: cfg.name,
      product: cfg.product,
      style: cfg.style,
      material: cfg.material,
      width: cfg.width,
      height: cfg.height,
      colour: cfg.colour,
      glazing: cfg.glazing,
      hardware: cfg.hardware,
      price,
      notes: cfg.notes || null,
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

  return (
    <div>
      <Toast {...toast} onDone={clear} />
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <Link href="/dashboard" className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 mb-2">
            <ArrowLeft size={14} /> Back to dashboard
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl leading-tight">{initial ? "Edit design" : "New design"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="px-4 py-2.5 text-sm font-medium hover:bg-neutral-900/5 rounded-full transition">Cancel</Link>
          <button onClick={save} disabled={!cfg.name || saving} className="px-5 py-2.5 text-sm font-medium bg-neutral-900 text-neutral-50 rounded-full hover:bg-neutral-800 disabled:opacity-40 transition">
            {saving ? "Saving…" : "Save design"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 order-2 lg:order-1">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <div className="font-mono text-xs text-neutral-500">LIVE PREVIEW</div>
              <div className="font-mono text-xs text-neutral-500">{cfg.width} × {cfg.height} mm</div>
            </div>
            <div className="aspect-[4/3] rounded-xl mb-4 p-6" style={{ background: "linear-gradient(135deg, #eceae5, #faf7f2)" }}>
              <WindowPreview cfg={cfg} />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="font-mono text-xs text-neutral-500 mb-1">ESTIMATED PRICE</div>
                <div className="font-serif text-5xl leading-none">£{price.toLocaleString()}</div>
                <div className="text-xs text-neutral-500 mt-1">inc. VAT · supply only · subject to survey</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs text-neutral-500 mb-1">U-VALUE</div>
                <div className="font-serif text-2xl">{cfg.glazing === "Triple Glazed" ? "0.8" : "1.4"}</div>
                <div className="text-xs text-neutral-500">W/m²K</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 order-1 lg:order-2 space-y-5">
          <Field label="Project name">
            <input value={cfg.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Kitchen rear bifold"
              className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl focus:border-neutral-900 outline-none text-sm" />
          </Field>
          <Field label="Product type">
            <div className="grid grid-cols-2 gap-2">
              {["window", "door"].map((p) => (
                <button key={p} onClick={() => set("product", p)} className={`py-3 rounded-xl border text-sm font-medium capitalize transition ${cfg.product === p ? "bg-neutral-900 text-neutral-50 border-neutral-900" : "bg-white border-neutral-300 hover:border-neutral-500"}`}>{p}</button>
              ))}
            </div>
          </Field>
          <Field label="Style">
            <select value={cfg.style} onChange={(e) => set("style", e.target.value)} className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl focus:border-neutral-900 outline-none text-sm">
              {styles.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Material">
            <select value={cfg.material} onChange={(e) => set("material", e.target.value)} className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl focus:border-neutral-900 outline-none text-sm">
              {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Width (mm)">
              <input type="number" value={cfg.width} onChange={(e) => set("width", parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl focus:border-neutral-900 outline-none text-sm font-mono" />
            </Field>
            <Field label="Height (mm)">
              <input type="number" value={cfg.height} onChange={(e) => set("height", parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl focus:border-neutral-900 outline-none text-sm font-mono" />
            </Field>
          </div>
          <Field label="Colour">
            <div className="grid grid-cols-6 gap-2">
              {COLOURS.map((c) => {
                const sel = cfg.colour === c.name;
                return (
                  <button key={c.name} onClick={() => set("colour", c.name)} title={c.name}
                    className={`aspect-square rounded-lg border-2 transition relative ${sel ? "border-neutral-900 scale-105" : "border-neutral-200 hover:border-neutral-400"}`}
                    style={{ backgroundColor: c.hex }}>
                    {sel && <Check size={14} className="absolute inset-0 m-auto" style={{ color: c.hex === "#f6f6f6" ? "#000" : "#fff" }} />}
                  </button>
                );
              })}
            </div>
            <div className="text-xs text-neutral-500 mt-2">{cfg.colour}</div>
          </Field>
          <Field label="Glazing">
            <select value={cfg.glazing} onChange={(e) => set("glazing", e.target.value)} className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl focus:border-neutral-900 outline-none text-sm">
              {GLAZING.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Hardware">
            <div className="grid grid-cols-3 gap-2">
              {HARDWARE.map((h) => (
                <button key={h} onClick={() => set("hardware", h)} className={`py-2.5 rounded-xl border text-xs font-medium transition ${cfg.hardware === h ? "bg-neutral-900 text-neutral-50 border-neutral-900" : "bg-white border-neutral-300 hover:border-neutral-500"}`}>{h}</button>
              ))}
            </div>
          </Field>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-amber-700" />
              <span className="font-mono text-xs text-amber-900 uppercase tracking-wider">Recommended upgrades</span>
            </div>
            <ul className="text-xs text-amber-900 space-y-1">
              {cfg.glazing === "Double Glazed" && <li>· Triple glazing for better U-values (+£180)</li>}
              {cfg.hardware === "Standard" && <li>· Premium security locks for PAS24 (+£120)</li>}
              <li>· Integral blinds · Acoustic glass upgrade · 10-year maintenance plan</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
