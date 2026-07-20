const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const publicDir = path.join(root, "public");
const versionedFiles = [
  "public/assets/css/styles.css",
  "public/assets/js/config.js",
  "public/assets/js/site.js"
];

const hash = crypto.createHash("sha256");
for (const file of versionedFiles) {
  hash.update(file);
  hash.update("\0");
  hash.update(fs.readFileSync(path.join(root, file)));
  hash.update("\0");
}
const expectedVersion = hash.digest("hex").slice(0, 12);

const worker = fs.readFileSync(path.join(root, "src", "index.js"), "utf8");
const workerVersion = worker.match(/const STATIC_ASSET_VERSION = "([a-f0-9]{12})";/)?.[1];
assert.strictEqual(workerVersion, expectedVersion, "STATIC_ASSET_VERSION should match the current CSS and JavaScript contents");
assert(worker.includes("public, max-age=31536000, immutable"), "Worker should cache versioned CSS and JavaScript for repeat visits");
assert(worker.includes("public, max-age=604800, stale-while-revalidate=86400"), "Worker should cache images for one week");
assert(worker.includes('"cache-control": "no-store"'), "Contact API responses should never be stored in the browser cache");

const htmlFiles = fs.readdirSync(publicDir).filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(publicDir, file), "utf8");
  assert(
    html.includes(`/assets/css/styles.css?v=${expectedVersion}`),
    `${file}: stylesheet should use the current asset version`
  );

  if (html.includes("/assets/js/config.js") || html.includes("/assets/js/site.js")) {
    assert(html.includes(`/assets/js/config.js?v=${expectedVersion}`), `${file}: config.js should use the current asset version`);
    assert(html.includes(`/assets/js/site.js?v=${expectedVersion}`), `${file}: site.js should use the current asset version`);
  }

  assert(!/assets\/(?:css\/styles\.css|js\/(?:config|site)\.js)(?:["'])/.test(html), `${file}: found an unversioned CSS or JavaScript reference`);
}

console.log(`Static asset cache check passed with version ${expectedVersion}.`);
