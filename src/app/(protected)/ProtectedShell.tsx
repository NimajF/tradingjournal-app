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
}: {
  user: CurrentUser;
  children: React.ReactNode;
  favoriteJournals: { id: string; name: string }[];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <NavProvider>
      <UserProvider user={user}>
        <div className="h-dvh flex flex-col">
          {/* <Navbar
          user={user}
          onMenuClick={() => setMobileOpen((prev) => !prev)}
        /> */}
          <AppNavbar
            user={user}
            onMenuClick={() => setMobileOpen((prev) => !prev)}
          />

          <div className="flex flex-1 min-h-0 overflow-hidden">
            <AsideNav
              favoriteJournals={favoriteJournals}
              mobileOpen={mobileOpen}
              onClose={() => setMobileOpen(false)}
            />
            <div className="flex-1 min-w-0 md:pr-64 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </UserProvider>
    </NavProvider>
  );
}
