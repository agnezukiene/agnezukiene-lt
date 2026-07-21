# Agnės Žukienės svetainės go-live checklist

Atnaujinta: 2026-07-21

## Prieš pirmą commit

- `[x]` Sukurtas lokalus Git projektas.
- `[x]` Prijungtas GitHub remote: `https://github.com/agnezukiene/agnezukiene-lt.git`.
- `[x]` Sukurti MVP puslapiai.
- `[x]` Sukurtas `assets/css/styles.css`.
- `[x]` Sukurtas `assets/js/site.js`.
- `[x]` Sukurti `public/sitemap.xml` ir `public/robots.txt`.
- `[x]` Sukurtas `scripts/check-site-integrity.js`.
- `[x]` Sukurtas ir į pre-go-live įtrauktas `scripts/check-color-contrast.js`; 9 paletės poros patikrintos production 2026-07-13.
- `[x]` Sukurtas `scripts/check-analytics-privacy.js`.
- `[x]` Sukurtas `scripts/check-contact-api.js`.
- `[x]` Sukurtas `scripts/check-static-asset-cache.js`: failų turinio versijos, ilgalaikė nekintančių failų talpykla ir formos atsakymų nesaugojimas tikrinami automatiškai.
- `[x]` 2026-07-20 gyvoje telefono naršyklės patikroje pereinant tarp puslapių bendri stiliai ir abu programos failai panaudoti iš atminties, jų pakartotinai neatsisiunčiant.
- `[x]` 2026-07-21 gyvai patikrinta ir automatizuota, kad puslapių bei privatumo tekstai persitikrina naršyklėje, todėl paskelbti pakeitimai neužstringa senoje versijoje.
- `[x]` Sukurtas `scripts/check-live-site.js`.
- `[x]` Sukurtas `scripts/pre-go-live.js`.
- `[x]` Sukurtas `docs/content-approval.md`.
- `[x]` Sukurtas `docs/launch-readiness.md`.
- `[x]` Techninė patikra praėjo 9 HTML failams.
- `[x]` Analitikos privatumo patikra įtraukta į pre-go-live.
- `[x]` Kontaktų API patikra įtraukta į pre-go-live.
- `[x]` Leidžiamų svetainės šaltinių apsaugos patikra įtraukta į pre-go-live.
- `[x]` Peržiūrėti `git status --short`.
- `[x]` Padaryti pirmą commit.
- `[x]` Push į GitHub `main`.

## Prieš Cloudflare Pages prijungimą

- `[x]` GitHub repo turi matytis visi MVP failai.
- `[x]` Cloudflare rodo domeną `agnezukiene.lt`.
- `[x]` Cloudflare Workers prijungtas prie GitHub repo.
- `[x]` Production branch: `main`.
- `[x]` Deploy command: `npx wrangler deploy`.
- `[x]` 2026-07-21 išjungta vieša `workers.dev` kopija ir automatinės peržiūros nuorodos; gyvai patvirtintas techninio adreso 404 ir pridėta nuolatinė automatinė patikra.
- `[x]` Assets output directory: `./public`.
- `[x]` Jei Cloudflare naudoja `npx wrangler deploy`, assets directory turi būti `./public`, ne repo šaknis.
- `[x]` Pirmas deploy sėkmingas į `https://agnezukienepage.petrauskaiteagne.workers.dev`.
- `[x]` Laikinas Cloudflare URL patikrintas automatiniu smoke testu.
- `[x]` Custom domain: `agnezukiene.lt`.
- `[x]` Viešas DNS rodo Cloudflare, o root domenas grąžina `HTTP/2 200`.
- `[x]` `www.agnezukiene.lt` nukreipimas į pagrindinį domeną paruoštas Worker lygiu ir patikrintas production smoke testu.

## Prieš viešą paleidimą

