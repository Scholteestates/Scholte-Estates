export function DemoBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-gold-400 px-3 py-1 text-[0.65rem] font-bold tracking-[0.18em] text-forest-950 uppercase">
      {label}
    </span>
  );
}

export function DemoNotice({ text, tone = "dark", className = "" }: { text: string; tone?: "dark" | "light"; className?: string }) {
  return (
    <p
      role="note"
      className={`inline-flex items-center gap-2.5 text-xs tracking-wide ${
        tone === "dark" ? "text-muted" : "text-ivory-200/90"
      } ${className}`}
    >
      <span aria-hidden="true" className="inline-block size-1.5 shrink-0 rounded-full bg-gold-400" />
      {text}
    </p>
  );
}
