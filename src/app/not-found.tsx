import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg text-center space-y-8">
        {/* 404 */}
        <div className="space-y-2">
          <div className="text-8xl font-bold text-accent">404</div>
          <h1 className="text-3xl font-bold text-foreground">Page not found</h1>
          <p className="text-muted-fg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Illustration area */}
        <div className="border-2 border-dashed border-border rounded-lg p-12 bg-surface">
          <div className="space-y-2">
            <div className="h-3 w-24 bg-border rounded mx-auto"></div>
            <div className="h-3 w-32 bg-border/60 rounded mx-auto"></div>
            <div className="h-3 w-20 bg-border/40 rounded mx-auto mt-4"></div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-2 rounded-md bg-accent hover:bg-accent-hover text-accent-fg font-medium transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/journal"
            className="px-6 py-2 rounded-md border border-border text-foreground hover:bg-surface-alt transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
