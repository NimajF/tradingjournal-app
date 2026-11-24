"use client";

import { useState } from "react";
import Modal from "../components/Modal";
import { registerTrade } from "../actions/trade";
import StyledSelect, { DIRECTION_OPTIONS } from "../components/StyledSelect";
import { toDateKey } from "@/lib/utils/date";
import { X } from "lucide-react";

type Props = {
  onClose: () => void;
  defaultDate?: string; // optional prop to pre-fill the date field in the form, expected in "YYYY-MM-DD" format
  journalId: string;
};

export default function NewTradeFormModal({
  onClose,
  defaultDate,
  journalId,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [date, setDate] = useState<string>(
    () => defaultDate ?? toDateKey(new Date()), // default to today's date if no defaultDate prop is provided
  );
  const [symbol, setSymbol] = useState("");
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [profit, setProfit] = useState<number | "">("");
  const [entryPrice, setEntryPrice] = useState<number | "">("");
  const [exitPrice, setExitPrice] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");

  const pnlColor =
    profit === "" || profit === 0
      ? "text-foreground"
      : profit > 0
        ? "text-profit"
        : "text-loss";

  const onSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    const response = await registerTrade({
      date,
      symbol,
      direction,
      profit: Number(profit),
      entry_price: entryPrice === "" ? null : Number(entryPrice),
      exit_price: exitPrice === "" ? null : Number(exitPrice),
      quantity: quantity === "" ? null : Number(quantity),
      currency: "USD",
      trade_type: "clear",
      journal_id: journalId,
    });
    setIsSaving(false);
    if (response.error) {
      setError(response.error);
      return;
    }
    // router.refresh();
    onClose();
  };

  // Fields recess below the dialog to the page colour and keep a control
  // edge — the same field recipe as everywhere else (globals.css). 13px
  // keeps the value in proportion with the 12px label above it.
  const fieldCls =
    // Fill, edge, hover and focus come from the field tokens in globals.css.
    "w-full h-9 px-3 text-[13px] border rounded-md text-foreground placeholder:text-subtle-fg";
  const labelCls = "block text-[13px] font-medium text-foreground mb-1.5";

  return (
    <Modal onClose={onClose} titleId="new-trade-title">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="px-6 pt-5 flex items-start justify-between gap-4">
        <div>
          <h2
            data-slot="dialog-title"
            id="new-trade-title"
            className="text-[15px] font-semibold text-foreground tracking-tight"
          >
            New trade
          </h2>
          <p className="text-[13px] text-muted-fg mt-0.5">
            Record a completed trade in your journal
          </p>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="btn btn-icon shrink-0 mt-0.5"
        >
          <X size={15} strokeWidth={2} />
        </button>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <form onSubmit={onSubmit}>
        <div className="px-6 py-5 space-y-4">
          {/* Error */}
          {error && (
            <div className="px-3 py-2.5 rounded-md bg-loss-muted border border-loss/20 text-loss-muted-fg text-[13px]">
              {error}
            </div>
          )}

          {/* Row 1: Date · Symbol */}
          <div className="grid grid-cols-6 gap-3">
            <div className="col-span-2">
              <label className={labelCls}>Date</label>
              <input
                required
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={fieldCls}
              />
            </div>
            <div className="col-span-4">
              <label className={labelCls}>Symbol</label>
              <input
                required
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="e.g. BTCUSDT"
                className={fieldCls}
              />
            </div>
          </div>

          {/* Row 2: Side · PnL */}
          <div className="grid grid-cols-6 gap-3">
            <div className="col-span-2">
              <label className={labelCls}>Side</label>
              <StyledSelect
                value={direction}
                options={DIRECTION_OPTIONS}
                onChange={(v) => setDirection(v as "long" | "short")}
                variant="field"
              />
            </div>
            <div className="col-span-4">
              <label className={labelCls}>
                P&L{" "}
                <span className="font-mono text-[11px] text-subtle-fg">
                  USD
                </span>
              </label>
              <input
                required
                type="number"
                step="0.01"
                value={profit === "" ? "" : profit}
                onChange={(e) =>
                  setProfit(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="0.00"
                className={`${fieldCls} font-mono font-medium ${pnlColor}`}
              />
            </div>
          </div>

          {/* Row 3: Entry · Exit · Quantity */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>
                Entry price{" "}
                <span className="font-normal text-subtle-fg">optional</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={entryPrice === "" ? "" : entryPrice}
                onChange={(e) =>
                  setEntryPrice(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder="0.00"
                className={`${fieldCls} font-mono tabular-nums`}
              />
            </div>
            <div>
              <label className={labelCls}>
                Exit price{" "}
                <span className="font-normal text-subtle-fg">optional</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={exitPrice === "" ? "" : exitPrice}
                onChange={(e) =>
                  setExitPrice(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder="0.00"
                className={`${fieldCls} font-mono tabular-nums`}
              />
            </div>
            <div>
              <label className={labelCls}>
                Quantity{" "}
                <span className="font-normal text-subtle-fg">optional</span>
              </label>
              <input
                type="number"
                step="any"
                value={quantity === "" ? "" : quantity}
                onChange={(e) =>
                  setQuantity(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder="0"
                className={`${fieldCls} font-mono tabular-nums`}
              />
            </div>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        {/* The footer is its own band — a faint wash and the same 1px edge
              every panel in the app draws, not a whisper of a rule. */}
        <div className="mt-1 border-t border-border bg-(--field-bg) px-6 py-3.5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-muted btn-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-primary btn-sm"
          >
            {isSaving ? "Saving…" : "Save trade"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
