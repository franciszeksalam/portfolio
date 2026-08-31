"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { hero } from "@/data/site";
import { Cta } from "@/components/ui/Cta";
import { usePrefersReducedMotion } from "@/lib/hooks";

/* 01 — HERO
   Showreel leci w tle, mocno przygaszony: ma budować atmosferę, a nie zabierać
   ekran i wymuszać przewijanie. Pierwszym planem jest zdanie. */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.12]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.85], [1, reduced ? 1 : 0.15]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate flex min-h-[92svh] flex-col justify-center overflow-hidden pb-20 pt-[136px] sm:pt-[160px] md:min-h-[94svh]"
    >
      <motion.div className="absolute inset-0 -z-10" style={{ scale: bgScale, opacity: bgOpacity }}>
        <Backdrop />
      </motion.div>

      <div className="container-x">
        {/* eyebrow */}
        <div className="intro-fade flex flex-wrap items-center gap-x-4 gap-y-2" style={{ animationDelay: "0.05s" }}>
          {hero.eyebrow.map((item, i) => (
            <span key={item} className="flex items-center gap-4">
              {i > 0 && <span className="h-[3px] w-[3px] bg-[var(--color-faint)]" />}
              <span className="label">{item}</span>
            </span>
          ))}
        </div>

        <h1 className="intro-rise display-xl mt-9 max-w-[17ch]" style={{ animationDelay: "0.12s" }}>
          {hero.headline}
        </h1>

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
          <p
            className="intro-fade max-w-[54ch] text-[1rem] leading-[1.65] text-[var(--color-muted)] md:col-span-6 md:col-start-1 lg:col-span-5"
            style={{ animationDelay: "0.34s" }}
          >
            {hero.body}
          </p>

          <div
            className="intro-fade flex flex-wrap items-center gap-3 md:col-span-5 md:col-start-8 md:justify-end"
            style={{ animationDelay: "0.44s" }}
          >
            <Cta href={hero.primaryCta.href}>{hero.primaryCta.label}</Cta>
            <Cta href={hero.secondaryCta.href} variant="ghost">
              {hero.secondaryCta.label}
            </Cta>
          </div>
        </div>

        {/* statystyki */}
        <div className="mt-20 grid grid-cols-1 border-t border-[var(--color-line)] sm:grid-cols-3 md:mt-28">
          {hero.stats.map((s, i) => (
            <div
              key={s.label}
              className="intro-fade flex items-baseline gap-4 py-6 sm:flex-col sm:items-start sm:gap-2 sm:py-8"
              style={{
                animationDelay: `${0.56 + i * 0.06}s`,
                ...(i > 0 ? { borderTop: "1px solid var(--color-line)" } : {}),
              }}
            >
              <span className="text-[clamp(1.6rem,3vw,2.4rem)] font-medium tracking-[-0.03em] [font-family:var(--font-display)]">
                {s.value}
              </span>
              <span className="label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -----------------------------------------------------------------------------
   Tło hero — showreel wyciszony, przygaszony i wypchnięty za treść.
   Odtwarza się tylko wtedy, gdy hero jest w polu widzenia.
   -------------------------------------------------------------------------- */
function Backdrop() {
  const holder = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const v = video.current;
    if (v) v.muted = true; // React nie stosuje niezawodnie propa `muted`
  }, [ready]);

  useEffect(() => {
    const el = holder.current;
    const v = video.current;
    if (!el || !v || reduced) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else if (!v.paused) v.pause();
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div ref={holder} className="absolute inset-0 overflow-hidden bg-[var(--color-void)]">
      <video
        ref={video}
        className="h-full w-full object-cover opacity-[0.22] blur-[1px]"
        poster={hero.reel.poster}
        muted
        loop
        playsInline
        autoPlay={!reduced}
        preload="auto"
        onCanPlay={() => setReady(true)}
        aria-hidden
      >
        <source src={hero.reel.src} type="video/mp4" />
      </video>

      {/* przyciemnienie: materiał ma zostać tłem, nie tapetą */}
      <div className="absolute inset-0 bg-[var(--color-void)]/55" />
      {/* wygaszenie ku dołowi i bokom, żeby kadr nie miał widocznej krawędzi */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-void)_0%,transparent_28%,transparent_58%,var(--color-void)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_45%,transparent_35%,var(--color-void)_100%)]" />
    </div>
  );
}