- `[x]` Patikrinti pradžios puslapį desktop vaizde.
- `[x]` Patikrinti pradžios puslapį mobile vaizde.
- `[x]` Patikrinti atskirą pagrindinio ir vidinių puslapių antraščių mastelį telefone, planšetėje ir kompiuteryje; visi 8 vieši puslapiai telpa 390, 768 ir 1280 pikselių pločiuose vietinėje ir gyvoje svetainėje.
- `[x]` Patikrinti mobile meniu.
- `[x]` Patikrinti, kad telefono navigacijos nuorodos lieka pasiekiamos ir tada, kai papildomas svetainės kodas neįsikrauna; 2026-07-21 patikrintas 390 pikselių telefono vaizdas abiem režimais vietinėje ir gyvoje svetainėje.
- `[x]` Patikrinti visus viešus puslapius automatiniu prieinamumo įrankiu ir klaviatūra; nuoroda „Pereiti prie turinio“ perkelia aktyvią vietą į pagrindinį turinį.
- `[x]` Patikrinti visus vidinius puslapius laikiname Cloudflare URL.
- `[x]` Patikrinti `404.html`.
- `[x]` Lokaliai patikrinti, kad Worker fallback nežinomam URL grąžina lietuvišką `404.html` turinį su 404 statusu.
- `[x]` Production patikrinti, kad nežinomas URL grąžina lietuvišką `404.html` turinį su 404 statusu; extensionless `/404` fallback gyvai patikrintas 2026-07-13.
- `[x]` Patikrinti `sitemap.xml`.
- `[x]` Patikrinti canonical, sitemap ir vidines nuorodas gyvoje svetainėje; 2026-07-21 gyvai patvirtinta, kad senieji `.html` adresai visam laikui nukreipia į dabartinius adresus ir išsaugo papildomus adreso duomenis.
- `[x]` Patikrinti `robots.txt`.
- `[x]` Patikrinti visų puslapių dalijimosi peržiūras: patvirtintas portretas, nuotraukos matmenys ir aprašymas, lietuvių kalba bei svetainės pavadinimas.
- `[x]` Patikrinti saugumo antraštes gyvame puslapyje.
- `[x]` Įjungti naršyklės apsaugą, kuri atmeta neleistiną svetimą kodą, ir patikrinti ją tikroje naršyklėje.
- `[x]` Patikrinti mažesnio judesio pasirinkimą ir slapukų pranešimo prieinamą pavadinimą.
- `[x]` Įjungti ir automatiškai tikrinti vienerių metų saugaus ryšio reikalavimą po stabilaus HTTPS veikimo laikotarpio.
- `[x]` Pridėti ir patikrinti naršyklės kortelės ženkliuką.
- `[x]` Pridėti pagrindinės nuotraukos variantus skirtingiems ekranams ir tikroje naršyklėje patikrinti, kad siunčiamas mažesnis failas be vaizdo ar išdėstymo pokyčių.
- `[x]` Production smoke testas patikrina HTTP į HTTPS, `www` į root ir nežinomo puslapio 404.
- `[ ]` Patvirtinti konsultacijos formatą.
- `[~]` Kol konsultacijų formatas nepatvirtintas, pagrindinis puslapis ir paieškos sistemoms skirta informacija nežada nuotolinių ar visoje Lietuvoje teikiamų konsultacijų; vietinė patikra sėkminga, laukia gyvos svetainės patikra.
- `[ ]` Patvirtinti kainą, jei ji bus rodoma.
- `[ ]` Patvirtinti konsultacijos trukmę, jei ji bus rodoma.
- `[x]` Privatumo politika išsamiai atnaujinta 2026-07-19 pagal veikiančias paslaugas ir lankytojo teises.
- `[x]` Slapukų politika ir pasirinkimo mygtukai patikrinti tikroje naršyklėje.
- `[x]` Aiškūs mygtukai „Neleisti matavimo“ ir „Leisti matavimą“ bei nuoroda į slapukų paaiškinimą patikrinti vietinėje ir gyvoje telefono bei kompiuterio naršyklėje 2026-07-21.
- `[x]` Patikrinti sutikimo atšaukimą: pasirinkimo keitimas sustabdo lankomumo matavimą, pašalina jo slapukus ir leidžia vėliau pasirinkti iš naujo.

## Kontaktų forma

