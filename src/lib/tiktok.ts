/* =============================================================================
   TikTok Pixel — typy i jedyne wejście do trackingu
   Cała logika zdarzeń siedzi tutaj, żeby nie rozpełzła się po komponentach.
   ========================================================================== */

/** Identyfikator jest publiczny z natury — widać go w kodzie każdej strony. */
export const TIKTOK_PIXEL_ID =
  process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "DAB8RUBC77U2FG640NI0";

/** Oficjalne zdarzenia standardowe TikToka używane na tej stronie.
    „Lead" to zdarzenie konwersji wygenerowane w Events Managerze dla formularza
    kontaktowego, „Contact" opisuje kliknięcie w CTA prowadzące do formularza. */
export type TikTokEvent = "Lead" | "Contact";

type TikTokQueue = {
  page: () => void;
  track: (event: string, parameters?: Record<string, unknown>) => void;
  holdConsent: () => void;
  grantConsent: () => void;
  revokeConsent: () => void;
};

declare global {
  interface Window {
    ttq?: TikTokQueue;
  }
}

/** Na produkcji wysyłamy realne zdarzenia, lokalnie tylko je wypisujemy. */
export const trackingAktywny = process.env.NODE_ENV === "production";

/**
 * Tryb zgody (RODO / ePrivacy).
 *
 * false — pixel zbiera dane od razu po wejściu na stronę (stan obecny).
 * true  — pixel wstrzymuje zbieranie do momentu wywołania `grantTikTokConsent()`,
 *         czyli do kliknięcia „Akceptuję" w banerze zgód.
 *
 * Pixel ustawia ciasteczko `_ttp` (identyfikator reklamowy śledzący między
 * witrynami), więc w UE wymaga UPRZEDNIEJ zgody. Przełączenie na `true` bez
 * dodania banera po prostu wyłączy tracking — samo w sobie nic nie zepsuje.
 */
export const WYMAGAJ_ZGODY = false;

/** Wywołaj po uzyskaniu zgody marketingowej od użytkownika. */
export function grantTikTokConsent(): void {
  try {
    window.ttq?.grantConsent();
  } catch {}
}

/** Wywołaj przy wycofaniu zgody. */
export function revokeTikTokConsent(): void {
  try {
    window.ttq?.revokeConsent();
  } catch {}
}

/**
 * Wysyła zdarzenie do TikTok Pixela.
 * Nie rzuca wyjątkami: brak pixela, adblock albo błąd SDK nie mogą
 * przerwać działania strony ani formularza.
 */
export function trackTikTokEvent(
  event: TikTokEvent,
  parameters?: Record<string, unknown>
): void {
  if (!trackingAktywny) {
    if (process.env.NODE_ENV === "development") {
      console.info(`[TikTok Pixel] (dev, nie wysłano) ${event}`, parameters ?? "");
    }
    return;
  }

  try {
    window.ttq?.track(event, parameters);
  } catch {
    /* tracking jest warstwą dodatkową — cisza jest tu właściwą reakcją */
  }
}

/* -----------------------------------------------------------------------------
   Konwersja: wysłany formularz kontaktowy
   -------------------------------------------------------------------------- */

/** Zapora przed podwójnym zliczeniem. Flaga żyje w module, więc przetrwa
    ponowne renderowanie komponentu i podwójne wywołanie efektów w React Strict
    Mode. Jedna faktyczna wysyłka formularza = jeden Lead. */
let leadJuzWyslany = false;

/**
 * Zgłasza konwersję po POTWIERDZONYM przyjęciu zgłoszenia przez API.
 * Bez danych osobowych: żadnego e-maila, telefonu ani identyfikatorów.
 */
export function trackTikTokLead(): void {
  if (leadJuzWyslany) return;
  leadJuzWyslany = true;
  trackTikTokEvent("Lead", {});
}
