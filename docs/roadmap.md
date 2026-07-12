# Agnės Žukienės svetainės roadmap

Atnaujinta: 2026-07-12

Šis failas yra pagrindinis darbo planas. Nuo šiol pakeitimus darome pagal šį roadmap: po kiekvieno reikšmingo darbo atnaujiname statusus, įrašome, kas patikrinta, ir pažymime, kas dar blokuoja paleidimą.

Statusai:

- `[ ]` laukia
- `[~]` pradėta / reikia pabaigti arba patikrinti
- `[x]` padaryta ir patikrinta
- `[!]` blokuoja išorinis sprendimas arba paskyros veiksmas
- `[-]` nedarysime MVP etape

## 1. Dabartinė projekto būsena

Techniniai sprendimai, kuriuos jau patvirtinome:

- Domenas: `agnezukiene.lt`
- Domeno registratorius: Interneto vizija
- Cloudflare vardų serveriai:
  - `felicity.ns.cloudflare.com`
  - `liberty.ns.cloudflare.com`
- Vardų serveriai Interneto vizijoje: 2026-07-10 viešas `.lt` registras ir `whois` rodo `felicity.ns.cloudflare.com` ir `liberty.ns.cloudflare.com`.
- GitHub repo kryptis: naujas repo `agnezukiene-lt`
- MVP technologija: statinis HTML/CSS/JS
- MVP kontaktinis el. paštas: `zukiene.agne@gmail.com`
- Vėlesnis galimas domeno el. paštas: pvz. `labas@agnezukiene.lt`

Failai, kurie šiuo metu yra projekte:

| Failas | Paskirtis | Statusas |
| --- | --- | --- |
| `agne_zukiene_psichologes_svetaine_brief.md` | Turinio, tono, paslaugų ir etikos briefas | `[x]` naudojamas kaip turinio šaltinis |
| `agne-zukiene-psichologe-codex-handoff.md` | Techninis, Cloudflare, GA4, SEO ir darbo eigos handoff | `[x]` naudojamas kaip techninis šaltinis |
| `package.json` | Lokalių komandų ir projekto metaduomenų pradžia | `[x]` sukurtas; lokaliai `npm` nėra, patikra paleidžiama per Codex Node runtime |
| `.gitignore` | Failai, kurių necommitiname | `[~]` pradinis variantas sukurtas |
| `index.html` | Pradinis puslapis | `[~]` turinys sukurtas, bazinė techninė patikra praėjo |
| `apie.html` | Apie Agnę puslapis | `[~]` turinys sukurtas, bazinė techninė patikra praėjo |
| `paslaugos.html` | Paslaugų puslapis | `[~]` turinys sukurtas, bazinė techninė patikra praėjo |
| `konsultacijos.html` | Konsultacijų eiga, konfidencialumas, ribos | `[~]` trūksta kainos, trukmės, formato patvirtinimo |
| `duk.html` | Dažni klausimai | `[~]` sukurtas pradinis DUK |
| `kontaktai.html` | Kontaktai ir forma | `[~]` frontend forma, Turnstile ir backend sukurti; Resend siuntimas dar laukia |
| `privatumo-politika.html` | Privatumo politika | `[~]` techninis tekstas atnaujintas pagal Turnstile ir analitiką; reikia Agnės galutinio patvirtinimo |
| `slapuku-politika.html` | Slapukų politika | `[~]` techninis tekstas atnaujintas pagal Turnstile ir GA4 sutikimo logiką; reikia Agnės galutinio patvirtinimo |
| `404.html` | Klaidos puslapis | `[x]` sukurtas ir patikrintas gyvai |
| `assets/images/rami-psichologes-svetaines-tekstura.png` | Neutralus hero vizualas be žmonių | `[x]` naudojamas laikinai iki Agnės portreto |
| `public/` | Viešai deployinami svetainės failai Cloudflare Workers/Pages aplinkai | `[x]` sukurta po Cloudflare build klaidos |
| `wrangler.jsonc` | Cloudflare deploy konfigūracija, kad būtų keliami tik `public/` failai | `[x]` sukurta |
| `README.md` | Repo įėjimo taškas su lokaliomis, patikros, deploy ir blokatorių komandomis | `[x]` sukurta |

Failai / katalogai, kuriuos dar reikia sukurti:

