export type ColorTheme = "void" | "sage" | "nebula" | "polar";

export const DEFAULT_COLOR_THEME: ColorTheme = "void";

export const THEMES: {
  id: ColorTheme;
  label: string;
  accent: string;
  bg: string;
}[] = [
  { id: "void",   label: "Void",   accent: "#818CF8", bg: "#16161E" },
  { id: "sage",   label: "Sage",   accent: "#3ECF8E", bg: "#141414" },
  { id: "nebula", label: "Nebula", accent: "#7C3AED", bg: "#12121E" },
  { id: "polar",  label: "Polar",  accent: "#C792EA", bg: "#252A3A" },
];
