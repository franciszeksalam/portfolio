"use client";

import { motion } from "framer-motion";
import { pricing } from "@/data/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

/* 08 — WSPÓŁPRACA / PRICING
   Kolejność jest tu argumentem sprzedażowym: najpierw stała współpraca jako
   model, w którym pracuję, dopiero pod nią pojedyncze projekty — widoczne,
   ale oznaczone jako chwilowo niedostępne. */
export function Pricing() {
  const goToPlans = () =>
    document.getElementById("stala-wspolpraca")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section id="pricing" className="relative pt-[var(--section-gap)]">
      <div className="container-x">
        <SectionHeader no="08" eyebrow="Współpraca" headline={pricing.headline} sub={pricing.sub} />

        {/* ——— stała współpraca: bohater sekcji ——————————————————— */}
        <div id="stala-wspolpraca" className="mt-16 scroll-mt-28 md:mt-20">
          <Reveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="label text-[var(--color-accent)]">Polecane</span>
                <h3 className="display-md mt-4">{pricing.retainer.label}</h3>
              </div>
              <p className="max-w-[38ch] text-[0.9rem] leading-relaxed text-[var(--color-muted)]">
                {pricing.retainer.note}
              </p>
            </div>
          </Reveal>

          <RevealGroup className="mt-10 grid gap-4 lg:grid-cols-3 lg:gap-5">
            {pricing.retainer.plans.map((plan) => (
              <RevealItem key={plan.id} className="h-full">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative flex h-full flex-col rounded-[14px] border p-7 md:p-8 ${
                    plan.featured
                      ? "border-white/[0.18] bg-[var(--color-elevated)]"
                      : "border-[var(--color-line)] bg-transparent"
                  }`}
                >
                  {plan.featured && <span className="absolute -top-px left-8 right-8 h-px bg-[var(--color-accent)]" />}

                  <div className="flex items-center justify-between gap-3">
                    <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-ink)]">
                      {plan.title}
                    </span>
                    {plan.featured && <span className="label text-[var(--color-accent)]">Najczęstszy wybór</span>}
                  </div>

                  <p className="mt-5 text-[0.92rem] text-[var(--color-muted)]">{plan.tagline}</p>

                  <div className="mt-8 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-[clamp(2rem,3.4vw,2.9rem)] font-medium tracking-[-0.035em] [font-family:var(--font-display)]">
                      {plan.price}
                      {plan.price !== "Wycena" && <span className="ml-1 text-[0.5em]">{pricing.currency}</span>}
                    </span>
                    <span className="label">{plan.unit}</span>
                  </div>

                  <ul className="mt-8 flex-1 space-y-3 border-t border-[var(--color-line)] pt-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-3 text-[0.9rem] leading-relaxed text-[var(--color-ink)]/80">
                        <span className="mt-[10px] h-px w-4 shrink-0 bg-[var(--color-line-strong)]" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {"addon" in plan && plan.addon && (
                    <p className="mt-6 border-t border-[var(--color-line)] pt-5 text-[0.82rem] leading-relaxed text-[var(--color-muted)]">
                      {plan.addon}
                    </p>
                  )}

                  <a
                    href="#contact"
                    className={`group mt-8 inline-flex items-center justify-between rounded-full px-6 py-3.5 text-[0.88rem] font-medium transition-colors duration-500 ${
                      plan.featured
                        ? "bg-[var(--color-ink)] text-[var(--color-void)] hover:bg-white"
                        : "border border-[var(--color-line-strong)] text-[var(--color-ink)] hover:border-white/40 hover:bg-white/[0.04]"
                    }`}
                  >
                    {plan.price === "Wycena" ? "Porozmawiajmy" : "Zarezerwuj slot"}
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden
                      className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                      <path d="M9 1L13 5L9 9M13 5H0" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  </a>
                </motion.div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.08}>
            <p className="mt-8 max-w-[64ch] text-[0.78rem] leading-relaxed text-[var(--color-faint)] md:mt-10">
              <span className="mr-1">*</span>
              {pricing.retainer.disclaimer}
            </p>
          </Reveal>
        </div>

        {/* ——— pojedyncze projekty: drugorzędne, chwilowo zamknięte ——— */}
        <div className="mt-24 md:mt-36">
          <Reveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-12">
              <div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                  <span className="label">{pricing.oneOff.label}</span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] px-3 py-1.5">
                    <span className="h-[5px] w-[5px] rounded-full bg-[var(--color-faint)]" />
                    <span className="label">{pricing.oneOff.status}</span>
                  </span>
                </div>
                <p className="mt-5 max-w-[58ch] text-[0.92rem] leading-relaxed text-[var(--color-muted)]">
                  {pricing.oneOff.note}
                </p>
              </div>

              <button
                type="button"
                onClick={goToPlans}
                className="group inline-flex shrink-0 items-center gap-2.5 self-start text-[0.88rem] text-[var(--color-muted)] transition-colors duration-300 hover:text-[var(--color-ink)]"
              >
                <span className="relative">
                  {pricing.oneOff.cta}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100" />
                </span>
                <svg width="10" height="13" viewBox="0 0 10 13" fill="none" aria-hidden
                  className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
                  <path d="M1 4.5L5 0.5L9 4.5M5 0.5V12.5" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
            </div>
          </Reveal>

          <div className="mt-10 border-t border-[var(--color-line)]">
            {pricing.oneOff.items.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <div className="grid gap-4 border-b border-[var(--color-line)] py-8 md:grid-cols-12 md:items-baseline md:gap-8">
                  <div className="md:col-span-3">
                    <h4 className="text-[1.15rem] font-medium tracking-[-0.02em] text-[var(--color-ink)]/85">
                      {p.title}
                    </h4>
                  </div>

                  <p className="max-w-[52ch] text-[0.92rem] leading-relaxed text-[var(--color-muted)] md:col-span-5">
                    {p.desc}
                    <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.78rem] text-[var(--color-faint)]">
                      {p.includes.map((inc) => (
                        <span key={inc}>· {inc}</span>
                      ))}
                    </span>
                  </p>

                  <div className="md:col-span-4 md:text-right">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 md:justify-end">
                      <span className="text-[clamp(1.5rem,2.6vw,2.1rem)] font-medium tracking-[-0.03em] text-[var(--color-muted)] line-through decoration-white/30 decoration-1 [font-family:var(--font-display)]">
                        {p.price} {pricing.currency}
                      </span>
                      <span className="label">{p.unit}</span>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] px-3 py-1 md:mt-4">
                      <span className="h-[5px] w-[5px] rounded-full bg-[var(--color-faint)]" />
                      <span className="label">Niedostępne</span>
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
