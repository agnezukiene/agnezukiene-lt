const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const publicDir = path.join(root, "public");
const htmlFiles = fs.readdirSync(publicDir).filter((file) => file.endsWith(".html"));
const headersFile = fs.readFileSync(path.join(publicDir, "_headers"), "utf8");
const worker = fs.readFileSync(path.join(root, "src", "index.js"), "utf8");
const policyMatch = headersFile.match(/^\s*Content-Security-Policy:\s*(.+)$/m);

assert(policyMatch, "public/_headers should define Content-Security-Policy");
const policy = policyMatch[1];

for (const directive of [
  "default-src 'self'",
  "base-uri 'none'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "style-src 'self'",
  "frame-src https://challenges.cloudflare.com",
  "upgrade-insecure-requests"
]) {
  assert(policy.includes(directive), `Content Security Policy is missing: ${directive}`);
  assert(worker.includes(directive), `Worker Content Security Policy is missing: ${directive}`);
}

for (const source of [
  "https://www.googletagmanager.com",
  "https://challenges.cloudflare.com",
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
  "https://*.googletagmanager.com"
]) {
  assert(policy.includes(source), `Content Security Policy does not allow required source: ${source}`);
  assert(worker.includes(source), `Worker policy does not allow required source: ${source}`);
}

assert(!policy.includes("'unsafe-inline'"), "Content Security Policy should not allow arbitrary inline code");
assert(!policy.includes("default-src *"), "Content Security Policy should not allow every source");
assert(worker.includes('"content-security-policy": CONTENT_SECURITY_POLICY'), "Worker should send the policy as a response header");

let structuredDataCount = 0;
let earlyScriptCount = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(publicDir, file), "utf8");
  assert(!/\son(?:click|change|input|submit|load)=/i.test(html), `${file} should not contain inline event handlers`);

  for (const match of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/gi)) {
    const attributes = match[1] || "";
    const content = match[2];
    if (!content.trim()) continue;
    if (attributes.includes("data-early-js")) {
      earlyScriptCount += 1;
      assert.strictEqual(
        content,
        'document.documentElement.classList.add("has-js");',
        `${file}: early JavaScript marker should stay minimal`
      );
    } else if (attributes.includes('type="application/ld+json"')) {
      structuredDataCount += 1;
    } else {
      assert.fail(`${file}: unexpected inline script`);
    }
    const hash = `'sha256-${crypto.createHash("sha256").update(content).digest("base64")}'`;
    assert(policy.includes(hash), `${file}: inline structured data hash is missing from public/_headers`);
    assert(worker.includes(hash), `${file}: inline structured data hash is missing from the Worker policy`);
  }
}

assert.strictEqual(structuredDataCount, 4, "Expected four inline structured-data scripts");
assert.strictEqual(earlyScriptCount, 8, "Expected one early JavaScript marker on every interactive page");
console.log(`Content Security Policy check passed for ${htmlFiles.length} HTML files.`);
