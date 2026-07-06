# Agnės Žukienės psichologės svetainės Codex handoff

Paruošta: 2026-07-05  
Tikslas: perduoti naujam Codex thread'ui geriausias kūrimo, testavimo, Cloudflare, GitHub, GA4, Search Console ir augimo automatizavimo praktikas, pritaikytas psichologės svetainei.

## 1. Projekto esmė

Kuriama Agnės Žukienės, psichologės, interneto svetainė. Ji turi būti rami, patikima, etiška ir aiški žmogui, kuris ieško psichologinės pagalbos arba nori suprasti, ar Agnės paslaugos jam tinka.

Svetainės tikslai:

- aiškiai pristatyti Agnę, jos kompetencijas, darbo kryptis ir ribas;
- padėti žmogui saugiai nuspręsti, ar kreiptis;
- sumažinti nerimą prieš pirmą kontaktą;
- rinkti užklausas per paprastą ir privatumą saugančią formą;
- matuoti lankomumą ir užklausų kelią per GA4 ir Search Console;
- auginti SEO pagal realias žmonių paieškas, bet be manipuliatyvios ar per daug mediciniškos komunikacijos;
- veikti stabiliai per GitHub + Cloudflare.

Svarbi kryptis: tai nėra agresyvi pardavimo svetainė. Psichologės svetainei labiau tinka pasitikėjimo, aiškumo, saugumo ir profesinio santūrumo sistema.

## 2. Techninė architektūra

Rekomenduojama pradėti paprastai:

```text
/
  index.html
  apie.html
  paslaugos.html
  konsultacijos.html
  duk.html
  kontaktai.html
  privatumo-politika.html
  slapuku-politika.html
  404.html
  assets/
    css/styles.css
    js/site.js
    images/
  data/
    analytics-events.json
    site-content-registry.json
    growth-review/
  docs/
    roadmap.md
    go-live-checklist.md
    seo-inventory.md
    growth-review-runbook.md
    growth-opportunities.md
  scripts/
    check-site-integrity.ps1
    pre-go-live.ps1
    generate-content-registry.js
    generate-seo-inventory.js
    check-analytics-events.js
  src/
    index.js
  wrangler.jsonc
  sitemap.xml
  robots.txt
```

Hostingas ir deploy:

- kodas laikomas GitHub;
- pagrindinė šaka: `main`;
- Cloudflare Pages arba Workers & Pages prijungiamas prie GitHub;
- push į `main` sukelia production deploy;
- kontaktų forma aptarnaujama per Cloudflare Worker endpointą, pvz. `/api/contact`;
- formos laiškams naudoti Resend arba kitą patikimą email API;
- botų apsaugai naudoti Cloudflare Turnstile.

Oficialus pagrindas:

- Cloudflare GitHub integracija leidžia automatiškai deployinti po push į prijungtą šaką: https://developers.cloudflare.com/pages/configuration/git-integration/
- Google Analytics Data API naudoja tą pačią GA4 ataskaitų logiką kaip GA4 sąsaja: https://developers.google.com/analytics/devguides/reporting/data/v1
- Search Console API leidžia programiškai skaityti paieškos analitiką ir sitemap informaciją: https://developers.google.com/webmaster-tools
- WCAG 2.2 yra dabartinis W3C prieinamumo rekomendacijų pagrindas: https://www.w3.org/TR/WCAG22/

## 3.1. Konkretus technologijų stackas

Naudoti paprastą, patikrintą ir lengvai prižiūrimą stacką:

```text
Frontend:
- HTML
- CSS
- vanilla JavaScript
- JSON-LD structured data
- responsive images: PNG/JPG source + WebP variants + srcset/sizes

Hostingas / edge:
- GitHub repo kaip kodo šaltinis
- Cloudflare Pages arba Workers & Pages kaip hostingas
- Cloudflare Worker kontaktų formai ir API endpointams
- Cloudflare Turnstile botų apsaugai
- Cloudflare DNS domeno valdymui
- Cloudflare cache headers statiniams assetams

Formos ir el. paštas:
- /api/contact per Cloudflare Worker
- Resend email API arba kitas patikimas transakcinis email tiekėjas
- CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL kaip Cloudflare plaintext variables
- RESEND_API_KEY / TURNSTILE_SECRET_KEY kaip Cloudflare secrets

Analitika:
- GA4 su Consent Mode
- Google Search Console
- Google Analytics Data API
- Search Console API
- OAuth arba service account tik skaitymui
- lokalūs CSV eksportai kaip fallback

Kokybė:
- PowerShell patikros Windows aplinkai
- Node.js skriptai turinio registrui, SEO inventoriui ir analytics event auditui
- Playwright / Chrome visual smoke testams, jei projektas tai naudoja
- git diff --check prieš commit
```

