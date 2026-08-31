"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/* Główne CTA — wypełniony pill z przesuwającą się strzałką. */
export function Cta({
  href,
  children,
  variant = "primary",
  className = "",
  onClick,
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  onClick?: () => void;
  external?: boolean;
}) {
  const base =
    "group relative inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-[0.9rem] font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]";
  const styles =
    variant === "primary"
      ? "bg-[var(--color-ink)] text-[var(--color-void)] hover:bg-white"
      : "border border-[var(--color-line-strong)] text-[var(--color-ink)] hover:border-white/40 hover:bg-white/[0.04]";

  const props = external ? { target: "_blank", rel: "noopener noreferrer" as const } : {};

  return (
    <Link href={href} onClick={onClick} {...props} className={`${base} ${styles} ${className}`}>
      <span>{children}</span>
      <svg
        width="14"
        height="10"
        viewBox="0 0 14 10"
        fill="none"
        className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
        aria-hidden
      >
        <path d="M9 1L13 5L9 9M13 5H0" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    </Link>
  );
}

/* Link tekstowy z podkreśleniem wjeżdżającym od lewej. */
export function TextLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group relative inline-flex items-center gap-2 text-[var(--color-ink)]"
    >
      <span>{children}</span>
      <svg width="12" height="9" viewBox="0 0 14 10" fill="none" aria-hidden
        className="translate-y-px transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
        <path d="M9 1L13 5L9 9M13 5H0" stroke="currentColor" strokeWidth="1.3" />
      </svg>
      <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100" />
    </a>
  );
}
