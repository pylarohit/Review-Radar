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
  dashboardProductsCache?: Map<string, DashboardCacheEntry>;
};

type DashboardCacheEntry = {
  data?: DashboardProducts;
  request?: Promise<DashboardProducts>;
};

const developmentCache =
  globalForDashboardCache.dashboardProductsCache ?? new Map<string, DashboardCacheEntry>();

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
    const cacheEntry = developmentCache.get(userId);
    if (cacheEntry?.data) return cacheEntry.data;
    if (cacheEntry?.request) return cacheEntry.request;

    const entry = cacheEntry ?? {};
    const productsPromise = queryDashboardProducts(userId)
      .then((products) => {
        entry.data = products;
        entry.request = undefined;
        return products;
      })
      .catch((error) => {
        developmentCache.delete(userId);
        throw error;
      });

    entry.request = productsPromise;
    developmentCache.set(userId, entry);
    return productsPromise;
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
  const cacheEntry = developmentCache.get(userId);

  // Serve the last loaded cards immediately in development while this quiet
  // refresh prepares the latest cards for the next render.
  if (cacheEntry?.data) {
    void queryDashboardProducts(userId)
      .then((products) => {
        cacheEntry.data = products;
      })
      .catch(() => {
        // The existing cache remains available if a background refresh fails.
      });
  } else {
    developmentCache.delete(userId);
  }

  // Production uses Next's stale-while-revalidate data cache: show the
  // existing cards first, then refresh them in the background.
  revalidateTag(dashboardProductsTag(userId), "max");
}
