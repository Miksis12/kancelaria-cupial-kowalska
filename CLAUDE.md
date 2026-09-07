<!-- podstrony-buildless: v1 -->
# Kancelaria Adwokacka Beata Cupiał-Kowalska (strona WWW)

Statyczna, wielostronicowa witryna: czysty HTML/CSS/JS, bez frameworka, bez buildu.
Ten plik jest źródłem prawdy o tym, jak strona jest zbudowana. Nowa podstrona ma
kosztować tyle, co odczyt pliku-wzorca + copy — nie czytaj całego `styles.css`,
klasy sprawdzaj grepem po słowniku niżej.

## Zasady twarde (must-follow)

1. **Jeden wspólny `css/styles.css`** — każda strona go linkuje, nowe reguły dokładasz
   na końcu we własnym bloku. **Zero CSS inline w HTML** (atrybuty `style` też).
2. **Nawigacja i stopka pochodzą z `js/site.js`** — nie wpisuj ich do HTML. Strona ma
   tylko `<div data-nav></div>` i `<div data-footer></div>`. Zmiana menu, telefonu,
   adresu czy linków stopki = edycja `NAV` / `KONTAKT` / `STOPKA_*` w `site.js`.
3. **Płaszczyzny naprzemiennie** — biel → len → piasek, nigdy dwa te same tła pod rząd.
   Żadnych ciemnych sekcji, granatu, zieleni ani zimnej bieli (wykluczone przez klientkę).
4. **Żaden układ sekcji nie powtarza się na jednej stronie.** Rytm robią zmiany
   kompozycji, nie ozdoby.
5. **Ton: „Ty", spokojnie i rzeczowo, bez spoufalania.** Nie wymyślaj faktów, liczb,
   lat doświadczenia, skuteczności ani opinii. Nie pada „bezpłatna porada". Czego nie
   wiadomo — `【DO UZUPEŁNIENIA】` albo `<span class="todo">`, i powiedz o tym wprost.
6. **Weryfikuj po kodzie**, nie w przeglądarce: klasy HTML ↔ `styles.css` (grep),
   bilans znaczników, spójność menu i kotwic.

## Pliki

- `index.html` — strona główna (wstęp, zakres spraw z panelem mediacji, podejście,
  o mnie + atuty, dyżury, opinie, pytania, kontakt).
- `kontakt.html` — **PLIK-WZORZEC do klonowania podstron.** Trzy sekcje: wstęp
  podstrony (biel), dane + mapa (len), formularz (piasek).
