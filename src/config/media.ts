/**
 * Photography slots. No photos have been supplied yet, so every slot is
 * null and the site shows a quiet decorative illustration instead.
 *
 * To add a photo: place it in /public/images (e.g. hero.jpg, ideally
 * 2400px wide or more) and set `src` here. Use photos you own or are
 * licensed to use, of the places they claim to show.
 */
export type MediaSlot = { src: string | null; alt: { en: string; es: string } };

export const media = {
  hero: {
    src: null,
    alt: { en: "Mediterranean coastline on the Costa Blanca", es: "Costa mediterránea en la Costa Blanca" },
  },
  intro: {
    src: null,
    alt: { en: "A home in Ciudad Quesada", es: "Una vivienda en Ciudad Quesada" },
  },
  area: {
    src: null,
    alt: { en: "Beach on the Costa Blanca", es: "Playa en la Costa Blanca" },
  },
} satisfies Record<string, MediaSlot>;
