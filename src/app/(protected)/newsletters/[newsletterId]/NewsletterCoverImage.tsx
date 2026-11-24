"use client";

import { useState, useTransition, useRef } from "react";
import { Camera, Trash2, ImageIcon, Loader2 } from "lucide-react";
import {
  uploadNewsletterCoverImage,
  deleteNewsletterCoverImage,
} from "@/app/actions/newsletter";

type NewsletterCoverImageProps = {
  newsletterId: string;
  initialCoverImageUrl: string | null;
};

export default function NewsletterCoverImage({
  newsletterId,
  initialCoverImageUrl,
}: NewsletterCoverImageProps) {
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    initialCoverImageUrl,
  );
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const result = await uploadNewsletterCoverImage(newsletterId, formData);
      if (result.data) setCoverImageUrl(result.data.url);
    });
  };

  const handleDeleteImage = () => {
    startTransition(async () => {
      const { error } = await deleteNewsletterCoverImage(newsletterId);
      if (!error) setCoverImageUrl(null);
    });
  };
  return (
    <div className={`group relative w-full ${coverImageUrl ? "" : "h-0"}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={handleFileChange}
        disabled={isPending}
        tabIndex={-1}
      />

      {coverImageUrl ? (
        // A plate set into the column, the way the list card insets its
        // cover — not a banner bleeding across the workspace. Same box
        // as NewsletterContentView's, so preview doesn't move it.
        <div className="relative mb-9 h-45 w-full overflow-hidden rounded-lg border border-border bg-surface-alt">
          <img
            src={coverImageUrl}
            alt="Newsletter cover"
            className="h-full w-full object-cover"
          />

          {/* Controls sit on a bottom scrim rather than dimming the whole
              photo, and also appear on keyboard focus. Black is right here:
              it's laid over a photograph, not a themed surface. */}
          <div
            className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-linear-to-t from-black/55 to-transparent
                       px-3 pb-3 pt-10 opacity-0 transition-opacity duration-150
                       group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none"
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
              className="btn btn-xs border-white/15 bg-black/45 text-white backdrop-blur-sm hover:bg-black/65 disabled:opacity-50"
            >
              <Camera size={12} aria-hidden />
              Change
            </button>
            <button
              type="button"
              onClick={handleDeleteImage}
              disabled={isPending}
              className="btn btn-xs border-white/15 bg-black/45 text-white backdrop-blur-sm hover:bg-black/65 disabled:opacity-50"
            >
              <Trash2 size={12} aria-hidden />
              Remove
            </button>
          </div>

          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface/70">
              <Loader2 size={20} className="animate-spin text-muted-fg" />
            </div>
          )}
        </div>
      ) : (
        // No cover yet: a quiet affordance (Ghost / Notion) instead of a
        // drop zone. It hangs in the column's top air (the wrapper is 0px
        // tall), so the title sits where the read view puts it.
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
          className="btn btn-sm absolute bottom-3 left-0 -ml-3.5 text-subtle-fg hover:bg-hover hover:text-foreground disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 size={14} className="animate-spin" aria-hidden />
          ) : (
            <ImageIcon size={14} aria-hidden />
          )}
          {isPending ? "Uploading…" : "Add cover"}
        </button>
      )}
    </div>
  );
}
