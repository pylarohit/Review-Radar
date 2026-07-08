import ProductCard from "./Productcard";
import { prisma } from "@/lib/prisma";

type Product = {
  id: string;
  name: string;
  category: string;
  description: string | null;
};

async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 9,
    });
    return products;
  } catch (error) {
    console.error("Failed to fetch products directly from DB:", error);
    return [];
  }
}

export default async function RecentProducts() {
  const products = await getProducts();
  return (
    <section className="mt-16 border-t border-zinc-100 pt-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Recently Analyzed</h2>

        <button className="text-sm font-semibold text-violet-650 hover:text-violet-800 transition-colors">
          View All
        </button>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center text-zinc-400 font-medium">
          No analyzed products yet. Try pasting a URL above!
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}