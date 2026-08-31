"use client";

import { useState } from "react";

/* Zdjęcie z zaprojektowanym stanem „brak pliku”. Podmień plik — reszta zniknie. */
export function Portrait({ src, alt, aspect = "4/5" }: { src: string; alt: string; aspect?: string }) {
  const [ok, setOk] = useState(true);
  const [w, h] = aspect.split("/").map(Number);

  return (
    <div
      className="relative w-full overflow-hidden rounded-[10px] bg-[var(--color-elevated)] ring-1 ring-inset ring-white/[0.06]"
      style={{ paddingBottom: `${(h / w) * 100}%` }}
    >
      {!ok && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" aria-hidden>
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.24em] text-white/35">
            portret
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--color-faint)]">
            /media/about/portret.jpg
          </span>
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setOk(false)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ok ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
