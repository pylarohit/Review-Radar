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
  FolderOpen,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppFooter from "./Footer";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
        <div className="w-full text-center py-20 rounded-3xl border border-[var(--rr-muted)]/15 bg-[var(--rr-surface)] p-8 shadow-sm">
          <FolderOpen className="w-12 h-12 text-[var(--rr-muted)]/50 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[var(--rr-text)]">No products found</h3>
          <p className="text-[var(--rr-muted)] text-sm mt-1 max-w-sm mx-auto">No analyzed products exist in the system yet.</p>
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
                className="group rounded-2xl border border-[var(--rr-muted)]/15 bg-[var(--rr-surface)] p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between h-full"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--rr-accent)] bg-[var(--rr-accent)]/10 px-2.5 py-0.5 rounded-full border border-[var(--rr-accent)]/20">
                    {product.category}
                  </span>

                  <h3 className="mt-4 text-base font-bold text-[var(--rr-text)] line-clamp-2 group-hover:text-[var(--rr-accent)] transition-colors">
                    {product.name}
                  </h3>

                  <p className="mt-2.5 line-clamp-2 text-xs text-[var(--rr-muted)] leading-relaxed">
                    {product.description ?? "No description available."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--rr-muted)]/10 flex items-center justify-between text-xs font-semibold text-[var(--rr-muted)]">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-[var(--rr-muted)]/80" />
                    {hasReviews} reviews
                  </span>
                  
                  <span className="flex items-center gap-0.5 bg-amber-500/5 text-amber-500 px-2 py-0.5 rounded-lg border border-amber-500/10">
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
          <div className="flex items-center justify-between border-t border-[var(--rr-muted)]/15 pt-6 mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl border border-[var(--rr-muted)]/15 hover:bg-[var(--rr-surface)] text-[var(--rr-text)] font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span className="text-sm font-semibold text-[var(--rr-muted)]">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl border border-[var(--rr-muted)]/15 hover:bg-[var(--rr-surface)] text-[var(--rr-text)] font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
      
      {/* Mobile Search History Sidebar Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300" 
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          
          {/* Drawer content */}
          <aside className="relative flex w-72 max-w-xs flex-col bg-[var(--rr-surface)] p-6 shadow-xl animate-in slide-in-from-left duration-300 h-full text-[var(--rr-text)]">
            <div className="flex items-center justify-between border-b border-[var(--rr-muted)]/15 pb-3 mb-4">
              <h2 className="font-extrabold text-[11px] text-[var(--rr-muted)] uppercase tracking-widest flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-[var(--rr-accent)]" />
                Searched Products
              </h2>
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="rounded-lg p-1.5 text-[var(--rr-muted)] hover:bg-[var(--rr-bg)] hover:text-[var(--rr-text)] cursor-pointer"
                aria-label="Close history"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {products.length === 0 ? (
              <p className="text-xs text-[var(--rr-muted)] italic mt-4">No products searched yet.</p>
            ) : (
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1">
                <button
                  onClick={() => {
                    setSelectedProductId(null);
                    setIsMobileSidebarOpen(false);
                    const params = new URLSearchParams(window.location.search);
                    params.delete("productId");
                    window.history.pushState(null, "", `?${params.toString()}`);
                  }}
                  className={cn(
                    "w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer shrink-0 mb-1",
                    selectedProductId === null
                      ? "bg-[var(--rr-accent)]/10 text-[var(--rr-accent)] border-[var(--rr-accent)]/20"
                      : "text-[var(--rr-muted)] border-transparent hover:text-[var(--rr-text)] hover:bg-[var(--rr-bg)]"
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
                        setIsMobileSidebarOpen(false);
                        const params = new URLSearchParams(window.location.search);
                        params.set("productId", product.id);
                        window.history.pushState(null, "", `?${params.toString()}`);
                      }}
                      className={cn(
                        "w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all truncate border cursor-pointer shrink-0",
                        isActive
                          ? "bg-[var(--rr-accent)] text-white shadow-sm border-[var(--rr-accent)] font-bold"
                          : "text-[var(--rr-muted)] border-transparent hover:text-[var(--rr-text)] hover:bg-[var(--rr-bg)]"
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
        </div>
      )}

      {/* 1. Left Sidebar: Fixed Search History (w-72) */}
      <aside className="w-72 h-full bg-[var(--rr-surface)] border-r border-[var(--rr-muted)]/15 flex flex-col p-6 shrink-0 lg:flex hidden text-[var(--rr-text)]">
        <h2 className="font-extrabold text-[11px] text-[var(--rr-muted)] uppercase tracking-widest border-b border-[var(--rr-muted)]/15 pb-3 flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-[var(--rr-accent)]" />
          Searched Products
        </h2>
        
        {products.length === 0 ? (
          <p className="text-xs text-[var(--rr-muted)] italic mt-4">No products searched yet.</p>
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
                  ? "bg-[var(--rr-accent)]/10 text-[var(--rr-accent)] border-[var(--rr-accent)]/20"
                  : "text-[var(--rr-muted)] border-transparent hover:text-[var(--rr-text)] hover:bg-[var(--rr-bg)]"
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
                      ? "bg-[var(--rr-accent)] text-white shadow-sm border-[var(--rr-accent)] font-bold"
                      : "text-[var(--rr-muted)] border-transparent hover:text-[var(--rr-text)] hover:bg-[var(--rr-bg)]"
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
      <main className="flex-1 h-full overflow-y-auto flex flex-col justify-between text-[var(--rr-text)]">
        <div className="p-8 flex-1 w-full">
          {selectedProductId === null ? (
            /* GRID VIEW */
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  {/* FolderOpen button for mobile to open the sidebar */}
                  <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--rr-accent)]/10 text-[var(--rr-accent)] border border-[var(--rr-accent)]/20 hover:bg-[var(--rr-accent)]/20 font-bold text-xs transition-all cursor-pointer shadow-sm"
                  >
                    <FolderOpen className="w-4.5 h-4.5 text-[var(--rr-accent)]" />
                    History
                  </button>
                  <h1 className="text-2xl font-black text-[var(--rr-text)] tracking-tight">Analyzed Products</h1>
                </div>
                <span className="text-xs font-bold text-[var(--rr-text)] bg-[var(--rr-surface)] border border-[var(--rr-muted)]/15 px-3 py-1 rounded-full">
                  Showing {products.length} items
                </span>
              </div>
              {renderProductsGrid()}
            </div>
          ) : (
            /* DETAILS VIEW (WITH BACK LINK) */
            <div className="space-y-6">
              {/* Back button and History toggle */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <button
                  onClick={handleBackToGrid}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--rr-muted)] hover:text-[var(--rr-text)] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Products Grid
                </button>

                {/* Mobile sidebar trigger button */}
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--rr-accent)]/10 text-[var(--rr-accent)] border border-[var(--rr-accent)]/20 hover:bg-[var(--rr-accent)]/20 font-bold text-xs transition-all cursor-pointer shadow-sm"
                >
                  <FolderOpen className="w-4 h-4 text-[var(--rr-accent)]" />
                  History
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeProduct ? (
                  <motion.div
                    key={selectedProductId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-6"
                  >
                  
                  {/* Product Info Header */}
                  <div className="p-6 rounded-2xl border border-[var(--rr-muted)]/15 bg-[var(--rr-surface)] shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[var(--rr-accent)]/5 to-transparent rounded-full blur-2xl pointer-events-none"></div>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[var(--rr-accent)] bg-[var(--rr-accent)]/10 border border-[var(--rr-accent)]/20">
                          {activeProduct.category}
                        </span>
                        <h2 className="text-2xl font-black text-[var(--rr-text)] mt-3 tracking-tight leading-tight">
                          {activeProduct.name}
                        </h2>
                        {activeProduct.description && (
                          <p className="text-[var(--rr-muted)] text-sm mt-3 leading-relaxed">
                            {activeProduct.description}
                          </p>
                        )}
                      </div>

                      {activeProduct.productUrl && (
                        <a 
                          href={activeProduct.productUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-[var(--rr-muted)]/15 hover:border-[var(--rr-muted)]/30 hover:bg-[var(--rr-bg)] text-[var(--rr-muted)] hover:text-[var(--rr-text)] text-[11px] font-bold transition-all shrink-0 mt-1"
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
                        <div className="p-6 rounded-2xl border border-[var(--rr-muted)]/15 bg-[var(--rr-surface)] shadow-sm flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-xs text-[var(--rr-muted)] uppercase tracking-wider">Overall Sentiment</h3>
                            <span className="text-2xl font-black text-[var(--rr-accent)] mt-1 inline-block">
                              {activeAnalysis.overallSentiment}
                            </span>
                          </div>

                          <div className="space-y-3 mt-6">
                            <div>
                              <div className="flex justify-between text-xs font-semibold text-[var(--rr-muted)] mb-1">
                                <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-emerald-500" /> Positive</span>
                                <span className="text-emerald-500 font-bold">{activeAnalysis.positivePercent}%</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-[var(--rr-bg)] overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${activeAnalysis.positivePercent}%` }} />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-xs font-semibold text-[var(--rr-muted)] mb-1">
                                <span>Neutral</span>
                                <span className="text-[var(--rr-muted)] font-bold">{activeAnalysis.neutralPercent}%</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-[var(--rr-bg)] overflow-hidden">
                                <div className="h-full bg-zinc-400" style={{ width: `${activeAnalysis.neutralPercent}%` }} />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-xs font-semibold text-[var(--rr-muted)] mb-1">
                                <span className="flex items-center gap-1"><ThumbsDown className="w-3 h-3 text-rose-500" /> Negative</span>
                                <span className="text-rose-500 font-bold">{activeAnalysis.negativePercent}%</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-[var(--rr-bg)] overflow-hidden">
                                <div className="h-full bg-rose-500" style={{ width: `${activeAnalysis.negativePercent}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="p-6 rounded-2xl border border-[var(--rr-muted)]/15 bg-[var(--rr-surface)] shadow-sm md:col-span-2 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 text-[var(--rr-text)]">
                              <Sparkles className="w-4 h-4 text-[var(--rr-accent)] animate-pulse" />
                              <h3 className="font-bold text-xs uppercase tracking-wider">Gemini AI Synthesis</h3>
                            </div>
                            <p className="text-[var(--rr-text)]/90 text-sm leading-relaxed mt-4">
                              {activeAnalysis.summary}
                            </p>
                          </div>

                          <div className="border-t border-[var(--rr-muted)]/10 pt-3 mt-6 flex justify-between items-center text-[10px] text-[var(--rr-muted)]/80 font-medium">
                            <span>Model: Gemini 2.5 Flash</span>
                            <span>Synthesis based on verified feedback</span>
                          </div>
                        </div>
                      </div>

                      {/* Pros & Cons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                          <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5 mb-3">
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                            Key Pros
                          </h3>
                          <ul className="space-y-2">
                            {activeAnalysis.pros.map((pro, index) => (
                              <li key={index} className="text-xs text-[var(--rr-text)] flex items-start gap-2">
                                <span className="font-bold text-emerald-500">•</span>
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5">
                          <h3 className="font-bold text-xs uppercase tracking-wider text-rose-500 flex items-center gap-1.5 mb-3">
                            <XCircle className="w-4.5 h-4.5 text-rose-500" />
                            Key Cons
                          </h3>
                          <ul className="space-y-2">
                            {activeAnalysis.cons.map((con, index) => (
                              <li key={index} className="text-xs text-[var(--rr-text)] flex items-start gap-2">
                                <span className="font-bold text-rose-500">•</span>
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
                    <h3 className="font-bold text-base text-[var(--rr-text)] tracking-tight">
                      Verified Reviews ({activeReviews.length})
                    </h3>
                    
                    {activeReviews.length === 0 ? (
                      <div className="p-8 border border-[var(--rr-muted)]/15 rounded-2xl bg-[var(--rr-surface)] text-center text-[var(--rr-muted)] text-sm">
                        No detailed reviews exist for this product.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {activeReviews.map((review) => (
                          <div 
                            key={review.id} 
                            className="p-5 rounded-2xl border border-[var(--rr-muted)]/15 bg-[var(--rr-surface)] shadow-sm hover:border-[var(--rr-muted)]/30 transition-colors animate-in fade-in duration-200"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-[var(--rr-text)]">{review.reviewer}</span>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--rr-muted)] bg-[var(--rr-bg)] px-2 py-0.5 rounded border border-[var(--rr-muted)]/10">
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
                                          : "text-[var(--rr-muted)]/30"
                                      )} 
                                    />
                                  ))}
                                </div>

                                <span className={cn(
                                  "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                                  review.sentiment === "positive" 
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/25" 
                                    : review.sentiment === "negative"
                                    ? "bg-rose-500/10 text-rose-500 border-rose-500/25" 
                                    : "bg-[var(--rr-bg)] text-[var(--rr-muted)] border-[var(--rr-muted)]/15"
                                )}>
                                  {review.sentiment}
                                </span>
                              </div>
                            </div>

                            <p className="text-[var(--rr-text)]/90 text-xs sm:text-sm leading-relaxed">
                              "{review.reviewText}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  </motion.div>
                ) : (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-16 text-center text-[var(--rr-muted)]"
                  >
                    Loading analysis reports...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <AppFooter />
      </main>

    </div>
  );
}
