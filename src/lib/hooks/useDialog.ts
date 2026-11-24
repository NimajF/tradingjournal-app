import { useEffect, useRef } from "react";

export function useDialog(onClose: () => void) {
  const onCloseRef = useRef(onClose);

  // Callers pass inline arrows, so onClose changes on every parent render.
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Locks body scroll, closes on Escape, and returns focus to whatever had it before the dialog opened.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    // If the scrollbar is visible, add padding to the body so the content doesn't shift when the scrollbar disappears.
    if (scrollbarWidth > 0)
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented) onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      previouslyFocused?.focus();
    };
  }, []);
}
