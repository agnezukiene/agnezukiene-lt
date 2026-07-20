# Agnės Žukienės svetainės roadmap

Atnaujinta: 2026-07-21

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
| `.gitignore` | Failai, kurių necommitiname | `[x]` saugo secret, OAuth, build, `Agnes foto/` ir `tmp/` failus nuo netyčinio commit |
| `index.html` | Pradinis puslapis | `[~]` turinys sukurtas, patvirtintas portretas įkeltas lokaliai, bazinė techninė patikra praėjo; laukia galutinių tekstų sprendimų |
| `apie.html` | Apie Agnę puslapis | `[~]` turinys sukurtas, bazinė techninė patikra praėjo |
| `paslaugos.html` | Paslaugų puslapis | `[~]` turinys sukurtas, bazinė techninė patikra praėjo |
| `konsultacijos.html` | Konsultacijų eiga, konfidencialumas, ribos | `[~]` trūksta kainos, trukmės, formato patvirtinimo |
| `duk.html` | Dažni klausimai | `[~]` sukurtas pradinis DUK |
| `kontaktai.html` | Kontaktai ir forma | `[x]` forma, apsauga nuo automatinių užklausų ir laiškų siuntimas veikia; Resend rodo pristatytus laiškus |
| `privatumo-politika.html` | Privatumo politika | `[x]` 2026-07-19 išsamiai atnaujinta pagal realiai naudojamas paslaugas ir lankytojų teises |
| `slapuku-politika.html` | Slapukų politika | `[x]` tekstas ir pasirinkimo valdymas veikia; mygtukai patikrinti tikroje naršyklėje |
| `404.html` | Klaidos puslapis | `[x]` sukurtas ir patikrintas gyvai |
| `favicon.svg` | Naršyklės kortelės ženkliukas su inicialais AZ | `[x]` sukurtas pagal svetainės spalvas ir patikrintas naršyklėje |
| `assets/images/agne-zukiene-psichologe-sidabro-pienas.jpg` | Patvirtintas Agnės hero portretas | `[x]` spalviškai pritaikytas, optimizuotas iš 2,1 MB PNG į 440 KB JPEG ir 2026-07-13 patikrintas production |
| `public/` | Viešai deployinami svetainės failai Cloudflare Workers/Pages aplinkai | `[x]` sukurta po Cloudflare build klaidos |
| `wrangler.jsonc` | Cloudflare deploy konfigūracija, kad būtų keliami tik `public/` failai | `[x]` sukurta |
| `README.md` | Repo įėjimo taškas su lokaliomis, patikros, deploy ir blokatorių komandomis | `[x]` sukurta |

Failai / katalogai, kuriuos dar reikia sukurti:

