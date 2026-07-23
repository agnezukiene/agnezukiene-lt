const { spawnSync } = require("child_process");
const node = process.execPath;

const steps = [
  ["Generate SEO inventory", [node, "scripts/generate-seo-inventory.js"]],
  ["Generate content registry", [node, "scripts/generate-content-registry.js"]],
  ["Generate launch readiness", [node, "scripts/generate-launch-readiness.js"]],
  ["Run repository safety check", [node, "scripts/check-repository-safety.js"]],
  ["Run site integrity check", [node, "scripts/check-site-integrity.js"]],
  ["Run content security policy check", [node, "scripts/check-content-security-policy.js"]],
  ["Run color contrast check", [node, "scripts/check-color-contrast.js"]],
  ["Run analytics privacy check", [node, "scripts/check-analytics-privacy.js"]],
  ["Run contact API check", [node, "scripts/check-contact-api.js"]],
  ["Run static asset cache check", [node, "scripts/check-static-asset-cache.js"]],
  ["Check git whitespace", ["git", "diff", "--check"]]
];

const liveUrl = process.argv[2];
if (liveUrl) {
  steps.push(["Run live site check", [node, "scripts/check-live-site.js", liveUrl]]);
}

for (const [label, command] of steps) {
  console.log(`\n== ${label} ==`);
  const result = spawnSync(command[0], command.slice(1), {
    stdio: "inherit",
    shell: false
  });

  if (result.status !== 0) {
    console.error(`\nPre-go-live failed at: ${label}`);
    process.exit(result.status || 1);
  }
}

console.log("\nPre-go-live checks passed.");
