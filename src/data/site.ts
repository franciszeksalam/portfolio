/* =============================================================================
   SITE CONFIG — jedyne miejsce, w którym edytujesz treść strony.
   Ceny, teksty, linki, ścieżki do plików video: wszystko tutaj.
   Ścieżki video opisane są w README.md (rozdzielczości, kodeki, rozmiary).
   ========================================================================== */

/* -----------------------------------------------------------------------------
   1. PODSTAWOWE DANE
   -------------------------------------------------------------------------- */
export const site = {
  name: "Patryk Grabowski",
  shortName: "Patryk",
  role: "Video Editor · Storyteller",
  location: "Polska · zdalnie",
  /** adres produkcyjny — używany w metadanych, sitemapie i canonicalu */
  url: "https://patrynciomovement.pl",
  /** adres pokazywany na stronie i domyślny odbiorca formularza */
  email: "patgrabowski11@gmail.com",
  calendarUrl: "",                          // opcjonalnie: link do Cal.com / Calendly
  socials: {
    youtube: "https://youtube.com/@patryncio",     // <- SPRAWDŹ
    tiktok: "https://tiktok.com/@patryncio",       // <- SPRAWDŹ
    instagram: "https://www.instagram.com/patryncio/",
  },
  /** nazwy wyświetlane przy linkach */
  handles: {
    instagram: "@patryncio",
  },
  millowUrl: "https://millowtool.com",
} as const;

/* -----------------------------------------------------------------------------
   2. HERO (01)
   -------------------------------------------------------------------------- */
export const hero = {
  headline: "Montaż, który daje powód, żeby zostać.",
  eyebrow: ["YouTube", "Short form", "Storytelling"],
  body: "Łączę storytelling, pacing, sound design i motion, żeby z materiału zrobić film, który nie tylko dobrze wygląda — ale prowadzi widza od pierwszej do ostatniej sekundy.",
  primaryCta: { label: "Zobacz realizacje", href: "#work" },
  secondaryCta: { label: "Porozmawiajmy", href: "#contact" },
  /** Showreel. Podmień plik pod tą ścieżką — nic więcej nie trzeba zmieniać. */
  reel: {
    src: "/media/hero/showreel.mp4",
    poster: "/media/hero/showreel.jpg",
    aspect: "16/9" as const,
    /** Startuje wyciszony (wymóg autoplay); przycisk włącza dźwięk. */
    hasAudio: true,
  },
  stats: [
    { value: "4 lata", label: "montażu" },
    { value: "150+", label: "zmontowanych filmów" },
    { value: "40M+", label: "wyświetleń materiałów" },
  ],
} as const;

/* -----------------------------------------------------------------------------
   4. SELECTED WORK (02)
   -------------------------------------------------------------------------- */
export type WorkFormat = "long" | "short";
export type WorkCategory = "travel" | "entertainment";

export type Project = {
  id: string;
  /** opcjonalny — bez tytułu karta pokazuje sam format (przydatne przy shortach) */
  title?: string;
  /** kanał / klient — pokazywane pod tytułem, opcjonalne */
  client?: string;
  format: WorkFormat;
  category: WorkCategory;
  /** np. "YouTube · 30 minut" */
  kind: string;
  /** zakres pracy */
  role: string;
  /** opcjonalnie: liczba wyświetleń, np. "340 tys. wyświetleń" */
  views?: string;
  /** opcjonalnie: cel montażowy (nie każdy projekt go potrzebuje) */
  goal?: string;
  year: string;
  /** miniatura — plik w /public/media/work/ */
  thumb: string;
  /** ID filmu z YouTube — po kliknięciu miniatury otwiera się odtwarzacz */
  youtubeId?: string;
  /** alternatywnie: plik lokalny (gdy materiału nie ma na YouTube) */
  video?: { src: string };
  featured?: boolean;
};

export const workFilters = {
  format: [
    { id: "all", label: "Wszystko" },
    { id: "long", label: "Long form" },
    { id: "short", label: "Short form" },
  ],
  category: [
    { id: "all", label: "Wszystkie" },
    { id: "travel", label: "Podróże" },
    { id: "entertainment", label: "Rozrywka / Vlog" },
  ],
} as const;

