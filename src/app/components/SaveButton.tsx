"use client";

import { Check, Loader2 } from "lucide-react";

type SaveButtonProps = {
  status: "idle" | "saving" | "saved" | "error";
  isDirty: boolean;
  onSave: () => void;
  className?: string;
};

export default function SaveButton({
  status,
  isDirty,
  onSave,
  className = "",
}: SaveButtonProps) {
  const isSaving = status === "saving";
  const failed = status === "error";
  const canSave = !isSaving && (isDirty || failed);

  // e.g "Saving…", "Retry save", "Save changes", "Saved"
  const label = isSaving
    ? "Saving…"
    : failed
      ? "Retry save"
      : isDirty
        ? "Save changes"
        : "Saved";

  return (
    <button
      type="button"
      onClick={onSave}
      className={`btn btn-sm ${isDirty || failed || isSaving ? "btn-primary" : "btn-muted"} ${className}`}
      disabled={!canSave}
      aria-live="polite"
    >
      {isSaving && <Loader2 size={13} className="animate-spin" aria-hidden />}
      {!isSaving && !isDirty && !failed && <Check size={13} aria-hidden />}
      {label}
    </button>
  );
}
