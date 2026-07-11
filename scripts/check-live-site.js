const assert = require("assert");

const baseUrl = process.argv[2] || "https://agnezukienepage.petrauskaiteagne.workers.dev";
const pages = [
  "/",
  "/apie.html",
  "/paslaugos.html",
  "/konsultacijos.html",
  "/duk.html",
  "/kontaktai.html",
  "/privatumo-politika.html",
  "/slapuku-politika.html",
  "/robots.txt",
  "/sitemap.xml"
];

const requiredHeaders = [
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
  "x-frame-options"
];

async function readJsonMessage(response) {
  const body = await response.json();
  assert.strictEqual(typeof body.message, "string", "API response should include JSON message");
  return body.message;
}

async function main() {
  const parsedBaseUrl = new URL(baseUrl);

  for (const page of pages) {
    const response = await fetch(new URL(page, baseUrl));
    assert.strictEqual(response.status, 200, `${page}: expected 200, got ${response.status}`);

    if (page === "/" || page.endsWith(".html")) {
      for (const header of requiredHeaders) {
        assert(response.headers.get(header), `${page}: missing ${header}`);
      }

      const text = await response.text();
      assert(text.includes("<html lang=\"lt\">"), `${page}: missing Lithuanian html lang`);
      assert(!/lorem ipsum|TODO/i.test(text), `${page}: contains placeholder text`);
    }
  }

  const notFoundResponse = await fetch(new URL("/neegzistuojantis-puslapis", baseUrl), {
    redirect: "manual"
  });
  assert.strictEqual(
    notFoundResponse.status,
    404,
    `/neegzistuojantis-puslapis: expected 404, got ${notFoundResponse.status}`
  );

  if (parsedBaseUrl.hostname === "agnezukiene.lt") {
    const httpResponse = await fetch("http://agnezukiene.lt", { redirect: "manual" });
    assert.strictEqual(httpResponse.status, 301, `http://agnezukiene.lt: expected 301, got ${httpResponse.status}`);
    assert.strictEqual(
      httpResponse.headers.get("location"),
      "https://agnezukiene.lt/",
      "http://agnezukiene.lt: expected redirect to https://agnezukiene.lt/"
    );

    const wwwResponse = await fetch("https://www.agnezukiene.lt", { redirect: "manual" });
    assert.strictEqual(wwwResponse.status, 301, `https://www.agnezukiene.lt: expected 301, got ${wwwResponse.status}`);
    assert.strictEqual(
      wwwResponse.headers.get("location"),
      "https://agnezukiene.lt/",
      "https://www.agnezukiene.lt: expected redirect to https://agnezukiene.lt/"
    );
  }

  const contactGetResponse = await fetch(new URL("/api/contact", baseUrl));
  assert.strictEqual(contactGetResponse.status, 405, `/api/contact GET: expected 405, got ${contactGetResponse.status}`);
  for (const header of requiredHeaders) {
    assert(contactGetResponse.headers.get(header), `/api/contact GET: missing ${header}`);
  }
  assert(
    (await readJsonMessage(contactGetResponse)).includes("POST"),
    "/api/contact GET: expected POST-only message"
  );

  const contactOriginResponse = await fetch(new URL("/api/contact", baseUrl), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://example.com"
    },
    body: JSON.stringify({
      name: "Testas",
      email: "test@example.com",
      replyBy: "email",
      format: "unknown",
      topic: "other",
      privacy: true
    })
  });
  assert.strictEqual(contactOriginResponse.status, 403, `/api/contact origin: expected 403, got ${contactOriginResponse.status}`);
  assert(
    (await readJsonMessage(contactOriginResponse)).includes("negalima"),
    "/api/contact origin: expected origin rejection message"
  );

  const contactContentTypeResponse = await fetch(new URL("/api/contact", baseUrl), {
    method: "POST",
    body: JSON.stringify({
      name: "Testas",
      email: "test@example.com",
      replyBy: "email",
      format: "unknown",
      topic: "other",
      privacy: true
    })
  });
  assert.strictEqual(
    contactContentTypeResponse.status,
    415,
    `/api/contact content-type: expected 415, got ${contactContentTypeResponse.status}`
  );
  assert(
    (await readJsonMessage(contactContentTypeResponse)).includes("JSON"),
    "/api/contact content-type: expected JSON requirement message"
  );

  const contactSizeResponse = await fetch(new URL("/api/contact", baseUrl), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Testas",
      email: "test@example.com",
      replyBy: "email",
      format: "unknown",
      topic: "other",
      message: "a".repeat(11000),
      privacy: true
    })
  });
  assert.strictEqual(contactSizeResponse.status, 413, `/api/contact size: expected 413, got ${contactSizeResponse.status}`);
  assert(
    (await readJsonMessage(contactSizeResponse)).includes("per didelis"),
    "/api/contact size: expected size rejection message"
  );

  const contactJsonResponse = await fetch(new URL("/api/contact", baseUrl), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{"
  });
  assert.strictEqual(contactJsonResponse.status, 400, `/api/contact invalid JSON: expected 400, got ${contactJsonResponse.status}`);
  assert(
    (await readJsonMessage(contactJsonResponse)).includes("Nepavyko perskaityti"),
    "/api/contact invalid JSON: expected parse error message"
  );

  const contactValidationResponse = await fetch(new URL("/api/contact", baseUrl), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Testas",
      replyBy: "email",
      format: "unknown",
      topic: "other",
      privacy: true
    })
  });
  assert.strictEqual(contactValidationResponse.status, 400, `/api/contact validation: expected 400, got ${contactValidationResponse.status}`);
  assert(
    (await readJsonMessage(contactValidationResponse)).includes("el. paštą arba telefoną"),
    "/api/contact validation: expected missing contact message"
  );

  const contactResponse = await fetch(new URL("/api/contact", baseUrl), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Testas",
      email: "test@example.com",
      replyBy: "email",
      format: "unknown",
      topic: "other",
      privacy: true
    })
  });

  assert(
    [200, 400, 503].includes(contactResponse.status),
    `/api/contact: expected 200, turnstile 400, or setup-pending 503, got ${contactResponse.status}`
  );

  const contactText = await contactResponse.text();
  assert(contactText.includes("message"), "/api/contact: expected JSON message");

  if (contactResponse.status === 400) {
    assert(
      contactText.includes("Nepavyko patvirtinti"),
      "/api/contact: expected Turnstile verification message for 400 response"
    );
  }

  console.log(`Live site check passed for ${baseUrl}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
