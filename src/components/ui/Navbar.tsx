"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

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

        {/* Right: Profile block and Logout button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            {/* Avatar badge */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600 shadow-sm">
              <User className="h-5 w-5" />
            </div>

            {/* Profile info */}
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-zinc-800 leading-tight">Pratik</span>
              <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase mt-0.5">
                EMPLOYEE
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-zinc-200"></div>

          {/* Logout button */}
          <button
            onClick={() => console.log("Logout")}
            className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-sm shadow-red-500/10 active:scale-[0.98] transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}