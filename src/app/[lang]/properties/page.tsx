import { Suspense } from "react";
import { resolveLocale } from "@/i18n/page-params";
import { pageMetadata } from "@/i18n/metadata";
import { cardLabels, filterLabels } from "@/i18n/property-labels";
import { getAllProperties } from "@/lib/properties";
import { PageIntro } from "@/components/page-intro";
import { ContactButtons } from "@/components/contact-buttons";
import { ContactBand } from "@/components/contact-band";
import { DemoNotice } from "@/components/property/demo-badge";
import { PropertyBrowser, PropertyGridFallback } from "@/components/property/property-browser";

export async function generateMetadata({ params }: PageProps<"/[lang]/properties">) {
  const { locale, dict } = await resolveLocale(params);
  return pageMetadata(locale, dict, "/properties", dict.properties.title);
}

export default async function PropertiesPage({ params }: PageProps<"/[lang]/properties">) {
  const { locale, dict } = await resolveLocale(params);
  const properties = getAllProperties();
  const hasDemo = properties.some((p) => p.isDemo);
  const contact = (
    <ContactButtons whatsappLabel={dict.cta.whatsapp} emailLabel={dict.cta.email} emailSubject={dict.contact.emailSubject} />
  );

  return (
    <>
      <PageIntro eyebrow={dict.nav.properties} title={dict.properties.filters.title} lead={dict.properties.lead} compact />

      <section className="container-page py-12 md:py-16">
        {hasDemo && (
          <div className="mb-10 border-l-2 border-gold-400 bg-ivory-100 px-5 py-4">
            <DemoNotice text={dict.properties.demoNoticeLong} />
          </div>
        )}

        {properties.length > 0 ? (
          <Suspense fallback={<PropertyGridFallback properties={properties} locale={locale} cardLabels={cardLabels(dict)} />}>
            <PropertyBrowser
              properties={properties}
              locale={locale}
              filterLabels={filterLabels(dict)}
              cardLabels={cardLabels(dict)}
              emptyCta={contact}
            />
          </Suspense>
        ) : (
          <div className="py-10 text-center">
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted">{dict.properties.noListings}</p>
            <div className="mt-8 flex justify-center">{contact}</div>
          </div>
        )}
      </section>

      <ContactBand dict={dict} />
    </>
  );
}
