import Navbar from "@/components/ui/Navbar";
import AppFooter from "@/components/ui/Footer";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Info } from "lucide-react";
import ProfileContent from "./ProfileContent";

export default async function ProfilePage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[var(--rr-bg)] text-[var(--rr-text)] relative overflow-hidden flex flex-col justify-between">
      <div className="flex-1 w-full">
        {/* Soft, premium radial gradient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-radial from-violet-500/8 via-indigo-500/4 to-transparent blur-[130px] pointer-events-none"
          aria-hidden="true"
        />

        <Navbar userName={session.name} userEmail={session.email} />

        <ProfileContent session={session} />
      </div>

      <AppFooter />
    </main>
  );
}