| Failas arba katalogas | Paskirtis | Statusas |
| --- | --- | --- |
| `assets/css/styles.css` | Visa svetainės vizualinė sistema | `[x]` sukurta MVP versija |
| `assets/js/site.js` | Mobile meniu, slapukų pasirinkimas, forma, eventai | `[x]` sukurta MVP versija |
| `public/assets/js/config.js` | Vieši GA4 Measurement ID ir Turnstile site key nustatymai | `[x]` Turnstile site key ir GA4 Measurement ID `G-3N3MGJHS0V` įrašyti; GA4 ID matomas ir production faile |
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
| `scripts/check-color-contrast.js` | WCAG spalvų kontrasto patikra | `[x]` tikrina 9 paletės poras, įtraukta į pre-go-live ir 2026-07-13 patikrinta production |
| `scripts/check-analytics-privacy.js` | GA4 eventų allowlist ir jautrių parametrų patikra | `[x]` sukurta |
| `scripts/check-contact-api.js` | Kontaktų API validacijos, Turnstile ir Resend mock patikra | `[x]` sukurta |
| `scripts/check-static-asset-cache.js` | Stilių, programos failų versijų ir naršyklės talpyklos patikra | `[x]` sukurta ir įtraukta į bendrą patikrą 2026-07-20 |
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
- `[x]` Sukurti `scripts/check-static-asset-cache.js` ir įtraukti į bendrą patikrą prieš paskelbimą.
- `[x]` Sukurti `scripts/generate-launch-readiness.js`.
- `[x]` Sustiprinti `scripts/generate-launch-readiness.js`, kad paleidimo santrauka atskirtų Resend domeną, `CONTACT_FROM_EMAIL`, `RESEND_API_KEY` ir kontaktų API techninius vartus.
- `[x]` Sustiprinti `scripts/generate-launch-readiness.js`, kad Agnės turinio blokatorius skaičiuotų iš `docs/content-approval.md` ir rodytų kitą turinio klausimą.
- `[x]` 2026-07-12 papildyti `scripts/generate-launch-readiness.js`, kad santrauka rodytų manual setup queue, bazinio prieinamumo ir saugumo headerių reikšmių vartus.
- `[x]` 2026-07-19 papildyti automatines patikras naršyklės ženkliuku, atsakymo būdo laukais ir vienerių metų saugaus ryšio reikalavimu.
- `[x]` 2026-07-19 įjungta leidžiamų svetainės šaltinių apsauga: naršyklė priima tik pačios svetainės, Cloudflare formos apsaugos ir lankomumo matavimo kodą; keturi struktūrizuotų duomenų blokai saugomi tiksliais kontroliniais kodais.
- `[x]` Sukurta atskira automatinė leidžiamų šaltinių apsaugos patikra `scripts/check-content-security-policy.js` ir įtraukta į bendrą patikrą prieš paskelbimą.
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
- `[x]` Po devynių stabilaus saugaus ryšio dienų įjungtas vienerių metų HSTS reikalavimas be subdomenų ir išankstinio naršyklių sąrašo; taip naršyklė nebegrįžta į nesaugų adresą.
- `[x]` 2026-07-21 išjungta nebereikalinga vieša `workers.dev` svetainės kopija ir automatinės Worker versijų peržiūros nuorodos. Gyvai patvirtinta: pagrindinis `agnezukiene.lt` grąžina 200, buvęs techninis adresas grąžina 404. Šis skirtumas įtrauktas į nuolatinę gyvos svetainės patikrą.
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
- `[x]` `kontaktai.html`: forma trumpa, renka tik atsakymui reikalingus duomenis, pateikia privatumo nuorodą ir aiškias būsenas.
- `[x]` Viešuose tekstuose pakeistos vidinės „dar reikia patvirtinti / prieš paleidimą“ frazės į lankytojui tinkamas atsargias MVP formuluotes.
- `[x]` `privatumo-politika.html`: 2026-07-19 paskelbimui paruoštas išsamus tekstas apie valdytoją, tikslus, paslaugų teikėjus, saugojimą ir lankytojo teises.
- `[x]` 2026-07-21 privatumo politika papildyta tiksliais BDAR teisiniais pagrindais, duomenų šaltiniu, pateikimo neprivalomumu ir pasekmėmis, perkeliamumo teise, perdavimo už Europos ekonominės erdvės ribų apsaugomis bei automatinių sprendimų netaikymu; nauja versija patikrinta gyvoje svetainėje telefonu ir kompiuteriu.
- `[x]` `slapuku-politika.html`: tekstas ir lankytojo pasirinkimo keitimas paruošti; atsisakymo, sutikimo ir pasirinkimo keitimo mygtukai patikrinti naršyklėje.
- `[x]` 2026-07-19 slapukų paaiškinimas patikslintas pagal realų naršyklės pasirinkimo įrašą, „Google Analytics“ slapukus ir formos apsaugą.
- `[x]` `404.html`: patikrintas po deploy.
- `[x]` 2026-07-21 skubios pagalbos informacija paversta tiesiogiai naudojama: pagrindiniame, konsultacijų ir kontaktų puslapiuose numerį 112 galima paspausti ir iškart skambinti, o pagrindiniame bei konsultacijų puslapiuose pateikta nuoroda į oficialų „Pagalba sau“ emocinės paramos pasirinkimų sąrašą. Šių jautrių paspaudimų lankomumo matavimas sąmoningai nevykdomas; veiksmai ir jų išdėstymas patikrinti vietinėje bei gyvoje telefono ir kompiuterio versijoje.
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

