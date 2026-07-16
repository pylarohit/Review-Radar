import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Logo from "@/components/ui/Logo";
    
export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[var(--rr-bg)]/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3"
        >
          <Logo />

          <span className="font-display text-xl font-bold tracking-tight text-[var(--rr-text)] hidden sm:inline">
            Review<span className="text-[var(--rr-signal)]">Radar</span>
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link
            href="/login"
            className="rounded-full px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-[var(--rr-muted)] transition-colors hover:text-[var(--rr-text)]"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-[var(--rr-signal)] px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-[var(--rr-bg)] transition-transform hover:brightness-110"
          >
            Sign Up
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}