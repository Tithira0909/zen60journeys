// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// ── Rate limiter (in-memory sliding window) ─────────────────────────────────
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 3;
const ipMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (ipMap.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS) return true;
  ipMap.set(ip, [...timestamps, now]);
  return false;
}

// ── Zod schema ───────────────────────────────────────────────────────────────
const ContactSchema = z.object({
  name: z
    .string()
    .min(2, "Name is too short")
    .max(100, "Name is too long")
    .regex(/^[\p{L}\p{M}\s'\-]+$/u, "Name contains invalid characters"),
  email: z.string().email("Invalid email address").max(254),
  destination: z
    .string()
    .min(10, "Please tell us a little more")
    .max(2000, "Message is too long"),
  website: z.string().max(0, "Bot detected").optional(), // honeypot
});

// ── CSRF origin check ────────────────────────────────────────────────────────
function isOriginAllowed(req: NextRequest): boolean {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  if (!siteUrl) return true; // skip in dev if not set
  const origin = req.headers.get("origin") ?? "";
  const referer = req.headers.get("referer") ?? "";
  return origin.startsWith(siteUrl) || referer.startsWith(siteUrl);
}

// ── HTML sanitiser (strip tags from user input before emailing) ──────────────
function sanitise(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// ── Mailersend sender ────────────────────────────────────────────────────────
async function sendEmail(data: {
  name: string;
  email: string;
  destination: string;
}): Promise<void> {
  const apiKey = process.env.MAILERSEND_API_KEY;
  const toEmail = process.env.CONTACT_EMAIL_TO;
  const fromEmail = process.env.CONTACT_EMAIL_FROM;

  if (!apiKey || !toEmail || !fromEmail) {
    throw new Error("Missing Mailersend environment variables");
  }

  const safeName = sanitise(data.name);
  const safeEmail = sanitise(data.email);
  const safeDestination = sanitise(data.destination).replace(/\n/g, "<br/>");

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
      <h2 style="font-size:22px;font-weight:400;border-bottom:1px solid #e0ddd8;padding-bottom:12px;margin-bottom:24px;">
        New Inquiry — Zen Journeys
      </h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:10px 0;color:#888;width:120px;vertical-align:top;">Name</td>
          <td style="padding:10px 0;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#888;vertical-align:top;">Email</td>
          <td style="padding:10px 0;"><a href="mailto:${safeEmail}" style="color:#1a1a1a;">${safeEmail}</a></td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#888;vertical-align:top;">Dream Destination</td>
          <td style="padding:10px 0;line-height:1.6;">${safeDestination}</td>
        </tr>
      </table>
      <p style="margin-top:32px;font-size:11px;color:#bbb;letter-spacing:0.05em;">
        Sent via Zen Journeys contact form
      </p>
    </div>
  `;

  const body = {
    from: { email: fromEmail, name: "Zen Journeys" },
    to: [{ email: toEmail }],
    reply_to: { email: data.email, name: data.name },
    subject: `New Inquiry from ${data.name}`,
    html,
  };

  const res = await fetch("https://api.mailersend.com/v1/email", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Mailersend error:", res.status, text);
    throw new Error("Email delivery failed");
  }
}

// ── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. CSRF origin check
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. Content-Type guard
  const ct = req.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 415 });
  }

  // 3. Rate limit
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes before trying again." },
      { status: 429 }
    );
  }

  // 4. Parse body (with size guard)
  let raw: unknown;
  try {
    const text = await req.text();
    if (text.length > 8000) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }
    raw = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 5. Zod validation
  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: firstError }, { status: 422 });
  }

  // 6. Honeypot check (redundant after Zod but explicit is better)
  if (parsed.data.website) {
    // Silently succeed so bots think they won
    return NextResponse.json({ success: true });
  }

  // 7. Send
  try {
    await sendEmail(parsed.data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}