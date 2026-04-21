import { createClient } from "@/lib/supabase/server";
import { EnquiriesClient } from "./client";

export default async function EnquiriesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  const { data: enquiries = [] } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });

  let customers = {};
  if (profile?.role !== "customer") {
    const { data: profs = [] } = await supabase.from("profiles").select("id, full_name, email, phone");
    customers = Object.fromEntries((profs || []).map((p) => [p.id, p]));
  }

  return <EnquiriesClient initialEnquiries={enquiries || []} role={profile?.role} customers={customers} />;
}
