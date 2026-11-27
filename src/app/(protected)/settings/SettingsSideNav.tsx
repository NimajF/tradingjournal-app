import Link from "next/link";
import { items } from "@/lib/constants/settings";

export default function SettingsSideNav({ active }: { active: string }) {
  return (
    /* A row of tabs on a phone, a column beside the content from md up. */
    <nav
      className="flex gap-0.5 overflow-x-auto [scrollbar-width:none] md:block md:w-44 md:space-y-0.5 md:overflow-visible"
      aria-label="Settings"
    >
      {items.map(({ key, href, label, Icon }) => {
        const isActive = active === key;
        return (
          <Link
            key={key}
            href={href}
            data-active={isActive}
            aria-current={isActive ? "page" : undefined}
            className="nav-link flex shrink-0 items-center gap-2.5 whitespace-nowrap px-3 py-2 rounded-md text-sm"
          >
            <Icon size={14} strokeWidth={isActive ? 2.25 : 1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
