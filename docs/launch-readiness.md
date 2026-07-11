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
- `[x]` Production live check tikrina kontaktų API klaidų kelius
- `[x]` Public HTML patikra saugo nuo vidinių paleidimo frazių
- `[x]` Turnstile site key yra frontend konfigūracijoje
- `[x]` Worker nepaleidžia formos sėkmės be Resend ir siuntėjo konfigūracijos
- `[x]` Worker turi Resend laiško siuntimo implementaciją
- `[x]` Kontaktų API mock testas padengia Resend sėkmės kelią
- `[x]` ALLOWED_ORIGIN nustatytas production domenui
- `[x]` CONTACT_TO_EMAIL nustatytas

## Blokatoriai

| Statusas | Darbas | Pastaba |
| --- | --- | --- |
| laukia | Resend domenas / siuntėjas | reikia Resend sugeneruotų DNS įrašų ir patvirtinto siuntėjo |
| laukia | CONTACT_FROM_EMAIL | reikia Cloudflare Worker variable, pvz. Agnė Žukienė <noreply@agnezukiene.lt> |
| laukia | RESEND_API_KEY secret | reikia Cloudflare Worker secret iš Resend API Keys |
| laukia | Gyvas kontaktų formos siuntimas | galima tik po Resend secret ir siuntėjo įjungimo |
| laukia | GA4 Measurement ID | reikia G-... reikšmės į public/assets/js/config.js |
| laukia | GA4 Realtime / DebugView | galima tik po GA4 Measurement ID |
| laukia | Search Console domain property | reikia Google TXT įrašo Cloudflare DNS |
| laukia | Search Console sitemap pateikimas | galima tik po Search Console patvirtinimo |
| laukia | Agnės turinio patvirtinimai | laukia 9 sprendimų: Konsultacijos trukmė, Kaina, Konsultacijų formatas, Miestas / adresas, Atsakymo į užklausas terminas, Ar minėti darbovietes pavadinimais, Galutinė kvalifikacijos formuluotė, Privatumo politikos tekstas, Slapukų politikos tekstas |
| laukia | Kitas Agnės turinio klausimas | [ ] tik gyvai [ ] tik nuotoliu [ ] gyvai ir nuotoliu [ ] dar nenoriu to viešinti |

## Kiti veiksmai

1. Resend domenas / siuntėjas: reikia Resend sugeneruotų DNS įrašų ir patvirtinto siuntėjo
2. CONTACT_FROM_EMAIL: reikia Cloudflare Worker variable, pvz. Agnė Žukienė <noreply@agnezukiene.lt>
3. RESEND_API_KEY secret: reikia Cloudflare Worker secret iš Resend API Keys
4. Gyvas kontaktų formos siuntimas: galima tik po Resend secret ir siuntėjo įjungimo
5. GA4 Measurement ID: reikia G-... reikšmės į public/assets/js/config.js

## Patikros komanda

```bash
node scripts/pre-go-live.js https://agnezukiene.lt
```
