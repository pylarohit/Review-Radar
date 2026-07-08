"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Star, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ThumbsUp, 
  ThumbsDown,
  ExternalLink 
} from "lucide-react";
import { cn } from "@/lib/utils";

type Review = {
  id: string;
  reviewer: string;
  rating: number;
  reviewText: string;
  sentiment: string;
};

type Analysis = {
  overallSentiment: string;
  positivePercent: number;
  neutralPercent: number;
  negativePercent: number;
  summary: string;
  pros: string[];
  cons: string[];
};

type Product = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  productUrl: string | null;
};

type AnalysisResult = {
  product: Product;
  analysis: Analysis;
  reviews: Review[];
};

export default function ProductAnalyzer() {
  const router = useRouter();
  const [productUrl, setProductUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingTexts = [
    "Contacting product database...",
    "Retrieving context details from URL...",
    "Invoking Gemini to analyze opinions...",
    "Synthesizing customer reviews & sentiment...",
    "Finalizing report breakdown..."
  ];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!productUrl.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setLoadingStep(0);

    // Simulate loading step transitions for premium UX feel
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingTexts.length - 1 ? prev + 1 : prev));
    }, 1800);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productUrl }),
      });

      clearInterval(interval);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Analysis failed");
      }

      const data = await response.json();
      setResult(data);
      router.push(`/dashboard?productId=${data.product.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Search Input Card */}
      <section className="w-full max-w-3xl text-center mb-12">
        <p className="mb-3 text-sm font-semibold tracking-wider text-violet-650 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
          AI-POWERED REVIEW RADAR
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 md:text-6xl">
          Understand product reviews
          <span className="block text-violet-600 mt-1">before you buy.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-zinc-500 text-lg leading-relaxed">
          Paste a product URL and ReviewRadar will analyze customer reviews,
          summarize opinions, and highlight the most important pros and cons.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 flex max-w-3xl gap-3"
        >
          <input
            type="url"
            required
            value={productUrl}
            onChange={(event) => setProductUrl(event.target.value)}
            placeholder="Paste Amazon, BestBuy, or other product link here..."
            className="h-14 flex-1 rounded-xl border border-zinc-200 bg-white px-5 outline-none text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 shadow-sm transition-all text-sm sm:text-base"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-violet-600 px-8 font-semibold text-white hover:bg-violet-700 active:scale-[0.98] shadow-md shadow-violet-500/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? "Analyzing..." : "Analyze"}
          </button>
        </form>
      </section>

      {/* Loading State Skeleton */}
      {isLoading && (
        <div className="w-full max-w-4xl p-8 rounded-3xl border border-zinc-200/80 bg-white/70 backdrop-blur-md shadow-lg flex flex-col items-center py-16 animate-pulse">
          <Loader2 className="w-10 h-10 text-violet-650 animate-spin mb-4" />
          <h3 className="font-bold text-lg text-zinc-800 transition-all duration-300">
            {loadingTexts[loadingStep]}
          </h3>
          <p className="text-xs text-zinc-400 mt-2">Gemini is synthesizing live data patterns. This takes a few seconds.</p>
          
          <div className="w-full mt-10 space-y-6">
            <div className="h-6 bg-zinc-200/60 rounded-lg w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-28 bg-zinc-200/60 rounded-2xl"></div>
              <div className="h-28 bg-zinc-200/60 rounded-2xl col-span-2"></div>
            </div>
            <div className="h-40 bg-zinc-200/60 rounded-2xl"></div>
          </div>
        </div>
      )}

      {/* Error Card */}
      {error && (
        <div className="w-full max-w-2xl p-6 rounded-2xl border border-rose-200 bg-rose-50/50 text-rose-800 flex items-start gap-3 shadow-sm mb-12">
          <AlertCircle className="w-5 h-5 mt-0.5 text-rose-600 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm text-rose-900">Analysis Error</h4>
            <p className="text-sm mt-1 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Result Display Section */}
      {result && (
        <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
          
          {/* Product Overview Header Card */}
          <div className="p-8 rounded-3xl border border-zinc-200/80 bg-white shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-violet-650 bg-violet-50 border border-violet-100">
                  {result.product.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-3 tracking-tight">
                  {result.product.name}
                </h2>
                <p className="text-zinc-500 text-sm sm:text-base mt-3 leading-relaxed">
                  {result.product.description}
                </p>
              </div>

              {result.product.productUrl && (
                <a 
                  href={result.product.productUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 text-xs font-semibold transition-all mt-1"
                >
                  Visit Link <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Sentiment Meter and Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sentiment Meter (1 Column) */}
            <div className="p-6 rounded-2xl border border-zinc-200/80 bg-white shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-zinc-800">Overall Sentiment</h3>
                <span className="text-2xl font-black text-violet-650 mt-1 inline-block">
                  {result.analysis.overallSentiment}
                </span>
              </div>

              <div className="space-y-3.5 mt-6">
                {/* Positive bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-zinc-500 mb-1">
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-emerald-500" /> Positive</span>
                    <span className="text-emerald-600">{result.analysis.positivePercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-emerald-500" 
                      style={{ width: `${result.analysis.positivePercent}%` }}
                    />
                  </div>
                </div>

                {/* Neutral bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-zinc-500 mb-1">
                    <span className="flex items-center gap-1">Neutral</span>
                    <span className="text-zinc-600">{result.analysis.neutralPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-zinc-400" 
                      style={{ width: `${result.analysis.neutralPercent}%` }}
                    />
                  </div>
                </div>

                {/* Negative bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-zinc-500 mb-1">
                    <span className="flex items-center gap-1"><ThumbsDown className="w-3 h-3 text-rose-500" /> Negative</span>
                    <span className="text-rose-600">{result.analysis.negativePercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-rose-500" 
                      style={{ width: `${result.analysis.negativePercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Summary (2 Columns) */}
            <div className="p-6 rounded-2xl border border-zinc-200/80 bg-white shadow-sm md:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-zinc-800">
                  <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
                  <h3 className="font-bold text-sm">Gemini AI Synthesis</h3>
                </div>
                <p className="text-zinc-650 text-sm leading-relaxed mt-4">
                  {result.analysis.summary}
                </p>
              </div>

              <div className="border-t border-zinc-100 pt-4 mt-6 flex justify-between items-center text-[11px] text-zinc-400 font-medium">
                <span>Model: Gemini 1.5 Flash</span>
                <span>Highly confident assessment</span>
              </div>
            </div>
          </div>

          {/* Pros and Cons Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pros card */}
            <div className="p-6 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-sm">
              <h3 className="font-bold text-sm text-emerald-900 flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                Key Pros
              </h3>
              <ul className="space-y-2.5">
                {result.analysis.pros.map((pro, index) => (
                  <li key={index} className="text-sm text-zinc-700 flex items-start gap-2">
                    <span className="font-bold text-emerald-600 mt-0.5">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons card */}
            <div className="p-6 rounded-2xl border border-rose-100 bg-rose-50/20 shadow-sm">
              <h3 className="font-bold text-sm text-rose-900 flex items-center gap-2 mb-4">
                <XCircle className="w-4.5 h-4.5 text-rose-600" />
                Key Cons
              </h3>
              <ul className="space-y-2.5">
                {result.analysis.cons.map((con, index) => (
                  <li key={index} className="text-sm text-zinc-700 flex items-start gap-2">
                    <span className="font-bold text-rose-600 mt-0.5">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Generated Customer Reviews List */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-zinc-800 tracking-tight">Generated Verified Reviews</h3>
            <div className="grid grid-cols-1 gap-4">
              {result.reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="p-5 rounded-2xl border border-zinc-200/80 bg-white hover:border-zinc-300 transition-colors shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-zinc-800">{review.reviewer}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">
                        Verified Reviewer
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Star ratings */}
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={cn(
                              "w-3.5 h-3.5",
                              i < review.rating 
                                ? "text-amber-400 fill-amber-400" 
                                : "text-zinc-200"
                            )} 
                          />
                        ))}
                      </div>

                      {/* Sentiment Tag */}
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                        review.sentiment === "positive" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : review.sentiment === "negative"
                          ? "bg-rose-50 text-rose-700 border-rose-100" 
                          : "bg-zinc-50 text-zinc-700 border-zinc-200"
                      )}>
                        {review.sentiment}
                      </span>
                    </div>
                  </div>

                  <p className="text-zinc-650 text-sm leading-relaxed">
                    "{review.reviewText}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}