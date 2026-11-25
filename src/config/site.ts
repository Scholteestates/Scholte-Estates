/**
 * Confirmed business details for Scholte Estates.
 * Only add facts here that the business has confirmed.
 * Do not add invented figures, history, qualifications or legal identifiers.
 */
export const site = {
  name: "Scholte Estates",
  brandLine: "Integrity first. Always.",
  domain: "scholteestates.com",
  url: "https://scholteestates.com",
  contact: {
    name: "Christian Scholte",
    email: "christian@scholteestates.com",
    phoneDisplay: "+34 611 159 859",
    phoneE164: "+34611159859",
    whatsappUrl: "https://wa.me/34611159859",
  },
  location: {
    town: "Ciudad Quesada",
    region: "Costa Blanca",
    country: "Spain",
  },
  /**
   * Brand assets. Set `logoSrc` to a file in /public/brand once the
   * supplied logo is added (e.g. "/brand/logo.svg"). Until then the
   * header and footer show the company name as a typographic wordmark.
   */
  brand: {
    logoSrc: null as string | null,
    logoWidth: 180,
    logoHeight: 48,
  },
} as const;

export const mailto = (subject?: string) =>
  `mailto:${site.contact.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;

export const tel = `tel:${site.contact.phoneE164}`;
