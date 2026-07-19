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

export function dashboardProductsTag(userId: string) {
  return `dashboard-products:${userId}`;
}

export async function getDashboardProducts(userId: string) {
  if (process.env.NODE_ENV !== "production") {
    return queryDashboardProducts(userId);
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
  revalidateTag(dashboardProductsTag(userId), "max");
}
