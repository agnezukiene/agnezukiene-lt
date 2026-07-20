const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

const MAX_CONTACT_BODY_BYTES = 10000;
const STATIC_ASSET_VERSION = "21d3d5904b8e";

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'none'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' https://www.googletagmanager.com https://challenges.cloudflare.com 'sha256-/raimQxqzYInYMMY3ytAcJrfim3+mrjSsXYwV/1mthI=' 'sha256-S/FPsvSpXLfY4jhsy+ri9ZuT+nt2j8kq137it2pvg84=' 'sha256-1miY1DXof+qP4Bl5UIgmkipjhA4lLNWWI+NSc0bXNbc=' 'sha256-qnlMThNCXqaxMkn2e7z5pyDmjvZu6Mr93H79eSdmKCQ='",
  "style-src 'self'",
  "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self'",
  "frame-src https://challenges.cloudflare.com",
  "connect-src 'self' https://challenges.cloudflare.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "upgrade-insecure-requests"
].join("; ");

const SECURITY_HEADERS = {
  "content-security-policy": CONTENT_SECURITY_POLICY,
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "x-frame-options": "DENY",
  "strict-transport-security": "max-age=31536000"
};

const TOPIC_LABELS = {
  adult: "Suaugusiojo konsultacija",
  teen: "Paauglio konsultacija",
  child: "Vaiko konsultacija",
  parents: "Tėvų konsultacija",
  education: "Psichoedukacija",
  career: "Karjeros / savęs pažinimo klausimas",
  other: "Kita"
};

const FORMAT_LABELS = {
  live: "Gyvai",
  online: "Nuotoliu",
  unknown: "Dar nežinau"
};

const REPLY_LABELS = {
  email: "El. paštu",
  phone: "Telefonu",
  either: "Tinka abu būdai"
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "www.agnezukiene.lt") {
      url.hostname = "agnezukiene.lt";
      return withSecurityHeaders(Response.redirect(url.toString(), 301));
    }

    if (url.pathname === "/api/contact") {
      return handleContact(request, env);
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (request.method === "GET" && assetResponse.status === 404) {
      const notFoundUrl = new URL("/404", request.url);
      const notFoundResponse = await env.ASSETS.fetch(new Request(notFoundUrl, request));
      if (notFoundResponse.ok) {
        return withSecurityHeaders(new Response(notFoundResponse.body, {
          status: 404,
          headers: notFoundResponse.headers
        }));
      }
    }

    return withSecurityHeaders(withAssetCacheHeaders(assetResponse, url));
  }
};

async function handleContact(request, env) {
  if (request.method !== "POST") {
    return json({ message: "Leidžiamas tik POST metodas." }, 405);
  }

  const origin = request.headers.get("origin");
  if (env.ALLOWED_ORIGIN && origin !== env.ALLOWED_ORIGIN) {
    return json({ message: "Užklausa negalima iš šio adreso." }, 403);
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ message: "Kontaktų forma priima tik JSON duomenis." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_CONTACT_BODY_BYTES) {
    return json({ message: "Formos duomenų kiekis per didelis." }, 413);
  }

  let body;
  try {
    const text = await request.text();
    if (text.length > MAX_CONTACT_BODY_BYTES) {
      return json({ message: "Formos duomenų kiekis per didelis." }, 413);
    }
    body = JSON.parse(text);
  } catch (error) {
    return json({ message: "Nepavyko perskaityti formos duomenų." }, 400);
  }

  const data = normalizeContact(body);
  if (data.website) {
    return json({ message: "Užklausa išsiųsta." }, 200);
  }

  const validationError = validateContact(data);
  if (validationError) {
    return json({ message: validationError }, 400);
  }

  if (
    !env.ALLOWED_ORIGIN
    || !env.TURNSTILE_SECRET_KEY
    || !env.RESEND_API_KEY
    || !env.CONTACT_TO_EMAIL
    || !env.CONTACT_FROM_EMAIL
  ) {
    return json({ message: "Kontaktų forma dar nėra pilnai sukonfigūruota." }, 503);
  }

  let turnstileOk = false;
  try {
    turnstileOk = await verifyTurnstile({
      token: data.turnstileToken,
      secret: env.TURNSTILE_SECRET_KEY,
      ip: request.headers.get("CF-Connecting-IP"),
      expectedHostname: new URL(env.ALLOWED_ORIGIN).hostname,
      expectedAction: "contact"
    });
  } catch (error) {
    turnstileOk = false;
  }

  if (!turnstileOk) {
    return json({ message: "Nepavyko patvirtinti, kad formą siunčia žmogus." }, 400);
  }

  let emailResponse;
  try {
    emailResponse = await sendEmail(data, env);
  } catch (error) {
    return json({ message: "Šiuo metu formos išsiųsti nepavyko." }, 502);
  }
  if (!emailResponse.ok) {
    return json({ message: "Šiuo metu formos išsiųsti nepavyko." }, 502);
  }

  return json({ message: "Užklausa išsiųsta." }, 200);
}

