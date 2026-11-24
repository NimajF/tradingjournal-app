import type { NoteContent } from "@/lib/types/note";

const WORDS_PER_MINUTE = 200;

// Strips HTML tags so markup doesnt get counted as words. Shared by the
// editors byline and the reading view, which both surface it.
export function getReadingTime(html: NoteContent): number {
  const text = html.replace(/<[^>]*>/g, "").trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

// Shared so the byline reads identically while editing and once published.
export function formatPublishedOn(createdAt: string): string {
  return new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export type TocItem = { id: string; text: string; level: 1 | 2 | 3 };

// <h1>–<h3> with any attributes (Tiptap adds style for text-align).
// \1 makes the closing tag match the opening level.
const HEADING_RE = /<h([1-3])([^>]*)>([\s\S]*?)<\/h\1>/g;

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&"); // last, so "&amp;lt;" decodes to "&lt;", not "<"
}

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents: "miércoles" → "miercoles"
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Gives every heading an id and returns the outline, in one pass so the ids
// in the HTML and in the TOC cant drift apart. Runs at render time (server
// and client), so existing newsletters get an idx without migration.
export function buildNewsletterToc(html: NoteContent): {
  html: NoteContent;
  toc: TocItem[];
} {
  const toc: TocItem[] = [];
  const used = new Set<string>();

  const withIds = html.replace(HEADING_RE, (match, level, attrs, inner) => {
    const text = decodeEntities(inner.replace(/<[^>]*>/g, ""))
      .replace(/\s+/g, " ")
      .trim();
    if (!text) return match; // empty heading: nothing to link to

    const base = slugify(text) || "section"; // like a heading that is only emoji
    let id = base;
    for (let i = 2; used.has(id); i++) id = `${base}-${i}`;
    used.add(id);

    toc.push({ id, text, level: Number(level) as TocItem["level"] });
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });

  return { html: withIds, toc };
}

// What a reader sees, for search. Tags out, entities decoded. Tags become a
// space, not "", so "<p>long</p><p>NVDA</p>" reads "long NVDA", not "longNVDA".
export function htmlToPlainText(html: NoteContent): string {
  return decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}
