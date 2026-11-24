"use server";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import { uploadTradeNoteImage, deleteImage } from "@/lib/cloudinary";

async function assertTradeOwnership(
  supabase: Awaited<ReturnType<typeof createClient>>,
  tradeId: string,
  userId: string,
) {
  const { data } = await supabase
    .from("trades")
    .select("id")
    .eq("id", tradeId)
    .eq("user_id", userId)
    .single();
  if (!data)
    throw new Error(
      "Trade not found or you do not have permission to modify it",
    );
}

export async function uploadTradeImage(tradeId: string, file: File) {
  const user = await requireUser();
  const supabase = await createClient();

  if (!file) return { error: "No file provided", data: null };

  try {
    await assertTradeOwnership(supabase, tradeId, user.id);
  } catch (e) {
    return { error: (e as Error).message, data: null };
  }

  let cloudinary: { url: string; public_id: string };
  try {
    cloudinary = await uploadTradeNoteImage(file, {
      userId: user.id,
      tradeId: tradeId,
    });
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

export async function getTradeImages(tradeId: string) {
  const user = await requireUser();
  const supabase = await createClient();
  try {
    await assertTradeOwnership(supabase, tradeId, user.id);
  } catch (e) {
    return { error: (e as Error).message, data: null };
  }

  const { data, error } = await supabase
    .from("trade_images")
    .select("*")
    .eq("trade_id", tradeId)
    .order("created_at", { ascending: true });

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}

export async function deleteTradeImage(tradeImageId: string, publicId: string) {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: tradeImage } = await supabase
    .from("trade_images")
    .select("id, trade_id, public_id")
    .eq("id", tradeImageId)
    .single();

  if (!tradeImage) return { error: "Trade image not found" };

  try {
    await assertTradeOwnership(supabase, tradeImage.trade_id, user.id);
  } catch (e) {
    return { error: (e as Error).message };
  }

  try {
    await deleteImage(tradeImage.public_id);
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
