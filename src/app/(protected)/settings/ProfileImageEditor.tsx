"use client";

import { useState, useTransition } from "react";
import { Camera, Trash2, Upload } from "lucide-react";
import { uploadProfileImage, deleteProfileImage } from "@/app/actions/profile";
import { validateAvatarFile } from "@/lib/validations/validations";
import { getInitials } from "@/lib/utils/initials";

export default function ProfileImageEditor({
  avatarUrl,
  displayName,
  username,
}: {
  avatarUrl: string | null;
  displayName: string | null;
  username: string | null;
}) {
  const [profileImage, setProfileImage] = useState<string | null>(
    avatarUrl || null,
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = e.target.files?.[0];
    input.value = ""; // so the same file can be picked again.
    if (!file) return;

    const fileError = validateAvatarFile(file);
    if (fileError) return setError(fileError);

    setError(null); // clear previous errors
    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      try {
        const result = await uploadProfileImage(formData);
        if (result.error) setError(result.error);
        else setProfileImage(result.data!.url);
      } catch {
        setError("Couldn't upload. Check your connection and try again.");
      }
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      try {
        const { error } = await deleteProfileImage();
        if (error) setError(error);
        else {
          setError(null);
          setProfileImage(null);
        }
      } catch {
        setError("Couldn't remove image. Check your connection and try again.");
      }
    });
  };

  return (
    <div className="flex items-center gap-4 shrink-0">
      {/* One file input for the avatar and the Upload button. */}
      <input
        id="profile-picture"
        name="profile-picture"
        type="file"
        accept="image/png,image/jpeg,image/gif"
        className="peer sr-only"
        onChange={handleFileChange}
        disabled={isPending}
      />

      {/* Avatar. Clicking it opens the file picker, like the Upload button. */}
      <label
        htmlFor="profile-picture"
        title="Change profile picture"
        className={`group relative block h-17 w-17 shrink-0 cursor-pointer rounded-full border border-border bg-background p-1 shadow-(--shadow-sm) peer-focus-visible:ring-2 peer-focus-visible:ring-ring ${isPending ? "pointer-events-none opacity-50" : ""}`}
      >
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-accent-muted text-sm font-semibold text-accent-muted-fg">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            getInitials(displayName, username)
          )}
          {/* Hover veil. Tells the pointer this is a control. */}
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center bg-background/70 text-foreground opacity-0 transition-opacity duration-(--dur-2) ease-(--ease) group-hover:opacity-100"
          >
            <Camera size={18} strokeWidth={2} />
          </span>
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-muted-fg shadow-(--shadow-sm)">
          <Camera size={13} strokeWidth={2} />
        </div>
      </label>

      {/* Controls */}
      <div className="flex min-w-0 flex-col items-start gap-2">
        <div className="flex items-center gap-2">
          <label
            htmlFor="profile-picture"
            className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-border-base px-3 text-xs font-medium text-foreground transition-colors hover:bg-hover ${isPending ? "pointer-events-none opacity-50" : ""}`}
          >
            <Upload size={13} strokeWidth={2.2} />
            {isPending ? "Uploading…" : "Upload image"}
          </label>
          {profileImage && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isPending}
              className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium text-danger transition-colors hover:bg-danger/10 disabled:opacity-50"
            >
              <Trash2 size={13} strokeWidth={2.2} />
              Remove
            </button>
          )}
        </div>
        <p className="text-[11px] leading-none text-subtle-fg">
          Square images crop best
        </p>
        {error && (
          <p
            role="alert"
            className="text-xs text-loss animate-in fade-in-0 duration-150 motion-reduce:animate-none"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
