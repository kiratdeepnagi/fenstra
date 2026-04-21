"use client";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function Logo({ light = false }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 rounded-sm grid place-items-center ${light ? "bg-neutral-50" : "bg-neutral-900"}`}>
        <div className={`w-4 h-4 grid grid-cols-2 grid-rows-2 ${light ? "border border-neutral-900" : "border border-amber-300"}`}>
          {[0,1,2,3].map((i) => (
            <div key={i} className={light ? "border border-neutral-900/40" : "border border-amber-300/40"} />
          ))}
        </div>
      </div>
      <span className="font-serif text-xl font-semibold tracking-tight">Fenstra</span>
    </div>
  );
}

export function Toast({ message, kind = "success", onDone }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onDone?.(), 3200);
    return () => clearTimeout(t);
  }, [message, onDone]);
  if (!message) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className={`px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm ${kind === "error" ? "bg-red-950 text-red-50" : "bg-neutral-900 text-neutral-50"}`}>
        {kind === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
        {message}
      </div>
    </div>
  );
}

export function StatusPill({ status }) {
  const map = {
    draft: { t: "Draft", c: "bg-neutral-100 text-neutral-700" },
    quoted: { t: "Quoted", c: "bg-amber-100 text-amber-900" },
    "survey-booked": { t: "Survey booked", c: "bg-emerald-100 text-emerald-900" },
    ordered: { t: "Ordered", c: "bg-blue-100 text-blue-900" },
    new: { t: "New", c: "bg-amber-100 text-amber-900" },
    responded: { t: "Responded", c: "bg-emerald-100 text-emerald-900" },
    closed: { t: "Closed", c: "bg-neutral-100 text-neutral-700" },
    confirmed: { t: "Confirmed", c: "bg-emerald-100 text-emerald-900" },
    pending: { t: "Pending", c: "bg-amber-100 text-amber-900" },
    completed: { t: "Completed", c: "bg-neutral-900 text-neutral-50" },
  };
  const s = map[status] || { t: status, c: "bg-neutral-100 text-neutral-700" };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${s.c} flex-shrink-0`}>{s.t}</span>;
}

export function Field({ label, children }) {
  return (
    <div>
      <label className="font-mono text-xs text-neutral-500 uppercase tracking-wider block mb-2">{label}</label>
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between mb-8">
        {Icon && <Icon size={18} className="text-neutral-400" />}
      </div>
      <div className="font-serif text-3xl leading-none mb-1">{value}</div>
      <div className="text-xs text-neutral-500">{label}</div>
    </div>
  );
}

export function EmptyCard({ msg, cta, onClick }) {
  return (
    <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-10 text-center">
      <p className="text-neutral-600 mb-4">{msg}</p>
      {cta && <button onClick={onClick} className="bg-neutral-900 text-neutral-50 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-neutral-800 transition">{cta}</button>}
    </div>
  );
}

export function Header({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-1">{title}</h1>
      {subtitle && <p className="text-neutral-600">{subtitle}</p>}
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState(null);
  const show = (message, kind = "success") => setToast({ message, kind });
  const clear = () => setToast(null);
  return { toast, show, clear };
}
