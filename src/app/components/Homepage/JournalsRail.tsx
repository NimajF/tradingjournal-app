"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";

const journals = [
  { name: "Day Trading", trades: 142, favorite: true },
  { name: "Swing Setups", trades: 58, favorite: false },
  { name: "Options Backtests", trades: 23, favorite: false },
  { name: "Mentorship Notes", trades: 9, favorite: false },
];

const EXPO = [0.16, 1, 0.3, 1] as const;

export default function JournalsRail() {
  const reduced = useReducedMotion();
  const d = (n: number) => (reduced ? 0 : n);

  return (
    <section className="border-t border-border bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10 max-w-lg">
          <h2 className="text-balance mb-3 text-2xl font-bold tracking-tight text-foreground">
            Keep every strategy in its own journal
          </h2>
          <p className="text-pretty text-base leading-relaxed text-muted-fg">
            Day trades, swing setups, backtests, mentorship notes — as many
            journals as you need, or just one.
          </p>
        </div>

        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0">
          {journals.map((j, i) => (
            <motion.div
              key={j.name}
              className="flex w-56 shrink-0 snap-start flex-col justify-between gap-6 rounded-xl border border-border bg-surface p-5 sm:w-auto"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: d(i * 0.07), duration: d(0.5), ease: EXPO }}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-base font-semibold leading-snug text-foreground">
                  {j.name}
                </p>
                {j.favorite && (
                  <Star
                    size={14}
                    className="mt-0.5 shrink-0 text-accent fill-accent"
                  />
                )}
              </div>
              <span className="inline-flex w-fit items-center rounded-full border border-border bg-surface-inset px-2.5 py-1 font-mono text-xs text-muted-fg">
                {j.trades} trades
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
