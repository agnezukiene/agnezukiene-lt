const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = process.cwd();
const publicDir = path.join(root, "public");
const outputFile = path.join(publicDir, "sitemap.xml");
const preferredOrder = [
  "index.html",
  "apie.html",
  "paslaugos.html",
  "konsultacijos.html",
  "duk.html",
  "kontaktai.html",
  "privatumo-politika.html",
  "slapuku-politika.html"
];

const htmlFiles = fs.readdirSync(publicDir)
  .filter((file) => file.endsWith(".html") && file !== "404.html")
  .sort((left, right) => {
    const leftIndex = preferredOrder.indexOf(left);
    const rightIndex = preferredOrder.indexOf(right);
    if (leftIndex !== -1 || rightIndex !== -1) {
      if (leftIndex === -1) return 1;
      if (rightIndex === -1) return -1;
      return leftIndex - rightIndex;
    }
    return left.localeCompare(right, "lt");
  });

const today = new Date().toISOString().slice(0, 10);

function routeFor(file) {
  return file === "index.html" ? "/" : `/${file.replace(/\.html$/, "")}`;
}

function gitOutput(args) {
  const result = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    shell: false
  });
  return result.status === 0 ? result.stdout.trim() : "";
}

function lastModifiedFor(file) {
  const relativePath = path.posix.join("public", file);
  const workingTreeStatus = gitOutput(["status", "--porcelain", "--", relativePath]);
  if (workingTreeStatus) return today;

  const committedDate = gitOutput(["log", "-1", "--format=%cs", "--", relativePath]);
  if (/^\d{4}-\d{2}-\d{2}$/.test(committedDate)) return committedDate;

  return fs.statSync(path.join(publicDir, file)).mtime.toISOString().slice(0, 10);
}

const entries = htmlFiles.map((file) => [
  "  <url>",
  `    <loc>https://agnezukiene.lt${routeFor(file)}</loc>`,
  `    <lastmod>${lastModifiedFor(file)}</lastmod>`,
  "  </url>"
].join("\n"));

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries,
  "</urlset>",
  ""
].join("\n");

fs.writeFileSync(outputFile, sitemap);
console.log(`Generated public/sitemap.xml for ${htmlFiles.length} pages with accurate update dates.`);
