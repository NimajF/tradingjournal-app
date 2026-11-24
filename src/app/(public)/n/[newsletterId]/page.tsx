import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicNewsletterById } from "@/app/actions/newsletter-public";
import NewsletterContentView from "@/app/components/NewsletterContentView";
import ThemeToggle from "@/app/components/Layout/ThemeToggle";
import { APP_NAME } from "@/lib/constants/app";

type PublicNewsletterPageProps = {
  params: Promise<{ newsletterId: string }>;
};

export async function generateMetadata({
  params,
}: PublicNewsletterPageProps): Promise<Metadata> {
  const { newsletterId } = await params;
  const { data: newsletter } = await getPublicNewsletterById(newsletterId);

  if (!newsletter) return { title: "Newsletter" };

  return {
    title: newsletter.title || "Untitled newsletter",
    description: newsletter.description ?? undefined,
    robots: { index: false, follow: false }, // unlisted, no indexar
    openGraph: {
      title: newsletter.title || "Untitled newsletter",
      description: newsletter.description ?? undefined,
      images: newsletter.cover_image_url
        ? [newsletter.cover_image_url]
        : undefined,
    },
  };
}

export default async function PublicNewsletterPage({
  params,
}: PublicNewsletterPageProps) {
  const { newsletterId } = await params;
  const { data: newsletter, error } =
    await getPublicNewsletterById(newsletterId);

  if (!newsletter || error) notFound();

  return (
    // Same canvas as the app (--view), not the desk (--background).
    <div className="flex min-h-dvh flex-col bg-view">
      <header className="border-b border-border-muted px-5 sm:px-6">
        <div className="mx-auto flex h-14 w-full max-w-158 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-accent text-[10.5px] font-bold tracking-[-0.04em] text-accent-fg">
              TJ
            </span>
            <span className="text-[15px] font-[650] tracking-tight text-foreground">
              {APP_NAME}
            </span>
            <span className="text-subtle-fg">/</span>
            <span className="text-sm text-muted-fg">Newsletter</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 px-5 sm:px-6">
        <NewsletterContentView
          title={newsletter.title}
          description={newsletter.description ?? ""}
          content={newsletter.content ?? ""}
          coverImageUrl={newsletter.cover_image_url}
          createdAt={newsletter.created_at}
        />
      </main>
    </div>
  );
}