| Failas arba katalogas | Paskirtis | Statusas |
| --- | --- | --- |
| `assets/css/styles.css` | Visa svetainės vizualinė sistema | `[x]` sukurta MVP versija |
| `assets/js/site.js` | Mobile meniu, slapukų pasirinkimas, forma, eventai | `[x]` sukurta MVP versija |
| `public/assets/js/config.js` | Vieši GA4 Measurement ID ir Turnstile site key nustatymai | `[~]` Turnstile site key įrašytas, GA4 dar tuščias |
| `src/index.js` | Cloudflare Worker entrypoint: statiniai failai ir `/api/contact` endpointas | `[x]` sukurta backend formai |
| `sitemap.xml` | Search Console ir SEO | `[x]` sukurta |
| `robots.txt` | Paieškos robotų instrukcijos | `[x]` sukurta |
| `docs/go-live-checklist.md` | Paleidimo kontrolinis sąrašas | `[x]` sukurta |
| `docs/content-approval.md` | Agnės turinio sprendimų ir viešinimo patvirtinimų sąrašas | `[x]` sukurta |
| `docs/seo-inventory.md` | Puslapių title, description, H1 ir canonical inventorius | `[x]` sugeneruota 2026-07-10 |
| `docs/launch-readiness.md` | Automatinė MVP paleidimo vartų ir blokatorių santrauka | `[x]` generuojama skriptu |
| `docs/manual-setup-queue.md` | Viena eilė rankiniams Resend, Cloudflare, GA4, Search Console ir turinio veiksmams | `[x]` sukurta |
| `data/analytics-events.json` | Leidžiamų GA4 eventų katalogas | `[x]` sukurta |
| `data/site-content-registry.json` | Puslapių ir turinio registras | `[x]` sugeneruota 2026-07-10 |
| `scripts/check-site-integrity.js` | Techninė lokali patikra | `[x]` sukurta ir paleista |
| `scripts/check-analytics-privacy.js` | GA4 eventų allowlist ir jautrių parametrų patikra | `[x]` sukurta |
| `scripts/check-contact-api.js` | Kontaktų API validacijos, Turnstile ir Resend mock patikra | `[x]` sukurta |
| `scripts/check-live-site.js` | Gyvos Cloudflare svetainės smoke testas: puslapiai, antraštės, 404, kontaktų API klaidos, production redirectai | `[x]` sukurta ir išplėsta 2026-07-11 |
| `scripts/generate-launch-readiness.js` | Paleidimo readiness santraukos generatorius | `[x]` sukurta; 2026-07-11 sustiprinta pagal realią Worker, Resend ir live check konfigūraciją |
| `scripts/pre-go-live.js` | Viena prieš paleidimą skirta patikra: registrai, integrity, whitespace, optional live URL | `[x]` sukurta |
| `docs/cloudflare-variables-runbook.md` | Cloudflare variables/secrets nustatymų runbook formai, Turnstile, Resend ir GA4 | `[x]` sukurta |
| `docs/analytics-search-console-runbook.md` | GA4 ir Search Console nustatymo bei patikros eiga | `[x]` sukurta |
| `wrangler.jsonc` | Cloudflare Worker static assets ir API konfigūracija | `[x]` sukurta |
| `public/_headers` | Bazinės saugumo antraštės statiniams puslapiams | `[x]` sukurta |

## 2. Techninė bazė

- `[x]` Lokaliai inicijuoti Git projektą.
- `[~]` Sukurti pradinę failų struktūrą.
- `[x]` Pabaigti `assets/css/styles.css`.
- `[x]` Pabaigti `assets/js/site.js`.
- `[x]` Sukurti `public/sitemap.xml`.
- `[x]` Sukurti `public/robots.txt`.
- `[x]` Sukurti `docs/go-live-checklist.md`.
- `[x]` Sukurti `README.md` su pagrindinėmis lokaliomis, pre-go-live, deploy ir likusių blokatorių nuorodomis.
- `[x]` Sukurti `docs/content-approval.md`.
- `[x]` Sukurti `docs/launch-readiness.md`.
- `[x]` Sukurti `docs/manual-setup-queue.md`, kad likę paskyrų veiksmai būtų vienoje eilėje.
- `[x]` Sukurti `scripts/check-site-integrity.js`.
- `[x]` Sukurti `scripts/check-analytics-privacy.js`.
- `[x]` Sukurti `scripts/check-contact-api.js`.
- `[x]` Sukurti `scripts/generate-launch-readiness.js`.
- `[x]` Sustiprinti `scripts/generate-launch-readiness.js`, kad paleidimo santrauka atskirtų Resend domeną, `CONTACT_FROM_EMAIL`, `RESEND_API_KEY` ir kontaktų API techninius vartus.
- `[x]` Sustiprinti `scripts/generate-launch-readiness.js`, kad Agnės turinio blokatorius skaičiuotų iš `docs/content-approval.md` ir rodytų kitą turinio klausimą.
- `[x]` 2026-07-12 papildyti `scripts/generate-launch-readiness.js`, kad santrauka rodytų manual setup queue, bazinio prieinamumo ir saugumo headerių reikšmių vartus.
- `[x]` Sukurti `scripts/check-live-site.js`.
- `[x]` Sukurti `scripts/pre-go-live.js`.
- `[x]` Paleisti lokalią patikrą ir pataisyti klaidas.
- `[x]` Sukurti GitHub repo `agnezukiene-lt`.
- `[x]` Prijungti lokalų repo prie GitHub remote.
- `[x]` Padaryti pirmą commit tik po lokalių patikrų.
- `[x]` Push į GitHub `main`.

