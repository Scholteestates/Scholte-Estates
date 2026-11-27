"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CONSENT_KEY, CONSENT_OPEN_EVENT, track } from "@/lib/analytics";

/**
 * Cookie banner + Google Analytics loader (GA4).
 *
 * Nothing is loaded from Google until the visitor presses "Accept". The
 * choice is stored in localStorage (CONSENT_KEY) and can be changed at any
 * time through "Cookie settings" in the footer. Withdrawing consent removes
 * the Google Analytics cookies and reloads the page so the script is gone.
 * Contact clicks (WhatsApp, email, phone) are recorded as events.
 */

type Labels = { title: string; body: string; accept: string; reject: string; policy: string };
type Choice = "granted" | "denied" | null;

function loadGa(id: string) {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js expects the arguments object itself.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id);
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

function clearGaCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.replace(/^www\./, "")}`];
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (!/^_ga(_|$)/.test(name)) continue;
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
  }
}

export function AnalyticsConsent({ gaId, labels, policyHref }: { gaId: string; labels: Labels; policyHref: string }) {
  const [choice, setChoice] = useState<Choice>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(CONSENT_KEY) as Choice;
    // Reading the stored choice must happen after hydration (localStorage).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChoice(saved);
    if (saved === "granted") loadGa(gaId);
    else if (!saved) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);

    /* Contact clicks become analytics events (no-op without consent). */
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const page = window.location.pathname;
      if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) track("whatsapp_click", { page });
      else if (href.startsWith("mailto:")) track("email_click", { page });
      else if (href.startsWith("tel:")) track("phone_click", { page });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => {
      window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, [gaId]);

  const decide = (c: "granted" | "denied") => {
    const before = choice;
    window.localStorage.setItem(CONSENT_KEY, c);
    setChoice(c);
    setOpen(false);
    if (c === "granted") loadGa(gaId);
    else if (before === "granted") {
      // Stop gtag first (Google's opt-out flag) so it cannot rewrite its cookies, then clear and reload.
      (window as unknown as Record<string, boolean>)[`ga-disable-${gaId}`] = true;
      clearGaCookies();
      window.setTimeout(() => {
        clearGaCookies();
        window.location.reload();
      }, 300);
    }
  };

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="consent-in fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl bg-ivory-50 p-6 shadow-[0_24px_60px_-20px_rgb(15_33_24/0.45)] ring-1 ring-ivory-300 sm:inset-x-6 sm:bottom-6 md:left-6 md:mx-0 md:p-7"
    >
      <p id="consent-title" className="font-serif text-2xl leading-tight text-forest-900">
        {labels.title}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {labels.body}{" "}
        <Link href={policyHref} className="underline decoration-gold-500 underline-offset-4 hover:text-forest-900">
          {labels.policy}
        </Link>
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => decide("denied")}
          className="rounded-full border border-forest-800 px-5 py-3 text-[0.7rem] font-semibold tracking-[0.18em] text-forest-800 uppercase transition-colors hover:bg-ivory-100"
        >
          {labels.reject}
        </button>
        <button
          type="button"
          onClick={() => decide("granted")}
          className="rounded-full bg-forest-800 px-5 py-3 text-[0.7rem] font-semibold tracking-[0.18em] text-ivory-50 uppercase transition-colors hover:bg-forest-700"
        >
          {labels.accept}
        </button>
      </div>
    </div>
  );
}

/** Footer link that reopens the banner so visitors can change their choice. */
export function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))} className={className}>
      {label}
    </button>
  );
}
