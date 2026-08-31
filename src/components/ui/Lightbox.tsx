"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Placeholder } from "./Placeholder";

export type LightboxItem = {
  title: string;
  meta?: string;
  /** film z YouTube — ma pierwszeństwo przed `src` */
  youtubeId?: string;
  src?: string;
  poster?: string;
  aspect?: "16/9" | "9/16";
} | null;

/* Odtwarzacz pełnoekranowy — jedyne miejsce, gdzie video startuje z dźwiękiem. */
export function Lightbox({ item, onClose }: { item: LightboxItem; onClose: () => void }) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.dataset.locked = "true";
    return () => {
      window.removeEventListener("keydown", onKey);
      delete document.body.dataset.locked;
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 px-[var(--gutter)] backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className={`relative w-full ${item.aspect === "9/16" ? "max-w-[min(420px,92vw)]" : "max-w-[min(1180px,92vw)]"}`}
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-end justify-between gap-6">
              <div>
                <p className="text-[1.05rem] font-medium tracking-[-0.02em]">{item.title}</p>
                {item.meta && <p className="label mt-1">{item.meta}</p>}
              </div>
              <button type="button" onClick={onClose} className="label transition-colors hover:text-[var(--color-ink)]">
                Zamknij (esc)
              </button>
            </div>

            <div
              className="relative w-full overflow-hidden rounded-[10px] bg-[var(--color-elevated)]"
              style={{ paddingBottom: item.aspect === "9/16" ? "177.78%" : "56.25%" }}
            >
              {item.youtubeId ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <>
                  <Placeholder label={item.title} index="ODTWARZANIE" />
                  <video
                    className="absolute inset-0 h-full w-full object-cover"
                    src={item.src}
                    poster={item.poster}
                    controls
                    autoPlay
                    playsInline
                  />
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
