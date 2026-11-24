"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  memo,
} from "react";
import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { NoteImage, type NoteImageAttrs } from "@/lib/tiptap/noteImage";
import { SlashCommand } from "@/lib/tiptap/slashCommand";
import {
  AlignLeft,
  AlignRight,
  AlignCenter,
  ImagePlus,
  Highlighter,
  Baseline,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Underline as UnderlineIcon,
  Link2,
  Trash2,
} from "lucide-react";

const PALETTE = [
  { color: "#9ca3af", label: "Gray" },
  { color: "#ef4444", label: "Red" },
  { color: "#22c55e", label: "Green" },
  { color: "#3b82f6", label: "Blue" },
  { color: "#f97316", label: "Orange" },
  { color: "#a855f7", label: "Purple" },
];
const HIGHLIGHT_PALETTE = [
  { color: "#fef08a", label: "Yellow" },
  { color: "#bbf7d0", label: "Green" },
  { color: "#bfdbfe", label: "Blue" },
  { color: "#fecaca", label: "Red" },
  { color: "#e9d5ff", label: "Purple" },
];
const HEADINGS = [
  { level: 2, Icon: Heading2, label: "Heading" },
  { level: 3, Icon: Heading3, label: "Subheading" },
] as const; // const for making TS know that is exactly 2 | 3, not a number.

type RichTextEditorProps = {
  content: string;
  onChange: (html: string) => void;
  // Registers a picked/pasted file as a pending upload and returns a local
  // blob: URL to insert into the doc immediately, the actual upload only
  // happens on Save (see useTradeEditor/useNewsletterEditor).
  onInsertImage: (file: File) => string;
  onDeleteSavedImage?: (savedId: string, publicId: string) => void;
  placeholder?: string;
};

export type RichTextEditorHandle = {
  getLatestHTML: () => string;
}; // The imperative handle type for the RichTextEditor component, allowing parent components to access the latest HTML content of the editor.

