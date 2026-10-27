# Przeniesienie strony bez utraty pozycji w Google

Analiza starej strony z 21 września 2026 i lista kroków na dzień publikacji. Cel: nowa
strona (WordPress, motyw `cupial-kowalska`) zastępuje starą pod tą samą domeną
**bez utraty tego, co stare adresy zebrały w Google**.

Docelowy adres: **`https://www.cupial-kowalska.pl/`** (decyzja Mikołaja, 21.09.2026).
Wszystkie inne warianty (http, bez www) mają przekierowywać na niego kodem 301.

---

## 1. Stara strona — stan faktyczny

| Co | Stan |
|---|---|
| Technologia | Aplikacja Laravel (nie WordPress), Apache 2.4.10 (Debian, 2014) |
| Hosting / DNS | `hosting-desire.pl` (NS1/NS2), strona na `176.112.77.197` |
| HTTPS | **nie działa** — port 443 zamknięty; strona chodzi tylko po `http://` |
| www / bez www | oba warianty zwracają 200, **bez przekierowania** (duplikacja) |
| Podstrony | 4: `/`, `/about`, `/services`, `/contact` (Wayback Machine: nigdy nie było innych) |
| Tytuły | wszystkie 4 identyczne: „Adwokat Beata Cupiał-Kowalska” |
| Meta description | brak na wszystkich stronach |
| Canonical / robots meta | brak |
| Mapa witryny | brak (`/sitemap.xml` → 404) |
| robots.txt | `User-agent: * / Disallow:` (wszystko dozwolone) |
| Treść | 144–408 słów na stronę, H1 „Kancelaria”, 16 pustych obrazków (`via.placeholder.com`, `src=""`) |
| Analityka | Universal Analytics `UA-109715026-1` — usługa wyłączona przez Google w 2024, nic nie mierzy |
| Poczta | `kancelaria@cupial-kowalska.pl` na **tym samym hostingu**: MX → `mail.cupial-kowalska.pl` → `176.112.79.50`, SPF `v=spf1 a mx ip4:176.112.79.50 ~all` |

### Co jest w indeksie Google (`site:cupial-kowalska.pl`)

Wszystkie 4 strony, **pomieszane między hostami**:

- `http://www.cupial-kowalska.pl/` — strona główna
- `http://cupial-kowalska.pl/services` — Google sam nadał tytuł „Zakres usług - …”
- `http://cupial-kowalska.pl/about`
- `http://www.cupial-kowalska.pl/contact` — tytuł „Kontakt - …”

### Kto linkuje do domeny (cytowania NAP)

Wszystkie linki prowadzą na stronę główną, różnymi wariantami adresu — dlatego
przekierowania muszą obejmować **każdy host i protokół**:

| Źródło | Adres w linku |
|---|---|
| LinkedIn (profil klientki) | `www.cupial-kowalska.pl` |
| KRS-online | `https://www.cupial-kowalska.pl` (dziś nie działa — zadziała po migracji) |
| Panorama Firm | `http://cupial-kowalska.pl` |
| Cylex | `cupial-kowalska.pl` |
| Facebook (grupa, polecenie) | `www.cupial-kowalska.pl` |
| Facebook (strona klientki), Skuteczny Adwokat, Orły Prawa, Targeo, GoWork, doadwokata.pl | dane NAP (adres, telefon, e-mail) zgodne z nową stroną |

### Tematy starej strony a nowa

Stara `/services` opisywała 8 obszarów. Nowa strona **nie ma** czterech z nich —
frazy z nimi związane (np. „adwokat prawo pracy Częstochowa”) przestaną mieć stronę
docelową. Przy tak cienkiej treści starej strony realna strata jest mała, ale to
decyzja klientki, nie techniki:

| Stary obszar | Na nowej stronie |
|---|---|
| Prawo rodzinne | ✅ `/rozwod-i-sprawy-rodzinne/` |
| Prawo spadkowe | ✅ `/sprawy-spadkowe/` |
| Prawo karne | ✅ `/sprawy-karne/` (+ `/jazda-po-alkoholu/`) |
| Prawo cywilne | ✅ `/sprawy-cywilne/` (bez „zasiedzenia”) |
| Umowy | ⚠️ tylko wzmianki na cywilnych/spadkowych |
| Prawo pracy | ❌ brak |
| Postępowanie administracyjne | ❌ brak |
| Dochodzenie odszkodowań | ⚠️ jedna wzmianka na stronie głównej |

---

## 2. Co jest przygotowane na lokalnym buildzie (`cupial.local`)

Wszystko siedzi w motywie (generator `tools/build-wp-theme.mjs`) albo w bazie WP,
więc **jedzie razem z kopią zapasową** — nie trzeba niczego ustawiać ręcznie
na serwerze poza punktem 3.

