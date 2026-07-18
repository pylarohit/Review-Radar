import { Loader2 } from "lucide-react";

export default function AppPageLoading() {
  return (
    <main className="min-h-screen bg-[var(--rr-bg)] text-[var(--rr-text)]">
      <header className="h-16 border-b border-[var(--rr-muted)]/15 bg-[var(--rr-surface)]/80" />
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-3 px-6">
        <Loader2 className="h-7 w-7 animate-spin text-[var(--rr-accent)]" aria-hidden="true" />
        <p className="text-sm font-medium text-[var(--rr-muted)]">Loading your page...</p>
      </div>
    </main>
  );
}
