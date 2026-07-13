# Agnė Žukienė website MVP

Statinė Agnės Žukienės psichologės svetainė, deployinama per Cloudflare Workers su `public/` statiniais failais ir Worker endpointu kontaktų formai.

## Būsena

- Production domenas: `https://agnezukiene.lt`
- `www.agnezukiene.lt` nukreipiamas į root domeną.
- GitHub repo: `agnezukiene/agnezukiene-lt`
- Cloudflare Worker projektas: `agnezukienepage`
- Pagrindinis planas: `docs/roadmap.md`
- Paleidimo santrauka: `docs/launch-readiness.md`
- Rankinių paskyrų veiksmų eilė: `docs/manual-setup-queue.md`

## Lokalus darbas

```bash
npm run serve
```

Atidaro statinę svetainę iš `public/` per `http://localhost:4173`.

## Patikros

Pagrindinė prieš paleidimą naudojama komanda:

```bash
npm run pre-go-live -- https://agnezukiene.lt
```

Ji sugeneruoja SEO inventorių, turinio registrą, paleidimo santrauką, patikrina HTML/SEO vientisumą, WCAG spalvų kontrastą, GA4 privatumą, kontaktų API, whitespace ir gyvą production svetainę.

Atskiros komandos:

```bash
npm run check
npm run check:contrast
npm run check:analytics
npm run check:contact
npm run check:live -- https://agnezukiene.lt
npm run seo:inventory
npm run content:registry
npm run launch:readiness
```

## Deploy

Cloudflare naudoja:

```bash
npm run deploy
```

Svarbu: `wrangler.jsonc` turi kelti tik `./public`, o Worker entrypoint yra `src/index.js`.

## Secrets ir kintamieji

Repo nelaikome secrets. Vieši frontend raktai yra `public/assets/js/config.js`.

Cloudflare Worker variables/secrets aprašyti `docs/cloudflare-variables-runbook.md`.
Likę rankiniai Resend, GA4, Search Console ir turinio veiksmai sudėti į `docs/manual-setup-queue.md`.

Dar reikalingi iki pilno kontaktų formos veikimo:

- `RESEND_API_KEY`
- gyvas formos siuntimo testas

## Likę MVP blokatoriai

Automatinė santrauka yra `docs/launch-readiness.md`. Šiuo metu pagrindiniai likę darbai:

- Resend domenas / siuntėjas ir `RESEND_API_KEY`
- Agnės turinio patvirtinimai iš `docs/content-approval.md`
