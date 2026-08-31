"use client";

/* -----------------------------------------------------------------------------
   PLACEHOLDER
   Abstrakcyjny, deterministyczny wizual pokazywany dopóki nie ma pliku video
   (albo dopóki się nie załaduje). Nie jest to „broken image” — to zaprojektowana
   klatka: numer, timeline, znaczniki klatek. Po wrzuceniu pliku znika sam.
   -------------------------------------------------------------------------- */

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function Placeholder({
  label,
  index,
  dense = false,
}: {
  label: string;
  index?: string;
  dense?: boolean;
}) {
  const h = hash(label);
  const bars = Array.from({ length: dense ? 18 : 34 }, (_, i) => {
    const n = (h >> (i % 12)) % 100;
    return 18 + ((n * 7 + i * 13) % 70);
  });
  const clipStops = [0.14, 0.37, 0.63, 0.86].map((p, i) => p + ((h >> i) % 7) / 100);

  return (
    <div
      aria-hidden
      className="absolute inset-0 select-none overflow-hidden bg-[var(--color-elevated)]"
    >
      {/* siatka klatek */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.045) 1px, transparent 1px)",
          backgroundSize: `${dense ? 28 : 46}px 100%`,
        }}
      />
      {/* delikatna winieta zamiast gradientu-ozdoby */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 45%, rgba(255,255,255,.045), transparent 70%)",
        }}
      />

      {/* pasek warstw / klipów u góry */}
      <div className="absolute inset-x-0 top-0 flex h-[3px] gap-[2px] px-3 pt-3">
        {clipStops.map((p, i) => (
          <div
            key={i}
            className="h-full bg-white/[0.13]"
            style={{ flex: `${Math.round(p * 100)} 0 0%` }}
          />
        ))}
      </div>

      {/* waveform */}
      <div className="absolute inset-x-0 bottom-0 flex h-14 items-end gap-[2px] px-3 pb-3 opacity-30">
        {bars.map((b, i) => (
          <div key={i} className="flex-1 bg-white/25" style={{ height: `${b}%` }} />
        ))}
      </div>

      {/* centrum: numer + etykieta */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        {index && (
          <span
            className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[var(--color-faint)]"
          >
            {index}
          </span>
        )}
        <span className="max-w-[80%] text-[clamp(0.7rem,1.4vw,0.9rem)] font-[family-name:var(--font-mono)] uppercase tracking-[0.18em] text-white/40">
          {label}
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.24em] text-[var(--color-faint)]">
          placeholder
        </span>
      </div>

      {/* narożniki — znaczniki kadru */}
      {[
        "left-3 top-3 border-l border-t",
        "right-3 top-3 border-r border-t",
        "left-3 bottom-3 border-b border-l",
        "right-3 bottom-3 border-b border-r",
      ].map((c, i) => (
        <span key={i} className={`absolute h-3 w-3 border-white/20 ${c}`} />
      ))}
    </div>
  );
}
