# Agnės Žukienės svetainės roadmap

Atnaujinta: 2026-07-06

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
- Vardų serveriai Interneto vizijoje: vartotoja nurodė, kad pakeisti, bet 2026-07-06 viešas `whois` dar rodo `ns1.serveriai.lt` - `ns4.serveriai.lt`
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
| `kontaktai.html` | Kontaktai ir forma | `[~]` frontend forma ir validacija sukurta, backend dar neįgyvendintas |
| `privatumo-politika.html` | Privatumo politikos juodraštis | `[~]` reikia peržiūrėti prieš viešą paleidimą |
| `slapuku-politika.html` | Slapukų politikos juodraštis | `[~]` reikia sujungti su realia analitika |
| `404.html` | Klaidos puslapis | `[~]` sukurtas, reikia patikrinti po deploy |
| `assets/images/rami-psichologes-svetaines-tekstura.png` | Neutralus hero vizualas be žmonių | `[x]` naudojamas laikinai iki Agnės portreto |
| `public/` | Viešai deployinami svetainės failai Cloudflare Workers/Pages aplinkai | `[x]` sukurta po Cloudflare build klaidos |
| `wrangler.jsonc` | Cloudflare deploy konfigūracija, kad būtų keliami tik `public/` failai | `[x]` sukurta |

Failai / katalogai, kuriuos dar reikia sukurti:

| Failas arba katalogas | Paskirtis | Statusas |
| --- | --- | --- |
| `assets/css/styles.css` | Visa svetainės vizualinė sistema | `[x]` sukurta MVP versija |
| `assets/js/site.js` | Mobile meniu, slapukų pasirinkimas, forma, eventai | `[x]` sukurta MVP versija |
| `public/assets/js/config.js` | Vieši GA4 Measurement ID ir Turnstile site key nustatymai | `[x]` sukurta, reikšmės dar tuščios |
| `src/index.js` | Cloudflare Worker entrypoint: statiniai failai ir `/api/contact` endpointas | `[x]` sukurta backend formai |
| `sitemap.xml` | Search Console ir SEO | `[x]` sukurta |
| `robots.txt` | Paieškos robotų instrukcijos | `[x]` sukurta |
| `docs/go-live-checklist.md` | Paleidimo kontrolinis sąrašas | `[x]` sukurta |
| `docs/seo-inventory.md` | Puslapių title, description, H1 ir canonical inventorius | `[x]` generuojama skriptu |
| `data/analytics-events.json` | Leidžiamų GA4 eventų katalogas | `[x]` sukurta |
| `data/site-content-registry.json` | Puslapių ir turinio registras | `[x]` generuojama skriptu |
| `scripts/check-site-integrity.js` | Techninė lokali patikra | `[x]` sukurta ir paleista |
| `scripts/check-live-site.js` | Gyvos Cloudflare svetainės smoke testas | `[x]` sukurta |
| `scripts/pre-go-live.js` | Viena prieš paleidimą skirta patikra: registrai, integrity, whitespace, optional live URL | `[x]` sukurta |
| `docs/cloudflare-variables-runbook.md` | Cloudflare variables/secrets nustatymų runbook formai, Turnstile, Resend ir GA4 | `[x]` sukurta |
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
- `[x]` Sukurti `scripts/check-site-integrity.js`.
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
- `[!]` Vardų serveriai pakeisti Interneto vizijoje, bet viešas registras dar nerodo Cloudflare.
- `[!]` 2026-07-06 `whois agnezukiene.lt` būsena: `pendingCreate`.
- `[ ]` Pakartotinai patikrinti, ar `.lt` registre domenas tapo aktyvus.
- `[ ]` Pakartotinai patikrinti, ar vieši NS jau yra `felicity.ns.cloudflare.com` ir `liberty.ns.cloudflare.com`.
- `[x]` Cloudflare Pages/Workers projektas prijungtas prie GitHub repo.
- `[x]` Pataisyti Cloudflare deploy struktūrą: vieši failai perkelti į `public/`, `wrangler.jsonc` assets directory nustatytas į `./public`.
- `[x]` Pirmas Cloudflare deploy sėkmingas: `https://agnezukienepage.petrauskaiteagne.workers.dev`.
- `[x]` `wrangler.jsonc` projekto vardas suderintas su Cloudflare vardu `agnezukienepage`.
- `[x]` `run_worker_first` įjungtas, kad Worker aptarnautų API, pridėtų saugumo antraštes ir galėtų atlikti `www` nukreipimą.
- `[x]` `https://agnezukienepage.petrauskaiteagne.workers.dev/api/contact` patikrintas: endpointas veikia ir grąžina laukiamą 503, kol nesudėti el. pašto kintamieji.
- `[x]` Worker prideda bazines saugumo antraštes ir nukreipia `www.agnezukiene.lt` į `agnezukiene.lt`.
- `[x]` Statinio puslapio saugumo antraštės patikrintos gyvai laikiname Cloudflare URL.
- `[x]` Desktop 1440px ir mobile 390px vizualinė patikra atlikta per Chrome: horizontalios slinkties nėra, pagrindiniai mygtukai telpa, mobile meniu persijungia.
- `[ ]` Production branch nustatyti į `main`.
- `[x]` Pridėti custom domain `agnezukiene.lt`.
- `[!]` 2026-07-06 `agnezukiene.lt` viešai dar rodo Interneto vizijos IP `79.98.25.1`; laukiama NS persijungimo.
- `[x]` Sutvarkyti `www.agnezukiene.lt` nukreipimą į `agnezukiene.lt` Worker lygiu; pilnai patikrinti po DNS persijungimo.
- `[ ]` Patikrinti HTTPS.
- `[x]` Po deploy patikrinti gyvą svetainę, ne tik lokalią versiją.
- `[x]` Sukurti live smoke testą laikinam Cloudflare URL.

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
- `[~]` `privatumo-politika.html`: peržiūrėti prieš viešą paleidimą.
- `[~]` `slapuku-politika.html`: atnaujinti pagal realų GA4 / slapukų naudojimą.
- `[~]` `404.html`: patikrinti po deploy.
- `[-]` Tinklaraščio aktyviai nepaleidžiame MVP, kol nėra bent 3-5 patvirtintų tekstų.

