import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminUsersClient } from "./client";

export default async function AdminUsersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: users = [] } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  return <AdminUsersClient initialUsers={users || []} currentUserId={user.id} />;
}
