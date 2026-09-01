"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { VideoFrame } from "./VideoFrame";

/* =============================================================================
   PORÓWNANIE PRZED / PO
   Oba materiały grają jednocześnie, suwak odsłania jeden spod drugiego.
   Start jednym kliknięciem, od razu z dźwiękiem.

   Trzy decyzje, które trzymają płynność:
   1. Zegarem jest materiał Z DŹWIĘKIEM. Przeglądarka przy każdej zmianie tempa
      resynchronizuje audio z obrazem — to widać jako szarpanie. Dlatego tempo
      regulujemy na materiale niemym, gdzie jest niewyczuwalne.
   2. Nigdy nie przewijamy w trakcie odtwarzania — seek czyści bufor dekodera.
   3. Suwak nie przechodzi przez stan Reacta. Pozycję zapisujemy prosto w style
      elementu, raz na klatkę, więc ruch myszy nie wywołuje renderów.
   ========================================================================== */

const DRIFT_OK = 0.06; // poniżej tej różnicy nic nie robimy
const DRIFT_HARD = 0.6; // powyżej — tempem już tego nie nadrobimy

export function BeforeAfter({
  before,
  after,
  aspect = "16/9",
  hasAudio = false,
  label,
}: {
  before: { src: string; poster: string; label: string };
  after: { src: string; poster: string; label: string };
  aspect?: "16/9" | "9/16";
  hasAudio?: boolean;
  label: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const pendingRef = useRef(50);

  const [dragging, setDragging] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const [beforeEl, setBeforeEl] = useState<HTMLVideoElement | null>(null);
  const [afterEl, setAfterEl] = useState<HTMLVideoElement | null>(null);

  /* Materiał z dźwiękiem jest zegarem; drugi się do niego dostraja. */
  const master = hasAudio ? afterEl : beforeEl;
  const slave = hasAudio ? beforeEl : afterEl;

  /* — suwak: zapis prosto do stylu, bez renderów ————————————————— */
  const applyPos = useCallback(() => {
    rafRef.current = 0;
    const p = pendingRef.current;
    if (clipRef.current) clipRef.current.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
    if (handleRef.current) handleRef.current.style.left = `${p}%`;
  }, []);

  const moveTo = useCallback(
    (clientX: number) => {
      const rect = boxRef.current?.getBoundingClientRect();
      if (!rect) return;
      pendingRef.current = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
      if (!rafRef.current) rafRef.current = requestAnimationFrame(applyPos);
    },
    [applyPos]
  );

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  /* — wspólny zegar ————————————————————————————————————————————— */
  useEffect(() => {
    if (!master || !slave) return;

    const align = () => {
      if (master.readyState < 2 || slave.readyState < 2) return;

      if (!master.paused && slave.paused) slave.play().catch(() => {});
      if (master.paused && !slave.paused) slave.pause();
      if (master.paused) return;

      const diff = master.currentTime - slave.currentTime;
      const abs = Math.abs(diff);

      if (abs > DRIFT_HARD) {
        slave.currentTime = master.currentTime;
        slave.playbackRate = 1;
      } else if (abs > DRIFT_OK) {
        slave.playbackRate = diff > 0 ? 1.04 : 0.96;
      } else if (slave.playbackRate !== 1) {
        slave.playbackRate = 1;
      }
    };

    const onPlay = () => {
      slave.play().catch(() => {});
      setPlaying(true);
    };
    const onPause = () => {
      slave.pause();
      slave.playbackRate = 1;
      setPlaying(false);
    };
    const onEnded = () => {
      slave.pause();
      setPlaying(false);
    };

    master.addEventListener("play", onPlay);
    master.addEventListener("pause", onPause);
    master.addEventListener("ended", onEnded);
    const id = window.setInterval(align, 400);

    return () => {
      master.removeEventListener("play", onPlay);
      master.removeEventListener("pause", onPause);
      master.removeEventListener("ended", onEnded);
      window.clearInterval(id);
    };
  }, [master, slave]);

  /* — dźwięk tylko na materiale-zegarze —————————————————————————— */
  useEffect(() => {
    if (!master || !slave) return;
    slave.muted = true;
    master.muted = hasAudio ? muted : true;
  }, [muted, master, slave, hasAudio]);

  /* — start / stop ——————————————————————————————————————————————— */
  const toggle = useCallback(() => {
    if (!master || !slave) return;

    if (playing) {
      master.pause();
      slave.pause();
      return;
    }

    if (master.currentTime > 0.05 || slave.currentTime > 0.05) {
      master.currentTime = 0;
      slave.currentTime = 0;
    }
    slave.playbackRate = 1;
    slave.muted = true;

    if (hasAudio) {
      master.muted = false;
      master.volume = 1;
      setMuted(false);
    }

    master.play().catch(() => {});
    slave.play().catch(() => {});

    window.setTimeout(() => {
      if (!master.paused && slave.paused) slave.play().catch(() => {});
    }, 350);
  }, [master, slave, playing, hasAudio]);

  return (
    <div>
      <div
        ref={boxRef}
        role="group"
        aria-label={`${label} — porównanie before / after`}
        className="relative touch-pan-y select-none"
        onPointerMove={(e) => {
          if (e.pointerType === "mouse" || dragging) moveTo(e.clientX);
        }}
        onPointerDown={(e) => {
          setDragging(true);
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          moveTo(e.clientX);
        }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        {/* warstwa spodnia — widoczna po PRAWEJ stronie suwaka */}
        <VideoFrame
          ref={setBeforeEl}
          src={before.src}
          poster={before.poster}
          label={before.label}
          index="BEFORE"
          aspect={aspect}
          autoPlay={false}
          loop={false}
          preload="metadata"
        />

        {/* warstwa odsłaniana od LEWEJ */}
        <div
          ref={clipRef}
          className="absolute inset-0 overflow-hidden rounded-[10px]"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        >
          <VideoFrame
            ref={setAfterEl}
            src={after.src}
            poster={after.poster}
            label={after.label}
            index="AFTER"
            aspect={aspect}
            autoPlay={false}
            loop={false}
            preload="metadata"
          />
        </div>

        {/* uchwyt */}
        <div ref={handleRef} className="pointer-events-none absolute inset-y-0 z-20 w-px bg-white/70" style={{ left: "50%" }}>
          <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/50 backdrop-blur-sm">
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden>
              <path d="M6 1L2 5l4 4M12 1l4 4-4 4" stroke="white" strokeWidth="1.2" />
            </svg>
          </span>
        </div>

        {/* etykiety zgodne z tym, co faktycznie widać po danej stronie */}
        <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-full border border-white/15 bg-black/45 px-3 py-1 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.18em] text-white/70 backdrop-blur-sm">
          {after.label}
        </span>
        <span className="pointer-events-none absolute right-3 top-3 z-20 rounded-full border border-white/15 bg-black/45 px-3 py-1 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.18em] text-white/70 backdrop-blur-sm">
          {before.label}
        </span>

        {!playing && (
          <button
            type="button"
            onClick={toggle}
            aria-label="Odtwórz porównanie z dźwiękiem"
            className="group absolute inset-0 z-30 flex items-center justify-center bg-black/25 transition-colors duration-500 hover:bg-black/35"
          >
            <span className="flex items-center gap-3 rounded-full border border-white/25 bg-black/60 px-6 py-3.5 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-white/60 group-hover:bg-black/75">
              <svg width="11" height="13" viewBox="0 0 13 15" fill="none" aria-hidden>
                <path d="M12 7.5L0.75 14.4L0.75 0.6L12 7.5Z" fill="white" />
              </svg>
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-white/85">
                Odtwórz {hasAudio && "z dźwiękiem"}
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
          {playing ? "Pauza" : "Odtwórz razem"}
        </button>

        {hasAudio && (
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
        )}

        <span className="ml-auto hidden text-[0.78rem] text-[var(--color-faint)] sm:block">
          Przesuń suwak w trakcie odtwarzania
        </span>
      </div>
    </div>
  );
}
