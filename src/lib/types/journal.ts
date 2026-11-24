import { Trade } from "./trade";
export type Journal = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_favorite: boolean;
  created_at: string;
};
export type JournalWithTradeCount = Journal & {
  trade_count: number;
  wins: number;
  losses: number;
  breakevens: number;
  last_trade_date: string | null;
  /** Every symbol traded in the journal, most traded first. */
  symbols: string[];
};

export type JournalsListProps = {
  journals: JournalWithTradeCount[];
};

export type CreateJournalInput = {
  name: string;
  description?: string | null;
};

export type UpdateJournalInput = {
  name?: string;
  description?: string | null;
  is_favorite?: boolean;
};

export type JournalClientPops = {
  trades: Trade[];
  journalId: string;
  journalName: string;
  description: string | null;
  isFavorite: boolean;
};

export type FavoriteJournal = { id: string; name: string };
