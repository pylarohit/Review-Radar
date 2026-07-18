import Navbar from "@/components/main/Navbar";
import AnalyzeCard from "@/components/main/AnalyzeCard";
import RadarScope from "@/components/ui/RadarScope";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import PageTransition from "@/components/ui/PageTransition";

export default async function MainPage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[var(--rr-bg)]">
      <Navbar userName={session.name} />

      <PageTransition>
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16 sm:px-6">
          <RadarScope />

          <div className="relative z-10 flex w-full flex-col items-center py-24 text-center">
            <span className="mb-4 rounded-full border border-white/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-[var(--rr-signal)]">
              Scanning reviews since one click ago
            </span>

            <h1 className="font-display max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[var(--rr-text)] sm:text-5xl md:text-6xl">
              Analyze Product Reviews with AI
            </h1>

            <p className="mt-4 max-w-xl text-base text-[var(--rr-muted)] sm:text-lg">
              Paste a listing and get the sentiment, pros, cons, and standout
              quotes pulled straight out of the noise.
            </p>

            <div className="mt-10 flex w-full justify-center">
              <AnalyzeCard />
            </div>
          </div>
        </main>
      </PageTransition>
    </div>
  );
}

