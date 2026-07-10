const fs = require("fs");
const path = require("path");

const root = process.cwd();
const publicDir = path.join(root, "public");
const siteJs = path.join(publicDir, "assets", "js", "site.js");
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

for (const match of js.matchAll(/\btrack\("([^"]+)"/g)) {
  addEvent(match[1], "public/assets/js/site.js track()");
}

for (const match of js.matchAll(/\bgtag\("event",\s*"([^"]+)"/g)) {
  addEvent(match[1], "public/assets/js/site.js gtag()");
}

for (const term of riskyTerms) {
  const riskyParamPattern = new RegExp(`\\b${term}\\s*:`, "i");
  if (riskyParamPattern.test(js)) {
    errors.push(`public/assets/js/site.js: analytics payload appears to include risky field "${term}"`);
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
