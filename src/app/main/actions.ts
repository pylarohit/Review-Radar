"use server";

import { redirect } from "next/navigation";
import { isValidUrl } from "@/lib/validators/url";

export async function startAnalysis(productUrl: string) {
  if (!isValidUrl(productUrl)) {
    throw new Error("Invalid URL");
  }

  const analysisId = crypto.randomUUID();
  redirect(`/analysis/${analysisId}?url=${encodeURIComponent(productUrl)}`);
}