Nenaudoti sunkesnio frameworko vien dėl frameworko. Jei svetainė yra nedidelė, statinis HTML/CSS/JS su aiškiomis patikromis bus greitesnis, saugesnis ir lengviau perkeliamas į Cloudflare.

## 3.2. Kaip darome darbus

Darbo metodas:

1. Pradedame nuo aiškios informacijos architektūros, ne nuo dizaino efektų.
2. Kiekvienam puslapiui iš anksto aprašome tikslą: kam skirtas, kokį klausimą atsako, koks saugus kitas žingsnis.
3. Kuriame mažomis bangomis: bazė, forma, analytics, SEO, tada turinio plėtra.
4. Po kiekvienos bangos paleidžiame patikras.
5. Tik tada commit, push ir Cloudflare deploy.
6. Po deploy tikriname gyvą svetainę, nepasitikime vien lokalia versija.
7. Roadmap pažymime, kas padaryta, kas įkelta ir ką stebėti.

Kiekvieno puslapio kūrimo tvarka:

```text
1. Parašyti puslapio paskirtį.
2. Parašyti H1, meta title ir meta description.
3. Sudėti pagrindinį tekstą.
4. Pridėti CTA, bet be spaudimo.
5. Pridėti vidines nuorodas.
6. Pridėti canonical, OG ir JSON-LD.
7. Įtraukti į sitemap.xml.
8. Įtraukti į content registry.
9. Patikrinti mobile / desktop.
10. Paleisti patikras.
```

Kiekvieno didesnio pakeitimo pabaigoje Codex turi atsakyti:

```text
Kas pakeista?
Kokie failai paliesti?
Kokios patikros paleistos?
Kas liko stebėjimui?
Ar reikia išorinio žmogaus veiksmo?
```

## 4. Pirmo etapo puslapiai

Minimalus pirmas paleidimas:

- `index.html` - pradinis puslapis: kas Agnė, kam padeda, kaip vyksta kreipimasis.
- `apie.html` - Agnės kvalifikacija, patirtis, darbo principai, ribos.
- `paslaugos.html` - paslaugų apžvalga.
- `konsultacijos.html` - konsultacijų formatas, trukmė, kaina, pasiruošimas, konfidencialumas.
- `duk.html` - dažni klausimai prieš pirmą konsultaciją.
- `kontaktai.html` - trumpa forma, el. paštas, darbo vieta arba online formatas.
- `privatumo-politika.html` - privatumo informacija.
- `slapuku-politika.html` - slapukų ir analitikos informacija.
- `404.html` - švelnus klaidos puslapis su grįžimu į pagrindines kryptis.

Neskubėti daryti EN versijos, jei Agnė pirmiausia dirba lietuvių kalba. Vienakalbė svetainė sumažina klaidų riziką.

## 5. Turinio tonas psichologės svetainei

Tonas:

- ramus;
- aiškus;
- šiltas, bet ne sentimentalus;
- profesionalus, bet ne sausas;
- be pažadų „išspręsti problemą“;
- be diagnozavimo per tekstą;
- be spaudimo greitai pirkti.

Geri CTA:

- `Susisiekti dėl konsultacijos`
- `Užduoti klausimą`
- `Pasitikrinti, ar konsultacija tinka`
- `Registruotis pirmam pokalbiui`

Vengti:

- `Išsigydykite nerimą`
- `Garantotas rezultatas`
- `Greitas sprendimas`
- `Diagnozuokite save`
- `Rezervuok dabar, kol nevėlu`

