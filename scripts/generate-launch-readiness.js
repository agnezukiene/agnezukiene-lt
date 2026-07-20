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

function vilniusDate() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Vilnius",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function roadmapHasDone(text) {
  return roadmap.includes(`\`[x]\` ${text}`) || roadmap.includes(`[x] ${text}`);
}

const config = read("public/assets/js/config.js");
const wrangler = read("wrangler.jsonc");
const worker = read("src/index.js");
const roadmap = read("docs/roadmap.md");
const contentApproval = read("docs/content-approval.md");

const ga4Configured = /ga4MeasurementId:\s*"G-[A-Z0-9]+"/.test(config);
const ga4MeasurementId = config.match(/ga4MeasurementId:\s*"(G-[A-Z0-9]+)"/)?.[1] || "";
const turnstileConfigured = /turnstileSiteKey:\s*"0x[0-9A-Za-z_-]+"/.test(config);
const contactOriginConfigured = wrangler.includes('"ALLOWED_ORIGIN": "https://agnezukiene.lt"');
const contactRecipientConfigured = wrangler.includes('"CONTACT_TO_EMAIL": "zukiene.agne@gmail.com"');
const contactRateLimiterConfigured = wrangler.includes('"name": "CONTACT_RATE_LIMITER"')
  && wrangler.includes('"limit": 5')
  && wrangler.includes('"period": 60');
const contactSenderConfigured = wrangler.includes('"CONTACT_FROM_EMAIL"') || roadmapHasDone("CONTACT_FROM_EMAIL");
const workerRequiresEmailConfig = worker.includes("env.RESEND_API_KEY") && worker.includes("env.CONTACT_FROM_EMAIL");
const workerRequiresProtectedFormConfig = worker.includes("!env.TURNSTILE_SECRET_KEY")
  && worker.includes("!env.ALLOWED_ORIGIN")
  && worker.includes("!env.RESEND_API_KEY");
const workerCanSendViaResend = worker.includes("https://api.resend.com/emails") && worker.includes("reply_to");
const pendingContentDecisions = [...contentApproval.matchAll(/^\| laukia \| ([^|]+) \|/gm)]
  .map((match) => match[1].trim());
