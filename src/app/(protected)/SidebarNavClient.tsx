"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { FavoriteJournal } from "@/lib/types/journal";
import { NotebookPen, Newspaper, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/journals", label: "Journal", icon: NotebookPen },
  { href: "/newsletters", label: "Newsletter", icon: Newspaper },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export default function SidebarNavClient({
  favorites,
  showLabels = false,
}: {
  favorites: FavoriteJournal[];
  showLabels?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav className="space-y-0.5">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={[
              "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors duration-150",
              active
                ? "bg-accent-muted text-accent-muted-fg font-medium"
                : "text-muted-fg hover:text-foreground hover:bg-surface-alt",
            ].join(" ")}
          >
            <Icon
              size={15}
              strokeWidth={active ? 2.25 : 1.75}
              className="shrink-0"
            />
            <span
              className={`whitespace-nowrap transition-opacity duration-150 ${
                showLabels ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