Sprendimas: MVP lieka statinis HTML/CSS/JS, be React, Next.js, Astro ar WordPress. Tai sumažina riziką ir pagreitina pirmą paleidimą.

## 3. Cloudflare ir domenas

- `[x]` Domenas nupirktas: `agnezukiene.lt`.
- `[x]` Domeno registratorius patvirtintas: Interneto vizija.
- `[x]` Cloudflare vardų serveriai gauti.
- `[x]` Vardų serveriai pakeisti Interneto vizijoje ir viešas `.lt` registras rodo Cloudflare.
- `[x]` 2026-07-10 `whois agnezukiene.lt` būsena: `registered`.
- `[x]` Pakartotinai patikrinta, kad `.lt` registre domenas aktyvus.
- `[x]` Pakartotinai patikrinta, kad vieši NS yra `felicity.ns.cloudflare.com` ir `liberty.ns.cloudflare.com`.
- `[x]` Cloudflare Pages/Workers projektas prijungtas prie GitHub repo.
- `[x]` Pataisyti Cloudflare deploy struktūrą: vieši failai perkelti į `public/`, `wrangler.jsonc` assets directory nustatytas į `./public`.
- `[x]` Pirmas Cloudflare deploy sėkmingas: `https://agnezukienepage.petrauskaiteagne.workers.dev`.
- `[x]` `wrangler.jsonc` projekto vardas suderintas su Cloudflare vardu `agnezukienepage`.
- `[x]` `run_worker_first` įjungtas, kad Worker aptarnautų API, pridėtų saugumo antraštes ir galėtų atlikti `www` nukreipimą.
- `[x]` `https://agnezukienepage.petrauskaiteagne.workers.dev/api/contact` patikrintas: endpointas veikia ir grąžina laukiamą 503, kol nesudėti el. pašto kintamieji.
- `[x]` Worker prideda bazines saugumo antraštes ir nukreipia `www.agnezukiene.lt` į `agnezukiene.lt`.
- `[x]` Statinio puslapio saugumo antraštės patikrintos gyvai laikiname Cloudflare URL.
- `[x]` 2026-07-12 automatinės patikros tikrina konkrečias saugumo antraščių reikšmes statiniams puslapiams ir `/api/contact`.
- `[x]` Desktop 1440px ir mobile 390px vizualinė patikra atlikta per Chrome: horizontalios slinkties nėra, pagrindiniai mygtukai telpa, mobile meniu persijungia.
- `[x]` Production branch ir deploy eiga patikrinta per veikiančius deploy'us iš `main`.
- `[x]` Pridėti custom domain `agnezukiene.lt`.
- `[x]` Pridėti Worker custom domain `www.agnezukiene.lt`.
- `[x]` 2026-07-10 `agnezukiene.lt` viešai rodo Cloudflare IP ir grąžina `HTTP/2 200`.
- `[x]` Sutvarkyti `www.agnezukiene.lt` nukreipimą į `agnezukiene.lt` Worker lygiu; `https://www.agnezukiene.lt` grąžina `301` į `https://agnezukiene.lt/`.
- `[x]` Patikrinti HTTPS.
- `[x]` Cloudflare DNS sutvarkyta: root ir `www` aptarnaujami per Worker custom domains; rankinis `www AAAA 100::` įrašas pašalintas, kad nekonfliktuotų su Worker domain.
- `[x]` Cloudflare Edge Certificates: `Always Use HTTPS` įjungtas, `Minimum TLS Version` pakeistas į `TLS 1.2`, `TLS 1.3` ir `Automatic HTTPS Rewrites` patikrinti kaip įjungti.
- `[~]` HSTS kol kas nejungtas; HTTPS stabilumas patikrintas 2026-07-10 ir 2026-07-11, HSTS svarstyti tik po kelių dienų stabilaus veikimo.
- `[x]` Po deploy patikrinti gyvą svetainę, ne tik lokalią versiją.
- `[x]` Sukurti live smoke testą laikinam Cloudflare URL ir production domenui.

