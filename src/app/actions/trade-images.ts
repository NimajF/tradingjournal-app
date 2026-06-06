"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

export async function uploadTradeImage(tradeId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const file = formData.get("file") as File | null;
  if (!file) return { error: "No file provided", data: null };

  let cloudinary: { url: string; public_id: string };
  try {
    cloudinary = await uploadImage(file);
  } catch (e) {
    return { error: (e as Error).message, data: null };
  }

  const { data, error } = await supabase
    .from("trade_images")
    .insert({
      trade_id: tradeId,
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

export async function deleteTradeImage(tradeImageId: string, publicId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  try {
    await deleteImage(publicId);
  } catch (e) {
    return { error: (e as Error).message };
  }

  const { error } = await supabase
    .from("trade_images")
    .delete()
    .eq("id", tradeImageId);

  if (error) return { error: error.message };
  return { error: null };
}

export async function getTradeImages(tradeId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("trade_images")
    .select("*")
    .eq("trade_id", tradeId)
    .order("created_at", { ascending: true });

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}
