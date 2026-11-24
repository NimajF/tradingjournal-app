"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { useTheme } from "./ThemeProvider";
import ThemeToggle from "./ThemeToggle";

interface UserMenuProps {
  email: string;
  username?: string | null;
  avatarUrl?: string | null;
}

export default function UserMenu({
  email,
  username,
  avatarUrl,
}: UserMenuProps) {
  const { theme, mounted } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : email.slice(0, 2).toUpperCase();
  const avatarStyle = avatarUrl
    ? { backgroundImage: `url(${avatarUrl})` }
    : undefined;
  const displayName = username ?? email.split("@")[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`group flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-150 hover:bg-hover ${
          open ? "bg-surface-alt" : ""
        }`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent bg-cover bg-center text-accent-fg text-xs font-bold overflow-hidden"
          style={avatarStyle}
        >
          {!avatarUrl && initials}
        </span>
        <span className="hidden sm:block text-sm text-foreground">
          {displayName}
        </span>
        <ChevronDown
          size={14}
          className={`hidden sm:block transition-[transform,color] duration-150 group-hover:text-foreground ${
            open ? "rotate-180 text-foreground" : "text-muted-fg"
          }`}
        />
      </button>

      {open && (
        <div
          className="panel absolute! right-0 top-full z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-xl border border-border bg-surface-overlay elevated-lg animate-in fade-in-0 zoom-in-95 duration-150 motion-reduce:animate-none"
          role="menu"
        >
          {/* Profile header */}
          <div className="flex items-center gap-2.5 border-b border-border-muted px-3.5 py-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent bg-cover bg-center text-accent-fg text-xs font-bold overflow-hidden"
              style={avatarStyle}
            >
              {!avatarUrl && initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground leading-tight">
                {displayName}
              </p>
              <p className="truncate text-xs text-muted-fg">{email}</p>
            </div>
          </div>

          {/* Settings */}
          <div role="none" className="p-1">
            <Link
              href="/settings?tab=account"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-muted-fg transition-colors duration-150 hover:bg-hover hover:text-foreground"
              role="menuitem"
            >
              <Settings size={14} />
              Settings
            </Link>
          </div>

          {/* Theme toggle */}
          <div role="none" className="border-t border-border-muted p-1">
            <div className="flex items-center justify-between rounded-md px-2.5 py-1.5">
              <span className="text-sm text-muted-fg">
                {mounted
                  ? theme === "dark"
                    ? "Dark mode"
                    : "Light mode"
                  : "Theme"}
              </span>
              <ThemeToggle />
            </div>
          </div>

          {/* Sign out */}
          <div role="none" className="border-t border-border-muted p-1">
            <form action={signOut}>
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-muted-fg transition-colors duration-150 hover:bg-hover hover:text-foreground"
                role="menuitem"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