export default memo(
  forwardRef<RichTextEditorHandle, RichTextEditorProps>(function RichTextEditor(
    { content, onChange, onInsertImage, onDeleteSavedImage, placeholder },
    ref: React.Ref<RichTextEditorHandle>,
  ) {
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined); // Ref to store the debounce timeout ID
    const fileInputRef = useRef<HTMLInputElement>(null); // Ref to the hidden file input for image uploads
    const linkRangeRef = useRef<{ from: number; to: number } | null>(null);

    const [isEditingLink, setIsEditingLink] = useState(false); // Track if the user is currently editing a link
    const [linkUrlDraft, setLinkUrlDraft] = useState(""); // Draft URL for the link being edited

    // NoteImages onDeleteImage option is captured when the editor is
    // created, so a changing onDeleteSavedImage prop wouldnt reach it. We
    // read the latest value through a ref instead, behind a stable callback.
    const onDeleteSavedImageRef = useRef(onDeleteSavedImage);
    useEffect(() => {
      onDeleteSavedImageRef.current = onDeleteSavedImage;
    }, [onDeleteSavedImage]); // Update the ref whenever the prop changes

    const handleDeleteImage = useCallback((attrs: NoteImageAttrs) => {
      if (attrs["data-saved-id"] && attrs["data-public-id"]) {
        // If the image has saved IDs, call the onDeleteSavedImage callback
        onDeleteSavedImageRef.current?.(
          attrs["data-saved-id"],
          attrs["data-public-id"],
        );
      } else if (attrs.src.startsWith("blob:")) {
        URL.revokeObjectURL(attrs.src); // Revoke the blob URL to free memory
      }
    }, []); // Stable callback for deleting images. saved or local blobs

    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          link: { openOnClick: false },
          underline: {},
        }),
        TextStyle,
        Color,
        TextAlign.configure({ types: ["paragraph", "heading"] }),
        Highlight.configure({ multicolor: true }),
        NoteImage.configure({ onDeleteImage: handleDeleteImage }),
        Placeholder.configure({ placeholder: placeholder ?? "" }),
        // "/" on an empty line opens the block menu (headings, lists, image…).
        SlashCommand.configure({
          onPickImage: () => fileInputRef.current?.click(),
        }),
      ],
      content,
      onUpdate({ editor }) {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          onChange(editor.getHTML());
        }, 300);
      },
      editorProps: {
        attributes: {
          class:
            "outline-none text-foreground text-sm leading-relaxed min-h-[1.25rem]",
        },
        handlePaste(_, event) {
          const imageItem = Array.from(event.clipboardData?.items ?? []).find(
            (item) => item.type.startsWith("image/"),
          );
          if (imageItem) {
            event.preventDefault();
            const file = imageItem.getAsFile();
            if (file) {
              const url = onInsertImage(file);
              editor?.chain().focus().setImage({ src: url }).run();
            }
            return true;
          }
          return false;
        },
      },
    });

    useImperativeHandle(
      ref,
      () => ({
        getLatestHTML: () => editor?.getHTML() ?? content,
      }),
      [editor, content],
    );

    // Tiptap only uses `content` to seed the editor on mount, it doesnt
    // react to prop changes. This effect updates the editor content if the prop changes.
    useEffect(() => {
      if (!editor) return;
      const isSame = editor.getHTML() === content;
      if (!isSame) {
        editor.commands.setContent(content, { emitUpdate: false }); // Update the editor content without triggering the onUpdate callback
      }
    }, [content, editor]);

    if (!editor) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = onInsertImage(file);
        editor.chain().focus().setImage({ src: url }).run();
      }
      e.target.value = ""; // Reset input so the same file can be selected again
    };

    const confirmLink = () => {
      const raw = linkUrlDraft.trim();
      const url =
        raw && !/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(raw)
          ? `https://${raw}`
          : raw;
      const range = linkRangeRef.current;
      let chain = editor.chain().focus();
      if (range) chain = chain.setTextSelection(range);
      if (url) {
        chain.extendMarkRange("link").setLink({ href: url }).run();
      } else {
        chain.extendMarkRange("link").unsetLink().run();
      }
      setIsEditingLink(false);
    };

    return (
      <div>
        <BubbleMenu
          editor={editor}
          updateDelay={0}
          options={{ placement: "top", offset: 8 }}
          className="panel flex items-center gap-0.5 bg-surface border border-border rounded-xl px-1.5 py-1 elevated-lg"
        >
          {isEditingLink ? (
            <div className="flex items-center gap-1 px-1 py-0.5">
              <input
                autoFocus
                type="text"
                value={linkUrlDraft}
                onChange={(e) => setLinkUrlDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    confirmLink();
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    setIsEditingLink(false);
                  }
                }}
                placeholder="https://…"
                className="w-48 bg-transparent text-sm text-foreground placeholder:text-subtle-fg outline-none px-1"
              />
              {editor.isActive("link") && (
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const { from, to } = editor.state.selection;
                    linkRangeRef.current = { from, to };
                    const currentUrl = editor.getAttributes("link").href as
                      | string
                      | undefined;
                    setLinkUrlDraft(currentUrl ?? "");
                    setIsEditingLink(false);
                  }}
                  className="p-1 rounded text-subtle-fg hover:text-foreground transition-colors"
                  title="Remove link"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ) : (
            <>
              {" "}
              {HEADINGS.map(({ level, Icon, label }) => {
                const active = editor.isActive("heading", { level });
                return (
                  <button
                    key={level}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      editor.chain().focus().toggleHeading({ level }).run();
                    }}
                    className={`p-1 rounded transition-colors ${
                      active
                        ? "bg-surface-alt text-foreground"
                        : "text-subtle-fg hover:text-foreground"
                    }`}
                    title={label}
                    aria-label={label}
                    aria-pressed={active}
                  >
                    <Icon size={14} />
                  </button>
                );
              })}
              <div className="w-px h-4 bg-border mx-1.5" />
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleBold().run();
                }}
                className={`p-1 rounded transition-colors ${
                  editor.isActive("bold")
                    ? "bg-surface-alt text-foreground"
                    : "text-subtle-fg hover:text-foreground"
                }`}
                title="Bold (Ctrl+B)"
                aria-label="Bold"
                aria-pressed={editor.isActive("bold")}
              >
                <Bold size={14} />
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleItalic().run();
                }}
                className={`p-1 rounded transition-colors ${
                  editor.isActive("italic")
                    ? "bg-surface-alt text-foreground"
                    : "text-subtle-fg hover:text-foreground"
                }`}
                title="Italic (Ctrl+I)"
                aria-label="Italic"
                aria-pressed={editor.isActive("italic")}
              >
                <Italic size={14} />
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleUnderline().run();
                }}
                className={`p-1 rounded transition-colors ${
                  editor.isActive("underline")
                    ? "bg-surface-alt text-foreground"
                    : "text-subtle-fg hover:text-foreground"
                }`}
                title="Underline (Ctrl+U)"
                aria-label="Underline"
                aria-pressed={editor.isActive("underline")}
              >
                <UnderlineIcon size={14} />
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  const currentUrl = editor.getAttributes("link").href as
                    | string
                    | undefined;
                  setLinkUrlDraft(currentUrl ?? "");
                  setIsEditingLink(true);
                }}
                className={`p-1 rounded transition-colors ${
                  editor.isActive("link")
                    ? "bg-surface-alt text-foreground"
                    : "text-subtle-fg hover:text-foreground"
                }`}
                title="Link"
                aria-label="Link"
                aria-pressed={editor.isActive("link")}
              >
                <Link2 size={14} />
              </button>
              <div className="w-px h-4 bg-border mx-1.5" />
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().setTextAlign("left").run();
                }}
                className={`p-1 rounded transition-colors ${
                  editor.isActive({ textAlign: "left" })
                    ? "bg-surface-alt text-foreground"
                    : "text-subtle-fg hover:text-foreground"
                }`}
                title="Align left"
                aria-label="Align left"
                aria-pressed={editor.isActive({ textAlign: "left" })}
              >
                <AlignLeft size={12} />
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().setTextAlign("center").run();
                }}
                className={`p-1 rounded transition-colors ${
                  editor.isActive({ textAlign: "center" })
                    ? "bg-surface-alt text-foreground"
                    : "text-subtle-fg hover:text-foreground"
                }`}
                title="Align center"
                aria-label="Align center"
                aria-pressed={editor.isActive({ textAlign: "center" })}
              >
                <AlignCenter size={12} />
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().setTextAlign("right").run();
                }}
                className={`p-1 rounded transition-colors ${
                  editor.isActive({ textAlign: "right" })
                    ? "bg-surface-alt text-foreground"
                    : "text-subtle-fg hover:text-foreground"
                }`}
                title="Align right"
                aria-label="Align right"
                aria-pressed={editor.isActive({ textAlign: "right" })}
              >
                <AlignRight size={12} />
              </button>
              <div className="w-px h-4 bg-border mx-0.5" />
              <div className="flex items-center gap-1.5 px-1">
                <Baseline size={13} className="text-subtle-fg shrink-0" />
                {PALETTE.map(({ color, label }) => (
                  <button
                    key={color}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      editor.isActive("textStyle", { color })
                        ? editor.chain().focus().unsetColor().run()
                        : editor.chain().focus().setColor(color).run();
                    }}
                    className="w-3.5 h-3.5 rounded-full border border-border/50 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={`${label} text`}
                    aria-label={`${label} text color`}
                    aria-pressed={editor.isActive("textStyle", { color })}
                  />
                ))}
              </div>
              <div className="w-px h-4 bg-border mx-0.5" />
              <div className="flex items-center gap-1.5 px-1">
                <Highlighter size={13} className="text-subtle-fg shrink-0" />
                {HIGHLIGHT_PALETTE.map(({ color, label }) => (
                  <button
                    key={color}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      editor.isActive("highlight", { color })
                        ? editor.chain().focus().unsetHighlight().run()
                        : editor
                            .chain()
                            .focus()
                            .toggleHighlight({ color })
                            .run();
                    }}
                    className={`w-3.5 h-3.5 rounded-full border border-border/50 hover:scale-110 transition-transform ${
                      editor.isActive("highlight", { color })
                        ? "ring-2 ring-foreground/50 ring-offset-1 ring-offset-surface"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                    title={label}
                    aria-label={`${label} highlight`}
                    aria-pressed={editor.isActive("highlight", { color })}
                  />
                ))}
              </div>
            </>
          )}
        </BubbleMenu>
        <EditorContent editor={editor} />
        <div className="pt-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs text-subtle-fg hover:text-foreground transition-colors"
          >
            <ImagePlus size={13} />
            Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    );
  }),
);
