"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { workflow } from "@/data/site";

/* 09 — PROCES
   Roadmapa schodząca w dół razem ze scrollem: pionowa oś wypełnia się w miarę
   przewijania, a krok, przy którym jesteś, rozjaśnia się i dostaje playhead.
   Ten sam język co timeline w sekcji 03 — bez nowego słownictwa wizualnego. */
export function Process() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 70%", "end 70%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const nodes = trackRef.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!nodes?.length) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        }),
      { rootMargin: "-40% 0px -45% 0px", threshold: 0 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section id="process" className="relative pt-[var(--section-gap)]">
      <div className="container-x">
        <div className="flex items-center gap-4">
          <span className="label text-[var(--color-accent)]">09</span>
          <span className="label">{workflow.headline}</span>
          <span className="h-px flex-1 bg-[var(--color-line)]" />
        </div>

        <div ref={trackRef} className="relative mt-14 md:mt-20">
          {/* oś — wypełnia się razem ze scrollem */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--color-line)] sm:left-[9px]">
            <motion.div
              className="absolute left-0 top-0 w-px origin-top bg-[var(--color-accent)]"
              style={{ scaleY: progress, height: "100%" }}
            />
          </div>

          {workflow.steps.map((s, i) => {
            const isActive = i === active;
            return (
              <div
                key={s.no}
                data-step={i}
                className="relative grid gap-4 pb-14 pl-10 last:pb-0 sm:pl-14 md:grid-cols-12 md:gap-8 md:pb-20"
              >
                {/* znacznik na osi */}
                <span className="absolute left-0 top-[6px] flex h-[15px] w-[15px] items-center justify-center sm:left-[2px]">
                  <motion.span
                    className="block h-[11px] w-[11px] rotate-45 border"
                    animate={{
                      borderColor: isActive ? "var(--color-accent)" : "rgba(255,255,255,0.25)",
                      backgroundColor: isActive ? "var(--color-accent)" : "var(--color-void)",
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </span>

                <motion.div
                  className="md:col-span-3"
                  animate={{ opacity: isActive ? 1 : 0.45 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span
                    className={`font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] transition-colors duration-500 ${
                      isActive ? "text-[var(--color-accent)]" : "text-[var(--color-faint)]"
                    }`}
                  >
                    {s.no}
                  </span>
                  <h3 className="mt-4 text-[clamp(1.35rem,2.4vw,1.9rem)] font-medium leading-tight tracking-[-0.025em] [font-family:var(--font-display)]">
                    {s.title}
                  </h3>
                </motion.div>

                <motion.p
                  className="max-w-[52ch] text-[0.95rem] leading-[1.7] text-[var(--color-muted)] md:col-span-7 md:col-start-5 md:pt-8"
                  animate={{ opacity: isActive ? 1 : 0.4 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {s.desc}
                </motion.p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
