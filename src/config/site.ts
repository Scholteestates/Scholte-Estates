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
   * Approved logos (see docs/brand.md). Originals stay untouched in
   * /public/brand; the site uses the tightly cropped "-web" copies, always on
   * their own matching background colour (brand-forest / brand-beige).
   */
  brand: {
    dark: { src: "/brand/scholte-estates-dark-web.png", width: 755, height: 321 },
    light: { src: "/brand/scholte-estates-light-web.png", width: 796, height: 338 },
  },
} as const;

export const mailto = (subject?: string) =>
  `mailto:${site.contact.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;

export const tel = `tel:${site.contact.phoneE164}`;
