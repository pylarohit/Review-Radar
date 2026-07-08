import Navbar from "@/components/ui/Navbar";
import DashboardView from "@/components/ui/DashboardView";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function DashboardPage() {
    const products = await prisma.product.findMany({
        include: {
            reviews: true,
            analyses: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <main className="h-screen flex flex-col overflow-hidden bg-[#fafbfc] text-zinc-900 relative">
            {/* Soft, premium radial gradient glow at the top center for light theme */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-radial from-violet-500/8 via-indigo-500/4 to-transparent blur-[130px] pointer-events-none z-0"
                aria-hidden="true"
            />

            <Navbar />

            <div className="flex-1 flex overflow-hidden z-10">
                <DashboardView products={products} />
            </div>
        </main>
    );
}