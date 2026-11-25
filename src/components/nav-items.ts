import type { Dictionary } from "@/i18n/dictionaries/en";

export type NavKey = keyof Pick<
  Dictionary["nav"],
  "home" | "properties" | "services" | "costaBlanca" | "howWeHelp" | "contact"
>;

export const navItems: { key: NavKey; path: string }[] = [
  { key: "home", path: "" },
  { key: "properties", path: "/properties" },
  { key: "services", path: "/services" },
  { key: "costaBlanca", path: "/costa-blanca" },
  { key: "howWeHelp", path: "/how-we-help" },
  { key: "contact", path: "/contact" },
];
