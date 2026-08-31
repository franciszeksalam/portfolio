# Portfolio montażysty — Patryk Grabowski

Premium, jednostronicowe portfolio zbudowane pod jeden cel: **sprzedawać montaż
twórcom internetowym**. Nie jest to galeria prac — to ścieżka prowadząca widza
od „wow” przez kompetencje i dowód, aż do oferty i kontaktu.

Stack: **Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Lenis**

---

## Start

```bash
npm install
```

```bash
npm run dev
```

Strona: http://localhost:3000 · build produkcyjny: `npm run build && npm start`

---

## Gdzie się co edytuje

**Cała treść siedzi w jednym pliku: [`src/data/site.ts`](src/data/site.ts).**
Komponenty nie zawierają tekstów ani ścieżek — tylko układ i animacje.

| Chcę zmienić… | Sekcja w `site.ts` |
|---|---|
| e-mail, social media, lokalizacja, link do Millow | `site` |
| tekst intro i CTA wejściowe | `intro` |
| nagłówek hero, opis, statystyki, plik showreelu | `hero` |
| realizacje (dodawanie / usuwanie / kolejność) | `projects` |
| etapy historii + **timestampy filmu** | `storytelling.chapters` |
| umiejętności before/after | `craft.items` |
| przykłady After Effects | `afterEffects.items` |
| tekst „O mnie”, zdjęcie, fakty | `about` |
| sekcja Millow | `millow` |
| **CENY** | `pricing` |
| kroki procesu | `process` |
| formularz, opcje „czego potrzebujesz”, endpoint | `contact` |
| pozycje menu | `nav` |

### Ceny

Wszystkie kwoty są stringami w `pricing` — zmieniasz je w jednym miejscu:

```ts
oneOff:  [{ id: "long-form", price: "1 200", ... }, { id: "short-form", price: "250", ... }]
retainer.plans: [{ id: "creator", price: "4 400", ... }, ...]
```

`currency` też jest w `pricing`. Żadna cena nie występuje w komponentach.

### Formularz kontaktowy (Resend)

Formularz wysyła zgłoszenia przez własny API route (`/api/kontakt`) do Resend,
a stamtąd na **patgrabowski11@gmail.com**. Klucz API żyje wyłącznie na serwerze —
nigdy nie trafia do przeglądarki.

**1. Konto i klucz**