export const projects: Project[] = [
  {
    id: "golebiewski",
    title: "4101 ZŁ ZA 3 NOCE W HOTELU GOŁĘBIEWSKI 😱 LUKSUS CZY ŚCIEMA?",
    client: "@werkaimax · 327 tys. subskrypcji",
    format: "long",
    category: "entertainment",
    kind: "YouTube · 30 minut",
    role: "Montaż · Storytelling · Sound design · Animacje · Color",
    year: "2026",
    thumb: "/media/work/golebiewski.jpg",
    youtubeId: "nzb6tisu1Zc",
    featured: true,
  },
  {
    id: "autostop",
    title: "1300 km autostopem bez planu",
    client: "@patryncio · 43,1 tys. subskrypcji",
    format: "long",
    category: "travel",
    kind: "YouTube · 29 minut",
    role: "Montaż · Storytelling · Sound design · Animacje · Color",
    year: "2026",
    thumb: "/media/work/autostop.jpg",
    youtubeId: "7Lb7RuIOJOU",
    featured: true,
  },
  {
    id: "mia-decyduje",
    title: "MIA DECYDUJE O CAŁYM NASZYM DNIU!",
    client: "@werkaimax · 327 tys. subskrypcji",
    format: "long",
    category: "entertainment",
    kind: "YouTube · 22 minuty",
    role: "Montaż · Storytelling · Sound design · Animacje · Color",
    views: "340 tys. wyświetleń",
    year: "2026",
    thumb: "/media/work/mia-decyduje.jpg",
    youtubeId: "mBQ4ElAotKs",
  },
  {
    id: "urodzinki",
    title: "TRZECIE URODZINKI NASZEJ CÓRECZKI 🥹",
    client: "@werkaimax · 327 tys. subskrypcji",
    format: "long",
    category: "entertainment",
    kind: "YouTube · 19 minut",
    role: "Montaż · Storytelling · Sound design · Animacje · Color",
    views: "275 tys. wyświetleń",
    year: "2026",
    thumb: "/media/work/urodzinki.jpg",
    youtubeId: "chzand-IXZ4",
  },

  /* ——— SHORT FORM ———————————————————————————————————————————————
     Materiały lokalne (pliki w /public/media/work/). Tytuły są opcjonalne —
     dopóki ich nie ma, karta pokazuje sam format i długość.
     Kategoria (travel / entertainment) steruje filtrem — warto ją potwierdzić. */
  {
    id: "short-1",
    format: "short",
    category: "entertainment",
    kind: "Reels / TikTok · 0:26",
    role: "Montaż · Napisy · Motion · Sound design",
    year: "2026",
    thumb: "/media/work/short-1.jpg",
    video: { src: "/media/work/short-1.mp4" },
  },
  {
    id: "short-2",
    format: "short",
    category: "entertainment",
    kind: "Reels / TikTok · 0:31",
    role: "Montaż · Napisy · Motion · Sound design",
    year: "2026",
    thumb: "/media/work/short-2.jpg",
    video: { src: "/media/work/short-2.mp4" },
  },
  {
    id: "short-3",
    format: "short",
    category: "entertainment",
    kind: "Reels / TikTok · 0:25",
    role: "Montaż · Napisy · Motion · Sound design",
    year: "2026",
    thumb: "/media/work/short-3.jpg",
    video: { src: "/media/work/short-3.mp4" },
  },
  {
    id: "short-4",
    format: "short",
    category: "entertainment",
    kind: "Reels / TikTok · 0:52",
    role: "Montaż · Napisy · Motion · Sound design",
    year: "2026",
    thumb: "/media/work/short-4.jpg",
    video: { src: "/media/work/short-4.mp4" },
  },
  {
    id: "short-5",
    format: "short",
    category: "entertainment",
    kind: "Reels / TikTok · 0:34",
    role: "Montaż · Napisy · Sound design",
    year: "2026",
    thumb: "/media/work/short-5.jpg",
    video: { src: "/media/work/short-5.mp4" },
  },
  {
    id: "short-10",
    format: "short",
    category: "travel",
    kind: "Reels / TikTok · 0:46",
    role: "Montaż · Napisy · Motion · Sound design",
    year: "2026",
    thumb: "/media/work/short-10.jpg",
    video: { src: "/media/work/short-10.mp4" },
  },
  {
    id: "short-6",
    format: "short",
    category: "travel",
    kind: "Reels / TikTok · 0:47",
    role: "Montaż · Napisy · Sound design",
    year: "2026",
    thumb: "/media/work/short-6.jpg",
    video: { src: "/media/work/short-6.mp4" },
  },

  /* materiały poziome wpisane w kadr 9:16 (czarne pasy góra/dół) */
  {
    id: "short-7",
    format: "short",
    category: "travel",
    kind: "Reels / TikTok · 0:32",
    role: "Montaż · Napisy · Motion · Sound design",
    year: "2026",
    thumb: "/media/work/short-7.jpg",
    video: { src: "/media/work/short-7.mp4" },
  },
  {
    id: "short-8",
    format: "short",
    category: "travel",
    kind: "Reels / TikTok · 0:28",
    role: "Montaż · Napisy · Motion · Sound design",
    year: "2026",
    thumb: "/media/work/short-8.jpg",
    video: { src: "/media/work/short-8.mp4" },
  },
  {
    id: "short-9",
    format: "short",
    category: "travel",
    kind: "Reels / TikTok · 0:32",
    role: "Motion graphics · Montaż · Sound design",
    year: "2026",
    thumb: "/media/work/short-9.jpg",
    video: { src: "/media/work/short-9.mp4" },
  },
];


