"use client";

import { useUser } from "@/lib/auth/user-context";
import { useNav } from "@/lib/nav/nav-context";
import { signOut } from "@/app/actions/auth";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import SidebarNavClient from "./SidebarNavClient";

type AsideNavProps = {
  favoriteJournals: { id: string; name: string }[];
  favoriteNewsletters: { id: string; title: string }[];
  mobileOpen: boolean;
  onClose: () => void;
};

export default function AsideNav({
  favoriteJournals,
  favoriteNewsletters,
  mobileOpen,
  onClose,
}: AsideNavProps) {
  const user = useUser();
  const { collapsed, toggleCollapsed } = useNav();

  return (
    <>
      <aside
        className={[
          "hidden md:flex shrink-0 flex-col my-2 ml-2 overflow-hidden rounded-2xl border border-border bg-surface transition-[width] duration-200",
          collapsed ? "w-14" : "w-64",
        ].join(" ")}
      >
        <div className="flex items-center gap-2.5 px-4 pt-5 pb-6">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-accent text-accent-fg text-[10.5px] font-bold tracking-[-0.04em]">
            TJ
          </span>
          {!collapsed && (
            <span className="text-[15px] font-[650] tracking-tight text-foreground whitespace-nowrap">
              TradeJournal
            </span>
          )}
          {!collapsed && (
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label="Collapse sidebar"
              aria-expanded={true}
              className="btn btn-icon ml-auto"
            >
              <PanelLeftClose size={15} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="px-2">
          <SidebarNavClient
            favoriteJournals={favoriteJournals}
            favoriteNewsletters={favoriteNewsletters}
            showLabels={!collapsed}
          />
        </div>

        {/* Account block. The identity card needs no label, it reads as
            the account on its own. Collapse lives next to the logo while
            open; collapsed, the 56px rail has no room there, so expand sits
            here, under the pointer that just collapsed it. */}
        <div
          className={[
            "mt-auto py-3.5",
            collapsed ? "flex flex-col items-center" : "px-3",
          ].join(" ")}
        >
          {collapsed && (
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label="Expand sidebar"
              aria-expanded={false}
              className="btn btn-icon"
            >
              <PanelLeftOpen size={15} aria-hidden="true" />
            </button>
          )}
          {!collapsed && (
            <div className="flex items-center gap-2.5 rounded-lg border border-border-muted bg-surface-alt px-2.5 py-2">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-foreground truncate whitespace-nowrap">
                  {user.username ? `@${user.username}` : user.email}
                </p>
                {user.username && (
                  <p className="text-[11.5px] text-muted-fg truncate whitespace-nowrap">
                    {user.email}
                  </p>
                )}
              </div>
              <form action={signOut}>
                <button
                  type="submit"
                  aria-label="Sign out"
                  title="Sign out"
                  className="btn btn-icon"
                >
                  <LogOut size={14} strokeWidth={1.75} aria-hidden="true" />
                </button>
              </form>
            </div>
          )}
        </div>
      </aside>
      {/* Mobile: overlay cuando mobileOpen. Breakpoint matches the desktop
          aside's own (md:), so there's no dead zone between them. */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed top-13 inset-x-0 bottom-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <aside className="md:hidden fixed top-13 bottom-0 left-0 w-64 z-50 flex flex-col border-r border-border-muted bg-(--shell) overflow-hidden">
            <div className="flex items-center gap-2.5 px-4 pt-5 pb-6">
              <span className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-sm bg-accent text-accent-fg text-[10px] font-bold tracking-tight">
                TJ
              </span>
              <span className="text-sm font-semibold tracking-tight text-foreground whitespace-nowrap">
                TradeJournal
              </span>
            </div>
            <div className="px-2">
              <SidebarNavClient
                favoriteJournals={favoriteJournals}
                favoriteNewsletters={favoriteNewsletters}
                showLabels={true}
              />
            </div>
            <div className="mt-auto border-t border-border-muted px-4 py-4 space-y-2.5">
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
                  className="flex w-full items-center gap-2 -mx-2 rounded px-2 py-1.5 text-xs text-muted-fg transition-colors duration-(--dur-2) hover:bg-hover hover:text-foreground"
                >
                  <LogOut size={13} strokeWidth={1.75} />
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