## 4. Puslapiai ir turinys

Turinio taisyklės:

- Rašome lietuviškai.
- Tonas: šiltas, aiškus, profesionalus, be spaudimo.
- Nevartojame „psichoterapeutė“, jei nėra oficialios psichoterapijos kvalifikacijos.
- Nevartojame pažadų „išgydysiu“, „garantuotas rezultatas“, „greitas sprendimas“.
- Nenaudojame klientų istorijų, diagnozių ar identifikuojamų atvejų.

Darbai:

- `[~]` `index.html`: patikrinti hero tekstą, CTA, paslaugų kryptis, krizės pranešimą.
- `[~]` `apie.html`: patikrinti kvalifikacijos formuluotes ir ar tinka viešinti profesinį kelią.
- `[~]` `paslaugos.html`: patvirtinti, kurios paslaugos tikrai bus rodomos MVP.
- `[~]` `konsultacijos.html`: papildyti tik tada, kai Agnė patvirtins trukmę, kainą, formatą ir atsakymo laiką.
- `[~]` `duk.html`: peržiūrėti DUK dėl tono ir tikslumo.
- `[~]` `kontaktai.html`: forma turi būti trumpa, duomenų minimizavimo principu.
- `[x]` Viešuose tekstuose pakeistos vidinės „dar reikia patvirtinti / prieš paleidimą“ frazės į lankytojui tinkamas atsargias MVP formuluotes.
- `[~]` `privatumo-politika.html`: techninis tekstas atnaujintas, reikia Agnės galutinio patvirtinimo.
- `[~]` `slapuku-politika.html`: techninis tekstas atnaujintas, reikia Agnės galutinio patvirtinimo ir GA4 Measurement ID.
- `[x]` `404.html`: patikrintas po deploy.
- `[-]` Tinklaraščio aktyviai nepaleidžiame MVP, kol nėra bent 3-5 patvirtintų tekstų.

Reikia Agnės patvirtinimo prieš viešą paleidimą. Sprendimų lentelė pildoma `docs/content-approval.md`:

- `[!]` Konsultacijos trukmė.
- `[!]` Kaina.
- `[!]` Ar konsultacijos vyks gyvai, nuotoliu, ar mišriai.
- `[!]` Tikslus miestas / adresas, jei viešinamas.
- `[!]` Darbo laikas arba atsakymo į užklausas terminas.
- `[!]` Ar minėti darbovietes pavadinimais.
- `[!]` Galutinė kvalifikacijos formuluotė.

## 5. Dizainas ir vizualai

- `[~]` Laikinas hero vizualas sukurtas: `assets/images/rami-psichologes-svetaines-tekstura.png`.
- `[x]` Sukurti MVP CSS sistemą: spalvos, tipografija, layout, kortelės, formos, mobile meniu.
- `[x]` Patikrinti, kad tekstas netelpa už mygtukų, kortelių ar formos ribų.
- `[x]` Patikrinti mobile vaizdą.
- `[x]` Patikrinti desktop vaizdą.
- `[x]` Automatizuoti bazinę public HTML prieinamumo patikrą: `main`, skip link, nav ARIA, button `type` ir formos label ryšiai.
- `[x]` 2026-07-12 pridėti skip link ir `main id="turinys"` privatumo bei slapukų puslapiams.
- `[ ]` Vėliau įkelti Agnės patvirtintą portretą.
- `[ ]` Portretui paruošti atskirą query / promptą tik po to, kai Agnė pateiks nuotrauką.

Vizualinė kryptis:

- Ramu, švaru, šilta, bet ne saldu.
- Be medicininio šaltumo.
- Be atsitiktinių žmonių nuotraukų.
- Be dramatizuotų psichikos sveikatos vaizdų.
- Neutralūs žemės, pieno baltumo, grafito, alyvuogių ir molio tonai.

## 6. Kontaktų forma ir privatumas

