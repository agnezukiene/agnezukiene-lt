const fs = require("fs");
const path = require("path");

const root = process.cwd();
const css = fs.readFileSync(path.join(root, "public", "assets", "css", "styles.css"), "utf8");
const variables = new Map(
  [...css.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})\s*;/gi)]
    .map((match) => [match[1], match[2].toLowerCase()])
);

function luminance(hex) {
  const channels = hex.match(/[0-9a-f]{2}/gi).map((channel) => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function color(name) {
  const value = name.startsWith("#") ? name : variables.get(name);
  if (!value) throw new Error(`Missing CSS color variable: --${name}`);
  return value;
}

const checks = [
  ["text on page background", "text", "bg", 4.5],
  ["muted text on page background", "muted", "bg", 4.5],
  ["muted text on surface", "muted", "surface", 4.5],
  ["muted text on soft surface", "muted", "surface-soft", 4.5],
  ["eyebrow text on page background", "clay", "bg", 4.5],
  ["eyebrow text on surface", "clay", "surface", 4.5],
  ["white text on accent", "#ffffff", "accent", 4.5],
  ["white text on strong accent", "#ffffff", "accent-strong", 4.5],
  ["focus outline on page background", "focus", "bg", 3]
];

const failures = [];
for (const [label, foregroundName, backgroundName, minimum] of checks) {
  const foreground = color(foregroundName);
  const background = color(backgroundName);
  const ratio = contrast(foreground, background);
  if (ratio < minimum) {
    failures.push(`${label}: ${ratio.toFixed(2)}:1, expected at least ${minimum}:1`);
  }
}

if (failures.length) {
  console.error("Color contrast check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Color contrast check passed for ${checks.length} palette pairs.`);
