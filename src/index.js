const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8"
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

    if (url.pathname === "/api/contact") {
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  }
};

async function handleContact(request, env) {
  if (request.method !== "POST") {
    return json({ message: "Leidžiamas tik POST metodas." }, 405);
  }

  const origin = request.headers.get("origin");
  if (env.ALLOWED_ORIGIN && origin && origin !== env.ALLOWED_ORIGIN) {
    return json({ message: "Užklausa negalima iš šio adreso." }, 403);
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return json({ message: "Nepavyko perskaityti formos duomenų." }, 400);
  }

  const data = normalizeContact(body);
  const validationError = validateContact(data);
  if (validationError) {
    return json({ message: validationError }, 400);
  }

  if (env.TURNSTILE_SECRET_KEY) {
    const turnstileOk = await verifyTurnstile({
      token: data.turnstileToken,
      secret: env.TURNSTILE_SECRET_KEY,
      ip: request.headers.get("CF-Connecting-IP")
    });

    if (!turnstileOk) {
      return json({ message: "Nepavyko patvirtinti, kad formą siunčia žmogus." }, 400);
    }
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    return json({ message: "Kontaktų forma dar nėra pilnai sukonfigūruota." }, 503);
  }

  const emailResponse = await sendEmail(data, env);
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
    privacy: body.privacy === "on" || body.privacy === true,
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
  if (!FORMAT_LABELS[data.format]) return "Pasirinkite konsultacijos formatą.";
  if (!TOPIC_LABELS[data.topic]) return "Pasirinkite bendrą temą.";
  if (!data.privacy) return "Patvirtinkite privatumo sutikimą.";
  return "";
}

async function verifyTurnstile({ token, secret, ip }) {
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
  return result.success === true;
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
  return new Response(JSON.stringify(payload), {
    status,
    headers: JSON_HEADERS
  });
}