Załóż konto na [resend.com](https://resend.com), wejdź w **API Keys → Create API Key**
(uprawnienie *Sending access* wystarczy) i skopiuj klucz — pokazuje się tylko raz.

**2. Gdzie wkleić klucz**

Utwórz plik `.env.local` w katalogu projektu (jest w `.gitignore`, nie trafi do repo):

```bash
cp .env.example .env.local
```

Następnie wklej klucz w miejsce `re_xxxxxxxx`.

**3. Zmienne środowiskowe**

| Zmienna | Wymagana | Znaczenie |
|---|---|---|
| `RESEND_API_KEY` | tak | klucz z Resend |
| `MAIL_FROM` | nie | nadawca; domyślnie `Portfolio <onboarding@resend.dev>` |
| `CONTACT_TO` | nie | odbiorca; domyślnie adres z `site.ts` |

**4. Adres odbiorcy**

Ustawiony w [`src/data/site.ts`](src/data/site.ts) jako `contact.recipient`
(`patgrabowski11@gmail.com`). Zmienna `CONTACT_TO` ma nad nim pierwszeństwo, więc
adres da się nadpisać na produkcji bez zmiany kodu. `Reply-To` ustawiane jest na
adres wpisany przez klienta — odpowiadasz zwykłym „Odpowiedz”.

**5. Czy potrzebna jest weryfikacja domeny**

Do startu **nie**. Adres `onboarding@resend.dev` działa od razu, ale ma jedno
ograniczenie: Resend wyśle wiadomość **wyłącznie na adres właściciela konta**.
Jeżeli konto Resend założysz na `patgrabowski11@gmail.com`, wszystko zadziała.

Weryfikacja domeny (Resend → **Domains**, wpisy DNS: SPF, DKIM) jest potrzebna, gdy
chcesz wysyłać z własnego adresu, np. `kontakt@twojadomena.pl` — wtedy wiadomości
rzadziej lądują w spamie i wyglądają profesjonalniej. Po weryfikacji podmień
`MAIL_FROM`.

**6. Test lokalny**

```bash
npm run dev
```

Wypełnij formularz na `localhost:3000/#contact` i wyślij. Odpowiedzi API:

| Kod | Znaczenie |
|---|---|
| 200 | wysłane (albo zgłoszenie odrzucone jako spam — celowo bez informacji dla bota) |
| 422 | błędy walidacji, zwracane per pole |
| 429 | limit 5 zgłoszeń na 10 minut z jednego IP |
| 500 | brak `RESEND_API_KEY` — sprawdź konsolę serwera |
| 502 | Resend odrzucił wysyłkę (najczęściej zły klucz) |

Sam endpoint sprawdzisz bez klikania:

```bash
curl -i -X POST http://localhost:3000/api/kontakt -H "Content-Type: application/json" -d '{"name":"Test","email":"test@example.com","message":"wiadomość testowa","need":"Custom","elapsed":9000}'
```

**7. Test po wdrożeniu**

Na Vercelu dodaj te same zmienne w **Project → Settings → Environment Variables**
(Production i Preview), a potem **zrób redeploy** — zmienne wczytują się przy
buildzie. Wyślij testowe zgłoszenie z prawdziwego adresu i sprawdź:
czy wiadomość przyszła, czy temat ma format `Nowy lead — imię — plan`, czy
„Odpowiedz” podstawia adres klienta. Logi wysyłek są w panelu Resend w zakładce
**Emails**.

> **Uwaga o limicie zapytań:** licznik trzymany jest w pamięci procesu. Przy
> serverless każda instancja ma własny — to zapora na proste boty, nie na
> zdeterminowany atak. Jeśli kiedyś okaże się za słaba, właściwym krokiem jest
> licznik w Redis (np. Upstash), a nie CAPTCHA.

---

## Materiały video

Wszystko opisane w **[`public/media/README.md`](public/media/README.md)**:
jaki plik, jakie proporcje, rozdzielczość, kodek, czy z dźwiękiem, maks. rozmiar
i gotowe komendy `ffmpeg`.

Showreel z `public/media/hero/showreel.mp4` leci jako **przygaszone tło hero**
(opacity 0.22 + przyciemnienie), a nie jako osobny odtwarzacz.

W repo jest też podpięty `public/media/story/case-study.mp4`
(sekcja 03) — wersja webowa 720p wygenerowana z mastera 4K. Timestampy etapów
w `storytelling.chapters` są rozstawione na jego długości (29:51) i trzeba je
ustawić pod prawdziwe punkty zwrotne filmu.

Zasada: **strona działa bez plików**. Brakujący materiał = zaprojektowany
placeholder (timeline + waveform + typografia), a nie dziura w layoucie.
Wrzucasz plik pod właściwą ścieżkę → placeholder znika sam.

---

## Struktura

```
src/
  app/
    layout.tsx        fonty, metadata, blokujący skrypt „intro widziane”
    page.tsx          kolejność sekcji = flow strony
    globals.css       design system (tokeny, utilities, reduced motion)
  data/site.ts        CAŁA treść
  components/
    layout/           nawigacja z paskiem postępu, smooth scroll
    sections/         01–10, jeden plik na sekcję
    ui/               VideoFrame, Placeholder, BeforeAfter, Lightbox, Reveal…
  lib/hooks.ts        prefers-reduced-motion, media query
public/media/         materiały (patrz README tam)
```

### Sekcje

| # | Sekcja | Plik |
|---|---|---|
| 01 | Hero — showreel w tle | `sections/Hero.tsx` |
| 02 | Realizacje + filtry + lightbox | `sections/Work.tsx` |
| 03 | Storytelling (sticky player, scroll → timestamp) | `sections/Storytelling.tsx` |
| 04 | Co trafia do Twojego filmu (before/after) | `sections/Craft.tsx` |
| 05 | After Effects | `sections/AfterEffects.tsx` |
| 06 | O mnie | `sections/About.tsx` |
| 07 | Millow | `sections/Millow.tsx` |
| 08 | Współpraca / ceny | `sections/Pricing.tsx` |
| 09 | Proces | `sections/Process.tsx` |
| 10 | Kontakt + stopka | `sections/Contact.tsx` |

---


## Design system

Tokeny w `src/app/globals.css` (`@theme`):

* tła `--color-void / base / elevated / surface`
* tekst `--color-ink / muted / faint`
* akcent `--color-accent: #f04e23` — **tylko** playhead, aktywny stan, numery
  rozdziałów, focus. Nigdy jako tło większej płaszczyzny.
* linie `--color-line` (1px, zamiast cieni)
* typografia: Inter Tight (nagłówki) · Inter (tekst) · JetBrains Mono (timecody,
  etykiety) — mono jest nośnikiem „montażowej” tożsamości
* jeden easing: `cubic-bezier(0.16, 1, 0.3, 1)`

Utilities: `container-x`, `display-xl/lg/md`, `label`, `timecode`, `hairline`, `grain`.

---

## Performance

* `VideoFrame` ładuje plik dopiero ~300 px przed wejściem w viewport
  (`IntersectionObserver`), a poza viewportem **pauzuje** odtwarzanie.
* Materiały w realizacjach startują dopiero po najechaniu (`playOnHover`).
* `preload="auto"` ma wyłącznie showreel; reszta `metadata`.
* Wszystkie animacje działają na `transform` i `opacity`.
* Smooth scroll (Lenis) jest wyłączony na urządzeniach dotykowych i przy
  `prefers-reduced-motion` — natywny scroll jest tam lepszy i tańszy.
* Brak zewnętrznych bibliotek UI, ikon i obrazków — ikony są inline SVG.

Największy wpływ na wynik Lighthouse będą miały **Twoje pliki video**.
Trzymaj się limitów rozmiaru z `public/media/README.md`.

---

## Deploy

Projekt jest w pełni statyczny (`○ Static` w outpucie builda) — działa na Vercel
bez konfiguracji. `npm run build` → deploy. Przy hostingu statycznym pamiętaj o
poprawnym `Content-Type` i `Range` dla plików `.mp4`.
