# Cloudflare variables and secrets runbook

Atnaujinta: 2026-07-06

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
| `ALLOWED_ORIGIN` | `https://agnezukiene.lt` | Variable | laukia po domeno DNS |
| `CONTACT_FROM_EMAIL` | `Agnė Žukienė <noreply@agnezukiene.lt>` | Variable | laukia po Resend domeno patvirtinimo |

Kol `agnezukiene.lt` DNS dar nepersijungęs, testavimui galima laikinai naudoti:

```text
ALLOWED_ORIGIN=https://agnezukienepage.petrauskaiteagne.workers.dev
```

Prieš viešą paleidimą pakeisti į:

```text
ALLOWED_ORIGIN=https://agnezukiene.lt
```

## 2. Secrets

Pridėti kaip secrets:

| Name | Iš kur gaunama | Statusas |
| --- | --- | --- |
| `RESEND_API_KEY` | Resend paskyroje sukurtas API key | laukia |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile widget secret key | laukia |

Secrets niekada nerašomi į repo, `.env`, dokumentus ar pokalbį.

## 3. Vieši frontend raktai

Vieši raktai laikomi `public/assets/js/config.js`.

| Laukas | Iš kur gaunama | Statusas |
| --- | --- | --- |
| `ga4MeasurementId` | GA4 Web Stream Measurement ID, pvz. `G-XXXXXXXXXX` | laukia |
| `turnstileSiteKey` | Cloudflare Turnstile widget site key | laukia |

Šie raktai nėra secrets, bet turi būti tikslūs.

## 4. Patikra po kintamųjų pridėjimo

Po kiekvieno Cloudflare variables/secrets pakeitimo:

1. Cloudflare gali reikėti naujo deploy arba redeploy.
2. Patikrinti kontaktų endpointą:

```bash
node scripts/check-live-site.js https://agnezukienepage.petrauskaiteagne.workers.dev
```

3. Kai bus `RESEND_API_KEY` ir `CONTACT_FROM_EMAIL`, atlikti realų formos testą iš `kontaktai.html`.
4. Patikrinti, kad el. laiškas ateina į `zukiene.agne@gmail.com`.
5. Patikrinti, kad GA4 negauna vardo, el. pašto, telefono ar žinutės teksto.

## 5. Dabartinė laukimo seka

1. `ALLOWED_ORIGIN`
2. Resend domeno / siuntėjo paruošimas
3. `CONTACT_FROM_EMAIL`
4. `RESEND_API_KEY`
5. Turnstile widget
6. `TURNSTILE_SECRET_KEY`
7. `turnstileSiteKey` į `public/assets/js/config.js`
8. GA4 property
9. `ga4MeasurementId` į `public/assets/js/config.js`
