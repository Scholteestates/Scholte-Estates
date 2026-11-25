"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeNames, locales, switchLocalePath, type Locale } from "@/i18n/config";

/** Remember the visitor's choice so "/" redirects to it next time. */
function rememberLocale(l: Locale) {
  document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageSwitch({
  current,
  label,
  tone = "dark",
}: {
  current: Locale;
  label: string;
  tone?: "dark" | "light";
}) {
  const pathname = usePathname() ?? `/${current}`;

  const base = tone === "dark" ? "text-muted hover:text-forest-900" : "text-ivory-200 hover:text-ivory-50";
  const active = tone === "dark" ? "text-forest-900" : "text-gold-300";

  return (
    <nav aria-label={label} className="flex items-center gap-1 text-xs font-semibold tracking-[0.16em] uppercase">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden="true" className="text-gold-500">/</span>}
          <Link
            href={switchLocalePath(pathname, l)}
            hrefLang={l}
            lang={l}
            onClick={() => rememberLocale(l)}
            aria-current={l === current ? "true" : undefined}
            title={localeNames[l]}
            className={`px-1 py-2 transition-colors ${l === current ? active : base}`}
          >
            {l.toUpperCase()}
            <span className="sr-only"> — {localeNames[l]}</span>
          </Link>
        </span>
      ))}
    </nav>
  );
}