- `[x]` Senas laikinas gelsvų ir žalsvų atspalvių paveikslas pašalintas iš viešų failų, nes jo nebenaudoja nė vienas puslapis ir jis neatitinka patvirtintos „Sidabro pieno“ krypties.
- `[x]` Sukurti MVP CSS sistemą: spalvos, tipografija, layout, kortelės, formos, mobile meniu.
- `[x]` Patikrinti, kad tekstas netelpa už mygtukų, kortelių ar formos ribų.
- `[x]` Patikrinti mobile vaizdą.
- `[x]` Patikrinti desktop vaizdą.
- `[x]` Automatizuoti bazinę public HTML prieinamumo patikrą: `main`, skip link, nav ARIA, button `type` ir formos label ryšiai.
- `[x]` 2026-07-19 visi aštuoni vieši puslapiai patikrinti nepriklausomu automatiniu prieinamumo įrankiu kompiuterio ir telefono dydžiuose; pagrindinių bei papildomų taisyklių klaidų nerasta.
- `[x]` 2026-07-21 gyvas pagrindinis ir kontaktų puslapiai papildomai patikrinti „Lighthouse 13.4.0“. Aptiktas papildomas logotipo pavadinimo neatitikimas pataisytas ir apsaugotas nuolatine patikra; po paskelbimo gyvas pagrindinis puslapis visose penkiose vertintose srityse gavo po 100 balų, svarbiausias turinys parodytas per 1,9 sekundės, vaizdo šokinėjimas lygus nuliui.
- `[x]` Klaviatūros nuoroda „Pereiti prie turinio“ pataisyta taip, kad aktyvi klaviatūros vieta iš tikrųjų persikeltų į pagrindinį turinį; patikrinta kompiuterio ir telefono naršyklėje, o reikalavimas įtrauktas į nuolatinę failų patikrą.
- `[x]` Automatizuoti WCAG spalvų kontrasto patikrą: 9 pagrindinės teksto, mygtukų ir focus spalvų poros atitinka nustatytas ribas ir patikrintos production 2026-07-13.
- `[x]` 2026-07-12 pridėti skip link ir `main id="turinys"` privatumo bei slapukų puslapiams.
- `[x]` Agnė pateikė savo nuotraukas ir patvirtino galutinį hero variantą.
- `[x]` Portretui paruoštas atskiras promptas, atlikta tik spalvinė korekcija iš gelsvos į svetainei tinkamą pieno, perlo ir švelnios pilkos kryptį.
- `[x]` Patvirtintas portretas įkeltas į `public/assets/images/agne-zukiene-psichologe-sidabro-pienas.png` ir prijungtas `public/index.html` bei `og:image`.
- `[x]` Hero proporcija pritaikyta portretui ir patikrinta 1280px desktop bei 390px mobile vaizduose; horizontalios slinkties nėra.
- `[x]` Hero paveikslo našumo optimizacija: išlaikant `1089 × 1445` matmenis production naudoja 440 KB JPEG vietoje 2,1 MB PNG, pridėti `width`, `height`, `fetchpriority` ir `decoding`; live patikra praėjo 2026-07-13.
- `[x]` 2026-07-19 pagrindinei nuotraukai pridėti 480, 768 ir 1089 pikselių AVIF bei WebP variantai. Naršyklė pagal ekraną pasirenka tinkamą failą, o išankstinis įkėlimas padeda nuotrauką parodyti greičiau; vietinėje telefono ir kompiuterio patikroje vietoje 440 KB JPEG atsisiųstas maždaug 68 KB AVIF failas.
- `[x]` Automatinės patikros saugo visų šešių sumažintų nuotraukos failų buvimą, dydžio ribą ir prieinamumą gyvoje svetainėje.
- `[x]` 2026-07-20 stiliai ir programos failai susieti su jų turinio versija: nepasikeitusius failus naršyklė gali naudoti vienerius metus, nuotraukas saugo savaitę, o pakeitus failą automatinė patikra pareikalauja naujos versijos. Gyvoje telefono naršyklės patikroje pereinant į kitą puslapį visi trys bendri failai panaudoti iš atminties ir iš interneto perduota 0 papildomų baitų. Kontaktų formos serverio atsakymai naršyklėje nesaugomi.
- `[x]` 2026-07-21 gyvai patvirtinta ir į nuolatinę patikrą įtraukta, kad puslapių tekstai, privatumo politika, paieškos instrukcijos, svetainės žemėlapis ir klaidos puslapis kiekvieną kartą persitikrina. Taip lankytojas gauna naujausią turinį, o versijomis pažymėti stiliai bei programos failai lieka greiti.
- `[x]` Pridėtas lengvas AZ naršyklės ženkliukas ir svetainės spalva naršyklės kortelei bei telefono viršutinei juostai.
- `[x]` Gerbiamas lankytojo naršyklėje pasirinktas mažesnis judesys: išjungiamas sklandus slinkimas ir kortelių pakilimo judesys.
- `[x]` Slapukų pasirinkimo pranešimas pažymėtas kaip aiškiai pavadinta puslapio sritis pagalbinėms skaitymo priemonėms.
- `[x]` 2026-07-19 sutvarkytas lankomumo sutikimo atšaukimas: pasirinkimo keitimas iškart sustabdo matavimą, pašalina „Google Analytics“ slapukus ir iš naujo atveria puslapį be lankomumo įrankio; atsisakius matavimas lieka išjungtas.
- `[x]` Visas „Sutinku → Keisti pasirinkimą → Atsisakyti → pereiti į kitą puslapį“ kelias patikrintas tikroje naršyklėje: slapukai pašalinami, o po atšaukimo neišsiunčiama nė viena lankomumo užklausa. Pagrindiniai reikalavimai įtraukti į automatinę privatumo patikrą.

