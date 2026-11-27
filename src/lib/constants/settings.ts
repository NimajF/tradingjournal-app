import { User, Palette, Database, type LucideIcon } from "lucide-react";

export const items: {
  key: string;
  href: string;
  label: string;
  Icon: LucideIcon;
}[] =
  [
    {
      key: "account",
      href: "/settings?tab=account",
      label: "Account",
      Icon: User,
    },
    {
      key: "customization",
      href: "/settings?tab=customization",
      label: "Customization",
      Icon: Palette,
    },

    { key: "data", href: "/settings?tab=data", label: "Data", Icon: Database },
  ];
