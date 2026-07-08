import Link from "next/link";
import RadarScope from "@/components/ui/RadarScope";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16 sm:px-6">
      <RadarScope />

      <div className="relative z-10 flex flex-col items-center py-24 text-center">
        <h1 className="font-display max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[var(--rr-text)] sm:text-5xl md:text-6xl">
          Know what buyers actually think, before you click buy.
        </h1>

        <p className="mt-4 max-w-xl text-base text-[var(--rr-muted)] sm:text-lg">
          ReviewRadar scans reviews from Amazon, Flipkart, and more — then
          hands you the sentiment, the pros, the cons, and the quotes that
          matter.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="rounded-xl bg-[var(--rr-signal)] px-8 py-4 text-base font-semibold text-[var(--rr-bg)] transition-all hover:brightness-110 hover:shadow-[0_0_24px_-4px_var(--rr-signal)]"
          >
            Get started free
          </Link>
        </div>
      </div>
    </section>
  );
}