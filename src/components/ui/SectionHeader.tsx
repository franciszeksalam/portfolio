import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/* Nagłówek sekcji: numer rozdziału (mono) + hairline + headline. */
export function SectionHeader({
  no,
  eyebrow,
  headline,
  sub,
  align = "left",
  size = "lg",
  children,
}: {
  no: string;
  eyebrow: string;
  headline: ReactNode;
  sub?: ReactNode;
  align?: "left" | "center";
  size?: "lg" | "md";
  children?: ReactNode;
}) {
  return (
    <header className={align === "center" ? "text-center" : ""}>
      <Reveal>
        <div
          className={`flex items-center gap-4 ${align === "center" ? "justify-center" : ""}`}
        >
          <span className="label text-[var(--color-accent)]">{no}</span>
          <span className="label">{eyebrow}</span>
          <span className="h-px flex-1 bg-[var(--color-line)]" />
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <h2
          className={`mt-8 max-w-[19ch] ${size === "lg" ? "display-lg" : "display-md"} ${
            align === "center" ? "mx-auto max-w-[22ch]" : ""
          }`}
        >
          {headline}
        </h2>
      </Reveal>

      {sub && (
        <Reveal delay={0.12}>
          <p
            className={`mt-6 max-w-[52ch] text-[0.98rem] leading-relaxed text-[var(--color-muted)] sm:text-[1.05rem] ${
              align === "center" ? "mx-auto" : ""
            }`}
          >
            {sub}
          </p>
        </Reveal>
      )}

      {children}
    </header>
  );
}
