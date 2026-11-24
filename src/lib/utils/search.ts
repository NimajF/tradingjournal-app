// Case- and accent-insensitive: "nvda" finds "NVDA", "analisis" finds "Análisis".

export function normalizeText(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Every word of the query must appear somewhere in the fields, in any order:
// "nvda marzo" matches a journal named "Marzo" that traded NVDA.
export function matchesQuery(
  query: string,
  fields: (string | null | undefined)[],
): boolean {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true; // empty search matches everything
  const haystack = normalizeText(fields.filter(Boolean).join(" "));
  return words.every((w) => haystack.includes(w));
}
