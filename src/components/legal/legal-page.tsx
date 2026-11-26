import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Block, LegalDoc } from "@/content/legal";

/** Renders a legal document: intro, on-page contents and numbered sections. */
export function LegalPage({ doc, locale, otherHref, otherLabel }: { doc: LegalDoc; locale: Locale; otherHref: string; otherLabel: string }) {
  return (
    <>
      <section className="border-b border-ivory-200 bg-ivory-100">
        <div className="container-page py-12 md:py-16">
          <h1 className="max-w-3xl text-4xl leading-[1.08] text-forest-900 md:text-6xl">{doc.title}</h1>
          <span className="gold-rule mt-8" />
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">{doc.lead}</p>
          <p className="mt-4 text-sm text-muted">{doc.updatedLabel}</p>
        </div>
      </section>

      <div className="container-page grid gap-12 py-14 md:py-20 lg:grid-cols-12">
        <nav aria-label={locale === "es" ? "Contenido" : "Contents"} className="lg:col-span-3">
          <ol className="space-y-2 text-sm lg:sticky lg:top-36">
            {doc.sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="flex gap-3 text-muted hover:text-forest-900">
                  <span className="font-serif text-gold-600 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  {s.h}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-3xl lg:col-span-9">
          {doc.sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-32 border-t border-ivory-200 py-10 first:border-t-0 first:pt-0">
              <h2 id={`${s.id}-h`} className="flex items-baseline gap-3 text-2xl text-forest-900 md:text-3xl">
                <span className="font-serif text-xl text-gold-500 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                {s.h}
              </h2>
              <div className="mt-5 space-y-4 leading-relaxed text-ink/85">
                {s.blocks.map((b, j) => (
                  <BlockView key={j} block={b} />
                ))}
              </div>
            </section>
          ))}
          <p className="border-t border-ivory-200 pt-8 text-sm">
            <Link href={otherHref} className="font-semibold text-forest-900 underline decoration-gold-400 underline-offset-4 hover:decoration-forest-900">
              {otherLabel} →
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  if ("p" in block) return <p>{block.p}</p>;
  if ("ul" in block)
    return (
      <ul className="space-y-3">
        {block.ul.map((li) => (
          <li key={li} className="flex gap-3">
            <span aria-hidden="true" className="mt-[0.7em] block h-px w-4 shrink-0 bg-gold-500" />
            <span>{li}</span>
          </li>
        ))}
      </ul>
    );
  if ("dl" in block)
    return (
      <dl className="divide-y divide-ivory-200 border-y border-ivory-200 text-[0.95rem]">
        {block.dl.map(([k, v]) => (
          <div key={k + v} className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-6">
            <dt className={k ? "text-muted" : "sr-only"}>{k || "Note"}</dt>
            <dd className={k ? "font-medium text-forest-900" : "text-sm text-muted italic sm:col-start-2"}>{v}</dd>
          </div>
        ))}
      </dl>
    );
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-forest-800/20">
            {block.table.head.map((h) => (
              <th key={h} scope="col" className="py-2.5 pr-4 font-semibold text-forest-900">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.table.rows.map((r) => (
            <tr key={r[0]} className="border-b border-ivory-200 align-top">
              {r.map((c, k) => (
                <td key={k} className={`py-3 pr-4 ${k === 0 ? "font-medium text-forest-900" : "text-ink/80"}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
