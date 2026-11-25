"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const copy = {
  en: { title: "Page not found", body: "The page you are looking for does not exist or has moved.", back: "Back to home" },
  es: { title: "Página no encontrada", body: "La página que buscas no existe o se ha movido.", back: "Volver al inicio" },
};

export default function NotFound() {
  const pathname = usePathname() ?? "";
  const locale = pathname.startsWith("/es") ? "es" : "en";
  const t = copy[locale];
  return (
    <section className="container-page py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-5xl text-forest-900">{t.title}</h1>
      <p className="mt-6 text-lg text-muted">{t.body}</p>
      <Link href={`/${locale}`} className="mt-10 inline-block rounded-full bg-forest-800 px-7 py-3 text-sm font-semibold text-ivory-50">
        {t.back}
      </Link>
    </section>
  );
}
