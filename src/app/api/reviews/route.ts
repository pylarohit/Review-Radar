import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invalidateDashboardProducts } from "@/lib/dashboard-products";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const review = await prisma.review.create({
      data: {
        productId: body.productId,
        reviewer: body.reviewer,
        rating: body.rating,
        reviewText: body.reviewText,
        sentiment: body.sentiment,
      },
    });

    const product = await prisma.product.findUnique({
      where: { id: review.productId },
      select: { userId: true },
    });

    if (product) {
      invalidateDashboardProducts(product.userId);
    }

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
