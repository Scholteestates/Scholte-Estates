import { mailto, site } from "@/config/site";
import { MailIcon, WhatsAppIcon } from "./icons";

export function ContactButtons({
  whatsappLabel,
  emailLabel,
  emailSubject,
  tone = "dark",
}: {
  whatsappLabel: string;
  emailLabel: string;
  emailSubject: string;
  tone?: "dark" | "light";
}) {
  const primary =
    tone === "dark"
      ? "bg-forest-800 text-ivory-50 hover:bg-forest-700"
      : "bg-gold-400 text-forest-950 hover:bg-gold-300";
  const secondary =
    tone === "dark"
      ? "border-forest-800/30 text-forest-900 hover:border-forest-800 hover:bg-forest-800/5"
      : "border-ivory-50/40 text-ivory-50 hover:border-ivory-50 hover:bg-ivory-50/10";

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href={site.contact.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-4 text-sm font-semibold tracking-wide transition-colors ${primary}`}
      >
        <WhatsAppIcon />
        {whatsappLabel}
      </a>
      <a
        href={mailto(emailSubject)}
        className={`inline-flex items-center justify-center gap-2.5 rounded-full border px-7 py-4 text-sm font-semibold tracking-wide transition-colors ${secondary}`}
      >
        <MailIcon />
        {emailLabel}
      </a>
    </div>
  );
}

export function WhatsAppFab({ label }: { label: string }) {
  return (
    <a
      href={site.contact.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="fixed right-4 bottom-4 z-30 inline-flex size-14 items-center justify-center rounded-full bg-forest-800 text-ivory-50 shadow-lg shadow-forest-950/25 ring-1 ring-gold-400/60 transition-transform hover:scale-105 md:right-6 md:bottom-6"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
