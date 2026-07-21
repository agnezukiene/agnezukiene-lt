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

if (!/const setCookieChoice = \(choice\) => \{[\s\S]*if \(choice === "accepted"\) \{\s*initAnalytics\(\);\s*\} else \{\s*deactivateAnalytics\(\);\s*\}/.test(js)) {
  errors.push("public/assets/js/site.js: cookie choice should start or stop analytics immediately");
}

if (!/if \(cookieChoice === "accepted"\) \{\s*initAnalytics\(\);\s*\} else \{\s*deactivateAnalytics\(\);\s*\}/.test(js)) {
  errors.push("public/assets/js/site.js: returning visitors should honor their stored analytics choice");
}

for (const requiredPrivacyControl of [
  "analyticsDisableKey",
  "removeAnalyticsCookies",
  "deactivateAnalytics",
  "analytics_storage: analyticsStorage",
  'analyticsConsent("denied")',
  'analyticsConsent("granted")',
  "clearCookieChoice",
  "readCookieChoice() === \"accepted\""
]) {
  if (!js.includes(requiredPrivacyControl)) {
    errors.push(`public/assets/js/site.js: missing analytics withdrawal control: ${requiredPrivacyControl}`);
  }
}

for (const advertisingControl of [
  'ad_storage: "denied"',
  'ad_user_data: "denied"',
  'ad_personalization: "denied"',
  "allow_google_signals: false",
  "allow_ad_personalization_signals: false"
]) {
  if (!js.includes(advertisingControl)) {
    errors.push(`public/assets/js/site.js: advertising-related analytics control should stay disabled: ${advertisingControl}`);
  }
}

if (!/resetCookies\.addEventListener\("click", \(\) => \{[\s\S]*const analyticsWasLoaded = typeof window\.gtag === "function";[\s\S]*clearCookieChoice\(\);[\s\S]*deactivateAnalytics\(\{ notifyTag: false \}\);/.test(js)) {
  errors.push("public/assets/js/site.js: changing the cookie choice should stop analytics before asking again");
}

if (!/if \(analyticsWasLoaded\) \{\s*window\.location\.reload\(\);\s*return;\s*\}/.test(js)) {
  errors.push("public/assets/js/site.js: withdrawing consent should reload a page where analytics is no longer loaded");
}

if (!js.includes("_ga(?:_|$)") || !js.includes("Max-Age=0")) {
  errors.push("public/assets/js/site.js: analytics withdrawal should remove Google Analytics cookies");
}

if (
  !js.includes("const startTurnstile = () =>")
  || !js.includes('form.addEventListener("focusin"')
  || !js.includes("input:not([name='website']), select, textarea, button[type='submit']")
) {
  errors.push("public/assets/js/site.js: form protection should load only after a visitor starts using the contact form");
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
