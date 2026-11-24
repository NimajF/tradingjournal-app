"use server";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  CreateNewsletterInput,
  UpdateNewsletterInput,
} from "@/lib/types/newsletter";
import { sanitizeNoteContent } from "@/lib/utils/noteContent";
import {
  uploadNewsletterCoverImage as uploadCoverToCloudinary,
  deleteImage,
} from "@/lib/cloudinary";

export async function createNewsletter(input: CreateNewsletterInput) {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("newsletters")
    .insert({ ...input, user_id: user.id, content: null })
    .select()
    .single();
  if (error) return { error: error.message, data: null };
  return { data, error: null };
}

export async function getNewsletters() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("newsletters")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}

// Wrapped in React's cache() so calling it from both generateMetadata and the
// page component in the same request only hits Supabase once.
export const getNewsletterById = cache(async (id: string) => {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("newsletters")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) return { error: error.message, data: null };
  return { data, error: null };
});

export async function updateNewsletter(
  id: string,
  input: UpdateNewsletterInput,
) {
  const user = await requireUser();
  const supabase = await createClient();

  const sanitizedData: UpdateNewsletterInput = { ...input }; // store a copy of the input to avoid mutating the original object
  if (sanitizedData.content != null) {
    sanitizedData.content = sanitizeNoteContent(sanitizedData.content);
  }

  const { data, error } = await supabase
    .from("newsletters")
    .update({ ...sanitizedData, user_id: user.id })
    .eq("id", id)
    .select()
    .single();

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}

export async function getNewslettersCount() {
  const user = await requireUser();
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("newsletters")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) return { error: error.message, data: null };
  return { data: count ?? 0, error: null };
}

// The Settings export picker only has to name and date each newsletter.
// getNewsletters() selects "*", which would drag every body's HTML along.
export async function getNewsletterExportOptions() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from("newsletters")
    .select("id, title, created_at, is_favorite")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getFavoriteNewsletters() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from("newsletters")
    .select("id, title")
    .eq("is_favorite", true)
    .eq("user_id", user.id);

  return data ?? [];
}

export async function uploadNewsletterCoverImage(
  newsletterId: string,
  formData: FormData,
) {
  const user = await requireUser();
  const supabase = await createClient();

  const file = formData.get("file") as File | null;
  if (!file) return { error: "No file provided", data: null };

  let cloudinary: { url: string; public_id: string };
  try {
    cloudinary = await uploadCoverToCloudinary(file, {
      userId: user.id,
      newsletterId,
    });
  } catch (e) {
    return { error: (e as Error).message, data: null };
  }
  const { error } = await supabase
    .from("newsletters")
    .update({
      cover_image_url: cloudinary.url,
      cover_image_public_id: cloudinary.public_id,
    })

    .eq("id", newsletterId)
    .eq("user_id", user.id);
  if (error) {
    await deleteImage(cloudinary.public_id).catch(() => {});
    return { error: error.message, data: null };
  }
  return {
    error: null,
    data: { url: cloudinary.url, publicId: cloudinary.public_id },
  };
}

export async function deleteNewsletterCoverImage(newsletterId: string) {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: newsletter } = await supabase
    .from("newsletters")
    .select("cover_image_public_id")
    .eq("id", newsletterId)
    .eq("user_id", user.id)
    .single();

  if (!newsletter?.cover_image_public_id)
    return { error: "No image to delete" };

  try {
    await deleteImage(newsletter.cover_image_public_id);
  } catch (e) {
    return { error: (e as Error).message };
  }

  const { error } = await supabase
    .from("newsletters")
    .update({ cover_image_url: null, cover_image_public_id: null })
    .eq("id", newsletterId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { error: null };
}

export async function toggleNewsletterPublic(id: string, isPublic: boolean) {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("newsletters")
    .update({ is_public: isPublic })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id, is_public")
    .single();

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}

export async function deleteNewsletter(id: string) {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: newsletter, error: fetchError } = await supabase
    .from("newsletters")
    .select("cover_image_public_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (fetchError || !newsletter) return { error: "Newsletter not found" };

  // Read the file ids now. Cascade removes these rows with the newsletter.
  const { data: contentImages } = await supabase
    .from("newsletter_images")
    .select("public_id")
    .eq("newsletter_id", id);

  const publicIds = [
    ...(newsletter.cover_image_public_id
      ? [newsletter.cover_image_public_id]
      : []),
    ...(contentImages ?? []).map((img) => img.public_id),
  ];

  // Database first. If fails, nothing was touched on Cloudinary.
  const { error } = await supabase
    .from("newsletters")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  // Best effort: an orphaned file is harmless, a failed delete shouldnt
  // block user.
  if (publicIds.length) {
    await Promise.allSettled(publicIds.map((pid) => deleteImage(pid)));
  }

  revalidatePath("/newsletters");
  redirect("/newsletters");
}
