const fs = require("fs");
const path = require("path");

const root = process.cwd();
const publicDir = path.join(root, "public");
const outFile = path.join(root, "docs", "seo-inventory.md");
const htmlFiles = fs.readdirSync(publicDir)
  .filter((file) => file.endsWith(".html"))
  .sort((a, b) => routeFor(a).localeCompare(routeFor(b), "lt"));

function routeFor(file) {
  return file === "index.html" ? "/" : `/${file}`;
}

function readHtml(file) {
  return fs.readFileSync(path.join(publicDir, file), "utf8");
}

function pick(html, regex) {
  const match = html.match(regex);
  return match ? match[1].trim() : "";
}

const rows = htmlFiles.map((file) => {
  const html = readHtml(file);
  return {
    route: routeFor(file),
    title: pick(html, /<title>([^<]+)<\/title>/i),
    description: pick(html, /<meta name="description" content="([^"]+)"/i),
    h1: pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, ""),
    canonical: pick(html, /<link rel="canonical" href="([^"]+)"/i),
    ogTitle: pick(html, /<meta property="og:title" content="([^"]+)"/i),
    ogDescription: pick(html, /<meta property="og:description" content="([^"]+)"/i)
  };
});

const md = [
  "# SEO inventory",
  "",
  `Atnaujinta: ${new Date().toISOString().slice(0, 10)}`,
  "",
  "| URL | Title | Description | H1 | Canonical | OG title |",
  "| --- | --- | --- | --- | --- | --- |",
  ...rows.map((row) => [
    row.route,
    row.title,
    row.description,
    row.h1,
    row.canonical,
    row.ogTitle
  ].map(escapeCell).join(" | ")).map((line) => `| ${line} |`),
  "",
  "## Pastabos",
  "",
  "- Kiekvienas puslapis turi turėti vieną H1, unikalų title, meta description, canonical ir OG metadata.",
  "- Medicininės, diagnozuojančios ar rezultatą garantuojančios formuluotės neturi būti naudojamos.",
  "- `404.html` laikomas techniniu puslapiu, bet vis tiek turi bazinę metadata.",
  ""
].join("\n");

fs.writeFileSync(outFile, md);
console.log(`Generated ${path.relative(root, outFile)} for ${rows.length} pages.`);

function escapeCell(value) {
  return String(value || "-").replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
}
