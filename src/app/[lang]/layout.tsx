import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { site } from "@/config/site";
import { locales } from "@/i18n/config";
import { resolveLocale } from "@/i18n/page-params";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFab } from "@/components/contact-buttons";
import { RevealObserver } from "@/components/reveal-observer";
import { AnalyticsConsent } from "@/components/consent/analytics-consent";
import { AmandaChat } from "@/components/amanda-chat";
import { amandaChat, amandaChatEnabled } from "@/config/features";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
};

export const viewport: Viewport = {
  themeColor: "#15291f",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { locale, dict } = await resolveLocale(params);

  return (
    <html lang={locale} className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-forest-800 focus:px-4 focus:py-2 focus:text-ivory-50"
        >
          {locale === "es" ? "Saltar al contenido" : "Skip to content"}
        </a>
        <SiteHeader
          locale={locale}
          nav={dict.nav}
          whatsappLabel={dict.cta.whatsapp}
          emailSubject={dict.contact.emailSubject}
          overlayPaths={[""]}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale} dict={dict} />
        <WhatsAppFab label={dict.cta.whatsapp} />
        {amandaChatEnabled() && (
          <AmandaChat
            host={amandaChat.host}
            slug={amandaChat.slug}
            color={amandaChat.color}
            lang={locale}
            labels={dict.amandaChat}
            privacyHref={`/${locale}/privacy#amanda`}
          />
        )}
        <RevealObserver />
        {site.analytics.ga4MeasurementId && (
          <AnalyticsConsent gaId={site.analytics.ga4MeasurementId} labels={dict.consent} policyHref={`/${locale}/privacy`} />
        )}
      </body>
    </html>
  );
}