Vizualinė kryptis:

- Ramu, švaru ir šviesu, su pieno bei perlo baltumo pagrindu.
- Be medicininio šaltumo.
- Be atsitiktinių žmonių nuotraukų.
- Be dramatizuotų psichikos sveikatos vaizdų.
- Pasirinkta `Sidabro pienas` kryptis: pieno balta, perlo paviršiai, labai šviesi neutrali pilka ir melsvai pilki mygtukų akcentai; fonai subtiliai suderinti su patvirtinta nuotrauka.
- Vengti žalių, rudų, molio, smėlio ir juodai grafitinių dominuojančių tonų.

## 6. Kontaktų forma ir privatumas

- `[x]` Kontaktų formos lankytojui matoma dalis sukurta ir patikrinta `kontaktai.html`.
- `[x]` Sukurti `assets/js/site.js` formos validacijai ir siuntimui.
- `[x]` Sukurti `src/index.js` Cloudflare Worker `/api/contact` endpointui.
- `[x]` Sukurti kontaktų API automatinę patikrą su validacijos, Turnstile ir Resend mock sėkmės keliais.
- `[x]` Integruoti Cloudflare Turnstile: widget sukurtas, frontend site key įrašytas, backend secret įdėtas į Cloudflare.
- `[x]` Resend domenas / siuntėjas patvirtintas; paskyra rodo `agnezukiene.lt` kaip paruoštą laiškams siųsti.
- `[x]` Integruoti Resend laiškų siuntimą: ribotų teisių siuntimo raktas prijungtas prie Cloudflare Worker ir naudojamas kontaktų formai.
- `[x]` Cloudflare/Worker nustatyti `CONTACT_TO_EMAIL=zukiene.agne@gmail.com` per `wrangler.jsonc` neslaptą variable.
- `[x]` Cloudflare/Worker nustatyti `ALLOWED_ORIGIN=https://agnezukiene.lt` per `wrangler.jsonc` neslaptą variable.
- `[x]` Cloudflare/Worker nustatyti `CONTACT_FROM_EMAIL=Agnė Žukienė <noreply@agnezukiene.lt>` per `wrangler.jsonc` neslaptą variable.
- `[x]` RESEND_API_KEY ir TURNSTILE_SECRET_KEY saugiai laikomi Cloudflare, o ne viešame projekte.
- `[x]` Sukurti Cloudflare variables/secrets runbook: `docs/cloudflare-variables-runbook.md`.
- `[x]` Patikrinti, kad forma nesiunčia jautraus turinio į GA4.
- `[x]` Patikrinti, kad forma turi aiškias klaidas žmogui.
- `[x]` Forma sutikrina pasirinktą atsakymo būdą: renkantis el. paštą reikia el. pašto adreso, renkantis telefoną reikia telefono numerio; lankytojui parodomas tikslus paaiškinimas ir pažymimas trūkstamas laukas.
- `[x]` Formos klaidos susietos su laukais: pagalbinės skaitymo priemonės perskaito paaiškinimą, neteisingas laukas turi aiškų žymėjimą, o pataisius duomenį žymėjimas pašalinamas.
- `[x]` Kontaktų forma rodo backend klaidos žinutę ir po siuntimo bandymo atnaujina Turnstile tokeną.
- `[x]` Production smoke testas tikrina kontaktų API GET, origin, content-type, request size, JSON ir validacijos klaidas.
- `[x]` Kontaktų API atmeta ne JSON ir per dideles užklausas prieš parsindamas formos duomenis.
- `[x]` Pridėti nematomą honeypot lauką paprastų botų filtravimui iki Turnstile.
- `[x]` 2026-07-20 sustiprinta formos apsauga: laiškas siunčiamas tik gavus „Cloudflare Turnstile“ patvirtinimą iš `agnezukiene.lt` ir būtent kontaktų formai; užklausos be tinkamo svetainės adreso atmetamos.
- `[x]` 2026-07-21 pridėta papildoma laiškų dažnio apsauga: po 5 patvirtintų siuntimų per minutę iš tos pačios interneto jungties papildomi laiškai laikinai neperduodami į „Resend“, lankytojui pateikiamas aiškus paaiškinimas, o abu galimi apsaugos atsakymai padengti automatiniais bandymais. „Cloudflare“ priėmė naują nustatymą, o visa gyva svetainė po paskelbimo praėjo pilną patikrą.
- `[x]` Forma saugiai sustabdoma, jei trūksta apsaugos rakto arba laikinai neatsako „Cloudflare“ ar „Resend“; šie klaidų keliai padengti automatiniais bandymais.
- `[x]` Patikrinti, kad jei forma neveiktų, lieka alternatyva el. paštu.
- `[x]` 2026-07-21 kontaktų formos privatumo tekstas suderintas su paskelbtu duomenų naudojimo pagrindu: lankytojas aiškiai informuojamas ir gauna privatumo politikos nuorodą, tačiau iš jo nereikalaujama klaidinančio atskiro sutikimo vien tam, kad būtų atsakyta į jo paties užklausą. Forma ir serveris patikrinti be perteklinio sutikimo lauko vietinėje ir gyvoje svetainėje.

