import Link from "next/link";

export default function Cta() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-background py-24 sm:py-32">
      <div className="lp-grain" aria-hidden="true" />
      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
        <h2 className="text-balance mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Start the record today
        </h2>
        <p className="mb-9 text-base text-muted-fg sm:text-lg">
          Free, always. No credit card, no broker connection.
        </p>
        <Link href="/register" className="btn btn-primary btn-lift btn-lg">
          Get Started
        </Link>
      </div>
    </section>
  );
}
