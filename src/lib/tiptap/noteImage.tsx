"use client";

import Image, { type ImageOptions } from "@tiptap/extension-image";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";
import { Trash2 } from "lucide-react";

export type NoteImageAttrs = {
  src: string;
  "data-public-id": string | null;
  "data-saved-id": string | null;
};

// The node view is the <img> + a hover delete button
function NoteImageView({ node, deleteNode, extension }: NodeViewProps) {
  const attrs = node.attrs as NoteImageAttrs;

  const handleDelete = () => {
    extension.options.onDeleteImage?.(attrs); // Call the onDeleteImage callback if provided
    deleteNode();
  };

  return (
    <NodeViewWrapper className="relative inline-block group/image">
      <img src={attrs.src} alt="" className="max-w-full rounded-lg" />
      <button
        type="button"
        onClick={handleDelete}
        className="absolute top-1 right-1 p-1 rounded-md bg-surface/80 opacity-0 group-hover/image:opacity-100 text-subtle-fg hover:text-foreground transition-opacity"
      >
        <Trash2 size={14} />
      </button>
    </NodeViewWrapper>
  );
}

// Extends Tiptaps base Image node with Cloudinary identity fields and
// a delete. onDeleteImage is set via .configure() by
// RichTextEditor - it decides whether this was a saved image (call
// onDeleteSavedImage) or still a local blob: preview (just revoke it).
type NoteImageOptions = ImageOptions & {
  onDeleteImage?: (attrs: NoteImageAttrs) => void;
};

export const NoteImage = Image.extend<NoteImageOptions>({
  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
      resize: false as const,
      ...this.parent?.(), // spread after to override defaults
      onDeleteImage: undefined,
    };
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      "data-public-id": {
        default: null,
        parseHTML: (el) => el.getAttribute("data-public-id"),
      },
      "data-saved-id": {
        default: null,
        parseHTML: (el) => el.getAttribute("data-saved-id"),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(NoteImageView);
  },
});
