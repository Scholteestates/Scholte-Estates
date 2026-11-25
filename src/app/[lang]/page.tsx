import Image from "next/image";
import Link from "next/link";
import { media } from "@/config/media";
import { areas as areaConfig } from "@/config/areas";
import { site, tel } from "@/config/site";
import { resolveLocale } from "@/i18n/page-params";
import { pageMetadata } from "@/i18n/metadata";
import { cardLabels, filterLabels } from "@/i18n/property-labels";
import { getAllProperties, getFilterOptions, getHeroImages, getStoryProperty, storyImage } from "@/lib/properties";
import { Photo } from "@/components/photo";
import { ContactButtons } from "@/components/contact-buttons";
import { ArrowIcon, PhoneIcon } from "@/components/icons";
import { HeroSearch } from "@/components/property/hero-search";
import { DemoNotice } from "@/components/property/demo-badge";
import { HeroSlideshow } from "@/components/home/hero-slideshow";
import { PropertyStory, type ResolvedChapter } from "@/components/home/property-story";
import { CuratedHomes } from "@/components/home/curated-homes";
import { AreaExplorer, type AreaEntry } from "@/components/home/area-explorer";
import { ScrollProgress } from "@/components/motion/scroll-progress";

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  const { locale, dict } = await resolveLocale(params);
  return pageMetadata(locale, dict, "");
}

