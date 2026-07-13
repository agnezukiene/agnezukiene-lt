# Agnės Žukienės svetainės go-live checklist

Atnaujinta: 2026-07-12

## Prieš pirmą commit

- `[x]` Sukurtas lokalus Git projektas.
- `[x]` Prijungtas GitHub remote: `https://github.com/agnezukiene/agnezukiene-lt.git`.
- `[x]` Sukurti MVP puslapiai.
- `[x]` Sukurtas `assets/css/styles.css`.
- `[x]` Sukurtas `assets/js/site.js`.
- `[x]` Sukurti `public/sitemap.xml` ir `public/robots.txt`.
- `[x]` Sukurtas `scripts/check-site-integrity.js`.
- `[x]` Sukurtas ir į pre-go-live įtrauktas `scripts/check-color-contrast.js`; 9 paletės poros patikrintos production 2026-07-13.
- `[x]` Sukurtas `scripts/check-analytics-privacy.js`.
- `[x]` Sukurtas `scripts/check-contact-api.js`.
- `[x]` Sukurtas `scripts/check-live-site.js`.
- `[x]` Sukurtas `scripts/pre-go-live.js`.
- `[x]` Sukurtas `docs/content-approval.md`.
- `[x]` Sukurtas `docs/launch-readiness.md`.
- `[x]` Techninė patikra praėjo 9 HTML failams.
- `[x]` Analitikos privatumo patikra įtraukta į pre-go-live.
- `[x]` Kontaktų API patikra įtraukta į pre-go-live.
- `[x]` Peržiūrėti `git status --short`.
- `[x]` Padaryti pirmą commit.
- `[x]` Push į GitHub `main`.

## Prieš Cloudflare Pages prijungimą

- `[x]` GitHub repo turi matytis visi MVP failai.
- `[x]` Cloudflare rodo domeną `agnezukiene.lt`.
- `[x]` Cloudflare Workers prijungtas prie GitHub repo.
- `[x]` Production branch: `main`.
- `[x]` Deploy command: `npx wrangler deploy`.
- `[x]` Assets output directory: `./public`.
- `[x]` Jei Cloudflare naudoja `npx wrangler deploy`, assets directory turi būti `./public`, ne repo šaknis.
- `[x]` Pirmas deploy sėkmingas į `https://agnezukienepage.petrauskaiteagne.workers.dev`.
- `[x]` Laikinas Cloudflare URL patikrintas automatiniu smoke testu.
- `[x]` Custom domain: `agnezukiene.lt`.
- `[x]` Viešas DNS rodo Cloudflare, o root domenas grąžina `HTTP/2 200`.
- `[x]` `www.agnezukiene.lt` nukreipimas į pagrindinį domeną paruoštas Worker lygiu ir patikrintas production smoke testu.

## Prieš viešą paleidimą

- `[x]` Patikrinti pradžios puslapį desktop vaizde.
- `[x]` Patikrinti pradžios puslapį mobile vaizde.
- `[x]` Patikrinti mobile meniu.
- `[x]` Patikrinti visus vidinius puslapius laikiname Cloudflare URL.
- `[x]` Patikrinti `404.html`.
- `[x]` Lokaliai patikrinti, kad Worker fallback nežinomam URL grąžina lietuvišką `404.html` turinį su 404 statusu.
- `[x]` Production patikrinti, kad nežinomas URL grąžina lietuvišką `404.html` turinį su 404 statusu; extensionless `/404` fallback gyvai patikrintas 2026-07-13.
- `[x]` Patikrinti `sitemap.xml`.
- `[x]` Patikrinti `robots.txt`.
- `[x]` Patikrinti saugumo antraštes gyvame puslapyje.
- `[x]` Production smoke testas patikrina HTTP į HTTPS, `www` į root ir nežinomo puslapio 404.
- `[ ]` Patvirtinti konsultacijos formatą.
- `[ ]` Patvirtinti kainą, jei ji bus rodoma.
- `[ ]` Patvirtinti konsultacijos trukmę, jei ji bus rodoma.
- `[~]` Privatumo politikos tekstas techniškai atnaujintas; reikia Agnės galutinio patvirtinimo.
- `[~]` Slapukų politikos tekstas techniškai atnaujintas; reikia Agnės galutinio patvirtinimo.

## Kontaktų forma

- `[x]` Sukurti Cloudflare Worker endpointą `/api/contact`.
- `[x]` Prijungti Turnstile: widget sukurtas, site key kode, secret Cloudflare Worker nustatymuose.
- `[~]` Prijungti Resend arba kitą laiškų siuntimo servisą: kodas paruoštas, reikia API rakto.
- `[x]` `/api/contact` laikiname Cloudflare URL pasiekia Worker backendą.
- `[x]` Kontaktų forma turi honeypot lauką paprastų botų filtravimui.
- `[x]` Kontaktų API validacija ir mock Resend sėkmės kelias patikrinti automatiškai.
- `[x]` Kontaktų forma rodo backend klaidas ir atnaujina Turnstile po siuntimo bandymo.
- `[x]` Production smoke testas tikrina kontaktų API GET, origin, content-type, request size, JSON ir validacijos klaidas.
- `[x]` Kontaktų API atmeta ne JSON ir per dideles užklausas.
- `[x]` Sukurtas Cloudflare variables/secrets runbook `docs/cloudflare-variables-runbook.md`.
- `[x]` Cloudflare/Worker nustatyti `CONTACT_TO_EMAIL=zukiene.agne@gmail.com` per `wrangler.jsonc`.
- `[x]` Cloudflare/Worker nustatyti `ALLOWED_ORIGIN=https://agnezukiene.lt` per `wrangler.jsonc`.
- `[x]` Cloudflare/Worker nustatyti `CONTACT_FROM_EMAIL=Agnė Žukienė <noreply@agnezukiene.lt>` per `wrangler.jsonc`.
- `[~]` Cloudflare secrets: `TURNSTILE_SECRET_KEY` padarytas, `RESEND_API_KEY` laukia.
- `[ ]` Patikrinti sėkmingą formos siuntimą gyvai.
- `[ ]` Patikrinti formos klaidas gyvai.

## Analitika ir paieška

- `[x]` Sukurtas GA4 ir Search Console runbook `docs/analytics-search-console-runbook.md`.
- `[x]` GA4 eventų allowlist ir jautrių parametrų patikra automatizuota.
- `[x]` Sukurti GA4 property ir Web stream svetainei `agnezukiene.lt`.
- `[x]` Įdiegti GA4 su sutikimo režimu ir Measurement ID `G-3N3MGJHS0V`.
- `[x]` Patikrinti GA4 Realtime / DebugView.
- `[x]` Search Console patvirtinti per Cloudflare DNS TXT; viešas verification įrašas patikrintas 2026-07-13.
- `[x]` Pateikti `https://agnezukiene.lt/sitemap.xml` ir patikrinti viešą HTTP 200 atsakymą.