- `[~]` Kontaktų formos frontend sukurta `kontaktai.html`.
- `[x]` Sukurti `assets/js/site.js` formos validacijai ir siuntimui.
- `[x]` Sukurti `src/index.js` Cloudflare Worker `/api/contact` endpointui.
- `[x]` Sukurti kontaktų API automatinę patikrą su validacijos, Turnstile ir Resend mock sėkmės keliais.
- `[x]` Integruoti Cloudflare Turnstile: widget sukurtas, frontend site key įrašytas, backend secret įdėtas į Cloudflare.
- `[~]` Integruoti Resend laiškų siuntimą: backend paruoštas ir patikrintas, reikia API rakto ir siuntėjo adreso.
- `[x]` Cloudflare/Worker nustatyti `CONTACT_TO_EMAIL=zukiene.agne@gmail.com` per `wrangler.jsonc` neslaptą variable.
- `[x]` Cloudflare/Worker nustatyti `ALLOWED_ORIGIN=https://agnezukiene.lt` per `wrangler.jsonc` neslaptą variable.
- `[~]` Cloudflare secrets: `TURNSTILE_SECRET_KEY` padarytas, `RESEND_API_KEY` laukia.
- `[x]` Sukurti Cloudflare variables/secrets runbook: `docs/cloudflare-variables-runbook.md`.
- `[x]` Patikrinti, kad forma nesiunčia jautraus turinio į GA4.
- `[x]` Patikrinti, kad forma turi aiškias klaidas žmogui.
- `[x]` Kontaktų forma rodo backend klaidos žinutę ir po siuntimo bandymo atnaujina Turnstile tokeną.
- `[x]` Production smoke testas tikrina kontaktų API GET, origin, content-type, request size, JSON ir validacijos klaidas.
- `[x]` Kontaktų API atmeta ne JSON ir per dideles užklausas prieš parsindamas formos duomenis.
- `[x]` Pridėti nematomą honeypot lauką paprastų botų filtravimui iki Turnstile.
- `[x]` Patikrinti, kad jei forma neveiktų, lieka alternatyva el. paštu.

Formos duomenų principas: renkame tik tiek, kiek reikia atsakyti į užklausą. Neprašome diagnozės, asmens kodo, adreso, sveikatos dokumentų ar išsamios istorijos.

## 7. SEO, GA4 ir Search Console

- `[~]` Puslapiuose pradėti title, description, canonical ir OG metadata.
- `[x]` Patikrinti visų puslapių H1, title, description, canonical ir OG per `docs/seo-inventory.md`.
- `[x]` Sustiprinti SEO patikrą: exact canonical / OG URL, OG paveikslėlio failas, sitemap dublikatai, robots sitemap ir JSON-LD validumas tikrinami automatiškai.
- `[x]` Sukurti `sitemap.xml`.
- `[x]` Sukurti `robots.txt`.
- `[x]` Sukurti `docs/seo-inventory.md`.
- `[x]` Sukurti `scripts/generate-seo-inventory.js`.
- `[x]` Sukurti `scripts/generate-content-registry.js`.
- `[~]` Įdiegti GA4 tik su sutikimo režimu: frontend paruoštas, reikia GA4 Measurement ID.
- `[x]` Sukurti `data/analytics-events.json`.
- `[x]` Sukurti automatinę GA4 eventų allowlist, viešo config formato, consent įkėlimo ir privatumo patikrą `scripts/check-analytics-privacy.js`.
- `[x]` Sukurti `docs/analytics-search-console-runbook.md`.
- `[ ]` Patikrinti GA4 Realtime / DebugView.
- `[ ]` Search Console patvirtinti kaip domain property per Cloudflare DNS TXT.
- `[ ]` Pateikti `sitemap.xml` į Search Console.

Leidžiami GA4 eventai MVP:

- `contact_intent_click`
- `form_start`
- `form_error`
- `generate_lead`
- `mailto_click`
- `service_interest_select`
- `consultation_format_select`

Draudžiama į GA4 siųsti:

- vardą;
- el. paštą;
- telefono numerį;
- žinutės tekstą;
- konkrečias jautrias detales.

## 8. Patikros prieš pirmą paleidimą

Prieš pirmą commit:

