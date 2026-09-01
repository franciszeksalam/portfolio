"use client";

import { useEffect } from "react";
import Script from "next/script";
import { TIKTOK_PIXEL_ID, WYMAGAJ_ZGODY, trackTikTokEvent, trackingAktywny } from "@/lib/tiktok";

/* =============================================================================
   TikTok Pixel — ładowany raz, globalnie.

   PageView: bazowy kod wywołuje `ttq.page()` przy starcie. Strona ma jedną
   trasę i nie korzysta z nawigacji klienckiej między podstronami, więc
   zdarzenie odpala się dokładnie raz na wejście. `next/script` z ustalonym
   `id` gwarantuje, że skrypt nie wstrzyknie się dwa razy.
   ========================================================================== */

const baseCode = `!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

${WYMAGAJ_ZGODY ? "ttq.holdConsent();" : ""}
ttq.load('${TIKTOK_PIXEL_ID}');
ttq.page();
}(window, document, 'ttq');`;

export function TikTokPixel() {
  /* Kliknięcie w CTA prowadzące do formularza = „Contact".
     Jeden nasłuch na dokumencie zamiast obsługi rozsianej po przyciskach.
     Liczy się raz na wejście, żeby nie zawyżać liczby zdarzeń. */
  useEffect(() => {
    let zgloszone = false;

    const onClick = (e: MouseEvent) => {
      if (zgloszone) return;
      const cel = (e.target as HTMLElement | null)?.closest?.('a[href="#contact"]');
      if (!cel) return;
      zgloszone = true;
      trackTikTokEvent("Contact");
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  /* Lokalnie nie ładujemy pixela w ogóle — produkcyjne statystyki zostają czyste. */
  if (!trackingAktywny) return null;

  return (
    <Script
      id="tiktok-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: baseCode }}
    />
  );
}
