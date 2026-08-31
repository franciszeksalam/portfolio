"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

/* Masked reveal — „wipe” zamiast fade-up. Ruch inspirowany odsłanianiem klipu. */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className = "",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduced = usePrefersReducedMotion();

  const variants: Variants = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } } }
    : {
        hidden: { opacity: 0, y, clipPath: "inset(0 0 100% 0)" },
        show: {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0 0% 0)",
          transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
        },
      };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-10% 0px -12% 0px" }}
    >
      {children}
    </motion.div>
  );
}

/** Kontener do kaskadowego ujawniania dzieci. */
export function RevealGroup({
  children,
  className = "",
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px -10% 0px" }}
      variants={{ show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className = "",
  y = 18,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      className={className}
      variants={
        reduced
          ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
          : {
              hidden: { opacity: 0, y },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
            }
      }
    >
      {children}
    </motion.div>
  );
}
