import { User, Palette, Bell, Database, Shield } from "lucide-react";

export const items: { key: string; href: string; label: string; Icon: any }[] =
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
    {
      key: "notifications",
      href: "/settings?tab=notifications",
      label: "Notifications",
      Icon: Bell,
    },
    { key: "data", href: "/settings?tab=data", label: "Data", Icon: Database },
    {
      key: "security",
      href: "/settings?tab=security",
      label: "Security",
      Icon: Shield,
    },
  ];
