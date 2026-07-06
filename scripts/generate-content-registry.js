const fs = require("fs");
const path = require("path");

const root = process.cwd();
const publicDir = path.join(root, "public");
const outFile = path.join(root, "data", "site-content-registry.json");
const sitemap = fs.readFileSync(path.join(publicDir, "sitemap.xml"), "utf8");
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

const pages = htmlFiles.map((file) => {
  const html = readHtml(file);
  const route = routeFor(file);
  const canonical = pick(html, /<link rel="canonical" href="([^"]+)"/i);
  const h1 = pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, "");
  const ctas = [...html.matchAll(/<a[^>]+class="[^"]*\bbutton\b[^"]*"[^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => match[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const images = [...html.matchAll(/<img[^>]+src="([^"]+)"/gi)].map((match) => match[1]);
  const schemas = [...html.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map((match) => match[1]);

  return {
    file: `public/${file}`,
    route,
    title: pick(html, /<title>([^<]+)<\/title>/i),
    description: pick(html, /<meta name="description" content="([^"]+)"/i),
    h1,
    canonical,
    inSitemap: sitemap.includes(`<loc>${canonical}</loc>`),
    ogTitle: pick(html, /<meta property="og:title" content="([^"]+)"/i),
    ogDescription: pick(html, /<meta property="og:description" content="([^"]+)"/i),
    ctas,
    images,
    schemas
  };
});

const registry = {
  generatedAt: new Date().toISOString(),
  domain: "https://agnezukiene.lt",
  pages
};

fs.writeFileSync(outFile, `${JSON.stringify(registry, null, 2)}\n`);
console.log(`Generated ${path.relative(root, outFile)} for ${pages.length} pages.`);
