"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-[var(--rr-muted)] transition-colors hover:border-white/20 hover:text-[var(--rr-text)] disabled:opacity-50"
    >
      {isPending ? "Logging out…" : "Logout"}
    </button>
  );
}