/* -----------------------------------------------------------------------------
   5. STORYTELLING (03) — sekcja rozbierająca jeden film na części
   -------------------------------------------------------------------------- */
export const storytelling = {
  headline: "Dobry montaż zaczyna się dużo wcześniej niż przy pierwszym cięciu.",
  sub: "Storytelling jest moją najmocniejszą umiejętnością.",
  intro:
    "Poniżej jeden z moich filmów rozłożony na decyzje, które podejmuję zanim postawię pierwsze cięcie. Przewijaj — film sam przechodzi do omawianego momentu.",
  film: {
    title: "1300 km autostopem bez planu",
    meta: "@patryncio · YouTube · 29:52",
    /* Film waży 210 MB, więc nie trafia do repozytorium (patrz .gitignore).
       Na produkcji leci z Vercel Blob — adres w NEXT_PUBLIC_CASE_STUDY_URL.
       Lokalnie używany jest plik z /public/media/story/. */
    src: process.env.NEXT_PUBLIC_CASE_STUDY_URL || "/media/story/case-study.mp4",
    poster: "/media/story/case-study.jpg",
    /** Pełny czas trwania filmu w sekundach — używany do rysowania timeline'u. */
    durationSeconds: 1791,
  },
  /** `at` = sekunda, do której przeskakuje player przy tym etapie.
      Kolejność i liczba etapów są dowolne — sekcja dostosowuje się sama. */
  chapters: [
    {
      no: "01",
      title: "Hook",
      timecode: "00:00",
      at: 0,
      desc: "Zestawiam „najlepsza podróż życia” z przekleństwami ze środka filmu. Widz nie dostaje na starcie odpowiedzi — dostaje pytanie, po które musi zostać.",
      note: "Kontrast zamiast streszczenia",
    },
    {
      no: "02",
      title: "Kontekst",
      timecode: "00:08",
      at: 8,
      desc: "Osiem sekund na to, kto, gdzie i po co. Kontekst wchodzi zanim ruszy akcja, żeby później nie trzeba było jej zatrzymywać na tłumaczenie.",
      note: "Ekspozycja przed pierwszym krokiem",
    },
    {
      no: "03",
      title: "Selekcja",
      timecode: "02:03",
      at: 123,
      desc: "Dokładnie wiem, kiedy trzeba coś skrócić, a kiedy warto wzbogacić historię o dodatkowe informacje.",
      note: "Widz zanurza się w historii jeszcze bardziej",
    },
    {
      no: "04",
      title: "Cel",
      timecode: "02:14",
      at: 134,
      desc: "Jasno postawiony pierwszy cel. Widz w każdej sekundzie wie, do czego zmierzamy — i potrafi ocenić, czy jesteśmy bliżej, czy dalej.",
      note: "Bez celu nie ma napięcia",
    },
    {
      no: "05",
      title: "Konflikt",
      timecode: "02:45",
      at: 165,
      desc: "Realny problem wyciągnięty z materiału i postawiony wcześniej, niż wydarzył się naprawdę. Zapowiedź buduje oczekiwanie.",
      note: "Problem zapowiedziany przed czasem",
    },
    {
      no: "06",
      title: "Rozwiązanie",
      timecode: "03:13",
      at: 193,
      desc: "Ulga przychodzi szybko, bo historia ma być rollercoasterem, a nie równią. Highs and lows — jedno nie działa bez drugiego.",
      note: "Pierwszy szczyt",
    },
    {
      no: "07",
      title: "Konflikt",
      timecode: "03:27",
      at: 207,
      desc: "Czternaście sekund po rozwiązaniu wchodzi kolejny problem. Widz nie zdąży się rozsiąść.",
      note: "Spadek zaraz po szczycie",
    },
    {
      no: "08",
      title: "Nadzieja",
      timecode: "04:31",
      at: 271,
      desc: "Nowy plan. Widz zostaje nie dlatego, że coś się udało — tylko dlatego, że chce sprawdzić, czy tym razem się uda.",
      note: "Obietnica, nie rozwiązanie",
    },
    {
      no: "09",
      title: "Konflikt",
      timecode: "06:00",
      at: 360,
      desc: "Kolejna przeszkoda ustawiona tak, żeby w głowie widza został jeden pytajnik: co teraz?",
      note: "Pytanie ważniejsze od odpowiedzi",
    },
    {
      no: "10",
      title: "Sukces",
      timecode: "09:00",
      at: 540,
      desc: "Moment euforii i uzupełnienie historii dodatkowymi informacjami w postprodukcji.",
      note: "Storytelling dopisany w montażu",
    },
    {
      no: "11",
      title: "Konflikt",
      timecode: "10:07",
      at: 607,
      desc: "Nowe miejsce, nowy problem. Reset stawki w połowie filmu trzyma uwagę dokładnie tam, gdzie retencja zwykle się sypie.",
      note: "Druga połowa dostaje własną stawkę",
    },
    {
      no: "12",
      title: "Cisza",
      timecode: "20:13",
      at: 1213,
      desc: "Oddech zostawiony tam, gdzie jest naprawdę potrzebny. Nie każda sekunda ciszy jest do wycięcia — część z nich robi całą robotę.",
      note: "Cisza jako decyzja",
    },
    {
      no: "13",
      title: "To tylko część",
      timecode: "29:30",
      at: 1770,
      desc: "Dwanaście punktów powyżej to te decyzje, które da się wskazać palcem na osi czasu. W każdym filmie jest ich znacznie więcej — dobór muzyki, długość pojedynczego ujęcia, to, czego widz nigdy nie zobaczy, bo świadomie tego nie pokazałem.",
      note: "Resztę tej pracy widać niżej",
    },
  ],
} as const;

