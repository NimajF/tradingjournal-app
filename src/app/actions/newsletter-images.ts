"use server";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import { uploadNewsletterContentImage, deleteImage } from "@/lib/cloudinary";

async function assertNewsletterOwnership(
  supabase: Awaited<ReturnType<typeof createClient>>,
  newsletterId: string,
  userId: string,
) {
  const { data } = await supabase
    .from("newsletters")
    .select("id")
    .eq("id", newsletterId)
    .eq("user_id", userId)
    .single();
  if (!data) throw new Error("Newsletter not found");
}

export async function uploadNewsletterImage(newsletterId: string, file: File) {
  const user = await requireUser();
  const supabase = await createClient();

  try {
    await assertNewsletterOwnership(supabase, newsletterId, user.id);
  } catch (e) {
    return { error: (e as Error).message, data: null };
  }

  let cloudinary: { url: string; public_id: string };
  try {
    cloudinary = await uploadNewsletterContentImage(file, {
      userId: user.id,
      newsletterId,
    });
  } catch (e) {
    return { error: (e as Error).message, data: null };
  }

  const { data, error } = await supabase
    .from("newsletter_images")
    .insert({
      newsletter_id: newsletterId,
      cloudinary_url: cloudinary.url,
      public_id: cloudinary.public_id,
    })
    .select()
    .single();

  if (error) {
    await deleteImage(cloudinary.public_id).catch(() => {});
    return { error: error.message, data: null };
  }

  return { error: null, data };
}

export async function deleteNewsletterImage(
  newsletterImageId: string,
  publicId: string,
) {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: newsletterImage } = await supabase
    .from("newsletter_images")
    .select("id, newsletter_id, public_id")
    .eq("id", newsletterImageId)
    .single();

  if (!newsletterImage) return { error: "Newsletter image not found" };

  try {
    await assertNewsletterOwnership(
      supabase,
      newsletterImage.newsletter_id,
      user.id,
    );
  } catch (e) {
    return { error: (e as Error).message };
  }

  try {
    await deleteImage(newsletterImage.public_id);
  } catch (e) {
    return { error: (e as Error).message };
  }

  const { error } = await supabase
    .from("newsletter_images")
    .delete()
    .eq("id", newsletterImageId);

  if (error) return { error: error.message };
  return { error: null };
}
