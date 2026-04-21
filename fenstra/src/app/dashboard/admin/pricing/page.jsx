import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminPricingClient } from "./client";

export default async function AdminPricingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");
  return <AdminPricingClient />;
}
