"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo, Toast, useToast } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast, show: showToast, clear } = useToast();

  const submit = async () => {
    if (!email || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      showToast(error.message, "error");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-stretch anim-fade">
      <Toast {...toast} onDone={clear} />
      <div className="hidden md:flex flex-col justify-between w-2/5 bg-neutral-900 text-neutral-50 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(135deg, transparent 48%, #d4a373 49%, #d4a373 51%, transparent 52%)", backgroundSize: "24px 24px" }} />
        <div className="relative">
          <Logo light />
          <h1 className="font-serif text-5xl leading-tight mb-4 max-w-sm mt-16">Welcome back.</h1>
          <p className="text-neutral-400 max-w-sm">Log in to access your private dashboard, saved designs and quotes.</p>
        </div>
        <div className="relative font-mono text-xs text-neutral-500">PAS24&nbsp;·&nbsp;Part L&nbsp;·&nbsp;FENSA&nbsp;·&nbsp;CERTASS</div>
      </div>
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-10 relative">
        <Link href="/" className="absolute top-6 left-6 flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="max-w-md mx-auto w-full">
          <h2 className="font-serif text-3xl mb-1 md:hidden">Log in</h2>
          <p className="text-sm text-neutral-600 mb-6">
            No account yet? <Link href="/signup" className="underline hover:text-neutral-900">Create one</Link>
          </p>
          <div className="relative mb-3">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-neutral-300 rounded-xl focus:border-neutral-900 outline-none text-sm" />
          </div>
          <div className="relative mb-3">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type={show ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-11 py-3.5 bg-white border border-neutral-300 rounded-xl focus:border-neutral-900 outline-none text-sm" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="flex justify-end mb-5">
            <Link href="/forgot" className="text-xs text-neutral-600 hover:text-neutral-900 underline">Forgot password?</Link>
          </div>
          <button onClick={submit} disabled={!email || !password || loading}
            className="w-full py-3.5 bg-neutral-900 text-neutral-50 rounded-xl font-medium hover:bg-neutral-800 disabled:opacity-40 transition flex items-center justify-center gap-2">
            {loading ? "Logging in…" : (<>Log in <ArrowRight size={18} /></>)}
          </button>
        </div>
      </div>
    </div>
  );
}
