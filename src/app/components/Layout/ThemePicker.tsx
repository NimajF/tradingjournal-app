"use client";

import { THEMES } from "@/lib/constants/themes";
import { useTheme } from "./ThemeProvider";

export default function ThemePicker() {
  const { colorTheme, setColorTheme } = useTheme();

  return (
    <div className="flex items-center justify-between px-3 py-2">
      <span className="text-xs text-muted-fg">Theme</span>
      <div className="flex items-center gap-2">
        {THEMES.map((t) => {
          const active = colorTheme === t.id;
          return (
            <button
              key={t.id}
              title={t.label}
              aria-label={`${t.label} theme`}
              aria-pressed={active}
              onClick={() => setColorTheme(t.id)}
              className="w-5 h-5 rounded-full transition-transform duration-150 hover:scale-110 focus-visible:outline-none"
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
  );
}