1. **301 ze starych adresów** (`functions.php`, hook `template_redirect`, priorytet 0).
   Wielkość liter, końcowy ukośnik i parametry nie mają znaczenia. Działa na każdym
   serwerze (Apache, nginx, LiteSpeed), bo robi to PHP:

   | Stary adres | Nowy adres |
   |---|---|
   | `/about` | `/o-mnie/` |
   | `/contact` | `/kontakt/` |
   | `/services` | `/` (strona główna — ma rejestr wszystkich obszarów spraw) |
   | `/img/about.png` | portret klientki (`assets/beata-cupial-kowalska.jpg`) |
   | `/img/favicon.png` | nowa favicona |
   | `/img/gold21.png`, `/img/gold11.png` | nowe logo |

2. **Unikalne tytuły i opisy** na wszystkich 11 stronach (w starej: 4 × ten sam tytuł,
   0 opisów). `rel="canonical"` na każdej stronie — WordPress liczy go z adresu
   witryny, więc po migracji sam wskaże `https://www.…`.
3. **Mapa witryny** `/wp-sitemap.xml` — 10 stron. Bez listy użytkowników (zdradzała
   login konta administratora) i bez `/wpis-szablon/`. `robots.txt` WordPressa
   wskazuje mapę sam.
4. **`/wpis-szablon/` → `noindex, follow`** — przykładowa treść, której klientka nie
   zatwierdziła. Zdjąć flagę `noindex` w `STRONY` (generator), gdy będą prawdziwe wpisy.
5. **404 → `noindex`**, prawdziwy status 404 (nie „miękkie 404” na stronie głównej).
6. **Favicona** — sygnet z logo: `assets/favicon.ico`, `favicon-96.png`,
   `apple-touch-icon.png` + ikona witryny w WP (żeby `/favicon.ico` nie pokazywało logo
   WordPressa).
7. **Dane strukturalne** — `Attorney` (strona główna, kontakt) dostał `url`
   i `sameAs` (LinkedIn, Facebook klientki); usługi mają `Service` + `FAQPage`.
8. **NIP** 5771926637 (Biała lista MF) w stopce i na kontakcie, **ścieżka zawodowa** na
   „O mnie” uzupełniona faktami ze starej strony klientki — spójność danych z Google
   i katalogami.

---

## 3. Dzień publikacji — kroki po kolei

> **Stan 27.10.2026.** WordPress stoi na VPS-ie (176.112.77.211) z podmienionym
> adresem, `.htaccess` z blokiem niżej, mapą witryny i 301 — przetestowane przez
> `--resolve`. Do publikacji vhost wpuszcza tylko IP Mikołaja, a HTTPS ma certyfikat
> samopodpisany. **Po zmianie rekordów A u dostawcy DNS: `/root/publikacja.sh`
> na serwerze** — sam sprawdza DNS (bez zmiany rekordów niczego nie rusza),
> zdejmuje blokadę IP, pobiera certyfikat Let's Encrypt (`--agree-tos` —
> akceptacja warunków Let's Encrypt, za zgodą Mikołaja) i robi testy z sekcji
> „Zaraz po przełączeniu". Odhaczone niżej: zrobione na serwerze.

### Przed przełączeniem DNS

- [x] **Hosting docelowy**: WordPress pod `www.cupial-kowalska.pl` (VPS).
      [ ] **Certyfikat Let's Encrypt** dla obu nazw — robi `/root/publikacja.sh`
      po zmianie DNS (wcześniej się nie da: walidacja idzie po DNS).
- [x] Przeniesienie bazy z podmianą `http://cupial.local` → `https://www.cupial-kowalska.pl`
      (WP-CLI `search-replace --export`, 24 podmiany, 0 pozostałości).
- [x] Ustawienia → Ogólne: oba adresy = `https://www.cupial-kowalska.pl`.
- [x] Bezpośrednie odnośniki `/%postname%/`, blok WordPressa w `.htaccess` (pisany
      ręcznie — WP-CLI nie zapisuje `.htaccess`).
- [x] Ustawienia → Czytanie: indeksowanie włączone (`blog_public = 1`).
- [ ] Przed wysłaniem prośby o DNS: hasło skrzynki w „Poczta strony", akceptacja
      polityki prywatności przez klientkę, własne hasło na koncie `mikolaj`
      i usunięcie konta `admin`.
- [x] `.htaccess` — **nad** blokiem `# BEGIN WordPress` (Apache / LiteSpeed). Stare
      adresy idą tu jednym skokiem prosto na cel; reguły w PHP zostają jako zapas:

```apache
# BEGIN Cupial-Kowalska — stare adresy, HTTPS i www (jeden skok 301)
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule ^[.]well-known/acme-challenge/ - [L]
RewriteRule ^about/?$    https://www.cupial-kowalska.pl/o-mnie/  [NC,L,R=301]
RewriteRule ^contact/?$  https://www.cupial-kowalska.pl/kontakt/ [NC,L,R=301]
RewriteRule ^services/?$ https://www.cupial-kowalska.pl/         [NC,L,R=301]
RewriteCond %{HTTPS} !=on [OR]
RewriteCond %{HTTP_HOST} !^www\.cupial-kowalska\.pl$ [NC]
RewriteRule ^ https://www.cupial-kowalska.pl%{REQUEST_URI} [L,R=301]
</IfModule>
# END Cupial-Kowalska
```

