const fs = require("fs");
const path = require("path");

const root = process.cwd();
const siteRoot = path.join(root, "public");
const htmlFiles = fs.readdirSync(siteRoot).filter((file) => file.endsWith(".html"));
const requiredFiles = [
  "public/assets/css/styles.css",
  "public/assets/js/config.js",
  "public/assets/js/site.js",
  "public/favicon.svg",
  "public/_headers",
  "public/sitemap.xml",
  "public/robots.txt",
  "data/analytics-events.json",
  "data/site-content-registry.json",
  "docs/content-approval.md",
  "docs/launch-readiness.md",
  "docs/manual-setup-queue.md",
  "docs/search-console-review-2026-07-21.md",
  "docs/seo-inventory.md",
  "scripts/generate-launch-readiness.js",
  "scripts/pre-go-live.js",
  "scripts/check-color-contrast.js",
  "scripts/check-content-security-policy.js",
  "scripts/check-static-asset-cache.js",
  "scripts/check-live-site.js",
  "src/index.js",
  "wrangler.jsonc"
];
const errors = [];
const canonicalUrls = new Set();
const technicalPages = new Set(["404.html"]);
const socialImageUrl = "https://agnezukiene.lt/assets/images/agne-zukiene-psichologe-sidabro-pienas.jpg";

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function readSite(file) {
  return fs.readFileSync(path.join(siteRoot, file), "utf8");
}

function routeFor(file) {
  return file === "index.html" ? "/" : `/${file.replace(/\.html$/, "")}`;
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    errors.push(`Missing required file: ${file}`);
  }
}

if (
  !read("src/index.js").includes('url.pathname.endsWith(".html")')
  || !read("src/index.js").includes("Response.redirect(url.toString(), 301)")
) {
  errors.push("src/index.js: missing permanent redirect from legacy .html URLs");
}

