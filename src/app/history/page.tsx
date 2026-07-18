import Navbar from "@/components/ui/Navbar";
import ProductAnalyzer from "@/components/ui/Productanalyzer";
import AppFooter from "@/components/ui/Footer";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import PageTransition from "@/components/ui/PageTransition";

export default async function HistoryPage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[var(--rr-bg)] text-[var(--rr-text)] relative overflow-hidden flex flex-col justify-between">
      <div className="flex-1 w-full">
        {/* Soft, premium radial gradient glow at the top center for light theme */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-radial from-violet-500/8 via-indigo-500/4 to-transparent blur-[130px] pointer-events-none"
          aria-hidden="true"
        />

        <Navbar userName={session.name} userEmail={session.email} />

        <PageTransition>
          <section className="relative mx-auto max-w-6xl px-6 py-8 sm:py-12 z-10">
            <ProductAnalyzer />
          </section>
        </PageTransition>
      </div>

      <AppFooter />
    </main>
  );
}

