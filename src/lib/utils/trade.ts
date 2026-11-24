import { Trade } from "@/lib/types/trade";

// Single source of truth for how a trade is labeled when it has no custom
// title — used by the breadcrumb, the live tab-title sync, and the SSR
// metadata for the trade detail page, so all three never drift apart.
export function getTradeDisplayTitle(
  trade: Pick<Trade, "title" | "symbol">,
): string {
  return trade.title || trade.symbol || "Trade";
}
