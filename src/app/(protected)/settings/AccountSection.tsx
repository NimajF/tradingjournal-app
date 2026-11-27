import ProfileImageEditor from "./ProfileImageEditor";
import EditableField from "./EditableField";
import UsernameField from "./UsernameField";
import { getCurrentUser } from "@/lib/auth/session";
import { updateDisplayName } from "@/app/actions/profile";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function AccountSection() {
  const user = await getCurrentUser();

  return (
    <>
      <div className="pb-4 mb-6 border-b border-border">
        <h2
          data-slot="section-title"
          className="text-sm font-semibold text-foreground"
        >
          Account
        </h2>
        <p className="text-xs text-muted-fg mt-0.5">Profile and login email</p>
      </div>

      {/* Profile group */}
      <div className="space-y-8">
        <div>
          <p className="text-xs font-semibold text-muted-fg mb-1">Profile</p>

          <div className="flex flex-col gap-4 py-4 border-b border-border-muted sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div>
              <p className="text-sm font-medium text-foreground">
                Profile picture
              </p>
              <p className="text-xs text-muted-fg mt-0.5">
                Supports PNG, JPG, JPEG, and GIF under 500KB
              </p>
            </div>
            <ProfileImageEditor
              avatarUrl={user.avatarUrl}
              displayName={user.displayName}
              username={user.username}
            />
          </div>

          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 border-b border-border-muted">
            <div>
              <p className="text-sm font-medium text-foreground">
                Display name
              </p>
              <p className="text-xs text-muted-fg mt-0.5">
                Appears in exports and reports
              </p>
            </div>
            <EditableField
              label="Display name"
              defaultValue={user.displayName ?? ""}
              action={updateDisplayName}
              maxLength={50}
              placeholder="Your name"
            />
          </div>

          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div>
              <p className="text-sm font-medium text-foreground">Username</p>
              <p className="text-xs text-muted-fg mt-0.5">
                Used in your profile URL and sharing links
              </p>
            </div>
            <UsernameField defaultValue={user.username ?? ""} />
          </div>
        </div>

        {/* Contact group */}
        <div>
          <p className="text-xs font-semibold text-muted-fg mb-1">Contact</p>

          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div>
              <p className="text-sm font-medium text-foreground">
                Email address
              </p>
              <p className="text-xs text-muted-fg mt-0.5">
                Used for login and notification emails
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <p className="text-sm text-muted-fg">{user.email}</p>
              {/* <div className="h-8 w-64 rounded-md border border-(--field-border) bg-(--field-bg)" /> */}
              <span className="chip bg-surface-alt text-muted-fg">
                Verified
              </span>
            </div>
          </div>
        </div>
        {/* Security group */}
        <div>
          <p className="text-xs font-semibold text-muted-fg mb-1">Security</p>

          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div>
              <p className="text-sm font-medium text-foreground">Password</p>
              <p className="text-xs text-muted-fg mt-0.5">
                Changing it signs you out on all other devices
              </p>
            </div>
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </>
  );
}
