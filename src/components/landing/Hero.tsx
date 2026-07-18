"use client";

import Link from "next/link";
import RadarScope from "@/components/ui/RadarScope";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
} as any;

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16 sm:px-6">
      <RadarScope />

      <motion.div
        className="relative z-10 flex flex-col items-center py-24 text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.span
          variants={fadeUp}
          className="mb-4 inline-block rounded-full border border-white/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-[var(--rr-signal)]"
        >
          AI-Powered Review Intelligence
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="font-display max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[var(--rr-text)] sm:text-5xl md:text-6xl"
        >
          Know what buyers actually think, before you click buy.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-4 max-w-xl text-base text-[var(--rr-muted)] sm:text-lg"
        >
          ReviewRadar scans reviews from Amazon, Flipkart, and more — then
          hands you the sentiment, the pros, the cons, and the quotes that
          matter.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href="/dashboard"
              className="inline-block rounded-xl bg-[var(--rr-signal)] px-8 py-4 text-base font-semibold text-[var(--rr-bg)] transition-all hover:brightness-110 hover:shadow-[0_0_24px_-4px_var(--rr-signal)] animate-pulse-glow"
            >
              Get started free
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}