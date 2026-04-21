import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui";

export default function Landing() {
  return (
    <div className="min-h-screen anim-fade">
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-neutral-900/10">
        <Logo />
        <div className="flex items-center gap-2">
          <Link href="/login" className="px-4 py-2 text-sm font-medium hover:bg-neutral-900/5 rounded-full transition">Log in</Link>
          <Link href="/signup" className="px-4 py-2 text-sm font-medium bg-neutral-900 text-neutral-50 rounded-full hover:bg-neutral-800 transition">Get started</Link>
        </div>
      </nav>

      <section className="relative px-6 md:px-12 pt-10 md:pt-20 pb-16 subtle-grid">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900/5 rounded-full text-xs font-mono mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            UK&nbsp;·&nbsp;FENSA&nbsp;·&nbsp;PAS24&nbsp;·&nbsp;Part&nbsp;L
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-6 max-w-4xl">
            Design windows, doors &amp; shopfronts <em className="italic text-amber-800">in minutes.</em>
          </h1>
          <p className="text-base md:text-lg max-w-xl text-neutral-700 mb-10 leading-relaxed">
            A professional UK glazing platform for homeowners, builders, architects and fabricators. Configure, visualise, quote and order — all from a single secure workspace.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className="group px-6 py-3.5 bg-neutral-900 text-neutral-50 rounded-full font-medium flex items-center gap-2 hover:bg-neutral-800 transition">
              Create free account <ArrowRight size={18} className="group-hover:translate-x-0.5 transition" />
            </Link>
            <Link href="/login" className="px-6 py-3.5 border border-neutral-900/20 rounded-full font-medium hover:bg-neutral-900/5 transition">
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 border-t border-neutral-900/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { n: "01", t: "Configure", d: "Every material, RAL colour, glazing type and hardware option on the UK market." },
              { n: "02", t: "Visualise", d: "Realistic renders update as you design. Share a preview with your builder instantly." },
              { n: "03", t: "Quote & order", d: "Transparent pricing, instant PDF quotes, survey booking and project tracking." },
            ].map((f) => (
              <div key={f.n} className="border-t-2 border-neutral-900 pt-6">
                <div className="font-mono text-xs text-neutral-500 mb-2">{f.n}</div>
                <h3 className="font-serif text-2xl mb-2">{f.t}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 md:px-12 py-8 text-xs text-neutral-500 font-mono border-t border-neutral-900/10">
        © 2026 Fenstra · Window &amp; Door Design Pro UK · FENSA / CERTASS compliant
      </footer>
    </div>
  );
}
