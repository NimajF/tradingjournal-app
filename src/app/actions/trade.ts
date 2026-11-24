"use server";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import {
  RegisterTradeInput,
  UpdateTradeInput,
  TradeResult,
} from "@/lib/types/trade";
import { sanitizeNoteContent } from "@/lib/utils/noteContent";
import { deleteImage } from "@/lib/cloudinary";

export async function registerTrade(tradeData: RegisterTradeInput) {
  const user = await requireUser();
  const supabase = await createClient();

  const result: TradeResult =
    tradeData.profit > 0 ? "win" : tradeData.profit < 0 ? "loss" : "breakeven";

  const { error } = await supabase.from("trades").insert({
    ...tradeData,
    user_id: user.id,
    result,
    notes: null,
  });

  if (error) return { error: error.message };
  revalidatePath("/journals");
  return { error: null };
}

export async function getTrades(journalId?: string) {
  const user = await requireUser();
  const supabase = await createClient();

  let query = supabase
    .from("trades")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (journalId) {
    query = query.eq("journal_id", journalId);
  }

  const { data, error } = await query;

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}

export async function updateTrade(tradeId: string, data: UpdateTradeInput) {
  const user = await requireUser();
  const supabase = await createClient();

  const result: TradeResult | undefined =
    data.profit !== undefined
      ? data.profit > 0
        ? "win"
        : data.profit < 0
          ? "loss"
          : "breakeven"
      : undefined;

  const sanitizedData: UpdateTradeInput = { ...data };
  if (sanitizedData.notes != null) {
    sanitizedData.notes = sanitizeNoteContent(sanitizedData.notes);
  }
  const { error } = await supabase
    .from("trades")
    .update({ ...sanitizedData, ...(result !== undefined && { result }) })
    .eq("id", tradeId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/journals");
  return { error: null };
}

// Wrapped in React's cache() so calling it from both generateMetadata and the
// page component in the same request only hits Supabase once.
export const getTradeById = cache(async (tradeId: string) => {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .eq("id", tradeId)
    .eq("user_id", user.id)
    .single();

  if (error) return { error: error.message, data: null };
  return { data, error: null };
});

export async function deleteTradesBulk(tradeIds: string[]) {
  if (tradeIds.length === 0) return { error: null };
  const user = await requireUser();
  const supabase = await createClient();

  // 1. fetch images from these trades
  const { data: images } = await supabase
    .from("trade_images")
    .select("public_id")
    .in("trade_id", tradeIds);

  // 1. delete from cloud
  if (images?.length) {
    await Promise.allSettled(images.map((img) => deleteImage(img.public_id)));
  }

  // delete trades
  const { error } = await supabase
    .from("trades")
    .delete()
    .in("id", tradeIds)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { error: null };
}

export async function deleteTrade(tradeId: string) {
  return deleteTradesBulk([tradeId]);
}
