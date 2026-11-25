import type { Dictionary } from "@/i18n/dictionaries/en";
import { site } from "@/config/site";
import { ContactButtons } from "./contact-buttons";

export function ContactBand({ dict }: { dict: Dictionary }) {
  return (
    <section className="bg-forest-800 text-ivory-50">
      <div className="container-page grid items-center gap-10 py-20 md:grid-cols-12 md:py-24">
        <div className="md:col-span-7">
          <p className="eyebrow !text-gold-400">{site.brandLine}</p>
          <h2 className="mt-4 text-3xl leading-tight md:text-5xl">{dict.home.contactTitle}</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory-200/85">{dict.home.contactLead}</p>
        </div>
        <div className="md:col-span-5 md:justify-self-end">
          <ContactButtons
            tone="light"
            whatsappLabel={dict.cta.whatsapp}
            emailLabel={dict.cta.email}
            emailSubject={dict.contact.emailSubject}
          />
        </div>
      </div>
    </section>
  );
}
