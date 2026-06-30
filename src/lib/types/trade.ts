import { NoteContent } from "./note";

export type Direction = "long" | "short";
export type TradeResult = "win" | "loss" | "breakeven";
export type TradeKind = "impulsive" | "doubtful" | "clear";

export type Trade = {
  id: string;
  user_id: string;
  journal_id: string | null;
  created_at: string;
  title: string | null;
  date: string;
  symbol: string;
  direction: Direction;
  entry_price: number | null;
  exit_price: number | null;
  quantity: number | null;
  currency: string;
  profit: number;
  result: TradeResult;
  type: TradeKind;
  notes: NoteContent | null;
};

export type TradeImage = {
  id: string;
  trade_id: string;
  cloudinary_url: string;
  public_id: string;
  created_at: string;
};

// export type TipTapContent = {
//   type: "doc";
//   content: Record<string, unknown>[];
// };

export type RegisterTradeInput = {
  journal_id: string | null;
  date: string;
  symbol: string;
  direction: Direction;
  profit: number;
  entry_price?: number | null;
  exit_price?: number | null;
  quantity?: number | null;
  currency: string;
  trade_type: TradeKind;
};

export type UpdateTradeInput = {
  title?: string | null;
  date?: string;
  symbol?: string;
  direction?: Direction;
  result?: TradeResult;
  profit?: number;
  entry_price?: number | null;
  exit_price?: number | null;
  quantity?: number | null;
  currency?: string;
  trade_type?: TradeKind;
  notes?: NoteContent | null;
};

export type TradesProps = Trade[] | [];
