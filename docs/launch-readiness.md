# Launch readiness

Atnaujinta: 2026-07-11

Šis failas yra automatiškai sugeneruota MVP paleidimo santrauka. Ji nepakeičia `docs/roadmap.md`, bet parodo, kas jau techniškai padengta ir kas dar blokuoja pilną paleidimą.

## Techniniai vartai

- `[x]` Site integrity check yra pre-go-live dalis
- `[x]` GA4 privatumo patikra yra pre-go-live dalis
- `[x]` Kontaktų API patikra yra pre-go-live dalis
- `[x]` Production live check tikrina www nukreipimą
- `[x]` Production live check tikrina HTTP į HTTPS
- `[x]` Production live check tikrina 404
- `[x]` Turnstile site key yra frontend konfigūracijoje
- `[x]` ALLOWED_ORIGIN nustatytas production domenui
- `[x]` CONTACT_TO_EMAIL nustatytas

## Blokatoriai

| Statusas | Darbas | Pastaba |
| --- | --- | --- |
| laukia | Resend domenas / siuntėjas | reikia Resend DNS įrašų, RESEND_API_KEY ir CONTACT_FROM_EMAIL |
| laukia | Gyvas kontaktų formos siuntimas | galima tik po Resend secret ir siuntėjo įjungimo |
| laukia | GA4 Measurement ID | reikia G-... reikšmės į public/assets/js/config.js |
| laukia | GA4 Realtime / DebugView | galima tik po GA4 Measurement ID |
| laukia | Search Console domain property | reikia Google TXT įrašo Cloudflare DNS |
| laukia | Search Console sitemap pateikimas | galima tik po Search Console patvirtinimo |
| laukia | Agnės turinio patvirtinimai | trukmė, kaina, formatas, adresas / miestas, darbo laikas, kvalifikacijos formuluotė |

## Kiti veiksmai

1. Resend domenas / siuntėjas: reikia Resend DNS įrašų, RESEND_API_KEY ir CONTACT_FROM_EMAIL
2. Gyvas kontaktų formos siuntimas: galima tik po Resend secret ir siuntėjo įjungimo
3. GA4 Measurement ID: reikia G-... reikšmės į public/assets/js/config.js
4. GA4 Realtime / DebugView: galima tik po GA4 Measurement ID
5. Search Console domain property: reikia Google TXT įrašo Cloudflare DNS

## Patikros komanda

```bash
node scripts/pre-go-live.js https://agnezukiene.lt
```
