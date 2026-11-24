"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useDialog } from "@/lib/hooks/useDialog";

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
  const surfaceRef = useRef<HTMLDivElement>(null);
  useDialog(onClose);

  // Move focus into the dialog so Tab and screen readers start inside it.
  // Runs after useDialog's effect, which has already saved the trigger to restore on close.
  useEffect(() => {
    surfaceRef.current?.focus();
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