function SectionLink({ href, children, tone = "dark" }: { href: string; children: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 text-[0.78rem] font-semibold tracking-[0.16em] uppercase ${
        tone === "dark" ? "text-forest-800 hover:text-gold-600" : "text-ivory-50 hover:text-gold-300"
      }`}
    >
      {children}
      <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

const delay = (s: number) => ({ ["--reveal-delay" as string]: `${s}s` });

/** Two-weight heading: a plain line and an italic gold line, each rising from a mask. */
function TwoLine({ lines, className = "", tone = "dark", d = 0 }: { lines: readonly string[]; className?: string; tone?: "dark" | "light"; d?: number }) {
  return (
    <h2 data-reveal="lines" style={delay(d)} className={`leading-[1.04] ${tone === "dark" ? "text-forest-900" : "text-ivory-50"} ${className}`}>
      {lines.map((line, i) => (
        <span key={line} className="line">
          <span className={i === 1 ? `italic ${tone === "dark" ? "text-gold-600" : "text-gold-300"}` : undefined}>{line}</span>
        </span>
      ))}
    </h2>
  );
}

/** The chapters shown in the landing-page preview, in order. */
const STORY_KINDS = ["kitchen", "bedroom", "outdoor", "neighbourhood"] as const;

/**
 * Landing page, following the storyboard in docs/website-direction.md:
 * Arrive → Understand → Explore one home → Find possibilities →
 * Explore the setting → Understand the process → Take the next step.
 */
export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { locale, dict } = await resolveLocale(params);
  const { home, landing: l, services, area, process, cta, properties: t } = dict;

  const all = getAllProperties();
  const heroImages = getHeroImages(3);
  const story = getStoryProperty();
  const storyChapters: ResolvedChapter[] = story
    ? STORY_KINDS.flatMap((kind) => {
        const c = story.story?.find((ch) => ch.kind === kind);
        const photo = c && storyImage(story, c.image);
        return c && photo ? [{ ...c, photo }] : [];
      })
    : [];
  const introHome = all.find((p) => p.reference === "SE-DEMO-007") ?? all[0];
  const introMain = introHome?.images.find((i) => i.kind === "original") ?? introHome?.images[0] ?? null;
  const introInset = introHome?.images.find((i) => i.kind === "outdoor") ?? null;
  const curated = [...all].sort((a, b) => Number(b.featured) - Number(a.featured));
  const { towns, types } = getFilterOptions(all);
  const labels = cardLabels(dict);
  const hasDemo = all.some((p) => p.isDemo);

  const areaEntries: AreaEntry[] = areaConfig.map((a) => ({
    id: a.id,
    name: area.places[a.place]?.name ?? a.id,
    body: area.places[a.place]?.body ?? "",
    map: a.map,
    scene: all.find((p) => p.reference === a.scene)?.neighbourhood,
    homes: all
      .filter((p) => (a.towns as readonly string[]).includes(p.town))
      .map((p) => ({ slug: p.slug, name: p.name, town: p.town, priceEur: p.priceEur, isDemo: p.isDemo })),
  }));
  const showAreas = areaEntries.some((a) => a.scene);

  const steps = [0, 1, 2, 3, 5].map((i) => process.steps[i]).filter(Boolean);

  return (
    <>
      <ScrollProgress />

      {/* ───────── 1 · Arrive ───────── */}
      <section data-progress="exit" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-forest-950">
        {heroImages.length ? (
          <HeroSlideshow
            images={heroImages}
            locale={locale}
            pauseLabel={l.pause}
            playLabel={l.play}
            caption={heroImages.some((i) => i.isAiGenerated) ? t.aiImage : undefined}
          />
        ) : (
          <Photo slot={media.hero} locale={locale} priority variant="evening" className="absolute inset-0 -z-20" />
        )}
        <div className="absolute inset-0 -z-10 bg-forest-950/20" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_62%_50%_at_50%_48%,rgba(15,33,24,0.55)_0%,rgba(15,33,24,0)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-forest-950/60 to-transparent" />
        <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-forest-950/45 to-transparent" />

        <div className="container-page relative">
          <div className="hero-in flex flex-col items-center pt-24 pb-24 text-center md:pt-36 md:pb-24">
            <p className="hero-eyebrow eyebrow !text-gold-300 [text-shadow:0_1px_12px_rgba(0,0,0,0.35)]">{l.heroEyebrow}</p>
            <h1 className="mt-4 max-w-5xl text-[2.15rem] leading-[1.04] min-[400px]:text-[2.5rem] text-ivory-50 [text-shadow:0_2px_30px_rgba(0,0,0,0.25)] sm:text-6xl md:text-[4.25rem] lg:text-[5rem]">
              {l.heroTitle.map((line) => (
                <span key={line} className="hero-line">
                  <span>{line}</span>
                </span>
              ))}
            </h1>
            <p className="hero-lead mt-4 max-w-2xl text-[0.92rem] leading-relaxed text-ivory-50/95 [text-shadow:0_1px_16px_rgba(0,0,0,0.35)] md:text-lg">
              {l.heroLead}
            </p>
            {all.length > 0 ? (
              <div className="hero-search mt-6 w-full md:mt-10">
                <HeroSearch locale={locale} labels={filterLabels(dict)} towns={towns} types={types} />
                {hasDemo && <DemoNotice text={t.demoNotice} tone="light" className="mt-4" />}
              </div>
            ) : (
              <div className="hero-search mt-10">
                <ContactButtons tone="light" whatsappLabel={cta.whatsapp} emailLabel={cta.email} emailSubject={dict.contact.emailSubject} />
              </div>
            )}
          </div>
        </div>

        <div aria-hidden="true" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.6rem] tracking-[0.3em] text-ivory-50/70 uppercase md:flex">
          {l.scroll}
          <span className="relative block h-9 w-px overflow-hidden bg-ivory-50/25">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.4s_var(--ease-in-out)_infinite] bg-gold-300" />
          </span>
        </div>
      </section>

      {/* ───────── 2 · Approach (quiet) ───────── */}
      <section className="container-page grid items-center gap-12 py-20 md:py-24 lg:grid-cols-12 lg:gap-16">
        <div className="relative lg:col-span-5">
          {introMain ? (
            <div className="relative pr-[22%] pb-[14%]">
              <div className="relative aspect-[5/4] overflow-hidden rounded-sm bg-ivory-200 sm:aspect-[4/5] lg:max-h-[30rem]" data-reveal="mask">
                <Image src={introMain.src} alt={introMain.alt[locale]} fill sizes="(min-width: 1024px) 30vw, 80vw" className="object-cover" />
              </div>
              {introInset && (
                <div className="absolute right-0 bottom-0 aspect-[4/3] w-[52%] overflow-hidden rounded-sm border-4 border-ivory-50 bg-ivory-200 shadow-xl" data-reveal="mask" style={delay(0.25)}>
                  <Image src={introInset.src} alt={introInset.alt[locale]} fill sizes="(min-width: 1024px) 18vw, 45vw" className="object-cover" />
                </div>
              )}
            </div>
          ) : (
            <Photo slot={media.intro} locale={locale} variant="hills" className="aspect-[4/5]" />
          )}
          {introMain?.isAiGenerated && (
            <p className="mt-3 text-[0.7rem] tracking-wide text-muted">
              {introHome?.name} · {t.aiImage}
            </p>
          )}
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow" data-reveal>{l.introEyebrow}</p>
          <TwoLine lines={l.introTitle} className="mt-4 text-4xl md:text-[2.9rem]" d={0.05} />
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted" data-reveal style={delay(0.2)}>{l.introBody}</p>
          <p className="mt-8 text-[0.7rem] font-semibold tracking-[0.18em] text-gold-600 uppercase" data-reveal style={delay(0.25)}>{l.introHelp}</p>
          <ul className="mt-2 border-t border-ivory-300">
            {services.items.map((s, i) => (
              <li key={s.id} className="border-b border-ivory-300" data-reveal style={delay(0.3 + i * 0.08)}>
                <Link href={`/${locale}/services#${s.id}`} className="group flex items-center justify-between gap-4 py-3">
                  <span className="flex flex-wrap items-baseline gap-x-3">
                    <span className="font-serif text-[1.35rem] text-forest-900 group-hover:text-gold-600">{s.title}</span>
                    <span className="text-sm text-muted">{s.question}</span>
                  </span>
                  <ArrowIcon className="size-4 shrink-0 text-gold-600 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── 3 · One home, chapter by chapter (signature) ───────── */}
      {story && storyChapters.length > 1 && (
        <section className="bg-ivory-100 pt-20 pb-16 md:pt-24 md:pb-20">
          <div className="container-page">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
              <div className="lg:col-span-7">
                <p className="eyebrow" data-reveal>{l.storyEyebrow}</p>
                <TwoLine lines={l.storyTitle} className="mt-4 text-4xl md:text-[2.9rem]" d={0.05} />
              </div>
              <div className="lg:col-span-5" data-reveal style={delay(0.15)}>
                <p className="text-lg leading-relaxed text-muted">{l.storyLead}</p>
                {story.isDemo && <DemoNotice text={t.demoNotice} className="mt-3" />}
              </div>
            </div>
            <div className="mt-10">
              <PropertyStory
                property={story}
                chapters={storyChapters}
                locale={locale}
                labels={{
                  chapters: l.storyChapters,
                  kinds: l.kinds,
                  illustrative: l.illustrative,
                  aiImage: t.aiImage,
                  demoBadge: t.demoBadge,
                  examplePrice: t.examplePrice,
                  viewHome: l.viewHome,
                  beds: t.specs.beds,
                  baths: t.specs.baths,
                  built: t.specs.built,
                  plot: t.specs.plot,
                  prev: dict.home2.carouselPrev,
                  next: dict.home2.carouselNext,
                  of: l.slideOf,
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ───────── 4 · Homes to explore (quiet) ───────── */}
      {curated.length > 0 && (
        <section className="py-20 lg:py-16 xl:py-20">
          <div className="container-page">
            <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-6">
                <p className="eyebrow" data-reveal>{l.homesEyebrow}</p>
                <TwoLine lines={l.homesTitle} className="mt-4 text-4xl md:text-[2.9rem]" d={0.05} />
              </div>
              <div className="lg:col-span-5 lg:col-start-8" data-reveal style={delay(0.15)}>
                <p className="leading-relaxed text-muted">{l.homesLead}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  {hasDemo && <DemoNotice text={t.demoNotice} />}
                  <SectionLink href={`/${locale}/properties`}>{t.viewAll}</SectionLink>
                </div>
              </div>
            </div>
            <div className="mt-6" data-reveal style={delay(0.2)}>
              <CuratedHomes
                properties={curated}
                locale={locale}
                cardLabels={labels}
                tabLabels={l.tabs}
                tabsLabel={l.tabsLabel}
                carousel={{ prev: dict.home2.carouselPrev, next: dict.home2.carouselNext, of: l.slideOf }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ───────── 5 · Explore the setting ───────── */}
      {showAreas && (
        <section className="bg-forest-950 py-20 text-ivory-50 lg:py-16 xl:py-20">
          <div className="container-page">
            <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-6">
                <p className="eyebrow !text-gold-400" data-reveal>{l.areaEyebrow}</p>
                <TwoLine lines={l.areaTitle} tone="light" className="mt-4 text-4xl md:text-[2.9rem]" d={0.05} />
              </div>
              <div className="lg:col-span-5 lg:col-start-8" data-reveal style={delay(0.15)}>
                <p className="leading-relaxed text-ivory-200/80">{l.areaLead}</p>
                {hasDemo && <DemoNotice text={t.demoNotice} tone="light" className="mt-3" />}
              </div>
            </div>
            <div className="mt-8" data-reveal style={delay(0.2)}>
              <AreaExplorer
                areas={areaEntries.filter((a) => a.scene)}
                locale={locale}
                labels={{
                  select: l.areaSelect,
                  map: l.areaMap,
                  homes: l.areaHomes,
                  noHomes: l.areaNoHomes,
                  illustrative: l.illustrative,
                  demoBadge: t.demoBadge,
                  examplePrice: t.examplePrice,
                }}
              />
            </div>
            <div className="mt-10">
              <SectionLink href={`/${locale}/costa-blanca`} tone="light">{cta.exploreArea}</SectionLink>
            </div>
          </div>
        </section>
      )}

      {/* ───────── 6 · Buying process (quiet) ───────── */}
      <section className="container-page py-20 md:py-24">
        <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="eyebrow" data-reveal>{l.processEyebrow}</p>
            <h2 className="mt-4 text-4xl leading-tight text-forest-900 md:text-[2.9rem]" data-reveal="lines">
              <span className="line"><span>{home.processTitle}</span></span>
            </h2>
          </div>
          <p className="leading-relaxed text-muted lg:col-span-5 lg:col-start-8" data-reveal style={delay(0.15)}>
            {home.processLead}
          </p>
        </div>

        <ol data-progress="through" className="relative mt-12 grid gap-8 pl-10 lg:grid-cols-5 lg:gap-8 lg:pl-0">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-ivory-300 lg:top-[7px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto" />
          <span aria-hidden="true" className="timeline-fill absolute top-2 bottom-2 left-[7px] w-px bg-gold-500 lg:top-[7px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto" />
          {steps.map((step, i) => (
            <li key={step.title} className="timeline-step relative" data-step-at={(i / steps.length).toFixed(3)} data-reveal style={delay(i * 0.08)}>
              <span aria-hidden="true" className="timeline-dot absolute top-0.5 -left-10 size-[15px] rounded-full border border-ivory-300 bg-ivory-50 lg:static lg:block" />
              <p className="font-serif text-lg text-gold-600 tabular-nums lg:mt-5">0{i + 1}</p>
              <h3 className="mt-1 text-[1.4rem] leading-tight text-forest-900">{step.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <SectionLink href={`/${locale}/how-we-help`}>{cta.seeProcess}</SectionLink>
        </div>
      </section>

      {/* ───────── 7 · Take the next step ───────── */}
      <section data-progress="enter">
        <div className="contact-open bg-brand-forest text-ivory-50">
          <div className="container-page flex flex-col items-center py-20 text-center md:py-24">
            <p className="eyebrow !text-gold-400" data-reveal>{site.brandLine}</p>
            <h2 className="mt-5 max-w-3xl text-4xl leading-[1.08] md:text-[3.25rem]" data-reveal="lines" style={delay(0.05)}>
              <span className="line"><span>{l.contactTitle}</span></span>
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ivory-200/85" data-reveal style={delay(0.2)}>{l.contactLead}</p>
            <div className="mt-8" data-reveal style={delay(0.3)}>
              <ContactButtons tone="light" whatsappLabel={cta.whatsapp} emailLabel={cta.email} emailSubject={dict.contact.emailSubject} />
            </div>
            <a href={tel} className="mt-6 inline-flex items-center gap-2 text-sm text-ivory-200/80 hover:text-gold-300" data-reveal style={delay(0.4)}>
              <PhoneIcon className="size-4" /> {site.contact.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
