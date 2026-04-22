"use client";
import { CheckCircle2, AlertCircle, Folder, FileText, Calendar, DollarSign, Users, Package, Wrench, LayoutDashboard, Sparkles, Settings } from "lucide-react";
import { useEffect, useState } from "react";

const ICONS = {
  Folder, FileText, Calendar, DollarSign, Users, Package, Wrench, LayoutDashboard, Sparkles, Settings
};

export function Logo({ light = false, size = "md" }) {
  const scale = { sm: 0.75, md: 1, lg: 1.3 }[size] || 1;
  const wordColor = light ? "#fafaf7" : "#1a1a1a";
  const discColor = light ? "#e8c87a" : "#1a1a1a";
  const fColor = light ? "#1a1a1a" : "#f5e6c8";

  return (
    <svg
      viewBox="0 0 280 90"
      height={48 * scale}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
      aria-label="Fenstra"
    >
      <g transform="translate(0,12)">
        <circle cx="33" cy="33" r="32" fill={discColor} />
        <text
          x="33"
          y="48"
          fontFamily="Playfair Display, Cormorant Garamond, Georgia, serif"
          fontSize="42"
          fontWeight="500"
          fontStyle="italic"
          fill={fColor}
          textAnchor="middle"
        >F</text>
      </g>
      <text
        x="82"
        y="54"
        fontFamily="Playfair Display, Georgia, serif"
        fontSize="48"
        fontWeight="500"
        fill={wordColor}
        letterSpacing="-0.8"
      >Fenstra</text>
    </svg>
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

export function StatCard({ label, value, iconName }) {
  const Icon = iconName ? ICONS[iconName] : null;
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

export function QuickLinkCard({ href, title, desc, iconName }) {
  const Icon = iconName ? ICONS[iconName] : null;
  return (
    <a href={href} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm text-left hover:border-neutral-900 transition group block">
      {Icon && <Icon size={20} className="mb-3 text-neutral-700" />}
      <div className="font-serif text-xl mb-1">{title}</div>
      <div className="text-sm text-neutral-500">{desc}</div>
    </a>
  );
}

export function useToast() {
  const [toast, setToast] = useState(null);
  const show = (message, kind = "success") => setToast({ message, kind });
  const clear = () => setToast(null);
  return { toast, show, clear };
}
