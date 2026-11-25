import { media } from "@/config/media";
import { resolveLocale } from "@/i18n/page-params";
import { pageMetadata } from "@/i18n/metadata";
import { PageIntro, SectionHeading } from "@/components/page-intro";
import { Photo } from "@/components/photo";
import { ContactBand } from "@/components/contact-band";

export async function generateMetadata({ params }: PageProps<"/[lang]/costa-blanca">) {
  const { locale, dict } = await resolveLocale(params);
  return pageMetadata(locale, dict, "/costa-blanca", dict.area.title);
}

export default async function CostaBlancaPage({ params }: PageProps<"/[lang]/costa-blanca">) {
  const { locale, dict } = await resolveLocale(params);
  const { area } = dict;

  return (
    <>
      <PageIntro eyebrow={dict.nav.costaBlanca} title={area.title} lead={area.lead} />

      <Photo slot={media.area} locale={locale} variant="coast" className="h-[42svh] min-h-64 w-full" />

      <section className="container-page py-20 md:py-28">
        <SectionHeading title={area.whyTitle} />
        <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {area.why.map((w) => (
            <li key={w.title} className="border-t border-gold-400/60 pt-6">
              <h3 className="text-2xl text-forest-900">{w.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{w.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-ivory-100">
        <div className="container-page py-20 md:py-28">
          <SectionHeading title={area.placesTitle} />
          <ul className="mt-12 grid gap-px overflow-hidden border border-ivory-200 bg-ivory-200 md:grid-cols-2 lg:grid-cols-3">
            {area.places.map((p, i) => (
              <li key={p.name} className="bg-ivory-50 p-8">
                <h3 className={`text-3xl ${i === 0 ? "text-gold-600" : "text-forest-900"}`}>{p.name}</h3>
                <p className="mt-4 leading-relaxed text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-forest-800">{area.note}</p>
        </div>
      </section>

      <ContactBand dict={dict} />
    </>
  );
}