for (const file of htmlFiles) {
  const html = readSite(file);
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  const expectedUrl = `https://agnezukiene.lt${routeFor(file)}`;
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
  const ogUrlMatch = html.match(/<meta property="og:url" content="([^"]+)"/);
  const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);

  if (!/<main[\s>]/.test(html)) errors.push(`${file}: missing main landmark`);
  if (!technicalPages.has(file) && !/<a class="skip-link" href="#turinys">/.test(html)) {
    errors.push(`${file}: missing skip link to main content`);
  }
  if (!technicalPages.has(file) && !/<main[^>]*id="turinys"[^>]*tabindex="-1"/.test(html)) {
    errors.push(`${file}: main content should be focusable through the skip link`);
  }
  if (technicalPages.has(file) && !/<meta name="robots" content="noindex"/.test(html)) {
    errors.push(`${file}: technical page should be noindex`);
  }
  if (file !== "404.html" && !/<nav[^>]+aria-label="Pagrindinė navigacija"/.test(html)) {
    errors.push(`${file}: missing labelled primary navigation`);
  }
  if (file !== "404.html" && !/<button class="nav-toggle"[^>]+aria-expanded="false"[^>]+aria-controls="main-menu"/.test(html)) {
    errors.push(`${file}: missing accessible mobile nav toggle`);
  }
  if (file !== "404.html" && !/<div class="nav-links" id="main-menu"/.test(html)) {
    errors.push(`${file}: missing main-menu navigation target`);
  }
  if (!technicalPages.has(file)) {
    const currentPageLinks = [...html.matchAll(/<a\b[^>]*\baria-current="page"[^>]*>/g)];
    if (currentPageLinks.length !== 1) {
      errors.push(`${file}: expected exactly one current-page link, found ${currentPageLinks.length}`);
    } else {
      const currentHref = currentPageLinks[0][0].match(/\bhref="([^"]+)"/)?.[1];
      if (currentHref !== routeFor(file)) {
        errors.push(`${file}: current-page link should point to ${routeFor(file)}, found ${currentHref || "no href"}`);
      }
    }
  }
  if (file !== "404.html" && !/<div class="cookie-banner"[^>]+role="region"[^>]+aria-label="Slapukų pasirinkimas"/.test(html)) {
    errors.push(`${file}: cookie choice should have a labelled page region`);
  }
  if (!/<title>[^<]{10,}<\/title>/.test(html)) errors.push(`${file}: missing or too short title`);
  if (!/<meta name="theme-color" content="#[0-9a-fA-F]{6}">/.test(html)) errors.push(`${file}: missing theme color`);
  if (!/<link rel="icon" href="\/favicon\.svg" type="image\/svg\+xml">/.test(html)) errors.push(`${file}: missing SVG favicon link`);
  if (!/<meta name="description" content="[^"]{30,}"/.test(html)) errors.push(`${file}: missing meta description`);
  if (!/<link rel="canonical" href="https:\/\/agnezukiene\.lt\//.test(html)) errors.push(`${file}: missing canonical`);
  if (canonicalMatch && canonicalMatch[1] !== expectedUrl) errors.push(`${file}: canonical should be ${expectedUrl}`);
  if (canonicalMatch && canonicalMatch[1].endsWith(".html")) errors.push(`${file}: canonical should use an extensionless URL`);
  if (canonicalMatch && canonicalUrls.has(canonicalMatch[1])) errors.push(`${file}: duplicate canonical ${canonicalMatch[1]}`);
  if (canonicalMatch) canonicalUrls.add(canonicalMatch[1]);
  if (!/<meta property="og:title" content="[^"]+"/.test(html)) errors.push(`${file}: missing og:title`);
  if (!/<meta property="og:description" content="[^"]+"/.test(html)) errors.push(`${file}: missing og:description`);
  if (!html.includes('<meta property="og:site_name" content="Agnė Žukienė">')) errors.push(`${file}: missing og:site_name`);
  if (!html.includes('<meta property="og:locale" content="lt_LT">')) errors.push(`${file}: missing Lithuanian og:locale`);
  if (!ogUrlMatch) errors.push(`${file}: missing og:url`);
  if (ogUrlMatch && ogUrlMatch[1] !== expectedUrl) errors.push(`${file}: og:url should be ${expectedUrl}`);
  if (!ogImageMatch) {
    errors.push(`${file}: missing og:image`);
  } else if (ogImageMatch[1] !== socialImageUrl) {
    errors.push(`${file}: og:image should use the approved portrait`);
  } else if (!ogImageMatch[1].startsWith("https://agnezukiene.lt/")) {
    errors.push(`${file}: og:image should use the production domain`);
  } else {
    const imagePath = ogImageMatch[1].replace("https://agnezukiene.lt/", "");
    if (!fs.existsSync(path.join(siteRoot, imagePath))) errors.push(`${file}: og:image file does not exist: ${imagePath}`);
  }
  for (const socialSnippet of [
    '<meta property="og:image:width" content="1089">',
    '<meta property="og:image:height" content="1445">',
    '<meta property="og:image:alt" content="Psichologė Agnė Žukienė šviesiame kabinete">',
    '<meta name="twitter:card" content="summary">',
    `<meta name="twitter:image" content="${socialImageUrl}">`,
    '<meta name="twitter:image:alt" content="Psichologė Agnė Žukienė šviesiame kabinete">'
  ]) {
    if (!html.includes(socialSnippet)) errors.push(`${file}: missing social sharing metadata: ${socialSnippet}`);
  }
  if (file !== "404.html" && !html.includes('/assets/js/config.js')) errors.push(`${file}: missing config.js`);
  if (h1Count !== 1) errors.push(`${file}: expected exactly one h1, found ${h1Count}`);
  if (/lorem ipsum|TODO|href=""|href="#"/i.test(html)) errors.push(`${file}: contains placeholder text or empty link`);
  if (/href="\/[^"]+\.html(?:[#?"])/.test(html)) errors.push(`${file}: internal links should use extensionless URLs`);
  for (const match of html.matchAll(/<a\b[^>]*href="(\/[^"#?]*)/g)) {
    const route = match[1];
    const target = route === "/" ? "index.html" : `${route.slice(1)}.html`;
    if (!fs.existsSync(path.join(siteRoot, target))) {
      errors.push(`${file}: internal link ${route} has no matching ${target}`);
    }
  }
  if (/dar reikia patvirtinti|prieš viešą paleidimą|prieš publikavimą/i.test(html)) {
    errors.push(`${file}: contains internal pre-launch wording`);
  }
  if (/psichoterapeutė/i.test(html)) errors.push(`${file}: contains restricted qualification wording`);
  if (/garantuotas rezultatas|išgydysiu|greitas sprendimas/i.test(html)) errors.push(`${file}: contains overpromising wording`);

  for (const match of html.matchAll(/<button\b([^>]*)>/g)) {
    if (!/\btype="(button|submit|reset)"/.test(match[1])) {
      errors.push(`${file}: button missing explicit type`);
    }
  }

  for (const match of html.matchAll(/<(input|select|textarea)\b([^>]*)>/g)) {
    const [, element, attributes] = match;
    if (/\btype="hidden"/.test(attributes)) continue;
    if (/\btype="checkbox"/.test(attributes)) continue;
    const idMatch = attributes.match(/\bid="([^"]+)"/);
    if (!idMatch) {
      errors.push(`${file}: ${element} is missing id for its label`);
      continue;
    }
    if (!html.includes(`<label for="${idMatch[1]}"`) && !attributes.includes('type="checkbox"')) {
      errors.push(`${file}: ${element}#${idMatch[1]} is missing a matching label`);
    }
  }

  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      errors.push(`${file}: invalid JSON-LD`);
    }
  }
}

