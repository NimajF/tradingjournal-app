// The palette catalogue — the single list the app knows about.
//
// Colours live only in src/app/themes.css, one block per id. The picker
// renders each swatch with its own data-theme and reads the colours from
// CSS, so there is no hex here to fall out of sync. Adding a palette is
// one CSS block + one entry below.
export const THEMES = [
  { id: "terminal", label: "Terminal" },
  { id: "mint", label: "Mint" },
  { id: "graphite", label: "Graphite" },
  { id: "amber", label: "Amber" },
  { id: "nocturne", label: "Nocturne" },
  { id: "fjord", label: "Fjord" },
] as const;

export type ColorTheme = (typeof THEMES)[number]["id"];

export const DEFAULT_COLOR_THEME: ColorTheme = "terminal";

export const THEME_IDS: readonly ColorTheme[] = THEMES.map((t) => t.id);

// A stored value from an older build (void, sage, haze…) falls back to the
// default instead of leaving <html> with a palette that no longer exists.
export function resolveColorTheme(value: string | null | undefined): ColorTheme {
  return THEME_IDS.includes(value as ColorTheme)
    ? (value as ColorTheme)
    : DEFAULT_COLOR_THEME;
}
