import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { productUrl } = await request.json();

    if (!productUrl || !productUrl.trim()) {
      return NextResponse.json(
        { error: "Product URL is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      );
    }

    // Call Gemini API to extract details and generate realistic reviews
    const prompt = `
      You are a professional product reviewer and sentiment analyst.
      Analyze the following product URL and synthesize customer feedback and reviews.
      Product URL: "${productUrl}"

      Please generate a realistic set of customer reviews, pros, cons, and overall sentiment analysis.
      You must respond with raw JSON only.
      
      CRITICAL JSON FORMATTING RULES:
      1. Every string field value must use standard JSON double quotes.
      2. If you need to include quotes inside a string (e.g. inside reviewText or summary), use single quotes (') instead of double quotes, or escape them with double backslashes.
      3. The JSON must be perfectly formatted and directly parseable by JSON.parse() without throwing SyntaxErrors.

      The JSON must strictly conform to the following schema:
      {
        "name": "Detailed Product Name (e.g. Sony WH-1000XM4 Wireless Headphones)",
        "category": "A single word category name (e.g. Electronics, Fashion, Home, Books)",
        "description": "A concise 2-3 sentence overview of the product based on the URL context.",
        "overallSentiment": "Positive | Neutral | Negative | Mixed",
        "positivePercent": 80,
        "neutralPercent": 10,
        "negativePercent": 10,
        "summary": "A detailed 2-3 sentence summary of what customers generally say about this product.",
        "pros": ["Pro 1", "Pro 2", "Pro 3"],
        "cons": ["Con 1", "Con 2", "Con 3"],
        "reviews": [
          {
            "reviewer": "John Doe",
            "rating": 5,
            "reviewText": "Detailed feedback describing their experience, pros/cons mentioned in detail. Use single quotes for any nested quotes.",
            "sentiment": "positive | neutral | negative"
          },
          {
            "reviewer": "Jane Smith",
            "rating": 3,
            "reviewText": "Detailed neutral feedback. Use single quotes for any nested quotes.",
            "sentiment": "neutral"
          },
          {
            "reviewer": "Alex Jones",
            "rating": 1,
            "reviewText": "Detailed negative feedback. Use single quotes for any nested quotes.",
            "sentiment": "negative"
          }
        ]
      }
    `;

    // Query Gemini
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", errorText);
      return NextResponse.json(
        { error: "Failed to communicate with Gemini API" },
        { status: 502 }
      );
    }

    const responseData = await geminiResponse.json();
    const rawText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json(
        { error: "No response received from Gemini API" },
        { status: 502 }
      );
    }

    // Clean markdown code blocks from response if present
    let cleanText = rawText.trim();
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```[a-zA-Z]*\n/, "");
      cleanText = cleanText.replace(/\n```$/, "");
    }

    // Parse the JSON returned by Gemini
    const parsedData = JSON.parse(cleanText.trim());

    // 1. Get or create a default user to own the product
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "Pratik",
          email: "pratik@example.com",
          password: "dummy_password_hash",
        },
      });
    }

    // 2. Create Product record
    const product = await prisma.product.create({
      data: {
        name: parsedData.name || "Unknown Product",
        category: parsedData.category || "General",
        description: parsedData.description || "",
        productUrl: productUrl,
        userId: user.id,
      },
    });

    // 3. Create Reviews in bulk
    const reviewsData = (parsedData.reviews || []).map((r: any) => ({
      productId: product.id,
      reviewer: r.reviewer || "Anonymous",
      rating: Number(r.rating) || 5,
      reviewText: r.reviewText || "",
      sentiment: r.sentiment || "positive",
    }));

    if (reviewsData.length > 0) {
      await prisma.review.createMany({
        data: reviewsData,
      });
    }

    // 4. Create Analysis record
    const analysis = await prisma.analysis.create({
      data: {
        productId: product.id,
        overallSentiment: parsedData.overallSentiment || "Positive",
        positivePercent: Number(parsedData.positivePercent) || 0,
        neutralPercent: Number(parsedData.neutralPercent) || 0,
        negativePercent: Number(parsedData.negativePercent) || 0,
        summary: parsedData.summary || "",
        pros: parsedData.pros || [],
        cons: parsedData.cons || [],
      },
    });

    // Fetch final reviews to return with database ids
    const savedReviews = await prisma.review.findMany({
      where: { productId: product.id },
    });

    return NextResponse.json(
      {
        product,
        analysis,
        reviews: savedReviews,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Analysis route error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during analysis" },
      { status: 500 }
    );
  }
}
