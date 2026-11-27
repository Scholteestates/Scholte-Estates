"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

/**
 * Amanda, AIVENA's website chat, as AIVENA's standard iframe embed.
 *
 * Nothing from AIVENA loads until the visitor presses "Chat with Amanda": the
 * iframe is added to the page on that first click and then kept (hidden when
 * closed), because the widget holds the conversation in memory only.
 * Conversations, consent and hand-overs all happen inside AIVENA's widget.
 */

type Labels = {
  open: string;
  title: string;
  ai: string;
  notice: string;
  privacy: string;
  close: string;
  frameTitle: string;
};

export function AmandaChat({
  host,
  slug,
  color,
  lang,
  labels,
  privacyHref,
}: {
  host: string;
  slug: string;
  color: string;
  lang: "en" | "es";
  labels: Labels;
  privacyHref: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(560);
  const closeRef = useRef<HTMLButtonElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const src = `${host}/chat/${encodeURIComponent(slug)}/widget?${new URLSearchParams({
    ...(lang === "es" ? { lang: "es" } : {}),
    color,
  }).toString()}`;

  /* The widget reports its content height; accept it only from AIVENA's host. */
  useEffect(() => {
    if (!loaded) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== host) return;
      const d = e.data as { type?: string; height?: number } | null;
      if (d?.type === "aivena-amanda-height" && typeof d.height === "number") {
        setHeight(Math.min(Math.max(d.height, 420), 720));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [loaded, host]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const openChat = () => {
    if (!loaded) track("amanda_chat_open", { page: window.location.pathname });
    setLoaded(true);
    setOpen(true);
  };

  return (
    <>
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          onClick={openChat}
          className="fixed right-4 bottom-[5.75rem] z-30 inline-flex items-center gap-2.5 rounded-full bg-ivory-50 py-2.5 pr-4 pl-3 text-forest-900 shadow-lg shadow-forest-950/20 ring-1 ring-gold-400/70 transition-transform hover:scale-[1.03] md:right-6 md:bottom-[6.5rem]"
        >
          <span aria-hidden="true" className="inline-flex size-7 items-center justify-center rounded-full bg-forest-800 font-serif text-sm text-gold-300">
            A
          </span>
          <span className="text-left leading-tight">
            <span className="block text-sm font-semibold">{labels.open}</span>
            <span className="block text-[0.62rem] tracking-[0.14em] text-muted uppercase">{labels.ai}</span>
          </span>
        </button>
      )}

      {loaded && (
        <section
          role="dialog"
          aria-modal="false"
          aria-label={labels.title}
          hidden={!open}
          className="amanda-in fixed inset-x-0 bottom-0 z-40 flex max-h-[92svh] flex-col bg-ivory-50 shadow-[0_24px_60px_-20px_rgb(15_33_24/0.5)] ring-1 ring-ivory-300 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[420px] sm:rounded-sm"
        >
          <header className="flex items-start justify-between gap-4 border-b border-ivory-200 px-5 pt-4 pb-3">
            <div>
              <p className="font-serif text-xl leading-tight text-forest-900">{labels.title}</p>
              <p className="mt-1 text-xs leading-snug text-muted">
                {labels.notice}{" "}
                <Link href={privacyHref} className="underline decoration-gold-500 underline-offset-2 hover:text-forest-900">
                  {labels.privacy}
                </Link>
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
              aria-label={labels.close}
              className="-mr-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-forest-800 hover:bg-ivory-200"
            >
              <span aria-hidden="true" className="text-xl leading-none">×</span>
            </button>
          </header>
          <iframe
            src={src}
            title={labels.frameTitle}
            className="w-full flex-none border-0"
            style={{ height: `min(${height}px, calc(92svh - 7.5rem))` }}
          />
        </section>
      )}
    </>
  );
}
