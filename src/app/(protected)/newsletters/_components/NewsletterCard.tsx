import Image from "next/image";
import Link from "next/link";
import type { Newsletter } from "@/lib/types/newsletter";
import { getReadingTime } from "@/lib/utils/newsletter";
import { isEmptyNoteContent } from "@/lib/utils/noteContent";
import { Globe, Star } from "lucide-react";

/* The year only appears when it is not this one: "Oct 11" reads faster than
   "Oct 11, 2026" and a card row is a scan, not a record. */
function shortDate(value: string) {
  const d = new Date(value);
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  }).format(d);
}

interface NewsletterCardProps {
  newsletter: Newsletter;
}

/* Ledger's newsletter card. The cover runs edge to edge under a hairline, then
   title, optional description and one meta row. Private is the default, so only
   Public gets a mark. */
export default function NewsletterCard({ newsletter }: NewsletterCardProps) {
  const hasImage = !!newsletter.cover_image_url;
  const minutes =
    newsletter.content && !isEmptyNoteContent(newsletter.content)
      ? getReadingTime(newsletter.content)
      : null;

  return (
    <Link
      href={`/newsletters/${newsletter.id}`}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl
                 bg-surface border border-border shadow-(--shadow-card)
                 hover:-translate-y-0.5 hover:border-(--lift-edge) hover:shadow-(--shadow-lift)
                 transition-[transform,box-shadow,border-color] duration-(--dur-3) ease-(--ease)"
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden border-b border-border-muted bg-surface-alt">
        {hasImage ? (
          <Image
            src={newsletter.cover_image_url!}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          /* No artwork: the cover becomes the lede, so the description
             is read here and not repeated below. */
          <p
            aria-hidden
            className="line-clamp-5 px-4.5 py-4 text-[13px] leading-relaxed text-muted-fg"
          >
            {newsletter.description || newsletter.title}
          </p>
        )}
      </div>

      <div className="grid flex-1 content-start gap-1 px-4 pb-1 pt-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3
            data-slot="card-title"
            className="min-w-0 text-[14.5px] font-semibold leading-snug text-foreground"
          >
            {newsletter.title}
          </h3>
          {newsletter.is_favorite && (
            <span className="mt-1 inline-flex shrink-0">
              <Star size={13} aria-hidden className="text-accent fill-accent" />
              <span className="sr-only">Favorite</span>
            </span>
          )}
        </div>
        {hasImage && newsletter.description && (
          <p className="line-clamp-2 text-[13px] leading-normal text-muted-fg">
            {newsletter.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 px-4 pb-3.5 pt-2.5 text-xs text-muted-fg">
        <time
          dateTime={newsletter.created_at}
          className="[font-variant-numeric:tabular-nums]"
        >
          {shortDate(newsletter.created_at)}
        </time>
        {minutes !== null && (
          <span className="[font-variant-numeric:tabular-nums]">
            {minutes} min read
          </span>
        )}
        {newsletter.is_public && (
          <span className="ml-auto inline-flex items-center gap-1 font-medium text-accent-muted-fg">
            <Globe size={12} aria-hidden />
            Public
          </span>
        )}
      </div>
    </Link>
  );
}
