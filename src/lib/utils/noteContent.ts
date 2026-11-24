import { NoteContent } from "@/lib/types/note";
import DOMPurify from "isomorphic-dompurify";

// sanitize on write so every read path
// (owner view, public view) is safe without having to remember to sanitize
// on the way out too.
export function sanitizeNoteContent(html: NoteContent): NoteContent {
  return DOMPurify.sanitize(html);
}

// function type for uploading an image file, returning a promise that resolves to an object containing either an error message or the uploaded image data.
type UploadFn = (file: File) => Promise<{
  error: string | null;
  data: { cloudinary_url: string; public_id: string; id: string } | null;
}>;

const EMPTY_NOTE = "<p></p>";
export function isEmptyNoteContent(html: string): boolean {
  return html.trim() === "" || html.trim() === EMPTY_NOTE;
}

// Uploads any pending (not-yet-saved) images still sitting in the note as
// local blob: URLs, then swaps their src for the uploaded Cloudinary URL.
// pendingImages maps a blob URL to the File it came from, populated by
// RichTextEditor whenever an image is pasted/inserted, so we know which
// <img> tags actually need uploading (as opposed to ones already saved
// from a previous save).
export async function resolveNoteImageUploads(
  html: string,
  pendingImages: Map<string, File>,
  uploadFn: UploadFn,
): Promise<{ resolved: NoteContent; failedUploadsCount: number }> {
  if (pendingImages.size === 0)
    return { resolved: html, failedUploadsCount: 0 };

  const doc = new DOMParser().parseFromString(html, "text/html"); // Parse the HTML string into a DOM document
  const pendingImgs = Array.from(doc.querySelectorAll("img")).filter((img) =>
    pendingImages.has(img.getAttribute("src") ?? ""),
  ); // Filter <img> elems that have src in the pendingImages map

  const results = await Promise.allSettled(
    pendingImgs.map(async (img) => {
      const src = img.getAttribute("src");
      const file = pendingImages.get(src ?? "");
      const result = await uploadFn(file!);
      if (result.error || !result.data)
        throw new Error(result.error ?? "Upload failed");
      img.setAttribute("src", result.data.cloudinary_url);
      img.setAttribute("data-public-id", result.data.public_id);
      img.setAttribute("data-saved-id", result.data.id);
    }),
  );
  const failedUploadsCount = results.filter(
    (r) => r.status === "rejected",
  ).length;
  return { resolved: doc.body.innerHTML, failedUploadsCount }; // Return the updated HTML and the count of failed uploads
}
