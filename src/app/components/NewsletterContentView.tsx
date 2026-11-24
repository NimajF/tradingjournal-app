import { APP_NAME } from "@/lib/constants/app";
import { isEmptyNoteContent } from "@/lib/utils/noteContent";
import { getReadingTime, formatPublishedOn } from "@/lib/utils/newsletter";
import { buildNewsletterToc } from "@/lib/utils/newsletter";
import NewsletterToc from "@/app/components/NewsletterToc";

type NewsletterContentViewProps = {
  content: string;
  title: string;
  description: string;
  coverImageUrl: string | null;
  createdAt?: string | null;
};

/**
 * Read-only render of a newsletter — the published piece, not a preview pane.
 */
export default function NewsletterContentView({
  content,
  title,
  description,
  coverImageUrl,
  createdAt,
}: NewsletterContentViewProps) {
  const readingTime = getReadingTime(content);
  const { html, toc } = buildNewsletterToc(content);
  const showToc = toc.length >= 2;
  const publishedOn = createdAt ? formatPublishedOn(createdAt) : null;
  const hasBody = !isEmptyNoteContent(content);

  return (
    <div className="@container w-full">
      <div className="@6xl:grid @6xl:grid-cols-[1fr_minmax(0,39.5rem)_1fr]">
        <article className="mx-auto w-full max-w-158 pb-20 pt-16 @6xl:col-start-2">
          {coverImageUrl && (
            <div className="mb-9 h-45 w-full overflow-hidden rounded-lg border border-border bg-surface-alt">
              <img
                src={coverImageUrl}
                alt="Newsletter cover"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <h1 className="text-[2.25rem] font-semibold leading-[1.08] tracking-[-0.022em] text-foreground">
            {title || "Untitled newsletter"}
          </h1>

          {description && (
            <p className="mt-3 text-pretty text-lg leading-normal text-muted-fg">
              {description}
            </p>
          )}

          <NewsletterMeta publishedOn={publishedOn} readingTime={readingTime} />

          {showToc && (
            <NewsletterToc
              items={toc}
              variant="inline"
              className="mb-8 @6xl:hidden"
            />
          )}

          {hasBody ? (
            <div
              className="newsletter-read tiptap"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <p className="font-mono text-sm text-subtle-fg">
              Nothing written yet.
            </p>
          )}
          <footer className="mt-16 flex items-center gap-2 border-t border-border-muted pt-4 font-mono text-xs text-subtle-fg">
            <span>{APP_NAME}</span>
            <span>·</span>
            <span>Newsletter</span>
          </footer>
        </article>
        {showToc && (
          <aside className="hidden @6xl:block pl-10 pt-16">
            <div className="sticky top-20">
              <NewsletterToc items={toc} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

/** The byline on its rule — shared with the editor so both read the same. */
export function NewsletterMeta({
  publishedOn,
  readingTime,
}: {
  publishedOn: string | null;
  readingTime: number;
}) {
  return (
    <div className="mb-8 mt-6 flex items-center gap-3.5 border-t border-border-muted pt-3.5 text-xs text-subtle-fg">
      {publishedOn && (
        <span className="font-mono tabular-nums">{publishedOn}</span>
      )}
      <span>{readingTime} min read</span>
    </div>
  );
}
