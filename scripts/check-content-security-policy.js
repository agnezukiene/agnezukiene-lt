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

let inlineScriptCount = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(publicDir, file), "utf8");
  assert(!/\son(?:click|change|input|submit|load)=/i.test(html), `${file} should not contain inline event handlers`);

  for (const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)) {
    if (!match[1].trim()) continue;
    inlineScriptCount += 1;
    const hash = `'sha256-${crypto.createHash("sha256").update(match[1]).digest("base64")}'`;
    assert(policy.includes(hash), `${file}: inline structured data hash is missing from public/_headers`);
    assert(worker.includes(hash), `${file}: inline structured data hash is missing from the Worker policy`);
  }
}

assert.strictEqual(inlineScriptCount, 4, "Expected four inline structured-data scripts");
console.log(`Content Security Policy check passed for ${htmlFiles.length} HTML files.`);
