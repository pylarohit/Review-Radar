import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Shield, Lock, Eye, Server, RefreshCw, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — ReviewRadar",
  description: "Learn how ReviewRadar collects, uses, and protects your personal and product data.",
};

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-sm text-[var(--rr-muted)]">
              Last updated: July 18, 2026
            </p>
          </div>

          {/* Glassmorphic Container */}
          <div className="rounded-3xl border border-white/5 bg-[var(--rr-surface)]/40 backdrop-blur-xl p-6 sm:p-12 shadow-2xl space-y-10">
            <div>
              <p className="text-base sm:text-lg text-[var(--rr-muted)] leading-relaxed">
                At ReviewRadar, we respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy describes how we collect, use, and process your information when you use our AI-powered product review analysis services.
              </p>
            </div>

            {/* Section 1 */}
            <section className="relative">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--rr-text)] mb-4 flex items-center gap-3">
                <Eye className="w-5 h-5 text-[var(--rr-signal)]" />
                1. Information We Collect
              </h2>
              <div className="space-y-4 text-[var(--rr-muted)] leading-relaxed">
                <p>
                  We collect information to provide better services to all our users. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-[var(--rr-text)]">Account Profile Information:</strong> When you sign up, we collect your name, email address, and authentication details via email/password or Google Single Sign-On (SSO).
                  </li>
                  <li>
                    <strong className="text-[var(--rr-text)]">Analysis Data:</strong> We store the product URLs, platform names, and metadata of the reviews you request our AI to analyze, so you can access your report history later.
                  </li>
                  <li>
                    <strong className="text-[var(--rr-text)]">Usage Info:</strong> We may capture telemetry data regarding how you interact with the dashboard to fix performance bugs and improve UX.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--rr-text)] mb-4 flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-[var(--rr-signal)]" />
                2. How We Use Your Information
              </h2>
              <div className="space-y-4 text-[var(--rr-muted)] leading-relaxed">
                <p> We process your data for the following legitimate purposes: </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide and maintain the ReviewRadar service and dashboard.</li>
                  <li>To process public reviews from the URLs you submit using AI sentiment models.</li>
                  <li>To customize your dashboard and persist your query history.</li>
                  <li>To monitor the performance, stability, and security of our platform.</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--rr-text)] mb-4 flex items-center gap-3">
                <Lock className="w-5 h-5 text-[var(--rr-signal)]" />
                3. Data Storage & Protection
              </h2>
              <p className="text-[var(--rr-muted)] leading-relaxed">
                Your account details are securely managed and authenticated using industry-leading service providers like Google Firebase. All communications between your device and our servers are encrypted using Secure Socket Layer (SSL/TLS) technology. While we employ rigorous organizational measures, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--rr-text)] mb-4 flex items-center gap-3">
                <Server className="w-5 h-5 text-[var(--rr-signal)]" />
                4. Sharing with Third-Party Processors
              </h2>
              <div className="space-y-4 text-[var(--rr-muted)] leading-relaxed">
                <p>
                  We do not sell, rent, or trade your personal information. We only share data with essential sub-processors required to run our app:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-[var(--rr-text)]">Firebase Authentication:</strong> To safely verify logins and secure accounts.
                  </li>
                  <li>
                    <strong className="text-[var(--rr-text)]">AI Processing Engines (Google Gemini / OpenAI API):</strong> To parse, summarize, and rate the sentiment of the text scraped from public URLs. No personally identifiable account data is shared with the AI models.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--rr-text)] mb-4 flex items-center gap-3">
                <Shield className="w-5 h-5 text-[var(--rr-signal)]" />
                5. Your Rights & Control
              </h2>
              <p className="text-[var(--rr-muted)] leading-relaxed">
                You have full control over your data. At any time, you can log in, view your previous analysis history, or choose to delete items from your dashboard. If you wish to permanently delete your ReviewRadar account and associated data, you can request account termination by reaching out to our support channel.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--rr-text)] mb-4 flex items-center gap-3">
                <Mail className="w-5 h-5 text-[var(--rr-signal)]" />
                6. Contact Information
              </h2>
              <p className="text-[var(--rr-muted)] leading-relaxed">
                If you have any questions or feedback regarding this Privacy Policy or our practices, please contact us via email at{" "}
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
