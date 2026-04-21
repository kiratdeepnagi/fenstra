import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  return (
    <div className="min-h-screen flex">
      <Sidebar profile={profile} />
      <main className="flex-1 pt-14 md:pt-0 overflow-hidden">
        <div className="p-6 md:p-10 max-w-6xl mx-auto anim-fade">{children}</div>
      </main>
    </div>
  );
}
