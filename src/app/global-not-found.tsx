import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { site } from "@/config/site";
import "./globals.css";

/**
 * Site-wide 404 (Next `global-not-found`): used for any URL that matches no
 * route, including unknown property slugs and unknown languages. The root
 * layout lives under [lang], so this page brings its own <html>, styles and
 * fonts, and shows both languages.
 */
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["500"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: `Page not found · Página no encontrada | ${site.name}`,
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <header className="bg-brand-beige shadow-[0_1px_0_var(--color-ivory-300)]">
          <div className="container-page flex h-20 items-center">
            <a href="/en" aria-label={`${site.name} — Home`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={site.brand.light.src} alt="" width={site.brand.light.width} height={site.brand.light.height} className="logo-feather h-14 w-auto" />
            </a>
          </div>
        </header>
        <main className="container-page flex-1 py-24 text-center md:py-32">
          <p className="eyebrow">404</p>
          <h1 className="mt-4 text-5xl text-forest-900">Page not found</h1>
          <p className="mt-5 text-lg text-muted">The page you are looking for does not exist or has moved.</p>
          <p className="mt-10 font-serif text-3xl text-forest-900" lang="es">
            Página no encontrada
          </p>
          <p className="mt-3 text-muted" lang="es">
            La página que buscas no existe o se ha movido.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href="/en" className="rounded-full bg-forest-800 px-7 py-3 text-sm font-semibold text-ivory-50">
              Back to home
            </a>
            <a href="/es" lang="es" className="rounded-full border border-forest-800/30 px-7 py-3 text-sm font-semibold text-forest-900">
              Volver al inicio
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
