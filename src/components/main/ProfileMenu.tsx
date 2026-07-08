"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";

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
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="rounded-full transition-opacity hover:opacity-80"
      >
        <Avatar name={userName} avatarUrl={avatarUrl} size={36} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 w-48 rounded-xl border border-white/10 bg-[var(--rr-surface)] p-2 shadow-xl shadow-black/40"
        >
          <p className="truncate px-3 py-2 text-sm text-[var(--rr-muted)]">{userName}</p>
          <Link
            href="/profile"
            role="menuitem"
            className="block rounded-lg px-3 py-2 text-sm text-[var(--rr-text)] hover:bg-white/5"
          >
            View profile
          </Link>
          <Link
            href="/dashboard"
            role="menuitem"
            className="block rounded-lg px-3 py-2 text-sm text-[var(--rr-text)] hover:bg-white/5"
          >
            Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
