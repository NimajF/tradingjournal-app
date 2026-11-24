"use client";

import { useEffect, useState } from "react";

// Just below where a clicked heading is, we want to highlight the heading that is currently in view. This hook will return the id of the heading that is currently in view.
const ACTIVE_LINE = 96;

export function useActiveHeading(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);
  // A new array every render would re-run the effect, so convert the array to a string so it can be used as a dependency.
  // The joined ids only change when the outline does.
  const idsKey = ids.join(" ");

  useEffect(() => {
    const headings = idsKey
      .split(" ")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= ACTIVE_LINE)
          current = heading.id;
        else break; // headings are in document order, so we can stop looking once we find one that is below the active line
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    // capture -> the app scrolls an inner div, and scroll doesn't bubble.

    document.addEventListener("scroll", onScroll, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("scroll", onScroll, {
        capture: true,
      });
      window.removeEventListener("resize", onScroll);
    };
  }, [idsKey]);

  return activeId;
}
