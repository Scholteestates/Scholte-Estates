import Link from "next/link";
import { media } from "@/config/media";
import { resolveLocale } from "@/i18n/page-params";
import { pageMetadata } from "@/i18n/metadata";
import { Photo } from "@/components/photo";
import { SectionHeading } from "@/components/page-intro";
import { ContactButtons } from "@/components/contact-buttons";
import { ContactBand } from "@/components/contact-band";
import { ArrowIcon } from "@/components/icons";

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  const { locale, dict } = await resolveLocale(params);
  return pageMetadata(locale, dict, "");
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { locale, dict } = await resolveLocale(params);
  const { home, services, area, process, cta } = dict;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-forest-900">
        <Photo slot={media.hero} locale={locale} priority variant="evening" className="absolute inset-0 -z-10 opacity-90" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950/85 via-forest-950/55 to-forest-950/10" />
        <div className="container-page flex min-h-[78svh] flex-col justify-center py-24 md:min-h-[82svh]">
          <p className="eyebrow !text-gold-300">{home.eyebrow}</p>
          <h1 className="mt-6 max-w-3xl text-[2.6rem] leading-[1.04] text-ivory-50 sm:text-6xl md:text-7xl">
            {home.title}
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ivory-200/90">{home.lead}</p>
          <div className="mt-10">
            <ContactButtons
              tone="light"
              whatsappLabel={cta.whatsapp}
              emailLabel={cta.email}
              emailSubject={dict.contact.emailSubject}
            />
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="container-page grid gap-12 py-20 md:grid-cols-12 md:gap-16 md:py-28">
        <div className="md:col-span-6">
          <SectionHeading title={home.introTitle} />
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
            {home.introBody.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
        <div className="md:col-span-6">
          <Photo slot={media.intro} locale={locale} variant="hills" sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/5] w-full md:aspect-[4/5]" />
        </div>
      </section>

      {/* Values */}
      <section className="bg-ivory-100">
        <div className="container-page py-20 md:py-24">
          <p className="eyebrow">{home.valuesTitle}</p>
          <ul className="mt-10 grid gap-10 md:grid-cols-3 md:gap-12">
            {home.values.map((v) => (
              <li key={v.title} className="border-t border-gold-400/60 pt-6">
                <h3 className="text-2xl text-forest-900">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services */}
      <section className="container-page py-20 md:py-28">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading title={home.servicesTitle} lead={services.lead} />
          <Link href={`/${locale}/services`} className="inline-flex items-center gap-2 text-sm font-semibold text-forest-800 hover:text-gold-600">
            {cta.allServices} <ArrowIcon />
          </Link>
        </div>
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {services.items.map((s, i) => (
            <li key={s.id}>
              <Link
                href={`/${locale}/services#${s.id}`}
                className="group flex h-full flex-col border border-ivory-200 bg-ivory-50 p-8 transition-colors hover:border-gold-400 hover:bg-ivory-100"
              >
                <span className="font-serif text-lg text-gold-500">0{i + 1}</span>
                <h3 className="mt-6 text-3xl text-forest-900">{s.title}</h3>
                <p className="mt-4 flex-1 leading-relaxed text-muted">{s.summary}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-forest-800 group-hover:text-gold-600">
                  {cta.learnMore} <ArrowIcon />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Area */}
      <section className="bg-ivory-100">
        <div className="container-page grid items-center gap-12 py-20 md:grid-cols-12 md:py-28">
          <div className="md:order-2 md:col-span-6">
            <SectionHeading title={home.areasTitle} lead={home.areasLead} />
            <ul className="mt-8 flex flex-wrap gap-2">
              {area.places.map((p) => (
                <li key={p.name} className="rounded-full border border-forest-800/15 px-4 py-1.5 text-sm text-forest-800">
                  {p.name}
                </li>
              ))}
            </ul>
            <Link
              href={`/${locale}/costa-blanca`}
              className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-forest-800 hover:text-gold-600"
            >
              {cta.exploreArea} <ArrowIcon />
            </Link>
          </div>
          <div className="md:order-1 md:col-span-6">
            <Photo slot={media.area} locale={locale} variant="coast" sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/3] w-full" />
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="container-page py-20 md:py-28">
        <SectionHeading title={home.processTitle} lead={home.processLead} />
        <ol className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {process.steps.slice(0, 4).map((step, i) => (
            <li key={step.title}>
              <span className="flex size-10 items-center justify-center rounded-full border border-gold-500 font-serif text-lg text-gold-600">
                {i + 1}
              </span>
              <h3 className="mt-5 text-2xl text-forest-900">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
        <Link
          href={`/${locale}/how-we-help`}
          className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-forest-800 hover:text-gold-600"
        >
          {cta.seeProcess} <ArrowIcon />
        </Link>
      </section>

      <ContactBand dict={dict} />
    </>
  );
}
