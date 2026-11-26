import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { mailto, site, tel } from "@/config/site";
import { navItems } from "./nav-items";
import { Logo } from "./wordmark";
import { LanguageSwitch } from "./language-switch";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./icons";

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = 2026;
  return (
    <footer className="bg-brand-forest text-ivory-200">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Logo variant="dark" sizes="280px" className="-ml-1 h-24 md:h-28" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory-200/80">{dict.footer.about}</p>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow !text-gold-400">{dict.footer.explore}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link href={`/${locale}${item.path}`} className="transition-colors hover:text-ivory-50">
                  {dict.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h2 className="eyebrow !text-gold-400">{dict.footer.contact}</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="text-ivory-50">
              {site.contact.name}
              <span className="block text-xs text-ivory-200/70">{dict.footer.role}</span>
            </li>
            <li>
              <a href={site.contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 hover:text-ivory-50">
                <WhatsAppIcon className="size-4 text-gold-400" /> WhatsApp
              </a>
            </li>
            <li>
              <a href={mailto(dict.contact.emailSubject)} className="inline-flex items-center gap-3 break-all hover:text-ivory-50">
                <MailIcon className="size-4 shrink-0 text-gold-400" /> {site.contact.email}
              </a>
            </li>
            <li>
              <a href={tel} className="inline-flex items-center gap-3 hover:text-ivory-50">
                <PhoneIcon className="size-4 text-gold-400" /> {site.contact.phoneDisplay}
              </a>
            </li>
            <li className="inline-flex items-center gap-3">
              <PinIcon className="size-4 text-gold-400" /> {site.location.town}, {site.location.region}, {dict.footer.country}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory-50/10">
        <div className="container-page flex flex-col items-start justify-between gap-4 py-6 text-xs text-ivory-200/70 sm:flex-row sm:items-center">
          <p>
            © {year} {site.name}. {dict.footer.rights}
            <span className="ml-2 text-gold-400">{site.brandLine}</span>
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href={`/${locale}/legal-notice`} className="underline decoration-ivory-50/25 underline-offset-4 hover:text-ivory-50">
                {dict.footer.legal}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/privacy`} className="underline decoration-ivory-50/25 underline-offset-4 hover:text-ivory-50">
                {dict.footer.privacy}
              </Link>
            </li>
          </ul>
          <LanguageSwitch current={locale} label={dict.nav.language} tone="light" />
        </div>
      </div>
    </footer>
  );
}
