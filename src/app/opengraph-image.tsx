import { ImageResponse } from "next/og";
import { site, hero } from "@/data/site";

/* Obrazek pokazywany przy udostępnianiu linku (Messenger, WhatsApp, X, LinkedIn).
   Generowany przy buildzie — nie trzeba go utrzymywać jako pliku graficznego. */

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#060607",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 14, height: 14, background: "#F04E23" }} />
          <div style={{ fontSize: 22, letterSpacing: 6, color: "#8B8B93", textTransform: "uppercase" }}>
            {site.name}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 82,
            lineHeight: 1.05,
            letterSpacing: -3,
            color: "#F5F5F4",
            maxWidth: 980,
          }}
        >
          {hero.headline}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ height: 1, width: 120, background: "#F04E23" }} />
          <div style={{ fontSize: 24, letterSpacing: 4, color: "#8B8B93", textTransform: "uppercase" }}>
            {hero.eyebrow.join("  ·  ")}
          </div>
        </div>
      </div>
    ),
    size
  );
}
