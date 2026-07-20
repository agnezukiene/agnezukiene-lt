# GA4 and Search Console runbook

Atnaujinta: 2026-07-21

Šis dokumentas skirtas dviem likusiems MVP matavimo ir paieškos darbams:

1. GA4 įjungimui tik su lankytojo sutikimu.
2. Google Search Console domain property patvirtinimui per Cloudflare DNS TXT.

## 1. GA4

Rekomenduojamas nustatymas:

| Laukas | Reikšmė |
| --- | --- |
| Property pavadinimas | `Agnė Žukienė` arba `agnezukiene.lt` |
| Web stream URL | `https://agnezukiene.lt` |
| Web stream name | `agnezukiene.lt` |

Po GA4 sukūrimo reikia paimti Measurement ID, kuris atrodo taip:

```text
G-XXXXXXXXXX
```

Tą ID reikia įrašyti į:

```js
// public/assets/js/config.js
window.AGNE_SITE_CONFIG = {
  ga4MeasurementId: "G-XXXXXXXXXX",
  turnstileSiteKey: "..."
};
```

GA4 skriptas įkeliamas tik tada, kai lankytojas paspaudžia `Sutinku` slapukų juostoje arba jau anksčiau yra sutikęs. Jei `ga4MeasurementId` tuščias, GA4 visai neįkeliamas.

## 2. Leidžiami GA4 įvykiai

Leidžiamų įvykių sąrašas laikomas `data/analytics-events.json`.

MVP leidžiami tik šie įvykiai:

```text
contact_intent_click
form_start
form_error
generate_lead
mailto_click
service_interest_select
consultation_format_select
```

Draudžiama į GA4 siųsti:

- vardą;
- el. paštą;
- telefono numerį;
- žinutės tekstą;
- diagnozes ar konkrečias jautrias detales.

## 3. GA4 patikra

Po Measurement ID įrašymo:

1. Paleisti:

```bash
node scripts/pre-go-live.js https://agnezukiene.lt
```

2. Atidaryti `https://agnezukiene.lt`.
3. Paspausti slapukų juostoje `Sutinku`.
4. GA4 Realtime arba DebugView patikrinti, kad matomas puslapio apsilankymas.
5. Kontaktų puslapyje pradėti pildyti formą ir patikrinti, kad matomas `form_start`.
6. Patikrinti, kad event parametruose nėra vardo, el. pašto, telefono ar žinutės teksto.

## 4. Search Console

Rekomenduojamas variantas: `Domain property`, nes jis apima `agnezukiene.lt`, `www.agnezukiene.lt`, HTTP ir HTTPS variantus.

Search Console prašys DNS TXT įrašo, panašaus į:

```text
google-site-verification=...
```

Jį reikia pridėti Cloudflare:

```text
Cloudflare -> agnezukiene.lt -> DNS -> Records -> Add record
Type: TXT
Name: @
Content: google-site-verification=...
Proxy status: DNS only
TTL: Auto
```

Po patvirtinimo Search Console reikia pateikti sitemap:

```text
https://agnezukiene.lt/sitemap.xml
```

## 5. DNS pastaba

Nekeisti root ir `www` svetainės įrašų rankiniu būdu. Jie aptarnaujami per Cloudflare Worker custom domains.

Search Console TXT įrašas gali būti pridėtas kartu su esamais TXT įrašais. Jis neturi pakeisti SPF ar DMARC įrašų.

## 6. Dabartinis statusas

| Darbas | Statusas |
| --- | --- |
| GA4 consent-mode frontend paruoštas | padaryta |
| GA4 Measurement ID `G-3N3MGJHS0V` | padaryta |
| GA4 Realtime / DebugView patikra | padaryta |
| Search Console domain property | padaryta |
| Search Console DNS TXT | padaryta, viešai patikrinta 2026-07-13 |
| Sitemap pateikimas | padaryta; viešas sitemap grąžina HTTP 200 |

## 7. Pirmoji būklės peržiūra

2026-07-21 ankstyva „Search Console“ peržiūra užfiksuota faile `docs/search-console-review-2026-07-21.md`.

Kadangi svetainė dar nauja ir duomenų nedaug, išvadų apie temas ar naujų straipsnių kryptis kol kas nedarome. Pirmą pilną paieškos ir lankomumo augimo peržiūrą numatyta atlikti 2026-08-10.
