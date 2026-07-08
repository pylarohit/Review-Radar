import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--rr-bg)]">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}
