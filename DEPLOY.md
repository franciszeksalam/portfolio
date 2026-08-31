# Wdrożenie na patrynciomovement.com

Hosting: **Vercel** (twórcy Next.js, darmowy plan wystarcza).
Domena: **home.pl** — tam zmieniasz tylko dwa wpisy DNS.

Czas: około 30 minut, z czego 20 to czekanie na DNS.

---

## Zanim zaczniesz — jedna decyzja

Film w sekcji „Storytelling" (`case-study.mp4`) waży **210 MB**. To jedyny plik,
który wymaga uwagi.

**Droga A — spróbuj wysłać go razem ze stroną.** Nic nie konfigurujesz, plik leci
z resztą projektu przy `vercel deploy`. Zacznij od tego. Jeśli Vercel go
przyjmie — temat zamknięty.

**Droga B — jeśli Vercel odmówi albo strona zacznie zjadać transfer.** Film ląduje
na zewnętrznym hostingu, a w kodzie zmienia się jedna linijka. Instrukcja na
końcu tego pliku.

Plik jest celowo **poza repozytorium git** (GitHub odrzuca pliki > 100 MB), ale
leży na dysku i `vercel deploy` go wyśle.

---

## 1. Konto i logowanie

1. Załóż konto na [vercel.com](https://vercel.com) — zaloguj się przez GitHub
   albo e-mailem, bez różnicy.
2. W terminalu, w katalogu projektu:

```bash
npx vercel login
```

Podaj ten sam adres, na który zakładałeś konto, i kliknij link z maila.

---

## 2. Pierwszy deploy testowy

```bash
npx vercel
```

Pytania, które zada:

| Pytanie | Odpowiedź |
|---|---|
| Set up and deploy? | **y** |
| Which scope? | Twoje konto |
| Link to existing project? | **n** |
| Project name? | `patryncio-movement` (Enter przyjmuje domyślną) |
| In which directory is your code? | `./` (Enter) |
| Modify settings? | **n** |

Dostaniesz adres typu `patryncio-movement-xxxx.vercel.app`. Otwórz go i sprawdź,
czy wszystko działa — **poza formularzem**, bo nie ma jeszcze kluczy.

Jeśli w tym miejscu pojawi się błąd o zbyt dużym pliku — przejdź do **Drogi B**
na końcu.

---

## 3. Zmienne środowiskowe (formularz kontaktowy)

```bash
npx vercel env add RESEND_API_KEY production
```

Wklej klucz z `.env.local` (ten zaczynający się od `re_`). Powtórz dla dwóch
pozostałych:

```bash
npx vercel env add MAIL_FROM production
```

wartość: `Portfolio <onboarding@resend.dev>`

```bash
npx vercel env add CONTACT_TO production
```

wartość: `patgrabowski11@gmail.com`

> To samo możesz zrobić klikając: panel Vercel → projekt → **Settings** →
> **Environment Variables**.

---

## 4. Deploy produkcyjny

```bash
npx vercel --prod
```

Od teraz ta jedna komenda publikuje każdą zmianę.

---

## 5. Podpięcie domeny

W panelu Vercel: projekt → **Settings** → **Domains** → wpisz
`patrynciomovement.com` → **Add**. Dodaj też `www.patrynciomovement.com` —
Vercel sam ustawi przekierowanie na wersję bez `www`.

Vercel pokaże, jakich wpisów DNS oczekuje. Powinny być dokładnie takie:

| Typ | Nazwa | Wartość |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

---

## 6. DNS w home.pl

1. Zaloguj się do [home.pl](https://home.pl) → **Panel klienta**.
2. **Usługi WWW i domeny** → wybierz `patrynciomovement.com`.
3. Wejdź w **Strefa DNS** (bywa też jako „Konfiguracja DNS" lub „Rekordy DNS").
4. **Usuń** istniejące rekordy `A` dla `@` oraz `CNAME`/`A` dla `www`
   (najczęściej wskazują na stronę parkingową home.pl).
5. Dodaj dwa nowe:

```
Typ: A       Nazwa: @      Wartość: 76.76.21.21      TTL: 3600
Typ: CNAME   Nazwa: www    Wartość: cname.vercel-dns.com     TTL: 3600
```

6. Zapisz.

> **Nie ruszaj rekordów MX** — odpowiadają za pocztę na tej domenie.

Propagacja zajmuje od kilku minut do 2 godzin. W panelu Vercel przy domenie
pojawi się zielony status, a certyfikat SSL wystawi się sam.

Postęp sprawdzisz komendą:

```bash
dig +short patrynciomovement.com
```

Ma zwrócić `76.76.21.21`.

---

## 7. Sprawdź po wejściu na żywo

- strona otwiera się pod `https://patrynciomovement.com` z kłódką
- `www.patrynciomovement.com` przekierowuje na wersję bez `www`
- wszystkie materiały video się odtwarzają
- **wyślij testowe zgłoszenie formularzem** i sprawdź skrzynkę
- otwórz na telefonie

---

## 8. Publikowanie zmian

```bash
npx vercel --prod
```

---

## Droga B — film na zewnętrznym hostingu

Potrzebna, jeśli Vercel odrzuci plik 210 MB albo transfer zacznie się kończyć.

**Cloudflare R2** — 10 GB miejsca za darmo i **zerowa opłata za transfer**, co
przy filmie tej wielkości jest kluczowe.

1. Załóż konto na [cloudflare.com](https://cloudflare.com) → **R2** → **Create bucket**
   (nazwa np. `patryncio-media`).
2. Wgraj `public/media/story/case-study.mp4` przez panel.
3. W ustawieniach bucketa włącz **Public access** (r2.dev) albo podepnij subdomenę.
4. Skopiuj publiczny adres pliku.
5. W [`src/data/site.ts`](src/data/site.ts) w sekcji `storytelling.film` podmień:

```ts
src: "https://TWOJ-ADRES-R2/case-study.mp4",
```

6. `npx vercel --prod`

Odtwarzacz działa tak samo — przewijanie do timestampów korzysta z zapytań
zakresowych, które R2 obsługuje.

> Alternatywy: **Bunny.net** (kilka złotych miesięcznie, bardzo dobry CDN pod
> wideo) albo **Vercel Blob** (wszystko w jednym panelu, ale transfer liczy się
> do limitu konta).
