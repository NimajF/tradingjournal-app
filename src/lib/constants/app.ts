// Shared app identity used for the root <title> template (src/app/layout.tsx)
// and cliente-side live title sync (src/lib/nav/nav-context.tsx), so both
// stay synchronized without hardcoding the string twice.
export const APP_NAME = "TradeJournal";

// Persists the desktop sidebar's collapsed/expanded state across sessions.
// Read server-side in src/app/(protected)/layout.tsx (so the first paint
// already has the right width, no flash) and written client-side from
// src/lib/nav/nav-context.tsx whenever the user toggles it.
export const SIDEBAR_COLLAPSED_COOKIE = "sidebar-collapsed";
