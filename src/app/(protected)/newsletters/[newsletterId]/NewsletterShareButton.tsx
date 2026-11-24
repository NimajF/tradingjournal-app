"use client";

import { useState, useRef, useEffect } from "react";
import { toggleNewsletterPublic } from "@/app/actions/newsletter";
import { ChevronDown, Copy, Check, Loader2, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

type NewsletterShareButtonProps = {
  newsletterId: string;
  initialIsPublic: boolean;
};

export default function NewsletterShareButton({
  newsletterId,
  initialIsPublic,
}: NewsletterShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [toggling, setToggling] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/n/${newsletterId}`
      : "";

  async function handleToggle() {
    const next = !isPublic; // Determine the next state
    setToggling(true);
    const res = await toggleNewsletterPublic(newsletterId, next);
    setToggling(false);
    if (res.error) {
      toast.error(`Couldn't update sharing: ${res.error}`);
      return;
    }
    setIsPublic(next);
    toast.success(
      next ? "Newsletter is now public" : "Newsletter is now private",
    );
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div ref={ref} className="relative">
      {/* The trigger IS the status: the same dot chip the list card shows,
          so the piece's visibility reads before anything is clicked. */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`btn btn-sm min-h-7! gap-1.5 px-2! py-0! text-[13px] ${
          isPublic
            ? "bg-accent/10 text-accent hover:bg-accent/15"
            : "bg-surface-alt text-muted-fg hover:bg-hover hover:text-foreground"
        }`}
        aria-label={`Sharing: ${isPublic ? "public" : "private"}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span aria-hidden className="size-1.5 rounded-full bg-current" />
        {isPublic ? "Public" : "Private"}
        <ChevronDown
          size={13}
          aria-hidden
          className={`text-subtle-fg transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Share newsletter"
          className="panel absolute! left-0 top-full z-50 mt-2 w-80 origin-top-left rounded-xl border border-border bg-surface-overlay elevated-lg animate-in fade-in-0 zoom-in-95 duration-150 motion-reduce:animate-none"
        >
          <div className="flex items-start justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                Share to web
              </p>
              <p className="mt-1 text-[13px] leading-snug text-muted-fg">
                {isPublic
                  ? "Anyone with the link can read it. Not listed in search."
                  : "Only you can see this newsletter."}
              </p>
            </div>
            {/* A real switch: a track and a thumb, not a button whose label
                flips between two words. */}
            <button
              onClick={handleToggle}
              disabled={toggling}
              role="switch"
              aria-checked={isPublic}
              aria-label="Public link"
              className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-150 disabled:opacity-60 ${
                isPublic
                  ? "border-accent bg-accent"
                  : "border-border-base bg-surface-alt"
              }`}
            >
              <span
                aria-hidden
                className={`flex size-3.5 items-center justify-center rounded-full transition-transform duration-150 motion-reduce:transition-none ${
                  isPublic
                    ? "translate-x-[17px] bg-accent-fg"
                    : "translate-x-[2px] bg-muted-fg"
                }`}
              >
                {toggling && (
                  <Loader2 size={10} className="animate-spin text-accent" />
                )}
              </span>
            </button>
          </div>

          {isPublic && (
            <div className="border-t border-border-muted p-3">
              <div className="flex items-center gap-2">
                <span className="min-w-0 flex-1 truncate rounded-md border border-border bg-(--field-bg) px-2.5 py-1.5 font-mono text-xs text-muted-fg">
                  {shareUrl.replace(/^https?:\/\//, "")}
                </span>
                <button
                  onClick={handleCopy}
                  className="btn btn-sm btn-muted w-[5.25rem] shrink-0"
                >
                  {copied ? (
                    <Check size={13} className="text-accent" aria-hidden />
                  ) : (
                    <Copy size={13} aria-hidden />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2.5 inline-flex items-center gap-1 text-[13px] text-muted-fg transition-colors hover:text-foreground"
              >
                Open public page
                <ArrowUpRight size={13} aria-hidden />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
