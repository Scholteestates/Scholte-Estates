import { mailto, site, tel } from "@/config/site";
import { resolveLocale } from "@/i18n/page-params";
import { pageMetadata } from "@/i18n/metadata";
import { PageIntro } from "@/components/page-intro";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">) {
  const { locale, dict } = await resolveLocale(params);
  return pageMetadata(locale, dict, "/contact", dict.contact.title);
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { dict } = await resolveLocale(params);
  const { contact, cta } = dict;

  const channels = [
    {
      label: contact.whatsappLabel,
      body: contact.whatsappBody,
      value: site.contact.phoneDisplay,
      action: cta.whatsapp,
      href: site.contact.whatsappUrl,
      external: true,
      icon: WhatsAppIcon,
      primary: true,
    },
    {
      label: contact.emailLabel,
      body: contact.emailBody,
      value: site.contact.email,
      action: cta.email,
      href: mailto(contact.emailSubject),
      external: false,
      icon: MailIcon,
      primary: false,
    },
    {
      label: contact.phoneLabel,
      body: contact.phoneBody,
      value: site.contact.phoneDisplay,
      action: cta.call,
      href: tel,
      external: false,
      icon: PhoneIcon,
      primary: false,
    },
  ];

  return (
    <>
      <PageIntro eyebrow={site.brandLine} title={contact.title} lead={contact.lead} />

      <section className="container-page py-16 md:py-24">
        <ul className="grid gap-6 md:grid-cols-3">
          {channels.map(({ icon: Icon, ...c }) => (
            <li key={c.label}>
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`group flex h-full flex-col p-8 transition-colors ${
                  c.primary
                    ? "bg-forest-800 text-ivory-50 hover:bg-forest-700"
                    : "border border-ivory-200 bg-ivory-50 text-forest-900 hover:border-gold-400 hover:bg-ivory-100"
                }`}
              >
                <Icon className={`size-7 ${c.primary ? "text-gold-300" : "text-gold-600"}`} />
                <h2 className="mt-6 text-3xl">{c.label}</h2>
                <p className={`mt-3 flex-1 leading-relaxed ${c.primary ? "text-ivory-200/85" : "text-muted"}`}>{c.body}</p>
                <p className="mt-6 break-all font-medium">{c.value}</p>
                <span className={`mt-4 text-sm font-semibold underline underline-offset-4 ${c.primary ? "decoration-gold-300" : "decoration-gold-500"}`}>
                  {c.action}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid gap-8 border-t border-ivory-200 pt-12 md:grid-cols-2">
          <div>
            <p className="eyebrow">{contact.locationLabel}</p>
            <p className="mt-4 inline-flex items-center gap-3 font-serif text-3xl text-forest-900">
              <PinIcon className="size-6 text-gold-600" />
              {site.location.town}
            </p>
            <p className="mt-2 text-muted">
              {site.location.region}, {dict.footer.country}
            </p>
          </div>
          <div>
            <p className="eyebrow">{dict.footer.contact}</p>
            <p className="mt-4 font-serif text-3xl text-forest-900">{site.contact.name}</p>
            <p className="mt-2 text-muted">{dict.footer.role}</p>
          </div>
        </div>
      </section>
    </>
  );
}
