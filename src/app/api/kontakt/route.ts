import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contact, site } from "@/data/site";

/* =============================================================================
   API — obsługa formularza kontaktowego
   Klucz Resend żyje wyłącznie po stronie serwera (RESEND_API_KEY).
   Trasa jest dynamiczna: nic z niej nie trafia do bundla klienta.
   ========================================================================== */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMITS = { name: 80, email: 160, channel: 300, message: 4000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/* — prosty limit zapytań na IP —————————————————————————————————
   Pamięć procesu: wystarcza przeciw prostym botom. Przy serverless każda
   instancja ma własny licznik — to świadomy kompromis, opisany w README. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // zabezpieczenie przed puchnięciem pamięci
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "nieznane";
}

const escapeHtml = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe dane." }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(body.name);
  const email = str(body.email);
  const channel = str(body.channel);
  const need = str(body.need) || "nie wybrano";
  const message = str(body.message);
  const honeypot = str(body.firma);
  const elapsed = typeof body.elapsed === "number" ? body.elapsed : 99_999;

  /* — pułapka na boty: odpowiadamy sukcesem, żeby nie podpowiadać, co je zdradziło */
  if (honeypot || elapsed < 1500) {
    return NextResponse.json({ ok: true });
  }

  /* — walidacja po stronie serwera (klient ma swoją, ale ufamy tylko tej) —— */
  const errors: Record<string, string> = {};
  if (!name) errors.name = contact.errors.name;
  else if (name.length > LIMITS.name) errors.name = contact.errors.nameLong;
  if (!email || !EMAIL_RE.test(email) || email.length > LIMITS.email) errors.email = contact.errors.email;
  if (!message) errors.message = contact.errors.message;
  else if (message.length > LIMITS.message) errors.message = contact.errors.messageLong;
  if (channel.length > LIMITS.channel) errors.channel = contact.errors.channelLong;

  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json({ error: contact.errors.rate }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[kontakt] Brak RESEND_API_KEY — zgłoszenie nie zostało wysłane.");
    return NextResponse.json({ error: contact.errors.generic }, { status: 500 });
  }

  const to = process.env.CONTACT_TO || contact.recipient;
  const from = process.env.MAIL_FROM || "Portfolio <onboarding@resend.dev>";
  const data = new Date().toLocaleString("pl-PL", { dateStyle: "long", timeStyle: "short" });

  const linie = [
    ["Imię", name],
    ["E-mail", email],
    ["Kanał", channel || "—"],
    ["Interesuje go", need],
    ["Wiadomość", message],
    ["Źródło", "Portfolio"],
    ["Data", data],
  ] as const;

  const text = linie.map(([k, v]) => `${k}:\n${v}`).join("\n\n");

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.6;color:#111">
${linie
  .map(
    ([k, v]) =>
      `<p style="margin:0 0 18px"><strong style="display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#777;margin-bottom:4px">${k}</strong>${escapeHtml(
        v
      ).replace(/\n/g, "<br>")}</p>`
  )
  .join("")}
</div>`;

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Nowy lead — ${name} — ${need}`,
      text,
      html,
    });

    if (error) {
      console.error("[kontakt] Resend:", error);
      return NextResponse.json({ error: contact.errors.generic }, { status: 502 });
    }
    console.log(`[kontakt] Wysłano do ${to} — id wiadomości: ${data?.id}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[kontakt] Wyjątek:", e);
    return NextResponse.json({ error: contact.errors.generic }, { status: 500 });
  }
}

/* Inne metody nie są obsługiwane — sygnalizujemy to wprost. */
export function GET() {
  return NextResponse.json({ error: `Użyj POST. Kontakt: ${site.email}` }, { status: 405 });
}
