import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Nav } from "@/components/layout/Nav";
import { site, hero } from "@/data/site";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });
const display = Inter_Tight({ subsets: ["latin", "latin-ext"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  // używany tylko w drobnych etykietach — nie blokuje pierwszego renderu
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — ${site.role}`,
  description: hero.body,
  alternates: { canonical: "/" },
  keywords: [
    "montażysta video",
    "montaż YouTube",
    "short form",
    "storytelling",
    "Premiere Pro",
    "After Effects",
    "sound design",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    title: `${site.name} — montaż, który daje powód, żeby zostać`,
    description: hero.body,
    url: "/",
    siteName: site.name,
    type: "website",
    locale: "pl_PL",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: hero.body,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#060607",
  colorScheme: "dark",
};

/* Blokujący skrypt: dla powracających użytkowników intro nie zdąży się pokazać. */
/* Flaga widoczności karty: animacje wejścia odpalają się tylko wtedy, gdy strona
   jest faktycznie oglądana. W karcie w tle przeglądarka wstrzymuje animacje, co
   zostawiłoby niewidoczny nagłówek. */
const bootScript = `var d=document,r=d.documentElement;function v(){if(d.visibilityState==='visible'){r.dataset.visible='1';d.removeEventListener('visibilitychange',v)}}v();d.addEventListener('visibilitychange',v);`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pl"
      className={`${inter.variable} ${display.variable} ${mono.variable}`}
      /* blokujący skrypt dopisuje data-visible przed hydracją */
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--color-ink)] focus:px-5 focus:py-2 focus:text-[0.85rem] focus:text-[var(--color-void)]"
        >
          Przejdź do treści
        </a>
        <div className="grain" aria-hidden />
        <SmoothScroll />
        <Nav />
        {children}
      </body>
    </html>
  );
}
