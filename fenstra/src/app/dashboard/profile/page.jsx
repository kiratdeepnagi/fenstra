import { createClient } from "@/lib/supabase/server";
import { ProfileClient } from "./client";

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return <ProfileClient profile={profile} />;
}
