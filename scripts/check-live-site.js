const assert = require("assert");

const baseUrl = process.argv[2] || "https://agnezukiene.lt";
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
const legacyHtmlPages = [
  { oldPath: "/index.html", newPath: "/" },
  ...htmlPages
    .filter((page) => page !== "/")
    .map((page) => ({ oldPath: `${page}.html`, newPath: page }))
];
const serviceSectionIds = ["suaugusiesiems", "paaugliams", "vaikams", "tevams"];

const requiredHeaders = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "x-frame-options": "DENY",
  "strict-transport-security": "max-age=31536000"
};

const requiredPolicyDirectives = [
  "default-src 'self'",
  "base-uri 'none'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "frame-src https://challenges.cloudflare.com",
  "upgrade-insecure-requests"
];

async function readJsonMessage(response) {
  const body = await response.json();
  assert.strictEqual(typeof body.message, "string", "API response should include JSON message");
  return body.message;
}

function assertSecurityHeaders(response, source) {
  for (const [header, expected] of Object.entries(requiredHeaders)) {
    assert.strictEqual(response.headers.get(header), expected, `${source}: expected ${header}: ${expected}`);
  }

  const policy = response.headers.get("content-security-policy") || "";
  for (const directive of requiredPolicyDirectives) {
    assert(policy.includes(directive), `${source}: missing Content Security Policy directive: ${directive}`);
  }
}

