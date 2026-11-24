import Link from "next/link";
import { Plus } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
};

// A list page with nothing in it yet. No box: the page is the container, so
// an empty list reads as a quiet page rather than a card on a page. One
// action, the same one the page header would offer.
export default function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-4 pt-24 pb-16 text-center">
      <h2 className="text-[17px] font-semibold leading-snug tracking-[-0.02em] text-foreground text-balance">
        {title}
      </h2>
      <p className="mt-1.5 max-w-sm text-[13px] leading-normal text-muted-fg text-pretty">
        {description}
      </p>
      <Link href={actionHref} className="btn btn-primary btn-sm mt-5">
        <Plus size={14} aria-hidden /> {actionLabel}
      </Link>
    </div>
  );
}