Formos duomenų principas: renkame tik tiek, kiek reikia atsakyti į užklausą. Neprašome diagnozės, asmens kodo, adreso, sveikatos dokumentų ar išsamios istorijos.

## 7. SEO, GA4 ir Search Console

- `[x]` Visi puslapiai turi unikalius pavadinimus, aprašymus, pagrindinius adresus ir dalijimosi metaduomenis.
- `[x]` 2026-07-19 visų puslapių nuorodų peržiūroms nustatytas patvirtintas Agnės portretas, lietuvių kalba, svetainės pavadinimas, tikslūs nuotraukos matmenys ir aiškus nuotraukos aprašymas; trumpai socialinei peržiūrai naudojamas portretui tinkamas formatas.
- `[x]` Paieškos suvestinė ir automatinės patikros išplėstos nuotraukos aprašymu, lietuvių kalba, svetainės pavadinimu bei socialinės peržiūros tipu.
- `[x]` Patikrinti visų puslapių H1, title, description, canonical ir OG per `docs/seo-inventory.md`.
- `[x]` Sustiprinti SEO patikrą: exact canonical / OG URL, OG paveikslėlio failas, sitemap dublikatai, robots sitemap ir JSON-LD validumas tikrinami automatiškai.
- `[x]` Suderinti viešus URL su Cloudflare adresais be `.html`: canonical, OG, JSON-LD, sitemap ir vidinės nuorodos naudoja švarius adresus. 2026-07-21 senų `.html` adresų laikinas nukreipimas pakeistas nuolatiniu, nes „Google Search Console“ dar rodė seno `/apie.html` adreso parodymus; pakeitimas patvirtintas gyvoje svetainėje visiems seniems adresams.
- `[x]` Sukurti `sitemap.xml`.
- `[x]` Sukurti `robots.txt`.
- `[x]` Sukurti `docs/seo-inventory.md`.
- `[x]` Sukurti `scripts/generate-seo-inventory.js`.
- `[x]` Sukurti `scripts/generate-content-registry.js`.
- `[x]` Sukurtas GA4 property ir Web stream svetainei `agnezukiene.lt`.
- `[x]` Įdiegtas GA4 tik su sutikimo režimu; `G-3N3MGJHS0V` įrašytas `public/assets/js/config.js` ir matomas production faile.
- `[x]` Sukurti `data/analytics-events.json`.
- `[x]` Sukurti automatinę GA4 eventų allowlist, viešo config formato, consent įkėlimo ir privatumo patikrą `scripts/check-analytics-privacy.js`.
- `[x]` Automatinė lankomumo privatumo patikra saugo ne tik įjungimą po sutikimo, bet ir matavimo išjungimą, slapukų pašalinimą bei pasirinkimo keitimo kelią.
- `[x]` Sukurti `docs/analytics-search-console-runbook.md`.
- `[x]` GA4 Realtime / DebugView patikrintas Google nustatymų darbo metu kitame Codex pokalbyje, kaip patvirtino Agnė 2026-07-13.
- `[x]` Search Console patvirtinti kaip `agnezukiene.lt` domain property; 2026-07-13 viešame DNS patikrintas `google-site-verification` TXT įrašas.
- `[x]` `https://agnezukiene.lt/sitemap.xml` pateiktas Search Console, kaip patvirtino Agnė; viešas sitemap ir `robots.txt` grąžina HTTP 200.
- `[x]` 2026-07-21 atlikta pirmoji ankstyva „Search Console“ būklės peržiūra: liepos 12-18 d. svetainė gavo 2 paspaudimus ir 10 parodymų, svetainės žemėlapis sėkmingai perskaitytas, rasti 8 puslapiai, saugumo ir rankinių nuobaudų įspėjimų nėra. Išsami suvestinė: `docs/search-console-review-2026-07-21.md`.

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
- `[x]` Patikrinti, kad leidžiamų šaltinių apsauga dengia visus keturis struktūrizuotų duomenų blokus, neleidžia savavališko įterpto kodo ir leidžia tik svetainei būtinas išorines paslaugas.
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
- `[x]` Production nežinomo URL lietuviškas 404 sutvarkytas: Worker fallbackas naudoja Cloudflare extensionless `/404`; 2026-07-13 production grąžino HTTP 404 ir lietuvišką `Puslapis nerastas` turinį.
- `[x]` `sitemap.xml` ir `robots.txt` yra vietoje.
- `[~]` Privatumo ir slapukų puslapiai techniškai peržiūrėti; reikia Agnės galutinio patvirtinimo.

