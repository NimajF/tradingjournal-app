"use server";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const getPublicNewsletterById = cache(async (id: string) => {
  // cached so calling it from both generateMetadata and the page component in the same request only calls Supabase once.
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("newsletters")
    .select("id, title, description, content, cover_image_url, created_at")
    .eq("id", id)
    .eq("is_public", true)
    .single();

  if (error) return { error: error.message, data: null };
  return { data, error: null };
});
