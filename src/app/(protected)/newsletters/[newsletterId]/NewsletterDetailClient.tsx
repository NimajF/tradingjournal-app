"use client";

import { useState, useRef } from "react";
import { useSetBreadcrumbs } from "@/lib/nav/nav-context";
import RichTextEditor, {
  type RichTextEditorHandle,
} from "@/app/components/RichTextEditor";
import SaveButton from "@/app/components/SaveButton";
import { Newsletter } from "@/lib/types/newsletter";
import { useNewsletterEditor } from "@/lib/hooks/useNewsletterEditor";
import { getReadingTime, formatPublishedOn } from "@/lib/utils/newsletter";
import DeleteNewsletterModal from "../_components/DeleteNewsletterModal";
import NewsletterCoverImage from "./NewsletterCoverImage";
import NewsletterContentView, {
  NewsletterMeta,
} from "@/app/components/NewsletterContentView";
import NewsletterShareButton from "./NewsletterShareButton";
import { Star, Eye, PenLine, Trash2 } from "lucide-react";

type NewsletterDetailClientProps = {
  newsletter: Newsletter;
};

export default function NewsletterDetailClient({
  newsletter,
}: NewsletterDetailClientProps) {
  const {
    title,
    setTitle,
    description,
    setDescription,
    content,
    setContent,
    registerPendingImage,
    isFavorite,
    setIsFavorite,
    handleSaveNewsletter,
    handleDeleteImage,
    status,
    isDirty,
  } = useNewsletterEditor(newsletter);
  useSetBreadcrumbs([{ label: title }]);

  const richTextEditorRef = useRef<RichTextEditorHandle>(null);
  const readingTime = getReadingTime(content);
  const publishedOn = formatPublishedOn(newsletter.created_at);

  const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit");
  const [isDeleting, setIsDeleting] = useState(false);

  const isEditing = previewMode === "edit";

  return (
    <div className="flex min-h-full flex-col">
      {/* Document bar — Ghost's editor bar, in this app's vocabulary: the
          piece's state on the left (sharing, as the same status chip the
          list card shows), the actions on the right, in the order they're
          used: switch mode, mark, save. Sticky, so Save is always one move
          away on a long piece; glass is the one sanctioned sticky surface. */}
      <header className="sticky -top-2 z-20 -mt-2 border-b border-border-muted bg-[color-mix(in_srgb,var(--view)_85%,transparent)] pt-2 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-12 w-full max-w-7xl items-center gap-2">
          <NewsletterShareButton
            newsletterId={newsletter.id}
            initialIsPublic={newsletter.is_public}
          />

          <div className="ml-auto flex items-center gap-2">
            <div
              role="group"
              aria-label="View mode"
              className="inline-flex rounded-md border border-border bg-surface p-0.5"
            >
              {(
                [
                  { mode: "edit", label: "Write", Icon: PenLine },
                  { mode: "preview", label: "Preview", Icon: Eye },
                ] as const
              ).map(({ mode, label, Icon }) => {
                const active = previewMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPreviewMode(mode)}
                    aria-pressed={active}
                    className={`inline-flex h-7 items-center gap-1.5 rounded-[5px] px-2.5 text-[13px] font-medium transition-colors duration-150 ${
                      active
                        ? "bg-selected text-foreground"
                        : "text-muted-fg hover:text-foreground"
                    }`}
                  >
                    <Icon size={13} aria-hidden />
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sr-only sm:hidden">{label}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setIsFavorite((f) => !f)}
              className="btn btn-icon"
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
              aria-pressed={isFavorite}
              title={isFavorite ? "Unfavorite" : "Favorite"}
            >
              <Star
                size={16}
                className={isFavorite ? "fill-accent text-accent" : undefined}
              />
            </button>
            <button
              onClick={() => setIsDeleting(true)}
              className="btn btn-icon"
              aria-label="Delete newsletter"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
            <SaveButton
              status={status}
              isDirty={isDirty}
              onSave={() =>
                handleSaveNewsletter(richTextEditorRef.current?.getLatestHTML())
              }
            />
          </div>
        </div>
      </header>

      {isEditing ? (
        // Same box as NewsletterContentView — cover, title, lede, meta on a
        // rule, body — only editable.
        <div className="mx-auto w-full max-w-158 flex-1 pb-24 pt-16">
          <NewsletterCoverImage
            newsletterId={newsletter.id}
            initialCoverImageUrl={newsletter.cover_image_url}
          />

          {/* `field-bare` drops the field recipe (fill, edge, ring) from
              globals.css: this is a headline typed onto the page. */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Newsletter title"
            aria-label="Title"
            className="field-bare block w-full p-0 text-[2.25rem] font-semibold leading-[1.08] tracking-[-0.022em]
                     text-foreground placeholder:text-subtle-fg"
          />

          {/* Lede — also the email preview text; grows like the paragraph
              it becomes instead of clipping at a fixed row count. */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a lede — shown as preview text in email"
            aria-label="Subtitle"
            rows={1}
            className="field-bare mt-3 block w-full resize-none p-0 text-lg leading-normal text-pretty
                     text-muted-fg placeholder:text-subtle-fg field-sizing-content"
          />

          <NewsletterMeta publishedOn={publishedOn} readingTime={readingTime} />

          {/* `newsletter-edit` borrows the reading typography, so the body
              is written at the size it will be read at. */}
          <div className="newsletter-edit">
            <RichTextEditor
              ref={richTextEditorRef} // ref for parent component to access editor methods
              content={content}
              onChange={setContent}
              onInsertImage={registerPendingImage}
              onDeleteSavedImage={handleDeleteImage}
              placeholder="Write your newsletter…"
            />
          </div>
        </div>
      ) : (
        <NewsletterContentView
          content={content}
          title={title}
          description={description}
          coverImageUrl={newsletter.cover_image_url}
          createdAt={newsletter.created_at}
        />
      )}
      {isDeleting && (
        <DeleteNewsletterModal
          newsletterId={newsletter.id}
          title={title}
          onClose={() => setIsDeleting(false)}
        />
      )}
    </div>
  );
}
