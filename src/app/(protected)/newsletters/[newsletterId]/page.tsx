import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsletterById } from "@/app/actions/newsletter";
import NewsletterDetailClient from "@/app/(protected)/newsletters/[newsletterId]/NewsletterDetailClient";

type NewsletterPageProps = {
  params: Promise<{ newsletterId: string }>;
};

export async function generateMetadata({
  params,
}: NewsletterPageProps): Promise<Metadata> {
  const { newsletterId } = await params;
  const { data: newsletter } = await getNewsletterById(newsletterId);
  return { title: newsletter?.title ?? "Newsletter" };
}

export default async function NewsletterPage({ params }: NewsletterPageProps) {
  const { newsletterId } = await params;
  const { data, error } = await getNewsletterById(newsletterId);

  if (!data || error) notFound();
  return <NewsletterDetailClient newsletter={data} />;
}