Puslapio viršuje žmogus turi greitai suprasti:

- su kokiomis temomis Agnė dirba;
- su kuo ji nedirba arba kada reikia kitos pagalbos;
- kaip vyksta pirmas kontaktas;
- ar konsultacijos vyksta gyvai, online, ar abiem būdais;
- kokios konfidencialumo ribos;
- ką daryti, jei žmogui reikia skubios pagalbos.

## 6. Psichologės svetainės etikos ir saugumo ribos

Prieš publikuojant turinį, patikrinti pagal Agnės profesinius reikalavimus ir jos pačios patvirtinimą.

Būtini principai:

- neperžadėti rezultatų;
- aiškiai nurodyti kvalifikaciją, darbo sritis ir paslaugų ribas;
- nerašyti taip, lyg svetainė būtų medicininė diagnozavimo priemonė;
- jei minimos temos kaip nerimas, depresyvumas, santykiai, krizės ar trauma, rašyti atsargiai ir informaciškai;
- nenaudoti klientų istorijų, citatų ar nuotraukų be aiškaus leidimo;
- klientų atsiliepimų psichologijos kontekste geriau vengti arba naudoti tik po atskiro etinio įvertinimo;
- kontaktų forma neturi prašyti detalaus jautraus pasakojimo.

Rekomenduojama turėti trumpą krizės nuorodą:

```text
Jei kyla tiesioginė grėsmė jūsų ar kito žmogaus saugumui, kreipkitės į skubią pagalbą. Ši svetainė ir kontaktų forma nėra skubios pagalbos kanalas.
```

Konkrečius pagalbos kontaktus ir formuluotę turi patvirtinti Agnė.

Oficialūs etikos / privatumo orientyrai:

- Lietuvos psichologų sąjungos Psichologo profesinės etikos kodeksas: https://www.psichologusajunga.lt/wp-content/uploads/2024/05/Psichologu-sajunga_ETIKOS-KODEKSAS_1.pdf
- GDPR specialių kategorijų duomenys apima ir sveikatos duomenis, todėl formose reikia duomenų minimizavimo: https://gdpr-info.eu/art-9-gdpr/

## 7. Kontaktų forma

Forma turi būti trumpa ir saugi.

Rekomenduojami laukai:

- vardas;
- el. paštas arba telefonas;
- pageidaujamas atsakymo būdas;
- konsultacijos formatas: gyvai / online / nežinau;
- trumpa tema arba pasirinkimas iš sąrašo;
- laisvas komentaras, pažymėtas kaip neprivalomas;
- sutikimas dėl privatumo politikos;
- Turnstile.

Svarbu:

- neprašyti diagnozės;
- neprašyti išsamios problemos istorijos;
- neprašyti asmens kodo, adreso, sveikatos dokumentų ar perteklinių duomenų;
- prie formos paaiškinti, kada Agnė atsako;
- nurodyti, kad forma nėra skubios pagalbos kanalas;
- formos klaidos turi būti aiškios ir matomos;
- visada palikti alternatyvą: el. paštas arba telefonas, jei forma neveikia.

Rekomenduojami GA4 eventai:

```text
contact_intent_click
form_start
form_error
generate_lead
mailto_click
phone_click
service_interest_select
consultation_format_select
```

## 8. Privatumas ir duomenų minimizavimas

Kadangi psichologės svetainėje žmonės gali rašyti jautrią informaciją, duomenų minimizavimas yra svarbesnis už rinkodaros patogumą.

Taisyklės Codexui:

- formoje rinkti tik tiek, kiek reikia atsakyti į užklausą;
- nesiųsti jautraus formos turinio į GA4 event parametrus;
- GA4 eventuose naudoti tik techninius ir neidentifikuojančius parametrus, pvz. `form_id`, `topic_group`, `source_page`;
- nesaugoti formos užklausų public repo;
- secret failų, API raktų ir OAuth JSON niekada necommitinti;
- privatumo politikoje aiškiai aprašyti, kokie duomenys renkami, kokiu tikslu ir kiek laiko saugomi;
- slapukų baneryje leisti atsisakyti analitikos slapukų.

## 9. SEO struktūra

