"use server";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  CreateJournalInput,
  JournalWithTradeCount,
  UpdateJournalInput,
} from "@/lib/types/journal";
import type { Trade } from "@/lib/types/trade";
import { deleteTradesBulk } from "@/app/actions/trade";

export async function createJournal(input: CreateJournalInput) {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("journals")
    .insert({ ...input, user_id: user.id })
    .select()
    .single();

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}

export async function getJournals() {
  const user = await requireUser();
  const supabase = await createClient();

  // Three narrow columns per trade: enough for the card to summarise a
  // journal (activity, what's traded, result split) without a second query.
  const { data, error } = await supabase
    .from("journals")
    .select("*, trades(date, symbol, result)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) return { error: error.message, data: null };
  const journals: JournalWithTradeCount[] = (data ?? []).map(
    ({ trades, ...j }) => {
      const rows = (trades ?? []) as Pick<
        Trade,
        "date" | "symbol" | "result"
      >[];
      const bySymbol = new Map<string, number>();
      let wins = 0;
      let losses = 0;
      let breakevens = 0;
      let lastTradeDate: string | null = null;

      for (const t of rows) {
        if (t.result === "win") wins++;
        else if (t.result === "loss") losses++;
        else breakevens++;
        bySymbol.set(t.symbol, (bySymbol.get(t.symbol) ?? 0) + 1);
        if (!lastTradeDate || t.date > lastTradeDate) lastTradeDate = t.date;
      }

      return {
        ...j,
        trade_count: rows.length,
        wins,
        losses,
        breakevens,
        last_trade_date: lastTradeDate,
        symbols: [...bySymbol.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(([s]) => s),
      };
    },
  );
  return { data: journals, error: null };
}

// Wrapped in React's cache() so calling it from both generateMetadata and the
// page component in the same request only hits Supabase once.
export const getJournalById = cache(async (journalId: string) => {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("journals")
    .select("*")
    .eq("id", journalId)
    .eq("user_id", user.id)
    .single();

  if (error) return { error: error.message, data: null };
  return { data, error: null };
});

export async function updateJournal(
  journalId: string,
  input: UpdateJournalInput,
) {
  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("journals")
    .update(input)
    .eq("id", journalId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { error: null };
}

export async function createJournalAndRedirect(
  _prevState: { error: string | null },
  formData: FormData,
) {
  const name = formData.get("name") as string;
  if (!name?.trim()) return { error: "Name is required" };

  const { data, error } = await createJournal({ name: name.trim() });
  if (error) return { error };

  redirect(`/journals/${data!.id}`);
}

export async function getJournalsCount() {
  const user = await requireUser();
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("journals")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);
  if (error) return { error: error.message, data: null };
  return { data: count ?? 0, error: null };
}

export async function getFavoriteJournals() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from("journals")
    .select("id, name")
    .eq("is_favorite", true)
    .eq("user_id", user.id);

  return data ?? [];
}

export async function toggleFavoriteJournal(journalId: string, value: boolean) {
  const result = await updateJournal(journalId, { is_favorite: value });
  if (result.error) return { error: result.error };
  revalidatePath("/journals");
  return { error: null };
}

export async function deleteJournal(journalId: string) {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: trades, error: tradesError } = await supabase
    .from("trades")
    .select("id")
    .eq("journal_id", journalId)
    .eq("user_id", user.id);
  if (tradesError) return { error: tradesError.message };

  if (trades?.length) {
    const result = await deleteTradesBulk(trades.map((t) => t.id));
    if (result.error) return { error: result.error };
  }

  const { error } = await supabase
    .from("journals")
    .delete()
    .eq("id", journalId)
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/journals");
  redirect("/journals");
}
