"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

type ModalProps = {
  onClose: () => void;
  titleId: string; // id of heading inside children, for aria-labelledby
  children: ReactNode;
  maxWidth?: string; // Tailwind max-w class, defaults to max-w-lg
};

export default function Modal({
  onClose,
  titleId,
  children,
  maxWidth = "max-w-lg",
}: ModalProps) {
  const surfaceRef = useRef<HTMLDivElement>(null); // Ref to the modal surface for focus management

  // Callers pass inline arrows, so onClose changes on every parent render.
  // ref keeps the effect from running on every render, which would add/remove the event listener each time.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Focus management: when the modal opens, focus the surface. When it closes, return focus to the previously focused element.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0)
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = "hidden";
    surfaceRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      previouslyFocused?.focus();
    };
  }, []);

  return createPortal(
    // mousedown, not click: selecting text inside a field and releasing the
    // pointer over the backdrop fires a click there and would close the
    // dialog with the form half filled.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={surfaceRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-slot="dialog-surface"
        initial={{ opacity: 0, y: 10, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        className={`panel relative z-10 w-full ${maxWidth} rounded-xl elevated-xl overflow-hidden outline-none`}
      >
        {children}
      </motion.div>
    </div>,
    document.body,
  );
}
