"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { FavoriteJournal } from "@/lib/types/journal";
import type { FavoriteNewsletter } from "@/lib/types/newsletter";
import { NotebookPen, Newspaper, Settings } from "lucide-react";

type FavoriteItem = { id: string; label: string };

export default function SidebarNavClient({
  favoriteJournals,
  favoriteNewsletters,
  showLabels = false,
}: {
  favoriteJournals: FavoriteJournal[];
  favoriteNewsletters: FavoriteNewsletter[];
  showLabels?: boolean;
}) {
  const pathname = usePathname();

  const NAV_ITEMS = [
    {
      href: "/journals",
      label: "Journals",
      icon: NotebookPen,
      favorites: favoriteJournals.map((j) => ({ id: j.id, label: j.name })),
      favoriteHref: (id: string) => `/journals/${id}`,
    },
    {
      href: "/newsletters",
      label: "Newsletters",
      icon: Newspaper,
      favorites: favoriteNewsletters.map((n) => ({ id: n.id, label: n.title })),
      favoriteHref: (id: string) => `/newsletters/${id}`,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      favorites: [] as FavoriteItem[],
      favoriteHref: (id: string) => "",
    },
  ];

  return (
    <nav className="space-y-0.5" aria-label="Primary">
      {showLabels && (
        <p className="label-micro px-3 pb-2 whitespace-nowrap">
          Workspace
        </p>
      )}
      {NAV_ITEMS.map(({ href, label, icon: Icon, favorites, favoriteHref }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <div key={href}>
            <Link
              key={href}
              href={href}
              data-active={active}
              aria-current={active ? "page" : undefined}
              className="nav-link flex items-center gap-2.5 px-3 py-2 rounded-md text-sm"
            >
              <Icon
                size={15}
                strokeWidth={active ? 2.25 : 1.75}
                className="shrink-0"
              />
              <span
                className={`whitespace-nowrap transition-opacity duration-(--dur-2) ${
                  showLabels ? "opacity-100" : "opacity-0"
                }`}
              >
                {label}
              </span>
            </Link>
            {showLabels && favorites.length > 0 && (
              <div className="mt-0.5 mb-1 ml-[1.6rem] space-y-0.5 border-l border-border-muted pl-2.5">
                {favorites.map((fav) => {
                  const favHref = favoriteHref(fav.id);
                  const favActive = pathname === favHref;
                  return (
                    <Link
                      key={fav.id}
                      href={favHref}
                      aria-current={favActive ? "page" : undefined}
                      className={`relative block rounded px-2 py-1 text-xs transition-colors duration-(--dur-2) ${
                        favActive
                          ? // The current child lights its own segment of the tree line.
                            "text-accent-muted-fg font-medium before:absolute before:-left-2.75 before:inset-y-1 before:w-px before:bg-accent"
                          : "text-muted-fg hover:text-foreground hover:bg-hover"
                      }`}
                    >
                      <span className="block truncate">{fav.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
