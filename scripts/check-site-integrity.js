const fs = require("fs");
const path = require("path");

const root = process.cwd();
const siteRoot = path.join(root, "public");
const htmlFiles = fs.readdirSync(siteRoot).filter((file) => file.endsWith(".html"));
const requiredFiles = [
  "public/assets/css/styles.css",
  "public/assets/js/config.js",
  "public/assets/js/site.js",
  "public/_headers",
  "public/sitemap.xml",
  "public/robots.txt",
  "data/analytics-events.json",
  "data/site-content-registry.json",
  "docs/content-approval.md",
  "docs/launch-readiness.md",
  "docs/manual-setup-queue.md",
  "docs/seo-inventory.md",
  "scripts/generate-launch-readiness.js",
  "scripts/pre-go-live.js",
  "scripts/check-live-site.js",
  "src/index.js",
  "wrangler.jsonc"
];
const errors = [];
const canonicalUrls = new Set();
const technicalPages = new Set(["404.html"]);

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function readSite(file) {
  return fs.readFileSync(path.join(siteRoot, file), "utf8");
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    errors.push(`Missing required file: ${file}`);
  }
}

for (const file of htmlFiles) {
  const html = readSite(file);
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  const expectedUrl = file === "index.html" ? "https://agnezukiene.lt/" : `https://agnezukiene.lt/${file}`;
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
  const ogUrlMatch = html.match(/<meta property="og:url" content="([^"]+)"/);
  const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);

  if (!/<main[\s>]/.test(html)) errors.push(`${file}: missing main landmark`);
  if (!technicalPages.has(file) && !/<a class="skip-link" href="#turinys">/.test(html)) {
    errors.push(`${file}: missing skip link to main content`);
  }
  if (!technicalPages.has(file) && !/<main[^>]*id="turinys"/.test(html)) {
    errors.push(`${file}: main content should have id="turinys" for the skip link`);
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
  if (!/<title>[^<]{10,}<\/title>/.test(html)) errors.push(`${file}: missing or too short title`);
  if (!/<meta name="description" content="[^"]{30,}"/.test(html)) errors.push(`${file}: missing meta description`);
  if (!/<link rel="canonical" href="https:\/\/agnezukiene\.lt\//.test(html)) errors.push(`${file}: missing canonical`);
  if (canonicalMatch && canonicalMatch[1] !== expectedUrl) errors.push(`${file}: canonical should be ${expectedUrl}`);
  if (canonicalMatch && canonicalUrls.has(canonicalMatch[1])) errors.push(`${file}: duplicate canonical ${canonicalMatch[1]}`);
  if (canonicalMatch) canonicalUrls.add(canonicalMatch[1]);
  if (!/<meta property="og:title" content="[^"]+"/.test(html)) errors.push(`${file}: missing og:title`);
  if (!/<meta property="og:description" content="[^"]+"/.test(html)) errors.push(`${file}: missing og:description`);
  if (!ogUrlMatch) errors.push(`${file}: missing og:url`);
  if (ogUrlMatch && ogUrlMatch[1] !== expectedUrl) errors.push(`${file}: og:url should be ${expectedUrl}`);
  if (!ogImageMatch) {
    errors.push(`${file}: missing og:image`);
  } else if (!ogImageMatch[1].startsWith("https://agnezukiene.lt/")) {
    errors.push(`${file}: og:image should use the production domain`);
  } else {
    const imagePath = ogImageMatch[1].replace("https://agnezukiene.lt/", "");
    if (!fs.existsSync(path.join(siteRoot, imagePath))) errors.push(`${file}: og:image file does not exist: ${imagePath}`);
  }
  if (file !== "404.html" && !html.includes('/assets/js/config.js')) errors.push(`${file}: missing config.js`);
  if (h1Count !== 1) errors.push(`${file}: expected exactly one h1, found ${h1Count}`);
  if (/lorem ipsum|TODO|href=""|href="#"/i.test(html)) errors.push(`${file}: contains placeholder text or empty link`);
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
if (sitemapUrls.includes("https://agnezukiene.lt/404.html")) errors.push("sitemap.xml: should not include 404.html");
for (const file of htmlFiles.filter((file) => file !== "404.html")) {
  const expected = file === "index.html" ? "https://agnezukiene.lt/" : `https://agnezukiene.lt/${file}`;
  if (!sitemapUrlSet.has(expected)) {
    errors.push(`sitemap.xml: missing ${expected}`);
  }
}
for (const url of sitemapUrls) {
  const route = url.replace("https://agnezukiene.lt/", "");
  const file = route === "" ? "index.html" : route;
  if (!htmlFiles.includes(file)) errors.push(`sitemap.xml: URL has no matching HTML file: ${url}`);
}

const robots = read("public/robots.txt");
if (!/User-agent:\s*\*/.test(robots)) errors.push("robots.txt: missing User-agent: *");
if (!robots.includes("Sitemap: https://agnezukiene.lt/sitemap.xml")) errors.push("robots.txt: missing production sitemap URL");

const registry = JSON.parse(read("data/site-content-registry.json"));
if (!Array.isArray(registry.pages) || registry.pages.length !== htmlFiles.length) {
  errors.push("data/site-content-registry.json: page count does not match HTML files");
}

const seoInventory = read("docs/seo-inventory.md");
for (const file of htmlFiles) {
  const route = file === "index.html" ? "/" : `/${file}`;
  if (!seoInventory.includes(`| ${route} |`)) {
    errors.push(`docs/seo-inventory.md: missing ${route}`);
  }
}

const gitignore = read(".gitignore");
for (const pattern of [".env", "*.local", "*-oauth-token.json", ".dev.vars"]) {
  if (!gitignore.includes(pattern)) errors.push(`.gitignore: missing ${pattern}`);
}

const wrangler = read("wrangler.jsonc");
if (!wrangler.includes('"main": "src/index.js"')) errors.push("wrangler.jsonc: missing worker main entry");
if (!wrangler.includes('"directory": "./public"')) errors.push("wrangler.jsonc: assets directory must be ./public");
if (!wrangler.includes('"binding": "ASSETS"')) errors.push("wrangler.jsonc: missing ASSETS binding");
if (!wrangler.includes('"run_worker_first": true')) errors.push("wrangler.jsonc: Worker must run before assets");
if (!wrangler.includes('"CONTACT_TO_EMAIL": "zukiene.agne@gmail.com"')) errors.push("wrangler.jsonc: missing CONTACT_TO_EMAIL variable");

const worker = read("src/index.js");
for (const requiredSnippet of ["/api/contact", "RESEND_API_KEY", "CONTACT_TO_EMAIL", "TURNSTILE_SECRET_KEY", "env.ASSETS.fetch", "www.agnezukiene.lt", "x-content-type-options", "permissions-policy", "data.website"]) {
  if (!worker.includes(requiredSnippet)) errors.push(`src/index.js: missing ${requiredSnippet}`);
}

const contactHtml = readSite("kontaktai.html");
if (!contactHtml.includes('name="website"') || !contactHtml.includes("honeypot")) {
  errors.push("kontaktai.html: missing honeypot field");
}

const siteJs = read("public/assets/js/site.js");
for (const requiredSnippet of ["AGNE_SITE_CONFIG", "ga4MeasurementId", "turnstileSiteKey", "turnstile.render", "readResponseMessage", "resetTurnstile", "turnstile.reset"]) {
  if (!siteJs.includes(requiredSnippet)) errors.push(`public/assets/js/site.js: missing ${requiredSnippet}`);
}

const staticHeaders = read("public/_headers");
for (const requiredSnippet of ["X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy", "X-Frame-Options"]) {
  if (!staticHeaders.includes(requiredSnippet)) errors.push(`public/_headers: missing ${requiredSnippet}`);
}

if (errors.length > 0) {
  console.error("Site integrity check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Site integrity check passed for ${htmlFiles.length} HTML files.`);
