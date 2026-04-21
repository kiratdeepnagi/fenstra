"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Download, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Header, EmptyCard, StatusPill, Toast, useToast } from "@/components/ui";
import { WindowPreview } from "@/components/preview";

export function ProjectsClient({ initialProjects }) {
  const router = useRouter();
  const supabase = createClient();
  const { toast, show: showToast, clear } = useToast();
  const [projects, setProjects] = useState(initialProjects);
  const [q, setQ] = useState("");

  const filtered = projects.filter((p) => p.name?.toLowerCase().includes(q.toLowerCase()));

  const del = async (id) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { showToast(error.message, "error"); return; }
    setProjects(projects.filter((p) => p.id !== id));
    showToast("Project deleted");
  };

  const exportPdf = (p) => {
    // Print-friendly quote: opens a new window with the quote details, user prints-to-PDF
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <!doctype html><html><head><title>Quote · ${p.name}</title>
      <style>body{font-family:system-ui;max-width:720px;margin:40px auto;padding:24px;color:#111}
      h1{font-size:28px;margin:0 0 4px}.muted{color:#666;font-size:13px}
      table{width:100%;border-collapse:collapse;margin:24px 0}
      td{padding:10px 0;border-bottom:1px solid #eee;font-size:14px}
      td:first-child{color:#666}td:last-child{text-align:right;font-weight:500}
      .total{font-size:32px;margin-top:12px}</style>
      </head><body>
      <h1>Fenstra Quote</h1><div class="muted">${new Date().toLocaleDateString("en-GB")}</div>
      <h2 style="margin-top:24px">${p.name}</h2>
      <table>
        <tr><td>Product</td><td>${p.product}</td></tr>
        <tr><td>Style</td><td>${p.style}</td></tr>
        <tr><td>Material</td><td>${p.material}</td></tr>
        <tr><td>Dimensions</td><td>${p.width} × ${p.height} mm</td></tr>
        <tr><td>Colour</td><td>${p.colour}</td></tr>
        <tr><td>Glazing</td><td>${p.glazing}</td></tr>
        <tr><td>Hardware</td><td>${p.hardware}</td></tr>
      </table>
      <div class="muted">Estimated price (inc. VAT, supply only, subject to survey)</div>
      <div class="total">£${p.price?.toLocaleString()}</div>
      <p class="muted" style="margin-top:40px">Thank you for choosing Fenstra. FENSA / CERTASS compliant.</p>
      <script>window.print()</script>
      </body></html>
    `);
    w.document.close();
  };

  return (
    <div>
      <Toast {...toast} onDone={clear} />
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <Header title="My projects" subtitle="All your saved designs and quotes." />
        <Link href="/dashboard/designer" className="flex items-center gap-1.5 text-sm font-medium bg-neutral-900 text-neutral-50 px-4 py-2.5 rounded-full hover:bg-neutral-800">
          <Plus size={14} /> New design
        </Link>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input placeholder="Search projects" value={q} onChange={(e) => setQ(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-300 rounded-xl focus:border-neutral-900 outline-none text-sm" />
      </div>

      {filtered.length === 0 ? (
        <Link href="/dashboard/designer"><EmptyCard msg="No projects yet." cta="Create a design" /></Link>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="relative group">
              <Link href={`/dashboard/designer?id=${p.id}`} className="bg-white border border-neutral-200 rounded-2xl p-4 text-left shadow-sm hover:border-neutral-900 transition block">
                <div className="h-32 rounded-xl mb-3 p-3" style={{ background: "linear-gradient(135deg, #eceae5, #faf7f2)" }}>
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
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => exportPdf(p)} className="p-1.5 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-white" title="Export quote">
                  <Download size={12} />
                </button>
                <button onClick={() => del(p.id)} className="p-1.5 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-red-50 text-red-600" title="Delete">
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
