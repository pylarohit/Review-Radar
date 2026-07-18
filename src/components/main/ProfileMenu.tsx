"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { motion, AnimatePresence } from "framer-motion";

type ProfileMenuProps = {
  userName: string;
  avatarUrl?: string;
};

export default function ProfileMenu({ userName, avatarUrl }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="rounded-full transition-opacity hover:opacity-80"
      >
        <Avatar name={userName} avatarUrl={avatarUrl} size={36} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -8 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute right-0 top-12 w-48 rounded-xl border border-white/10 bg-[var(--rr-surface)] p-2 shadow-xl shadow-black/40 origin-top-right"
          >
            <p className="truncate px-3 py-2 text-sm text-[var(--rr-muted)]">{userName}</p>
            <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <Link
                href="/profile"
                role="menuitem"
                className="block rounded-lg px-3 py-2 text-sm text-[var(--rr-text)] hover:bg-white/5 transition-colors"
              >
                View profile
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <Link
                href="/dashboard"
                role="menuitem"
                className="block rounded-lg px-3 py-2 text-sm text-[var(--rr-text)] hover:bg-white/5 transition-colors"
              >
                Dashboard
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
