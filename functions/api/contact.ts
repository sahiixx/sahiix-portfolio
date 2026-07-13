// Cloudflare Pages Function — contact form endpoint.
// POST /api/contact  { name, email, message }
//
// Delivery model (honest, no fabricated sends):
//   • If RESEND_API_KEY is set, the message is forwarded to Resend and the
//     reply is delivered to CONTACT_TO (defaults to CONTACT_FROM). 200 on success.
//   • If no key is configured, returns 503 so the client falls back to mailto:.
//
// Configure in the Cloudflare Pages dashboard (Settings → Environment variables):
//   RESEND_API_KEY  – your Resend API key
//   CONTACT_FROM    – a sender on a Resend-verified domain, e.g. "Portfolio <mail@yourdomain.com>"
//   CONTACT_TO      – where enquiries land (defaults to CONTACT_FROM)

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_FROM?: string;
  CONTACT_TO?: string;
}

// Minimal local shapes (Cloudflare provides its own at deploy time).
interface PagesEnv { env: Env; request: Request; }
type Handler = (ctx: PagesEnv) => Promise<Response> | Response;

const json = (status: number, body: unknown, headers?: HeadersInit) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...(headers as Record<string, string> | undefined) },
  });

export const onRequestPost: Handler = async ({ request, env }) => {
  // CORS — allow the deployed site (and localhost dev) to call this.
  const origin = request.headers.get("Origin") || "";
  const cors = { "Access-Control-Allow-Origin": origin || "*", "Access-Control-Allow-Headers": "Content-Type", "Vary": "Origin" };

  let payload: { name?: string; email?: string; message?: string };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return json(400, { ok: false, error: "Invalid JSON body." });
  }

  const name = String(payload.name || "").trim().slice(0, 120);
  const email = String(payload.email || "").trim().slice(0, 200);
  const message = String(payload.message || "").trim().slice(0, 8000);

  if (!name || !email || !message) {
    return json(422, { ok: false, error: "name, email, and message are required." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(422, { ok: false, error: "Invalid email address." });
  }

  if (!env.RESEND_API_KEY) {
    // No delivery configured — signal the client to fall back to mailto.
    return json(503, { ok: false, error: "Email delivery not configured.", fallback: "mailto" }, cors);
  }

  const from = env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>";
  const to = env.CONTACT_TO || from;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject: `Portfolio enquiry from ${name}`,
        text: `${message}\n\n— ${name} (${email})`,
      }),
    });
    if (!r.ok) {
      const err = await r.text().catch(() => "");
      return json(502, { ok: false, error: "Email provider rejected the send.", detail: err.slice(0, 300) }, cors);
    }
    return json(200, { ok: true }, cors);
  } catch (err) {
    return json(502, { ok: false, error: "Failed to reach email provider.", detail: String(err).slice(0, 200) }, cors);
  }
};

// Preflight
export const onRequestOptions: Handler = async () =>
  new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });