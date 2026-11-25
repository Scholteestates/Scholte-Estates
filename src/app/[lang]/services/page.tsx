import { resolveLocale } from "@/i18n/page-params";
import { pageMetadata } from "@/i18n/metadata";
import { PageIntro } from "@/components/page-intro";
import { ContactBand } from "@/components/contact-band";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">) {
  const { locale, dict } = await resolveLocale(params);
  return pageMetadata(locale, dict, "/services", dict.services.title);
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { dict } = await resolveLocale(params);
  const { services } = dict;

  return (
    <>
      <PageIntro eyebrow={dict.home.eyebrow} title={services.title} lead={services.lead} />

      <div className="container-page divide-y divide-ivory-200">
        {services.items.map((s, i) => (
          <section key={s.id} id={s.id} className="grid scroll-mt-28 gap-8 py-16 md:grid-cols-12 md:gap-16 md:py-24">
            <div className="md:col-span-5">
              <span className="font-serif text-xl text-gold-500">0{i + 1}</span>
              <h2 className="mt-4 text-4xl leading-tight text-forest-900 md:text-5xl">{s.title}</h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">{s.summary}</p>
            </div>
            <ul className="space-y-0 md:col-span-7 md:pt-12">
              {s.points.map((point) => (
                <li key={point} className="flex gap-4 border-t border-ivory-200 py-5 text-forest-900 last:border-b">
                  <span aria-hidden="true" className="mt-2.5 block h-px w-5 shrink-0 bg-gold-500" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <ContactBand dict={dict} />
    </>
  );
}
