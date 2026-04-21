"use client";
import { useState } from "react";
import { Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Header, Field, Toast, useToast } from "@/components/ui";

export function ProfileClient({ profile }) {
  const supabase = createClient();
  const { toast, show: showToast, clear } = useToast();
  const [f, setF] = useState({
    full_name: profile.full_name || "",
    phone: profile.phone || "",
    company_name: profile.company_name || "",
  });
  const [pw, setPw] = useState({ next: "", confirm: "" });
  const [saving, setSaving] = useState(false);

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update(f).eq("id", profile.id);
    setSaving(false);
    if (error) { showToast(error.message, "error"); return; }
    showToast("Profile updated");
  };

  const changePassword = async () => {
    if (pw.next.length < 8) { showToast("Password must be at least 8 characters", "error"); return; }
    if (pw.next !== pw.confirm) { showToast("Passwords do not match", "error"); return; }
    const { error } = await supabase.auth.updateUser({ password: pw.next });
    if (error) { showToast(error.message, "error"); return; }
    setPw({ next: "", confirm: "" });
    showToast("Password changed");
  };

  return (
    <div>
      <Toast {...toast} onDone={clear} />
      <Header title="Account settings" subtitle="Manage your profile and password." />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-serif text-2xl mb-4">Profile</h3>
          <div className="space-y-3">
            <Field label="Full name">
              <input value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-neutral-900" />
            </Field>
            <Field label="Email">
              <input value={profile.email} disabled
                className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-sm outline-none text-neutral-500" />
            </Field>
            <Field label="Phone">
              <input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-neutral-900" />
            </Field>
            <Field label="Company">
              <input value={f.company_name} onChange={(e) => setF({ ...f, company_name: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-neutral-900" />
            </Field>
          </div>
          <button onClick={saveProfile} disabled={saving}
            className="mt-4 w-full py-3 bg-neutral-900 text-neutral-50 rounded-xl text-sm font-medium hover:bg-neutral-800 disabled:opacity-40">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-serif text-2xl mb-4">Change password</h3>
          <div className="space-y-3">
            <Field label="New password">
              <input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-neutral-900" />
            </Field>
            <Field label="Confirm new password">
              <input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-neutral-900" />
            </Field>
          </div>
          <button onClick={changePassword}
            className="mt-4 w-full py-3 bg-neutral-900 text-neutral-50 rounded-xl text-sm font-medium hover:bg-neutral-800">
            Update password
          </button>
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Shield size={14} />
              <span>Passwords are hashed by Supabase Auth. Sessions refresh automatically.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
