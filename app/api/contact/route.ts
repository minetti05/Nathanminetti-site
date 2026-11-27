import { NextResponse } from "next/server";
import { siteConfig } from "@/site.config";

/**
 * Contact form handler. Sends the message by email through Resend.
 * Needs RESEND_API_KEY in the Vercel project's environment variables.
 * Optional: CONTACT_TO (defaults to the site email) and CONTACT_FROM
 * (defaults to Resend's test sender until a domain is verified).
 */
export const runtime = "nodejs";

const clean = (v: unknown, max = 5000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-request" }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field. Pretend success so bots move on.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 200);
  const company = clean(body.company, 200);
  const email = clean(body.email, 320);
  const inquiry = clean(body.inquiry, 100);
  const workshop = clean(body.workshop, 100);
  const message = clean(body.message);

  if (!name || !email || !isEmail(email) || !inquiry || !message) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("Contact form: RESEND_API_KEY is not set");
    return NextResponse.json({ ok: false, error: "not-configured" }, { status: 503 });
  }

  const to = process.env.CONTACT_TO || siteConfig.email;
  const from = process.env.CONTACT_FROM || "Website <onboarding@resend.dev>";
  const subject = `Website inquiry: ${inquiry}${workshop ? ` (${workshop})` : ""} from ${name}`;
  const rows: [string, string][] = [
    ["Name", name],
    ["Company", company],
    ["Email", email],
    ["Inquiry type", inquiry],
    ["Workshop", workshop],
  ];
  const text = `${rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${message}`;
  const html = `${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<p><strong>${esc(k)}:</strong> ${esc(v)}</p>`)
    .join("")}<p>${esc(message).replace(/\n/g, "<br>")}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], reply_to: email, subject, text, html }),
  });

  if (!res.ok) {
    console.error("Contact form: Resend error", res.status, await res.text());
    return NextResponse.json({ ok: false, error: "send-failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
