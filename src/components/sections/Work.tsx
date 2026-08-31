"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects, workFilters, type Project } from "@/data/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Thumbnail } from "@/components/ui/Thumbnail";
import { Lightbox, type LightboxItem } from "@/components/ui/Lightbox";

/* 02 — SELECTED WORK */
export function Work() {
  const [format, setFormat] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [playing, setPlaying] = useState<LightboxItem>(null);

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) => (format === "all" || p.format === format) && (category === "all" || p.category === category)
      ),
    [format, category]
  );

  const longs = filtered.filter((p) => p.format === "long");
  const shorts = filtered.filter((p) => p.format === "short");

  const open = (p: Project) =>
    setPlaying({
      title: p.title ?? p.kind,
      meta: [p.client, p.kind].filter(Boolean).join(" · "),
      youtubeId: p.youtubeId,
      src: p.video?.src,
      poster: p.thumb,
      aspect: p.format === "short" ? "9/16" : "16/9",
    });

  return (
    <section id="work" className="relative pt-[var(--section-gap)]">
      <div className="container-x">
        <SectionHeader
          no="02"
          eyebrow="Selected work"
          headline="Realizacje, w których montaż zrobił różnicę."
          sub="Long form i short form dla twórców z widownią, dla której liczy się retencja — nie estetyka sama w sobie."
        />

        {/* filtry */}
        <div className="mt-14 flex flex-col gap-5 border-y border-[var(--color-line)] py-5 sm:flex-row sm:items-center sm:justify-between">
          <FilterRow label="Format" options={workFilters.format} value={format} onChange={setFormat} idPrefix="f" />
          <FilterRow
            label="Tematyka"
            options={workFilters.category}
            value={category}
            onChange={setCategory}
            idPrefix="c"
          />
        </div>
      </div>

      {/* long form */}
      <div className="container-x">
        <AnimatePresence mode="popLayout">
          {longs.map((p, i) => (
            <motion.article
              key={p.id}
              layout
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-8 border-b border-[var(--color-line)] py-16 md:grid-cols-12 md:gap-10 md:py-24"
            >
              <div className={`md:col-span-7 ${i % 2 === 1 ? "md:order-2 md:col-start-6" : ""}`}>
                <button
                  type="button"
                  onClick={() => open(p)}
                  className="group relative block w-full text-left"
                  aria-label={`Odtwórz: ${p.title ?? p.kind}`}
                >
                  <Thumbnail
                    src={p.thumb}
                    alt={p.title ?? p.kind}
                    label={p.title ?? p.kind}
                    index={`0${i + 1} / LONG FORM`}
                    aspect="16/9"
                    priority={i === 0}
                  />
                  <PlayBadge />
                </button>
              </div>

              <div className={`flex flex-col justify-between md:col-span-4 ${i % 2 === 1 ? "md:order-1 md:col-start-1" : "md:col-start-9"}`}>
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="label text-[var(--color-accent)]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="label">{p.views ?? p.year}</span>
                  </div>
                  <h3 className="mt-5 text-[clamp(1.35rem,2.1vw,1.9rem)] font-medium leading-[1.15] tracking-[-0.025em] [font-family:var(--font-display)]">
                    {p.title}
                  </h3>
                  {p.client && <p className="mt-4 text-[0.95rem] text-[var(--color-muted)]">{p.client}</p>}
                </div>

                <dl className="mt-8 space-y-3 border-t border-[var(--color-line)] pt-6 text-[0.88rem]">
                  <Meta k="Format" v={p.kind} />
                  <Meta k="Rola" v={p.role} />
                </dl>

                {p.goal && (
                  <p className="mt-6 max-w-[44ch] text-[0.95rem] leading-relaxed text-[var(--color-muted)]">
                    <span className="text-[var(--color-ink)]">Cel montażowy — </span>
                    {p.goal}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {/* short form — dwa pasy przewijane w poziomie: podróże, potem reszta */}
      {shorts.length > 0 && (
        <div className="pt-16 md:pt-24">
          <div className="container-x mb-10 flex items-center gap-4">
            <span className="label">Short form</span>
            <span className="h-px flex-1 bg-[var(--color-line)]" />
            <span className="label">{shorts.length} realizacji</span>
          </div>

          <div className="space-y-12 md:space-y-16">
            {[
              { id: "travel", label: "Podróże", items: shorts.filter((p) => p.category === "travel") },
              { id: "other", label: "Rozrywka / Vlog", items: shorts.filter((p) => p.category !== "travel") },
            ]
              .filter((row) => row.items.length > 0)
              .map((row) => (
                <ShortRow key={row.id} label={row.label} items={row.items} onOpen={open} />
              ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="container-x py-24 text-center">
          <p className="text-[var(--color-muted)]">Brak realizacji w tym zestawieniu.</p>
        </div>
      )}

      <Lightbox item={playing} onClose={() => setPlaying(null)} />
    </section>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
  idPrefix,
}: {
  label: string;
  options: readonly { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  idPrefix: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
      <span className="label mr-2">{label}</span>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`relative rounded-full px-4 py-1.5 text-[0.82rem] transition-colors duration-300 ${
            value === o.id ? "text-[var(--color-void)]" : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          }`}
        >
          {value === o.id && (
            <motion.span
              layoutId={`filter-${idPrefix}`}
              className="absolute inset-0 rounded-full bg-[var(--color-ink)]"
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
          <span className="relative z-10">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-6">
      <dt className="label w-16 shrink-0 pt-[3px]">{k}</dt>
      <dd className="text-[var(--color-ink)]/85">{v}</dd>
    </div>
  );
}

function PlayBadge({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-full border border-white/15 bg-black/50 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-white/45 group-hover:bg-black/70 ${
        small ? "px-2.5 py-1.5" : "px-3.5 py-2"
      }`}
    >
      <svg width={small ? 7 : 9} height={small ? 8 : 10} viewBox="0 0 13 15" fill="none" aria-hidden>
        <path d="M12 7.5L0.75 14.4L0.75 0.6L12 7.5Z" fill="white" />
      </svg>
      <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.18em] text-white/75">
        Odtwórz
      </span>
    </span>
  );
}

/* -----------------------------------------------------------------------------
   Pas shortów przewijany w poziomie.
   Natywny scroll (trackpad, dotyk, shift+kółko) + strzałki na desktopie.
   -------------------------------------------------------------------------- */
function ShortRow({
  label,
  items,
  onOpen,
}: {
  label: string;
  items: Project[];
  onOpen: (p: Project) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const readEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ left: el.scrollLeft > 8, right: el.scrollLeft < max - 8 });
  }, []);

  useEffect(() => {
    readEdges();
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(readEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [readEdges, items.length]);

  const nudge = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.72), behavior: "smooth" });
  };

  return (
    <section aria-label={`Short form — ${label}`}>
      <div className="container-x mb-4 flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h3 className="text-[1.05rem] font-medium tracking-[-0.02em]">{label}</h3>
          <span className="label">{String(items.length).padStart(2, "0")}</span>
        </div>

        <div className="hidden gap-2 md:flex">
          {([-1, 1] as const).map((dir) => {
            const enabled = dir === -1 ? edges.left : edges.right;
            return (
              <button
                key={dir}
                type="button"
                onClick={() => nudge(dir)}
                disabled={!enabled}
                aria-label={dir === -1 ? "Przewiń w lewo" : "Przewiń w prawo"}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)] transition-colors duration-300 enabled:hover:border-white/40 enabled:hover:bg-white/[0.04] disabled:opacity-25"
              >
                <svg width="13" height="9" viewBox="0 0 14 10" fill="none" aria-hidden
                  className={dir === -1 ? "rotate-180" : ""}>
                  <path d="M9 1L13 5L9 9M13 5H0" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative">
        {/* wygaszenia krawędzi — sygnał, że pas jest dłuższy niż ekran */}
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-[var(--gutter)] bg-gradient-to-r from-[var(--color-void)] to-transparent transition-opacity duration-300 ${
            edges.left ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-[var(--gutter)] bg-gradient-to-l from-[var(--color-void)] to-transparent transition-opacity duration-300 ${
            edges.right ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          ref={trackRef}
          onScroll={readEdges}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[var(--gutter)] pb-1 md:gap-5"
        >
          {items.map((p) => (
            <article
              key={p.id}
              className="w-[62vw] max-w-[300px] shrink-0 snap-start sm:w-[42vw] md:w-[30vw] lg:w-[23vw]"
            >
              <button
                type="button"
                onClick={() => onOpen(p)}
                aria-label={`Odtwórz: ${p.title ?? p.kind}`}
                className="group block w-full text-left"
              >
                <div className="relative">
                  <Thumbnail
                    src={p.thumb}
                    alt={p.title ?? p.kind}
                    label={p.title ?? p.kind}
                    index="SHORT"
                    aspect="9/16"
                    dense
                  />
                  <PlayBadge small />
                </div>
                {p.title ? (
                  <>
                    <h4 className="mt-4 text-[0.95rem] font-medium leading-snug tracking-[-0.02em]">
                      {p.title}
                    </h4>
                    <p className="mt-1.5 text-[0.8rem] text-[var(--color-muted)]">{p.kind}</p>
                  </>
                ) : (
                  <p className="mt-4 text-[0.82rem] text-[var(--color-muted)]">{p.kind}</p>
                )}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
