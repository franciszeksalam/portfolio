"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { nav, site } from "@/data/site";

/* Nawigacja + timeline-owy pasek postępu strony (playhead całej sekwencji). */
export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-[var(--color-accent)]"
        style={{ scaleX: progress }}
      />

      <header
        className={`fixed inset-x-0 top-0 z-[65] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          solid
            ? "border-b border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-void)_82%,transparent)] backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div className="container-x flex h-[68px] items-center justify-between">
          <a href="#top" className="group flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center border border-[var(--color-line-strong)] transition-colors group-hover:border-[var(--color-accent)]">
              <span className="h-1.5 w-1.5 bg-[var(--color-accent)]" />
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-ink)]">
              {site.name}
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="group relative font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-[var(--color-accent)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden rounded-full border border-[var(--color-line-strong)] px-5 py-2 text-[0.82rem] transition-colors hover:border-white/45 hover:bg-white/[0.05] sm:block"
            >
              Napisz
            </a>
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
            >
              <span
                className={`h-px w-5 bg-current transition-transform duration-300 ${open ? "translate-y-[3px] rotate-45" : ""}`}
              />
              <span
                className={`h-px w-5 bg-current transition-transform duration-300 ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* menu mobilne */}
      <motion.div
        className="fixed inset-0 z-[64] bg-[var(--color-void)] md:hidden"
        initial={false}
        animate={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex h-full flex-col justify-center gap-2 px-[var(--gutter)]">
          {nav.map((item, i) => (
            <motion.a
              key={item.id}
              href={item.href}
              onClick={() => setOpen(false)}
              className="display-md border-b border-[var(--color-line)] py-5"
              initial={false}
              animate={{ opacity: open ? 1 : 0, y: open ? 0 : 18 }}
              transition={{ duration: 0.5, delay: open ? 0.06 * i : 0, ease: [0.16, 1, 0.3, 1] }}
            >
              {item.label}
            </motion.a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-[var(--color-ink)] px-6 py-3.5 text-[0.9rem] font-medium text-[var(--color-void)]"
          >
            Porozmawiajmy →
          </a>
        </div>
      </motion.div>
    </>
  );
}
