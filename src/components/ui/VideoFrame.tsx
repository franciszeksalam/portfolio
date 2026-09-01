"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Placeholder } from "./Placeholder";
import { usePrefersReducedMotion } from "@/lib/hooks";

/* -----------------------------------------------------------------------------
   VIDEO FRAME
   Jeden komponent do wszystkich materiałów na stronie.
   • ładuje plik dopiero gdy zbliża się do viewportu (lazy)
   • odtwarza tylko w widoku, poza nim pauzuje  (performance)
   • gdy pliku jeszcze nie ma — pokazuje zaprojektowany placeholder
   • szanuje prefers-reduced-motion (brak autoplay, przycisk odtwarzania)
   -------------------------------------------------------------------------- */

export type VideoFrameProps = {
  src: string;
  poster?: string;
  /** proporcje kadru */
  aspect?: "16/9" | "9/16" | "4/5" | "1/1" | "21/9";
  /** etykieta placeholdera */
  label: string;
  index?: string;
  autoPlay?: boolean;
  loop?: boolean;
  /** dźwięk dostępny — pokazuje przełącznik audio */
  hasAudio?: boolean;
  /** hero: ładuj od razu */
  priority?: boolean;
  /** ile buforować po zamontowaniu */
  preload?: "metadata" | "auto";
  className?: string;
  rounded?: boolean;
  /** odtwarzaj dopiero po najechaniu (siatki realizacji) */
  playOnHover?: boolean;
  dense?: boolean;
  /** wywoływane, gdy materiał jest gotowy do odtwarzania (np. do sterowania z zewnątrz) */
  onReady?: () => void;
};

const ASPECT: Record<string, string> = {
  "16/9": "56.25%",
  "9/16": "177.78%",
  "4/5": "125%",
  "1/1": "100%",
  "21/9": "42.85%",
};

export const VideoFrame = forwardRef<HTMLVideoElement, VideoFrameProps>(function VideoFrame(
  {
    src,
    poster,
    aspect = "16/9",
    label,
    index,
    autoPlay = true,
    loop = true,
    hasAudio = false,
    priority = false,
    preload,
    className = "",
    rounded = true,
    playOnHover = false,
    dense = false,
    onReady,
  },
  ref
) {
  const holderRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [failed, setFailed] = useState(false);
  const [muted, setMuted] = useState(true);
  const mutedRef = useRef(true);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const reduced = usePrefersReducedMotion();

  /* Ref łączony: rodzic dostaje element dokładnie w momencie, w którym powstaje
     (element montuje się dopiero po wejściu w viewport — useImperativeHandle
     z pustymi zależnościami zapisałby tu na stałe null). */
  const setRefs = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node;
      // React nie stosuje niezawodnie propa `muted` — ustawiamy w momencie montażu
      if (node) node.muted = mutedRef.current;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLVideoElement | null>).current = node;
    },
    [ref]
  );

  /* — dwa obserwatory o różnych zasięgach ————————————————————————
     Ładowanie startuje z wyprzedzeniem 300 px, żeby materiał był gotowy zanim
     wjedzie na ekran. Ale ODTWARZANIE dopiero wtedy, gdy naprawdę widać kadr —
     inaczej telefon dekoduje kilka filmów naraz, w tym takie, których nikt
     jeszcze nie widzi, i przewijanie zaczyna szarpać.

     Obserwator nie woła play() bezpośrednio: przy pierwszym przecięciu element
     <video> jeszcze nie istnieje. Trzyma stan, a odtwarzaniem zajmuje się efekt
     poniżej, uruchamiany już po zamontowaniu. */
  useEffect(() => {
    const el = holderRef.current;
    if (!el) return;

    const ladowanie = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setShouldLoad(true);
      },
      { rootMargin: "300px 0px" }
    );
    // próg 0: gra wszystko, co dotknęło ekranu. Ostrzejszy próg bywa niepewny
    // przy szybkim przewijaniu i zdarza się, że materiał zostaje zatrzymany.
    const odtwarzanie = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "0px",
      threshold: 0,
    });

    ladowanie.observe(el);
    odtwarzanie.observe(el);
    return () => {
      ladowanie.disconnect();
      odtwarzanie.disconnect();
    };
  }, []);

  /* — odtwarzanie ————————————————————————————————————————————————
     Nie polegamy wyłącznie na obserwatorze. Gdy materiał się montuje, sprawdzamy
     położenie kadru bezpośrednio — obserwator potrafi nie zgłosić pierwszego
     przecięcia, a to właśnie ono decyduje, czy film ruszy przy pierwszym
     wejściu w sekcję. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!autoPlay || reduced || playOnHover) return;

    const wKadrze = () => {
      if (inView) return true;
      const el = holderRef.current;
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < (window.innerHeight || 0) && r.width > 0;
    };

    if (wKadrze()) {
      v.play().catch(() => {});
    } else if (!v.paused) {
      v.pause();
    }
  }, [inView, shouldLoad, ready, autoPlay, reduced, playOnHover]);

  /* — materiał nieaktywny (np. druga strona przełącznika) ma stać ——— */
  useEffect(() => {
    if (autoPlay) return;
    const v = videoRef.current;
    if (v && !v.paused) v.pause();
  }, [autoPlay]);

  /* — hover preview ——————————————————————————————————————————————— */
  useEffect(() => {
    if (!playOnHover) return;
    const v = videoRef.current;
    if (!v) return;
    if (hovered && !reduced) v.play().catch(() => {});
    else {
      v.pause();
      if (!hovered) v.currentTime = 0;
    }
  }, [hovered, playOnHover, reduced]);

  const toggleAudio = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) v.play().catch(() => {});
    setMuted(v.muted);
  };

  return (
    <div
      ref={holderRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative w-full overflow-hidden bg-[var(--color-elevated)] ${
        rounded ? "rounded-[10px]" : ""
      } ${className}`}
      style={{ paddingBottom: ASPECT[aspect] }}
    >
      <Placeholder label={label} index={index} dense={dense} />

      {shouldLoad && !failed && (
        <video
          ref={setRefs}
          className="absolute inset-0 h-full w-full object-cover"
          poster={poster}
          muted={muted}
          loop={loop}
          playsInline
          preload={preload ?? (priority ? "auto" : "metadata")}
          onCanPlay={() => {
            setReady(true);
            onReady?.();
          }}
          onError={() => setFailed(true)}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* subtelna ramka nad materiałem */}
      <div
        className={`pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.06] ${
          rounded ? "rounded-[10px]" : ""
        }`}
      />

      {hasAudio && shouldLoad && !failed && (
        <button
          type="button"
          onClick={toggleAudio}
          aria-label={muted ? "Włącz dźwięk" : "Wycisz"}
          className="absolute bottom-3 right-3 z-10 flex h-9 items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 backdrop-blur-sm transition-colors hover:border-white/35"
        >
          <span className="flex h-3 items-end gap-[2px]">
            {[6, 11, 8].map((h, i) => (
              <span
                key={i}
                className={`w-[2px] bg-white transition-all duration-300 ${
                  muted ? "!h-[3px] opacity-40" : "opacity-90"
                }`}
                style={{ height: h }}
              />
            ))}
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-white/70">
            {muted ? "dźwięk" : "on"}
          </span>
        </button>
      )}
    </div>
  );
});