const nextContentQuestion = contentApproval.match(/## Kitas klausimas Agnei[\s\S]*?```text\n([\s\S]*?)```/);
const contentQuestionDetail = nextContentQuestion
  ? nextContentQuestion[1].split("\n").map((line) => line.trim()).filter(Boolean).join(" ")
  : "žr. docs/content-approval.md";

const technicalGates = [
  checked(has("scripts/pre-go-live.js", "scripts/check-site-integrity.js"), "Site integrity check yra pre-go-live dalis"),
  checked(has("scripts/pre-go-live.js", "scripts/check-color-contrast.js"), "WCAG spalvų kontrasto patikra yra pre-go-live dalis"),
  checked(has("scripts/pre-go-live.js", "scripts/check-analytics-privacy.js"), "GA4 privatumo patikra yra pre-go-live dalis"),
  checked(has("scripts/check-analytics-privacy.js", "withdrawing consent should reload a page where analytics is no longer loaded") && has("public/assets/js/site.js", "window.location.reload()"), "Lankomumo sutikimo atšaukimas sustabdo matavimą, pašalina jo slapukus ir iš naujo atveria puslapį be lankomumo įrankio"),
  checked(has("scripts/pre-go-live.js", "scripts/check-contact-api.js"), "Kontaktų API patikra yra pre-go-live dalis"),
  checked(has("scripts/pre-go-live.js", "scripts/check-static-asset-cache.js"), "Failų versijų ir naršyklės talpyklos patikra yra pre-go-live dalis"),
  checked(has("scripts/check-live-site.js", "public, max-age=31536000, immutable") && has("src/index.js", "STATIC_ASSET_VERSION"), "Nekintantys stiliai ir programos failai pakartotinai naudojami be bereikalingo laukimo"),
  checked(has("scripts/check-live-site.js", "page text should be revalidated so visitors receive updates"), "Gyvi puslapių tekstai persitikrina naršyklėje ir neužstringa senoje versijoje"),
  checked(has("scripts/check-live-site.js", '"no-store"') && has("src/index.js", '"cache-control": "no-store"'), "Kontaktų formos serverio atsakymai nesaugomi naršyklės talpykloje"),
  checked(has("scripts/pre-go-live.js", "scripts/check-content-security-policy.js"), "Leidžiamų svetainės šaltinių apsauga yra pre-go-live dalis"),
  checked(has("scripts/check-site-integrity.js", "docs/manual-setup-queue.md"), "Rankinių setup veiksmų eilė yra privalomas repo failas"),
  checked(has("scripts/check-live-site.js", "https://www.agnezukiene.lt"), "Production live check tikrina www nukreipimą"),
  checked(has("src/index.js", 'url.pathname.endsWith(".html")') && has("scripts/check-live-site.js", "expected 301"), "Seni .html puslapių adresai visam laikui nukreipiami į dabartinius adresus"),
  checked(has("scripts/check-live-site.js", "http://agnezukiene.lt"), "Production live check tikrina HTTP į HTTPS"),
  checked(has("wrangler.jsonc", '"workers_dev": false') && has("wrangler.jsonc", '"preview_urls": false') && has("scripts/check-live-site.js", "Public workers.dev copy should stay disabled"), "Vieša techninė workers.dev kopija ir automatinės peržiūros nuorodos išjungtos bei tikrinamos gyvai"),
  checked(has("scripts/check-live-site.js", "/neegzistuojantis-puslapis"), "Production live check tikrina 404"),
  checked(has("scripts/check-live-site.js", "/api/contact") && has("scripts/check-live-site.js", "invalid JSON"), "Production live check tikrina kontaktų API klaidų kelius"),
  checked(has("scripts/check-site-integrity.js", "contains internal pre-launch wording"), "Public HTML patikra saugo nuo vidinių paleidimo frazių"),
  checked(has("scripts/check-site-integrity.js", "missing skip link to main content"), "Public HTML patikra tikrina bazinį prieinamumą"),
  checked(has("scripts/check-site-integrity.js", "main content should be focusable through the skip link"), "Klaviatūros nuoroda perkelia aktyvią vietą į pagrindinį turinį"),
  checked(has("public/assets/js/site.js", 'classList.add("has-js")') && has("public/assets/css/styles.css", ".has-js .nav-links"), "Telefono navigacija lieka pasiekiama, jei papildomas svetainės kodas neįsikrauna"),
  checked(has("scripts/check-live-site.js", "strict-origin-when-cross-origin") && has("scripts/check-site-integrity.js", "missing security header"), "Live ir lokali patikra tikrina saugumo antraščių reikšmes"),
  checked(has("scripts/check-live-site.js", "strict-transport-security") && has("src/index.js", "max-age=31536000"), "Naršyklė įpareigojama vienerius metus naudoti tik saugų svetainės ryšį"),
  checked(has("scripts/check-live-site.js", "requiredPolicyDirectives") && has("src/index.js", "CONTENT_SECURITY_POLICY"), "Gyva svetainė atmeta neleistiną svetimą kodą"),
  checked(has("scripts/check-live-site.js", "/favicon.svg") && has("scripts/check-site-integrity.js", "missing SVG favicon link"), "Naršyklės kortelės ženkliukas tikrinamas lokaliai ir gyvoje svetainėje"),
  checked(has("scripts/check-site-integrity.js", "missing social sharing metadata") && has("scripts/check-live-site.js", "missing social image description"), "Nuorodų dalijimosi peržiūros tikrinamos lokaliai ir gyvoje svetainėje"),
  checked(has("public/index.html", "agne-zukiene-psichologe-sidabro-pienas-768w.avif") && has("scripts/check-site-integrity.js", "responsive hero image"), "Pagrindinė nuotrauka pritaikyta skirtingiems ekranams ir failų dydžiai saugomi automatiškai"),
  checked(has("scripts/check-contact-api.js", "Email reply choice should require an email address") && has("scripts/check-contact-api.js", "Phone reply choice should require a phone number"), "Kontaktų forma sutikrina pasirinktą atsakymo būdą"),
  checked(has("public/assets/js/site.js", "aria-invalid") && has("public/kontaktai.html", "aria-describedby=\"form-status\""), "Formos klaidos susietos su konkrečiais laukais"),
  checked(has("public/kontaktai.html", "form-privacy") && !has("public/kontaktai.html", "name=\"privacy\"") && !has("src/index.js", "data.privacy"), "Kontaktų forma aiškiai pateikia privatumo informaciją nereikalaudama nereikalingo sutikimo"),
  checked(has("scripts/check-site-integrity.js", "visible brand text should provide its accessible name"), "Pagrindinio logotipo pavadinimą pagalbinės skaitymo priemonės perskaito taip pat, kaip jis matomas"),
  checked(has("scripts/check-site-integrity.js", "emergency links should not be tracked") && has("scripts/check-live-site.js", "missing direct 112 call link"), "Skubios pagalbos nuorodos veikia ir jų paspaudimai sąmoningai nematuojami"),
  checked(has("public/assets/css/styles.css", "prefers-reduced-motion: reduce"), "Svetainė gerbia lankytojo mažesnio judesio pasirinkimą"),
  checked(turnstileConfigured, "Turnstile site key yra frontend konfigūracijoje"),
  checked(workerRequiresProtectedFormConfig, "Kontaktų forma neveikia, jei trūksta bent vieno apsaugos nustatymo"),
  checked(has("scripts/check-contact-api.js", "Unexpected Turnstile hostname should be rejected") && has("scripts/check-contact-api.js", "Unexpected Turnstile action should be rejected"), "Formos apsauga tikrina agnezukiene.lt adresą ir kontaktų formos paskirtį"),
  checked(contactRateLimiterConfigured && has("scripts/check-contact-api.js", "Too many verified submissions should be rate limited"), "Kontaktų forma riboja per dažną laiškų siuntimą ir paaiškina, kada bandyti dar kartą"),
  checked(workerRequiresEmailConfig, "Worker nepaleidžia formos sėkmės be Resend ir siuntėjo konfigūracijos"),
  checked(workerCanSendViaResend, "Worker turi Resend laiško siuntimo implementaciją"),
  checked(has("scripts/check-contact-api.js", "resend_test"), "Kontaktų API mock testas padengia Resend sėkmės kelią"),
  checked(contactOriginConfigured, "ALLOWED_ORIGIN nustatytas production domenui"),
  checked(contactRecipientConfigured, "CONTACT_TO_EMAIL nustatytas")
];

const launchBlockers = [
  {
    label: "Resend domenas / siuntėjas",
    done: roadmapHasDone("Resend domenas / siuntėjas"),
    detail: roadmapHasDone("Resend domenas / siuntėjas")
      ? "domenas patvirtintas ir paruoštas laiškams siųsti"
      : "reikia Resend sugeneruotų DNS įrašų ir patvirtinto siuntėjo"
  },
  {
    label: "CONTACT_FROM_EMAIL",
    done: contactSenderConfigured,
    detail: contactSenderConfigured
      ? "siuntėjo adresas nustatytas Cloudflare Worker konfigūracijoje"
      : "reikia Cloudflare Worker variable, pvz. Agnė Žukienė <noreply@agnezukiene.lt>"
  },
  {
    label: "RESEND_API_KEY secret",
    done: roadmapHasDone("RESEND_API_KEY"),
    detail: roadmapHasDone("RESEND_API_KEY")
      ? "tik siuntimui skirtas raktas saugiai laikomas Cloudflare"
      : "reikia Cloudflare Worker secret iš Resend API Keys"
  },
  {
    label: "Gyvas kontaktų formos siuntimas",
    done: roadmapHasDone("Patikrinti formos siuntimą gyvai"),
    detail: roadmapHasDone("Patikrinti formos siuntimą gyvai")
      ? "2026-07-20 po apsaugos sustiprinimo Resend patvirtino pristatytą techninį laišką"
      : "galima tik po Resend secret ir siuntėjo įjungimo"
  },
  {
    label: "GA4 Measurement ID",
    done: ga4Configured,
    detail: ga4Configured
      ? `${ga4MeasurementId} įrašytas į public/assets/js/config.js`
      : "reikia G-... reikšmės į public/assets/js/config.js"
  },
  {
    label: "GA4 Realtime / DebugView",
    done: roadmapHasDone("Patikrinti GA4 Realtime"),
    detail: roadmapHasDone("Patikrinti GA4 Realtime")
      ? "patikrinta ir pažymėta roadmap"
      : "galima tik po GA4 Measurement ID"
  },
  {
    label: "Search Console domain property",
    done: roadmapHasDone("Search Console patvirtinti"),
    detail: roadmapHasDone("Search Console patvirtinti")
      ? "patvirtinta per Cloudflare DNS TXT"
      : "reikia Google TXT įrašo Cloudflare DNS"
  },
  {
    label: "Search Console sitemap pateikimas",
    done: roadmapHasDone("Patikrinti Search Console sitemap pateikimą"),
    detail: roadmapHasDone("Patikrinti Search Console sitemap pateikimą")
      ? "sitemap pateiktas ir pažymėtas roadmap"
      : "galima tik po Search Console patvirtinimo"
  },
  {
    label: "Agnės turinio patvirtinimai",
    done: pendingContentDecisions.length === 0,
    detail: pendingContentDecisions.length
      ? `laukia ${pendingContentDecisions.length} sprendimų: ${pendingContentDecisions.join(", ")}`
      : "visi docs/content-approval.md sprendimai pažymėti kaip užbaigti"
  },
  {
    label: "Kitas Agnės turinio klausimas",
    done: pendingContentDecisions.length === 0,
    detail: contentQuestionDetail
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
  `Atnaujinta: ${vilniusDate()}`,
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
