"use client";

import Link from "next/link";
import type { CurrentUser } from "@/lib/types/user";
import { navLinks } from "@/lib/data/navigation";
import UserMenu from "./UserMenu";
import { Menu } from "lucide-react";

type NavbarProps = {
  user: CurrentUser | null;
  onMenuClick?: () => void;
};

export default function Navbar({ user, onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border glass">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 h-14">
        <div className="flex items-center gap-2">
          {onMenuClick && (
            <div className="md:hidden">
              <button
                onClick={onMenuClick}
                className="btn btn-muted p-2"
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
            </div>
          )}

          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-foreground select-none"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-fg text-xs font-bold tracking-tight">
              TJ
            </span>
            <span className="hidden sm:block">TradeJournal</span>
          </Link>
        </div>
        {!user && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="btn btn-muted btn-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1">
          {user ? (
            <div className="flex items-center gap-1">
              <Link href="/journals" className="btn btn-muted btn-sm ml-2">
                My Journal
              </Link>
              <UserMenu
                email={user.email}
                username={user.username}
                avatarUrl={user.avatarUrl}
              />
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:block btn btn-muted btn-sm"
              >
                Sign In
              </Link>
              <Link href="/register" className="btn btn-primary btn-lift btn-sm ml-1">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
