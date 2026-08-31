# Wdrożenie na patrynciomovement.com

Stan: projekt jest **gotowy do wdrożenia**. Poniżej tylko to, czego nie mogłem
zrobić za Ciebie, bo wymaga logowania na Twoje konta.

Cała droga zamyka się w darmowym planie Vercela (Hobby). Nic nie trzeba wykupywać.

---

## Dlaczego akurat tak

Case study trwa 29:51 i waży **210 MB**. To zderza się z dwoma twardymi limitami:

| Limit | Wartość | Źródło |
|---|---|---|
| Pojedynczy plik w repozytorium | 100 MB | GitHub, blokada twarda |
| Pliki źródłowe przy deployu z CLI | 100 MB (Hobby) / 1 GB (Pro) | dokumentacja Vercela |

Dlatego film **nie leży w repozytorium**. Trafia do **Vercel Blob** (limit pliku:
5 TB, w darmowym planie 5 GB miejsca i 100 GB transferu), a strona pobiera go
z adresu w zmiennej środowiskowej. Film zostaje w pełnej długości — nic nie
skracamy. Repozytorium schodzi do **112 MB**, największy plik ma 12 MB.

Reszta materiałów zostaje w repo, bo są małe i dzięki temu wersjonują się razem
z kodem.

---

## 1. Film do Vercel Blob — ✅ ZROBIONE

Plik jest już wgrany i sprawdzony:
`https://gdkngf6ew4iofoob.public.blob.vercel-storage.com/case-study.mp4`

Weryfikacja: `206 Partial Content`, `accept-ranges: bytes`, rozmiar zgodny co do
bajta (219 880 552 B), przewinięcie do 20:13 w **125 ms**. Możesz przejść do kroku 2.

<details>
<summary>Jak to było zrobione (gdybyś kiedyś podmieniał film)</summary>


