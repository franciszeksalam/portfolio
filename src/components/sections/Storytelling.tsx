"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { storytelling } from "@/data/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { VideoFrame } from "@/components/ui/VideoFrame";
import { usePrefersReducedMotion } from "@/lib/hooks";

/* =============================================================================
   03 — STORYTELLING
   Sticky player + etapy historii. Scroll przesuwa film do omawianego momentu.
   ========================================================================== */

const chapters = storytelling.chapters;
const DURATION = storytelling.film.durationSeconds;

export function Storytelling() {
  const [active, setActive] = useState(0);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start center", "end center"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  /* — który etap jest w centrum ekranu ——————————————————————————— */
  useEffect(() => {
    const nodes = stepsRef.current?.querySelectorAll<HTMLElement>("[data-chapter]");
    if (!nodes?.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.chapter));
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  /* — przeskok filmu do timestampu etapu ——————————————————————— */
  useEffect(() => {
    const v = videoEl;
    if (!v) return;
    const target = chapters[active].at;

    const seek = () => {
      try {
        if (Number.isFinite(v.duration) && v.duration > target) v.currentTime = target;
        if (!reduced) v.play().catch(() => {});
      } catch {}
    };

    // w karcie w tle play() bywa odrzucane — próbujemy ponownie po powrocie
    const onVisible = () => {
      if (document.visibilityState === "visible") seek();
    };
    document.addEventListener("visibilitychange", onVisible);

    if (Number.isFinite(v.duration) && v.duration > 0) {
      seek();
      return () => document.removeEventListener("visibilitychange", onVisible);
    }
    v.addEventListener("loadedmetadata", seek, { once: true });
    return () => {
      v.removeEventListener("loadedmetadata", seek);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [active, reduced, videoEl]);

  return (
    <section id="storytelling" ref={sectionRef} className="relative pt-[var(--section-gap)]">
      {/* tło sekcji — delikatnie jaśniejsze pasmo, żeby oddzielić rozdział */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-[var(--color-base)]" />

      <div className="container-x">
        <SectionHeader
          no="03"
          eyebrow="Storytelling"
          headline={storytelling.headline}
          sub={storytelling.sub}
        />
        <p className="mt-6 max-w-[56ch] text-[0.95rem] leading-relaxed text-[var(--color-faint)]">
          {storytelling.intro}
        </p>
      </div>

      <div className="container-x mt-14 md:mt-20">
        <div className="md:grid md:grid-cols-12 md:gap-12">
          {/* ——— sticky player ————————————————————————————————— */}
          {/* `contents` na mobile: sticky łapie się kontenera obejmującego też etapy */}
          <div className="contents md:block md:col-span-6 lg:col-span-6">
            <div className="sticky top-[76px] z-20 -mx-[var(--gutter)] bg-[var(--color-base)] px-[var(--gutter)] py-3 md:top-24 md:mx-0 md:bg-transparent md:px-0 md:py-0">
              <VideoFrame
                ref={setVideoEl}
                src={storytelling.film.src}
                poster={storytelling.film.poster}
                label={storytelling.film.title}
                index="CASE STUDY"
                aspect="16/9"
                autoPlay={false}
                loop={false}
                hasAudio
              />

              {/* timeline filmu ze znacznikami etapów.
                  Znaczniki są w prawdziwych proporcjach czasu — zagęszczenie na
                  początku filmu jest informacją samą w sobie, nie błędem. */}
              <div className="mt-4">
                <div className="relative h-[26px]">
                  <div className="absolute inset-x-0 top-[12px] h-px bg-[var(--color-line-strong)]" />

                  {/* wypełnienie do aktywnego etapu */}
                  <motion.div
                    className="absolute left-0 top-[12px] h-px origin-left bg-[var(--color-accent)]"
                    animate={{ width: `${(chapters[active].at / DURATION) * 100}%` }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {chapters.map((c, i) => {
                    const left = Math.min(Math.max((c.at / DURATION) * 100, 0), 100);
                    if (i === active) return null;
                    return (
                      <span
                        key={c.no}
                        aria-hidden
                        className={`absolute top-[8px] h-[9px] w-px transition-colors duration-500 ${
                          c.at < chapters[active].at ? "bg-[var(--color-accent)]/45" : "bg-white/25"
                        }`}
                        style={{ left: `${left}%` }}
                      />
                    );
                  })}

                  {/* playhead na aktywnym etapie */}
                  <motion.span
                    className="absolute top-[7px] h-[11px] w-[11px] -translate-x-1/2 rotate-45 bg-[var(--color-accent)]"
                    animate={{ left: `${(chapters[active].at / DURATION) * 100}%` }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="timecode text-[var(--color-accent)]">{chapters[active].timecode}</span>
                  <span className="label whitespace-nowrap">
                    {chapters[active].no} / {String(chapters.length).padStart(2, "0")}
                  </span>
                  <span className="label truncate text-right">{storytelling.film.meta}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ——— etapy ————————————————————————————————————————— */}
          <div className="relative md:col-span-6 lg:col-span-5 lg:col-start-8">
            {/* pionowy timeline */}
            <div className="absolute left-0 top-0 hidden h-full w-px bg-[var(--color-line)] md:block">
              <motion.div
                className="absolute left-0 top-0 w-px origin-top bg-[var(--color-accent)]"
                style={{ scaleY: progress, height: "100%" }}
              />
            </div>

            <div ref={stepsRef} className="md:pl-10">
              {chapters.map((c, i) => (
                <div
                  key={c.no}
                  data-chapter={i}
                  className="flex min-h-[54vh] flex-col justify-center py-8 md:min-h-[64vh] md:py-10"
                >
                  <motion.div
                    animate={{
                      opacity: i === active ? 1 : 0.28,
                      x: i === active ? 0 : reduced ? 0 : -6,
                    }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] transition-colors duration-500 ${
                          i === active ? "text-[var(--color-accent)]" : "text-[var(--color-faint)]"
                        }`}
                      >
                        {c.no}
                      </span>
                      <span className="timecode text-[var(--color-faint)]">{c.timecode}</span>
                    </div>

                    <h3 className="mt-5 text-[clamp(1.9rem,3.6vw,3.1rem)] font-medium uppercase leading-none tracking-[-0.03em] [font-family:var(--font-display)]">
                      {c.title}
                    </h3>

                    <p className="mt-5 max-w-[42ch] text-[0.98rem] leading-[1.65] text-[var(--color-muted)]">
                      {c.desc}
                    </p>

                    <p className="mt-6 flex items-center gap-3 text-[0.8rem] text-[var(--color-faint)]">
                      <span className="h-px w-6 bg-[var(--color-line-strong)]" />
                      {c.note}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
