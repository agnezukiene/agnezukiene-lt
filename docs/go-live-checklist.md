# Agnės Žukienės svetainės go-live checklist

Atnaujinta: 2026-07-06

## Prieš pirmą commit

- `[x]` Sukurtas lokalus Git projektas.
- `[x]` Prijungtas GitHub remote: `https://github.com/agnezukiene/agnezukiene-lt.git`.
- `[x]` Sukurti MVP puslapiai.
- `[x]` Sukurtas `assets/css/styles.css`.
- `[x]` Sukurtas `assets/js/site.js`.
- `[x]` Sukurti `public/sitemap.xml` ir `public/robots.txt`.
- `[x]` Sukurtas `scripts/check-site-integrity.js`.
- `[x]` Sukurtas `scripts/check-live-site.js`.
- `[x]` Sukurtas `scripts/pre-go-live.js`.
- `[x]` Techninė patikra praėjo 9 HTML failams.
- `[x]` Peržiūrėti `git status --short`.
- `[x]` Padaryti pirmą commit.
- `[x]` Push į GitHub `main`.

## Prieš Cloudflare Pages prijungimą

- `[x]` GitHub repo turi matytis visi MVP failai.
- `[ ]` Cloudflare turi rodyti domeną `agnezukiene.lt`.
- `[ ]` Cloudflare Pages prijungtas prie GitHub repo.
- `[ ]` Production branch: `main`.
- `[ ]` Build command: tuščias.
- `[ ]` Build output directory: `/`.
- `[x]` Jei Cloudflare naudoja `npx wrangler deploy`, assets directory turi būti `./public`, ne repo šaknis.
- `[x]` Pirmas deploy sėkmingas į `https://agnezukienepage.petrauskaiteagne.workers.dev`.
- `[x]` Laikinas Cloudflare URL patikrintas automatiniu smoke testu.
- `[x]` Custom domain: `agnezukiene.lt`.
- `[!]` Laukiama, kol viešas DNS pradės rodyti Cloudflare vietoj Interneto vizijos.
- `[x]` `www.agnezukiene.lt` nukreipimas į pagrindinį domeną paruoštas Worker lygiu.

## Prieš viešą paleidimą

- `[x]` Patikrinti pradžios puslapį desktop vaizde.
- `[x]` Patikrinti pradžios puslapį mobile vaizde.
- `[x]` Patikrinti mobile meniu.
- `[x]` Patikrinti visus vidinius puslapius laikiname Cloudflare URL.
- `[ ]` Patikrinti `404.html`.
- `[ ]` Patikrinti `sitemap.xml`.
- `[ ]` Patikrinti `robots.txt`.
- `[x]` Patikrinti saugumo antraštes gyvame puslapyje.
- `[ ]` Patvirtinti konsultacijos formatą.
- `[ ]` Patvirtinti kainą, jei ji bus rodoma.
- `[ ]` Patvirtinti konsultacijos trukmę, jei ji bus rodoma.
- `[ ]` Patvirtinti privatumo politikos tekstą.
- `[ ]` Patvirtinti slapukų politikos tekstą.

## Kontaktų forma

- `[x]` Sukurti Cloudflare Worker endpointą `/api/contact`.
- `[~]` Prijungti Turnstile: kodas paruoštas, reikia Cloudflare site key ir secret.
- `[~]` Prijungti Resend arba kitą laiškų siuntimo servisą: kodas paruoštas, reikia API rakto.
- `[x]` `/api/contact` laikiname Cloudflare URL pasiekia Worker backendą.
- `[x]` Sukurtas Cloudflare variables/secrets runbook `docs/cloudflare-variables-runbook.md`.
- `[ ]` Cloudflare nustatyti `CONTACT_TO_EMAIL=zukiene.agne@gmail.com`.
- `[ ]` Cloudflare nustatyti `ALLOWED_ORIGIN=https://agnezukiene.lt`.
- `[ ]` Cloudflare secrets: `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`.
- `[ ]` Patikrinti sėkmingą formos siuntimą gyvai.
- `[ ]` Patikrinti formos klaidas gyvai.

## Analitika ir paieška

- `[ ]` Sukurti GA4 property.
- `[~]` Įdiegti GA4 su sutikimo režimu: kodas paruoštas, reikia Measurement ID.
- `[ ]` Patikrinti GA4 Realtime.
- `[ ]` Search Console patvirtinti per Cloudflare DNS TXT.
- `[ ]` Pateikti `sitemap.xml`.
