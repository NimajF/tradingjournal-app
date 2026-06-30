"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import NewTradeForm from "@/app/(protected)/NewTradeFormModal";
import { PlusIcon } from "lucide-react";

export default function GlobalAddButton() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  const feature = pathname.split("/")[1]; // e.g. "journal", "newsletter", etc.

  return (
    <>
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full p-4 bg-accent text-accent-fg shadow-lg transition-all duration-150 hover:bg-accent-hover hover:shadow-xl hover:scale-105 active:scale-95"
      >
        <PlusIcon size={20} />
      </button>
      {isVisible && feature === "journal" && (
        <NewTradeForm onClose={() => setIsVisible(false)} />
      )}
    </>
  );
}
