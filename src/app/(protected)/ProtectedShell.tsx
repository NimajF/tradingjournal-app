"use client";

import { useState } from "react";
import { NavProvider } from "@/lib/nav/nav-context";
import { UserProvider } from "@/lib/auth/user-context";
import type { CurrentUser } from "@/lib/types/user";
import AppNavbar from "./AppNavbar";
import AsideNav from "./AsideNav";

export default function ProtectedShell({
  user,
  children,
  favoriteJournals,
  favoriteNewsletters,
  initialSidebarCollapsed,
}: {
  user: CurrentUser;
  children: React.ReactNode;
  favoriteJournals: { id: string; name: string }[];
  favoriteNewsletters: { id: string; title: string }[];
  initialSidebarCollapsed: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <NavProvider initialCollapsed={initialSidebarCollapsed}>
      <UserProvider user={user}>
        {/* The page keeps the colour the content panel had (--view); rail
            and header float on it as cards. */}
        <div className="h-dvh flex flex-col bg-view">
          {/* <Navbar
          user={user}
          onMenuClick={() => setMobileOpen((prev) => !prev)}
        /> */}

          <div className="flex flex-1 min-h-0 overflow-hidden">
            <AsideNav
              favoriteJournals={favoriteJournals}
              favoriteNewsletters={favoriteNewsletters}
              mobileOpen={mobileOpen}
              onClose={() => setMobileOpen(false)}
            />
            {/* Rail and header are floating cards */}
            <div className="flex flex-1 min-w-0 flex-col">
              <AppNavbar
                user={user}
                onMenuClick={() => setMobileOpen((prev) => !prev)}
              />
              <div className="flex-1 min-h-0 overflow-y-auto px-4 py-2 sm:px-6 lg:px-10 [scrollbar-gutter:stable]">
                {children}
              </div>
            </div>
          </div>
        </div>
      </UserProvider>
    </NavProvider>
  );
}
