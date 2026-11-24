import Link from "next/link";
import { footerLinks } from "@/lib/data/navigation";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-fg text-xs font-bold">
                TJ
              </span>
              <span className="font-semibold text-foreground">
                TradeJournal
              </span>
            </div>
            <p className="text-sm text-muted-fg leading-relaxed max-w-64">
              A private workspace for logging trades and writing the
              analysis behind them.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, items]) => (
            <div key={section}>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
                {section}
              </p>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-fg hover:text-foreground transition-colors duration-150"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border-muted flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-xs text-subtle-fg">
            &copy; {new Date().getFullYear()} TradeJournal. Free to use, always.
          </p>
        </div>
      </div>
    </footer>
  );
}
