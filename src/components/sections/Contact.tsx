"use client";

import { useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { contact, site } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { TextLink } from "@/components/ui/Cta";
import { trackTikTokLead } from "@/lib/tiktok";

/* 10 — KONTAKT / FINAL CTA
   Formularz leci przez własny API route (/api/kontakt) do Resend.
   Klucz API nigdy nie dotyka klienta. */

type Errors = Partial<Record<"name" | "email" | "channel" | "message" | "form", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const mountedAt = useRef(Date.now());
  /* Blokada wysyłki musi być synchroniczna: stan Reacta aktualizuje się dopiero
     przy kolejnym renderze, więc kilka szybkich kliknięć zdążyłoby przejść. */
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const clearError = (key: keyof Errors) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      channel: String(fd.get("channel") ?? "").trim(),
      need: String(fd.get("need") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      firma: String(fd.get("firma") ?? ""), // honeypot
      elapsed: Date.now() - mountedAt.current,
    };

    /* — walidacja po stronie klienta: szybka odpowiedź, bez alertów ———— */
    const next: Errors = {};
    if (!data.name) next.name = contact.errors.name;
    else if (data.name.length > 80) next.name = contact.errors.nameLong;
    if (!EMAIL_RE.test(data.email)) next.email = contact.errors.email;
    if (!data.message) next.message = contact.errors.message;
    else if (data.message.length > 4000) next.message = contact.errors.messageLong;
    if (data.channel.length > 300) next.channel = contact.errors.channelLong;

    if (Object.keys(next).length) {
      setErrors(next);
      const first = form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`);
      first?.focus();
      return;
    }

    setErrors({});
    inFlight.current = true;
    setState("sending");

    try {
      const res = await fetch(contact.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setState("sent");
        // Dopiero tutaj: backend potwierdził przyjęcie zgłoszenia.
        // Nie przy kliknięciu, nie przed odpowiedzią, nie przy błędzie.
        trackTikTokLead();
        return;
      }

      const payload = (await res.json().catch(() => ({}))) as { errors?: Errors; error?: string };
      setState("idle");
      setErrors(payload.errors ?? { form: payload.error ?? contact.errors.generic });
    } catch {
      setState("idle");
      setErrors({ form: contact.errors.generic });
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <section id="contact" className="relative pt-[var(--section-gap)]">
      <div className="container-x">
        <div className="flex items-center gap-4">
          <span className="label text-[var(--color-accent)]">10</span>
          <span className="label">Kontakt</span>
          <span className="h-px flex-1 bg-[var(--color-line)]" />
        </div>

        <Reveal>
          <h2 className="display-xl mt-12 max-w-[15ch]">{contact.headline}</h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 max-w-[46ch] text-[1rem] leading-[1.7] text-[var(--color-muted)]">{contact.sub}</p>
        </Reveal>

        <div className="mt-20 grid gap-16 md:mt-28 lg:grid-cols-12 lg:gap-12">
          {/* ——— formularz / potwierdzenie ————————————————————————— */}
          <div className="lg:col-span-7">
            {state === "sent" ? (
              <SuccessState />
            ) : (
              <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-9">
                  <div className="grid gap-9 sm:grid-cols-2">
                    <Field
                      name="name"
                      label={contact.fields.name}
                      required
                      error={errors.name}
                      onInput={() => clearError("name")}
                      autoComplete="given-name"
                      maxLength={80}
                    />
                    <Field
                      name="email"
                      label={contact.fields.email}
                      type="email"
                      required
                      error={errors.email}
                      onInput={() => clearError("email")}
                      autoComplete="email"
                      maxLength={160}
                    />
                  </div>

                  <Field
                    name="channel"
                    label={contact.fields.channel}
                    placeholder="youtube.com/@..."
                    error={errors.channel}
                    onInput={() => clearError("channel")}
                    autoComplete="url"
                    maxLength={300}
                  />

                  <fieldset>
                    <legend className="label mb-4 block">{contact.fields.need}</legend>
                    <div className="flex flex-wrap gap-2">
                      {contact.needOptions.map((o) => (
                        <label key={o} className="cursor-pointer">
                          <input type="radio" name="need" value={o} className="peer sr-only" />
                          <span className="block rounded-full border border-[var(--color-line)] px-4 py-2 text-[0.85rem] text-[var(--color-muted)] transition-colors duration-300 hover:border-white/25 peer-checked:border-white/60 peer-checked:bg-white/[0.06] peer-checked:text-[var(--color-ink)] peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[var(--color-accent)]">
                            {o}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <Field
                    name="message"
                    label={contact.fields.message}
                    textarea
                    required
                    error={errors.message}
                    onInput={() => clearError("message")}
                    maxLength={4000}
                  />

                  {/* pułapka na boty — niewidoczna dla ludzi i czytników ekranu */}
                  <div className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden>
                    <label htmlFor="firma">Nazwa firmy</label>
                    <input id="firma" name="firma" type="text" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-2">
                    <motion.button
                      type="submit"
                      disabled={state === "sending"}
                      whileTap={state === "sending" ? undefined : { scale: 0.98 }}
                      className="group inline-flex items-center gap-3 rounded-full bg-[var(--color-ink)] px-7 py-4 text-[0.92rem] font-medium text-[var(--color-void)] transition-colors duration-500 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {state === "sending" ? "Wysyłam…" : contact.cta}
                      {state === "sending" ? (
                        <span className="flex h-[10px] w-[18px] items-end gap-[3px]" aria-hidden>
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="w-[3px] flex-1 bg-[var(--color-void)]"
                              animate={{ height: ["30%", "100%", "30%"] }}
                              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
                            />
                          ))}
                        </span>
                      ) : (
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden
                          className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                          <path d="M9 1L13 5L9 9M13 5H0" stroke="currentColor" strokeWidth="1.4" />
                        </svg>
                      )}
                    </motion.button>

                    {errors.form && (
                      <p role="alert" className="max-w-[40ch] text-[0.85rem] leading-relaxed text-[var(--color-muted)]">
                        {errors.form}{" "}
                        <a href={`mailto:${site.email}`} className="text-[var(--color-ink)] underline underline-offset-4 decoration-white/30 transition-colors hover:decoration-white">
                          {site.email}
                        </a>
                      </p>
                    )}
                  </div>
              </form>
            )}
          </div>

          {/* ——— dane kontaktowe ————————————————————————————————— */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="space-y-10">
              <div>
                <span className="label">E-mail</span>
                <p className="mt-3 text-[1.05rem] [overflow-wrap:anywhere]">
                  <TextLink href={`mailto:${site.email}`}>{site.email}</TextLink>
                </p>
              </div>
              <div>
                <span className="label">Instagram</span>
                <p className="mt-3 text-[1.05rem]">
                  <TextLink href={site.socials.instagram} external>
                    {site.handles.instagram}
                  </TextLink>
                </p>
              </div>
              <div>
                <span className="label">{contact.availability.label}</span>
                <p className="mt-3 max-w-[28ch] text-[0.92rem] leading-relaxed text-[var(--color-muted)]">
                  {contact.availability.text}
                </p>
                <p className="mt-3 text-[0.82rem] text-[var(--color-faint)]">{contact.availability.meta}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}

/* -----------------------------------------------------------------------------
   Potwierdzenie wysyłki — playhead dojeżdża do końca ścieżki
   -------------------------------------------------------------------------- */
function SuccessState() {
  /* Wejście animowane CSS-em, nie pętlą animacji: potwierdzenie wysyłki musi
     być widoczne zawsze, także gdy przeglądarka wstrzyma animacje. */
  return (
    <div className="intro-fade border-t border-[var(--color-line)] pt-10" role="status" aria-live="polite">
      <div className="relative h-[18px] max-w-[380px]">
        <span className="absolute inset-x-0 top-[8px] h-px bg-[var(--color-line)]" />
        <motion.span
          className="absolute left-0 top-[8px] h-px origin-left bg-[var(--color-accent)]"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.span
          className="absolute top-[3px] h-[11px] w-[11px] -translate-x-1/2 rotate-45 bg-[var(--color-accent)]"
          initial={{ left: "0%" }}
          animate={{ left: "100%" }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <h3 className="display-md mt-8">{contact.success.headline}</h3>
      <p className="mt-4 text-[1.05rem] text-[var(--color-muted)]">{contact.success.sub}</p>
      <p className="mt-8 text-[0.85rem] text-[var(--color-faint)]">{contact.success.note}</p>
    </div>
  );
}

/* -----------------------------------------------------------------------------
   Pole formularza — błąd pojawia się pod polem, w rytmie design systemu
   -------------------------------------------------------------------------- */
function Field({
  name,
  label,
  type = "text",
  required = false,
  textarea = false,
  placeholder,
  error,
  onInput,
  autoComplete,
  maxLength,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  placeholder?: string;
  error?: string;
  onInput?: () => void;
  autoComplete?: string;
  maxLength?: number;
}) {
  const errorId = `${name}-error`;
  const base = `peer w-full border-b bg-transparent pb-3 pt-2 text-[1rem] text-[var(--color-ink)] outline-none transition-colors duration-300 placeholder:text-[var(--color-faint)] ${
    error ? "border-[var(--color-accent)]" : "border-[var(--color-line)] focus:border-[var(--color-ink)]"
  }`;

  return (
    <div className="relative">
      <label htmlFor={name} className="label mb-3 block">
        {label}
        {required && <span className="ml-1 text-[var(--color-accent)]">*</span>}
      </label>

      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={4}
          placeholder={placeholder}
          onInput={onInput}
          maxLength={maxLength}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`${base} resize-none`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          onInput={onInput}
          maxLength={maxLength}
          autoComplete={autoComplete}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={base}
        />
      )}

      <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[var(--color-accent)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:scale-x-100" />

      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-2.5 text-[0.78rem] text-[var(--color-accent)]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Footer() {
  return (
    <footer className="container-x mt-28 md:mt-40">
      <div className="flex flex-col gap-4 border-t border-[var(--color-line)] py-8 sm:flex-row sm:items-center sm:justify-between">
        <span className="label">
          © {new Date().getFullYear()} {site.name}
        </span>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <a href={site.socials.youtube} target="_blank" rel="noopener noreferrer" className="label transition-colors hover:text-[var(--color-ink)]">
            YouTube
          </a>
          <a href={site.socials.tiktok} target="_blank" rel="noopener noreferrer" className="label transition-colors hover:text-[var(--color-ink)]">
            TikTok
          </a>
          <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="label transition-colors hover:text-[var(--color-ink)]">
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
