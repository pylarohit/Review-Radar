function Skeleton({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-[var(--rr-muted)]/15 ${className}`}
    />
  );
}

function AppHeaderSkeleton() {
  return (
    <header className="h-16 shrink-0 border-b border-[var(--rr-muted)]/15 bg-[var(--rr-surface)]/80 px-6">
      <div className="flex h-full items-center justify-between">
        <Skeleton className="h-6 w-36" />
        <div className="hidden items-center gap-8 md:flex">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="hidden h-9 w-20 md:block" />
          <Skeleton className="h-9 w-20 rounded-xl" />
        </div>
      </div>
    </header>
  );
}

function ProductCardSkeleton() {
  return (
    <article className="flex h-[310px] flex-col justify-between rounded-2xl border border-[var(--rr-muted)]/15 bg-[var(--rr-surface)] p-6 shadow-sm">
      <div className="space-y-4">
        <Skeleton className="h-5 w-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="space-y-2 pt-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[var(--rr-muted)]/10 pt-5">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-14 rounded-lg" />
      </div>
    </article>
  );
}

function FooterSkeleton() {
  return (
    <footer className="hidden border-t border-[var(--rr-muted)]/15 bg-[var(--rr-surface)] px-6 py-5 lg:block">
      <div className="flex items-center justify-between border-b border-[var(--rr-muted)]/10 pb-4">
        <Skeleton className="h-5 w-28" />
        <div className="flex gap-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-3 w-56" />
        <Skeleton className="h-3 w-64" />
      </div>
    </footer>
  );
}

export function DashboardPageSkeleton() {
  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[var(--rr-bg)] text-[var(--rr-text)]">
      <AppHeaderSkeleton />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="hidden w-72 shrink-0 border-r border-[var(--rr-muted)]/15 bg-[var(--rr-surface)] p-6 lg:block">
          <Skeleton className="h-4 w-36" />
          <div className="mt-5 space-y-4 border-t border-[var(--rr-muted)]/15 pt-5">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-8/12" />
          </div>
        </aside>
        <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden p-6 sm:p-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
            <div className="grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </div>
          </div>
          <FooterSkeleton />
        </section>
      </div>
    </main>
  );
}

export function ProfilePageSkeleton() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--rr-bg)] text-[var(--rr-text)]">
      <AppHeaderSkeleton />
      <section className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-6 py-12 sm:py-16">
        <div className="space-y-3">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex min-h-56 flex-col items-center rounded-2xl border border-[var(--rr-muted)]/15 bg-[var(--rr-surface)] p-6">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="mt-5 h-5 w-28" />
            <Skeleton className="mt-3 h-3 w-40" />
          </div>
          <div className="space-y-6 rounded-2xl border border-[var(--rr-muted)]/15 bg-[var(--rr-surface)] p-6 md:col-span-2">
            <div className="flex items-center gap-3 border-b border-[var(--rr-muted)]/10 pb-4">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-44" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-9/12" />
            </div>
          </div>
        </div>
      </section>
      <FooterSkeleton />
    </main>
  );
}
