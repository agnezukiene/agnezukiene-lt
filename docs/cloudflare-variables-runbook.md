# Cloudflare variables and secrets runbook

Atnaujinta: 2026-07-21

Šis dokumentas skirtas `agnezukienepage` Worker nustatymams Cloudflare paskyroje.

Vieta Cloudflare:

```text
Workers & Pages -> agnezukienepage -> Settings -> Variables and Secrets
```

## 1. Minimalūs kontaktų formos kintamieji

Pridėti kaip paprastus variables, ne secrets:

| Name | Value | Tipas | Statusas |
| --- | --- | --- | --- |
| `CONTACT_TO_EMAIL` | `zukiene.agne@gmail.com` | `wrangler.jsonc` variable | padaryta |
| `ALLOWED_ORIGIN` | `https://agnezukiene.lt` | `wrangler.jsonc` variable | padaryta |
| `CONTACT_FROM_EMAIL` | `Agnė Žukienė <noreply@agnezukiene.lt>` | `wrangler.jsonc` variable | padaryta |

`ALLOWED_ORIGIN` nustatytas tik pagrindiniam production domenui. Vieša `workers.dev` kopija ir automatinės peržiūros nuorodos išjungtos, todėl forma priima užklausas tik iš `https://agnezukiene.lt`.

## 2. Secrets

Pridėti kaip secrets:

| Name | Iš kur gaunama | Statusas |
| --- | --- | --- |
| `RESEND_API_KEY` | Resend paskyroje sukurtas tik siuntimui skirtas raktas | padaryta Cloudflare |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile widget secret key | padaryta Cloudflare dashboard |

Secrets niekada nerašomi į repo, `.env`, dokumentus ar pokalbį.

## 3. Vieši frontend raktai

Vieši raktai laikomi `public/assets/js/config.js`.

| Laukas | Iš kur gaunama | Statusas |
| --- | --- | --- |
| `ga4MeasurementId` | Google lankomumo matavimo numeris | padaryta `public/assets/js/config.js` |
| `turnstileSiteKey` | Cloudflare Turnstile widget site key | padaryta `public/assets/js/config.js` |

Šie raktai nėra secrets, bet turi būti tikslūs.

## 4. Laiškų dažnio apsauga

`wrangler.jsonc` faile nustatyta `CONTACT_RATE_LIMITER` apsauga. Ji leidžia ne daugiau kaip 5 patvirtintus formos siuntimus per minutę iš tos pačios interneto jungties. Riba tikrinama tik po „Cloudflare Turnstile“ patvirtinimo ir prieš perduodant laišką į „Resend“.

Šiai apsaugai nereikia papildomo slapto rakto ar rankinio nustatymo. Ji paskelbiama kartu su visa svetaine. Jei riba viršijama, laiškas nesiunčiamas, o lankytojui aiškiai pasiūloma palaukti minutę.

## 5. Patikra po kintamųjų pridėjimo

Po kiekvieno Cloudflare variables/secrets pakeitimo:

1. Cloudflare gali reikėti naujo deploy arba redeploy.
2. Patikrinti kontaktų endpointą:

```bash
node scripts/check-live-site.js https://agnezukiene.lt
```

3. Atlikti realų formos bandymą iš `https://agnezukiene.lt/kontaktai`.
4. Patikrinti Resend istorijoje, kad el. laiškas pristatytas į `zukiene.agne@gmail.com`.
5. Patikrinti, kad GA4 negauna vardo, el. pašto, telefono ar žinutės teksto.

## 6. Dabartinė būsena

Visi kontaktų formai ir lankomumo matavimui reikalingi nustatymai yra pridėti. 2026-07-19 Resend siuntimo istorijoje patvirtinti du sėkmingai pristatyti kontaktų formos laiškai. 2026-07-21 „Cloudflare“ priėmė laiškų dažnio apsaugos nustatymą, o visa gyva svetainė po paskelbimo praėjo pilną patikrą. Slaptų raktų reikšmės šiame projekte nesaugomos.

## 7. Resend rekomenduojamas nustatymas

Rekomenduojamas MVP variantas: Resend pridėti domeną `agnezukiene.lt` ir naudoti siuntėją:

```text
Agnė Žukienė <noreply@agnezukiene.lt>
```

Resend sugeneruoti domeno įrašai jau pridėti ir patvirtinti. Cloudflare Worker turi šiuos nustatymus:

```text
CONTACT_FROM_EMAIL=Agnė Žukienė <noreply@agnezukiene.lt>
RESEND_API_KEY=<secret>
```
