"use client";

import StyledSelect, { type SelectOption } from "@/app/components/StyledSelect";
import { Search, X } from "lucide-react";

// The list toolbar is a row of controls that sits above a list. It has a search, a filter, and a sort. The search is an input that takes the row, the filter is a select that filters the list, and the sort is a select that sorts the list. All three controls are visible, nothing hides in a menu. All three controls are 36px tall so the row reads as one line.
export type FilterOption<F extends string> = { value: F; label: string };

type ListToolbarProps<F extends string, S extends string> = {
  query: string;
  onQueryChange: (query: string) => void;
  searchPlaceholder: string;
  filter: F;
  filterOptions: FilterOption<F>[];
  onFilterChange: (filter: F) => void;
  sort: S;
  sortOptions: SelectOption[];
  onSortChange: (sort: S) => void;
};

// Vercel's list toolbar. The search takes the row, a quick filter and the
// sort sit beside it. Every control is visible, nothing hides in a menu.
// All three are 36px tall so the row reads as one line.
export default function ListToolbar<F extends string, S extends string>({
  query,
  onQueryChange,
  searchPlaceholder,
  filter,
  filterOptions,
  onFilterChange,
  sort,
  sortOptions,
  onSortChange,
}: ListToolbarProps<F, S>) {
  return (
    <div role="search" className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-0 flex-1 basis-64">
        <Search
          size={14}
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle-fg"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && query) {
              e.preventDefault();
              onQueryChange("");
            }
          }}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="h-9 w-full border pl-9 pr-9 text-[13px] text-foreground placeholder:text-subtle-fg [&::-webkit-search-cancel-button]:appearance-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-subtle-fg hover:bg-hover hover:text-foreground motion-safe:transition-colors motion-safe:duration-150"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div
        role="group"
        aria-label="Filter"
        className="flex items-center gap-0.5 rounded-(--radius-btn) border border-border bg-surface-inset p-0.5"
      >
        {filterOptions.map((opt) => {
          const active = opt.value === filter;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onFilterChange(opt.value)}
              aria-pressed={active}
              className={[
                "h-7.5 rounded-xs px-3 text-[13px] motion-safe:transition-colors motion-safe:duration-150",
                active
                  ? "bg-surface-raised text-foreground shadow-(--shadow-xs)"
                  : "text-muted-fg hover:text-foreground",
              ].join(" ")}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <StyledSelect
        value={sort}
        options={sortOptions}
        onChange={(v) => onSortChange(v as S)}
      />
    </div>
  );
}
