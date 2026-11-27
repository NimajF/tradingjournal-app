"use server";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import {
  validateUsername,
  validateAvatarFile,
} from "@/lib/validations/validations";
import { uploadUserAvatar, deleteImage } from "@/lib/cloudinary";

export async function uploadProfileImage(formData: FormData) {
  const user = await requireUser();
  const supabase = await createClient();

  const file = formData.get("file") as File | null;
  if (!file) return { error: "No file provided", data: null };

  const fileError = validateAvatarFile(file);
  if (fileError) return { error: fileError, data: null };

  let cloudinary: { url: string; public_id: string };
  try {
    cloudinary = await uploadUserAvatar(file, user.id);
  } catch (e) {
    console.error("Avatar upload failed:", e);
    return { error: "Couldn't upload the image. Try again.", data: null };
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
    console.error("Update failed:", error);
    return { error: "Couldn't save the image. Try again.", data: null };
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
    console.error("Avatar delete failed:", e);
    return { error: "Couldn't remove the image. Try again." };
  }
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: null, avatar_public_id: null })
    .eq("id", user.id);

  if (error) {
    console.error("Update failed:", error);
    return { error: "Couldn't remove the image. Try again." };
  }
  revalidatePath("/settings");
  return { error: null };
}

export async function updateUsername(value: string) {
  const user = await requireUser();

  const username = value.trim().toLowerCase();
  const validationError = validateUsername(username);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", user.id);

  if (error) {
    // code 23505 is a unique constraint violation, which means the username is already taken
    if (error.code === "23505") return { error: "Username already taken" };
    return { error: "Couldn't save username" };
  }
  revalidatePath("/settings");
  return { error: null };
}

export async function updateDisplayName(value: string) {
  const user = await requireUser();

  const displayName = value.trim();
  if (displayName.length > 50)
    return { error: "Display name must be 50 characters or fewer" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName || null })
    .eq("id", user.id);

  if (error) return { error: "Couldn't save display name" };

  revalidatePath("/settings");
  return { error: null };
}
