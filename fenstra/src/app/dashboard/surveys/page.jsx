import { createClient } from "@/lib/supabase/server";
import { SurveysClient } from "./client";

export default async function SurveysPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  const { data: surveys = [] } = await supabase.from("surveys").select("*").order("survey_date", { ascending: true });
  const { data: projects = [] } = await supabase.from("projects").select("id, name, user_id");

  let customers = {};
  if (profile?.role !== "customer") {
    const { data: profs = [] } = await supabase.from("profiles").select("id, full_name, email, phone");
    customers = Object.fromEntries((profs || []).map((p) => [p.id, p]));
  }

  return (
    <SurveysClient
      initialSurveys={surveys || []}
      projects={projects || []}
      customers={customers}
      role={profile?.role}
      userId={user.id}
    />
  );
}
