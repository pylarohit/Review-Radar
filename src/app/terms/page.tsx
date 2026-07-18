import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Scale, FileText, UserCheck, AlertTriangle, ShieldAlert, Edit3, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — ReviewRadar",
  description: "Read the terms and conditions for using the ReviewRadar AI product review analysis platform.",
};

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-[var(--rr-bg)] flex flex-col justify-between overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] h-[50vw] w-[50vw] max-w-[600px] rounded-full bg-[var(--rr-signal)]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[50vw] w-[50vw] max-w-[600px] rounded-full bg-[var(--rr-accent)]/5 blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold tracking-tight text-[var(--rr-text)] mb-3">
              Terms of Service
            </h1>
            <p className="text-sm text-[var(--rr-muted)]">
              Last updated: July 18, 2026
            </p>
          </div>

          {/* Glassmorphic Container */}
          <div className="rounded-3xl border border-white/5 bg-[var(--rr-surface)]/40 backdrop-blur-xl p-6 sm:p-12 shadow-2xl space-y-10">
            <div>
              <p className="text-base sm:text-lg text-[var(--rr-muted)] leading-relaxed">
                Welcome to ReviewRadar. By accessing or using our website and services, you agree to comply with and be bound by the following Terms of Service. Please read them carefully.
              </p>
            </div>

            {/* Section 1 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--rr-text)] mb-4 flex items-center gap-3">
                <Scale className="w-5 h-5 text-[var(--rr-signal)]" />
                1. Acceptance of Terms
              </h2>
              <p className="text-[var(--rr-muted)] leading-relaxed">
                By creating an account, browsing, or submitting product URLs to ReviewRadar, you signify your agreement to these Terms of Service. If you do not agree to all of these terms, you are not authorized to use this platform.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--rr-text)] mb-4 flex items-center gap-3">
                <FileText className="w-5 h-5 text-[var(--rr-signal)]" />
                2. Use of our Services
              </h2>
              <div className="space-y-4 text-[var(--rr-muted)] leading-relaxed">
                <p>
                  ReviewRadar provides AI-based summary and sentiment analysis tools for public web product reviews. You agree to use the service only for lawful purposes and comply with these limitations:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You must not use our scraping or analysis queries to spam, overload, or DDOS target websites.</li>
                  <li>You must not circumvent any rate limits, captchas, or authentication measures set up on our APIs.</li>
                  <li>You must not submit links containing offensive, malicious, illegal, or privacy-violating materials.</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--rr-text)] mb-4 flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-[var(--rr-signal)]" />
                3. User Accounts & Security
              </h2>
              <p className="text-[var(--rr-muted)] leading-relaxed">
                To access advanced dashboard histories, you must sign up for an account. You are solely responsible for maintaining the confidentiality of your account credentials, including OAuth tokens or passwords. You agree to notify us immediately of any unauthorized use or security breaches regarding your login session.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--rr-text)] mb-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-[var(--rr-signal)]" />
                4. AI Analysis & Accuracy Disclaimer
              </h2>
              <p className="text-[var(--rr-muted)] leading-relaxed">
                ReviewRadar uses advanced Large Language Models (LLMs) to scan public sentiment, generate lists of pros and cons, and build summaries. These AI outputs are generated algorithmically and are meant for informational and estimation purposes only. We do not guarantee the completeness, accuracy, validity, or truthfulness of the reviews analyzed or the resulting AI insights.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--rr-text)] mb-4 flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-[var(--rr-signal)]" />
                5. Suspension and Termination
              </h2>
              <p className="text-[var(--rr-muted)] leading-relaxed">
                We reserve the right, at our sole discretion, to suspend or terminate your account and refuse access to the platform for any reason, including but not limited to breach of these Terms, excessive automated querying, or malicious exploitation of our system limits.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--rr-text)] mb-4 flex items-center gap-3">
                <Edit3 className="w-5 h-5 text-[var(--rr-signal)]" />
                6. Modification of Terms
              </h2>
              <p className="text-[var(--rr-muted)] leading-relaxed">
                We may revise these Terms of Service from time to time. When we make updates, we will post the revised version on this page and update the "Last updated" date at the top. Continued use of ReviewRadar after modifications constitute your acceptance of the revised Terms.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--rr-text)] mb-4 flex items-center gap-3">
                <Mail className="w-5 h-5 text-[var(--rr-signal)]" />
                7. Contact Us
              </h2>
              <p className="text-[var(--rr-muted)] leading-relaxed">
                For questions, concerns, or requests regarding these Terms of Service, please contact our legal and support team at{" "}
                <a
                  href="mailto:support@reviewradar.com"
                  className="text-[var(--rr-accent)] hover:underline font-semibold"
                >
                  support@reviewradar.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
