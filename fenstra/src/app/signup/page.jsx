"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, UserPlus, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo, Toast, useToast } from "@/components/ui";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const { toast, show: showToast, clear } = useToast();
  const [f, setF] = useState({ full_name: "", email: "", phone: "", company_name: "", password: "" });
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => {
    let s = 0;
    if (f.password.length >= 8) s++;
    if (/[A-Z]/.test(f.password)) s++;
    if (/[0-9]/.test(f.password)) s++;
    if (/[^A-Za-z0-9]/.test(f.password)) s++;
    return s;
  }, [f.password]);

  const submit = async () => {
    if (!f.full_name || !f.email || strength < 2 || !agree) return;
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: f.email,
      password: f.password,
      options: {
        data: { full_name: f.full_name, phone: f.phone, company_name: f.company_name },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      showToast(error.message, "error");
      return;
    }
    router.push(`/verify?email=${encodeURIComponent(f.email)}`);
  };

  return (
    <div className="min-h-screen flex items-stretch anim-fade">
      <Toast {...toast} onDone={clear} />
      <div className="hidden md:flex flex-col justify-between w-2/5 bg-neutral-900 text-neutral-50 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(135deg, transparent 48%, #d4a373 49%, #d4a373 51%, transparent 52%)", backgroundSize: "24px 24px" }} />
        <div className="relative">
          <Logo light />
          <h1 className="font-serif text-5xl leading-tight mb-4 max-w-sm mt-16">Create your workspace</h1>
          <p className="text-neutral-400 max-w-sm">One account for all your glazing projects — designs, quotes, surveys and enquiries in one secure place.</p>
        </div>
        <div className="relative font-mono text-xs text-neutral-500">PAS24&nbsp;·&nbsp;Part L&nbsp;·&nbsp;FENSA&nbsp;·&nbsp;CERTASS</div>
      </div>
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-10 relative">
        <Link href="/" className="absolute top-6 left-6 flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="max-w-md mx-auto w-full">
          <h2 className="font-serif text-3xl mb-1 md:hidden">Sign up</h2>
          <p className="text-sm text-neutral-600 mb-6">
            Already have one? <Link href="/login" className="underline hover:text-neutral-900">Log in instead</Link>
          </p>
          <div className="relative mb-3">
            <UserPlus size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input placeholder="Full name" value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-neutral-300 rounded-xl focus:border-neutral-900 outline-none text-sm" />
          </div>
          <div className="relative mb-3">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="email" placeholder="Email address" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-neutral-300 rounded-xl focus:border-neutral-900 outline-none text-sm" />
          </div>
          <input placeholder="Phone (optional)" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })}
            className="w-full px-4 py-3.5 mb-3 bg-white border border-neutral-300 rounded-xl focus:border-neutral-900 outline-none text-sm" />
          <input placeholder="Company (optional)" value={f.company_name} onChange={(e) => setF({ ...f, company_name: e.target.value })}
            className="w-full px-4 py-3.5 mb-3 bg-white border border-neutral-300 rounded-xl focus:border-neutral-900 outline-none text-sm" />
          <div className="relative mb-3">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type={show ? "text" : "password"} placeholder="Password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })}
              className="w-full pl-11 pr-11 py-3.5 bg-white border border-neutral-300 rounded-xl focus:border-neutral-900 outline-none text-sm" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="flex gap-1 mb-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i < strength ? (strength < 2 ? "bg-red-400" : strength < 3 ? "bg-amber-400" : "bg-emerald-500") : "bg-neutral-200"}`} />
            ))}
          </div>
          <label className="flex items-start gap-2 text-xs text-neutral-600 mb-5 cursor-pointer">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5" />
            <span>I agree to the Terms &amp; privacy policy. Passwords are securely hashed and never stored in plain text.</span>
          </label>
          <button onClick={submit} disabled={!f.full_name || !f.email || strength < 2 || !agree || loading}
            className="w-full py-3.5 bg-neutral-900 text-neutral-50 rounded-xl font-medium hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
            {loading ? "Creating account…" : (<>Create account <ArrowRight size={18} /></>)}
          </button>
        </div>
      </div>
    </div>
  );
}
