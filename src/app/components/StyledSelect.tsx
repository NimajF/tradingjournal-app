"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowUp, ArrowDown, Check, X, Minus, ChevronDown } from "lucide-react";

export type SelectOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
  colorClass?: string;
};

export const DIRECTION_OPTIONS: SelectOption[] = [
  {
    value: "long",
    label: "Long",
    icon: <ArrowUp size={12} strokeWidth={2.5} />,
    // Side is a direction, not a verdict — neutral, like TradePositionBadge.
    colorClass: "text-foreground",
  },
  {
    value: "short",
    label: "Short",
    icon: <ArrowDown size={12} strokeWidth={2.5} />,
    colorClass: "text-foreground",
  },
];

export const RESULT_OPTIONS: SelectOption[] = [
  {
    value: "win",
    label: "Win",
    icon: <Check size={12} strokeWidth={2.5} />,
    colorClass: "text-profit",
  },
  {
    value: "loss",
    label: "Loss",
    icon: <X size={12} strokeWidth={2.5} />,
    colorClass: "text-loss",
  },
  {
    value: "breakeven",
    label: "Even",
    icon: <Minus size={12} strokeWidth={2.5} />,
    colorClass: "text-muted-fg",
  },
];

export const TRADE_KIND_OPTIONS: SelectOption[] = [
  { value: "impulsive", label: "Impulsive" },
  { value: "doubtful", label: "Doubtful" },
  { value: "clear", label: "Clear" },
];

type DropdownPos = { top: number; left: number; minWidth: number };

type Props = {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  variant?: "field" | "cell" | "inline";
  className?: string;
};

export default function StyledSelect({
  value,
  options,
  onChange,
  variant = "field",
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<DropdownPos | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) ?? options[0];

  const openDropdown = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 4,
      left: rect.left,
      minWidth: Math.max(rect.width, 120),
    });
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      const target = e.target as Node;
      const inTrigger = triggerRef.current?.contains(target);
      const inDropdown = dropdownRef.current?.contains(target);
      if (!inTrigger && !inDropdown) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const triggerCls =
    variant === "field"
      ? [
          "w-full h-9 flex items-center gap-2 px-3 py-2 text-[13px] rounded-md",
          // The field tokens, so a select and an input read as one family.
          "border border-(--field-border) bg-(--field-bg) hover:border-(--field-border-hover)",
          "transition-colors duration-100 cursor-pointer",
          selected.colorClass ?? "text-foreground",
        ].join(" ")
      : variant === "inline"
        ? [
            "inline-flex items-center gap-1.5 text-sm rounded-md px-2 py-1",
            "bg-transparent hover:bg-surface-overlay",
            "cursor-pointer transition-colors duration-150",
            selected.colorClass ?? "text-foreground",
          ].join(" ")
        : [
            // Cell: a compact field, so an edited table row is a row of
            // real controls instead of bare text with a hover underline.
            "w-full h-8 flex items-center gap-1.5 px-2 text-[13px] rounded-md",
            "border border-(--field-border) bg-(--field-bg) hover:border-(--field-border-hover)",
            "cursor-pointer transition-colors duration-100",
            selected.colorClass ?? "text-foreground",
          ].join(" ");

  const dropdown =
    open && pos && typeof document !== "undefined"
      ? createPortal(
          <div
            data-slot="select-popup"
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              minWidth: pos.minWidth,
              zIndex: 9999,
            }}
            className="panel bg-surface-overlay border border-border rounded-xl elevated-lg p-1 overflow-hidden"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={[
                    "w-full flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-foreground",
                    "transition-colors duration-150",
                    isSelected
                      ? "bg-surface-alt font-medium"
                      : "hover:bg-hover",
                  ].join(" ")}
                >
                  {opt.icon && (
                    <span
                      className={`shrink-0 w-4 flex items-center ${opt.colorClass ?? ""}`}
                    >
                      {opt.icon}
                    </span>
                  )}
                  <span className="flex-1 text-left">{opt.label}</span>
                  {isSelected && (
                    <Check
                      size={12}
                      className="ml-auto shrink-0 text-subtle-fg"
                    />
                  )}
                </button>
              );
            })}
          </div>,
          document.body,
        )
      : null;

  return (
    <div className={`relative ${className ?? ""}`}>
      <button
        data-slot="select-trigger"
        data-variant={variant}
        ref={triggerRef}
        type="button"
        onClick={openDropdown}
        className={triggerCls}
      >
        {selected.icon && <span className="shrink-0">{selected.icon}</span>}
        <span>{selected.label}</span>
        <ChevronDown
          size={11}
          strokeWidth={2}
          className={[
            "ml-auto shrink-0 opacity-40 transition-transform duration-100",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>
      {dropdown}
    </div>
  );
}
