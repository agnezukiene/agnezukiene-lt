const fs = require("fs");
const path = require("path");

const root = process.cwd();
const publicDir = path.join(root, "public");
const siteJs = path.join(publicDir, "assets", "js", "site.js");
const configJs = path.join(publicDir, "assets", "js", "config.js");
const eventsFile = path.join(root, "data", "analytics-events.json");

const { allowedEvents } = JSON.parse(fs.readFileSync(eventsFile, "utf8"));
const allowed = new Set(allowedEvents);
const errors = [];
const found = new Set();

const riskyTerms = [
  "name",
  "email",
  "phone",
  "message",
  "turnstileToken",
  "website",
  "privacy"
];

function addEvent(eventName, source) {
  found.add(eventName);
  if (!allowed.has(eventName)) {
    errors.push(`${source}: analytics event "${eventName}" is not in data/analytics-events.json`);
  }
}

for (const file of fs.readdirSync(publicDir).filter((name) => name.endsWith(".html"))) {
  const html = fs.readFileSync(path.join(publicDir, file), "utf8");

  for (const match of html.matchAll(/\bdata-event="([^"]+)"/g)) {
    addEvent(match[1], `public/${file} data-event`);
  }

  for (const match of html.matchAll(/\bdata-track-select="([^"]+)"/g)) {
    addEvent(match[1], `public/${file} data-track-select`);
  }
}

const js = fs.readFileSync(siteJs, "utf8");
const config = fs.readFileSync(configJs, "utf8");

const ga4Match = config.match(/ga4MeasurementId:\s*"([^"]*)"/);
if (!ga4Match) {
  errors.push("public/assets/js/config.js: missing ga4MeasurementId");
} else if (ga4Match[1] && !/^G-[A-Z0-9]+$/.test(ga4Match[1])) {
  errors.push("public/assets/js/config.js: ga4MeasurementId must be empty or use the G-XXXXXXXXXX format");
}

const turnstileMatch = config.match(/turnstileSiteKey:\s*"([^"]*)"/);
if (!turnstileMatch) {
  errors.push("public/assets/js/config.js: missing turnstileSiteKey");
} else if (!/^0x[0-9A-Za-z_-]+$/.test(turnstileMatch[1])) {
  errors.push("public/assets/js/config.js: turnstileSiteKey should look like a public Cloudflare Turnstile site key");
}

for (const secretPattern of [/secret/i, /RESEND_API_KEY/i, /TURNSTILE_SECRET_KEY/i, /sk_[A-Za-z0-9_-]+/]) {
  if (secretPattern.test(config)) {
    errors.push("public/assets/js/config.js: public config appears to include a secret-like value");
    break;
  }
}

if (!/const initAnalytics = \(\) => \{[\s\S]*gtag\/js\?id=/.test(js)) {
  errors.push("public/assets/js/site.js: GA4 script loader should stay inside initAnalytics()");
}

if (!/if \(choice === "accepted"\) initAnalytics\(\);/.test(js)) {
  errors.push("public/assets/js/site.js: analytics must initialize only after accepted cookie choice");
}

if (!/if \(cookieChoice === "accepted"\) \{\s*initAnalytics\(\);\s*\}/.test(js)) {
  errors.push("public/assets/js/site.js: returning visitors should only initialize analytics after prior accepted choice");
}

for (const match of js.matchAll(/\btrack\("([^"]+)"/g)) {
  addEvent(match[1], "public/assets/js/site.js track()");
}

for (const match of js.matchAll(/\bgtag\("event",\s*"([^"]+)"/g)) {
  addEvent(match[1], "public/assets/js/site.js gtag()");
}

for (const match of js.matchAll(/\btrack\("[^"]+",\s*\{([\s\S]*?)\}\s*\)/g)) {
  const payload = match[1];
  for (const term of riskyTerms) {
    const riskyParamPattern = new RegExp(`\\b${term}\\s*:`, "i");
    if (riskyParamPattern.test(payload)) {
      errors.push(`public/assets/js/site.js: analytics payload appears to include risky field "${term}"`);
    }
  }
}

if (js.includes("Object.fromEntries(data.entries())") && /track\([^)]*payload|gtag\([^)]*payload/s.test(js)) {
  errors.push("public/assets/js/site.js: form payload must not be sent to analytics");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Analytics privacy check passed for ${found.size} tracked event names.`);
