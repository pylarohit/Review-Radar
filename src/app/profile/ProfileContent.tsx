"use client";

import { motion } from "framer-motion";
import { User, Info } from "lucide-react";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as any;

interface ProfileContentProps {
  session: { name: string; email: string };
}

export default function ProfileContent({ session }: ProfileContentProps) {
  return (
    <motion.section
      className="relative mx-auto max-w-4xl px-6 py-12 sm:py-16 z-10 space-y-8 text-[var(--rr-text)]"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-extrabold text-[var(--rr-text)] tracking-tight">Account & Project Details</h1>
        <p className="text-[var(--rr-muted)] text-sm mt-1">Manage your account profile and learn about ReviewRadar.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: User Profile Details */}
        <motion.div
          variants={item}
          whileHover={{ y: -4, boxShadow: "0 12px 40px -12px rgba(139, 92, 246, 0.15)" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="md:col-span-1 bg-[var(--rr-surface)] border border-[var(--rr-muted)]/15 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center"
        >
          <motion.div
            className="h-20 w-20 rounded-full bg-[var(--rr-accent)]/10 text-[var(--rr-accent)] flex items-center justify-center shadow-sm mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
          >
            <User className="w-10 h-10" />
          </motion.div>

          <h2 className="text-lg font-bold text-[var(--rr-text)]">{session.name}</h2>
          <p className="text-xs text-[var(--rr-muted)]/80 mt-1">{session.email}</p>
        </motion.div>

        {/* Right Column: About ReviewRadar */}
        <motion.div
          variants={item}
          whileHover={{ y: -4, boxShadow: "0 12px 40px -12px rgba(139, 92, 246, 0.1)" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="md:col-span-2 bg-[var(--rr-surface)] border border-[var(--rr-muted)]/15 rounded-2xl p-6 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-2 border-b border-[var(--rr-muted)]/10 pb-3">
            <Info className="w-5 h-5 text-[var(--rr-accent)]" />
            <h2 className="text-lg font-bold text-[var(--rr-text)]">About ReviewRadar</h2>
          </div>

          <div className="text-sm text-[var(--rr-text)]/90 space-y-4 leading-relaxed">
            <p>
              <strong>ReviewRadar</strong> is an AI-powered customer feedback intelligence platform. It helps consumers and vendors cut through the noise of online marketplaces by automatically consolidating and synthesizing hundreds of buyer opinions in real-time.
            </p>
            <p>
              Powered by advanced Google Gemini models, ReviewRadar performs deep sentiment analysis and key phrase extraction to outline a clear report of:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-[var(--rr-muted)] text-xs">
              <li>Pros & Cons breakdown</li>
              <li>Gemini AI synthesis summaries</li>
              <li>Overall sentiment percentages</li>
              <li>Standout verified customer quotes</li>
            </ul>
            <p>
              Simply paste any product link to start tracking customer sentiment immediately.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
