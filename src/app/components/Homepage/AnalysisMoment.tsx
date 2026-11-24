"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Bold, Italic, Heading2, ImagePlus, Image as ImageIcon } from "lucide-react";

const EXPO = [0.16, 1, 0.3, 1] as const;

export default function AnalysisMoment() {
  const reduced = useReducedMotion();
  const d = (n: number) => (reduced ? 0 : n);

  return (
    <section className="border-t border-border bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.p
          className="mb-4 text-sm font-medium text-muted-fg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: d(0.5) }}
        >
          Attached to the AAPL trade above
        </motion.p>

        <motion.div
          className="mb-6 flex items-center gap-1 border-b border-border-muted pb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: d(0.5), ease: EXPO }}
        >
          {[Bold, Italic, Heading2, ImagePlus].map((Icon, i) => (
            <span
              key={i}
              className="flex h-8 w-8 items-center justify-center rounded-md text-subtle-fg"
            >
              <Icon size={15} strokeWidth={2} />
            </span>
          ))}
        </motion.div>

        <motion.p
          className="text-balance text-3xl font-semibold leading-snug tracking-tight text-foreground sm:text-4xl"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: d(0.6), ease: EXPO }}
        >
          &ldquo;Breakout above the June high on strong volume. Sized
          normally, tightened the stop after the first hour — didn&apos;t
          chase the second leg up like last time.&rdquo;
        </motion.p>

        <motion.div
          className="mt-8 flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3.5"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: d(0.5), ease: EXPO, delay: d(0.1) }}
        >
          <ImageIcon size={16} className="shrink-0 text-subtle-fg" />
          <span className="font-mono text-xs text-muted-fg">
            chart-breakout.png
          </span>
        </motion.div>

        <div className="mt-14 max-w-lg">
          <h2 className="text-balance mb-3 text-2xl font-bold tracking-tight text-foreground">
            Write the reasoning while it&apos;s still fresh
          </h2>
          <p className="text-pretty text-base leading-relaxed text-muted-fg">
            Every trade gets a real note — formatted text and screenshots,
            not just a P&amp;L number. It&apos;s the difference between
            remembering what happened and understanding why.
          </p>
        </div>
      </div>
    </section>
  );
}
