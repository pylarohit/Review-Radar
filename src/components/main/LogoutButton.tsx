"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("rr_user");
      router.push("/");
      router.refresh();
    });
  }

  return (
    <motion.button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-[var(--rr-muted)] transition-colors hover:border-white/20 hover:text-[var(--rr-text)] disabled:opacity-50"
    >
      {isPending ? "Logging out…" : "Logout"}
    </motion.button>
  );
}
