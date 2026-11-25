import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mailto, site } from "@/config/site";
import { resolveLocale } from "@/i18n/page-params";
import { pageMetadata } from "@/i18n/metadata";
import { cardLabels } from "@/i18n/property-labels";
import { formatPrice, getAllProperties, getPropertyBySlug, getRelatedProperties } from "@/lib/properties";
import { DemoBadge, DemoNotice } from "@/components/property/demo-badge";
import { PropertyCard } from "@/components/property/property-card";
import { MailIcon, PinIcon, WhatsAppIcon } from "@/components/icons";

// Every property page is prerendered; render blocking so unknown slugs return a real 404.
export const instant = false;

export function generateStaticParams() {
  const slugs = getAllProperties().map((p) => ({ slug: p.slug }));
  // Keep one placeholder so the route still builds when demo listings are off.
  return slugs.length ? slugs : [{ slug: "none" }];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/properties/[slug]">) {
  const { locale, dict } = await resolveLocale(params);
  const { slug } = await params;
  const p = getPropertyBySlug(slug);
  if (!p) return {};
  const meta = pageMetadata(locale, dict, `/properties/${p.slug}`, `${p.name} · ${p.town}`);
  return { ...meta, description: p.title[locale], robots: p.isDemo ? { index: false } : undefined };
}

export default async function PropertyPage({ params }: PageProps<"/[lang]/properties/[slug]">) {
  const { locale, dict } = await resolveLocale(params);
  const { slug } = await params;
  const p = getPropertyBySlug(slug);
  if (!p) notFound();

  const t = dict.properties;
  const img = p.images[0];
  const waText = t.detail.whatsappText.replace("{name}", p.name).replace("{ref}", p.reference);
  const waHref = `${site.contact.whatsappUrl}?text=${encodeURIComponent(waText)}`;

  const specs: [string, string][] = [
    [t.specs.price, formatPrice(p.priceEur, locale) + (p.isDemo ? ` (${t.examplePrice.toLowerCase()})` : "")],
    [t.specs.type, t.types[p.type]],
    [t.specs.condition, t.condition[p.condition]],
    [t.specs.location, p.area && p.area !== p.town ? `${p.area}, ${p.town}` : p.town],
    [t.specs.beds, String(p.bedrooms)],
    [t.specs.baths, String(p.bathrooms)],
    ...(p.builtAreaM2 ? ([[t.specs.built, `${p.builtAreaM2} m²`]] as [string, string][]) : []),
    ...(p.plotAreaM2 ? ([[t.specs.plot, `${p.plotAreaM2} m²`]] as [string, string][]) : []),
    ...(p.terraceAreaM2 ? ([[t.specs.terrace, `${p.terraceAreaM2} m²`]] as [string, string][]) : []),
    [t.specs.pool, t.specs.poolTypes[p.pool]],
    [t.specs.seaView, p.seaView ? t.specs.yes : t.specs.no],
    [t.specs.reference, p.reference],
  ];

  return (
    <>
      <section className="container-page pt-8 md:pt-10">
        <Link href={`/${locale}/properties`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest-900">
          <span aria-hidden="true">←</span> {t.detail.back}
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              {p.isDemo && <DemoBadge label={t.demoBadge} />}
              <span className="text-[0.7rem] font-semibold tracking-[0.18em] text-gold-600 uppercase">
                {t.condition[p.condition]} · {t.types[p.type]}
              </span>
            </div>
            <h1 className="mt-4 text-5xl leading-none text-forest-900 md:text-7xl">{p.name}</h1>
            <p className="mt-4 flex items-center gap-2 text-lg text-muted">
              <PinIcon className="size-4 text-gold-500" />
              {p.town}, Costa Blanca
            </p>
          </div>
          <div className="md:text-right">
            <p className="font-serif text-4xl text-forest-900 md:text-5xl">{formatPrice(p.priceEur, locale)}</p>
            {p.isDemo && <p className="mt-1 text-sm text-muted">{t.examplePrice}</p>}
          </div>
        </div>
      </section>

      {img && (
        <figure className="container-page mt-10">
          <div className="relative aspect-[16/10] overflow-hidden bg-ivory-200 md:aspect-[16/8]">
            <Image src={img.src} alt={img.alt[locale]} fill preload sizes="(min-width: 1216px) 1216px, 100vw" className="hero-image object-cover" />
          </div>
          {img.isAiGenerated && <figcaption className="mt-3 text-xs text-muted">{t.aiImage}</figcaption>}
        </figure>
      )}

      <section className="container-page grid gap-12 py-14 md:py-20 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          {p.isDemo && (
            <div className="mb-10 border-l-2 border-gold-400 bg-ivory-100 px-5 py-4">
              <DemoNotice text={t.demoNoticeLong} />
            </div>
          )}
          <p className="eyebrow">{t.detail.about}</p>
          <h2 className="mt-4 text-3xl leading-tight text-forest-900 md:text-4xl">{p.title[locale]}</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">{p.description[locale]}</p>

          <h2 className="mt-12 text-2xl text-forest-900">{t.detail.features}</h2>
          <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
            {p.features[locale].map((f) => (
              <li key={f} className="flex items-center gap-3 border-b border-ivory-200 py-3.5 text-forest-900">
                <span aria-hidden="true" className="block h-px w-4 bg-gold-500" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:col-span-5">
          <div className="border border-ivory-200 bg-ivory-100 p-7 md:p-8 lg:sticky lg:top-36">
            <h2 className="text-2xl text-forest-900">{t.detail.details}</h2>
            <dl className="mt-5 divide-y divide-ivory-200 text-sm">
              {specs.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-medium text-forest-900">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 border-t border-gold-400/50 pt-7">
              <h3 className="text-2xl text-forest-900">{t.detail.similarTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t.detail.similarBody}</p>
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-forest-800 px-6 py-3.5 text-sm font-semibold text-ivory-50 transition-colors hover:bg-forest-700"
                >
                  <WhatsAppIcon /> {dict.cta.whatsapp}
                </a>
                <a
                  href={mailto(`${t.detail.similarTitle} — ${p.reference}`)}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border border-forest-800/30 px-6 py-3.5 text-sm font-semibold text-forest-900 transition-colors hover:border-forest-800"
                >
                  <MailIcon /> {dict.cta.email}
                </a>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="bg-ivory-100">
        <div className="container-page py-16 md:py-24">
          <h2 className="text-3xl text-forest-900 md:text-4xl">{t.detail.more}</h2>
          <span className="gold-rule mt-5" />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {getRelatedProperties(p).map((r) => (
              <li key={r.slug}>
                <PropertyCard property={r} locale={locale} labels={cardLabels(dict)} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