1. Załóż konto na [vercel.com](https://vercel.com) (przycisk **Continue with GitHub** — konto GitHub przyda się w kroku 2).
2. W panelu: **Storage → Create Database → Blob → Create**.
3. Wejdź w utworzony store → zakładka **Browser** → **Upload**.
4. Wgraj plik: `public/media/story/case-study.mp4` (210 MB, wysyłka potrwa kilka minut).
5. Skopiuj publiczny adres pliku — wygląda tak:
   `https://xxxxxxxx.public.blob.vercel-storage.com/case-study-xxxx.mp4`

Adres wklejasz jako `NEXT_PUBLIC_CASE_STUDY_URL` i robisz redeploy.
</details>

---

## 2. Kod na GitHuba

Repozytorium jest już zainicjowane i ma pierwszy commit. Zostaje wypchnięcie:

1. Na [github.com/new](https://github.com/new) utwórz repozytorium — nazwa dowolna,
   widoczność **Private**, **bez** dodawania README i .gitignore.
2. W terminalu, w katalogu projektu:

```bash
git remote add origin https://github.com/TWOJA-NAZWA/NAZWA-REPO.git && git branch -M main && git push -u origin main
```

Wysyłka ~112 MB potrwa chwilę.

---

## 3. Projekt na Vercelu

1. Panel Vercela → **Add New → Project** → **Import Git Repository** → wybierz repo.
2. Framework zostanie wykryty jako Next.js — nic nie zmieniaj.
3. Przed kliknięciem **Deploy** rozwiń **Environment Variables** i dodaj cztery:

| Nazwa | Wartość |
|---|---|
| `RESEND_API_KEY` | Twój klucz z resend.com (ten sam co w `.env.local`) |
| `MAIL_FROM` | `Portfolio <onboarding@resend.dev>` |
| `CONTACT_TO` | `patgrabowski11@gmail.com` |
| `NEXT_PUBLIC_CASE_STUDY_URL` | `https://gdkngf6ew4iofoob.public.blob.vercel-storage.com/case-study.mp4` |

4. **Deploy**. Po 2–3 minutach dostaniesz adres `nazwa.vercel.app` — sprawdź, czy
   wszystko działa, zanim podepniesz domenę.

> Zmienne wczytują się **przy buildzie**. Jeśli dodasz je później, zrób redeploy.

---

## 4. Domena i DNS w home.pl

**W Vercelu:** Settings → **Domains** → **Add Domain** → wpisz `patrynciomovement.com`
→ zatwierdź propozycję dodania też `www`.

Vercel pokaże teraz konkretne wartości do wpisania. **Przepisz je dokładnie z panelu** —
adres CNAME jest indywidualny dla projektu (wygląda jak `d1d4fc829fe7bc7c.vercel-dns-017.com`)
i nie da się go zgadnąć.

**W home.pl:** panel → **Domeny** → `patrynciomovement.com` → **Strefa DNS / Rekordy DNS**.

| Typ | Nazwa (host) | Wartość | TTL |
|---|---|---|---|
| A | `@` (domena główna) | `76.76.21.21` | 3600 |
| CNAME | `www` | wartość z panelu Vercela | 3600 |

Usuń stare rekordy A i CNAME dla `@` i `www`, jeśli home.pl ustawił własne
(zwykle kierują na stronę parkingową) — inaczej będą się gryzły z nowymi.

Propagacja zwykle trwa kilkanaście minut, czasem do kilku godzin. W Vercelu przy
domenie pojawi się zielony status **Valid Configuration**. Certyfikat HTTPS
Vercel wystawia sam, nic nie trzeba robić.

---

## ⚠️ Limit 100 MB na pliki statyczne

Plan Hobby pozwala wysłać **100 MB plików statycznych** na deployment. To osobny
limit niż rozmiar repozytorium i **build przechodzi, a dopiero wysyłka wyniku
pada** — w logu widać wtedy „Compiled successfully" i nic więcej.

Aktualny stan sprawdzisz komendą:

```bash
du -ck $(git ls-files 'public/*') | tail -1
```

Jeśli zbliżasz się do 100 MB przy dokładaniu materiałów, masz trzy drogi:

1. **Zejść z bitrate'em** — shorty przy 720×1280 wyglądają dobrze już od ~1100 kbps,
   a wyświetlają się w kolumnie 300 px.
2. **Przenieść cięższe pliki do Vercel Blob**, tak jak case study — wtedy nie liczą
   się do limitu wcale.
3. **Plan Pro** — limit rośnie do 1 GB.

---

## 5. Sprawdź po wejściu na żywo

- [ ] `https://patrynciomovement.com` otwiera się i przekierowuje na HTTPS
- [ ] `www.patrynciomovement.com` prowadzi w to samo miejsce
- [ ] showreel leci w tle hero
- [ ] sekcja 03 — case study startuje i przeskakuje między etapami (leci z Bloba)
- [ ] shorty i materiały w sekcjach 04–05 odtwarzają się
- [ ] **formularz**: wyślij testowe zgłoszenie i sprawdź, czy przyszło na
      `patgrabowski11@gmail.com` oraz czy „Odpowiedz" podstawia adres nadawcy
- [ ] wklej link na Messengerze — powinien pokazać obrazek z nagłówkiem strony
- [ ] `patrynciomovement.com/robots.txt` i `/sitemap.xml` odpowiadają

---

## 6. Publikowanie zmian

Po podpięciu repozytorium każdy `git push` na `main` uruchamia nowy deploy:

```bash
git add -A && git commit -m "opis zmiany" && git push
```

Podmiana materiału: wrzuć plik pod tę samą ścieżkę w `public/media/`, zrób commit
i push. Wyjątek to case study — ten podmienia się w panelu Blob, a jeśli zmieni się
adres, trzeba zaktualizować `NEXT_PUBLIC_CASE_STUDY_URL` i zrobić redeploy.

---

## Do uzupełnienia przed pokazaniem klientom

- **Linki YouTube i TikTok** w [`src/data/site.ts`](src/data/site.ts) są zgadywane
  (`youtube.com/@patryncio`, `tiktok.com/@patryncio`) — oznaczone `<- SPRAWDŹ`.
  Instagram jest potwierdzony.
- **Nazwy shortów 1–6** — karty pokazują na razie sam format i długość.
- **Showreel** ma 1024×576, bo takie było źródło. Eksport 1920×1080 pod tą samą
  nazwą podmieni się sam.
