/**
 * Client-side analytics helper. Events are sent only when Google Analytics
 * has been loaded, which happens only after the visitor accepts analytics
 * cookies (components/consent/analytics-consent.tsx). Otherwise a no-op.
 */
type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

export const CONSENT_KEY = "se-consent";
export const CONSENT_OPEN_EVENT = "se:consent-open";

export function track(name: string, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
