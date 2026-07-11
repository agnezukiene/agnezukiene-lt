const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outFile = path.join(root, "docs", "launch-readiness.md");

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function has(file, snippet) {
  return read(file).includes(snippet);
}

function checked(done, label, detail = "") {
  const mark = done ? "[x]" : "[ ]";
  return `- \`${mark}\` ${label}${detail ? `: ${detail}` : ""}`;
}

const config = read("public/assets/js/config.js");
const wrangler = read("wrangler.jsonc");
const roadmap = read("docs/roadmap.md");

const ga4Configured = /ga4MeasurementId:\s*"G-[A-Z0-9]+"/.test(config);
const turnstileConfigured = /turnstileSiteKey:\s*"0x[0-9A-Za-z_-]+"/.test(config);
const contactOriginConfigured = wrangler.includes('"ALLOWED_ORIGIN": "https://agnezukiene.lt"');
const contactRecipientConfigured = wrangler.includes('"CONTACT_TO_EMAIL": "zukiene.agne@gmail.com"');
const hasContentApprovalBlockers = roadmap.includes("`[!]` Konsultacijos trukmė");

const technicalGates = [
  checked(has("scripts/pre-go-live.js", "scripts/check-site-integrity.js"), "Site integrity check yra pre-go-live dalis"),
  checked(has("scripts/pre-go-live.js", "scripts/check-analytics-privacy.js"), "GA4 privatumo patikra yra pre-go-live dalis"),
  checked(has("scripts/pre-go-live.js", "scripts/check-contact-api.js"), "Kontaktų API patikra yra pre-go-live dalis"),
  checked(has("scripts/check-live-site.js", "https://www.agnezukiene.lt"), "Production live check tikrina www nukreipimą"),
  checked(has("scripts/check-live-site.js", "http://agnezukiene.lt"), "Production live check tikrina HTTP į HTTPS"),
  checked(has("scripts/check-live-site.js", "/neegzistuojantis-puslapis"), "Production live check tikrina 404"),
  checked(turnstileConfigured, "Turnstile site key yra frontend konfigūracijoje"),
  checked(contactOriginConfigured, "ALLOWED_ORIGIN nustatytas production domenui"),
  checked(contactRecipientConfigured, "CONTACT_TO_EMAIL nustatytas")
];

const launchBlockers = [
  {
    label: "Resend domenas / siuntėjas",
    done: roadmap.includes("[x] Integruoti Resend laiškų siuntimą"),
    detail: "reikia Resend DNS įrašų, RESEND_API_KEY ir CONTACT_FROM_EMAIL"
  },
  {
    label: "Gyvas kontaktų formos siuntimas",
    done: roadmap.includes("[x] Patikrinti formos siuntimą gyvai"),
    detail: "galima tik po Resend secret ir siuntėjo įjungimo"
  },
  {
    label: "GA4 Measurement ID",
    done: ga4Configured,
    detail: "reikia G-... reikšmės į public/assets/js/config.js"
  },
  {
    label: "GA4 Realtime / DebugView",
    done: roadmap.includes("[x] Patikrinti GA4 Realtime"),
    detail: "galima tik po GA4 Measurement ID"
  },
  {
    label: "Search Console domain property",
    done: roadmap.includes("[x] Search Console patvirtinti"),
    detail: "reikia Google TXT įrašo Cloudflare DNS"
  },
  {
    label: "Search Console sitemap pateikimas",
    done: roadmap.includes("[x] Patikrinti Search Console sitemap pateikimą"),
    detail: "galima tik po Search Console patvirtinimo"
  },
  {
    label: "Agnės turinio patvirtinimai",
    done: !hasContentApprovalBlockers,
    detail: "trukmė, kaina, formatas, adresas / miestas, darbo laikas, kvalifikacijos formuluotė"
  }
];

const blockerRows = launchBlockers.map((item) => (
  `| ${item.done ? "padaryta" : "laukia"} | ${item.label} | ${item.detail} |`
));

const nextSteps = launchBlockers
  .filter((item) => !item.done)
  .slice(0, 5)
  .map((item, index) => `${index + 1}. ${item.label}: ${item.detail}`);

const md = [
  "# Launch readiness",
  "",
  `Atnaujinta: ${new Date().toISOString().slice(0, 10)}`,
  "",
  "Šis failas yra automatiškai sugeneruota MVP paleidimo santrauka. Ji nepakeičia `docs/roadmap.md`, bet parodo, kas jau techniškai padengta ir kas dar blokuoja pilną paleidimą.",
  "",
  "## Techniniai vartai",
  "",
  ...technicalGates,
  "",
  "## Blokatoriai",
  "",
  "| Statusas | Darbas | Pastaba |",
  "| --- | --- | --- |",
  ...blockerRows,
  "",
  "## Kiti veiksmai",
  "",
  ...nextSteps,
  "",
  "## Patikros komanda",
  "",
  "```bash",
  "node scripts/pre-go-live.js https://agnezukiene.lt",
  "```",
  ""
].join("\n");

fs.writeFileSync(outFile, md);
console.log(`Generated ${path.relative(root, outFile)}.`);
