import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invalidateDashboardProducts } from "@/lib/dashboard-products";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: { userId: session.userId },
      select: { productUrl: true }
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Verify ownership before delete
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    console.log("DELETE CHECK VALUES:", {
      productId,
      productExists: !!product,
      productUserId: product?.userId,
      sessionUserId: session.userId,
      match: product ? product.userId === session.userId : false
    });

    if (!product || product.userId !== session.userId) {
      return NextResponse.json({ error: "Product not found or unauthorized" }, { status: 404 });
    }

    // Delete reviews, analyses, and product
    await prisma.review.deleteMany({ where: { productId } });
    await prisma.analysis.deleteMany({ where: { productId } });
    await prisma.product.delete({ where: { id: productId } });

    invalidateDashboardProducts(session.userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        category: body.category,
        description: body.description,
        imageUrl: body.imageUrl,
        productUrl: body.productUrl,
        userId: body.userId,
      },
    });

    invalidateDashboardProducts(product.userId);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
