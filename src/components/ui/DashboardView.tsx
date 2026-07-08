"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Star, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ThumbsUp, 
  ThumbsDown, 
  ExternalLink,
  MessageSquare,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppFooter from "./Footer";

type Review = {
  id: string;
  reviewer: string | null;
  rating: number;
  reviewText: string;
  sentiment: string | null;
};

type Analysis = {
  id: string;
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
  createdAt: Date;
  reviews: Review[];
  analyses: Analysis[];
};

interface DashboardViewProps {
  products: Product[];
}

export default function DashboardView({ products }: DashboardViewProps) {
  const searchParams = useSearchParams();
  
  // Selection state
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12; // 3 columns * 4 rows

  // Read URL search param on mount or update
  useEffect(() => {
    const queryProductId = searchParams.get("productId");
    if (queryProductId && products.some(p => p.id === queryProductId)) {
      setSelectedProductId(queryProductId);
    }
  }, [searchParams, products]);

  // Paginated chunk
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return products.slice(start, start + itemsPerPage);
  }, [products, currentPage]);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const activeProduct = products.find(p => p.id === selectedProductId) || null;
  const activeAnalysis = activeProduct?.analyses?.[0] || null;
  const activeReviews = activeProduct?.reviews || [];

  const handleBackToGrid = () => {
    setSelectedProductId(null);
    // Remove query parameter silently
    const params = new URLSearchParams(window.location.search);
    params.delete("productId");
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  // Render Product Cards Grid
  const renderProductsGrid = () => {
    if (products.length === 0) {
      return (
        <div className="w-full text-center py-20 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <FolderOpen className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-zinc-800">No products found</h3>
          <p className="text-zinc-500 text-sm mt-1 max-w-sm mx-auto">No analyzed products exist in the system yet.</p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((product) => {
            const hasReviews = product.reviews.length;
            const avgRating = hasReviews 
              ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / hasReviews).toFixed(1) 
              : "0.0";

            return (
              <article 
                key={product.id}
                onClick={() => {
                  setSelectedProductId(product.id);
                  const params = new URLSearchParams(window.location.search);
                  params.set("productId", product.id);
                  window.history.pushState(null, "", `?${params.toString()}`);
                }}
                className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between h-full"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-100">
                    {product.category}
                  </span>

                  <h3 className="mt-4 text-base font-bold text-zinc-900 line-clamp-2 group-hover:text-violet-650 transition-colors">
                    {product.name}
                  </h3>

                  <p className="mt-2.5 line-clamp-2 text-xs text-zinc-500 leading-relaxed">
                    {product.description ?? "No description available."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-zinc-500">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-455" />
                    {hasReviews} reviews
                  </span>
                  
                  <span className="flex items-center gap-0.5 bg-amber-50/50 text-amber-700 px-2 py-0.5 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {avgRating}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-200 pt-6 mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              Previous
            </button>

            <span className="text-sm font-semibold text-zinc-500">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex overflow-hidden">
      
      {/* 1. Left Sidebar: Fixed Search History (w-72) */}
      <aside className="w-72 h-full bg-white border-r border-zinc-200 flex flex-col p-6 shrink-0 lg:flex hidden">
        <h2 className="font-extrabold text-[11px] text-zinc-400 uppercase tracking-widest border-b border-zinc-150 pb-3 flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-violet-500" />
          Searched Products
        </h2>
        
        {products.length === 0 ? (
          <p className="text-xs text-zinc-450 italic mt-4">No products searched yet.</p>
        ) : (
          <div className="flex-1 overflow-y-auto mt-4 pr-1 flex flex-col gap-1">
            <button
              onClick={() => {
                setSelectedProductId(null);
                const params = new URLSearchParams(window.location.search);
                params.delete("productId");
                window.history.pushState(null, "", `?${params.toString()}`);
              }}
              className={cn(
                "w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer shrink-0 mb-1",
                selectedProductId === null
                  ? "bg-violet-50 text-violet-750 border-violet-100"
                  : "text-zinc-550 border-transparent hover:text-zinc-900 hover:bg-zinc-50"
              )}
            >
              All Products Grid
            </button>
            
            {products.map((product) => {
              const isActive = product.id === selectedProductId;
              return (
                <button
                  key={product.id}
                  onClick={() => {
                    setSelectedProductId(product.id);
                    const params = new URLSearchParams(window.location.search);
                    params.set("productId", product.id);
                    window.history.pushState(null, "", `?${params.toString()}`);
                  }}
                  className={cn(
                    "w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all truncate border cursor-pointer shrink-0",
                    isActive
                      ? "bg-violet-600 text-white shadow-sm border-violet-600 font-bold"
                      : "text-zinc-650 border-transparent hover:text-zinc-900 hover:bg-zinc-50"
                  )}
                  title={product.name}
                >
                  {product.name}
                </button>
              );
            })}
          </div>
        )}
      </aside>

      {/* 2. Right Workspace: Main Content Area (flex-1) */}
      <main className="flex-1 h-full overflow-y-auto flex flex-col justify-between">
        <div className="p-8 flex-1 w-full">
          {selectedProductId === null ? (
            /* GRID VIEW */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Analyzed Products</h1>
                <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
                  Showing {products.length} items
                </span>
              </div>
              {renderProductsGrid()}
            </div>
          ) : (
            /* DETAILS VIEW (WITH BACK LINK) */
            <div className="space-y-6">
              {/* Back button */}
              <button
                onClick={handleBackToGrid}
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-655 hover:text-zinc-955 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Products Grid
              </button>

              {activeProduct ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                  
                  {/* Product Info Header */}
                  <div className="p-6 rounded-2xl border border-zinc-200/80 bg-white shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-violet-500/5 to-transparent rounded-full blur-2xl pointer-events-none"></div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-violet-650 bg-violet-50 border border-violet-100">
                          {activeProduct.category}
                        </span>
                        <h2 className="text-2xl font-black text-zinc-900 mt-3 tracking-tight leading-tight">
                          {activeProduct.name}
                        </h2>
                        {activeProduct.description && (
                          <p className="text-zinc-550 text-sm mt-3 leading-relaxed">
                            {activeProduct.description}
                          </p>
                        )}
                      </div>

                      {activeProduct.productUrl && (
                        <a 
                          href={activeProduct.productUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-500 hover:text-zinc-800 text-[11px] font-bold transition-all shrink-0 mt-1"
                        >
                          Visit Product <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Sentiment Summary */}
                  {activeAnalysis && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Sentiment breakdown */}
                        <div className="p-6 rounded-2xl border border-zinc-200/85 bg-white shadow-sm flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-xs text-zinc-500 uppercase tracking-wider">Overall Sentiment</h3>
                            <span className="text-2xl font-black text-violet-655 mt-1 inline-block">
                              {activeAnalysis.overallSentiment}
                            </span>
                          </div>

                          <div className="space-y-3 mt-6">
                            <div>
                              <div className="flex justify-between text-xs font-semibold text-zinc-500 mb-1">
                                <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-emerald-500" /> Positive</span>
                                <span className="text-emerald-600">{activeAnalysis.positivePercent}%</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${activeAnalysis.positivePercent}%` }} />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-xs font-semibold text-zinc-500 mb-1">
                                <span>Neutral</span>
                                <span className="text-zinc-655">{activeAnalysis.neutralPercent}%</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                                <div className="h-full bg-zinc-400" style={{ width: `${activeAnalysis.neutralPercent}%` }} />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-xs font-semibold text-zinc-500 mb-1">
                                <span className="flex items-center gap-1"><ThumbsDown className="w-3 h-3 text-rose-500" /> Negative</span>
                                <span className="text-rose-600">{activeAnalysis.negativePercent}%</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                                <div className="h-full bg-rose-500" style={{ width: `${activeAnalysis.negativePercent}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="p-6 rounded-2xl border border-zinc-200/85 bg-white shadow-sm md:col-span-2 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 text-zinc-800">
                              <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
                              <h3 className="font-bold text-xs uppercase tracking-wider">Gemini AI Synthesis</h3>
                            </div>
                            <p className="text-zinc-600 text-sm leading-relaxed mt-4">
                              {activeAnalysis.summary}
                            </p>
                          </div>

                          <div className="border-t border-zinc-100 pt-3 mt-6 flex justify-between items-center text-[10px] text-zinc-400 font-medium">
                            <span>Model: Gemini 2.5 Flash</span>
                            <span>Synthesis based on verified feedback</span>
                          </div>
                        </div>
                      </div>

                      {/* Pros & Cons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/15">
                          <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-3">
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                            Key Pros
                          </h3>
                          <ul className="space-y-2">
                            {activeAnalysis.pros.map((pro, index) => (
                              <li key={index} className="text-xs text-zinc-655 flex items-start gap-2">
                                <span className="font-bold text-emerald-600">•</span>
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-5 rounded-2xl border border-rose-100 bg-rose-50/15">
                          <h3 className="font-bold text-xs uppercase tracking-wider text-rose-800 flex items-center gap-1.5 mb-3">
                            <XCircle className="w-4.5 h-4.5 text-rose-600" />
                            Key Cons
                          </h3>
                          <ul className="space-y-2">
                            {activeAnalysis.cons.map((con, index) => (
                              <li key={index} className="text-xs text-zinc-650 flex items-start gap-2">
                                <span className="font-bold text-rose-600">•</span>
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4 pt-2">
                    <h3 className="font-bold text-base text-zinc-900 tracking-tight">
                      Verified Reviews ({activeReviews.length})
                    </h3>
                    
                    {activeReviews.length === 0 ? (
                      <div className="p-8 border border-zinc-200 rounded-2xl bg-white text-center text-zinc-400 text-sm">
                        No detailed reviews exist for this product.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {activeReviews.map((review) => (
                          <div 
                            key={review.id} 
                            className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-sm hover:border-zinc-250 transition-colors animate-in fade-in duration-200"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-zinc-800">{review.reviewer}</span>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">
                                  Verified Purchase
                                </span>
                              </div>

                              <div className="flex items-center gap-2.5">
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

                                <span className={cn(
                                  "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
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

                            <p className="text-zinc-655 text-xs sm:text-sm leading-relaxed">
                              "{review.reviewText}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="p-16 text-center text-zinc-400">Loading analysis reports...</div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <AppFooter />
      </main>

    </div>
  );
}
