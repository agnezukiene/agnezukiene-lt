const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = process.cwd();
const binaryExtensions = new Set([".avif", ".gif", ".heic", ".ico", ".jpeg", ".jpg", ".pdf", ".png", ".webp"]);
const rasterImagePattern = /\.(?:avif|gif|heic|jpe?g|png|webp)$/i;
const allowedHistoricalPublishedImages = new Set([
  "assets/images/rami-psichologes-svetaines-tekstura.png"
]);
const requiredIgnoreRules = [
  ".DS_Store",
  ".env",
  ".env.*",
  "*.local",
  "*-oauth-client.json",
  "*-oauth-token.json",
  "*-service-account.json",
  ".dev.vars",
  "Agnes foto/",
  "tmp/"
];

const secretPatterns = [
  {
    label: "Resend siuntimo raktas",
    pattern: new RegExp(`\\b${["r", "e"].join("")}_[A-Za-z0-9_-]{20,}\\b`)
  },
  {
    label: "OpenAI arba panašaus formato slaptas raktas",
    pattern: new RegExp(`\\b${["s", "k"].join("")}-[A-Za-z0-9_-]{20,}\\b`)
  },
  {
    label: "GitHub prieigos raktas",
    pattern: new RegExp(`\\b(?:${["g", "h"].join("")}[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\\b`)
  },
  {
    label: "Google paskyros arba programos raktas",
    pattern: new RegExp(`\\b(?:${["GOC", "SPX"].join("")}-[A-Za-z0-9_-]{20,}|${["AI", "za"].join("")}[A-Za-z0-9_-]{30,})\\b`)
  },
  {
    label: "privatus šifravimo raktas",
    pattern: new RegExp(["-----BEGIN ", "(?:RSA |EC |OPENSSH )?", "PRIVATE KEY-----"].join(""))
  },
  {
    label: "slaptam nustatymui priskirta tikra reikšmė",
    pattern: new RegExp("(?:RESEND_API_KEY|TURNSTILE_SECRET_KEY|CLOUDFLARE_API_TOKEN|CF_API_TOKEN)\\s*[:=]\\s*[\\\"']?[A-Za-z0-9_-]{20,}")
  },
  {
    label: "OAuth kliento paslaptis",
    pattern: new RegExp("client_secret[\\\"']?\\s*[:=]\\s*[\\\"'][^<\\\"']{15,}[\\\"']", "i")
  }
];

function runGit(args) {
  const result = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024
  });
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `git ${args.join(" ")} nepavyko`);
  }
  return result.stdout;
}

function findSecretLabels(content) {
  return secretPatterns
    .filter(({ pattern }) => pattern.test(content))
    .map(({ label }) => label);
}

function unsafePathReason(file, { historical = false } = {}) {
  const normalized = file.replace(/\\/g, "/");
  const base = path.posix.basename(normalized);
  if (normalized.startsWith("Agnes foto/")) return "asmeninių originalių nuotraukų katalogas";
  if (/^\.env(?:\.|$)/.test(base) || base === ".dev.vars") return "slaptų aplinkos nustatymų failas";
  if (/(?:oauth-(?:client|token)|service-account)\.json$/i.test(base)) return "paskyros prisijungimo failas";
  if (/(?:^|\/)(?:id_rsa|id_ed25519)(?:\.pub)?$/i.test(normalized)) return "privatus prisijungimo raktas";
  if (/\.(?:key|p12|pfx|pem)$/i.test(base)) return "privataus rakto arba sertifikato failas";
  if (rasterImagePattern.test(normalized) && !normalized.startsWith("public/assets/images/")) {
    if (historical && allowedHistoricalPublishedImages.has(normalized)) return "";
    return "vaizdo failas už viešai patvirtintų svetainės vaizdų katalogo ribų";
  }
  return "";
}

function runSelfCheck() {
  const resendExample = `${["r", "e"].join("")}_${"a".repeat(24)}`;
  const privateKeyExample = ["-----BEGIN ", "PRIVATE KEY-----"].join("");
  assert(findSecretLabels(resendExample).includes("Resend siuntimo raktas"));
  assert(findSecretLabels(privateKeyExample).includes("privatus šifravimo raktas"));
  assert.strictEqual(findSecretLabels("ga4MeasurementId: G-3N3MGJHS0V").length, 0);
  assert.strictEqual(unsafePathReason("Agnes foto/originalas.jpeg"), "asmeninių originalių nuotraukų katalogas");
  assert.strictEqual(unsafePathReason("public/assets/images/patvirtintas-portretas.jpg"), "");
}

runSelfCheck();

const errors = [];
const repositoryFiles = runGit(["ls-files", "-z", "--cached", "--others", "--exclude-standard"])
  .split("\0")
  .filter(Boolean);
for (const file of repositoryFiles) {
  const unsafeReason = unsafePathReason(file);
  if (unsafeReason) errors.push(`${file}: ${unsafeReason}`);

  if (binaryExtensions.has(path.extname(file).toLowerCase())) continue;
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) continue;
  const labels = findSecretLabels(fs.readFileSync(filePath, "utf8"));
  for (const label of labels) errors.push(`${file}: galimas ${label}`);
}

const historicalPaths = new Set(
  runGit(["log", "--all", "--name-only", "--format="])
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
);
for (const file of historicalPaths) {
  const unsafeReason = unsafePathReason(file, { historical: true });
  if (unsafeReason) errors.push(`Git istorija, ${file}: ${unsafeReason}`);
}

const historyPatch = runGit(["log", "-p", "--all", "--no-color", "--", "."]);
for (const label of findSecretLabels(historyPatch)) {
  errors.push(`Git istorija: galimas ${label}`);
}

const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
for (const rule of requiredIgnoreRules) {
  if (!gitignore.split(/\r?\n/).includes(rule)) {
    errors.push(`.gitignore: trūksta apsaugos taisyklės ${rule}`);
  }
}

if (errors.length > 0) {
  console.error("Repository safety check failed:");
  for (const error of [...new Set(errors)]) console.error(`- ${error}`);
  process.exit(1);
}

const commitCount = runGit(["rev-list", "--all", "--count"]).trim();
console.log(`Repository safety check passed for ${repositoryFiles.length} repository files and ${commitCount} commits.`);
