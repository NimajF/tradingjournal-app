import { useState, useRef, useCallback } from "react";
import { Newsletter } from "@/lib/types/newsletter";
import { NoteContent } from "@/lib/types/note";
import {
  resolveNoteImageUploads,
  isEmptyNoteContent,
} from "@/lib/utils/noteContent";
import { updateNewsletter } from "@/app/actions/newsletter";
import {
  uploadNewsletterImage,
  deleteNewsletterImage,
} from "@/app/actions/newsletter-images";
import useUnsavedChangesWarning from "@/lib/hooks/useUnsavedChangesWarning";
import { toast } from "sonner";

export function useNewsletterEditor(initial: Newsletter) {
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description ?? "");
  const initialContent: NoteContent = initial.content || "<p></p>";
  const [content, setContent] = useState<NoteContent>(initialContent);
  const [isFavorite, setIsFavorite] = useState(initial.is_favorite);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  // Last persisted version, to know whether there are unsaved changes.
  const [savedSnapshot, setSavedSnapshot] = useState({
    title: initial.title,
    description: initial.description ?? "",
    content: initialContent,
    isFavorite: initial.is_favorite,
  });
  const isDirty =
    JSON.stringify(savedSnapshot) !==
    JSON.stringify({ title, description, content, isFavorite });
  useUnsavedChangesWarning(isDirty); // Warn the user if they try to leave with unsaved changes

  const pendingImagesRef = useRef(new Map<string, File>());

  // Images removed from the doc but not yet deleted from storage, until
  // the save succeeds — mirrors pendingImagesRef, but for deletions.
  const pendingDeletesRef = useRef(new Map<string, string>());

  const registerPendingImage = useCallback((file: File): string => {
    const url = URL.createObjectURL(file);
    pendingImagesRef.current.set(url, file);
    return url;
  }, []);

  async function handleSaveNewsletter(latestContent?: NoteContent) {
    setStatus("saving");
    try {
      const contentToSave = latestContent ?? content; // Use the latest content from the editor if provided, otherwise use current state
      // Upload any pending image blocks first
      const { resolved, failedUploadsCount } = await resolveNoteImageUploads(
        contentToSave,
        pendingImagesRef.current,
        (file) => uploadNewsletterImage(initial.id, file),
      );

      // Persist whatever succeeded so a retry doesn't re-upload it, then stop before touching the newsletter if any image failed.
      setContent(resolved);

      if (failedUploadsCount > 0) {
        toast.error(
          `Failed to upload ${failedUploadsCount} image(s). Please retry.`,
        );
        setStatus("error");
        return;
      }
      pendingImagesRef.current.clear();

      const res = await updateNewsletter(initial.id, {
        title: title.trim() || initial.title,
        description: description.trim() || null,
        content: isEmptyNoteContent(resolved) ? null : resolved,
        is_favorite: isFavorite,
      });
      if (res.error) {
        toast.error(`Error saving newsletter: ${res.error}`);
        setStatus("error");
      } else {
        toast.success("Newsletter saved successfully!");
        setStatus("saved");
        setSavedSnapshot({ title, description, content: resolved, isFavorite });

        // see useTradeEditor.ts for comments on this logic. Same idea applied here.
        if (pendingDeletesRef.current.size > 0) {
          const deletes = Array.from(pendingDeletesRef.current.entries());
          const results = await Promise.allSettled(
            deletes.map(([savedId, publicId]) =>
              deleteNewsletterImage(savedId, publicId),
            ),
          );
          results.forEach((result, idx) => {
            if (result.status === "fulfilled") {
              pendingDeletesRef.current.delete(deletes[idx][0]);
            }
          });
        }
      }
    } catch {
      toast.error("Error saving newsletter.");
      setStatus("error");
    }
  }

  const handleDeleteImage = useCallback((savedId: string, publicId: string) => {
    pendingDeletesRef.current.set(savedId, publicId);
  }, []);

  return {
    title,
    setTitle,
    description,
    setDescription,
    content,
    setContent,
    registerPendingImage,
    isFavorite,
    setIsFavorite,
    status,
    handleSaveNewsletter,
    handleDeleteImage,
    isDirty,
  };
}