- `o-mnie.html` — podstrona „O mnie", dziewięć sekcji: nagłówek strony (piasek),
  sylwetka (biel), dlaczego sama (len), moja historia (piasek), dyżury (biel),
  mediacja (len), podejście (piasek), zakres praktyki (biel), kontakt (len) —
  czysty cykl piasek → biel → len ×3. Nie ma hero: po nagłówku strony idzie
  sekcja „portret + dwa akapity o sobie". **Sekcja „Moja historia"
  stoi na placeholderach `.todo`** — czeka na daty od klientki; bez nich do
  usunięcia w całości (wtedy „dyżury" muszą przejść z bieli na piasek).
- `rozwod-i-sprawy-rodzinne.html` — **PLIK-WZORZEC do klonowania PODSTRON USŁUGOWYCH.**
  Pierwsza podstrona obszaru spraw, jedenaście sekcji: nagłówek strony (piasek),
  otwarcie z parą przycisków i pasem trzech faktów (biel), „czy to Twoja
  sytuacja" na `.rozpoznanie` (len), zakres pomocy jako akordeon `.faq--wykaz`
  (piasek), mediacja `.panel-mediacje` + `.rozwidlenie` (len), pierwsza rozmowa
  `.kroki--trzy` (biel), podejście (piasek), o mnie (len), opinie (biel),
  pytania (len), kontakt (piasek) — cykl piasek → biel → len ×3 z domknięciem
  na piasku. Bez portretu i bez hero: hero zwinięte do otwarcia, bo nagłówek
  strony wziął H1 na siebie. Copy: `rozwod-i-sprawy-rodzinne-copy.md`.
  Pozycja siedzi w tablicy `USLUGI` w `site.js`, więc jest naraz w drop-downie
  „Usługi", w kolumnie „Sprawy" w stopce i w okruszkach.
- `baza-wiedzy.html` — archiwum wpisów, cztery sekcje: nagłówek strony (piasek),
  najnowszy wpis (biel), archiwum (len), zachęta (piasek-2). Sekcja archiwum:
  pasek `.filtr-kategorii` nad całą listą, pod nim `.siatka-8-4` — wpisy
  pogrupowane po kategoriach po lewej, `.karta-autora` (sticky) po prawej.
  Kategorie odpowiadają tablicy `USLUGI` w `site.js` i stoją w tej
  samej kolejności — po imporcie na WordPressa mapują się 1:1 na kategorie WP.
  **Wszystkie 12 pozycji czeka na treść**: daty stoją jako `.todo`, a wiersze
  prowadzą tymczasowo do `wpis-szablon.html`. Strona nie mówi o tym stanie
  odwiedzającemu — na życzenie Mikołaja nie ma nad listą żadnej noty.
- `wpis-szablon.html` — **PLIK-WZORZEC do klonowania WPISÓW.** Celowo poza menu
  i poza stopką. Cztery sekcje: nagłówek wpisu (piasek), treść + szyna ze spisem
  treści (biel), „przeczytaj też" (len), kontakt (piasek). Instrukcja, co
  podmienić przy nowym wpisie, stoi w komentarzu na górze pliku. Treść w środku
  to przykład pokazujący każdy element prozy, nie tekst zatwierdzony przez
  klientkę.
- `css/styles.css` — wspólne style (unia wszystkich sekcji, tokeny w `:root`).
- `js/site.js` — menu + stopka + menu mobilne + odsłanianie `[data-odslon]`;
  dane kontaktowe i lista pozycji menu są **tutaj**.
- `design-system.html`, `mockup.html` — dokumenty robocze v2 (anotowane). Nie są
  wzorcem dla podstron; jadą na tym samym arkuszu, więc nie psuj im klas.
- `docs/PYTANIA.md` — otwarte pytania do klientki z przyjętymi założeniami.
- `copy-strona-glowna-cupial-kowalska.md` — copy 1.0 strony głównej.
- `_analiza/` — zrzuty starej strony i referencji, materiał źródłowy.

## System wizualny (skrót — pełnia w `styles.css :root`)

- Płaszczyzny: `--biel #FDFCFA` · `--len #F3EDE3` (tło strony) · `--piasek #E9E0D0`
  (`.pas`) · `--piasek-2 #DFD4C0` (`.zacheta`) · `--krem #FAF7F1` (karty na lnie).
- Tekst: `--umbra #3A2F27`, drugorzędny `--umbra-2 #6A5E55`. Akcent `--braz #7E5E36`
  (wszystko klikalne), `--braz-jasny #B8955E` (wyłącznie dekoracja).
- Kroje: Schibsted Grotesk (nagłówki, UI) + Source Serif 4 (treść). `em` w h1/h2
  to nie kursywa, tylko kolor `--braz`.
- Kształt: `--r-karta 8px`, `--r-btn 6px`. **Zero cieni.** Ruch: jeden `--ease`, 220 ms.
- Rytm: `.kontener` 1200 px, `.sekcja` padding `clamp(4.5rem, 8vw, 7.5rem)`.
  Breakpointy: 1024 px (menu mobilne, kafle 2 kol.), 860 px (siatki → 1 kol.), 560 px.
- Etykiet `.etykieta` maksymalnie 3 na stronę.

## Słownik komponentów (klasa → co trzyma → kardynalność → tło)

**Układ i typografia**
- `.sekcja` (+ `.biel` / `.pas` / `.zacheta`) → sekcja strony → tło płaszczyzny.
- `.kontener` → maks. szerokość + padding boczny.
- `.siatka-2` / `.siatka-5-7` / `.siatka-7-5` / `.siatka-4-8` / `.siatka-8-4` → dwie
  kolumny w różnych proporcjach; wszystkie zwijają się do 1 kolumny przy 860 px.
  `.siatka-8-4` to odwrotność `.siatka-4-8`: treść po lewej, kolumna towarzysząca
  po prawej (archiwum wpisów + karta autorki).
- `.naglowek-sekcji` (+ `--rozdzielony`) → etykieta + h2 + `.lead` → 1 na sekcję.
- `.tekst` → blok akapitów, maks. 62 znaki w wierszu.
- `.etykieta`, `.link`, `.male`, `.drugorzedny`, `.liczby`, `.nowrap`, `.todo`
  → utilki.

**Bloki treści**
- `.rejestr` → lista obszarów spraw jako wiersze-linki → N → len.
- `.panel-mediacje` → domknięcie listy usług, etykieta + h3 + esej + CTA → 1 → piasek.
- `.kafle` / `.kafel` (+ `--duzy`, `--wiodace`), `.indeks` → siatki kart i indeks
  wierszowy (na stronie głównej wyparte przez `.rejestr`, komponenty żyją).
- `.bento-atuty` → jeden argument wiodący + trzy mniejsze → 1+3 → len.
- `.kroki` / `.krok` (+ `.krok__nr`) → oś kroków → **4** → biel. Wariant
  `.kroki--trzy` na trzy pola (trzyma trzy kolumny do 860 px, żeby nie zrobić
  sieroty 2 + 1) stoi na `rozwod-i-sprawy-rodzinne.html`.
- `.osczasu` → oś czasu z latami → N.
- `.faq` / `.faq__poz` + `.faq-szyna` / `.szyna-karta` → akordeon `<details>` + boczna
  szyna (sticky od 1025 px) → N → len.
- `.faq--wykaz` (+ `.faq__glowa`, `.faq__nr`, `.faq__tytul`, `.faq__zajawka`)
  → ten sam akordeon w roli ponumerowanego wykazu spraw → N → piasek. Numer
  stoi tam, gdzie `.wykaz` stawia rok. Wiersz zamknięty pokazuje nazwę
  **i zajawkę**, więc sekcja mówi coś także zwinięta. Wiersz otwarty puszcza
  opis **pełną szerokością sekcji** — decyzja Mikołaja, podtrzymana mimo
  zgłoszonego zastrzeżenia, że przy kontenerze 1200 px wiersz ma ok. 120
  znaków wobec normy 65–75. Cofnięcie = `max-width` na
  `.faq--wykaz .faq__tresc p`, nic więcej.
- `.rozpoznanie` (+ `__poz`, `__cytat`, `__odp`, `__cta`) → dwie kolumny par
  „zdanie klienta w pierwszej osobie + odpowiedź kancelarii". Cudzysłów wisi
  w marginesie (`::before`), cytat idzie szeryfem, odpowiedź zaczyna się od
  krótkiej brązowej kreski. Bez kart, bez ramek, bez hoveru — pozycje NIE są
  linkami → N → len. Cytat ma `min-height` dwóch wierszy, żeby kreski
  w sąsiednich kolumnach stały na jednej wysokości.
- `.opinia-wiodaca` / `.opinie-rzad` / `.opinia-kolumna` + `.gwiazdki` → opinie Google.
- `.mikrofakty` / `.mikrofakt` → pas trzech faktów → 3.
- `.wyimek`, `.podejscie`, `.dyzury__tresc` → wyimek i bloki eseju.
- `.akcent` (+ `--luz`) → pojedynczy akapit wyjęty z toku tekstu, panel w piasku
  (na `.pas` przechodzi w biel) → N → len / biel. To nie cytat: cytat bierze `.wyimek`.
- `.wykaz` / `.wykaz__poz` (+ `__rok`, `__tytul`, `__opis`) → suchy wykaz faktów:
  rok po lewej, fakt po prawej, linia pod pozycją → N → piasek. Od `.osczasu`
  różni się tym, że jest pionowy i bez limitu czterech pól.
- `.rozwidlenie` (+ `__rola`, `__albo`, `__nota`) → dwie wykluczające się opcje
  jako para kart ze spójnikiem między nimi → 1 → len.
- `.tekst--lead` → wariant `.tekst` w rozmiarze leadu, maks. 46 znaków w wierszu.
- `.foto` (+ proporcje), `.portret`, `.pas-foto`, `.podpis-foto` → zdjęcia i miejsca
  na zdjęcia z sesji (jeszcze nie ma zdjęć — `.portret` to placeholder).
- `.sylwetka` (+ `__foto`, `__tekst`, `__tytul`, `__zawod`, `__nazwa`, `__akapit`,
  `__akcja`) → sekcja „portret + kto to jest": portret 3:4 po lewej, po prawej H2
  w dwóch wierszach (tytuł zawodowy groteskiem, nazwisko szeryfem) i akapity
  o sobie → 1 → biel. Wszystkie `__akapit` mają ten sam krój, stopień i miarę —
  to nie jest para lead + tekst. Nie mylić z `.wstep` (hero strony głównej),
  `.naglowek-strony` (nagłówek podstrony) ani `.wizytowka` (kanały kontaktu).

**Baza wiedzy i wpisy**
- `.archiwum` / `.archiwum__grupa` (+ `__glowa`, `__licznik`) → wpisy pogrupowane
  pod nazwą kategorii z licznikiem po prawej → N → len. Grupa ma `id` (`k-…`),
  na które celują chipy.
- `.wpisy` / `.wpis-poz` (+ `__data`, `__tytul`, `__zajawka`, `__strzalka`) →
  wiersz wpisu: data po lewej, tytuł i zajawka po prawej, strzałka na końcu →
  N → len / piasek. Ten sam ruch co `.rejestr` (belka w marginesie). Od
  `.rejestr` różni się tym, że po lewej stoi **data**, a zajawka siedzi **pod**
  tytułem, nie w drugiej kolumnie.
- `.filtr-kategorii` / `__poz` (+ `__ile`) → **wybór kategorii dla całej listy**,
  zakładki z brązową kreską pod aktywną (ten sam sygnał „tu jesteś" co w menu
  i w `.okruszki__tu`) → 1 na stronę → len. Pozycje są **linkami** do grup, więc
  bez JS działają jak spis kategorii; `site.js` przechwytuje klik i chowa całe
  grupy (`.archiwum__grupa[hidden]`). Nagłówki kategorii zostają — zmienia się
  tylko to, ile ich widać. Nie używaj `.chip`: chip w tym systemie jest
  statyczną etykietą pod-usługi, nie kontrolką.
- `.karta-autora` (+ `__foto`, `__nazwa`, `__rola`, `__opis`, `__akcje`) → karta
  autorki wpisów w kolumnie obok archiwum: portret 4:5 (na `.portret`), nazwisko,
  rola, zdanie o sobie, link do „O mnie" i telefon → 1 → biel na lnie.
  Sticky od 1025 px, więc towarzyszy całej liście.
- `.wpis-wiodacy__tytul` / `__zajawka` / `__akcja` → najnowszy wpis wyjęty przed
  archiwum, na siatce `.siatka-7-5` → 1 → biel.
- `.wpis-glowa__tytul` → H1 wpisu wewnątrz `.naglowek-strony` (szeryf, mniejszy
  od `.naglowek-strony__tytul`, bo tytuł wpisu jest zdaniem). Zdanie wprowadzające
  bierze wprost `.naglowek-strony__podtytul`.
- `.wpis-meta` → data · kategoria · autor pod hairlinem, domyka nagłówek wpisu → 1.
- `.wpis-szyna` + `.spis__tytul` / `.spis__lista` → szyna wpisu: spis treści
  (numerowany, kotwice do `h2`) i karta kontaktu. Sticky od 1025 px, jak `.faq-szyna`.
- `.wpis-tresc` → proza wpisu: `h2`/`h3` z własnymi `id`, akapity, listy, `.wyimek`,
  linki stylowane bez klasy, `.akcent` jako zastrzeżenie na końcu → 1 → biel.
  Maks. 66 znaków w wierszu (`.tekst` ma 62 — to blok w sekcji, a nie cała treść).

**Kontakt**
- `.telefon-duzy` + `.telefon-podpis` → telefon jako element typograficzny → 1 na stronę.
- `.kontakt-siatka` / `.kontakt-kol` → trzy kolumny kontaktu (strona główna).
- `.uklad-kontakt` → siatka sekcji danych: h2 w wierszu 1 lewej kolumny, wizytówka
  i tekst dojazdu w wierszu 2, więc obie kolumny startują na tej samej wysokości.
- `.wizytowka` → kanały kontaktu jako osobne karty: `__kanal` (klikalny, biel),
  `__blok` (statyczny, krem), `__etykieta` + ikona, `__wartosc`, `__opis` → 3 → len.
- `.dane` → dane rejestrowe jako `<dl>` (nazwa, NIP, izba); wewnątrz `.wizytowka`
  dostaje kreskę u góry i drobniejszy `dd`.
- `.godziny` → tabela dzień → godziny → 5 wierszy. Wolna: klient zdjął godziny
  ze strony, komponent żyje już tylko w `design-system.html` i `mockup.html`.
- `.mapa` (+ `--pas`, `--osadzona`) → mapa Google w pasie na całą szerokość.
- `.formularz` (+ `__para`, `__stopka`, `__nota`) + `.pole`, `.pole__wejscie`,
  `.pole__pomoc`, `.pole__blad`, `.zgoda` → formularz „oddzwonię" → 1 → piasek.

**Nawigacja**
- `.nav__grupa` / `.nav__rozwin` / `.nav__strzalka` / `.nav__podmenu` → pozycja menu
  z listą. Desktop: panel na hover, klik i `:focus-within`. Poniżej 1024 px: akordeon
  w rozwiniętym menu mobilnym. Markup generuje `site.js`, nie pisz go ręcznie.
- `.naglowek-strony` (+ `__tytul`, `__podtytul`) → krótka sekcja otwierająca
  podstronę, ok. 300 px: okruszki, nazwa zakładki jako **H1** i jedno zdanie
  podtytułu → 1 na podstronę → **piasek** (biel zlałaby się z nawigacją).
  Tytuł i podtytuł stoją w HTML, bo są treścią danej podstrony.
- `.okruszki` (+ `__grupa`, `__tu`) → ścieżka do strony głównej wewnątrz
  `.naglowek-strony`. Markup składa `site.js` z `NAV` (także z pozycji
  drop-downu), strona ma tylko `<div data-okruszki></div>`. Bez własnego tła.
  Strona główna okruszków nie dostaje. Strona spoza menu podaje ścieżkę sama —
  `<div data-okruszki="Baza wiedzy|Tytuł wpisu"></div>`; krok o nazwie zgodnej
  z pozycją menu `site.js` sam zamienia w link, ostatni zostaje krokiem bieżącym.

**Przyciski i wejścia**
- `.btn` + `--pelny` / `--obrys` / `--maly` / `--duzy`.
- `[data-odslon]` → element odsłania się raz przy scrollu; bez JS jest po prostu
  widoczny. Podpina to `site.js`.

## Nawigacja / stopka (`js/site.js`)

- Menu: Strona główna · **Usługi (drop-down)** · O mnie · Baza wiedzy · Kontakt
  + numer telefonu jako CTA.
- Pozycja z tablicą `children` renderuje się jako drop-down (`.nav__grupa` + `.nav__rozwin`
  + `.nav__podmenu`). Lista obszarów siedzi w tablicy `USLUGI` i napędza **jednocześnie**
  drop-down i kolumnę „Sprawy" w stopce — zmieniasz w jednym miejscu.
- Pozycje z `#` to sekcje strony głównej — na podstronach `site.js` dokleja prefiks `HOME`.
  Samo `"#"` zostaje `"#"` (placeholder bez celu, nie skacze na stronę główną).
  Aktywna pozycja dostaje `aria-current="page"` przez `match:['plik.html']`; rodzic
  drop-downu dostaje `data-aktywna="tak"`, gdy aktywne jest któreś dziecko.
- `HOME = 'index.html'`, bo projekt chodzi lokalnie z pliku. **Przy imporcie na
  WordPressa zmienić na `'/'`** — to jedyna linia do ruszenia.
- Stopka: dane kancelarii + kolumny „Sprawy" i „Kancelaria". Rok w linii prawnej
  liczy się sam.

## Jak stworzyć NOWĄ podstronę (szybko)

1. Skopiuj `<head>` z `kontakt.html` (fonty + `styles.css` + `site.js` z `defer`),
   podmień `<title>` i `meta description`.
2. `<body>` zaczyna `<div data-nav></div>`, kończy `<div data-footer></div>`.
   Pierwsza sekcja w `<main>` to `.naglowek-strony pas` z `<div data-okruszki></div>`,
   H1 (nazwa zakładki) i podtytułem; okruszki same znajdą nazwę w `NAV` po `match`,
   a strona spoza menu podaje ją tak: `<div data-okruszki="Nazwa"></div>`.
   Po nagłówku (piasek) następna sekcja idzie w bieli.
3. Sekcje dobierz ze słownika: **szablon** (siada w komponent) → **rekombinacja**
   (inne klocki, zero nowego CSS) → **nowy komponent** (dopiero po zgodzie Mikołaja).
4. Pilnuj naprzemienności tła i tego, żeby żaden układ nie powtórzył się na stronie.
5. Strona ma być w menu → dopisz pozycję do `NAV` w `site.js` z `match:['nazwa.html']`.
6. Nowy CSS wyłącznie na końcu `styles.css`, we własnym bloku z nagłówkiem-komentarzem.
7. Sprawdź po kodzie: klasy ↔ `styles.css`, bilans znaczników, linki i kotwice.

## Dane realne i placeholdery

Realne (z briefu i starej strony): telefon **534 477 596**,
e-mail **kancelaria@cupial-kowalska.pl**, adres **ul. Kilińskiego 5 lok. 4, 42-202
Częstochowa** (lewa oficyna, I piętro, po prawej), godziny pracy pn-wt 8:30-17:00,
śr-czw 8:30-15:00, pt po umówieniu, ORA w Częstochowie, opinie Google (imiona autorów
jak w źródle).

Do uzupełnienia: **treść wpisów w bazie wiedzy** (12 zaproponowanych tematów
w `baza-wiedzy.html` — tytuły i zajawki do zatwierdzenia przez klientkę, teksty
i daty do napisania; wszystkie wiersze prowadzą na razie do `wpis-szablon.html`),
**NIP** (`<span class="todo">` w stopce i w `.dane`), **endpoint
formularza** (`action` w `kontakt.html`), **polityka prywatności** i **informacja RODO**
(oba `href="#"`), **link do opinii Google**, **zdjęcia z sesji** (`.portret` to na razie
placeholder), podstrony **mediacji** i **obszarów spraw** (`href="#"` w `.rejestr`
i w panelu mediacji na stronie głównej; w `.rejestr` na `o-mnie.html` wiersze
prowadzą tymczasowo do `index.html#sprawy`), a także **cała ścieżka zawodowa**
na `o-mnie.html`: pięć dat, uczelnia, izba aplikacji, numer wpisu i podstawa
uprawnień mediatora — wszystko jako `<span class="todo">`.