- `[x]` Sukurti Cloudflare Worker endpointą `/api/contact`.
- `[x]` Prijungti Turnstile: widget sukurtas, site key kode, secret Cloudflare Worker nustatymuose.
- `[x]` Prijungtas Resend laiškų siuntimas iš patvirtinto `agnezukiene.lt` domeno.
- `[x]` `/api/contact` laikiname Cloudflare URL pasiekia Worker backendą.
- `[x]` Kontaktų forma turi honeypot lauką paprastų botų filtravimui.
- `[x]` Kontaktų API validacija ir mock Resend sėkmės kelias patikrinti automatiškai.
- `[x]` Kontaktų forma rodo backend klaidas ir atnaujina Turnstile po siuntimo bandymo.
- `[x]` Jei naršyklėje forma negali veikti, jos laukai ir neveikiantis siuntimo mygtukas pakeičiami aiškiu tiesioginiu el. pašto adresu; vietinė ir gyva telefono bei kompiuterio patikra praėjo 2026-07-21.
- `[x]` Kontaktų forma sutikrina pasirinktą atsakymo būdą su įrašytu el. paštu arba telefono numeriu.
- `[x]` Iš anksto paaiškinta, kad būtinas bent vienas kontaktas, pasirinktas atsakymo laukas tampa privalomas, o telefono numerio forma tikrinama naršyklėje ir serveryje; vietinė ir gyva telefono bei kompiuterio patikra praėjo 2026-07-21.
- `[x]` Production smoke testas tikrina kontaktų API GET, origin, content-type, request size, JSON ir validacijos klaidas.
- `[x]` Kontaktų API atmeta ne JSON ir per dideles užklausas.
- `[x]` Sukurtas Cloudflare variables/secrets runbook `docs/cloudflare-variables-runbook.md`.
- `[x]` Cloudflare/Worker nustatyti `CONTACT_TO_EMAIL=zukiene.agne@gmail.com` per `wrangler.jsonc`.
- `[x]` Cloudflare/Worker nustatyti `ALLOWED_ORIGIN=https://agnezukiene.lt` per `wrangler.jsonc`.
- `[x]` Kontaktų formos apsauga tikrina `agnezukiene.lt` adresą, kontaktų formos paskirtį ir saugiai sustoja, jei trūksta apsaugos nustatymų.
- `[x]` Kontaktų forma riboja per dažną patvirtintų laiškų siuntimą iki 5 bandymų per minutę iš tos pačios interneto jungties; viršijus ribą „Resend“ nekviečiamas, o lankytojas gauna aiškų paaiškinimą. Nustatymas paskelbtas ir gyva svetainė patikrinta 2026-07-21.
- `[x]` Cloudflare/Worker nustatyti `CONTACT_FROM_EMAIL=Agnė Žukienė <noreply@agnezukiene.lt>` per `wrangler.jsonc`.
- `[x]` Cloudflare saugiai pridėti abu slapti raktai: formos apsaugos ir laiškų siuntimo.
- `[x]` Patikrinti sėkmingą formos siuntimą gyvai: 2026-07-20 po apsaugos sustiprinimo išsiųstas techninis bandymas, o „Resend“ jį pažymėjo kaip pristatytą.
- `[x]` Patikrinti formos klaidas gyvai ir naršyklėje: tuščia forma pateikia aiškų paaiškinimą.
- `[x]` Formos klaidos susietos su konkrečiais laukais, klaidingi laukai aiškiai pažymimi ir pataisius žymėjimas pašalinamas.
- `[x]` Privatumo politika apima duomenų šaltinį, tikslius teisinius pagrindus, pateikimo neprivalomumą ir pasekmes, perkeliamumo teisę, tarptautinio perdavimo apsaugas bei automatinių sprendimų netaikymą; 2026-07-21 patikrinta gyvoje svetainėje.
- `[x]` Kontaktų forma pateikia aiškų privatumo paaiškinimą ir nuorodą, bet nereikalauja atskiro sutikimo duomenims, kurie būtini atsakyti į paties lankytojo užklausą; serverio patikra saugo šį reikalavimą.
- `[x]` Komentaro lauko 1200 ženklų riba, matomas skaitiklis ir pagalbinis pranešimas patikrinti vietinėje bei gyvoje telefono ir kompiuterio naršyklėje, taip pat be papildomo svetainės kodo 2026-07-21.
- `[x]` Nepriklausoma „Lighthouse 13.4.0“ patikra pagrindiniame ir kontaktų puslapiuose: rastas logotipo pavadinimo neatitikimas pataisytas; po paskelbimo gyvas pagrindinis puslapis visose penkiose vertintose srityse gavo po 100 balų.
- `[x]` Skubios pagalbos veiksmai praktiškai naudojami telefone: 112 yra tiesioginė skambinimo nuoroda, pateiktas oficialus emocinės paramos pasirinkimų puslapis, o šie jautrūs paspaudimai nėra matuojami. Vaizdas, klaviatūros naudojimas ir gyva svetainė patikrinti telefone bei kompiuteryje 2026-07-21.

## Analitika ir paieška

- `[x]` Sukurtas GA4 ir Search Console runbook `docs/analytics-search-console-runbook.md`.
- `[x]` GA4 eventų allowlist ir jautrių parametrų patikra automatizuota.
- `[x]` Sukurti GA4 property ir Web stream svetainei `agnezukiene.lt`.
- `[x]` Įdiegti GA4 su sutikimo režimu ir Measurement ID `G-3N3MGJHS0V`.
- `[x]` Patikrinti GA4 Realtime / DebugView.
- `[x]` Search Console patvirtinti per Cloudflare DNS TXT; viešas verification įrašas patikrintas 2026-07-13.
- `[x]` Pateikti `https://agnezukiene.lt/sitemap.xml` ir patikrinti viešą HTTP 200 atsakymą.
- `[x]` 2026-07-21 atlikti pirmą „Search Console“ būklės patikrinimą: svetainės žemėlapio būsena sėkminga, aptikti 8 puslapiai, nėra saugumo ar rankinių nuobaudų įspėjimų; senas `/apie.html` adresas rastas ir jo nukreipimas sustiprintas.
