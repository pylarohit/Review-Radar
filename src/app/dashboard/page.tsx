import Navbar from "@/components/ui/Navbar";
import DashboardView from "@/components/ui/DashboardView";
import { getDashboardProducts } from "@/lib/dashboard-products";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import PageTransition from "@/components/ui/PageTransition";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

async function ProductsList({ userId }: { userId: string }) {
    const products = await getDashboardProducts(userId);

    return <DashboardView products={products} />;
}

function ProductsFallback() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-[var(--rr-text)] animate-spin opacity-50" />
            <p className="text-[var(--rr-text)] opacity-70">Loading your products...</p>
        </div>
    );
}

export default async function DashboardPage() {
    const session = await getSessionUser();
    if (!session) {
        redirect("/login");
    }

    return (
        <main className="h-screen flex flex-col overflow-hidden bg-[var(--rr-bg)] text-[var(--rr-text)] relative">
            {/* Soft, premium radial gradient glow at the top center for light theme */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-radial from-violet-500/8 via-indigo-500/4 to-transparent blur-[130px] pointer-events-none z-0"
                aria-hidden="true"
            />

            <Navbar userName={session.name} userEmail={session.email} />

            <PageTransition className="flex-1 flex overflow-hidden z-10">
                <Suspense fallback={<ProductsFallback />}>
                    <ProductsList userId={session.userId} />
                </Suspense>
            </PageTransition>
        </main>
    );
}
