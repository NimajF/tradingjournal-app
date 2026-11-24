"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSetBreadcrumbs } from "@/lib/nav/nav-context";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { createNewsletter } from "@/app/actions/newsletter";

export default function NewsletterCreatePageClient() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useSetBreadcrumbs([{ label: "New" }]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsLoading(true);
    setError(null);
    const res = await createNewsletter({
      title: title.trim(),
      description: description.trim() || null,
    });
    setIsLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      router.push(`/newsletters/${res.data.id}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="mx-auto w-full max-w-2xl flex items-center gap-3 sm:px-8 pt-6 md:pt-8 pb-6">
        <Link href="/newsletters" className="btn btn-icon">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-[1.875rem] text-foreground">
          New newsletter
        </h1>
      </div>

      <div className="mx-auto w-full max-w-2xl sm:px-8 pb-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekly Market Recap"
              autoFocus
              className="w-full px-3 py-2 text-sm border rounded-md text-foreground placeholder:text-subtle-fg"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground">
              Description{" "}
              <span className="text-subtle-fg font-normal">optional</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief summary of what this newsletter covers…"
              rows={3}
              className="w-full px-3 py-2 text-sm border rounded-md text-foreground placeholder:text-subtle-fg resize-none"
            />
          </div>

          {error && <p role="alert" className="text-[13px] text-danger">{error}</p>}

          <div className="flex items-center gap-2 pt-1">
            <Link href="/newsletters" className="btn btn-muted btn-sm">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!title.trim() || isLoading}
              className="btn btn-primary btn-sm"
            >
              {isLoading && <Loader2 size={13} className="animate-spin" />}
              {isLoading ? "Creating…" : "Create newsletter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
