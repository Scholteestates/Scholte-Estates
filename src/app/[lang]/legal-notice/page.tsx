import { resolveLocale } from "@/i18n/page-params";
import { pageMetadata } from "@/i18n/metadata";
import { legalContent } from "@/content/legal";
import { LegalPage } from "@/components/legal/legal-page";

export async function generateMetadata({ params }: PageProps<"/[lang]/legal-notice">) {
  const { locale, dict } = await resolveLocale(params);
  return pageMetadata(locale, dict, "/legal-notice", legalContent[locale].legal.title);
}

export default async function Page({ params }: PageProps<"/[lang]/legal-notice">) {
  const { locale } = await resolveLocale(params);
  const doc = legalContent[locale].legal;
  return <LegalPage doc={doc} locale={locale} otherHref={`/${locale}/privacy`} otherLabel={legalContent[locale].privacy.title} />;
}
