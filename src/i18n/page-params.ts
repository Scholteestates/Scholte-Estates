import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "./config";
import { getDictionary } from "./get-dictionary";

/** Resolve and validate the [lang] segment, then load its dictionary. */
export async function resolveLocale(params: Promise<{ lang: string }>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale: Locale = lang;
  return { locale, dict: await getDictionary(locale) };
}
