"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

// List state (search, filter, sort) mirrored to the URL, so it survives
// Back from a card, a reload, and a shared link. Local state is the source
// of truth so typing never waits on the router. URL is only a mirror.
export function useUrlState<T extends string>(
  key: string,
  defaultValue: T,
  allowed?: readonly T[],
) {
  const searchParams = useSearchParams();
  const [value, setValue] = useState<T>(() => {
    const raw = searchParams.get(key);
    if (raw === null) return defaultValue;
    // A hand-edited ?sort=garbage falls back instead of breaking the list.
    if (allowed && !allowed.includes(raw as T)) return defaultValue;
    return raw as T;
  });

  const update = (next: T) => {
    setValue(next);
    // Read the live URL, not `searchParams`. With several of these hooks on
    // one page (q, sort, filter), a stale snapshot would erase the others.
    const params = new URLSearchParams(window.location.search);
    if (next === defaultValue || next === "") params.delete(key);
    else params.set(key, next);
    const qs = params.toString();
    window.history.replaceState(
      null,
      "",
      qs ? `?${qs}` : window.location.pathname,
    );
  };
  return [value, update] as const;
}
