import Navbar from "@/components/ui/Navbar";
import ProductAnalyzer from "@/components/ui/Productanalyzer";
import AppFooter from "@/components/ui/Footer";

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-[#fafbfc] text-zinc-900 relative overflow-hidden flex flex-col justify-between">
      <div className="flex-1 w-full">
        {/* Soft, premium radial gradient glow at the top center for light theme */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-radial from-violet-500/8 via-indigo-500/4 to-transparent blur-[130px] pointer-events-none"
          aria-hidden="true"
        />

        <Navbar />

        <section className="relative mx-auto max-w-6xl px-6 py-20 z-10">
          <ProductAnalyzer />
        </section>
      </div>

      <AppFooter />
    </main>
  );
}
