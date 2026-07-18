"use client";

import Link from "next/link";
import ProfileMenu from "./ProfileMenu";
import LogoutButton from "./LogoutButton";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { motion } from "framer-motion";

type NavbarProps = {
  userName: string;
  avatarUrl?: string;
};

export default function Navbar({ userName, avatarUrl }: NavbarProps) {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[var(--rr-bg)]/80 backdrop-blur-md"
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/main"
            className="font-display text-lg font-semibold tracking-tight text-[var(--rr-text)]"
          >
            Review<span className="text-[var(--rr-signal)]">Radar</span>
          </Link>
        </motion.div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <ProfileMenu userName={userName} avatarUrl={avatarUrl} />
          <LogoutButton />
        </div>
      </nav>
    </header>
  );
}