const sitemap = read("public/sitemap.xml");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const sitemapUrlSet = new Set(sitemapUrls);
if (sitemapUrls.length !== sitemapUrlSet.size) errors.push("sitemap.xml: contains duplicate URLs");
if (sitemapUrls.some((url) => url.endsWith(".html"))) errors.push("sitemap.xml: URLs should be extensionless");
if (sitemapUrls.includes("https://agnezukiene.lt/404")) errors.push("sitemap.xml: should not include 404");
for (const file of htmlFiles.filter((file) => file !== "404.html")) {
  const expected = `https://agnezukiene.lt${routeFor(file)}`;
  if (!sitemapUrlSet.has(expected)) {
    errors.push(`sitemap.xml: missing ${expected}`);
  }
}
for (const url of sitemapUrls) {
  const route = url.replace("https://agnezukiene.lt/", "");
  const file = route === "" ? "index.html" : `${route}.html`;
  if (!htmlFiles.includes(file)) errors.push(`sitemap.xml: URL has no matching HTML file: ${url}`);
}

const faqHtml = readSite("duk.html");
const visibleFaqs = [...faqHtml.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary><p>([^<]+)<\/p><\/details>/g)]
  .map((match) => ({ question: match[1], answer: match[2] }));
const faqSchemas = [...faqHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map((match) => JSON.parse(match[1]));
const faqSchema = faqSchemas.find((schema) => schema["@type"] === "FAQPage");
const structuredFaqs = Array.isArray(faqSchema?.mainEntity)
  ? faqSchema.mainEntity.map((item) => ({
      question: item.name,
      answer: item.acceptedAnswer?.text
    }))
  : [];
if (visibleFaqs.length !== 5) {
  errors.push(`duk.html: expected 5 visible questions, found ${visibleFaqs.length}`);
}
if (JSON.stringify(structuredFaqs) !== JSON.stringify(visibleFaqs)) {
  errors.push("duk.html: FAQ structured data should exactly match every visible question and answer");
}

const robots = read("public/robots.txt");
if (!/User-agent:\s*\*/.test(robots)) errors.push("robots.txt: missing User-agent: *");
if (!robots.includes("Sitemap: https://agnezukiene.lt/sitemap.xml")) errors.push("robots.txt: missing production sitemap URL");

const homeHtml = readSite("index.html");
const heroImagePath = "public/assets/images/agne-zukiene-psichologe-sidabro-pienas.jpg";
if (!homeHtml.includes('src="/assets/images/agne-zukiene-psichologe-sidabro-pienas.jpg"')) {
  errors.push("index.html: hero should use the optimized JPEG portrait");
}
for (const attribute of ['width="1089"', 'height="1445"', 'fetchpriority="high"', 'decoding="async"']) {
  if (!homeHtml.includes(attribute)) errors.push(`index.html: hero image missing ${attribute}`);
}
if (!fs.existsSync(path.join(root, heroImagePath))) {
  errors.push(`Missing required hero image: ${heroImagePath}`);
} else if (fs.statSync(path.join(root, heroImagePath)).size > 600 * 1024) {
  errors.push(`${heroImagePath}: hero image should stay below 600 KiB`);
}

for (const format of ["avif", "webp"]) {
  for (const width of [480, 768, 1089]) {
    const relativePath = `assets/images/agne-zukiene-psichologe-sidabro-pienas-${width}w.${format}`;
    const filePath = path.join(siteRoot, relativePath);
    if (!homeHtml.includes(`/${relativePath} ${width}w`)) {
      errors.push(`index.html: responsive hero image is missing from srcset: ${relativePath}`);
    }
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing responsive hero image: public/${relativePath}`);
    } else if (fs.statSync(filePath).size > 180 * 1024) {
      errors.push(`public/${relativePath}: responsive hero image should stay below 180 KiB`);
    }
  }
}
if (!homeHtml.includes('rel="preload" as="image" type="image/avif"')) {
  errors.push("index.html: responsive hero image should be discovered early through preload");
}

const registry = JSON.parse(read("data/site-content-registry.json"));
if (!Array.isArray(registry.pages) || registry.pages.length !== htmlFiles.length) {
  errors.push("data/site-content-registry.json: page count does not match HTML files");
}

const seoInventory = read("docs/seo-inventory.md");
for (const file of htmlFiles) {
  const route = routeFor(file);
  if (!seoInventory.includes(`| ${route} |`)) {
    errors.push(`docs/seo-inventory.md: missing ${route}`);
  }
}

const gitignore = read(".gitignore");
for (const pattern of [".env", "*.local", "*-oauth-token.json", ".dev.vars", "Agnes foto/", "tmp/"]) {
  if (!gitignore.includes(pattern)) errors.push(`.gitignore: missing ${pattern}`);
}

const wrangler = read("wrangler.jsonc");
if (!wrangler.includes('"main": "src/index.js"')) errors.push("wrangler.jsonc: missing worker main entry");
if (!wrangler.includes('"directory": "./public"')) errors.push("wrangler.jsonc: assets directory must be ./public");
if (!wrangler.includes('"binding": "ASSETS"')) errors.push("wrangler.jsonc: missing ASSETS binding");
if (!wrangler.includes('"run_worker_first": true')) errors.push("wrangler.jsonc: Worker must run before assets");
if (!wrangler.includes('"workers_dev": false')) errors.push("wrangler.jsonc: public workers.dev copy should stay disabled");
if (!wrangler.includes('"preview_urls": false')) errors.push("wrangler.jsonc: public Worker preview URLs should stay disabled");
if (!wrangler.includes('"CONTACT_TO_EMAIL": "zukiene.agne@gmail.com"')) errors.push("wrangler.jsonc: missing CONTACT_TO_EMAIL variable");
if (!wrangler.includes('"name": "CONTACT_RATE_LIMITER"')) errors.push("wrangler.jsonc: missing contact form rate limiter binding");
if (!wrangler.includes('"limit": 5') || !wrangler.includes('"period": 60')) {
  errors.push("wrangler.jsonc: contact form rate limiter should allow 5 submissions per minute");
}

const worker = read("src/index.js");
for (const requiredSnippet of ["/api/contact", "new URL(\"/404\"", "RESEND_API_KEY", "CONTACT_TO_EMAIL", "TURNSTILE_SECRET_KEY", "CONTACT_RATE_LIMITER", "env.ASSETS.fetch", "www.agnezukiene.lt", "x-content-type-options", "permissions-policy", "data.website", "origin !== env.ALLOWED_ORIGIN", "expectedHostname", "expectedAction"]) {
  if (!worker.includes(requiredSnippet)) errors.push(`src/index.js: missing ${requiredSnippet}`);
}

const contactHtml = readSite("kontaktai.html");
if (!contactHtml.includes('name="website"') || !contactHtml.includes("honeypot")) {
  errors.push("kontaktai.html: missing honeypot field");
}
if (!/<p class="form-note form-privacy">[\s\S]*href="\/privatumo-politika"[\s\S]*<\/p>/.test(contactHtml)) {
  errors.push("kontaktai.html: privacy notice should link to the privacy policy");
}
if (!/<p class="form-fallback">[\s\S]*href="mailto:zukiene\.agne@gmail\.com"[\s\S]*<\/p>/.test(contactHtml)) {
  errors.push("kontaktai.html: unavailable form should provide a direct email fallback");
}
if (!contactHtml.includes('<div class="contact-form-fields">')) {
  errors.push("kontaktai.html: working form fields should have a resilient visibility wrapper");
}
if (contactHtml.includes('name="privacy"') || worker.includes("data.privacy")) {
  errors.push("Contact form should provide a privacy notice without requesting unnecessary consent");
}
const siteScript = read("public/assets/js/site.js");
const siteStyles = read("public/assets/css/styles.css");
if (!siteScript.includes('document.documentElement.classList.add("has-js")')) {
  errors.push("site.js: mobile navigation should opt into the compact menu only after JavaScript loads");
}
if (!siteStyles.includes(".has-js .nav-toggle") || !siteStyles.includes(".has-js .nav-links")) {
  errors.push("styles.css: mobile navigation should remain visible when JavaScript is unavailable");
}
if (!siteStyles.includes(".contact-form-fields") || !siteStyles.includes(".has-js .contact-form-fields") || !siteStyles.includes(".has-js .form-fallback")) {
  errors.push("styles.css: contact form should swap to a direct email fallback when JavaScript is unavailable");
}
if (/font-size:\s*[^;]*(?:vw|vh)/.test(siteStyles)) {
  errors.push("styles.css: font sizes should use stable type scales instead of viewport-based scaling");
}
if (!siteStyles.includes(".hero h1") || !siteStyles.includes(".page-hero h1")) {
  errors.push("styles.css: homepage and inner-page headings should use separate type scales");
}
const indexHtml = readSite("index.html");
if (/<a class="brand"[^>]+aria-label=/.test(indexHtml)) {
  errors.push("index.html: visible brand text should provide its accessible name without an overriding label");
}
if (!indexHtml.includes('<p class="eyebrow">Psichologė Palangoje ir Klaipėdos regione</p>')) {
  errors.push("index.html: homepage should use the confirmed regional wording");
}
if (indexHtml.includes("Klaipėdos regione ir nuotoliu")) {
  errors.push("index.html: homepage should not promise an unconfirmed remote consultation format");
}
for (const [file, html] of [["index.html", indexHtml], ["paslaugos.html", readSite("paslaugos.html")]]) {
  if (!html.includes('"areaServed"') || !html.includes('"Palanga"') || !html.includes('"Klaipėdos regionas"')) {
    errors.push(`${file}: structured service area should use the confirmed region`);
  }
  if (/"areaServed"\s*:\s*"Lietuva"/.test(html) || /"areaServed"\s*:\s*\[[^\]]*"Lietuva"/.test(html)) {
    errors.push(`${file}: structured service area should not claim an unconfirmed nationwide service`);
  }
}
const consultationHtml = readSite("konsultacijos.html");
for (const file of ["index.html", "apie.html", "paslaugos.html", "konsultacijos.html", "duk.html"]) {
  const html = readSite(file);
  if (!html.includes('href="/kontaktai" data-event="contact_intent_click"')) {
    errors.push(`${file}: main content should provide a direct, measurable contact action`);
  }
}
for (const [file, html] of [["index.html", indexHtml], ["konsultacijos.html", consultationHtml], ["kontaktai.html", contactHtml]]) {
  if (!html.includes('href="tel:112"')) {
    errors.push(`${file}: emergency guidance should provide a direct 112 call link`);
  }
  for (const match of html.matchAll(/<a\b([^>]*)>/g)) {
    const attributes = match[1];
    const isEmergencyLink = attributes.includes('href="tel:112"')
      || attributes.includes('href="https://pagalbasau.lt/gauk-pagalba/"');
    if (isEmergencyLink && attributes.includes("data-event")) {
      errors.push(`${file}: emergency links should not be tracked`);
    }
  }
}
for (const [file, html] of [["index.html", indexHtml], ["konsultacijos.html", consultationHtml]]) {
  if (!html.includes('href="https://pagalbasau.lt/gauk-pagalba/"')) {
    errors.push(`${file}: emergency guidance should link to the official emotional support options`);
  }
}
if (!contactHtml.includes('data-submit-label="Siųsti užklausą"')) {
  errors.push("kontaktai.html: submit button should preserve its readable label while sending");
}
if (!contactHtml.includes('id="form-status" role="status" aria-live="polite" aria-atomic="true"')) {
  errors.push("kontaktai.html: form status should have a stable accessible identifier");
}
for (const field of ["name", "replyBy", "format", "topic"]) {
  const pattern = new RegExp(`<(?:input|select)[^>]+id="${field}"[^>]+aria-describedby="form-status"`);
  if (!pattern.test(contactHtml)) errors.push(`kontaktai.html: ${field} should refer to the form status`);
}
for (const field of ["email", "phone"]) {
  const pattern = new RegExp(`<input[^>]+id="${field}"[^>]+aria-describedby="contact-method-help form-status"`);
  if (!pattern.test(contactHtml)) errors.push(`kontaktai.html: ${field} should refer to contact guidance and form status`);
}
if (!contactHtml.includes('id="contact-method-help">Įrašykite bent vieną: el. pašto adresą arba telefono numerį.')) {
  errors.push("kontaktai.html: contact methods should explain that at least one is required");
}
for (const fieldLimit of ['name="name" autocomplete="name" maxlength="80"', 'name="email" type="email" autocomplete="email" inputmode="email" maxlength="120"', 'name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="40"']) {
  if (!contactHtml.includes(fieldLimit)) errors.push(`kontaktai.html: missing field limit or keyboard hint: ${fieldLimit}`);
}
for (const messageControl of [
  'maxlength="1200" aria-describedby="message-count form-status"',
  'id="message-count" for="message" data-message-count',
  'data-message-count-live aria-live="polite"'
]) {
  if (!contactHtml.includes(messageControl)) {
    errors.push(`kontaktai.html: missing accessible message length control: ${messageControl}`);
  }
}

const privacyHtml = readSite("privatumo-politika.html");
for (const requiredPrivacyText of [
  "Duomenų valdytoja yra psichologė Agnė Žukienė",
  "Cloudflare",
  "Resend",
  "Google Gmail",
  "Google Analytics",
  "12 mėnesių",
  "per vieną mėnesį",
  "BDAR 6 straipsnio 1 dalies",
  "Duomenų pateikimas nėra privalomas",
  "duomenų perkeliamumo sąlygos",
  "Netaikomi automatizuoti sprendimai",
  "Valstybinę duomenų apsaugos inspekciją"
]) {
  if (!privacyHtml.includes(requiredPrivacyText)) {
    errors.push(`privatumo-politika.html: missing required disclosure: ${requiredPrivacyText}`);
  }
}

const cookieHtml = readSite("slapuku-politika.html");
if (!cookieHtml.includes("data-cookie-choice-status")) {
  errors.push("slapuku-politika.html: missing readable cookie choice status");
}

for (const file of htmlFiles.filter((file) => file !== "404.html")) {
  const html = readSite(file);
  for (const requiredCookieControl of [
    'href="/slapuku-politika">Plačiau apie slapukus</a>',
    'data-cookie-decline>Neleisti matavimo</button>',
    'data-cookie-accept>Leisti matavimą</button>'
  ]) {
    if (!html.includes(requiredCookieControl)) {
      errors.push(`${file}: missing clear cookie choice control: ${requiredCookieControl}`);
    }
  }
}
for (const requiredCookieText of ["agne_cookie_choice", "_ga", "iki 2 metų", "Apsaugos kodas įkeliamas tik pradėjus pildyti kontaktų formą", "vienkartinį patvirtinimą"]) {
  if (!cookieHtml.includes(requiredCookieText)) {
    errors.push(`slapuku-politika.html: missing required cookie disclosure: ${requiredCookieText}`);
  }
}

const siteJs = read("public/assets/js/site.js");
for (const requiredSnippet of ["AGNE_SITE_CONFIG", "ga4MeasurementId", "turnstileSiteKey", "turnstile.render", 'action: "contact"', 'language: "lt"', "render=explicit", '"error-callback"', "readResponseMessage", "resetTurnstile", "turnstile.reset", "Uždaryti meniu", "aria-busy", "aria-invalid", "data-cookie-choice-status", "missing_email", "missing_phone", "invalid_phone", "isValidPhone", "updateReplyRequirements", "data-message-count", "messageInput.maxLength", "Pasiekta komentaro riba.", "updateMessageCount", "showSendFallback", "data-form-email-fallback", "parašyti el. paštu", "startTurnstile", 'form.addEventListener("focusin"', "turnstileState", "waitingForTurnstile", "Palaukite akimirką, kol paruošiama formos apsauga.", "Formos apsauga paruošta. Dabar galite siųsti užklausą."]) {
  if (!siteJs.includes(requiredSnippet)) errors.push(`public/assets/js/site.js: missing ${requiredSnippet}`);
}

const styles = read("public/assets/css/styles.css");
if (!/\[hidden\]\s*\{[\s\S]*?display:\s*none\s*!important;[\s\S]*?\}/.test(styles)) {
  errors.push("public/assets/css/styles.css: hidden elements must stay visually hidden");
}
if (!styles.includes("prefers-reduced-motion: reduce") || !styles.includes("scroll-behavior: auto")) {
  errors.push("public/assets/css/styles.css: missing reduced-motion support");
}

const staticHeaders = read("public/_headers");
const requiredStaticHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "X-Frame-Options": "DENY",
  "Strict-Transport-Security": "max-age=31536000"
};
for (const [name, value] of Object.entries(requiredStaticHeaders)) {
  if (!staticHeaders.includes(`${name}: ${value}`)) errors.push(`public/_headers: missing ${name}: ${value}`);
}

const workerSecurityHeaders = read("src/index.js");
for (const [name, value] of Object.entries({
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "x-frame-options": "DENY",
  "strict-transport-security": "max-age=31536000"
})) {
  if (!workerSecurityHeaders.includes(`"${name}": "${value}"`)) {
    errors.push(`src/index.js: missing security header ${name}: ${value}`);
  }
}

if (errors.length > 0) {
  console.error("Site integrity check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Site integrity check passed for ${htmlFiles.length} HTML files.`);
