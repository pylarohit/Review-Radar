"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut, Menu, X } from "lucide-react";

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

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <nav className="w-full flex h-16 items-center justify-between px-6">
        {/* Left: Brand title */}
        <Link href="/dashboard" className="text-xl font-bold text-black-900 hover:text-violet-600 transition-colors">
          ReviewRadar
        </Link>

        {/* Center: Navigation Options */}
        <div className="hidden md:flex items-center gap-8 text-base">
          <Link 
            href="/dashboard" 
            className={`transition-all pb-1.5 border-b-2 -mb-0.5 ${
              pathname === "/dashboard"
                ? "text-violet-600 font-bold border-violet-600"
                : "text-zinc-550 hover:text-zinc-950 font-semibold border-transparent"
            }`}
          >
            Dashboard
          </Link>

          <Link 
            href="/history" 
            className={`transition-all pb-1.5 border-b-2 -mb-0.5 ${
              pathname === "/history"
                ? "text-violet-600 font-bold border-violet-600"
                : "text-zinc-555 hover:text-zinc-955 font-semibold border-transparent"
            }`}
          >
            Review
          </Link>

          <Link 
            href="/profile" 
            className={`transition-all pb-1.5 border-b-2 -mb-0.5 ${
              pathname === "/profile"
                ? "text-violet-600 font-bold border-violet-600"
                : "text-zinc-555 hover:text-zinc-955 font-semibold border-transparent"
            }`}
          >
            About
          </Link>
        </div>

        {/* Right: Profile block and Logout button (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            {/* Avatar badge */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600 shadow-sm">
              <User className="h-5 w-5" />
            </div>

            {/* Profile info */}
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-zinc-800 leading-tight">
                {displayUser.name || "User"}
              </span>
              <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase mt-0.5">
                {displayUser.email ? "MEMBER" : "GUEST"}
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-zinc-200"></div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-sm shadow-red-500/10 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            {isPending ? "Logging out..." : "Logout"}
          </button>
        </div>

        {/* Mobile hamburger menu toggle */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-xl p-2 text-zinc-650 hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white/95 backdrop-blur-md px-6 py-6 shadow-lg animate-in slide-in-from-top duration-200 flex flex-col gap-6">
          <nav className="flex flex-col gap-4">
            <Link 
              href="/dashboard" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-base font-bold pb-2 border-b border-zinc-100 ${
                pathname === "/dashboard" ? "text-violet-600" : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/history" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-base font-bold pb-2 border-b border-zinc-100 ${
                pathname === "/history" ? "text-violet-600" : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              Review
            </Link>
            <Link 
              href="/profile" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-base font-bold pb-2 border-b border-zinc-100 ${
                pathname === "/profile" ? "text-violet-600" : "text-zinc-600 hover:text-zinc-955"
              }`}
            >
              About
            </Link>
          </nav>

          <div className="flex flex-col gap-4 pt-2 border-t border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 shadow-sm">
                <User className="h-5.5 w-5.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-extrabold text-zinc-800 leading-tight">
                  {displayUser.name || "User"}
                </span>
                <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase mt-1">
                  {displayUser.email || "GUEST"}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 py-3 text-sm font-bold text-white shadow-md active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {isPending ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}