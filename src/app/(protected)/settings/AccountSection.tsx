import ProfileImageEditor from "./ProfileImageEditor";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AccountSection() {
  const user = await getCurrentUser();

  return (
    <>
      <div className="pb-4 mb-6 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Account</h2>
        <p className="text-xs text-muted-fg mt-0.5">Profile and login email</p>
      </div>

      {/* Profile group */}
      <div className="space-y-8">
        <div>
          <p className="text-xs font-semibold text-muted-fg mb-1">Profile</p>

          <div className="flex flex-col gap-4 py-4 border-b border-border sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div>
              <p className="text-sm font-medium text-foreground">
                Profile picture
              </p>
              <p className="text-xs text-muted-fg mt-0.5">
                Supports PNG, JPG, JPEG, and GIF under 500KB
              </p>
            </div>
            <ProfileImageEditor avatarUrl={user.avatarUrl} />
          </div>

          <div className="flex items-center justify-between gap-6 py-4 border-b border-border">
            <div>
              <p className="text-sm font-medium text-foreground">
                Display name
              </p>
              <p className="text-xs text-muted-fg mt-0.5">
                Appears in exports and reports
              </p>
            </div>
            <div className="h-8 w-52 rounded bg-background border border-border shrink-0" />
          </div>

          <div className="flex items-center justify-between gap-6 py-4">
            <div>
              <p className="text-sm font-medium text-foreground">Username</p>
              <p className="text-xs text-muted-fg mt-0.5">
                Used in your profile URL and sharing links
              </p>
            </div>
            <div className="h-8 w-52 rounded bg-background border border-border shrink-0" />
          </div>
        </div>

        {/* Contact group */}
        <div>
          <p className="text-xs font-semibold text-muted-fg mb-1">Contact</p>

          <div className="flex items-center justify-between gap-6 py-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Email address
              </p>
              <p className="text-xs text-muted-fg mt-0.5">
                Used for login and notification emails
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="h-8 w-64 rounded bg-background border border-border" />
              <span className="text-xs font-medium text-profit-muted-fg bg-profit-muted px-2.5 py-0.5 rounded-full">
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
