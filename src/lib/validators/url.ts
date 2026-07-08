export type ProductPlatform = "amazon" | "flipkart" | "myntra" | "generic";

/**
 * Returns true if the given string is a well-formed http(s) URL.
 */
export function isValidUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;

  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Detects which supported platform a product URL belongs to.
 * Returns null if the URL itself is invalid.
 */
export function detectPlatform(value: string): ProductPlatform | null {
  if (!isValidUrl(value)) return null;

  const host = new URL(value.trim()).hostname.toLowerCase();

  if (host.includes("amazon.")) return "amazon";
  if (host.includes("flipkart.")) return "flipkart";
  if (host.includes("myntra.")) return "myntra";
  return "generic";
}

/**
 * Human-readable validation message for the URL input.
 * Returns null when the URL is valid.
 */
export function getUrlValidationError(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Paste a product URL to continue.";
  if (!isValidUrl(trimmed)) {
    return "That doesn't look like a valid URL. Include https:// and try again.";
  }
  return null;
}
