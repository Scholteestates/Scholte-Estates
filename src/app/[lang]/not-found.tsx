import Link from "next/link";

/**
 * Branded 404 for /en and /es paths. Kept fully static (no hooks), so it
 * renders in the prerendered shell on every host; it shows both languages
 * because a not-found page does not receive the route params.
 */
export default function NotFound() {
  return (
    <section className="container-page py-28 text-center md:py-36">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-5xl text-forest-900">Page not found</h1>
      <p className="mt-5 text-lg text-muted">The page you are looking for does not exist or has moved.</p>
      <p className="mt-10 font-serif text-3xl text-forest-900" lang="es">
        Página no encontrada
      </p>
      <p className="mt-3 text-muted" lang="es">
        La página que buscas no existe o se ha movido.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/en" className="rounded-full bg-forest-800 px-7 py-3 text-sm font-semibold text-ivory-50">
          Back to home
        </Link>
        <Link href="/es" lang="es" className="rounded-full border border-forest-800/30 px-7 py-3 text-sm font-semibold text-forest-900">
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
