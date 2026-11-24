"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";

// The signature visual of the page — not a browser-chrome dashboard clone,
// just the ledger itself, big, real-shaped, bleeding past the bottom edge
// to imply the record keeps going.
const trades = [
  { date: "Sep 12", ticker: "AAPL", note: "Breakout above the June high", dir: "long" as const, pnl: "+2.4%", result: "win" as const },
  { date: "Sep 11", ticker: "SPY", note: "Failed reversal, cut early", dir: "short" as const, pnl: "-0.8%", result: "loss" as const },
  { date: "Sep 10", ticker: "NVDA", note: "AI momentum continuation", dir: "long" as const, pnl: "+5.1%", result: "win" as const },
  { date: "Sep 9", ticker: "TSLA", note: "Faded the gap, no follow-through", dir: "short" as const, pnl: "+1.2%", result: "win" as const },
  { date: "Sep 8", ticker: "MSFT", note: "Sized too big, exited flat", dir: "long" as const, pnl: "-0.3%", result: "loss" as const },
];

const EXPO = [0.16, 1, 0.3, 1] as const;

export default function Ledger() {
  const reduced = useReducedMotion();
  const d = (n: number) => (reduced ? 0 : n);

  return (
    <div className="lp-fade-bottom overflow-hidden rounded-2xl border border-border bg-surface">
      {/* Panel header — this is the whole chrome, no fake browser bar */}
      <div className="flex items-center justify-between border-b border-border-muted px-6 py-4 sm:px-8">
        <div>
          <p className="text-sm font-semibold text-foreground">Day Trading</p>
          <p className="text-xs text-muted-fg">142 trades logged</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-fg">
          + Add trade
          <span className="lp-kbd">C</span>
        </span>
      </div>

      {/* Column labels */}
      <div className="hidden items-center gap-4 px-6 pt-5 text-xs font-medium uppercase tracking-wide text-muted-fg sm:flex sm:px-8">
        <span className="w-14">Date</span>
        <span className="w-16">Symbol</span>
        <span className="flex-1">Note</span>
        <span className="w-20">Side</span>
        <span className="w-16 text-right">P&amp;L</span>
      </div>

      {/* Rows */}
      <div className="px-3 pb-10 sm:px-5">
        {trades.map((t, i) => (
          <motion.div
            key={t.ticker + i}
            className="flex flex-col gap-2 border-b border-border-muted px-3 py-4 last:border-b-0 sm:flex-row sm:items-center sm:gap-4 sm:px-3 sm:py-3.5"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: d(i * 0.06), duration: d(0.5), ease: EXPO }}
          >
            <span className="font-mono text-xs text-muted-fg sm:w-14">
              {t.date}
            </span>
            <span className="font-mono text-base font-semibold text-foreground sm:w-16">
              {t.ticker}
            </span>
            <span className="text-sm text-muted-fg sm:flex-1">{t.note}</span>
            <span
              className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium sm:w-20 ${
                t.dir === "long"
                  ? "bg-profit-muted text-profit-muted-fg"
                  : "bg-loss-muted text-loss-muted-fg"
              }`}
            >
              {t.dir === "long" ? (
                <ArrowUp size={10} strokeWidth={2.5} />
              ) : (
                <ArrowDown size={10} strokeWidth={2.5} />
              )}
              {t.dir === "long" ? "Long" : "Short"}
            </span>
            <span
              className={`font-mono text-sm font-semibold sm:w-16 sm:text-right ${
                t.pnl.startsWith("+") ? "text-profit" : "text-loss"
              }`}
            >
              {t.pnl}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
