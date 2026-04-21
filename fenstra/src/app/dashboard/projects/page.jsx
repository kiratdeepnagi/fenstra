import { createClient } from "@/lib/supabase/server";
import { ProjectsClient } from "./client";

export default async function ProjectsPage() {
  const supabase = createClient();
  const { data: projects = [] } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
  return <ProjectsClient initialProjects={projects || []} />;
}