/* -----------------------------------------------------------------------------
   6. CO TRAFIA DO TWOJEGO FILMU (04)
   -------------------------------------------------------------------------- */
export type CraftItem = {
  id: string;
  title: string;
  desc: string;
  /** "compare" = suwak przed/po (oba materiały muszą być tej samej długości),
      "single"  = jeden materiał w pętli, wyciszony,
      "sound"   = materiał odtwarzany na kliknięcie, od razu z dźwiękiem */
  mode: "compare" | "single" | "sound";
  before?: { src: string; poster: string; label: string };
  after?: { src: string; poster: string; label: string };
  video?: { src: string; poster: string };
  aspect?: "16/9" | "9/16";
  hasAudio?: boolean;
};

export const craft = {
  headline: "Co trafia do Twojego filmu?",
  sub: "Kilka wybranych efektów, których używam do zwiększenia watchtime'u.",
  items: [
    {
      id: "masking-cuts",
      title: "Maskowanie cięć",
      desc: "Cięcie nie powinno przypominać widzowi, że ogląda montaż.",
      mode: "compare",
      before: { src: "/media/craft/masking-before.mp4", poster: "/media/craft/masking-before.jpg", label: "Surowe cięcie" },
      after: { src: "/media/craft/masking-after.mp4", poster: "/media/craft/masking-after.jpg", label: "Zamaskowane" },
      hasAudio: true,
    },
    {
      id: "smooth-zoomy",
      title: "Smooth zoomy",
      desc: "Zoom prowadzi wzrok, zamiast nim szarpać — wchodzi dokładnie wtedy, kiedy widz i tak chce zobaczyć więcej.",
      mode: "single",
      /* ten sam materiał co short nr 5 — wersja 720p z mastera 4K,
         plik przysłany osobno miał tylko 368 px szerokości */
      video: { src: "/media/work/short-5.mp4", poster: "/media/work/short-5.jpg" },
      aspect: "9/16",
      hasAudio: true,
    },
    {
      id: "motion",
      title: "Motion & Animation",
      desc: "Animacje wspierające informację, zamiast odciągać od niej uwagę.",
      mode: "single",
      /* ten sam materiał co w sekcji 05 → Storytelling */
      video: { src: "/media/ae/storytelling.mp4", poster: "/media/ae/storytelling.jpg" },
    },
    {
      id: "captions",
      title: "Napisy",
      desc: "Dynamiczne, czytelne, dopasowane do stylu filmu — nie do szablonu.",
      mode: "single",
      video: { src: "/media/craft/napisy.mp4", poster: "/media/craft/napisy.jpg" },
      aspect: "9/16",
      hasAudio: true,
    },
    {
      id: "sound-design",
      title: "Sound Design",
      desc: "Ambience, impacty, risery, transition sounds i praca z muzyką. Włącz dźwięk.",
      mode: "sound",
      /* ten sam plik co showreel w hero — podmiana showreelu zmieni też ten materiał */
      video: { src: "/media/hero/showreel.mp4", poster: "/media/hero/showreel.jpg" },
      hasAudio: true,
    },
    {
      id: "storytelling",
      title: "Storytelling",
      desc: "Dodatkowe wątki, kontekst, callbacki i payoffy — dopisane na etapie montażu.",
      mode: "sound",
      hasAudio: true,
      video: { src: "/media/craft/storytelling.mp4", poster: "/media/craft/storytelling.jpg" },
    },
  ] satisfies CraftItem[],
} as const;

