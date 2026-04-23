"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Folder, FileText, Calendar, Settings, LogOut, Sparkles,
  Users, Package, DollarSign, Menu, X, ClipboardList,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui";

const MENUS = {
  customer: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/designer", label: "New design", icon: Sparkles },
    { href: "/dashboard/quotes", label: "Quotes", icon: ClipboardList },
    { href: "/dashboard/projects", label: "My projects", icon: Folder },
    { href: "/dashboard/enquiries", label: "Enquiries", icon: FileText },
    { href: "/dashboard/surveys", label: "Surveys", icon: Calendar },
    { href: "/dashboard/profile", label: "Settings", icon: Settings },
  ],
  staff: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/quotes", label: "Quotes", icon: ClipboardList },
    { href: "/dashboard/enquiries", label: "Enquiries", icon: FileText },
    { href: "/dashboard/surveys", label: "Surveys", icon: Calendar },
    { href: "/dashboard/profile", label: "Settings", icon: Settings },
  ],
  admin: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/quotes", label: "Quotes", icon: ClipboardList },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/products", label: "Products", icon: Package },
    { href: "/dashboard/admin/pricing", label: "Pricing", icon: DollarSign },
    { href: "/dashboard/enquiries", label: "Enquiries", icon: FileText },
    { href: "/dashboard/surveys", label: "Surveys", icon: Calendar },
    { href: "/dashboard/profile", label: "Settings", icon: Settings },
  ],
};

export function Sidebar({ profile }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const menu = MENUS[profile.role] || MENUS.customer;

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-neutral-200 flex items-center justify-between px-4 py-3">
        <Logo />
        <button onClick={() => setOpen(!open)} className="p-2"><Menu size={20} /></button>
      </div>

      <aside className={`${open ? "block" : "hidden"} md:block fixed md:relative inset-0 md:inset-auto z-40 md:z-auto w-full md:w-64 bg-neutral-900 text-neutral-100`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between md:justify-start gap-2 mb-10">
            <Logo light />
            <button onClick={() => setOpen(false)} className="md:hidden p-1"><X size={20} /></button>
          </div>

          <div className="mb-6">
            <div className="font-mono text-[10px] text-neutral-500 mb-2 uppercase tracking-wider">{profile.role}</div>
            <div className="font-serif text-xl leading-tight">{profile.full_name || "User"}</div>
            <div className="text-xs text-neutral-400 mt-1 truncate">{profile.email}</div>
          </div>

          <nav className="flex-1 space-y-0.5">
            {menu.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${active ? "bg-neutral-50 text-neutral-900" : "text-neutral-300 hover:bg-neutral-800"}`}>
                  <Icon size={16} /> {item.label}
                </Link>
              );
            })}
          </nav>

          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 transition">
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>
    </>
  );
}
