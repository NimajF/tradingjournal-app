import type { Metadata } from "next";
import NewslettersList from "@/app/(protected)/newsletters/_components/NewslettersList";

import { getNewsletters } from "@/app/actions/newsletter";

export const metadata: Metadata = { title: "Newsletters" };

export default async function NewsletterPage() {
  const { data, error } = await getNewsletters();

  if (error) {
    return (
      <div className="min-h-96 p-6">
        <p className="text-loss text-sm">
          Error loading newsletters: {error}
        </p>
      </div>
    );
  }

  return <NewslettersList newsletters={data ?? []} />;
}
