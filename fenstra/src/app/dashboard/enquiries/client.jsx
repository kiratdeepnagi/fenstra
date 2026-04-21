"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Header, EmptyCard, StatusPill, Toast, useToast } from "@/components/ui";

export function EnquiriesClient({ initialEnquiries, role, customers }) {
  const supabase = createClient();
  const { toast, show: showToast, clear } = useToast();
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const isCustomer = role === "customer";

  const submit = async () => {
    if (!subject || !message) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("enquiries").insert({
      user_id: user.id, subject, message, status: "new",
    }).select().single();
    if (error) { showToast(error.message, "error"); return; }
    setEnquiries([data, ...enquiries]);
    setSubject(""); setMessage(""); setOpen(false);
    showToast("Enquiry sent");
  };

  const setStatus = async (id, status) => {
    const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
    if (error) { showToast(error.message, "error"); return; }
    setEnquiries(enquiries.map((e) => (e.id === id ? { ...e, status } : e)));
    showToast("Enquiry updated");
  };

  return (
    <div>
      <Toast {...toast} onDone={clear} />
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <Header
          title={isCustomer ? "My enquiries" : "Enquiries inbox"}
          subtitle={isCustomer ? "Questions, requests and messages to our team." : `${enquiries.filter((e) => e.status === "new").length} new · ${enquiries.length} total`}
        />
        {isCustomer && (
          <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 text-sm font-medium bg-neutral-900 text-neutral-50 px-4 py-2.5 rounded-full hover:bg-neutral-800">
            <Plus size={14} /> New enquiry
          </button>
        )}
      </div>

      {open && isCustomer && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 mb-6 shadow-sm">
          <input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl mb-3 text-sm outline-none focus:border-neutral-900" />
          <textarea placeholder="Your message" rows="4" value={message} onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl mb-3 text-sm outline-none focus:border-neutral-900 resize-none" />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm hover:bg-neutral-100 rounded-full">Cancel</button>
            <button onClick={submit} disabled={!subject || !message} className="px-4 py-2 text-sm bg-neutral-900 text-neutral-50 rounded-full disabled:opacity-40">Send</button>
          </div>
        </div>
      )}

      {enquiries.length === 0 ? (
        <EmptyCard msg="No enquiries yet." />
      ) : (
        <div className="space-y-3">
          {enquiries.map((e) => {
            const cust = customers?.[e.user_id];
            return (
              <div key={e.id} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="font-serif text-xl mb-1">{e.subject}</div>
                    {!isCustomer && cust && (
                      <div className="font-mono text-xs text-neutral-500">
                        {cust.full_name} · {cust.email}{cust.phone ? ` · ${cust.phone}` : ""}
                      </div>
                    )}
                  </div>
                  <StatusPill status={e.status} />
                </div>
                <p className="text-sm text-neutral-700 my-3">{e.message}</p>
                <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-neutral-100">
                  <div className="font-mono text-xs text-neutral-400">{new Date(e.created_at).toLocaleDateString("en-GB")}</div>
                  {!isCustomer && (
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => setStatus(e.id, "responded")} className="px-3 py-1.5 text-xs bg-emerald-50 text-emerald-900 rounded-full hover:bg-emerald-100">Mark responded</button>
                      <button onClick={() => setStatus(e.id, "closed")} className="px-3 py-1.5 text-xs bg-neutral-100 text-neutral-700 rounded-full hover:bg-neutral-200">Close</button>
                      <button onClick={() => setStatus(e.id, "new")} className="px-3 py-1.5 text-xs hover:bg-neutral-100 rounded-full text-neutral-600">Reopen</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