SEO turi remtis realiais žmonių klausimais, ne manipuliatyviais simptomų puslapiais.

Galimos turinio kryptys, tik jei Agnė jas patvirtina:

- kaip vyksta pirmoji psichologo konsultacija;
- kada verta kreiptis į psichologą;
- kuo psichologo konsultacija skiriasi nuo psichoterapijos arba psichiatro konsultacijos;
- online psichologo konsultacijos: kam tinka ir kada geriau gyvai;
- psichologinė pagalba santykių sunkumuose;
- psichologinė pagalba patiriant nerimą;
- darbas su saviverte, ribomis, perdegimu ar gyvenimo pokyčiais, jei tai Agnės kompetencijos sritys.

Kiekvienas puslapis turi turėti:

- unikalų `title`;
- unikalią `meta description`;
- vieną `h1`;
- canonical;
- OG title / description / image;
- įtraukimą į `sitemap.xml`;
- vidines nuorodas į susijusias paslaugas ir kontaktus;
- jei yra DUK, `FAQPage` schema;
- jei puslapis apie paslaugą, `Service` schema;
- jei apie Agnę, `Person` arba `ProfessionalService` schema.

## 10. Dizainas ir UX

Psichologės svetainei tinka:

- švari, rami, lengvai skaitoma struktūra;
- daug oro, bet ne tuščias hero be informacijos;
- aiškus kontrastas light temoje;
- patogus mobile meniu;
- pakankamai dideli mygtukai;
- aiškios formos labeliai;
- šiltos, tikros arba etiškai sugeneruotos nuotraukos, kurios neatrodo kaip stockinė klinika;
- jokios vizualinės panikos, spaudimo ar agresyvių spalvų.

Patikrinti:

- mobile;
- desktop;
- light tema;
- dark tema, jei naudojama;
- header;
- footer;
- forma;
- 404;
- visų pagrindinių puslapių SEO metadata;
- ar tekstas telpa mygtukuose ir kortelėse;
- ar nėra sugadintų lietuviškų raidžių.

## 11. Nuotraukos ir vizualai

Taisyklės:

- nenaudoti atsitiktinių žmonių kaip Agnės atvaizdo;
- jei naudojamas Agnės portretas, naudoti tik jos pateiktą arba patvirtintą nuotrauką;
- jei generuojami abstraktūs vizualai, nenaudoti realistiškų nepažįstamų žmonių kaip klientų;
- nenaudoti dramatizuotų ar stigmatizuojančių psichikos sveikatos vaizdų;
- nuotraukos neturi būti ištemptos;
- naudoti `srcset`, WebP ir aiškų focal point;
- failų pavadinimai turi būti URL saugūs, be lietuviškų specialių simbolių.

Pavyzdžiai:

```text
agne-zukiene-psichologe-portretas.webp
rami-psichologo-konsultacijos-erdve.webp
online-psichologo-konsultacija-kompiuteris.webp
```

## 12. Kokybės patikros

Nuo pirmos dienos turėti patikras, kad nekartotume d2.lt klaidų.

Rekomenduojami skriptai:

```text
scripts/check-site-integrity.ps1
scripts/pre-go-live.ps1
scripts/generate-content-registry.js
scripts/generate-seo-inventory.js
scripts/check-analytics-events.js
scripts/check-live-site.js
```

`check-site-integrity.ps1` turi tikrinti:

- vidines nuorodas;
- `title`, `description`, `h1`;
- canonical;
- OG;
- `sitemap.xml`;
- `robots.txt`;
- JSON-LD;
- 404;
- formos endpointą;
- mojibake klaidas;
- ar nėra `.env`, JSON raktų ir kitų secret failų;
- ar nėra tuščių `href`;
- ar nėra netyčia likusių `TODO`, `lorem ipsum` ir placeholder tekstų.

`pre-go-live.ps1` turi paleisti:

- content registry generavimą;
- SEO inventory generavimą;
- site integrity;
- analytics event audit;
- visual smoke test;
- `git diff --check`.

PowerShell su lietuvišku tekstu visada paleisti su UTF-8:

```powershell
[Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)
chcp.com 65001 > $null
$env:PYTHONIOENCODING = 'utf-8'
```