/* -----------------------------------------------------------------------------
   7. AFTER EFFECTS (05)
   -------------------------------------------------------------------------- */
export const afterEffects = {
  headline: "Kiedy sam montaż nie wystarcza.",
  sub: "After Effects wchodzi tam, gdzie kończą się możliwości Premiere Pro.",
  items: [
    { id: "motion-graphics", title: "Motion Graphics", note: "Liczby, mapy, tytuły, elementy informacyjne", video: { src: "/media/ae/motion-graphics.mp4", poster: "/media/ae/motion-graphics.jpg" } },
    { id: "tracked-graphics", title: "Tracked Graphics", note: "Grafika osadzona w przestrzeni ujęcia", video: { src: "/media/ae/tracked-graphics.mp4", poster: "/media/ae/tracked-graphics.jpg" } },
    { id: "storytelling", title: "Storytelling", note: "Animacje uzupełniające historię", video: { src: "/media/ae/storytelling.mp4", poster: "/media/ae/storytelling.jpg" } },
    { id: "custom-animations", title: "Custom Animations", note: "Animacje robione pod jeden konkretny kanał", video: { src: "/media/ae/custom-animations.mp4", poster: "/media/ae/custom-animations.jpg" } },
  ],
} as const;

/* -----------------------------------------------------------------------------
   8. O MNIE (06)
   -------------------------------------------------------------------------- */
export const about = {
  headline: "Montuję filmy. Ale przede wszystkim sam jestem twórcą.",
  photo: "/media/about/portret.jpg",
  photoAlt: "Portret — Patryk podczas nocnego spaceru z psem",
  paragraphs: [
    "Montuję long formy i short formy — ale zanim zacząłem robić to dla innych, robiłem to dla siebie. Nadal prowadzę własny kanał, więc znam ten moment, w którym patrzysz na wykres retencji i widzisz dokładnie, w której sekundzie widz odszedł.",
    "Dlatego nie patrzę na Twój materiał jak wykonawca zlecenia, tylko jak twórca, który wie, co jest na szali. Storytelling jest dla mnie najważniejszą częścią dobrego filmu — reszta rzemiosła ma mu służyć.",
    "Najmocniej czuję się w podróżach, entertainment i vlogach. Pracuję w Premiere Pro i After Effects.",
  ],
  facts: [
    { k: "Specjalizacja", v: "Travel · Entertainment · Vlog" },
    { k: "Formaty", v: "YouTube long form · Shorts · Reels · TikTok" },
    { k: "Narzędzia", v: "Premiere Pro · After Effects" },
    { k: "Dodatkowo", v: "Sound design · Motion graphics · Napisy" },
  ],
} as const;

