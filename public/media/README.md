# /public/media — pliki do podmiany

Strona działa bez żadnego z tych plików: w miejscu brakującego materiału
renderuje się zaprojektowany placeholder (komponent `VideoFrame` → `Placeholder`).
Wrzucenie pliku o **dokładnie takiej nazwie i ścieżce** automatycznie podmienia
placeholder na materiał. Nie trzeba nic zmieniać w kodzie.

Ścieżki są zdefiniowane w `src/data/site.ts` — jeżeli wolisz inne nazwy,
zmień je tam (jedno miejsce).

---

## Stan obecny

| Slot | Plik | Uwaga |
|---|---|---|
| Hero showreel | `hero/showreel.mp4` | ✅ jest — **1024×576** (źródło było w tej rozdzielczości), warto podmienić na eksport 1920×1080 |
| Case study (sekcja 03) | `story/case-study.mp4` | ✅ jest — 720p, 29:51, 210 MB |
| Long form (sekcja 02) | — | odtwarzane z YouTube (`youtubeId` w `site.ts`), lokalnie tylko miniatury `.jpg` |
| Short form (sekcja 02) | `work/short-1…10.mp4` | ✅ jest — 720×1280, z dźwiękiem. `short-7…10` to materiały poziome wpisane w kadr pionowy z czarnymi pasami |
| Rzemiosło (04) | `craft/masking-*.mp4`, `craft/napisy.mp4`, `craft/storytelling.mp4` | ✅ maskowanie cięć (suwak) i napisy. Sound design korzysta z `hero/showreel.mp4`, Motion & Animation z `ae/storytelling.mp4`, a Smooth zoomy z `work/short-5.mp4` — podmiana tamtych plików zmieni też te pozycje |
| After Effects (05) | `ae/*.mp4` | ✅ komplet: motion graphics, tracked graphics, storytelling, custom animations |
| Millow (07) | `millow/millow.mp4` | ✅ nagranie panelu, 654×368, z dźwiękiem |
| Portret (06) | `about/portret.jpg` | ✅ 1200×1500, delikatnie rozjaśniony (gamma 1,4). Nietknięty kadr leży obok jako `portret-oryginal.jpg` — żeby wrócić do oryginału, wystarczy podmienić nazwy |

---

## Zasady ogólne dla wszystkich video

| Parametr | Rekomendacja |
|---|---|
| Kontener / kodek | **MP4 / H.264 (High), yuv420p** — `-pix_fmt yuv420p` jest obowiązkowe (bez tego Safari nie odtworzy) |
| Opcjonalnie dodatkowo | WebM / VP9 lub MP4 / HEVC — patrz „Wiele formatów” niżej |
| Klatkaż | 24 lub 30 fps (nie ma potrzeby 60 fps w loopach) |
| Audio | **usuń ścieżkę audio** (`-an`) wszędzie poza plikami oznaczonymi „audio: TAK” |
| Długość loopów | 6–12 s (loop w tle) |
| `faststart` | zawsze: `-movflags +faststart` (start odtwarzania bez pobrania całości) |

### Uniwersalna komenda ffmpeg (loop bez dźwięku, 1080p)

```bash
ffmpeg -i input.mov -an -vf "scale=1920:-2" -c:v libx264 -profile:v high -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart output.mp4
```

### Wersja z dźwiękiem (showreel, sound design)

```bash
ffmpeg -i input.mov -vf "scale=1920:-2" -c:v libx264 -crf 21 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart output.mp4
```

### Poster (pierwsza klatka jako .jpg)

```bash
ffmpeg -i output.mp4 -ss 00:00:01 -vframes 1 -q:v 3 output.jpg
```

---

## Lista plików

### `hero/` — showreel (jedyny materiał ładowany priorytetowo)

| Plik | Proporcje | Rozdzielczość | Audio | Maks. rozmiar |
|---|---|---|---|---|
| `showreel.mp4` | 16:9 | 1920×1080 (min. 1280×720) | **TAK** (startuje wyciszony, przycisk włącza) | **8 MB** |
| `showreel.jpg` | 16:9 | 1920×1080 | — | 250 KB |

> To jedyny plik z `preload="auto"`. Trzymaj go możliwie lekkiego — on decyduje
> o odczuciu szybkości całej strony. 20–40 s dobrze zmontowanego reelu wystarczy.

### `work/` — realizacje

Long form (16:9, **1280×720**, bez audio, pętla 8–12 s, do **4 MB**):
`islandia.mp4` · `24h.mp4` · `tokio.mp4` · `vlog.mp4`