## 13. GitHub ir Cloudflare darbo eiga

Darbo modelis:

1. Darbai daromi lokaliai.
2. Prieš commit paleidžiamos patikros.
3. Peržiūrimas `git status --short`.
4. Commitinami tik aktualūs failai.
5. Push į `main`.
6. Cloudflare automatiškai deployina.
7. Po deploy paleidžiama live patikra.
8. Roadmap pažymima, kas įkelta ir ką stebėti.

Niekada necommitinti:

```text
.env
.env.*
*.local
*-oauth-client.json
*-oauth-token.json
*-service-account.json
data/growth-review/*.csv
.codex/
```

## 13.1. Cloudflare konfigūracija

Cloudflare pusėje laikyti:

```text
Production branch:
- main

Routes / domain:
- agnes-domenas.lt/*
- www -> pagrindinis domenas, jei naudojama
- http -> https redirect

Plaintext variables:
- CONTACT_TO_EMAIL=agne@example.lt
- CONTACT_FROM_EMAIL=Agne Zukiene <noreply@agnes-domenas.lt>
- ALLOWED_ORIGIN=https://agnes-domenas.lt

Secrets:
- RESEND_API_KEY
- TURNSTILE_SECRET_KEY

Public frontend config:
- Turnstile site key HTML/JS faile arba public config faile
- GA4 Measurement ID, pvz. G-XXXXXXXXXX
```

Worker formai turi:

- priimti tik `POST`;
- tikrinti `Origin`, jei įmanoma;
- validuoti el. paštą ir privalomus laukus;
- tikrinti Turnstile tokeną;
- riboti per dažnas užklausas;
- nesiųsti secret reikšmių į frontend klaidas;
- grąžinti žmogui suprantamą klaidos tekstą;
- loguose vengti perteklinio jautraus formos turinio.

## 13.2. Lokalių komandų standartas

Prieš didesnį darbą:

```powershell
git status --short --branch
```

Kai skaitomas ar tikrinamas lietuviškas tekstas:

```powershell
[Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)
chcp.com 65001 > $null
$env:PYTHONIOENCODING = 'utf-8'
```

Prieš commit:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\pre-go-live.ps1
git diff --check
git status --short
```

Po deploy:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\pre-go-live.ps1 -Live
```

Jei keistas turinys, SEO ar puslapiai:

```powershell
node .\scripts\generate-content-registry.js
node .\scripts\generate-seo-inventory.js
```

Jei keisti GA4 eventai:

```powershell
node .\scripts\check-analytics-events.js
```

## 13.3. Repo failų vaidmenys

Codex turi žinoti, kam skirtas kiekvienas valdymo failas:

```text
docs/roadmap.md
- pagrindinis darbų planas, statusai ir stebimi punktai.

docs/go-live-checklist.md
- ką tikrinti prieš deploy ir po deploy.

docs/seo-inventory.md
- title, description, H1, canonical, OG ir sitemap peržiūra.

data/site-content-registry.json
- mašininis visų puslapių registras: URL, SEO, CTA, paveiksleliai, schema.

data/analytics-events.json
- leistinų GA4 eventų katalogas.

docs/growth-review-snapshot.md
- naujausia GA4 / Search Console analizės santrauka.

docs/growth-opportunities.md
- backlog pagal realius duomenis.

scripts/pre-go-live.ps1
- viena komanda prieš deploy.

scripts/check-site-integrity.ps1
- techninės svetainės kokybės patikra.

scripts/check-live-site.js
- gyvos svetainės smoke patikra po Cloudflare deploy.
```

## 14. GA4 ir Search Console ciklas

Matavimo tikslas: suprasti, kurie puslapiai padeda žmonėms kreiptis, kur žmonės sustoja, kokios paieškos jau atveda lankytojus ir ką verta aiškinti geriau.

GA4:

- naudoti Consent Mode ir slapukų banerį;
- nesiųsti asmens duomenų į event parametrus;
- sekti tik bendrą elgseną;
- tikrinti GA4 Realtime / DebugView po diegimo.

Search Console:

- domain property patvirtinti per Cloudflare DNS TXT;
- pateikti `sitemap.xml`;
- po naujų puslapių naudoti URL Inspection;
- kas 2-4 savaites žiūrėti užklausas, CTR, pozicijas ir indeksavimo problemas.

Automatizacija:

- naudoti Google Analytics Data API ir Search Console API per OAuth arba service account;
- duomenis traukti į `data/growth-review/`;
- generuoti `docs/growth-review-snapshot.md`;
- generuoti `docs/growth-opportunities.md`;
- sprendimus daryti pagal 28 dienų langą, bet neperdaryti ką tik pakeistų puslapių, kol dar matomas senas duomenų periodas.

## 14.1. Google duomenų traukimo būdas

Rekomenduojamas kelias:

1. Sukurti GA4 property ir web stream.
2. Įdėti GA4 Measurement ID į svetainę su Consent Mode.
3. Search Console patvirtinti kaip domain property per Cloudflare DNS TXT.
4. Google Cloud projekte įjungti tik reikalingus API:
   - Google Analytics Data API;
   - Google Search Console API.
5. Autorizacijai naudoti OAuth per Agnės arba administruojančią Google paskyrą, kuri mato GA4 ir Search Console.
6. Tokenus ir client JSON laikyti už repo ribų.
7. Duomenis traukti lokaliu skriptu į CSV.
8. Iš CSV generuoti growth review.

`.env.google.local` pavyzdys:

```text
GOOGLE_AUTH_MODE=oauth
GOOGLE_OAUTH_CLIENT_SECRET=C:\Users\...\Documents\Secrets\agne-google-oauth-client.json
GOOGLE_OAUTH_TOKEN_PATH=C:\Users\...\Documents\Secrets\agne-google-oauth-token.json
GA4_PROPERTY_ID=000000000
GSC_SITE_URL=sc-domain:agnes-domenas.lt
GROWTH_DAYS=28
```

Šio failo necommitinti.

Duomenų failai:

```text
data/growth-review/ga4-events.csv
data/growth-review/ga4-events-by-page.csv
data/growth-review/ga4-cta-links.csv
data/growth-review/search-console-pages.csv
data/growth-review/search-console-queries.csv
```

Svarbu: GA4 eventuose nenaudoti žmogaus vardo, el. pašto, telefono, žinutės teksto ar jautrios temos. Jei reikia grupuoti, naudoti bendrus pasirinkimus, pvz. `topic_group=relationships`, `topic_group=stress`, `topic_group=other`, bet tik jei Agnė patvirtina tokį grupavimą.

## 15. Roadmap struktūra

Rekomenduojamas `docs/roadmap.md`:

```text
# Agnės Žukienės svetainės roadmap

## A. Kokybės ir techninis pagrindas
## B. Pozicionavimas ir pirmas įspūdis
## C. Paslaugų ir konsultacijų puslapiai
## D. Kontaktų forma ir privatumas
## E. SEO ir edukacinis turinys
## F. UX, prieinamumas ir vizualai
## G. Analitika ir augimo ciklas
## H. Automatizacija
```

Statusai:

```text
[ ] laukia
[~] pradėta / stebima / reikia poliruoti
[x] padaryta ir įkelta
[!] blokuoja išorinis sprendimas
[-] nedarysime
```

Po kiekvieno darbo:

- atnaujinti roadmap;
- nurodyti, kas pakeista;
- nurodyti, kas patikrinta;
- nurodyti, ką stebėti GA4 / Search Console.

## 16. Go-live checklist

Prieš keliant:

- `git status --short`;
- `git diff --check`;
- `scripts/pre-go-live.ps1`;
- patikrinti mobile ir desktop;
- patikrinti kontaktų formą;
- patikrinti Turnstile;
- patikrinti el. laiško pristatymą;
- patikrinti GA4 Realtime;
- patikrinti `sitemap.xml`;
- patikrinti `robots.txt`;
- patikrinti, kad nėra secret failų;
- commit;
- push į `main`;
- patikrinti Cloudflare deploy;
- patikrinti live URL;
- atnaujinti roadmap.

## 17. Klaidos, kurių nebekartoti

Iš d2.lt patirties:

