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
- `[x]` Custom domain: `agnezukiene.lt`.
- `[!]` Laukiama, kol viešas DNS pradės rodyti Cloudflare vietoj Interneto vizijos.
- `[ ]` `www.agnezukiene.lt` nukreiptas į pagrindinį domeną.

## Prieš viešą paleidimą

- `[ ]` Patikrinti pradžios puslapį desktop vaizde.
- `[ ]` Patikrinti pradžios puslapį mobile vaizde.
- `[ ]` Patikrinti mobile meniu.
- `[ ]` Patikrinti visus vidinius puslapius.
- `[ ]` Patikrinti `404.html`.
- `[ ]` Patikrinti `sitemap.xml`.
- `[ ]` Patikrinti `robots.txt`.
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
- `[ ]` Cloudflare nustatyti `CONTACT_TO_EMAIL=zukiene.agne@gmail.com`.
- `[ ]` Cloudflare nustatyti `ALLOWED_ORIGIN=https://agnezukiene.lt`.
- `[ ]` Cloudflare secrets: `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`.
- `[ ]` Patikrinti sėkmingą formos siuntimą gyvai.
- `[ ]` Patikrinti formos klaidas gyvai.

## Analitika ir paieška

- `[ ]` Sukurti GA4 property.
- `[ ]` Įdiegti GA4 su sutikimo režimu.
- `[ ]` Patikrinti GA4 Realtime.
- `[ ]` Search Console patvirtinti per Cloudflare DNS TXT.
- `[ ]` Pateikti `sitemap.xml`.