- `[x]` `scripts/check-site-integrity.js` paleistas per Codex Node runtime: patikra praėjo 9 HTML failams.
- `[x]` Patikrinti `git status --short`.
- `[x]` Patikrinti, kad nėra secret failų.
- `[x]` Patikrinti, kad nėra `TODO`, `lorem ipsum`, tuščių nuorodų ar placeholder tekstų.
- `[x]` Patikrinti, kad public HTML neturi vidinių „dar reikia patvirtinti“, „prieš viešą paleidimą“ ar „prieš publikavimą“ frazių.
- `[x]` Patikrinti, kad public HTML turi bazinius prieinamumo landmark, nav ir formų label ryšius.
- `[x]` Patikrinti, kad statinių puslapių ir Worker saugumo antraštės turi tikėtinas reikšmes.
- `[x]` Patikrinti, kad visi puslapiai turi SEO metadata.
- `[x]` Patikrinti, kad canonical, OG URL, OG image, sitemap, robots.txt ir JSON-LD yra techniškai korektiški.
- `[x]` Patikrinti, kad GA4 eventai atitinka allowlist ir nesiunčia kontaktų formos laukų.
- `[x]` Patikrinti, kad GA4 Measurement ID formatas, Turnstile public key ir GA4 įkėlimas tik po sutikimo yra automatiškai saugomi.
- `[x]` Patikrinti kontaktų API validaciją, setup-pending būseną ir mock Resend sėkmės kelią.

Prieš Cloudflare deploy:

- `[x]` Visi puslapiai atsidaro lokaliai per techninę patikrą.
- `[x]` Mobile meniu veikia.
- `[x]` Kontaktų forma validuoja laukus.
- `[x]` 404 puslapis veikia gyvai ir grąžina `HTTP/2 404`.
- `[x]` 2026-07-12 Worker fallback kodas ir lokali VM patikra dengia lietuvišką `404.html` turinį su 404 statusu.
- `[!]` Production nežinomo URL lietuviškas 404 turinys laukia Cloudflare redeploy į `9002f14` arba naujesnį commitą.
- `[x]` `sitemap.xml` ir `robots.txt` yra vietoje.
- `[~]` Privatumo ir slapukų puslapiai techniškai peržiūrėti; reikia Agnės galutinio patvirtinimo.

Po Cloudflare deploy:

- `[x]` Atidaryti `https://agnezukiene.lt`.
- `[x]` Atidaryti `https://www.agnezukiene.lt` ir patikrinti nukreipimą.
- `[x]` Patikrinti visus pagrindinius puslapius gyvai per smoke testą.
- `[x]` Patikrinti laikiną Cloudflare URL su `scripts/check-live-site.js`.
- `[~]` Patikrinti production URL su `scripts/check-live-site.js https://agnezukiene.lt`, įskaitant `www`, HTTP į HTTPS, SEO failų turinį ir lietuvišką 404 turinį: šiuo metu laukia Cloudflare redeploy po `9002f14`.
- `[ ]` Patikrinti formos siuntimą gyvai.
- `[ ]` Patikrinti GA4 Realtime.
- `[ ]` Patikrinti Search Console sitemap pateikimą.

## 9. Vėlesnis augimas po MVP

- `[ ]` Po 2-4 savaičių peržiūrėti GA4 ir Search Console duomenis.
- `[ ]` Pagal realias paieškas sudaryti pirmų tinklaraščio / edukacinių tekstų sąrašą.
- `[ ]` Paruošti 3-5 patvirtintus tekstus prieš aktyviai rodant tinklaraščio skiltį.
- `[ ]` Pridėti Agnės portretą ir portfolio vizualinį sluoksnį.
- `[ ]` Svarstyti profesinį domeno el. paštą.
- `[ ]` Vėliau automatizuoti growth review, bet tik po stabilaus MVP.

## 10. Artimiausias darbo sprintas

Kitas darbas turi vykti tokia tvarka:

1. `[x]` Pabaigti `assets/css/styles.css`.
2. `[x]` Pabaigti `assets/js/site.js`.
3. `[x]` Sukurti `sitemap.xml` ir `robots.txt`.
4. `[x]` Sukurti `scripts/check-site-integrity.js`.
5. `[x]` Paleisti lokalią patikrą ir sutvarkyti rastas klaidas.
6. `[x]` Sukurti `docs/go-live-checklist.md`.
7. `[x]` Padaryti pirmą commit ir push į GitHub.
8. `[x]` Tada ruošti Cloudflare Pages/Workers prijungimą.

Dabartinis sprinto fokusas po Cloudflare/Turnstile: Resend el. pašto siuntimas, GA4, Search Console ir galutinė privatumo / slapukų tekstų peržiūra.

Po kiekvieno sprinto šiame faile atnaujiname statusus ir trumpai įrašome, kas patikrinta.