- nedaryti per daug pakeitimų vienu metu be patikrų;
- nenaudoti PowerShell be UTF-8, kai tikrinamas lietuviškas tekstas;
- nepalikti per blankaus teksto light temoje;
- nepalikti mobile meniu, kuris neišsiskleidžia ar neužsidaro;
- nepalikti nuotraukų, kurios ištemptos arba nukirptos be prasmės;
- nepasitikėti vien tik lokalia versija, visada tikrinti live po deploy;
- nesakyti „sukelta“, kol Cloudflare deploy ir gyvi URL nepatikrinti;
- nepainioti planavimo su įgyvendinimu: kiekvienas roadmap punktas turi baigtis patikra;
- necommitinti `.codex/`, Google secrets, OAuth tokenų, CSV eksportų;
- nesiųsti jautrių formos laukų į GA4;
- nekurti puslapių be SEO metadata, sitemap ir vidinių nuorodų;
- nekurti perteklinių automatizmų anksčiau nei yra stabilus bazinis puslapis.

## 18. Automatizacijos ribos

Automatizmas gali:

- tikrinti nuorodas;
- generuoti SEO inventory;
- generuoti content registry;
- parsisiųsti GA4 / Search Console duomenis;
- paruošti growth review;
- pasiūlyti turinio temas;
- rasti technines klaidas;
- paruošti pakeitimo planą.

Automatizmas neturi be žmogaus patvirtinimo:

- publikuoti jautraus psichologinio turinio;
- keisti Agnės kvalifikacijos, paslaugų ar kainodaros aprašymų;
- pridėti klientų istorijų ar atsiliepimų;
- keisti privatumo politikos esmės;
- keisti Cloudflare secrets;
- trinti puslapių ar assetų;
- pushinti į `main`, jei nebuvo paleistos patikros.

## 19. Pradinė instrukcija Agnės Codexui

Šitą tekstą galima įdėti į naujo thread'o pradžią:

```text
Kuriame Agnės Žukienės psichologės svetainę. Svetainė bus laikoma Cloudflare, kodas GitHub, lankomumo ir paieškos duomenys bus traukiami iš GA4 ir Google Search Console. Dirbk pagal docs/agne-zukiene-psichologe-codex-handoff.md.

Svarbiausia:
- Svetainė turi būti rami, aiški, etiška ir patikima.
- Tai psichologės svetainė, todėl nenaudok agresyvaus pardavimo, garantuotų rezultatų, diagnozavimo ar klientų istorijų be aiškaus leidimo.
- Kontaktų forma turi rinkti minimaliai duomenų ir nesiųsti jautraus turinio į GA4.
- Naudok GitHub + Cloudflare deploy modelį.
- Prieš go-live paleisk pre-go-live ir live patikras.
- Naudok UTF-8 PowerShell guard lietuviškam tekstui.
- Niekada necommitink secrets, OAuth JSON, CSV eksportų ar .codex katalogo.
- Kiekvienas puslapis turi turėti title, description, canonical, OG, sitemap įrašą ir vidines nuorodas.
- Roadmap visada atnaujink po darbo: kas padaryta, kas patikrinta, ką stebėti.
- Jei abejoji dėl etikos, privatumo, medicininės formuluotės ar krizės pagalbos teksto, klausk Agnės arba Dovydo, o ne spėliok.
```

## 20. Pirmas konkretus planas

1. Sukurti repo ir bazinę struktūrą.
2. Sukurti `docs/roadmap.md`, `docs/go-live-checklist.md` ir šį handoff dokumentą.
3. Sukurti dizaino kryptį: rami tipografija, kontrastas, mobile-first, prieinamumas.
4. Sukurti pradinį puslapį, apie, paslaugas, konsultacijas, DUK, kontaktus, privatumo ir slapukų politiką.
5. Įdiegti kontaktų formą per Cloudflare Worker, Turnstile ir email siuntimą.
6. Įdiegti GA4 su Consent Mode ir minimaliais eventais.
7. Prijungti Search Console ir sitemap.
8. Sukurti kokybės patikras.
9. Paleisti pirmą Cloudflare deploy.
10. Po 2-4 savaičių pradėti growth review pagal realius GA4 / Search Console duomenis.
