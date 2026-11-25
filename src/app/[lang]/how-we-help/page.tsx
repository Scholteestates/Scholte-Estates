import { resolveLocale } from "@/i18n/page-params";
import { pageMetadata } from "@/i18n/metadata";
import { PageIntro, SectionHeading } from "@/components/page-intro";
import { ContactBand } from "@/components/contact-band";

export async function generateMetadata({ params }: PageProps<"/[lang]/how-we-help">) {
  const { locale, dict } = await resolveLocale(params);
  return pageMetadata(locale, dict, "/how-we-help", dict.process.title);
}

export default async function HowWeHelpPage({ params }: PageProps<"/[lang]/how-we-help">) {
  const { dict } = await resolveLocale(params);
  const { process } = dict;

  return (
    <>
      <PageIntro eyebrow={dict.nav.howWeHelp} title={process.title} lead={process.lead} />

      <section className="container-page py-20 md:py-28">
        <ol className="relative mx-auto max-w-3xl">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-5 w-px bg-gold-400/50" />
          {process.steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-6 pb-12 last:pb-0 md:gap-10">
              <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-gold-500 bg-ivory-50 font-serif text-lg text-gold-600">
                {i + 1}
              </span>
              <div className="pt-1">
                <h2 className="text-2xl text-forest-900 md:text-3xl">{step.title}</h2>
                <p className="mt-3 text-lg leading-relaxed text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-ivory-100">
        <div className="container-page py-20 md:py-24">
          <SectionHeading title={process.essentialsTitle} />
          <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {process.essentials.map((e) => (
              <li key={e.title} className="border-t border-gold-400/60 pt-6">
                <h3 className="text-2xl text-forest-900">{e.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{e.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactBand dict={dict} />
    </>
  );
}
