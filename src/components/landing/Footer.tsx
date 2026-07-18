"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="border-t border-white/5 px-4 py-6 sm:px-6"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-[var(--rr-muted)] sm:flex-row">
        <p>© {new Date().getFullYear()} ReviewRadar. All rights reserved.</p>
        <div className="flex gap-6">
          <motion.a
            href="#"
            className="hover:text-[var(--rr-text)] transition-colors"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Privacy
          </motion.a>
          <motion.a
            href="#"
            className="hover:text-[var(--rr-text)] transition-colors"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Terms
          </motion.a>
          <motion.a
            href="#"
            className="hover:text-[var(--rr-text)] transition-colors"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Contact
          </motion.a>
        </div>
      </div>
    </motion.footer>
  );
}
