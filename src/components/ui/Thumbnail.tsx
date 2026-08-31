"use client";

import { useState } from "react";
import { Placeholder } from "./Placeholder";

/* Miniatura projektu. Brak pliku → zaprojektowany placeholder zamiast dziury. */
export function Thumbnail({
  src,
  alt,
  label,
  index,
  aspect = "16/9",
  dense = false,
  priority = false,
}: {
  src: string;
  alt: string;
  label: string;
  index?: string;
  aspect?: "16/9" | "9/16";
  dense?: boolean;
  priority?: boolean;
}) {
  const [ok, setOk] = useState(true);

  return (
    <div
      className="relative w-full overflow-hidden rounded-[10px] bg-[var(--color-elevated)]"
      style={{ paddingBottom: aspect === "9/16" ? "177.78%" : "56.25%" }}
    >
      {!ok && <Placeholder label={label} index={index} dense={dense} />}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setOk(false)}
        className={`absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] ${
          ok ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* przyciemnienie pod przycisk odtwarzania */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
      <div className="pointer-events-none absolute inset-0 rounded-[10px] ring-1 ring-inset ring-white/[0.08]" />
    </div>
  );
}
