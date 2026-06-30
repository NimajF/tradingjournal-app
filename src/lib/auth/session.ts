import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const requireUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");
  return user;
});

export const getCurrentUser = cache(async () => {
  const user = await getOptionalUser();
  if (!user) redirect("/login");
  return user;
});

export const getOptionalUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url")
    .eq("id", user.id)
    .single();
  return {
    id: user.id,
    email: user.email ?? "",
    username: profile?.username ?? null,
    avatarUrl: profile?.avatar_url ?? null,
    emailConfirmedAt: user.email_confirmed_at,
  };
});