/* -----------------------------------------------------------------------------
   9. MILLOW (07)
   -------------------------------------------------------------------------- */
export const millow = {
  headline: "Narzędzia, których potrzebowałem, więc zacząłem je budować.",
  body: "Jestem współtwórcą Millow — zestawu narzędzi i pluginów dla montażystów Premiere Pro.",
  sub: "Powstały z rzeczy, które w moim własnym workflow zajmowały za dużo czasu.",
  cta: "Poznaj Millow",
  href: site.millowUrl,
  mockup: { src: "/media/millow/millow.mp4", poster: "/media/millow/millow.jpg", hasAudio: true },
  points: [
    "Narzędzia budowane pod realny workflow, nie pod demo",
    "Używane przez montażystów pracujących komercyjnie",
    "Rozwijane na bieżąco razem z moją własną praktyką",
  ],
} as const;

/* -----------------------------------------------------------------------------
   10. CENNIK / WSPÓŁPRACA (08)
   ⚠️  CENY: edytujesz wyłącznie tutaj.
   -------------------------------------------------------------------------- */
export const pricing = {
  headline: "Współpraca",
  sub: "Pracuję w modelu stałej opieki nad kanałem — tam montaż daje najwięcej, bo film buduje się na poprzednim.",
  currency: "zł",

  /* ——— STAŁA WSPÓŁPRACA — główny element sekcji ————————————————— */
  retainer: {
    label: "Stała współpraca",
    note: "Stały slot w kalendarzu, spójny język kanału, krótsze terminy.",
    /** drobny przypis pod kartami */
    disclaimer:
      "Zaawansowane animacje i bardziej złożone realizacje w After Effects wyceniane są indywidualnie.",
    plans: [
      {
        id: "creator",
        title: "CREATOR",
        price: "2850",             // <- PODMIEŃ
        unit: "brutto / miesiąc",
        tagline: "Kanał, który publikuje regularnie.",
        features: [
          "3 long form / miesiąc",
          "Story i struktura każdego odcinka",
          "Sound design i napisy",
          "Stały slot w kalendarzu",
          "Kontakt na priorytecie",
        ],
        /** dopłata pokazywana pod listą */
        addon: "Każdy dodatkowy short form: 120 zł brutto",
        featured: false,
      },
      {
        id: "creator-plus",
        title: "CREATOR+",
        price: "3500",             // <- PODMIEŃ
        unit: "brutto / miesiąc",
        tagline: "Long form plus obecność w short formie.",
        features: [
          "4 long form / miesiąc",
          "1 short promujący każdy long form — gratis",
          "Story i struktura każdego odcinka",
          "Sound design i napisy",
          "Konsultacje struktury przed nagraniem",
          "Priorytetowe terminy",
        ],
        addon: "Każdy dodatkowy short do montażu: 100 zł brutto",
        featured: true,
      },
      {
        id: "custom",
        title: "CUSTOM",
        price: "Wycena",
        unit: "indywidualnie",
        tagline: "Indywidualny workflow dla kanału albo firmy.",
        features: [
          "Dowolny wolumen i formaty",
          "Praca z Twoim zespołem",
          "Ustalony system plików i feedbacku",
        ],
        featured: false,
      },
    ],
  },

  /* ——— POJEDYNCZE PROJEKTY — obecnie niedostępne ————————————————— */
  oneOff: {
    label: "Pojedyncze projekty",
    status: "Aktualnie niedostępne",
    note: "Aktualnie skupiam się wyłącznie na stałych współpracach i nie realizuję pojedynczych zleceń. Jeśli szukasz montażysty do regularnej pracy nad kanałem — wybierz jeden z planów powyżej lub napisz do mnie.",
    cta: "Zobacz stałą współpracę",
    items: [
      {
        id: "long-form",
        title: "YouTube Long Form",
        price: "1100",             // <- PODMIEŃ
        unit: "brutto / film",
        desc: "Pełny montaż odcinka: storytelling, voiceovery, maskowanie cięć, wyrównanie i poprawa audio, pacing, sound design, napisy, prosta grafika i animacje.",
        includes: [
          "Story i struktura",
          "Sound design",
          "Napisy",
          "2 rundy poprawek — główna + finalne dopracowanie",
        ],
      },
      {
        id: "short-form",
        title: "Short / Reel",
        price: "150",              // <- PODMIEŃ
        unit: "brutto / sztuka",
        desc: "Pionowy format z hookiem, napisami i pełnym sound designem.",
        includes: [
          "Hook i selekcja",
          "Napisy dynamiczne",
          "Proste grafiki i animacje",
          "B-rolle",
          "1 runda poprawek",
        ],
      },
    ],
  },
} as const;

