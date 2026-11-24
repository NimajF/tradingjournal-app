"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Link2 } from "lucide-react";

const EXPO = [0.16, 1, 0.3, 1] as const;

// What actually shows up when a reader receives the link — a real link
// preview, not a browser mockup of the editor.
export default function PublishMoment() {
  const reduced = useReducedMotion();
  const d = (n: number) => (reduced ? 0 : n);

  return (
    <section className="border-t border-border bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-center">
          <div>
            <h2 className="text-balance mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Publish it, send the link
            </h2>
            <p className="text-pretty max-w-sm text-base leading-relaxed text-muted-fg">
              Turn a write-up into a newsletter and make it public. Whoever gets
              the link can read it — no account, no signup.
            </p>
          </div>

          <motion.div
            className="overflow-hidden rounded-xl border border-border bg-background"
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: d(0.55), ease: EXPO }}
          >
            <div className="border-b border-border-muted bg-surface-alt px-4 py-2.5">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-fg">
                <Link2 size={12} />
                tradejournal.app/n/8f2a91e
              </span>
            </div>
            <div className="p-5">
              <p className="mb-1.5 text-base font-semibold text-foreground">
                Weekly Market Recap — Week 36
              </p>
              <p className="mb-3 text-sm leading-relaxed text-muted-fg">
                Rates held steady into the FOMC decision. Watching semis for
                continuation if the range breaks cleanly above resistance.
              </p>
              <p className="text-xs text-subtle-fg">
                TradeJournal · Newsletter
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
