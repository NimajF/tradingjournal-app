"use server";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { uploadUserAvatar, deleteImage } from "@/lib/cloudinary";

export async function uploadProfileImage(formData: FormData) {
  const user = await requireUser();
  const supabase = await createClient();

  const file = formData.get("file") as File | null;
  if (!file) return { error: "No file provided", data: null };

  let cloudinary: { url: string; public_id: string };
  try {
    cloudinary = await uploadUserAvatar(file, user.id);
  } catch (e) {
    return { error: (e as Error).message, data: null };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      avatar_url: cloudinary.url,
      avatar_public_id: cloudinary.public_id,
    })
    .eq("id", user.id);

  if (error) {
    await deleteImage(cloudinary.public_id).catch(() => {});
    return { error: error.message, data: null };
  }
  revalidatePath("/settings");
  return { error: null, data: { url: cloudinary.url } };
}

export async function deleteProfileImage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_public_id")
    .eq("id", user.id)
    .single();

  if (!profile?.avatar_public_id) return { error: "No image to delete" };

  try {
    await deleteImage(profile.avatar_public_id);
  } catch (e) {
    return { error: (e as Error).message };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: null, avatar_public_id: null })
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/settings");
  return { error: null };
}
