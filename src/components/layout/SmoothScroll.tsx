"use client";

import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

/* Lenis — smooth scroll. Wyłączony przy prefers-reduced-motion i na dotyku,
   gdzie natywny scroll jest lepszy i tańszy. */
export function SmoothScroll() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let lenis: any;
    let raf = 0;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ duration: 1.05, wheelMultiplier: 1, lerp: 0.11 });
      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, [reduced]);

  return null;
}
