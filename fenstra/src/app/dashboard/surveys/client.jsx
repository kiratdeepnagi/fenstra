"use client";
import { useState } from "react";
import { Plus, Calendar, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Header, EmptyCard, StatusPill, Toast, useToast } from "@/components/ui";

export function SurveysClient({ initialSurveys, projects, customers, role, userId }) {
  const supabase = createClient();
  const { toast, show: showToast, clear } = useToast();
  const [surveys, setSurveys] = useState(initialSurveys);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ project_id: "", survey_date: "", survey_time: "10:00", address: "" });

  const isCustomer = role === "customer";
  const myProjects = projects.filter((p) => p.user_id === userId);

  const submit = async () => {
    if (!form.project_id || !form.survey_date || !form.address) return;
    const { data, error } = await supabase.from("surveys").insert({
      user_id: userId,
      project_id: form.project_id,
      survey_date: form.survey_date,
      survey_time: form.survey_time,
      address: form.address,
      status: "pending",
    }).select().single();
    if (error) { showToast(error.message, "error"); return; }
    setSurveys([...surveys, data]);
    setForm({ project_id: "", survey_date: "", survey_time: "10:00", address: "" });
    setOpen(false);
    showToast("Survey requested");
  };

  const setStatus = async (id, status) => {
    const { error } = await supabase.from("surveys").update({ status }).eq("id", id);
    if (error) { showToast(error.message, "error"); return; }
    setSurveys(surveys.map((s) => (s.id === id ? { ...s, status } : s)));
    showToast("Survey updated");
  };

  return (
    <div>
      <Toast {...toast} onDone={clear} />
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <Header
          title={isCustomer ? "Surveys" : "Survey bookings"}
          subtitle={isCustomer ? "Book a free on-site measure." : `${surveys.filter((s) => s.status !== "completed").length} scheduled`}
        />
        {isCustomer && (
          <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 text-sm font-medium bg-neutral-900 text-neutral-50 px-4 py-2.5 rounded-full hover:bg-neutral-800">
            <Plus size={14} /> Book survey
          </button>
        )}
      </div>

      {open && isCustomer && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 mb-6 shadow-sm space-y-3">
          <select value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })}
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-neutral-900">
            <option value="">Select a project</option>
            {myProjects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={form.survey_date} onChange={(e) => setForm({ ...form, survey_date: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-neutral-900" />
            <input type="time" value={form.survey_time} onChange={(e) => setForm({ ...form, survey_time: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-neutral-900" />
          </div>
          <input placeholder="Site address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-neutral-900" />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm hover:bg-neutral-100 rounded-full">Cancel</button>
            <button onClick={submit} disabled={!form.project_id || !form.survey_date || !form.address}
              className="px-4 py-2 text-sm bg-neutral-900 text-neutral-50 rounded-full disabled:opacity-40">Request</button>
          </div>
        </div>
      )}

      {surveys.length === 0 ? <EmptyCard msg="No surveys yet." /> : (
        <div className="space-y-3">
          {surveys.map((s) => {
            const proj = projects.find((p) => p.id === s.project_id);
            const cust = customers?.[s.user_id];
            return (
              <div key={s.id} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-serif text-xl mb-1">{proj?.name || "Survey"}</div>
                    {!isCustomer && cust && (
                      <div className="font-mono text-xs text-neutral-500">{cust.full_name} · {cust.email}{cust.phone ? ` · ${cust.phone}` : ""}</div>
                    )}
                    {isCustomer && <div className="text-sm text-neutral-600">{s.address}</div>}
                  </div>
                  <StatusPill status={s.status} />
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                  <div><div className="text-xs text-neutral-500 mb-0.5">Date</div><div className="font-mono flex items-center gap-1"><Calendar size={12} />{s.survey_date}</div></div>
                  <div><div className="text-xs text-neutral-500 mb-0.5">Time</div><div className="font-mono flex items-center gap-1"><Clock size={12} />{s.survey_time?.slice(0,5)}</div></div>
                  {!isCustomer && <div><div className="text-xs text-neutral-500 mb-0.5">Address</div><div className="text-sm">{s.address}</div></div>}
                </div>
                {!isCustomer && (
                  <div className="flex gap-2 flex-wrap pt-3 border-t border-neutral-100">
                    <button onClick={() => setStatus(s.id, "confirmed")} className="px-3 py-1.5 text-xs bg-emerald-50 text-emerald-900 rounded-full hover:bg-emerald-100">Confirm</button>
                    <button onClick={() => setStatus(s.id, "completed")} className="px-3 py-1.5 text-xs bg-neutral-900 text-neutral-50 rounded-full hover:bg-neutral-800">Mark completed</button>
                    <button onClick={() => setStatus(s.id, "pending")} className="px-3 py-1.5 text-xs hover:bg-neutral-100 rounded-full text-neutral-600">Set pending</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
