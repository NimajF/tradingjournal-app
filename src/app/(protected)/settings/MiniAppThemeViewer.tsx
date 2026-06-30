"use client";

const rows = [
  { width: "w-12", tone: "profit" },
  { width: "w-10", tone: "loss" },
  { width: "w-14", tone: "neutral" },
];

const bars = ["h-5", "h-8", "h-6", "h-10", "h-7", "h-12", "h-9"];

export default function MiniAppThemeViewer() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none overflow-hidden rounded-lg border border-border-base bg-background elevated-sm"
    >
      <div className="flex h-62 min-h-0 text-foreground">
        <aside className="hidden w-20 shrink-0 border-r border-border bg-surface px-3 py-3 sm:block">
          <div className="mb-5 flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-accent" />
            <div className="h-2 w-8 rounded-full bg-surface-alt" />
          </div>

          <div className="space-y-2">
            <div className="h-6 rounded-md bg-accent-muted" />
            <div className="h-6 rounded-md bg-surface-alt" />
            <div className="h-6 rounded-md bg-surface-alt" />
          </div>
        </aside>

        <section className="min-w-0 flex-1 bg-background">
          <div className="flex h-11 items-center justify-between border-b border-border bg-surface px-4">
            <div className="space-y-1.5">
              <div className="h-2.5 w-24 rounded-full bg-foreground/80" />
              <div className="h-1.5 w-16 rounded-full bg-muted-fg/45" />
            </div>
            <div className="h-6 w-16 rounded-md bg-accent-muted" />
          </div>

          <div className="space-y-3 p-3">
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-border bg-surface p-2.5"
                >
                  <div className="mb-3 h-1.5 w-12 rounded-full bg-muted-fg/35" />
                  <div className="h-3 w-10 rounded-full bg-foreground/80" />
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-md border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border bg-surface-alt px-3 py-2">
                <div className="h-2 w-20 rounded-full bg-foreground/75" />
                <div className="h-1.5 w-10 rounded-full bg-accent" />
              </div>

              <div className="divide-y divide-border">
                {rows.map((row, index) => (
                  <div
                    key={`${row.tone}-${index}`}
                    className="grid grid-cols-[0.8fr_1fr_0.8fr_0.8fr] items-center gap-3 px-3 py-2.5"
                  >
                    <div className="h-2 rounded-full bg-muted-fg/35" />
                    <div className="h-2.5 w-12 rounded-full bg-foreground/75" />
                    <div className={`h-2 rounded-full bg-surface-alt ${row.width}`} />
                    <div
                      className={[
                        "ml-auto h-4 w-10 rounded-full",
                        row.tone === "profit"
                          ? "bg-profit-muted"
                          : row.tone === "loss"
                            ? "bg-loss-muted"
                            : "bg-surface-alt",
                      ].join(" ")}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_0.7fr] gap-2">
              <div className="rounded-md border border-border bg-surface p-2.5">
                <div className="mb-2 h-1.5 w-16 rounded-full bg-muted-fg/35" />
                <div className="flex h-14 items-end gap-1">
                  {bars.map((height, index) => (
                    <div
                      key={`${height}-${index}`}
                      className={`${height} flex-1 rounded-sm bg-accent-muted`}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-border bg-surface p-2.5">
                <div className="mb-3 h-1.5 w-12 rounded-full bg-muted-fg/35" />
                <div className="space-y-1.5">
                  <div className="h-1.5 rounded-full bg-surface-alt" />
                  <div className="h-1.5 w-10/12 rounded-full bg-surface-alt" />
                  <div className="h-1.5 w-7/12 rounded-full bg-accent-muted" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
