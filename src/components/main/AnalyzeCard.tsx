"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { startAnalysis } from "@/app/main/actions";
import { getUrlValidationError } from "@/lib/validators/url";
import Spinner from "@/components/ui/Spinner";

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
        const { id } = await startAnalysis(url.trim());
        router.push(`/analysis/${id}`);
      } catch {
        setError("Something went wrong starting the analysis. Please try again.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[var(--rr-surface)]/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8"
    >
      <label htmlFor="product-url" className="mb-2 block text-sm font-medium text-[var(--rr-muted)]">
        Product URL
      </label>

      <input
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
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-4 font-mono text-sm text-[var(--rr-text)] placeholder:text-[var(--rr-muted)]/70 outline-none transition-colors focus:border-[var(--rr-signal)]/60 focus:ring-2 focus:ring-[var(--rr-signal)]/20 disabled:opacity-60 sm:text-base"
      />

      {error && (
        <p id="product-url-error" className="mt-2 text-sm text-rose-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isDisabled}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--rr-signal)] px-6 py-4 text-base font-semibold text-[var(--rr-bg)] transition-all hover:brightness-110 hover:shadow-[0_0_24px_-4px_var(--rr-signal)] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-[var(--rr-muted)] disabled:shadow-none"
      >
        {isPending ? (
          <>
            <Spinner className="h-5 w-5" />
            Analyzing…
          </>
        ) : (
          "Analyze"
        )}
      </button>
    </form>
  );
}