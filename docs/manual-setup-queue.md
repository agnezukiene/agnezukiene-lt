# Manual setup queue

Atnaujinta: 2026-07-12

Šis failas yra trumpa rankinių paskyrų veiksmų eilė. Jis papildo `docs/launch-readiness.md`, `docs/cloudflare-variables-runbook.md` ir `docs/analytics-search-console-runbook.md`.

## 0. Cloudflare redeploy po paskutinio GitHub commit

Tikslas: užtikrinti, kad production Worker naudoja naujausią `main` commitą.

Jei `npm run pre-go-live -- https://agnezukiene.lt` krenta ties nežinomo URL 404 turiniu, Cloudflare Workers build reikia redeployinti iš naujausio GitHub `main`.

Cloudflare vieta:

```text
Workers & Pages -> agnezukienepage -> Deployments -> Redeploy latest main build
```

Redeploy turi būti iš `main` šakos commit `358c1ab` arba naujesnio. Jei Cloudflare rodo senesnį commitą, pirmiausia reikia pasirinkti naujausią production deployment arba paleisti naują deploy iš GitHub `main`.

Po redeploy Codex patikra:

```bash
npm run pre-go-live -- https://agnezukiene.lt
```

Minimalus sėkmės požymis:

```text
https://agnezukiene.lt/neegzistuojantis-puslapis
```

turi grąžinti `HTTP 404`, o puslapio turinyje turi būti lietuviškas tekstas `Puslapis nerastas`. Jei statusas `404`, bet atsakymo dydis `0` baitų, production Worker dar nėra persidiegęs su naujausiu kodu.

## 1. Resend domenas ir siuntėjas

Tikslas: paruošti kontaktų formos laiškų siuntimą iš `agnezukiene.lt`.

1. Resend paskyroje pridėti domeną `agnezukiene.lt`.
2. Resend sugeneruotus DNS įrašus pridėti Cloudflare DNS zonoje.
3. Palaukti, kol Resend domenas bus patvirtintas.
4. Pasirinkti siuntėją:

```text
Agnė Žukienė <noreply@agnezukiene.lt>
```

Patikra po šio žingsnio: Resend turi rodyti domeną / siuntėją kaip verified.

## 2. Cloudflare Worker variables ir secrets

Tikslas: leisti Worker realiai išsiųsti kontaktų formos laišką.

Cloudflare vieta:

```text
Workers & Pages -> agnezukienepage -> Settings -> Variables and Secrets
```

Pridėti variable:

```text
CONTACT_FROM_EMAIL=Agnė Žukienė <noreply@agnezukiene.lt>
```

Pridėti secret:

```text
RESEND_API_KEY=<Resend API key>
```

Secrets nerašomi į repo, dokumentus ar pokalbį.

Patikra po šio žingsnio:

```bash
npm run pre-go-live -- https://agnezukiene.lt
```

Tada gyvai išsiųsti testinę užklausą iš `https://agnezukiene.lt/kontaktai.html` ir patikrinti, ar laiškas ateina į `zukiene.agne@gmail.com`.

## 3. GA4 Measurement ID

Tikslas: įjungti analitiką tik su lankytojo sutikimu.

1. GA4 sukurti property ir Web stream:

```text
Web stream URL: https://agnezukiene.lt
Web stream name: agnezukiene.lt
```

2. Paimti Measurement ID, pvz.:

```text
G-XXXXXXXXXX
```

3. Įrašyti į `public/assets/js/config.js`:

```js
ga4MeasurementId: "G-XXXXXXXXXX"
```

Patikra:

```bash
npm run pre-go-live -- https://agnezukiene.lt
```

Tada atidaryti svetainę, paspausti `Sutinku` slapukų juostoje ir GA4 Realtime / DebugView patikrinti, kad matomas apsilankymas bei nėra kontaktų formos jautrių laukų.

## 4. Search Console

Tikslas: patvirtinti domeną Google Search Console ir pateikti sitemap.

1. Search Console sukurti `Domain property`:

```text
agnezukiene.lt
```

2. Google sugeneruotą TXT įrašą pridėti Cloudflare DNS:

```text
Type: TXT
Name: @
Content: google-site-verification=...
TTL: Auto
Proxy: DNS only
```

3. Search Console spausti verify.
4. Pateikti sitemap:

```text
https://agnezukiene.lt/sitemap.xml
```

Patikra po šio žingsnio: Search Console rodo domain property kaip verified, o sitemap kaip submitted / discovered.

## 5. Agnės turinio patvirtinimai

Tikslas: pašalinti likusius turinio blokatorius prieš pilną viešą paleidimą.

Pildomas failas:

```text
docs/content-approval.md
```

Dabartinis kitas klausimas:

```text
Konsultacijos vyks:
[ ] tik gyvai
[ ] tik nuotoliu
[ ] gyvai ir nuotoliu
[ ] dar nenoriu to viešinti
```

Po kiekvieno sprendimo reikia atnaujinti viešus puslapius, `docs/content-approval.md`, `docs/roadmap.md` ir paleisti:

```bash
npm run pre-go-live -- https://agnezukiene.lt
```
