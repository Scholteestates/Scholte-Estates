"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { site } from "@/config/site";
import { navItems } from "./nav-items";
import { LanguageSwitch } from "./language-switch";
import { Wordmark } from "./wordmark";
import { WhatsAppIcon } from "./icons";

export function SiteHeader({
  locale,
  nav,
  whatsappLabel,
}: {
  locale: Locale;
  nav: Dictionary["nav"];
  whatsappLabel: string;
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile menu after navigating.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (path: string) => {
    const href = `/${locale}${path}`;
    return path === "" ? pathname === href : pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ivory-200 bg-ivory-50">
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Link href={`/${locale}`} aria-label={`${site.name} — ${nav.home}`} className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={`/${locale}${item.path}`}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  className={`relative py-2 text-sm tracking-wide transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-gold-500 after:transition-transform ${
                    isActive(item.path)
                      ? "text-forest-900 after:scale-x-100"
                      : "text-muted hover:text-forest-900 after:scale-x-0 hover:after:scale-x-100"
                  }`}
                >
                  {nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <LanguageSwitch current={locale} label={nav.language} />
          <a
            href={site.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-forest-800 px-5 py-2.5 text-sm font-medium text-ivory-50 transition-colors hover:bg-forest-700"
          >
            <WhatsAppIcon className="size-4" />
            WhatsApp
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitch current={locale} label={nav.language} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-forest-900"
          >
            <span className="sr-only">{open ? nav.close : nav.menu}</span>
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span
                className={`absolute left-0 block h-px w-6 bg-current transition-transform ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-6 bg-current transition-transform ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-20 bottom-0 overflow-y-auto bg-ivory-50 lg:hidden"
      >
        <nav aria-label="Mobile" className="container-page flex flex-col py-8">
          <ul className="divide-y divide-ivory-200 border-y border-ivory-200">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={`/${locale}${item.path}`}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  className={`block py-4 font-serif text-2xl ${
                    isActive(item.path) ? "text-gold-600" : "text-forest-900"
                  }`}
                >
                  {nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={site.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-forest-800 px-6 py-4 font-medium text-ivory-50"
          >
            <WhatsAppIcon />
            {whatsappLabel}
          </a>
          <a
            href={`mailto:${site.contact.email}`}
            className="mt-3 text-center text-sm text-muted underline decoration-gold-400 underline-offset-4"
          >
            {site.contact.email}
          </a>
        </nav>
      </div>
    </header>
  );
}
