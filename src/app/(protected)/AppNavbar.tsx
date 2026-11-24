"use client";

import { useNav } from "@/lib/nav/nav-context";
import type { CurrentUser } from "@/lib/types/user";
import Link from "next/link";
import UserMenu from "@/app/components/Layout/UserMenu";
import { Menu, NotebookPen, Newspaper, Settings } from "lucide-react";

// Same glyphs as the rail, so the crumb and the nav item read as one place.
const SECTION_ICONS = {
  "/journals": NotebookPen,
  "/newsletters": Newspaper,
  "/settings": Settings,
} as const;

// The way back speaks in the action hue: colour marks where you can go,
// the current page (the chip) stays in ink.
const CRUMB_LINK =
  "rounded-md px-1.5 py-0.5 text-sm text-accent-muted-fg transition-colors duration-150 hover:bg-hover hover:text-foreground";

function Separator() {
  return (
    <span aria-hidden className="text-accent-muted-fg/45 select-none text-sm">
      /
    </span>
  );
}

type NavbarProps = {
  user: CurrentUser | null;
  onMenuClick?: () => void;
};

export default function AppNavbar({ user, onMenuClick }: NavbarProps) {
  const { breadcrumbs, section } = useNav();
  const SectionIcon = section
    ? SECTION_ICONS[section.href as keyof typeof SECTION_ICONS]
    : null;

  return (
    // A floating bordered card beside the rail, not a strip of a panel.
    <header className="relative z-50 shrink-0 mx-2 mt-2 rounded-2xl border border-border bg-surface">
      <div>
        <div className="flex h-13 items-center justify-between px-3 sm:px-4">
          {/* Left: brand + section */}
          <div className="flex items-center gap-2.5">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="md:hidden flex items-center justify-center size-9 rounded-md text-muted-fg hover:bg-hover hover:text-foreground transition-colors duration-150"
                aria-label="Open menu"
              >
                <Menu size={18} aria-hidden />
              </button>
            )}
  
            {/* The mark lives on the rail; the header only repeats it on
                mobile, where the rail is hidden. From md up the header is
                pure path: muted crumbs, the current one in full ink. No box —
                the page title right below already says where you are. */}
            <Link
              href="/journals"
              className="flex items-center gap-2 select-none"
            >
              <span className="md:hidden flex h-5.5 w-5.5 items-center justify-center rounded-[5px] bg-accent text-accent-fg text-[10px] font-bold tracking-tight shrink-0">
                TJ
              </span>
              <span
                className="hidden sm:block rounded-md px-1.5 py-0.5 text-sm text-subtle-fg"
              >
                My Workspace
              </span>
            </Link>
  
            {section && (
              <nav
                aria-label="Breadcrumb"
                data-slot="app-breadcrumbs"
                className="hidden sm:flex items-center gap-1 min-w-0"
              >
                <Separator />
                <Link
                  href={section.href}
                  className={`${CRUMB_LINK} inline-flex items-center gap-1.5 shrink-0`}
                >
                  {SectionIcon && (
                    <SectionIcon
                      size={14}
                      className={breadcrumbs.length === 0 ? "text-accent" : ""}
                      aria-hidden
                    />
                  )}
                  {section.label}
                </Link>

                {breadcrumbs.map((crumb, i) => {
                  const isLast = i === breadcrumbs.length - 1;
                  return (
                    <div key={i} className="flex items-center gap-1 min-w-0">
                      <Separator />
                      {isLast ? (
                        // The current page is the only crumb with a body: a
                        // quiet chip, so the eye lands on "you are here".
                        <span
                          aria-current="page"
                          className="truncate max-w-56 rounded-md border border-accent/20 bg-selected px-2 py-0.5 text-sm font-medium text-foreground"
                        >
                          {crumb.label}
                        </span>
                      ) : crumb.href ? (
                        <Link
                          href={crumb.href}
                          className={`${CRUMB_LINK} truncate max-w-48`}
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="text-sm text-muted-fg truncate max-w-48 px-1.5">
                          {crumb.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </nav>
            )}
          </div>
  
          {/* Right: user menu */}
          {user && (
            <UserMenu
              email={user.email}
              username={user.username}
              avatarUrl={user.avatarUrl}
            />
          )}
        </div>
      </div>
    </header>
  );
}
