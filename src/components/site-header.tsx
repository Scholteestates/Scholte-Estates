"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { mailto, site, tel } from "@/config/site";
import { navItems } from "./nav-items";
import { LanguageSwitch } from "./language-switch";
import { Wordmark } from "./wordmark";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "./icons";

/**
 * Fixed header: a thin contact bar (desktop) above the main navigation.
 * On pages with a full-screen hero (`overlay`), it starts transparent over
 * the image and turns solid ivory once the visitor scrolls.
 */
export function SiteHeader({
  locale,
  nav,
  whatsappLabel,
  emailSubject,
  overlayPaths,
}: {
  locale: Locale;
  nav: Dictionary["nav"];
  whatsappLabel: string;
  emailSubject: string;
  overlayPaths: string[];
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile menu after navigating.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const overlay = overlayPaths.some((p) => pathname === `/${locale}${p}`);
  const transparent = overlay && !scrolled && !open;

  const isActive = (path: string) => {
    const href = `/${locale}${path}`;
    return path === "" ? pathname === href : pathname.startsWith(href);
  };

  const linkTone = transparent ? "text-ivory-50/85 hover:text-ivory-50" : "text-muted hover:text-forest-900";
  const activeTone = transparent ? "text-ivory-50" : "text-forest-900";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,color] duration-500 ${
          transparent
            ? "bg-gradient-to-b from-forest-950/60 to-transparent"
            : "bg-ivory-50 shadow-[0_1px_0_var(--color-ivory-200)]"
        }`}
      >
        {/* Thin contact bar */}
        <div
          className={`hidden overflow-hidden transition-[height,opacity] duration-500 md:block ${
            scrolled && !open ? "h-0 opacity-0" : "h-9 opacity-100"
          } ${transparent ? "border-b border-ivory-50/15" : "border-b border-ivory-200 bg-forest-900"}`}
        >
          <div className="container-page flex h-9 items-center justify-between text-[0.72rem] tracking-[0.08em] text-ivory-200">
            <div className="flex items-center gap-6">
              <a href={tel} className="inline-flex items-center gap-2 hover:text-ivory-50">
                <PhoneIcon className="size-3.5 text-gold-400" />
                {site.contact.phoneDisplay}
              </a>
              <a href={mailto(emailSubject)} className="inline-flex items-center gap-2 hover:text-ivory-50">
                <MailIcon className="size-3.5 text-gold-400" />
                {site.contact.email}
              </a>
            </div>
            <div className="flex items-center gap-5">
              <span className="hidden text-ivory-200/70 lg:inline">
                {site.location.town} · {site.location.region}
              </span>
              <LanguageSwitch current={locale} label={nav.language} tone="light" />
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="container-page flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
          <Link href={`/${locale}`} aria-label={`${site.name} — ${nav.home}`} className="shrink-0">
            <Wordmark tone={transparent ? "light" : "dark"} />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-7 xl:gap-9">
              {navItems
                .filter((i) => i.key !== "home")
                .map((item) => (
                  <li key={item.key}>
                    <Link
                      href={`/${locale}${item.path}`}
                      aria-current={isActive(item.path) ? "page" : undefined}
                      className={`relative py-2 text-[0.8rem] font-medium tracking-[0.14em] uppercase transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-gold-400 after:transition-transform after:duration-300 ${
                        isActive(item.path) ? `${activeTone} after:scale-x-100` : `${linkTone} after:scale-x-0 hover:after:scale-x-100`
                      }`}
                    >
                      {nav[item.key]}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          <div className="hidden items-center lg:flex">
            <a
              href={site.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.8rem] font-semibold tracking-wide transition-colors ${
                transparent
                  ? "bg-ivory-50/10 text-ivory-50 ring-1 ring-ivory-50/40 hover:bg-ivory-50 hover:text-forest-900"
                  : "bg-forest-800 text-ivory-50 hover:bg-forest-700"
              }`}
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp
            </a>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <span className="md:hidden">
              <LanguageSwitch current={locale} label={nav.language} tone={transparent ? "light" : "dark"} />
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className={`-mr-2 inline-flex size-11 items-center justify-center rounded-full ${
                transparent ? "text-ivory-50" : "text-forest-900"
              }`}
            >
              <span className="sr-only">{open ? nav.close : nav.menu}</span>
              <span aria-hidden="true" className="relative block h-3 w-6">
                <span
                  className={`absolute left-0 block h-px w-6 bg-current transition-all duration-300 ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px bg-current transition-all duration-300 ${
                    open ? "top-1.5 w-6 -rotate-45" : "top-3 w-4"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for pages without a full-screen hero */}
      {!overlay && <div aria-hidden="true" className="h-[4.5rem] md:h-[6.75rem] lg:h-[7.25rem]" />}

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-[4.5rem] bottom-0 z-30 overflow-y-auto bg-ivory-50 md:top-[6.75rem] lg:hidden"
      >
        <nav aria-label="Mobile" className="container-page flex min-h-full flex-col py-8">
          <ul className="divide-y divide-ivory-200 border-y border-ivory-200">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={`/${locale}${item.path}`}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  className={`flex items-center justify-between py-4 font-serif text-[1.7rem] ${
                    isActive(item.path) ? "text-gold-600" : "text-forest-900"
                  }`}
                >
                  {nav[item.key]}
                  <span aria-hidden="true" className="text-base text-gold-500">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-10">
            <a
              href={site.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-forest-800 px-6 py-4 font-semibold text-ivory-50"
            >
              <WhatsAppIcon />
              {whatsappLabel}
            </a>
            <div className="mt-5 flex flex-col items-center gap-2 text-sm text-muted">
              <a href={mailto(emailSubject)} className="underline decoration-gold-400 underline-offset-4">
                {site.contact.email}
              </a>
              <a href={tel}>{site.contact.phoneDisplay}</a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
