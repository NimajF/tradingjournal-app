"use client";

import { useState, useTransition } from "react";
import { Camera, Trash2, Upload } from "lucide-react";
import { uploadProfileImage, deleteProfileImage } from "@/app/actions/profile";
export default function ProfileImageEditor({
  avatarUrl,
}: {
  avatarUrl: string | null;
}) {
  const [profileImage, setProfileImage] = useState<string | null>(
    avatarUrl || null,
  );
  const [isPending, startTransition] = useTransition();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const result = await uploadProfileImage(formData);
      if (!result.error) setProfileImage(result.data!.url);
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      const { error } = await deleteProfileImage();
      if (!error) setProfileImage(null);
    });
  };

  return (
      <div className="flex items-center gap-4 shrink-0">
        {/* Avatar */}
        <div className="relative h-17 w-17 rounded-full border border-border bg-background p-1 shadow-sm">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-accent-muted text-sm font-semibold text-accent-muted-fg">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              "AJ"
            )}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-muted-fg shadow-sm">
            <Camera size={13} strokeWidth={2} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex min-w-0 flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <label
              htmlFor="profile-picture"
              className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded border border-accent px-3 text-xs font-medium text-accent transition-colors hover:bg-accent-muted ${isPending ? "pointer-events-none opacity-50" : ""}`}
            >
              <Upload size={13} strokeWidth={2.2} />
              {isPending ? "Uploading..." : "Upload Image"}
            </label>
            <input
              id="profile-picture"
              name="profile-picture"
              type="file"
              accept="image/png,image/jpeg,image/gif"
              className="sr-only"
              onChange={handleFileChange}
              disabled={isPending}
            />
            {profileImage && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={isPending}
                className="inline-flex h-8 items-center gap-1.5 rounded px-3 text-xs font-medium text-loss-muted-fg transition-colors hover:bg-loss-muted disabled:opacity-50"
              >
                <Trash2 size={13} strokeWidth={2.2} />
                Remove
              </button>
            )}
          </div>
          <p className="text-[11px] leading-none text-subtle-fg">
            Square images crop best
          </p>
        </div>
      </div>
    );
}