> Jeśli hosting stoi za proxy (np. Cloudflare), `%{HTTPS}` bywa `off` także przy
> HTTPS → pętla przekierowań. Wtedy zamiast `RewriteCond %{HTTPS} !=on` użyj
> `RewriteCond %{HTTP:X-Forwarded-Proto} !https` albo przełącznika „Wymuś HTTPS”
> w panelu hostingu.

### Przełączenie DNS — **uwaga na pocztę**

- [ ] Zmieniamy **tylko rekordy A dla `@` i `www`** na IP nowego hostingu.
- [ ] **Nie ruszamy** rekordów `MX`, `mail` (A → `176.112.79.50`) ani `TXT` (SPF).
      Poczta `kancelaria@cupial-kowalska.pl` działa na starym hostingu i ma działać dalej.
- [ ] Jeśli zmieniają się **serwery nazw** (NS), w nowej strefie trzeba odtworzyć
      MX → `mail.cupial-kowalska.pl` (priorytet 10), A `mail` → `176.112.79.50`
      i SPF `v=spf1 a mx ip4:176.112.79.50 ~all`. Bez tego klientka przestanie
      dostawać maile.

### Zaraz po przełączeniu — test (każdy wiersz: jeden skok 301 i 200 na końcu)

```bash
for h in http://cupial-kowalska.pl http://www.cupial-kowalska.pl https://cupial-kowalska.pl https://www.cupial-kowalska.pl; do for p in / /about /contact /services; do curl -s -o /dev/null -w "$h$p -> %{http_code} %{redirect_url}\n" "$h$p"; done; done
```

- [ ] `https://www.cupial-kowalska.pl/wp-sitemap.xml` — 10 adresów, wszystkie `https://www.`
- [ ] `https://www.cupial-kowalska.pl/robots.txt` — linia `Sitemap:` z `https://www.`
- [ ] Na każdej stronie `<link rel="canonical">` z `https://www.` i brak `noindex`
      (poza `/wpis-szablon/`).

### Google

- [ ] **Search Console**: usługa typu **Domena** (rekord TXT w DNS) — obejmuje od razu
      http/https i www/bez www. Zgłosić `https://www.cupial-kowalska.pl/wp-sitemap.xml`.
- [ ] Sprawdzenie adresu URL dla `/`, `/o-mnie/`, `/kontakt/` i usług →
      „Poproś o zindeksowanie”. Stare `/about`, `/contact`, `/services` powinny
      pokazać „Strona zawiera przekierowanie”.
- [ ] **Narzędzie „Zmiana adresu” NIE jest potrzebne** — domena zostaje ta sama.
- [ ] **Profil Firmy w Google**: pole „Witryna” → `https://www.cupial-kowalska.pl/`.
      To najważniejsze źródło ruchu lokalnego — sprawdzić też godziny i kategorię.
- [ ] Analityka: stary `UA-109715026-1` nie działa. Nowy GA4 wymaga zgody na cookies
      (baner RODO) — decyzja do podjęcia z klientką; bez tego zostaje sama Search Console.

### Po publikacji (2–4 tygodnie)

- [ ] Search Console → Strony: błędy 404 i „Strona z przekierowaniem” — każdy nowy
      stary adres dopisać do `STARE_ADRESY` w generatorze (i do `.htaccess`).
- [ ] Przekierowań **nie usuwać** — trzymać co najmniej rok, najlepiej na stałe.
- [ ] Katalogi (Panorama Firm, Cylex, LinkedIn, Facebook): przy okazji poprawić adres
      na `https://www.cupial-kowalska.pl/` — przekierowanie i tak działa, ale czysty link
      jest lepszy.

---

## 4. Co zobaczy odwiedzający, a nie powinien (stan 27.10.2026)

Widoczne znaczniki `.todo` po publikacji — do domknięcia z klientką (`docs/PYTANIA.md`):

- `o-mnie` (5): numer wpisu na listę adwokatów, „co robiła wcześniej”, rok i podstawa
  uprawnień mediatora. Numer wpisu jest publiczny w Krajowym Rejestrze Adwokatów
  (rejestradwokatow.pl) — można go stamtąd przepisać po potwierdzeniu.
- `polityka-prywatnosci` (3): okres przechowywania zgłoszeń, nazwa hostingu i umowa
  powierzenia, data obowiązywania. Cały tekst to projekt do akceptacji klientki.
- `sprawy-spadkowe` (1): opłata sądowa w FAQ.
- Linki `href="#"`: „Opinie w Google” (stopka i sekcje opinii), status mediatora.
- ~~`baza-wiedzy` (13)~~ — zakładka schowana z menu i stopki, `noindex` (27.10.2026).
- ~~`kontakt`: formularz nic nie wysyła~~ — podpięty (27.10.2026): `admin-post.php`,
  pułapka na boty, limit 5/h z adresu, mail na skrzynkę kancelarii. **Do zrobienia
  przez klientkę:** hasło skrzynki w panelu WP („Poczta strony"), inaczej poczta
  idzie przez serwer bez logowania i może trafiać do spamu.
- ~~Polityka prywatności `href="#"`~~ — strona `/polityka-prywatnosci/` (projekt).