Po Cloudflare deploy:

- `[x]` Atidaryti `https://agnezukiene.lt`.
- `[x]` Atidaryti `https://www.agnezukiene.lt` ir patikrinti nukreipimą.
- `[x]` Patikrinti visus pagrindinius puslapius gyvai per smoke testą.
- `[x]` Patikrinti laikiną Cloudflare URL su `scripts/check-live-site.js`.
- `[x]` Patikrinti production URL su `scripts/check-live-site.js https://agnezukiene.lt`, įskaitant `www`, HTTP į HTTPS, SEO failų turinį, saugumo antraštes, kontaktų API klaidų kelius ir lietuvišką 404 turinį; visa patikra praėjo 2026-07-13.
- `[x]` Patikrinti formos siuntimą gyvai: 2026-07-20 po apsaugos sustiprinimo per tikrą naršyklę išsiųsta aiškiai pažymėta techninė užklausa; svetainė parodė sėkmę, o „Resend“ įrašas `8602df9f-43fa-427a-923d-38aab00e788d` pažymėtas kaip pristatytas į `zukiene.agne@gmail.com` 23:19.
- `[x]` Patikrinti GA4 Realtime / DebugView.
- `[x]` Patikrinti Search Console sitemap pateikimą ir domain property būseną.

## 9. Vėlesnis augimas po MVP

