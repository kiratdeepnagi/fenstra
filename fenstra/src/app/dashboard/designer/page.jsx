import { createClient } from "@/lib/supabase/server";
import { DesignerClient } from "./client";

export default async function DesignerPage({ searchParams }) {
  const supabase = createClient();
  let initial = null;
  if (searchParams?.id) {
    const { data } = await supabase.from("projects").select("*").eq("id", searchParams.id).single();
    initial = data;
  }
  return <DesignerClient initial={initial} />;
}
