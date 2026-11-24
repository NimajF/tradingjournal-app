"use client";

import { useEffect } from "react";
import { APP_NAME } from "@/lib/constants/app";

const TITLE = `Page not found · ${APP_NAME}`;

// not-found.tsx can't export metadata, and Next streams the root layout's
// <title> in after hydration, so a one-off assignment gets overwritten. The
// title is held for as long as this page is mounted.
export default function NotFoundTitle() {
  useEffect(() => {
    const previous = document.title;
    const hold = () => {
      if (document.title !== TITLE) document.title = TITLE;
    };
    hold();
    const observer = new MutationObserver(hold);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => {
      observer.disconnect();
      if (document.title === TITLE) document.title = previous;
    };
  }, []);
  return null;
}