/* -----------------------------------------------------------------------------
   11. PROCES (09)
   -------------------------------------------------------------------------- */
/** UWAGA: nie nazywać tego eksportu `process` — przesłania globalny obiekt
    Node'a, do którego Next wstrzykuje własne makra, i wywala build na SSR. */
export const workflow = {
  headline: "Jak to wygląda",
  steps: [
    {
      no: "01",
      title: "Materiał",
      desc: "Wrzucasz surówkę i to, co chcesz osiągnąć. Resztą zajmuję się ja.",
    },
    {
      no: "02",
      title: "Story / montaż",
      desc: "Struktura, cięcie, sound design, motion. Na tym etapie dogrywam też voiceovery, których brakuje mi do uzupełnienia historii.",
    },
    {
      no: "03",
      title: "Feedback",
      desc: "Dwie rundy poprawek: pierwsza główna, na konkretne zmiany w montażu, druga kosmetyczna — drobne korekty i dopracowanie.",
    },
    {
      no: "04",
      title: "Oddanie materiału",
      desc: "Gotowy film ląduje na Dysku Google w eksporcie pod docelową platformę. Miniatura w konsultacji, jeśli jej potrzebujesz.",
    },
  ],
} as const;

/* -----------------------------------------------------------------------------
   12. KONTAKT (10)
   -------------------------------------------------------------------------- */
export const contact = {
  headline: "Zróbmy film, który sam chciałbyś obejrzeć.",
  cta: "Porozmawiajmy o Twoim kanale",
  sub: "Odpisuję zwykle w ciągu 24 godzin. Napisz, co robisz i gdzie utyka Twój kanał.",
  /** Adres, na który trafiają zgłoszenia z formularza.
      Można nadpisać zmienną środowiskową CONTACT_TO (patrz README). */
  recipient: "patgrabowski11@gmail.com",
  /** Endpoint API route obsługującego wysyłkę. */
  endpoint: "/api/kontakt",
  fields: {
    name: "Imię",
    email: "E-mail",
    channel: "Link do kanału",
    need: "Czego potrzebujesz?",
    message: "Wiadomość",
  },
  needOptions: [
    "Creator — 3 longi / mies.",
    "Creator+ — 4 longi / mies.",
    "Custom",
    "Jeszcze nie wiem — porozmawiajmy",
  ],
  availability: {
    label: "Dostępność",
    text: "Przyjmuję ograniczoną liczbę kanałów do stałej współpracy.",
    meta: "Praca w pełni zdalna • Polska",
  },
  success: {
    headline: "Wiadomość wysłana.",
    sub: "Teraz moja kolej.",
    note: "Odezwę się na podany adres e-mail.",
  },
  errors: {
    generic: "Coś poszło nie tak. Spróbuj ponownie lub napisz do mnie bezpośrednio.",
    name: "Podaj imię.",
    nameLong: "Imię jest za długie.",
    email: "Podaj poprawny adres e-mail.",
    message: "Napisz kilka słów o swoim kanale.",
    messageLong: "Wiadomość jest za długa — zmieść się w 4000 znaków.",
    channelLong: "Link jest za długi.",
    rate: "Zbyt wiele prób. Spróbuj ponownie za kilka minut.",
  },
} as const;

/* -----------------------------------------------------------------------------
   13. NAWIGACJA
   -------------------------------------------------------------------------- */
export const nav = [
  { id: "work", label: "Realizacje", href: "#work" },
  { id: "story", label: "Storytelling", href: "#storytelling" },
  { id: "craft", label: "Umiejętności", href: "#craft" },
  { id: "about", label: "O mnie", href: "#about" },
  { id: "pricing", label: "Współpraca", href: "#pricing" },
] as const;
