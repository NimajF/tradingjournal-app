"use client";

import { useMemo } from "react";
import ListToolbar, { type FilterOption } from "@/app/components/ListToolbar";
import type { SelectOption } from "@/app/components/StyledSelect";
import { useUrlState } from "@/lib/hooks/useUrlState";
import { matchesQuery } from "@/lib/utils/search";
import type { Newsletter, NewslettersListProps } from "@/lib/types/newsletter";
import Link from "next/link";
import { htmlToPlainText } from "@/lib/utils/newsletter";
import NewsletterCard from "@/app/(protected)/newsletters/_components/NewsletterCard";
import EmptyState from "@/app/components/EmptyState";
import { Plus } from "lucide-react";

const FILTERS = ["all", "public", "private", "favorites"] as const;
type NewsletterFilter = (typeof FILTERS)[number];
const FILTER_OPTIONS: FilterOption<NewsletterFilter>[] = [
  { value: "all", label: "All" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "favorites", label: "Favorites" },
];

const SORTS = ["newest", "oldest", "title"] as const;
type NewsletterSort = (typeof SORTS)[number];
const SORT_OPTIONS: SelectOption[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title", label: "Title A–Z" },
];

const SORTERS: Record<
  NewsletterSort,
  (a: Newsletter, b: Newsletter) => number
> = {
  newest: (a, b) => b.created_at.localeCompare(a.created_at),
  oldest: (a, b) => a.created_at.localeCompare(b.created_at),
  title: (a, b) =>
    a.title.localeCompare(b.title, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
};

// One predicate per filter: adding a filter is one line here, not a new if.
const FILTER_TESTS: Record<NewsletterFilter, (n: Newsletter) => boolean> = {
  all: () => true,
  public: (n) => n.is_public,
  private: (n) => !n.is_public,
  favorites: (n) => n.is_favorite,
};

export default function NewslettersList({ newsletters }: NewslettersListProps) {
  const [query, setQuery] = useUrlState<string>("q", "");
  const [filter, setFilter] = useUrlState<NewsletterFilter>(
    "filter",
    "all",
    FILTERS,
  );
  const [sort, setSort] = useUrlState<NewsletterSort>("sort", "newest", SORTS);

  // Stripping HTML is the expensive part, so it runs once per newsletter
  // when the list loads, not once per newsletter per keystroke.
  const searchText = useMemo(
    () =>
      new Map(
        newsletters.map((n) => [
          n.id,
          [n.title, n.description, htmlToPlainText(n.content ?? "")].join(" "),
        ]),
      ),
    [newsletters],
  );

  const visible = useMemo(
    () =>
      newsletters
        .filter(FILTER_TESTS[filter])
        .filter((n) => matchesQuery(query, [searchText.get(n.id)]))
        .sort(SORTERS[sort]),
    [newsletters, searchText, filter, query, sort],
  );

  const isFiltering = query !== "" || filter !== "all";
  const clearFilters = () => {
    setQuery("");
    setFilter("all");
  };
  if (newsletters.length === 0) {
    return (
      <div>
        <div className="mx-auto flex max-w-7xl items-center gap-3 pt-6 md:pt-8 pb-6">
          <h1 className="text-[1.875rem] text-foreground">Newsletters</h1>
        </div>
        <EmptyState
          title="Write your first newsletter"
          description="Turn your analysis into something you can read back or share: a weekly recap, a trade review, a lesson learned."
          actionHref="/newsletters/new"
          actionLabel="New newsletter"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 pt-6 md:pt-8 pb-6">
        <h1 className="text-[1.875rem] text-foreground">Newsletters</h1>
        <span className="chip font-mono tabular-nums bg-surface-alt text-muted-fg">
          {isFiltering
            ? `${visible.length} of ${newsletters.length}`
            : newsletters.length}
        </span>
        <Link
          href="/newsletters/new"
          className="btn btn-primary btn-sm ml-auto"
        >
          <Plus size={14} /> New newsletter
        </Link>
      </div>

      <div className="mx-auto max-w-7xl pb-8">
        <div className="pb-5">
          <ListToolbar
            query={query}
            onQueryChange={setQuery}
            searchPlaceholder="Search newsletters…"
            filter={filter}
            filterOptions={FILTER_OPTIONS}
            onFilterChange={setFilter}
            sort={sort}
            sortOptions={SORT_OPTIONS}
            onSortChange={setSort}
          />
        </div>
        {visible.length === 0 ? (
          <div className="flex flex-col items-center px-4 pt-20 pb-16 text-center">
            <h2 className="text-[15px] font-semibold text-foreground">
              No newsletters match
            </h2>
            <p className="mt-1.5 text-[13px] text-muted-fg">
              Try other words, or clear the filters.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="btn btn-muted btn-sm mt-4"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3.5">
            {visible.map((newsletter) => (
              <NewsletterCard key={newsletter.id} newsletter={newsletter} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