Short form (9:16, **720×1280**, bez audio, pętla 6–10 s, do **3 MB**):
`short-alpy.mp4` · `short-reakcja.mp4` · `short-transition.mp4` · `short-podcast.mp4`

Do każdego pliku `.mp4` dodaj `.jpg` o tej samej nazwie (poster, ta sama rozdzielczość, do 200 KB).

> Te materiały odtwarzają się **po najechaniu kursorem**, a po kliknięciu otwiera
> się pełny odtwarzacz (`Lightbox`) — tam ma sens dłuższy materiał z dźwiękiem.
> Jeżeli chcesz mieć osobny plik do lightboxa, dodaj go w `site.ts`.

### `craft/` — before / after (sekcja 04)

16:9, **1280×720**, bez audio (poza `sound-*`), 5–8 s, do **3 MB** każdy.
Pary muszą być **tym samym fragmentem materiału** — inaczej porównanie nie działa.

| Plik | Uwagi |
|---|---|
| `masking-before.mp4` / `masking-after.mp4` | ✅ są — suwak. **Oba pliki muszą mieć tę samą długość i ten sam fragment**, inaczej porównanie nie ma sensu. Audio tylko w `after` |
| `sound-before.mp4` / `sound-after.mp4` | **audio: TAK** w obu (to jest sedno tego przykładu) |
| `motion.mp4` | pojedynczy materiał, bez audio |
| `storytelling.mp4` | pojedynczy materiał, bez audio |
| `napisy.mp4` | **9:16**, 720×1280, bez audio |

Postery `.jpg` — tak jak wyżej, do każdego pliku.

### `ae/` — After Effects (sekcja 05)

16:9, **1280×720**, bez audio, 6–10 s, do **3 MB**:
`motion-graphics.mp4` · `tracked-graphics.mp4` · `compositing.mp4` · `custom-animations.mp4` (+ `.jpg`)

### `story/` — case study do sekcji 03

To jedyny materiał, po którym strona **przewija się do konkretnych sekund**
(`storytelling.chapters[].at`), więc musi to być pełny film, a nie loop.

| Plik | Proporcje | Rozdzielczość | Audio | Uwagi |
|---|---|---|---|---|
| `case-study.mp4` | 16:9 | 1280×720 | TAK | musi mieć `+faststart` — bez tego przeskoki do timestampów są wolne |
| `case-study.jpg` | 16:9 | 1920×1080 | — | poster |

> **Uwaga na rozmiar.** Pełny 30-minutowy film to ~200 MB nawet po kompresji.
> Lokalnie i na Vercelu zadziała, ale to dużo. Docelowo rozważ jedną z dwóch dróg:
> 1. **Condensed cut** — zmontuj 6 fragmentów (po ~15 s na etap) w jeden plik
>    2–3 minutowy i ustaw `at` na 0, 15, 30, 45, 60, 75. Waży ~15 MB, a sekcja
>    działa identycznie.
> 2. **Hosting zewnętrzny** — trzymaj plik na CDN / w Mux / Cloudflare Stream
>    i wstaw pełny URL w `storytelling.film.src`.

### `about/` — zdjęcie

| Plik | Proporcje | Rozdzielczość | Maks. |
|---|---|---|---|
| `portret.jpg` | 4:5 (pionowe) | 1200×1500 | 400 KB |

### `millow/` — mockup pluginu

| Plik | Proporcje | Rozdzielczość | Audio | Maks. |
|---|---|---|---|---|
| `millow.mp4` | 16:9 | 1920×1080 (screen recording panelu) | NIE | 4 MB |
| `millow.jpg` | 16:9 | 1920×1080 | — | 250 KB |

---

## Wiele formatów (opcjonalnie)

`VideoFrame` renderuje jeden `<source type="video/mp4">`. Jeżeli chcesz dodać
WebM/AV1 dla mniejszego rozmiaru, dołóż drugi `<source>` w
`src/components/ui/VideoFrame.tsx` **przed** istniejącym:

```tsx
<source src={src.replace(/\.mp4$/, ".webm")} type="video/webm" />
<source src={src} type="video/mp4" />
```

## Dlaczego w konsoli widać 404

Dopóki plików nie ma, przeglądarka zgłasza 404 na `/media/...` — to normalne.
Komponent przechwytuje błąd i zostawia placeholder. Po wrzuceniu plików 404 znikają.
