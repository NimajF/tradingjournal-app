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
        <h2 className="text-sm font-semibold text-foreground">Customization</h2>
        <p className="text-xs text-muted-fg mt-0.5">Appearance preferences</p>
      </div>

      <div className="space-y-8">
        <div>
          <p className="text-xs font-semibold text-muted-fg mb-1">Appearance</p>

          <div className="flex items-center justify-between gap-6 py-4 border-b border-border">
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

          <div className="flex items-center justify-between gap-6 py-4">
            <div>
              <p className="text-sm font-medium text-foreground">Color theme</p>
              <p className="text-xs text-muted-fg mt-0.5">
                Accent color and surface tones — dark mode only
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              {THEMES.map((t) => {
                const active = colorTheme === t.id;
                return (
                  <button
                    key={t.id}
                    title={t.label}
                    aria-label={`${t.label} theme`}
                    aria-pressed={active}
                    onClick={() => setColorTheme(t.id)}
                    disabled={mounted && theme !== "dark"}
                    className="w-5 h-5 rounded-full transition-transform duration-150 hover:scale-110 focus-visible:outline-none disabled:opacity-30 disabled:pointer-events-none"
                    style={{
                      backgroundColor: t.accent,
                      transform: active ? "scale(1.15)" : undefined,
                      boxShadow: active
                        ? `0 0 0 2px var(--surface-overlay), 0 0 0 3.5px ${t.accent}`
                        : undefined,
                    }}
                  />
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