- `[~]` 2026-07-21 atlikta ankstyva „Search Console“ būklės patikra; pilną GA4 ir paieškos augimo peržiūrą atlikti 2026-08-10, kai bus daugiau duomenų.
- `[ ]` Pagal realias paieškas sudaryti pirmų tinklaraščio / edukacinių tekstų sąrašą.
- `[ ]` Paruošti 3-5 patvirtintus tekstus prieš aktyviai rodant tinklaraščio skiltį.
- `[x]` Pridėti Agnės portretą ir pagrindinį asmeninį vizualinį sluoksnį.
- `[ ]` Svarstyti profesinį domeno el. paštą.
- `[ ]` Vėliau automatizuoti growth review, bet tik po stabilaus MVP.

## 10. Artimiausias darbo sprintas

Kitas darbas turi vykti tokia tvarka:

1. `[x]` Užbaigti ir deployinti dizaino paketą: patvirtintą portretą, hero proporcijas, pieno/perlo paletę ir GA4 konfigūraciją. Production portretas patikrintas 2026-07-13.
2. `[x]` Sutvarkyti lietuviško 404 puslapio pateikimą ir patikrinti production po Cloudflare deploy.
3. `[x]` Patvirtinti Resend domeną, prijungti slaptą siuntimo raktą ir gyvai patikrinti kontaktų formos laišką; naujausias bandymas po apsaugos sustiprinimo pristatytas 2026-07-20.
4. `[ ]` Po vieną surinkti Agnės turinio sprendimus: pirmas klausimas yra konsultacijų formatas.
5. `[x]` Parengti privatumo ir slapukų politikų tekstus bei patikrinti lankytojo pasirinkimo mygtukus.
6. `[~]` Ankstyva „Search Console“ būklė patikrinta 2026-07-21; pirmą pilną GA4 ir paieškos augimo peržiūrą atlikti 2026-08-10.

Dabartinis sprinto fokusas: atsargiai pildyti profesinį turinį tik turint patvirtintus faktus ir stebėti svetainės naudojimą. Portretas, dizainas, kontaktų forma, laiškų pristatymas, privatumo tekstai, GA4, Search Console ir sitemap darbai užbaigti.

Po kiekvieno sprinto šiame faile atnaujiname statusus ir trumpai įrašome, kas patikrinta.
