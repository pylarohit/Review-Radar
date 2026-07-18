"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface NavbarProps {
  userName?: string;
  userEmail?: string;
}

export default function Navbar({ userName, userEmail }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [displayUser, setDisplayUser] = useState({
    name: userName || "",
    email: userEmail || "",
  });

  useEffect(() => {
    if (!userName) {
      const stored = localStorage.getItem("rr_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setDisplayUser({
            name: parsed.name || "",
            email: parsed.email || "",
          });
        } catch (e) {
          console.error("Failed to parse rr_user from localStorage", e);
        }
      }
    } else {
      setDisplayUser({
        name: userName,
        email: userEmail || "",
      });
    }
  }, [userName, userEmail]);

  useEffect(() => {
    // Warm every destination while the user is reading the current page. This
    // fills Next's client route cache before a navigation link is clicked.
    ["/dashboard", "/history", "/profile"]
      .filter((href) => href !== pathname)
      .forEach((href) => router.prefetch(href));
  }, [pathname, router]);

  function handleLogout() {
    startTransition(async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
        localStorage.removeItem("rr_user");
        router.push("/");
        router.refresh();
      } catch (err) {
        console.error("Logout failed:", err);
      }
    });
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/history", label: "Review" },
    { href: "/profile", label: "About" },
  ];

  return (
    <header
      className="border-b border-[var(--rr-muted)]/15 bg-[var(--rr-surface)]/80 backdrop-blur-md sticky top-0 z-50 text-[var(--rr-text)]"
    >
      <nav className="w-full flex h-16 items-center justify-between px-6">
        {/* Left: Brand title */}
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link href="/dashboard" className="text-xl font-bold text-[var(--rr-text)] hover:text-[var(--rr-accent)] transition-colors">
            ReviewRadar
          </Link>
        </motion.div>

        {/* Center: Navigation Options */}
        <div className="hidden md:flex items-center gap-8 text-base relative">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => router.prefetch(link.href)}
              onFocus={() => router.prefetch(link.href)}
              className={`relative transition-all pb-1.5 -mb-0.5 ${
                pathname === link.href
                  ? "text-[var(--rr-accent)] font-bold"
                  : "text-[var(--rr-muted)] hover:text-[var(--rr-text)] font-semibold"
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[var(--rr-accent)] rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right: Profile block and Logout button (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <div className="h-5 w-px bg-[var(--rr-muted)]/15"></div>
          <motion.div
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {/* Avatar badge */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--rr-accent)]/10 text-[var(--rr-accent)] shadow-sm">
              <User className="h-5 w-5" />
            </div>

            {/* Profile info */}
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-[var(--rr-text)] leading-tight">
                {displayUser.name || "User"}
              </span>
              <span className="text-[10px] font-bold text-[var(--rr-muted)] tracking-wider uppercase mt-0.5">
                {displayUser.email ? "MEMBER" : "GUEST"}
              </span>
            </div>
          </motion.div>

          <div className="h-5 w-px bg-[var(--rr-muted)]/15"></div>

          {/* Logout button */}
          <motion.button
            onClick={handleLogout}
            disabled={isPending}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-sm shadow-red-500/10 transition-all cursor-pointer disabled:opacity-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            {isPending ? "Logging out..." : "Logout"}
          </motion.button>
        </div>

        {/* Mobile hamburger menu toggle */}
        <div className="flex md:hidden items-center">
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
            className="rounded-xl p-2 text-[var(--rr-muted)] hover:bg-[var(--rr-surface)]/20 hover:text-[var(--rr-text)] focus:outline-none transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden overflow-hidden border-t border-[var(--rr-muted)]/15 bg-[var(--rr-surface)]/95 backdrop-blur-md shadow-lg"
          >
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="px-6 py-6 flex flex-col gap-6"
            >
              <nav className="flex flex-col gap-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                  >
                    <Link
                      href={link.href}
                      onMouseEnter={() => router.prefetch(link.href)}
                      onFocus={() => router.prefetch(link.href)}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-base font-bold pb-2 border-b border-[var(--rr-muted)]/10 block ${
                        pathname === link.href ? "text-[var(--rr-accent)]" : "text-[var(--rr-muted)] hover:text-[var(--rr-text)]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="flex flex-col gap-4 pt-2 border-t border-[var(--rr-muted)]/15">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--rr-accent)]/10 text-[var(--rr-accent)] shadow-sm">
                      <User className="h-5.5 w-5.5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-extrabold text-[var(--rr-text)] leading-tight">
                        {displayUser.name || "User"}
                      </span>
                      <span className="text-[10px] font-bold text-[var(--rr-muted)] tracking-wider uppercase mt-1">
                        {displayUser.email || "GUEST"}
                      </span>
                    </div>
                  </div>
                  <ThemeToggle />
                </div>

                <motion.button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  disabled={isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 py-3 text-sm font-bold text-white shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                  {isPending ? "Logging out..." : "Logout"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
