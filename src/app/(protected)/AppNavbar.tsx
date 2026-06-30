"use client";

import { useNav } from "@/lib/nav/nav-context";
import type { CurrentUser } from "@/lib/types/user";
import { usePathname } from "next/navigation";
import Link from "next/link";
import UserMenu from "@/app/components/Layout/UserMenu";
import { Menu } from "lucide-react";

type NavbarProps = {
  user: CurrentUser | null;
  onMenuClick?: () => void;
};

export default function AppNavbar({ user, onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const { breadcrumbs } = useNav();

  const section = pathname.startsWith("/newsletter")
    ? { label: "Newsletter", href: "/newsletter" }
    : pathname.startsWith("/settings")
      ? { label: "Settings", href: "/settings" }
      : pathname.startsWith("/journals")
        ? { label: "Journals", href: "/journals" }
        : null;

  return (
    <header className="sticky top-0 z-50 border-b border-border glass">
      <div className="flex items-center justify-between px-3 sm:px-4 h-12">
        {/* Left: brand + section */}
        <div className="flex items-center gap-2.5">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="md:hidden flex items-center justify-center h-7 w-7 rounded text-muted-fg hover:bg-surface-alt hover:text-foreground transition-colors duration-150"
              aria-label="Open menu"
            >
              <Menu size={16} />
            </button>
          )}

          <Link
            href="/journals"
            className="flex items-center gap-2 select-none group"
          >
            <span className="flex h-5.5 w-5.5 items-center justify-center rounded-sm bg-accent text-accent-fg text-[10px] font-bold tracking-tight shrink-0">
              TJ
            </span>
            <span className="hidden sm:block text-sm font-semibold text-foreground transition-colors duration-150 group-hover:text-muted-fg">
              TradeJournal
            </span>
          </Link>

          {section && (
            <div className="hidden sm:flex items-center gap-2.5">
              <span className="text-subtle-fg select-none text-sm leading-none">
                |
              </span>
              <Link
                href={section.href}
                className="text-sm font-medium text-accent hover:text-accent-hover transition-colors duration-150"
              >
                {section.label}
              </Link>

              {breadcrumbs.map((crumb, i) => {
                const isLast = i === breadcrumbs.length - 1;
                return (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-subtle-fg select-none text-sm leading-none">
                      /
                    </span>
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="text-sm font-medium text-muted-fg hover:text-foreground transition-colors duration-150"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span
                        className={`text-sm font-medium ${isLast ? "text-foreground" : "text-muted-fg"}`}
                      >
                        {crumb.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
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
    </header>
  );
}
