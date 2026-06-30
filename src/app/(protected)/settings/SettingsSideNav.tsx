import Link from "next/link";
import { items } from "@/lib/constants/settings";

export default function SettingsSideNav({ active }: { active: string }) {
  return (
    <nav className="w-44 shrink-0 space-y-0.5" aria-label="Settings">
      {items.map(({ key, href, label, Icon }) => {
        const isActive = active === key;
        const base =
          "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors duration-150";
        const activeCls =
          "bg-accent-muted text-accent font-medium dark:bg-white/8 dark:text-foreground";
        const inactiveCls =
          "text-muted-fg hover:text-foreground hover:bg-surface-alt cursor-pointer";

        return (
          <Link
            key={key}
            href={href}
            className={base + " " + (isActive ? activeCls : inactiveCls)}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon size={14} strokeWidth={isActive ? 2.25 : 1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