async function main() {
  const parsedBaseUrl = new URL(baseUrl);
  const productionOrigin = "https://agnezukiene.lt";
  let assetVersion = "";

  for (const page of htmlPages) {
    const response = await fetch(new URL(page, baseUrl));
    assert.strictEqual(response.status, 200, `${page}: expected 200, got ${response.status}`);
    assertSecurityHeaders(response, page);
    assert.strictEqual(
      response.headers.get("cache-control"),
      "public, max-age=0, must-revalidate",
      `${page}: page text should be revalidated so visitors receive updates`
    );

    const text = await response.text();
    assert(text.includes("<html lang=\"lt\">"), `${page}: missing Lithuanian html lang`);
    assert(!/lorem ipsum|TODO/i.test(text), `${page}: contains placeholder text`);
    assert(text.includes('<meta property="og:site_name" content="Agnė Žukienė">'), `${page}: missing social site name`);
    assert(text.includes('<meta property="og:locale" content="lt_LT">'), `${page}: missing Lithuanian social locale`);
    assert(
      text.includes('<meta property="og:image:alt" content="Psichologė Agnė Žukienė šviesiame kabinete">'),
      `${page}: missing social image description`
    );
    assert(text.includes('<meta name="twitter:card" content="summary">'), `${page}: missing compact social card`);
    const currentPageLinks = [...text.matchAll(/<a\b[^>]*\baria-current="page"[^>]*>/g)];
    assert.strictEqual(currentPageLinks.length, 1, `${page}: expected exactly one current-page link`);
    const currentHref = currentPageLinks[0][0].match(/\bhref="([^"]+)"/)?.[1];
    assert.strictEqual(currentHref, page, `${page}: current-page link should point to the current page`);
    if (["/", "/konsultacijos", "/kontaktai"].includes(page)) {
      assert(text.includes('href="tel:112"'), `${page}: missing direct 112 call link`);
    }
    if (["/", "/konsultacijos"].includes(page)) {
      assert(
        text.includes('href="https://pagalbasau.lt/gauk-pagalba/"'),
        `${page}: missing official emotional support options link`
      );
    }
    if (page === "/") {
      assert(
        text.includes('<p class="eyebrow">Psichologė Palangoje ir Klaipėdos regione</p>'),
        `${page}: homepage should use confirmed regional wording`
      );
      assert(!text.includes("Klaipėdos regione ir nuotoliu"), `${page}: homepage should not promise an unconfirmed remote format`);
      assert(!/"areaServed"\s*:\s*\[[^\]]*"Lietuva"/.test(text), `${page}: structured service area should stay regional`);
      for (const sectionId of serviceSectionIds) {
        assert(
          text.includes(`href="/paslaugos#${sectionId}"`),
          `${page}: missing direct link to service section ${sectionId}`
        );
      }
    }
    if (page === "/paslaugos") {
      for (const sectionId of serviceSectionIds) {
        assert(text.includes(`id="${sectionId}"`), `${page}: missing linked service section ${sectionId}`);
      }
    }
    if (page === "/duk") {
      const visibleFaqs = [...text.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary><p>([^<]+)<\/p><\/details>/g)]
        .map((match) => ({ question: match[1], answer: match[2] }));
      const faqSchemas = [...text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
        .map((match) => JSON.parse(match[1]));
      const faqSchema = faqSchemas.find((schema) => schema["@type"] === "FAQPage");
      const structuredFaqs = Array.isArray(faqSchema?.mainEntity)
        ? faqSchema.mainEntity.map((item) => ({
            question: item.name,
            answer: item.acceptedAnswer?.text
          }))
        : [];
      assert.strictEqual(visibleFaqs.length, 5, `${page}: expected 5 visible questions`);
      assert.deepStrictEqual(structuredFaqs, visibleFaqs, `${page}: structured questions should match visible content`);
    }
    if (["/", "/apie", "/paslaugos", "/konsultacijos", "/duk"].includes(page)) {
      assert(
        text.includes('href="/kontaktai" data-event="contact_intent_click"'),
        `${page}: main content should provide a direct contact action`
      );
    }
    assert(
      text.includes('href="/slapuku-politika">Plačiau apie slapukus</a>')
        && text.includes('data-cookie-decline>Neleisti matavimo</button>')
        && text.includes('data-cookie-accept>Leisti matavimą</button>'),
      `${page}: cookie choices should be clear and link to their explanation`
    );
    if (page === "/kontaktai") {
      assert(text.includes('maxlength="1200" aria-describedby="message-count form-status"'), `${page}: missing message limit`);
      assert(text.includes('data-message-count-live aria-live="polite"'), `${page}: missing accessible message count`);
      assert(
        text.includes('id="contact-method-help">Įrašykite bent vieną: el. pašto adresą arba telefono numerį.'),
        `${page}: missing contact method guidance`
      );
      assert(
        text.includes('id="phone" name="phone" type="tel"')
          && text.includes('aria-describedby="contact-method-help form-status"'),
        `${page}: phone field should refer to contact guidance and form status`
      );
      assert(
        text.includes('<p class="form-fallback">')
          && text.includes('href="mailto:zukiene.agne@gmail.com"')
          && text.includes('<div class="contact-form-fields">'),
        `${page}: unavailable form should provide a direct email fallback`
      );
    }
    for (const match of text.matchAll(/<a\b([^>]*)target="_blank"([^>]*)>([\s\S]*?)<\/a>/g)) {
      assert(/\brel="[^"]*\bnoopener\b[^"]*"/.test(`${match[1]} ${match[2]}`), `${page}: new-window link should use noopener`);
      assert(match[3].includes("atsidarys naujame lange"), `${page}: new-window link should announce its behavior`);
    }
    if (page === "/privatumo-politika") {
      for (const disclosure of [
        "per vieną mėnesį",
        "https://www.cloudflare.com/policies/privacy/",
        "https://resend.com/legal/privacy-policy",
        "https://policies.google.com/privacy"
      ]) {
        assert(text.includes(disclosure), `${page}: missing privacy disclosure ${disclosure}`);
      }
    }
    const pageAssetVersion = text.match(/\/assets\/css\/styles\.css\?v=([a-f0-9]{12})/)?.[1] || "";
    assert(pageAssetVersion, `${page}: missing versioned stylesheet`);
    if (!assetVersion) assetVersion = pageAssetVersion;
    assert.strictEqual(pageAssetVersion, assetVersion, `${page}: asset version differs from the homepage`);
    assert(text.includes(`/assets/js/config.js?v=${assetVersion}`), `${page}: missing versioned config.js`);
    assert(text.includes(`/assets/js/site.js?v=${assetVersion}`), `${page}: missing versioned site.js`);
  }

  for (const asset of [
    `/assets/css/styles.css?v=${assetVersion}`,
    `/assets/js/config.js?v=${assetVersion}`,
    `/assets/js/site.js?v=${assetVersion}`
  ]) {
    const assetResponse = await fetch(new URL(asset, baseUrl));
    assert.strictEqual(assetResponse.status, 200, `${asset}: expected 200, got ${assetResponse.status}`);
    assert.strictEqual(
      assetResponse.headers.get("cache-control"),
      "public, max-age=31536000, immutable",
      `${asset}: expected long browser cache for the versioned file`
    );
    if (asset.startsWith("/assets/css/")) {
      const css = await assetResponse.text();
      assert(css.includes("scroll-margin-top: 6rem"), `${asset}: linked service sections should clear the sticky header`);
    }
  }

  const robotsResponse = await fetch(new URL("/robots.txt", baseUrl));
  assert.strictEqual(robotsResponse.status, 200, `/robots.txt: expected 200, got ${robotsResponse.status}`);
  assert.strictEqual(
    robotsResponse.headers.get("cache-control"),
    "public, max-age=0, must-revalidate",
    "/robots.txt: search instructions should be revalidated"
  );
  const robotsText = await robotsResponse.text();
  assert(robotsText.includes("User-agent: *"), "/robots.txt: missing User-agent");
  assert(robotsText.includes("Allow: /"), "/robots.txt: missing Allow");
  assert(robotsText.includes("Sitemap: https://agnezukiene.lt/sitemap.xml"), "/robots.txt: missing production sitemap");

  const sitemapResponse = await fetch(new URL("/sitemap.xml", baseUrl));
  assert.strictEqual(sitemapResponse.status, 200, `/sitemap.xml: expected 200, got ${sitemapResponse.status}`);
  assert.strictEqual(
    sitemapResponse.headers.get("cache-control"),
    "public, max-age=0, must-revalidate",
    "/sitemap.xml: page list should be revalidated"
  );
  const sitemapText = await sitemapResponse.text();
  assert(sitemapText.includes("<urlset"), "/sitemap.xml: missing urlset");
  assert(!sitemapText.includes(".html</loc>"), "/sitemap.xml: URLs should be extensionless");
  assert(!sitemapText.includes("https://agnezukiene.lt/404"), "/sitemap.xml: should not include 404");
  for (const page of htmlPages) {
    const expectedUrl = page === "/" ? "https://agnezukiene.lt/" : `https://agnezukiene.lt${page}`;
    assert(sitemapText.includes(`<loc>${expectedUrl}</loc>`), `/sitemap.xml: missing ${expectedUrl}`);
  }

  const faviconResponse = await fetch(new URL("/favicon.svg", baseUrl));
  assert.strictEqual(faviconResponse.status, 200, `/favicon.svg: expected 200, got ${faviconResponse.status}`);
  assert(
    (faviconResponse.headers.get("content-type") || "").includes("image/svg+xml"),
    "/favicon.svg: expected SVG content type"
  );
  assert((await faviconResponse.text()).includes("<svg"), "/favicon.svg: missing SVG content");
  assert.strictEqual(
    faviconResponse.headers.get("cache-control"),
    "public, max-age=604800, stale-while-revalidate=86400",
    "/favicon.svg: expected one-week browser cache"
  );

  for (const image of [
    "/assets/images/agne-zukiene-psichologe-sidabro-pienas-480w.avif",
    "/assets/images/agne-zukiene-psichologe-sidabro-pienas-768w.webp",
    "/assets/images/agne-zukiene-psichologe-sidabro-pienas-1089w.avif"
  ]) {
    const imageResponse = await fetch(new URL(image, baseUrl));
    assert.strictEqual(imageResponse.status, 200, `${image}: expected 200, got ${imageResponse.status}`);
    assert(
      (imageResponse.headers.get("content-type") || "").startsWith("image/"),
      `${image}: expected image content type`
    );
    assert.strictEqual(
      imageResponse.headers.get("cache-control"),
      "public, max-age=604800, stale-while-revalidate=86400",
      `${image}: expected one-week browser cache`
    );
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
  assert.strictEqual(
    notFoundResponse.headers.get("cache-control"),
    "public, max-age=0, must-revalidate",
    "/neegzistuojantis-puslapis: error page should be revalidated"
  );
  const notFoundText = await notFoundResponse.text();
  assert(notFoundText.includes("<html lang=\"lt\">"), "/neegzistuojantis-puslapis: missing Lithuanian html lang");
  assert(notFoundText.includes("Puslapis nerastas"), "/neegzistuojantis-puslapis: missing Lithuanian 404 content");

  if (parsedBaseUrl.hostname === "agnezukiene.lt") {
    const workersDevResponse = await fetch("https://agnezukienepage.petrauskaiteagne.workers.dev/", {
      redirect: "manual"
    });
    assert.strictEqual(
      workersDevResponse.status,
      404,
      `Public workers.dev copy should stay disabled, got ${workersDevResponse.status}`
    );

    for (const { oldPath, newPath } of legacyHtmlPages) {
      const response = await fetch(new URL(`${oldPath}?is=senas`, baseUrl), { redirect: "manual" });
      assert.strictEqual(response.status, 301, `${oldPath}: expected 301, got ${response.status}`);
      assert.strictEqual(
        response.headers.get("location"),
        `https://agnezukiene.lt${newPath}?is=senas`,
        `${oldPath}: expected permanent redirect to the clean URL while preserving the query`
      );
      assertSecurityHeaders(response, `${oldPath} redirect`);
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
    assertSecurityHeaders(wwwResponse, "https://www.agnezukiene.lt redirect");
  }

  const contactGetResponse = await fetch(new URL("/api/contact", baseUrl));
  assert.strictEqual(contactGetResponse.status, 405, `/api/contact GET: expected 405, got ${contactGetResponse.status}`);
  assert.strictEqual(contactGetResponse.headers.get("allow"), "POST", "/api/contact GET should explain the allowed method");
  assert.strictEqual(contactGetResponse.headers.get("cache-control"), "no-store", "/api/contact GET should not be cached");
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
      topic: "other"
    })
  });
  assert.strictEqual(contactOriginResponse.status, 403, `/api/contact origin: expected 403, got ${contactOriginResponse.status}`);
  assert(
    (await readJsonMessage(contactOriginResponse)).includes("negalima"),
    "/api/contact origin: expected origin rejection message"
  );

  const contactContentTypeResponse = await fetch(new URL("/api/contact", baseUrl), {
    method: "POST",
    headers: { origin: productionOrigin },
    body: JSON.stringify({
      name: "Testas",
      email: "test@example.com",
      replyBy: "email",
      format: "unknown",
      topic: "other"
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
    headers: { "content-type": "application/json", origin: productionOrigin },
    body: JSON.stringify({
      name: "Testas",
      email: "test@example.com",
      replyBy: "email",
      format: "unknown",
      topic: "other",
      message: "a".repeat(11000)
    })
  });
  assert.strictEqual(contactSizeResponse.status, 413, `/api/contact size: expected 413, got ${contactSizeResponse.status}`);
  assert(
    (await readJsonMessage(contactSizeResponse)).includes("per didelis"),
    "/api/contact size: expected size rejection message"
  );

  const contactJsonResponse = await fetch(new URL("/api/contact", baseUrl), {
    method: "POST",
    headers: { "content-type": "application/json", origin: productionOrigin },
    body: "{"
  });
  assert.strictEqual(contactJsonResponse.status, 400, `/api/contact invalid JSON: expected 400, got ${contactJsonResponse.status}`);
  assert(
    (await readJsonMessage(contactJsonResponse)).includes("Nepavyko perskaityti"),
    "/api/contact invalid JSON: expected parse error message"
  );

  const contactValidationResponse = await fetch(new URL("/api/contact", baseUrl), {
    method: "POST",
    headers: { "content-type": "application/json", origin: productionOrigin },
    body: JSON.stringify({
      name: "Testas",
      replyBy: "email",
      format: "unknown",
      topic: "other"
    })
  });
  assert.strictEqual(contactValidationResponse.status, 400, `/api/contact validation: expected 400, got ${contactValidationResponse.status}`);
  assert(
    (await readJsonMessage(contactValidationResponse)).includes("el. paštą arba telefoną"),
    "/api/contact validation: expected missing contact message"
  );

  const contactEmailChoiceResponse = await fetch(new URL("/api/contact", baseUrl), {
    method: "POST",
    headers: { "content-type": "application/json", origin: productionOrigin },
    body: JSON.stringify({
      name: "Testas",
      phone: "+37060000000",
      replyBy: "email",
      format: "unknown",
      topic: "other"
    })
  });
  assert.strictEqual(contactEmailChoiceResponse.status, 400, "/api/contact email choice: expected 400");
  assert(
    (await readJsonMessage(contactEmailChoiceResponse)).includes("įrašykite el. pašto adresą"),
    "/api/contact email choice: expected missing email message"
  );

  const contactPhoneChoiceResponse = await fetch(new URL("/api/contact", baseUrl), {
    method: "POST",
    headers: { "content-type": "application/json", origin: productionOrigin },
    body: JSON.stringify({
      name: "Testas",
      email: "test@example.com",
      replyBy: "phone",
      format: "unknown",
      topic: "other"
    })
  });
  assert.strictEqual(contactPhoneChoiceResponse.status, 400, "/api/contact phone choice: expected 400");
  assert(
    (await readJsonMessage(contactPhoneChoiceResponse)).includes("įrašykite telefono numerį"),
    "/api/contact phone choice: expected missing phone message"
  );

  const contactInvalidPhoneResponse = await fetch(new URL("/api/contact", baseUrl), {
    method: "POST",
    headers: { "content-type": "application/json", origin: productionOrigin },
    body: JSON.stringify({
      name: "Testas",
      phone: "telefonas",
      replyBy: "phone",
      format: "unknown",
      topic: "other"
    })
  });
  assert.strictEqual(contactInvalidPhoneResponse.status, 400, "/api/contact invalid phone: expected 400");
  assert(
    (await readJsonMessage(contactInvalidPhoneResponse)).includes("Patikrinkite telefono numerį"),
    "/api/contact invalid phone: expected readable phone error"
  );

  const contactResponse = await fetch(new URL("/api/contact", baseUrl), {
    method: "POST",
    headers: { "content-type": "application/json", origin: productionOrigin },
    body: JSON.stringify({
      name: "Testas",
      email: "test@example.com",
      replyBy: "email",
      format: "unknown",
      topic: "other"
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
