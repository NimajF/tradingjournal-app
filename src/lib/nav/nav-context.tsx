"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

export type Breadcrumb = {
  label: string;
  href?: string; // Optional href for clickable breadcrumbs
};

type NavContextValue = {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (items: Breadcrumb[]) => void;
};

const NavContext = createContext<NavContextValue | null>(null);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [breadcrumbs, setBreadcrumbsState] = useState<Breadcrumb[]>([]);

  const setBreadcrumbs = useCallback((items: Breadcrumb[]) => {
    setBreadcrumbsState(items);
  }, []); // Memoize the function to prevent unnecessary re-renders

  return (
    <NavContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
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
