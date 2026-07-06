const fs = require("fs");
const path = require("path");

const root = process.cwd();
const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith(".html"));
const requiredFiles = [
  "assets/css/styles.css",
  "assets/js/site.js",
  "sitemap.xml",
  "robots.txt",
  "data/analytics-events.json"
];
const errors = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    errors.push(`Missing required file: ${file}`);
  }
}

for (const file of htmlFiles) {
  const html = read(file);
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;

  if (!/<title>[^<]{10,}<\/title>/.test(html)) errors.push(`${file}: missing or too short title`);
  if (!/<meta name="description" content="[^"]{30,}"/.test(html)) errors.push(`${file}: missing meta description`);
  if (!/<link rel="canonical" href="https:\/\/agnezukiene\.lt\//.test(html)) errors.push(`${file}: missing canonical`);
  if (!/<meta property="og:title" content="[^"]+"/.test(html)) errors.push(`${file}: missing og:title`);
  if (!/<meta property="og:description" content="[^"]+"/.test(html)) errors.push(`${file}: missing og:description`);
  if (h1Count !== 1) errors.push(`${file}: expected exactly one h1, found ${h1Count}`);
  if (/lorem ipsum|TODO|href=""|href="#"/i.test(html)) errors.push(`${file}: contains placeholder text or empty link`);
  if (/psichoterapeutė/i.test(html)) errors.push(`${file}: contains restricted qualification wording`);
  if (/garantuotas rezultatas|išgydysiu|greitas sprendimas/i.test(html)) errors.push(`${file}: contains overpromising wording`);
}

const sitemap = read("sitemap.xml");
for (const file of htmlFiles.filter((file) => file !== "404.html")) {
  const expected = file === "index.html" ? "https://agnezukiene.lt/" : `https://agnezukiene.lt/${file}`;
  if (!sitemap.includes(`<loc>${expected}</loc>`)) {
    errors.push(`sitemap.xml: missing ${expected}`);
  }
}

const gitignore = read(".gitignore");
for (const pattern of [".env", "*.local", "*-oauth-token.json", ".dev.vars"]) {
  if (!gitignore.includes(pattern)) errors.push(`.gitignore: missing ${pattern}`);
}

if (errors.length > 0) {
  console.error("Site integrity check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Site integrity check passed for ${htmlFiles.length} HTML files.`);
