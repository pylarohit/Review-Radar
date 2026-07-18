import { revalidateTag, unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

async function queryDashboardProducts(userId: string) {
  return prisma.product.findMany({
    where: { userId },
    include: {
      reviews: true,
      analyses: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

type DashboardProducts = Awaited<ReturnType<typeof queryDashboardProducts>>;

const globalForDashboardCache = globalThis as unknown as {
  dashboardProductsCache?: Map<string, Promise<DashboardProducts>>;
};

const developmentCache =
  globalForDashboardCache.dashboardProductsCache ?? new Map<string, Promise<DashboardProducts>>();

if (process.env.NODE_ENV !== "production") {
  globalForDashboardCache.dashboardProductsCache = developmentCache;
}

export function dashboardProductsTag(userId: string) {
  return `dashboard-products:${userId}`;
}

export async function getDashboardProducts(userId: string) {
  // Next intentionally skips persistent data caching in development. Keeping a
  // small process-local cache gives the local app the same repeat-visit speed.
  if (process.env.NODE_ENV !== "production") {
    const cachedProducts = developmentCache.get(userId);
    if (cachedProducts) return cachedProducts;

    const productsPromise = queryDashboardProducts(userId);
    developmentCache.set(userId, productsPromise);

    try {
      return await productsPromise;
    } catch (error) {
      developmentCache.delete(userId);
      throw error;
    }
  }

  return unstable_cache(
    () => queryDashboardProducts(userId),
    ["dashboard-products", userId],
    {
      tags: [dashboardProductsTag(userId)],
    }
  )();
}

export function invalidateDashboardProducts(userId: string) {
  developmentCache.delete(userId);
  revalidateTag(dashboardProductsTag(userId), { expire: 0 });
}
