"use client";

import { afterEffects } from "@/data/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { VideoFrame } from "@/components/ui/VideoFrame";
import { Reveal } from "@/components/ui/Reveal";

/* 05 — AFTER EFFECTS */
export function AfterEffects() {
  return (
    <section id="after-effects" className="relative pt-[var(--section-gap)]">
      <div className="container-x">
        <SectionHeader no="05" eyebrow="After Effects" headline={afterEffects.headline} sub={afterEffects.sub} />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-20 md:gap-6">
          {afterEffects.items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <figure className="group relative">
                <VideoFrame
                  src={item.video.src}
                  poster={item.video.poster}
                  label={item.title}
                  index={`AE / 0${i + 1}`}
                  aspect="16/9"
                />
                <figcaption className="mt-4 flex items-baseline justify-between gap-6 border-t border-[var(--color-line)] pt-4">
                  <h3 className="text-[1.05rem] font-medium tracking-[-0.02em]">{item.title}</h3>
                  <p className="hidden text-right text-[0.82rem] text-[var(--color-muted)] sm:block">{item.note}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
