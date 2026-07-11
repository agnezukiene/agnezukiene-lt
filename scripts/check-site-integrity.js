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
  "docs/seo-inventory.md",
  "scripts/generate-launch-readiness.js",
  "scripts/pre-go-live.js",
  "scripts/check-live-site.js",
  "src/index.js",
  "wrangler.jsonc"
];
const errors = [];

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

  if (!/<title>[^<]{10,}<\/title>/.test(html)) errors.push(`${file}: missing or too short title`);
  if (!/<meta name="description" content="[^"]{30,}"/.test(html)) errors.push(`${file}: missing meta description`);
  if (!/<link rel="canonical" href="https:\/\/agnezukiene\.lt\//.test(html)) errors.push(`${file}: missing canonical`);
  if (!/<meta property="og:title" content="[^"]+"/.test(html)) errors.push(`${file}: missing og:title`);
  if (!/<meta property="og:description" content="[^"]+"/.test(html)) errors.push(`${file}: missing og:description`);
  if (file !== "404.html" && !html.includes('/assets/js/config.js')) errors.push(`${file}: missing config.js`);
  if (h1Count !== 1) errors.push(`${file}: expected exactly one h1, found ${h1Count}`);
  if (/lorem ipsum|TODO|href=""|href="#"/i.test(html)) errors.push(`${file}: contains placeholder text or empty link`);
  if (/psichoterapeutė/i.test(html)) errors.push(`${file}: contains restricted qualification wording`);
  if (/garantuotas rezultatas|išgydysiu|greitas sprendimas/i.test(html)) errors.push(`${file}: contains overpromising wording`);
}

const sitemap = read("public/sitemap.xml");
for (const file of htmlFiles.filter((file) => file !== "404.html")) {
  const expected = file === "index.html" ? "https://agnezukiene.lt/" : `https://agnezukiene.lt/${file}`;
  if (!sitemap.includes(`<loc>${expected}</loc>`)) {
    errors.push(`sitemap.xml: missing ${expected}`);
  }
}

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
