"use client";

import { useId, useState } from "react";
import Modal from "@/app/components/Modal";
import { deleteNewsletter } from "@/app/actions/newsletter";

type Props = {
  newsletterId: string;
  title: string;
  onClose: () => void;
};

export default function DeleteNewsletterModal({
  newsletterId,
  title,
  onClose,
}: Props) {
  const uid = useId();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDelete = async () => {
    setIsDeleting(true);
    setError(null);
    const res = await deleteNewsletter(newsletterId);
    // On success the action redirects. Only get here on failure.
    if (res?.error) {
      setIsDeleting(false);
      setError(res.error);
    }
  };
  return (
    <Modal onClose={onClose} titleId={`${uid}-title`}>
      <div className="px-6 pt-5">
        <h2
          id={`${uid}-title`}
          className="text-[15px] font-semibold text-foreground tracking-tight"
        >
          Delete “{title.trim() || "Untitled"}”?
        </h2>
        <p className="mt-2 text-[13px] leading-normal text-muted-fg">
          This permanently deletes the newsletter, its cover and its images. If
          it’s shared, the public link stops working. This can’t be undone.
        </p>
        {error && (
          <div
            role="alert"
            className="mt-3 px-3 py-2.5 rounded-md bg-loss-muted border border-loss/20 text-loss-muted-fg text-[13px]"
          >
            {error}
          </div>
        )}
      </div>

      <div className="mt-5 border-t border-border bg-(--field-bg) px-6 py-3.5 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="btn btn-muted btn-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="btn btn-danger btn-sm"
        >
          {isDeleting ? "Deleting…" : "Delete newsletter"}
        </button>
      </div>
    </Modal>
  );
}
