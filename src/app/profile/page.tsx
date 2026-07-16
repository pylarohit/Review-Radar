import Navbar from "@/components/ui/Navbar";
import AppFooter from "@/components/ui/Footer";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Shield, Info, Sparkles } from "lucide-react";

export default async function ProfilePage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#fafbfc] text-zinc-900 relative overflow-hidden flex flex-col justify-between">
      <div className="flex-1 w-full">
        {/* Soft, premium radial gradient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-radial from-violet-500/8 via-indigo-500/4 to-transparent blur-[130px] pointer-events-none"
          aria-hidden="true"
        />

        <Navbar userName={session.name} userEmail={session.email} />

        <section className="relative mx-auto max-w-4xl px-6 py-12 sm:py-16 z-10 space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Account & Project Details</h1>
            <p className="text-zinc-500 text-sm mt-1">Manage your account profile and learn about ReviewRadar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: User Profile Details (1 Column) */}
            <div className="md:col-span-1 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shadow-sm mb-4">
                <User className="w-10 h-10" />
              </div>
              
              <h2 className="text-lg font-bold text-zinc-900">{session.name}</h2>
              <p className="text-xs text-zinc-400 mt-1">{session.email}</p>
              
            </div>

            {/* Right Column: About ReviewRadar (2 Columns) */}
            <div className="md:col-span-2 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <Info className="w-5 h-5 text-violet-600" />
                <h2 className="text-lg font-bold text-zinc-900">About ReviewRadar</h2>
              </div>
              
              <div className="text-sm text-zinc-600 space-y-4 leading-relaxed">
                <p>
                  <strong>ReviewRadar</strong> is an AI-powered customer feedback intelligence platform. It helps consumers and vendors cut through the noise of online marketplaces by automatically consolidating and synthesizing hundreds of buyer opinions in real-time.
                </p>
                <p>
                  Powered by advanced Google Gemini models, ReviewRadar performs deep sentiment analysis and key phrase extraction to outline a clear report of:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-zinc-550 text-xs">
                  <li>Pros & Cons breakdown</li>
                  <li>Gemini AI synthesis summaries</li>
                  <li>Overall sentiment percentages</li>
                  <li>Standout verified customer quotes</li>
                </ul>
                <p>
                  Simply paste any product link to start tracking customer sentiment immediately.
                </p>
              </div>
              
            </div>
          </div>
        </section>
      </div>

      <AppFooter />
    </main>
  );
}
