import SettingsSideNav from "./SettingsSideNav";
import AccountSection from "./AccountSection";
import CustomizationSection from "./CustomizationSection";
import { items } from "@/lib/constants/settings";

const SECTIONS: Record<string, React.ReactNode> = {
  account: <AccountSection />,
  customization: <CustomizationSection />,
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const tab = (await searchParams).tab ?? "account";
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-205 mx-auto px-8 py-10">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-fg mt-0.5">
            Manage your account and preferences
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex gap-10 items-start">
          {/* Left nav */}
          <div className="shrink-0">
            <SettingsSideNav active={tab} />
          </div>
          {/* Content panel */}
          <div className="flex-1 min-w-0">{SECTIONS[tab]}</div>
        </div>
      </div>
    </div>
  );
}
