export function PageIntro({
  eyebrow,
  title,
  lead,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  lead: string;
  compact?: boolean;
}) {
  return (
    <section className="border-b border-ivory-200 bg-ivory-100">
      <div className={`container-page ${compact ? "py-12 md:py-16" : "py-16 md:py-24"}`}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-4 max-w-3xl text-4xl leading-[1.08] text-forest-900 md:text-6xl">{title}</h1>
        <span className="gold-rule mt-8" />
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">{lead}</p>
      </div>
    </section>
  );
}

export function SectionHeading({ title, lead, center = false }: { title: string; lead?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <h2 className="text-3xl leading-tight text-forest-900 md:text-5xl">{title}</h2>
      <span className={`gold-rule mt-6 ${center ? "mx-auto" : ""}`} />
      {lead && <p className="mt-6 text-lg leading-relaxed text-muted">{lead}</p>}
    </div>
  );
}
