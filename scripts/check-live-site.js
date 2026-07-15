const assert = require("assert");

const baseUrl = process.argv[2] || "https://agnezukienepage.petrauskaiteagne.workers.dev";
const htmlPages = [
  "/",
  "/apie",
  "/paslaugos",
  "/konsultacijos",
  "/duk",
  "/kontaktai",
  "/privatumo-politika",
  "/slapuku-politika"
];
const legacyHtmlPages = htmlPages.filter((page) => page !== "/").map((page) => `${page}.html`);

const requiredHeaders = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "x-frame-options": "DENY"
};

async function readJsonMessage(response) {
  const body = await response.json();
  assert.strictEqual(typeof body.message, "string", "API response should include JSON message");
  return body.message;
}

function assertSecurityHeaders(response, source) {
  for (const [header, expected] of Object.entries(requiredHeaders)) {
    assert.strictEqual(response.headers.get(header), expected, `${source}: expected ${header}: ${expected}`);
  }
}

async function main() {
  const parsedBaseUrl = new URL(baseUrl);

  for (const page of htmlPages) {
    const response = await fetch(new URL(page, baseUrl));
    assert.strictEqual(response.status, 200, `${page}: expected 200, got ${response.status}`);
    assertSecurityHeaders(response, page);

    const text = await response.text();
    assert(text.includes("<html lang=\"lt\">"), `${page}: missing Lithuanian html lang`);
    assert(!/lorem ipsum|TODO/i.test(text), `${page}: contains placeholder text`);
  }

  const robotsResponse = await fetch(new URL("/robots.txt", baseUrl));
  assert.strictEqual(robotsResponse.status, 200, `/robots.txt: expected 200, got ${robotsResponse.status}`);
  const robotsText = await robotsResponse.text();
  assert(robotsText.includes("User-agent: *"), "/robots.txt: missing User-agent");
  assert(robotsText.includes("Allow: /"), "/robots.txt: missing Allow");
  assert(robotsText.includes("Sitemap: https://agnezukiene.lt/sitemap.xml"), "/robots.txt: missing production sitemap");

  const sitemapResponse = await fetch(new URL("/sitemap.xml", baseUrl));
  assert.strictEqual(sitemapResponse.status, 200, `/sitemap.xml: expected 200, got ${sitemapResponse.status}`);
  const sitemapText = await sitemapResponse.text();
  assert(sitemapText.includes("<urlset"), "/sitemap.xml: missing urlset");
  assert(!sitemapText.includes(".html</loc>"), "/sitemap.xml: URLs should be extensionless");
  assert(!sitemapText.includes("https://agnezukiene.lt/404"), "/sitemap.xml: should not include 404");
  for (const page of htmlPages) {
    const expectedUrl = page === "/" ? "https://agnezukiene.lt/" : `https://agnezukiene.lt${page}`;
    assert(sitemapText.includes(`<loc>${expectedUrl}</loc>`), `/sitemap.xml: missing ${expectedUrl}`);
  }

  const notFoundResponse = await fetch(new URL("/neegzistuojantis-puslapis", baseUrl), {
    redirect: "manual"
  });
  assert.strictEqual(
    notFoundResponse.status,
    404,
    `/neegzistuojantis-puslapis: expected 404, got ${notFoundResponse.status}`
  );
  assertSecurityHeaders(notFoundResponse, "/neegzistuojantis-puslapis");
  const notFoundText = await notFoundResponse.text();
  assert(notFoundText.includes("<html lang=\"lt\">"), "/neegzistuojantis-puslapis: missing Lithuanian html lang");
  assert(notFoundText.includes("Puslapis nerastas"), "/neegzistuojantis-puslapis: missing Lithuanian 404 content");

  if (parsedBaseUrl.hostname === "agnezukiene.lt") {
    for (const legacyPage of legacyHtmlPages) {
      const response = await fetch(new URL(legacyPage, baseUrl), { redirect: "manual" });
      assert.strictEqual(response.status, 307, `${legacyPage}: expected 307, got ${response.status}`);
      assert.strictEqual(
        response.headers.get("location"),
        legacyPage.replace(/\.html$/, ""),
        `${legacyPage}: expected redirect to extensionless URL`
      );
    }

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
  assertSecurityHeaders(contactGetResponse, "/api/contact GET");
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
