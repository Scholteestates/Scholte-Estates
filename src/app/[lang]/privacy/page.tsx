import { resolveLocale } from "@/i18n/page-params";
import { pageMetadata } from "@/i18n/metadata";
import { legalContent } from "@/content/legal";
import { LegalPage } from "@/components/legal/legal-page";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">) {
  const { locale, dict } = await resolveLocale(params);
  return pageMetadata(locale, dict, "/privacy", legalContent[locale].privacy.title);
}

export default async function Page({ params }: PageProps<"/[lang]/privacy">) {
  const { locale } = await resolveLocale(params);
  const doc = legalContent[locale].privacy;
  return <LegalPage doc={doc} locale={locale} otherHref={`/${locale}/legal-notice`} otherLabel={legalContent[locale].legal.title} />;
}
