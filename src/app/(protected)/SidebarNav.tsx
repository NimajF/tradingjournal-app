import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import SidebarNavClient from "./SidebarNavClient";

export default async function SidebarNav() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: favorites } = await supabase
    .from("journals")
    .select("id, name")
    .eq("is_favorite", true)
    .eq("user_id", user.id);

  return <SidebarNavClient favorites={favorites ?? []} />;
}
