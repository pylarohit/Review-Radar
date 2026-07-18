import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invalidateDashboardProducts } from "@/lib/dashboard-products";

export async function GET() {
  try {
    const products = await prisma.product.findMany();

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
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
