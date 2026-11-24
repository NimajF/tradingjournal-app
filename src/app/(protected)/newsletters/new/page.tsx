import type { Metadata } from "next";
import NewsletterCreatePageClient from "./NewsletterCreatePageClient";

export const metadata: Metadata = { title: "New Newsletter" };

export default function NewsletterCreatePage() {
  return <NewsletterCreatePageClient />;
}
