# Launch readiness

Atnaujinta: 2026-07-19

Šis failas yra automatiškai sugeneruota MVP paleidimo santrauka. Ji nepakeičia `docs/roadmap.md`, bet parodo, kas jau techniškai padengta ir kas dar blokuoja pilną paleidimą.

## Techniniai vartai

- `[x]` Site integrity check yra pre-go-live dalis
- `[x]` WCAG spalvų kontrasto patikra yra pre-go-live dalis
- `[x]` GA4 privatumo patikra yra pre-go-live dalis
- `[x]` Kontaktų API patikra yra pre-go-live dalis
- `[x]` Leidžiamų svetainės šaltinių apsauga yra pre-go-live dalis
- `[x]` Rankinių setup veiksmų eilė yra privalomas repo failas
- `[x]` Production live check tikrina www nukreipimą
- `[x]` Production live check tikrina HTTP į HTTPS
- `[x]` Production live check tikrina 404
- `[x]` Production live check tikrina kontaktų API klaidų kelius
- `[x]` Public HTML patikra saugo nuo vidinių paleidimo frazių
- `[x]` Public HTML patikra tikrina bazinį prieinamumą
- `[x]` Live ir lokali patikra tikrina saugumo antraščių reikšmes
- `[x]` Naršyklė įpareigojama vienerius metus naudoti tik saugų svetainės ryšį
- `[x]` Gyva svetainė atmeta neleistiną svetimą kodą
- `[x]` Naršyklės kortelės ženkliukas tikrinamas lokaliai ir gyvoje svetainėje
- `[x]` Pagrindinė nuotrauka pritaikyta skirtingiems ekranams ir failų dydžiai saugomi automatiškai
- `[x]` Kontaktų forma sutikrina pasirinktą atsakymo būdą
- `[x]` Formos klaidos susietos su konkrečiais laukais
- `[x]` Svetainė gerbia lankytojo mažesnio judesio pasirinkimą
- `[x]` Turnstile site key yra frontend konfigūracijoje
- `[x]` Worker nepaleidžia formos sėkmės be Resend ir siuntėjo konfigūracijos
- `[x]` Worker turi Resend laiško siuntimo implementaciją
- `[x]` Kontaktų API mock testas padengia Resend sėkmės kelią
- `[x]` ALLOWED_ORIGIN nustatytas production domenui
- `[x]` CONTACT_TO_EMAIL nustatytas

## Blokatoriai

| Statusas | Darbas | Pastaba |
| --- | --- | --- |
| padaryta | Resend domenas / siuntėjas | domenas patvirtintas ir paruoštas laiškams siųsti |
| padaryta | CONTACT_FROM_EMAIL | siuntėjo adresas nustatytas Cloudflare Worker konfigūracijoje |
| padaryta | RESEND_API_KEY secret | tik siuntimui skirtas raktas saugiai laikomas Cloudflare |
| padaryta | Gyvas kontaktų formos siuntimas | Resend istorijoje patvirtinti pristatyti laiškai |
| padaryta | GA4 Measurement ID | G-3N3MGJHS0V įrašytas į public/assets/js/config.js |
| padaryta | GA4 Realtime / DebugView | patikrinta ir pažymėta roadmap |
| padaryta | Search Console domain property | patvirtinta per Cloudflare DNS TXT |
| padaryta | Search Console sitemap pateikimas | sitemap pateiktas ir pažymėtas roadmap |
| laukia | Agnės turinio patvirtinimai | laukia 7 sprendimų: Konsultacijos trukmė, Kaina, Konsultacijų formatas, Miestas / adresas, Atsakymo į užklausas terminas, Ar minėti darbovietes pavadinimais, Galutinė kvalifikacijos formuluotė |
| laukia | Kitas Agnės turinio klausimas | [ ] tik gyvai [ ] tik nuotoliu [ ] gyvai ir nuotoliu [ ] dar nenoriu to viešinti |

## Kiti veiksmai

1. Agnės turinio patvirtinimai: laukia 7 sprendimų: Konsultacijos trukmė, Kaina, Konsultacijų formatas, Miestas / adresas, Atsakymo į užklausas terminas, Ar minėti darbovietes pavadinimais, Galutinė kvalifikacijos formuluotė
2. Kitas Agnės turinio klausimas: [ ] tik gyvai [ ] tik nuotoliu [ ] gyvai ir nuotoliu [ ] dar nenoriu to viešinti

## Patikros komanda

```bash
node scripts/pre-go-live.js https://agnezukiene.lt
```
