import { about, site } from "@/data/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Portrait } from "@/components/ui/Portrait";
import { TextLink } from "@/components/ui/Cta";

/* 06 — O MNIE */
export function About() {
  return (
    <section id="about" className="relative pt-[var(--section-gap)]">
      <div className="container-x">
        <SectionHeader no="06" eyebrow="O mnie" headline={about.headline} />

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-12">
          <Reveal className="md:col-span-5 lg:col-span-4">
            <Portrait src={about.photo} alt={about.photoAlt} aspect="4/5" />
          </Reveal>

          <div className="md:col-span-7 md:col-start-7 lg:col-span-6 lg:col-start-7">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.06 * i}>
                <p
                  className={`max-w-[52ch] leading-[1.7] ${
                    i === 0
                      ? "text-[1.05rem] text-[var(--color-ink)] sm:text-[1.15rem]"
                      : "mt-6 text-[0.98rem] text-[var(--color-muted)]"
                  }`}
                >
                  {p}
                </p>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <dl className="mt-12 border-t border-[var(--color-line)]">
                {about.facts.map((f) => (
                  <div key={f.k} className="flex flex-col gap-1 border-b border-[var(--color-line)] py-4 sm:flex-row sm:gap-8">
                    <dt className="label w-40 shrink-0 pt-[3px]">{f.k}</dt>
                    <dd className="text-[0.92rem] text-[var(--color-ink)]/85">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.26}>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-[0.9rem]">
                <TextLink href={site.socials.youtube} external>
                  YouTube
                </TextLink>
                <TextLink href={site.socials.tiktok} external>
                  TikTok
                </TextLink>
                <TextLink href={site.socials.instagram} external>
                  Instagram
                </TextLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
