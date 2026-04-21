import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import { Header, StatCard, EmptyCard, StatusPill, QuickLinkCard } from "@/components/ui";
import { WindowPreview } from "@/components/preview";

export default async function DashboardHome() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (profile.role === "admin") return <AdminOverview profile={profile} supabase={supabase} />;
  if (profile.role === "staff") return <StaffOverview profile={profile} supabase={supabase} />;
  return <CustomerOverview profile={profile} supabase={supabase} user={user} />;
}

async function CustomerOverview({ profile, supabase, user }) {
  const { data: projects = [] } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
  const { data: enquiries = [] } = await supabase.from("enquiries").select("*");
  const { data: surveys = [] } = await supabase.from("surveys").select("*");
  const total = (projects || []).reduce((s, p) => s + (p.price || 0), 0);

  return (
    <div>
      <Header title={`Hello ${profile.full_name?.split(" ")[0] || "there"}.`} subtitle="Your private workspace — designs, quotes and bookings." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Saved projects" value={projects?.length || 0} iconName="Folder" />
        <StatCard label="Open enquiries" value={(enquiries || []).filter((e) => e.status === "new").length} iconName="FileText" />
        <StatCard label="Surveys booked" value={surveys?.length || 0} iconName="Calendar" />
        <StatCard label="Quoted total" value={`£${total.toLocaleString()}`} iconName="DollarSign" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl">Recent designs</h2>
        <Link href="/dashboard/designer" className="flex items-center gap-1.5 text-sm font-medium bg-neutral-900 text-neutral-50 px-4 py-2 rounded-full hover:bg-neutral-800 transition">
          <Plus size={14} /> New design
        </Link>
      </div>
      {(projects?.length || 0) === 0 ? (
        <Link href="/dashboard/designer">
          <EmptyCard msg="No designs yet — start your first one." cta="Create a design" />
        </Link>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.slice(0, 6).map((p) => (
            <Link key={p.id} href={`/dashboard/designer?id=${p.id}`} className="bg-white border border-neutral-200 rounded-2xl p-4 text-left shadow-sm hover:border-neutral-900 transition group">
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
          ))}
        </div>
      )}
    </div>
  );
}

async function StaffOverview({ profile, supabase }) {
  const { data: enquiries = [] } = await supabase.from("enquiries").select("*");
  const { data: surveys = [] } = await supabase.from("surveys").select("*");
  const { data: projects = [] } = await supabase.from("projects").select("*");
  const { data: customers = [] } = await supabase.from("profiles").select("id").eq("role", "customer");

  return (
    <div>
      <Header title="Staff dashboard" subtitle={`Hi ${profile.full_name?.split(" ")[0]} — here's what needs attention.`} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="New enquiries" value={(enquiries || []).filter((e) => e.status === "new").length} iconName="FileText" />
        <StatCard label="Pending surveys" value={(surveys || []).filter((s) => s.status !== "completed").length} iconName="Calendar" />
        <StatCard label="Draft quotes" value={(projects || []).filter((p) => p.status === "draft").length} iconName="Wrench" />
        <StatCard label="Active customers" value={customers?.length || 0} iconName="Users" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <QuickLinkCard href="/dashboard/enquiries" title="Enquiries inbox" desc={`${(enquiries || []).filter((e) => e.status === "new").length} awaiting response`} iconName="FileText" />
        <QuickLinkCard href="/dashboard/surveys" title="Survey bookings" desc="Confirm and schedule site visits" iconName="Calendar" />
      </div>
    </div>
  );
}

async function AdminOverview({ profile, supabase }) {
  const { data: users = [] } = await supabase.from("profiles").select("id");
  const { data: projects = [] } = await supabase.from("projects").select("id");
  const { data: enquiries = [] } = await supabase.from("enquiries").select("*");
  const { data: surveys = [] } = await supabase.from("surveys").select("id");

  return (
    <div>
      <Header title="Admin overview" subtitle={`Welcome, ${profile.full_name?.split(" ")[0]} — full platform control.`} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total users" value={users?.length || 0} iconName="Users" />
        <StatCard label="All projects" value={projects?.length || 0} iconName="Folder" />
        <StatCard label="Open enquiries" value={(enquiries || []).filter((e) => e.status === "new").length} iconName="FileText" />
        <StatCard label="Surveys booked" value={surveys?.length || 0} iconName="Calendar" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <QuickLinkCard href="/dashboard/admin/users" title="Manage users" desc="Create, edit, disable accounts" iconName="Users" />
        <QuickLinkCard href="/dashboard/admin/products" title="Products & profiles" desc="Windows, doors, materials, colours" iconName="Package" />
        <QuickLinkCard href="/dashboard/admin/pricing" title="Pricing logic" desc="Base prices, multipliers, upgrades" iconName="DollarSign" />
        <QuickLinkCard href="/dashboard/enquiries" title="Enquiries inbox" desc="Respond to customer queries" iconName="FileText" />
      </div>
    </div>
  );
}
