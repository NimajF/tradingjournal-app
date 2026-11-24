"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";
import { APP_NAME, SIDEBAR_COLLAPSED_COOKIE } from "@/lib/constants/app";

export type Breadcrumb = {
  label: string;
  href?: string; // Optional href for clickable breadcrumbs
};

type Section = { label: string; href: string };

type NavContextValue = {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (items: Breadcrumb[]) => void;
  section: Section | null;
  // Desktop sidebar collapsed vs expanded state. Lives here
  // instead of local state in AsideNav.
  collapsed: boolean;
  toggleCollapsed: () => void;
};

const NavContext = createContext<NavContextValue | null>(null);

// Single source of truth for top-level section a path belongs to. Used
// both for the navbar's section link and (below) for the live tab title, so
// the two never disagree.
function sectionForPathname(pathname: string): Section | null {
  // Determine the section based on the pathname
  if (pathname.startsWith("/newsletter"))
    return { label: "Newsletters", href: "/newsletters" };
  if (pathname.startsWith("/settings"))
    return { label: "Settings", href: "/settings" };
  if (pathname.startsWith("/journals"))
    return { label: "Journals", href: "/journals" };
  return null;
}

export function NavProvider({
  children,
  initialCollapsed = false,
}: {
  children: React.ReactNode;
  // Read server-side from the persisted cookie so the first paint already
  // renders the right sidebar width — no expand/collapse flash on load.
  initialCollapsed?: boolean;
}) {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbsState] = useState<Breadcrumb[]>([]);
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const section = sectionForPathname(pathname);

  const setBreadcrumbs = useCallback((items: Breadcrumb[]) => {
    setBreadcrumbsState(items);
  }, []); // Memoize the function to prevent unnecessary re-renders

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      // Plain (non-httpOnly) cookie: it's a UI preference, not sensitive,
      // and needs to be readable from the client on every toggle.
      document.cookie = `${SIDEBAR_COLLAPSED_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
      return next;
    });
  }, []);

  // Keeps the browser tab title in sync with the breadcrumb trail while a
  // page is mounted (like renaming a journal/trade/newsletter updates the
  // tab live instead of only on the next navigation). This only sets the
  // title when theres an active breadcrumb trail. It never resets it to a
  // fallback, so pages without breadcrumbs keep whatever title Next.js's own
  // (SSR) metadata already resolved for that route.
  useEffect(() => {
    if (breadcrumbs.length === 0) return;
    const trail = [section?.label, ...breadcrumbs.map((b) => b.label)]
      .filter(Boolean)
      .reverse();
    document.title = `${trail.join(" · ")} · ${APP_NAME}`;
  }, [breadcrumbs, section]);

  return (
    <NavContext.Provider
      value={{
        breadcrumbs,
        setBreadcrumbs,
        section,
        collapsed,
        toggleCollapsed,
      }}
    >
      {children}
    </NavContext.Provider>
  );
}

// Custom hook to access the navigation context
export function useNav() {
  const context = useContext(NavContext);
  if (!context) throw new Error("useNav must be used within a NavProvider");
  return context;
}

// Custom hook to set breadcrumbs
export function useSetBreadcrumbs(items: Breadcrumb[]) {
  const { setBreadcrumbs } = useNav();
  useEffect(() => {
    setBreadcrumbs(items);
    return () => setBreadcrumbs([]); // Clear breadcrumbs on unmount
  }, []);
}
