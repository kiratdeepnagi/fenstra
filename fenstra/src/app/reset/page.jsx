"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo, Toast, useToast } from "@/components/ui";

export default function ResetPage() {
  const router = useRouter();
  const supabase = createClient();
  const { toast, show: showToast, clear } = useToast();
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const ok = p1 && p1 === p2 && p1.length >= 8;

  const submit = async () => {
    if (!ok) return;
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: p1 });
    setLoading(false);
    if (error) { showToast(error.message, "error"); return; }
    showToast("Password updated");
    setTimeout(() => router.push("/dashboard"), 1200);
  };

  return (
    <div className="min-h-screen flex items-stretch anim-fade">
      <Toast {...toast} onDone={clear} />
      <div className="hidden md:flex flex-col justify-between w-2/5 bg-neutral-900 text-neutral-50 p-12 relative overflow-hidden">
        <div className="relative">
          <Logo light />
          <h1 className="font-serif text-5xl leading-tight mb-4 max-w-sm mt-16">Set a new password.</h1>
          <p className="text-neutral-400 max-w-sm">Choose a strong password of at least 8 characters.</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-10 relative">
        <Link href="/login" className="absolute top-6 left-6 flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="max-w-md mx-auto w-full">
          <h2 className="font-serif text-3xl mb-5 md:hidden">New password</h2>
          <div className="relative mb-3">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type={show ? "text" : "password"} placeholder="New password" value={p1} onChange={(e) => setP1(e.target.value)}
              className="w-full pl-11 pr-11 py-3.5 bg-white border border-neutral-300 rounded-xl focus:border-neutral-900 outline-none text-sm" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="relative mb-3">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type={show ? "text" : "password"} placeholder="Confirm password" value={p2} onChange={(e) => setP2(e.target.value)}
              className="w-full pl-11 pr-11 py-3.5 bg-white border border-neutral-300 rounded-xl focus:border-neutral-900 outline-none text-sm" />
          </div>
          <button onClick={submit} disabled={!ok || loading}
            className="w-full py-3.5 bg-neutral-900 text-neutral-50 rounded-xl font-medium hover:bg-neutral-800 disabled:opacity-40 transition">
            {loading ? "Saving…" : "Save new password"}
          </button>
        </div>
      </div>
    </div>
  );
}
