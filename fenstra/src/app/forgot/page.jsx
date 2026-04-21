"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo, Toast, useToast } from "@/components/ui";

export default function ForgotPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast, show: showToast, clear } = useToast();

  const submit = async () => {
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/reset`,
    });
    setLoading(false);
    if (error) { showToast(error.message, "error"); return; }
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-stretch anim-fade">
      <Toast {...toast} onDone={clear} />
      <div className="hidden md:flex flex-col justify-between w-2/5 bg-neutral-900 text-neutral-50 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(135deg, transparent 48%, #d4a373 49%, #d4a373 51%, transparent 52%)", backgroundSize: "24px 24px" }} />
        <div className="relative">
          <Logo light />
          <h1 className="font-serif text-5xl leading-tight mb-4 max-w-sm mt-16">Reset your password.</h1>
          <p className="text-neutral-400 max-w-sm">We'll email you a secure one-time link to choose a new password.</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-10 relative">
        <Link href="/login" className="absolute top-6 left-6 flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900">
          <ArrowLeft size={16} /> Back to log in
        </Link>
        <div className="max-w-md mx-auto w-full">
          <h2 className="font-serif text-3xl mb-5 md:hidden">Forgot password</h2>
          {sent ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <div className="font-serif text-xl mb-1">Check your inbox</div>
              <p className="text-sm text-neutral-700">We've sent a reset link to <span className="font-mono">{email}</span>. The link expires in 30 minutes.</p>
            </div>
          ) : (
            <>
              <div className="relative mb-3">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="email" placeholder="Your account email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-neutral-300 rounded-xl focus:border-neutral-900 outline-none text-sm" />
              </div>
              <button onClick={submit} disabled={!email || loading}
                className="w-full py-3.5 bg-neutral-900 text-neutral-50 rounded-xl font-medium hover:bg-neutral-800 disabled:opacity-40 transition">
                {loading ? "Sending…" : "Send reset link"}
              </button>
              <p className="text-xs text-neutral-500 mt-4">Login attempts are rate-limited for your security.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
