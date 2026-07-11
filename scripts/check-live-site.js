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
