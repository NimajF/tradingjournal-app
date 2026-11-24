"use client";

import type { TocItem } from "@/lib/utils/newsletter";
import { useActiveHeading } from "@/lib/hooks/useActiveHeading";
import { ChevronDown } from "lucide-react";

type NewsletterTocProps = {
  items: TocItem[];
  /** rail -> Sticky column beside the article. inline -> collapsed block inside it. */
  variant?: "rail" | "inline";
  className?: string;
};

// Indent by depth relative to the shallowest heading present, so a piece
// written only in h2/h3 doesn't start one step in.
const INDENT = ["", "pl-3", "pl-6"];

function scrollToHeading(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return; // let browser handle the plain #hash
  e.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  // replace, not push. Jumping around a piece shouldn not fill Back history
  history.replaceState(null, "", `#${id}`);
}

function TocList({
  items,
  activeId,
}: {
  items: TocItem[];
  activeId: string | null;
}) {
  const minLevel = Math.min(...items.map((i) => i.level));
  return (
    <ul className="space-y-2 text-[13px] leading-[1.45]">
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <li key={item.id} className={INDENT[item.level - minLevel]}>
            <a
              href={`#${item.id}`}
              onClick={(e) => scrollToHeading(e, item.id)}
              aria-current={active ? "location" : undefined}
              className={[
                "block rounded-xs text-pretty outline-none",
                "focus-visible:ring-2 focus-visible:ring-(--accent-ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--view)",
                "motion-safe:transition-colors motion-safe:duration-150",
                active
                  ? "text-foreground"
                  : "text-muted-fg hover:text-foreground",
              ].join(" ")}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

// The docs-site "On this page".
function RailToc({ items, className }: Omit<NewsletterTocProps, "variant">) {
  const activeId = useActiveHeading(items.map((i) => i.id));
  return (
    <nav aria-label="On this page" className={className}>
      <p className="mb-3 text-[13px] font-medium text-foreground">
        On this page
      </p>
      {/* A long piece (a month of daily entries) outgrows the viewport;
          the rail scrolls on its own instead of running off-screen. */}
      <div className="max-h-[calc(100dvh-8rem)] overflow-y-auto overscroll-contain pb-2">
        <TocList items={items} activeId={activeId} />
      </div>
    </nav>
  );
}

// Narrow containers. Same outline, folded, between the byline and the
// body. Native <details> so it opens by keyboard with no state.
function InlineToc({ items, className }: Omit<NewsletterTocProps, "variant">) {
  return (
    <nav aria-label="On this page" className={className}>
      <details className="group rounded-lg border border-border-muted">
        <summary
          className={[
            "flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-4 py-3",
            "text-[13px] font-medium text-foreground outline-none [&::-webkit-details-marker]:hidden",
            "focus-visible:ring-2 focus-visible:ring-(--accent-ring)",
          ].join(" ")}
        >
          <span>
            On this page
            <span className="ml-2 font-mono text-xs tabular-nums text-subtle-fg">
              {items.length}
            </span>
          </span>
          <ChevronDown
            size={14}
            aria-hidden
            className="text-muted-fg motion-safe:transition-transform motion-safe:duration-150 group-open:rotate-180"
          />
        </summary>
        <div className="border-t border-border-muted px-4 py-3">
          <TocList items={items} activeId={null} />
        </div>
      </details>
    </nav>
  );
}

export default function NewsletterToc({
  variant = "rail",
  ...props
}: NewsletterTocProps) {
  return variant === "inline" ? (
    <InlineToc {...props} />
  ) : (
    <RailToc {...props} />
  );
}
