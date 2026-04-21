"use client";
import { useState, useMemo } from "react";
import { Header, Field, Toast, useToast } from "@/components/ui";

const DEFAULTS = {
  base_window: 420,
  base_door: 1400,
  triple_addon: 180,
  acoustic_addon: 260,
  toughened_addon: 90,
  laminated_addon: 140,
  premium_hw: 120,
  luxury_hw: 280,
  colour_addon: 85,
  material_mult_aluminium: 1.35,
  material_mult_timber: 1.25,
  material_mult_steel: 1.6,
  vat_percent: 20,
};

export function AdminPricingClient() {
  const { toast, show: showToast, clear } = useToast();
  const [p, setP] = useState(DEFAULTS);
  const [sample, setSample] = useState({ width: 1200, height: 1200, material: "aluminium", glazing: "double", hardware: "standard" });

  const upd = (k, v) => setP({ ...p, [k]: parseFloat(v) || 0 });

  const preview = useMemo(() => {
    const base = p.base_window;
    const mult = { upvc: 1.0, aluminium: p.material_mult_aluminium, timber: p.material_mult_timber, steel: p.material_mult_steel }[sample.material] || 1;
    const area = (sample.width * sample.height) / 1_000_000;
    const areaFactor = Math.max(1, area / 1.5);
    const glazingAdd = { double: 0, triple: p.triple_addon, acoustic: p.acoustic_addon }[sample.glazing] || 0;
    const hwAdd = { standard: 0, premium: p.premium_hw, luxury: p.luxury_hw }[sample.hardware] || 0;
    const subtotal = base * mult * areaFactor + glazingAdd + hwAdd + p.colour_addon;
    const vat = subtotal * (p.vat_percent / 100);
    return { subtotal: Math.round(subtotal), vat: Math.round(vat), total: Math.round(subtotal + vat) };
  }, [p, sample]);

  const save = () => showToast("Pricing saved (session only — wire to DB to persist)");
  const reset = () => { setP(DEFAULTS); showToast("Reset to defaults"); };

  return (
    <div>
      <Toast {...toast} onDone={clear} />
      <Header title="Pricing logic" subtitle="Control base prices, upgrades and margins." />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif text-2xl mb-4">Base prices</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Window base (£)">
                <input type="number" value={p.base_window} onChange={(e) => upd("base_window", e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono outline-none focus:border-neutral-900" />
              </Field>
              <Field label="Door base (£)">
                <input type="number" value={p.base_door} onChange={(e) => upd("base_door", e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono outline-none focus:border-neutral-900" />
              </Field>
              <Field label="VAT (%)">
                <input type="number" value={p.vat_percent} onChange={(e) => upd("vat_percent", e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono outline-none focus:border-neutral-900" />
              </Field>
              <Field label="Dual/non-white colour (£)">
                <input type="number" value={p.colour_addon} onChange={(e) => upd("colour_addon", e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono outline-none focus:border-neutral-900" />
              </Field>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif text-2xl mb-4">Glazing upgrades</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Triple (£)">
                <input type="number" value={p.triple_addon} onChange={(e) => upd("triple_addon", e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono outline-none focus:border-neutral-900" />
              </Field>
              <Field label="Acoustic (£)">
                <input type="number" value={p.acoustic_addon} onChange={(e) => upd("acoustic_addon", e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono outline-none focus:border-neutral-900" />
              </Field>
              <Field label="Toughened (£)">
                <input type="number" value={p.toughened_addon} onChange={(e) => upd("toughened_addon", e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono outline-none focus:border-neutral-900" />
              </Field>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif text-2xl mb-4">Hardware upgrades</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Premium (£)">
                <input type="number" value={p.premium_hw} onChange={(e) => upd("premium_hw", e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono outline-none focus:border-neutral-900" />
              </Field>
              <Field label="Luxury (£)">
                <input type="number" value={p.luxury_hw} onChange={(e) => upd("luxury_hw", e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono outline-none focus:border-neutral-900" />
              </Field>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif text-2xl mb-4">Material multipliers</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Aluminium (×)">
                <input type="number" step="0.05" value={p.material_mult_aluminium} onChange={(e) => upd("material_mult_aluminium", e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono outline-none focus:border-neutral-900" />
              </Field>
              <Field label="Timber (×)">
                <input type="number" step="0.05" value={p.material_mult_timber} onChange={(e) => upd("material_mult_timber", e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono outline-none focus:border-neutral-900" />
              </Field>
              <Field label="Steel (×)">
                <input type="number" step="0.05" value={p.material_mult_steel} onChange={(e) => upd("material_mult_steel", e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono outline-none focus:border-neutral-900" />
              </Field>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={save} className="px-5 py-3 bg-neutral-900 text-neutral-50 rounded-xl text-sm font-medium hover:bg-neutral-800">
              Save pricing
            </button>
            <button onClick={reset} className="px-5 py-3 border border-neutral-300 rounded-xl text-sm font-medium hover:bg-neutral-100">
              Reset to defaults
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-neutral-900 text-neutral-50 rounded-2xl p-6 sticky top-6">
            <div className="font-mono text-xs text-amber-300 mb-4">LIVE PRICE PREVIEW</div>
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Width × Height (mm)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={sample.width} onChange={(e) => setSample({ ...sample, width: parseInt(e.target.value) || 0 })}
                    className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm font-mono outline-none" />
                  <input type="number" value={sample.height} onChange={(e) => setSample({ ...sample, height: parseInt(e.target.value) || 0 })}
                    className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm font-mono outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Material</label>
                <select value={sample.material} onChange={(e) => setSample({ ...sample, material: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm outline-none">
                  <option value="upvc">uPVC</option>
                  <option value="aluminium">Aluminium</option>
                  <option value="timber">Timber</option>
                  <option value="steel">Steel</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Glazing</label>
                <select value={sample.glazing} onChange={(e) => setSample({ ...sample, glazing: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm outline-none">
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                  <option value="acoustic">Acoustic</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Hardware</label>
                <select value={sample.hardware} onChange={(e) => setSample({ ...sample, hardware: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm outline-none">
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 space-y-1 text-sm">
              <div className="flex justify-between text-neutral-400"><span>Subtotal</span><span className="font-mono">£{preview.subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-neutral-400"><span>VAT ({p.vat_percent}%)</span><span className="font-mono">£{preview.vat.toLocaleString()}</span></div>
              <div className="flex justify-between pt-2 items-baseline">
                <span className="text-xs text-neutral-400">Total</span>
                <span className="font-serif text-3xl">£{preview.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
