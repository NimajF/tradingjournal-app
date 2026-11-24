// Renders a synchronous inline <script> without triggering react's dev-mode
// "script tag" warning. server emits `type="text/javascript"` so the
// browser executes it during HTML parsing (before hydration) on the client
// its rendered as `type="text/plain"` so React doesnt warn about producing
// a live script tag. `suppressHydrationWarning` covers the type mismatch.
// see node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
