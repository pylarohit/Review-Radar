"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { startAnalysis } from "@/app/main/actions";
import { getUrlValidationError } from "@/lib/validators/url";
import Spinner from "@/components/ui/Spinner";
import { motion, AnimatePresence } from "framer-motion";

export default function AnalyzeCard() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isEmpty = url.trim().length === 0;
  const isDisabled = isEmpty || isPending;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = getUrlValidationError(url);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        await startAnalysis(url.trim());
      } catch {
        setError("Something went wrong starting the analysis. Please try again.");
      }
    });
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[var(--rr-surface)]/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8"
    >
      <label htmlFor="product-url" className="mb-2 block text-sm font-medium text-[var(--rr-muted)]">
        Product URL
      </label>

      <motion.input
        id="product-url"
        name="url"
        type="text"
        inputMode="url"
        autoComplete="off"
        spellCheck={false}
        placeholder="Paste Amazon, Flipkart, or product URL..."
        value={url}
        onChange={(event) => {
          setUrl(event.target.value);
          if (error) setError(null);
        }}
        disabled={isPending}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "product-url-error" : undefined}
        whileFocus={{ scale: 1.01, borderColor: "var(--rr-signal)" }}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-4 font-mono text-sm text-[var(--rr-text)] placeholder:text-[var(--rr-muted)]/70 outline-none transition-all duration-200 focus:border-[var(--rr-signal)]/60 focus:ring-2 focus:ring-[var(--rr-signal)]/20 disabled:opacity-60 sm:text-base"
      />

      <AnimatePresence>
        {error && (
          <motion.p
            id="product-url-error"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mt-2 text-sm text-rose-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.03, y: -2 } : {}}
        whileTap={!isDisabled ? { scale: 0.97 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--rr-signal)] px-6 py-4 text-base font-semibold text-[var(--rr-bg)] transition-all hover:brightness-110 hover:shadow-[0_0_24px_-4px_var(--rr-signal)] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-[var(--rr-muted)] disabled:shadow-none animate-pulse-glow"
      >
        {isPending ? (
          <>
            <Spinner className="h-5 w-5" />
            Analyzing…
          </>
        ) : (
          "Analyze"
        )}
      </motion.button>
    </motion.form>
  );
}