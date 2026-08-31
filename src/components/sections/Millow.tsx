import { millow } from "@/data/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { VideoFrame } from "@/components/ui/VideoFrame";
import { Reveal } from "@/components/ui/Reveal";
import { Cta } from "@/components/ui/Cta";

/* 07 — MILLOW */
export function Millow() {
  return (
    <section id="millow" className="relative pt-[var(--section-gap)]">
      <div className="container-x">
        <div className="border-t border-[var(--color-line)] pt-14 md:pt-20">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <SectionHeader no="07" eyebrow="Millow" headline={millow.headline} size="md" />

              <Reveal delay={0.12}>
                <p className="mt-8 max-w-[46ch] text-[1rem] leading-[1.7] text-[var(--color-ink)]/90">{millow.body}</p>
                <p className="mt-4 max-w-[46ch] text-[0.95rem] leading-[1.7] text-[var(--color-muted)]">{millow.sub}</p>

                <ul className="mt-10 space-y-3">
                  {millow.points.map((p) => (
                    <li key={p} className="flex gap-4 text-[0.9rem] text-[var(--color-muted)]">
                      <span className="mt-[9px] h-px w-5 shrink-0 bg-[var(--color-line-strong)]" />
                      {p}
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <Cta href={millow.href} external>
                    {millow.cta}
                  </Cta>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
              <div className="relative">
                {/* abstrakcyjne okno pluginu */}
                <div className="rounded-[12px] border border-[var(--color-line)] bg-[var(--color-elevated)] p-3">
                  <div className="mb-3 flex items-center gap-2 px-1">
                    <span className="h-2 w-2 rounded-full bg-white/15" />
                    <span className="h-2 w-2 rounded-full bg-white/15" />
                    <span className="ml-2 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-[var(--color-faint)]">
                      millow · premiere pro
                    </span>
                  </div>
                  <VideoFrame
                    src={millow.mockup.src}
                    poster={millow.mockup.poster}
                    label="Millow — panel"
                    index="PLUGIN"
                    aspect="16/9"
                    hasAudio={millow.mockup.hasAudio}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
