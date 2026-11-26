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
   * Operator details confirmed by the user on 26 Nov 2026 for the legal
   * notice and privacy page. The address is a legal and correspondence
   * address only (no client reception). No estate-agent registration number
   * or professional membership has been supplied: do not add or imply one.
   */
  legal: {
    operator: "Christian Scholte",
    tradingAs: "Scholte Estates",
    nif: "Y1377545C",
    address: ["Calle Galicia 114", "Ciudad Quesada", "03170 Rojales (Alicante)", "Spain"],
    addressEs: ["Calle Galicia 114", "Ciudad Quesada", "03170 Rojales (Alicante)", "España"],
    privacyEmail: "christian@scholteestates.com",
    /** Proposed retention for enquiries that do not lead to an assignment. */
    enquiryRetentionMonths: 24,
    updated: { en: "26 November 2026", es: "26 de noviembre de 2026" },
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
