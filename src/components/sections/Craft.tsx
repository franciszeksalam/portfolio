"use client";

import { craft } from "@/data/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { VideoFrame } from "@/components/ui/VideoFrame";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { ClickToPlay } from "@/components/ui/ClickToPlay";
import { Reveal } from "@/components/ui/Reveal";

/* 04 — CO TRAFIA DO TWOJEGO FILMU */
export function Craft() {
  return (
    <section id="craft" className="relative pt-[var(--section-gap)]">
      <div className="container-x">
        <SectionHeader no="04" eyebrow="Rzemiosło" headline={craft.headline} sub={craft.sub} />

        <div className="mt-4">
          {craft.items.map((item, i) => {
            const vertical = item.aspect === "9/16";
            return (
              <div
                key={item.id}
                className="grid items-center gap-8 border-b border-[var(--color-line)] py-14 md:grid-cols-12 md:gap-12 md:py-20"
              >
                {/* wizual */}
                <Reveal
                  className={
                    vertical
                      ? "mx-auto w-full max-w-[300px] md:col-span-4 md:col-start-8 md:order-2"
                      : `md:col-span-7 ${i % 2 === 1 ? "md:order-2 md:col-start-6" : ""}`
                  }
                >
                  {item.mode === "sound" && item.video ? (
                    <ClickToPlay
                      src={item.video.src}
                      poster={item.video.poster}
                      label={item.title}
                      index={`0${i + 1}`}
                      aspect={vertical ? "9/16" : "16/9"}
                    />
                  ) : item.mode === "compare" && item.before && item.after ? (
                    <BeforeAfter
                      before={item.before}
                      after={item.after}
                      aspect={vertical ? "9/16" : "16/9"}
                      hasAudio={item.hasAudio}
                      label={item.title}
                    />
                  ) : (
                    <VideoFrame
                      src={item.video!.src}
                      poster={item.video!.poster}
                      label={item.title}
                      index={`0${i + 1}`}
                      aspect={vertical ? "9/16" : "16/9"}
                      hasAudio={item.hasAudio}
                      dense={vertical}
                    />
                  )}
                </Reveal>

                {/* opis */}
                <Reveal
                  delay={0.08}
                  className={
                    vertical
                      ? "md:col-span-5 md:col-start-1 md:order-1"
                      : `md:col-span-4 ${i % 2 === 1 ? "md:order-1 md:col-start-1" : "md:col-start-9"}`
                  }
                >
                  <span className="label text-[var(--color-accent)]">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display-md mt-4">{item.title}</h3>
                  <p className="mt-5 max-w-[40ch] text-[0.98rem] leading-[1.65] text-[var(--color-muted)]">
                    {item.desc}
                  </p>
                  {item.mode === "compare" && (
                    <p className="mt-6 flex items-center gap-3 text-[0.78rem] text-[var(--color-faint)]">
                      <span className="h-px w-6 bg-[var(--color-line-strong)]" />
                      Przesuń suwak
                    </p>
                  )}
                  {item.hasAudio && (
                    <p className="mt-3 flex items-center gap-3 text-[0.78rem] text-[var(--color-faint)]">
                      <span className="h-px w-6 bg-[var(--color-line-strong)]" />
                      Włącz dźwięk
                    </p>
                  )}
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
