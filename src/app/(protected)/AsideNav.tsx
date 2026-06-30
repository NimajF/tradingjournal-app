"use client";

import { useUser } from "@/lib/auth/user-context";
import { signOut } from "@/app/actions/auth";
import { NotebookPen } from "lucide-react";
import SidebarNavClient from "./SidebarNavClient";

type AsideNavProps = {
  favoriteJournals: { id: string; name: string }[];
  mobileOpen: boolean;
  onClose: () => void;
};

export default function AsideNav({
  favoriteJournals,
  mobileOpen,
  onClose,
}: AsideNavProps) {
  const user = useUser();

  return (
    <>
      {/* Desktop. Reserves 256px of width fot the sidebar */}
      <div className="hidden md:block w-64 shrink-0 relative">
        <aside className="absolute inset-y-0 left-0 w-14 hover:w-64 flex flex-col border-r border-border bg-surface overflow-hidden transition-[width] duration-200 group z-10">
          <div className="flex items-center gap-2.5 px-4 pt-5 pb-6">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-accent dark:bg-foreground">
              <NotebookPen
                size={12}
                strokeWidth={2.5}
                className="text-accent-fg dark:text-background"
              />
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              Journal
            </span>
          </div>

          <div className="px-2">
            <SidebarNavClient favorites={favoriteJournals} />
          </div>

          <div className="mt-auto border-t border-border px-4 py-4 space-y-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto">
            <div>
              <p className="text-xs text-subtle-fg mb-0.5 whitespace-nowrap">
                Signed in as
              </p>
              <p className="text-xs font-medium text-foreground truncate whitespace-nowrap">
                {user.email}
              </p>
            </div>
            {user.username && (
              <p className="text-xs text-muted-fg whitespace-nowrap">
                @{user.username}
              </p>
            )}
            <form action={signOut}>
              <button
                type="submit"
                className="text-xs text-muted-fg hover:text-foreground transition-colors whitespace-nowrap"
              >
                Sign out
              </button>
            </form>
          </div>
        </aside>
      </div>
      {/* Mobile: overlay cuando mobileOpen */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed top-14 inset-x-0 bottom-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <aside className="lg:hidden fixed top-14 bottom-0 left-0 w-64 z-50 flex flex-col border-r border-border bg-surface overflow-hidden">
            <div className="flex items-center gap-2.5 px-4 pt-5 pb-6">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-accent dark:bg-foreground">
                <NotebookPen
                  size={12}
                  strokeWidth={2.5}
                  className="text-accent-fg dark:text-background"
                />
              </div>
              <span className="text-sm font-semibold tracking-tight text-foreground whitespace-nowrap">
                Journal
              </span>
            </div>
            <div className="px-2">
              <SidebarNavClient
                favorites={favoriteJournals}
                showLabels={true}
              />
            </div>
            <div className="mt-auto border-t border-border px-4 py-4 space-y-2.5">
              <div>
                <p className="text-xs text-subtle-fg mb-0.5 whitespace-nowrap">
                  Signed in as
                </p>
                <p className="text-xs font-medium text-foreground truncate whitespace-nowrap">
                  {user.email}
                </p>
              </div>
              {user.username && (
                <p className="text-xs text-muted-fg whitespace-nowrap">
                  @{user.username}
                </p>
              )}
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-xs text-muted-fg hover:text-foreground transition-colors whitespace-nowrap"
                >
                  Sign out
                </button>
              </form>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
