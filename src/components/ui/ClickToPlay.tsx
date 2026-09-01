"use client";

import { useCallback, useEffect, useState } from "react";
import { VideoFrame } from "./VideoFrame";

/* Materiał, którego sensem jest DŹWIĘK.
   Stoi na posterze, dopóki użytkownik nie kliknie — wtedy startuje od początku
   z włączonym dźwiękiem. Autostart z audio i tak byłby zablokowany przez
   przeglądarkę, a poza tym nikt nie chce, żeby strona zaczęła grać sama. */
export function ClickToPlay({
  src,
  poster,
  label,
  aspect = "16/9",
  index,
}: {
  src: string;
  poster: string;
  label: string;
  aspect?: "16/9" | "9/16";
  index?: string;
}) {
  const [el, setEl] = useState<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (!el) return;
    const onPlay = () => setPlaying(true);
    const onStop = () => setPlaying(false);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onStop);
    el.addEventListener("ended", onStop);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onStop);
      el.removeEventListener("ended", onStop);
    };
  }, [el]);

  useEffect(() => {
    if (el) el.muted = muted;
  }, [muted, el]);

  const toggle = useCallback(() => {
    if (!el) return;
    if (playing) {
      el.pause();
      return;
    }
    if (el.currentTime > 0.05) el.currentTime = 0;
    el.muted = false;
    el.volume = 1;
    setMuted(false);
    el.play().catch(() => {});
  }, [el, playing]);

  return (
    <div>
      <div className="relative">
        <VideoFrame
          ref={setEl}
          src={src}
          poster={poster}
          label={label}
          index={index}
          aspect={aspect}
          autoPlay={false}
          loop={false}
          preload="metadata"
        />

        {!playing && (
          <button
            type="button"
            onClick={toggle}
            aria-label="Odtwórz z dźwiękiem"
            className="group absolute inset-0 z-20 flex items-center justify-center bg-black/25 transition-colors duration-500 hover:bg-black/35"
          >
            <span className="flex items-center gap-3 rounded-full border border-white/25 bg-black/60 px-6 py-3.5 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-white/60 group-hover:bg-black/75">
              <svg width="11" height="13" viewBox="0 0 13 15" fill="none" aria-hidden>
                <path d="M12 7.5L0.75 14.4L0.75 0.6L12 7.5Z" fill="white" />
              </svg>
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-white/85">
                Odtwórz z dźwiękiem
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className="flex items-center gap-2.5 rounded-full border border-[var(--color-line)] px-4 py-2 text-[0.82rem] text-[var(--color-muted)] transition-colors duration-300 hover:border-white/30 hover:text-[var(--color-ink)]"
        >
          {playing ? (
            <span className="flex h-[11px] w-[9px] items-center justify-between" aria-hidden>
              <span className="h-full w-[3px] bg-current" />
              <span className="h-full w-[3px] bg-current" />
            </span>
          ) : (
            <svg width="9" height="11" viewBox="0 0 13 15" fill="none" aria-hidden>
              <path d="M12 7.5L0.75 14.4L0.75 0.6L12 7.5Z" fill="currentColor" />
            </svg>
          )}
          {playing ? "Pauza" : "Odtwórz"}
        </button>

        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-pressed={!muted}
          className="flex items-center gap-2.5 rounded-full border border-[var(--color-line)] px-4 py-2 text-[0.82rem] text-[var(--color-muted)] transition-colors duration-300 hover:border-white/30 hover:text-[var(--color-ink)]"
        >
          <span className="flex h-3 items-end gap-[2px]" aria-hidden>
            {[6, 11, 8].map((h, i) => (
              <span
                key={i}
                className={`w-[2px] bg-current transition-all duration-300 ${muted ? "!h-[3px] opacity-40" : ""}`}
                style={{ height: h }}
              />
            ))}
          </span>
          {muted ? "Dźwięk" : "Wycisz"}
        </button>
      </div>
    </div>
  );
}
