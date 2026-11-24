"use client";

import { THEMES } from "@/lib/constants/themes";
import { useTheme } from "@/app/components/Layout/ThemeProvider";
import ThemeToggle from "@/app/components/Layout/ThemeToggle";
import MiniAppThemeViewer from "./MiniAppThemeViewer";

export default function CustomizationSection() {
  const { theme, colorTheme, setColorTheme, mounted } = useTheme();

  return (
    <>
      <div className="pb-4 mb-6 border-b border-border">
        <h2 data-slot="section-title" className="text-sm font-semibold text-foreground">Customization</h2>
        <p className="text-xs text-muted-fg mt-0.5">Appearance preferences</p>
      </div>

      <div className="space-y-8">
        <div>
          <p className="text-xs font-semibold text-muted-fg mb-1">Appearance</p>

          <div className="flex items-center justify-between gap-6 py-4 border-b border-border-muted">
            <div>
              <p className="text-sm font-medium text-foreground">Mode</p>
              <p className="text-xs text-muted-fg mt-0.5">
                {mounted
                  ? theme === "dark"
                    ? "Dark mode is active"
                    : "Light mode is active"
                  : "System default"}
              </p>
            </div>
            <ThemeToggle />
          </div>

          <div className="py-4">
            <div>
              <p className="text-sm font-medium text-foreground">Color theme</p>
              <p className="text-xs text-muted-fg mt-0.5">
                Canvas, surfaces, action and trade colors. Dark mode only.
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {THEMES.map((t) => {
                const active = colorTheme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    // Each swatch carries its own palette, so the three dots
                    // read their colours from themes.css rather than from hex
                    // duplicated here.
                    data-theme={t.id}
                    aria-label={`${t.label} theme`}
                    aria-pressed={active}
                    onClick={() => setColorTheme(t.id)}
                    disabled={mounted && theme !== "dark"}
                    // The chip is painted in its own palette's canvas, edge and
                    // ink, so each option previews the whole theme.
                    className={[
                      "inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-[box-shadow,border-color] duration-150",
                      "bg-(--p-surface) text-(--p-foreground) border-(--p-border-base)",
                      "disabled:opacity-40 disabled:pointer-events-none",
                      active
                        ? "ring-2 ring-accent ring-offset-2 ring-offset-surface"
                        : "hover:border-(--p-muted-fg)",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-1" aria-hidden="true">
                      <span className="h-3 w-3 rounded-full bg-(--p-accent)" />
                      <span className="h-2 w-2 rounded-full bg-(--p-profit)" />
                      <span className="h-2 w-2 rounded-full bg-(--p-loss)" />
                    </span>
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3">
            <p className="text-xs font-semibold text-muted-fg mb-1">Preview</p>
            <p className="text-sm font-medium text-foreground">App preview</p>
          </div>
          <MiniAppThemeViewer />
        </div>
      </div>
    </>
  );
}