Reikia Agnės patvirtinimo prieš viešą paleidimą:

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
- `[~]` Integruoti Cloudflare Turnstile: frontend ir backend paruošti, reikia site key ir secret.
- `[~]` Integruoti Resend laiškų siuntimą: backend paruoštas ir patikrintas, reikia API rakto ir siuntėjo adreso.
- `[ ]` Cloudflare nustatyti `CONTACT_TO_EMAIL=zukiene.agne@gmail.com`.
- `[ ]` Cloudflare nustatyti `ALLOWED_ORIGIN=https://agnezukiene.lt`.
- `[ ]` Cloudflare secrets: `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`.
- `[x]` Sukurti Cloudflare variables/secrets runbook: `docs/cloudflare-variables-runbook.md`.
- `[x]` Patikrinti, kad forma nesiunčia jautraus turinio į GA4.
- `[x]` Patikrinti, kad forma turi aiškias klaidas žmogui.
- `[x]` Pridėti nematomą honeypot lauką paprastų botų filtravimui iki Turnstile.
- `[ ]` Patikrinti, kad jei forma neveiktų, lieka alternatyva el. paštu.

Formos duomenų principas: renkame tik tiek, kiek reikia atsakyti į užklausą. Neprašome diagnozės, asmens kodo, adreso, sveikatos dokumentų ar išsamios istorijos.

## 7. SEO, GA4 ir Search Console

- `[~]` Puslapiuose pradėti title, description, canonical ir OG metadata.
- `[ ]` Patikrinti visų puslapių H1, title, description, canonical ir OG.
- `[x]` Sukurti `sitemap.xml`.
- `[x]` Sukurti `robots.txt`.
- `[ ]` Sukurti `docs/seo-inventory.md`.
- `[x]` Sukurti `scripts/generate-seo-inventory.js`.
- `[x]` Sukurti `scripts/generate-content-registry.js`.
- `[~]` Įdiegti GA4 tik su sutikimo režimu: frontend paruoštas, reikia GA4 Measurement ID.
- `[x]` Sukurti `data/analytics-events.json`.
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
- `[ ]` Patikrinti `git status --short`.
- `[ ]` Patikrinti, kad nėra secret failų.
- `[ ]` Patikrinti, kad nėra `TODO`, `lorem ipsum`, tuščių nuorodų ar placeholder tekstų.
- `[ ]` Patikrinti, kad visi puslapiai turi SEO metadata.

Prieš Cloudflare deploy:

- `[ ]` Visi puslapiai atsidaro lokaliai.
- `[ ]` Mobile meniu veikia.
- `[ ]` Kontaktų forma validuoja laukus.
- `[ ]` 404 puslapis veikia.
- `[ ]` `sitemap.xml` ir `robots.txt` yra vietoje.
- `[ ]` Privatumo ir slapukų puslapiai peržiūrėti.

Po Cloudflare deploy:

- `[ ]` Atidaryti `https://agnezukiene.lt`.
- `[ ]` Atidaryti `https://www.agnezukiene.lt` ir patikrinti nukreipimą.
- `[ ]` Patikrinti visus pagrindinius puslapius gyvai.
- `[x]` Patikrinti laikiną Cloudflare URL su `scripts/check-live-site.js`.
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
8. `[ ]` Tada ruošti Cloudflare Pages prijungimą.

Po kiekvieno sprinto šiame faile atnaujiname statusus ir trumpai įrašome, kas patikrinta.