function normalizeContact(body) {
  return {
    name: clean(body.name, 80),
    email: clean(body.email, 120),
    phone: clean(body.phone, 40),
    replyBy: clean(body.replyBy, 20),
    format: clean(body.format, 20),
    topic: clean(body.topic, 30),
    message: clean(body.message, 1200),
    website: clean(body.website, 120),
    turnstileToken: clean(body.turnstileToken, 2048)
  };
}

function clean(value, maxLength) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function validateContact(data) {
  if (!data.name) return "Įrašykite vardą.";
  if (!data.email && !data.phone) return "Įrašykite el. paštą arba telefoną.";
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Patikrinkite el. pašto adresą.";
  if (!REPLY_LABELS[data.replyBy]) return "Pasirinkite, kaip patogiausia atsakyti.";
  if (data.replyBy === "email" && !data.email) return "Pasirinkote atsakymą el. paštu, todėl įrašykite el. pašto adresą.";
  if (data.replyBy === "phone" && !data.phone) return "Pasirinkote atsakymą telefonu, todėl įrašykite telefono numerį.";
  if (!FORMAT_LABELS[data.format]) return "Pasirinkite konsultacijos formatą.";
  if (!TOPIC_LABELS[data.topic]) return "Pasirinkite bendrą temą.";
  return "";
}

async function verifyTurnstile({ token, secret, ip, expectedHostname, expectedAction }) {
  if (!token) return false;

  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form
  });

  if (!response.ok) return false;
  const result = await response.json();
  return result.success === true
    && result.hostname === expectedHostname
    && result.action === expectedAction;
}

async function sendEmail(data, env) {
  const subject = `Nauja užklausa iš agnezukiene.lt: ${TOPIC_LABELS[data.topic]}`;
  const text = [
    "Nauja užklausa iš agnezukiene.lt",
    "",
    `Vardas: ${data.name}`,
    `El. paštas: ${data.email || "-"}`,
    `Telefonas: ${data.phone || "-"}`,
    `Pageidaujamas atsakymo būdas: ${REPLY_LABELS[data.replyBy]}`,
    `Konsultacijos formatas: ${FORMAT_LABELS[data.format]}`,
    `Tema: ${TOPIC_LABELS[data.topic]}`,
    "",
    "Komentaras:",
    data.message || "-",
    "",
    "Pastaba: ši užklausa atėjo iš svetainės kontaktų formos. Joje neturėtų būti prašoma perteklinių jautrių duomenų."
  ].join("\n");

  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: data.email || undefined,
      subject,
      text
    })
  });
}

function json(payload, status) {
  return withSecurityHeaders(new Response(JSON.stringify(payload), {
    status,
    headers: JSON_HEADERS
  }));
}

function withAssetCacheHeaders(response, url) {
  const cached = new Response(response.body, response);
  if (response.ok && /^\/assets\/(?:css|js)\//.test(url.pathname) && url.searchParams.get("v") === STATIC_ASSET_VERSION) {
    cached.headers.set("cache-control", "public, max-age=31536000, immutable");
  } else if (response.ok && (url.pathname.startsWith("/assets/images/") || url.pathname === "/favicon.svg")) {
    cached.headers.set("cache-control", "public, max-age=604800, stale-while-revalidate=86400");
  }
  return cached;
}

function withSecurityHeaders(response) {
  const secured = new Response(response.body, response);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    secured.headers.set(name, value);
  }
  return secured;
}
