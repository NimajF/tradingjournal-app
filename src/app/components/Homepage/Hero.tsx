"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Ledger from "./Ledger";

const EXPO = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const reduced = useReducedMotion();
  const d = (n: number) => (reduced ? 0 : n);

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: d(0.08), delayChildren: d(0.05) } },
  };
  const line = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: d(0.6), ease: EXPO } },
  };

  return (
    <section className="relative overflow-hidden bg-background pb-8 pt-20 sm:pt-28">
      <div className="lp-grain" aria-hidden="true" />

      <motion.div
        className="relative mx-auto max-w-3xl px-4 text-center sm:px-6"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-balance text-5xl font-bold leading-[1.05] tracking-[-0.045em] text-foreground sm:text-6xl md:text-7xl"
          variants={line}
        >
          Every trade tells you
          <br />
          something. Write it down.
        </motion.h1>

        <motion.p
          className="text-pretty mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted-fg"
          variants={line}
        >
          TradeJournal is a private ledger for what you did and why — trades,
          notes, screenshots, journals, and long-form write-ups. No broker
          connections. No automation.
        </motion.p>

        <motion.div
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          variants={line}
        >
          <Link href="/register" className="btn btn-primary btn-lift btn-lg">
            Get Started — it&apos;s free
          </Link>
          <Link href="#product" className="btn btn-ghost btn-lift btn-lg">
            See the ledger
          </Link>
        </motion.div>
      </motion.div>

      {/* The ledger bleeds in below the fold, full width, fading toward the
          bottom edge — the one big product moment on this surface. */}
      <motion.div
        id="product"
        className="relative mx-auto mt-16 max-w-5xl scroll-mt-20 px-4 sm:px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: d(0.8), ease: EXPO, delay: d(0.25) }}
      >
        <Ledger />
      </motion.div>
    </section>
  );
}
