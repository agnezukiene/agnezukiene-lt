# Cloudflare variables and secrets runbook

Atnaujinta: 2026-07-10

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
| `CONTACT_FROM_EMAIL` | `Agnė Žukienė <noreply@agnezukiene.lt>` arba Resend patvirtintas siuntėjas | Variable | laukia po Resend domeno patvirtinimo |

`ALLOWED_ORIGIN` jau nustatytas production domenui. Jei kada nors reikės testuoti tik laikiną `workers.dev` domeną, šią reikšmę reikia keisti laikinai ir po testo grąžinti į `https://agnezukiene.lt`.

## 2. Secrets

Pridėti kaip secrets:

| Name | Iš kur gaunama | Statusas |
| --- | --- | --- |
| `RESEND_API_KEY` | Resend paskyroje sukurtas API key | laukia |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile widget secret key | padaryta Cloudflare dashboard |

Secrets niekada nerašomi į repo, `.env`, dokumentus ar pokalbį.

## 3. Vieši frontend raktai

Vieši raktai laikomi `public/assets/js/config.js`.

| Laukas | Iš kur gaunama | Statusas |
| --- | --- | --- |
| `ga4MeasurementId` | GA4 Web Stream Measurement ID, pvz. `G-XXXXXXXXXX` | laukia |
| `turnstileSiteKey` | Cloudflare Turnstile widget site key | padaryta `public/assets/js/config.js` |

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

1. Resend domeno / siuntėjo paruošimas.
2. `CONTACT_FROM_EMAIL`.
3. `RESEND_API_KEY`.
4. GA4 property.
5. `ga4MeasurementId` į `public/assets/js/config.js`.

## 6. Resend rekomenduojamas nustatymas

Rekomenduojamas MVP variantas: Resend pridėti domeną `agnezukiene.lt` ir naudoti siuntėją:

```text
Agnė Žukienė <noreply@agnezukiene.lt>
```

Jei Resend paprašys DNS įrašų, į Cloudflare reikia pridėti tik tuos DNS įrašus, kuriuos sugeneruos Resend. Jų nereikia išgalvoti rankiniu būdu. Po Resend domeno patvirtinimo Cloudflare Worker reikia turėti:

```text
CONTACT_FROM_EMAIL=Agnė Žukienė <noreply@agnezukiene.lt>
RESEND_API_KEY=<secret>
```
