"use client";
import { useState } from "react";
import { Plus, X, Edit2, Check } from "lucide-react";
import { Header, Toast, useToast } from "@/components/ui";
import { WINDOW_STYLES, DOOR_STYLES, MATERIALS, COLOURS, GLAZING, HARDWARE } from "@/lib/data";

export function AdminProductsClient() {
  const { toast, show: showToast, clear } = useToast();
  const [tab, setTab] = useState("windows");
  const [catalogue, setCatalogue] = useState({
    windows: [...WINDOW_STYLES],
    doors: [...DOOR_STYLES],
    materials: [...MATERIALS],
    colours: COLOURS.map((c) => c.name),
    glazing: [...GLAZING],
    hardware: [...HARDWARE],
  });
  const [newItem, setNewItem] = useState("");
  const [editing, setEditing] = useState({ key: null, index: null, value: "" });

  const tabs = [
    { k: "windows", l: "Windows" },
    { k: "doors", l: "Doors" },
    { k: "materials", l: "Materials" },
    { k: "colours", l: "Colours" },
    { k: "glazing", l: "Glazing" },
    { k: "hardware", l: "Hardware" },
  ];

  const addItem = () => {
    if (!newItem.trim()) return;
    setCatalogue({ ...catalogue, [tab]: [...catalogue[tab], newItem.trim()] });
    setNewItem("");
    showToast("Added");
  };

  const removeItem = (i) => {
    setCatalogue({ ...catalogue, [tab]: catalogue[tab].filter((_, idx) => idx !== i) });
    showToast("Removed");
  };

  const saveEdit = () => {
    if (!editing.value.trim()) return;
    const updated = [...catalogue[editing.key]];
    updated[editing.index] = editing.value.trim();
    setCatalogue({ ...catalogue, [editing.key]: updated });
    setEditing({ key: null, index: null, value: "" });
    showToast("Updated");
  };

  return (
    <div>
      <Toast {...toast} onDone={clear} />
      <Header title="Products & profiles" subtitle="Manage your catalogue of styles, materials and finishes." />

      <div className="flex gap-1 mb-5 bg-neutral-100 p-1 rounded-full w-fit overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`px-4 py-2 text-xs rounded-full transition whitespace-nowrap ${tab === t.k ? "bg-white shadow-sm" : "hover:bg-white/50"}`}>
            {t.l}
          </button>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
          {catalogue[tab].map((item, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5 border border-neutral-100 rounded-xl hover:border-neutral-300 transition group">
              {editing.key === tab && editing.index === i ? (
                <>
                  <input value={editing.value} onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    autoFocus
                    className="flex-1 mr-2 px-2 py-1 border border-neutral-300 rounded text-sm outline-none focus:border-neutral-900" />
                  <button onClick={saveEdit} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Check size={14} /></button>
                  <button onClick={() => setEditing({ key: null, index: null, value: "" })} className="p-1 text-neutral-400 hover:bg-neutral-100 rounded"><X size={14} /></button>
                </>
              ) : (
                <>
                  <span className="text-sm">{item}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => setEditing({ key: tab, index: i, value: item })} className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded">
                      <Edit2 size={12} />
                    </button>
                    <button onClick={() => removeItem(i)} className="p-1 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded">
                      <X size={12} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 pt-5 border-t border-neutral-100 flex gap-2">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder={`Add new ${tabs.find((t) => t.k === tab).l.toLowerCase().replace(/s$/, "")}…`}
            className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-neutral-900"
          />
          <button onClick={addItem} className="flex items-center gap-1.5 px-4 py-2.5 bg-neutral-900 text-neutral-50 rounded-xl text-sm font-medium hover:bg-neutral-800">
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900">
        <strong>Note:</strong> Catalogue changes here affect this session. To persist edits across deploys, move these lists into a
        Supabase table (<code>products</code>) and reference them server-side. The schema is ready to extend.
      </div>
    </div>
  );
}
