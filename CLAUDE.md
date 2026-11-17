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
   **Wyjątek: podstrona usługowa** (`<main class="strona-uslugowa">`, decyzja Mikołaja
   z 14 września 2026) — tam obowiązują **pola**, nie naprzemienność: tło zmienia się
   tylko przy zmianie roli treści, sąsiednie sekcje jednego pola dzieli hairline
   (`.sekcja--ciag`), trzy powierzchnie (biel, beż = `--piasek`, espresso), a mediacja
   i stopka stoją na **espresso**. Brief klientki ciemnych sekcji nie przewidywał —
   do potwierdzenia z klientką.
4. **Żaden układ sekcji nie powtarza się na jednej stronie.** Rytm robią zmiany
   kompozycji, nie ozdoby.
5. **Ton: „Ty", spokojnie i rzeczowo, bez spoufalania.** Nie wymyślaj faktów, liczb,
   lat doświadczenia, skuteczności ani opinii. Nie pada „bezpłatna porada". Czego nie
   wiadomo — `【DO UZUPEŁNIENIA】` albo `<span class="todo">`, i powiedz o tym wprost.
6. **Weryfikuj po kodzie**, nie w przeglądarce: klasy HTML ↔ `styles.css` (grep),
   bilans znaczników, spójność menu i kotwic.

## Pliki

- `index.html` — strona główna (wstęp, zakres spraw z panelem mediacji, podejście,
  o mnie + atuty, dyżury, opinie, pytania, kontakt). Hero zostaje w pierwotnym
  układzie (tekst po lewej, portret 2:3 po prawej) — warianty z 14 września 2026
  zostały odrzucone i usunięte.
- `kontakt.html` — **PLIK-WZORZEC do klonowania podstron.** Trzy sekcje: wstęp
  podstrony (biel), dane + mapa (len), formularz (piasek). Formularz wysyła
  **tylko na WordPressie**: w HTML ma `action="#"`, a generator (`formularzWp`)
  podmienia go na `admin-post.php` i dokłada pola techniczne oraz komunikat
  po wysłaniu (`.akcent` nad formularzem). Obsługa i antyspam: `functions.php`.
- `o-mnie.html` — podstrona „O mnie", dziewięć sekcji: nagłówek strony (piasek),
  sylwetka (biel), dlaczego sama (len), moja historia (piasek), dyżury (biel),
  mediacja (len), podejście (piasek), zakres praktyki (biel), kontakt (len) —
  czysty cykl piasek → biel → len ×3. Nie ma hero: po nagłówku strony idzie
  sekcja „portret + dwa akapity o sobie". **Sekcja „Moja historia"** — daty
  poprawione 17.11.2026 według Mikołaja: studia 2007–2012 WPiA UŁ (podane
  z „chyba”), aplikacja 2014–2017 ORA Częstochowa, wpis 2017, kancelaria 2017,
  mediator 2021. Zakresy lat trzyma `.wykaz--zakresy` (kolumna roku 11 rem).
  Od 17.11.2026 bez `.todo`: numer wpisu CZE/Adw/592 (Krajowy Rejestr
  Adwokatów), przy mediatorze szkolenie CM przy NRA i lista stałych mediatorów
  SO w Częstochowie; opis „co robiła przed kancelarią" usunięty (brak źródła).
- `rozwod-i-sprawy-rodzinne.html` — **PLIK-WZORZEC do klonowania PODSTRON USŁUGOWYCH.**
  Pierwsza podstrona obszaru spraw, dziewięć sekcji w **sześciu polach** + stopka:
  POLE biel — zwarty nagłówek `.naglowek-strony--uslugi` (okruszki, H1, lead, linia
  kontaktu, linia meta); POLE beż — kafle `.rozpoznanie`; POLE biel — zakres pomocy
  `.faq--wykaz`; POLE espresso — mediacja `.panel-mediacje--ciemny` z `.rozwidlenie`
  w środku; POLE biel — pierwsza rozmowa `.kroki--trzy`; POLE beż — `.osoba`
  (portret + cytat), opinie `.opinie-rzad--ramka`, pytania `.uklad-faq`, kontakt;
  stopka na espresso. Między polami 112 px bez linii, w polu hairline + 96 px.
  `<main>` ma klasę `.strona-uslugowa` — przy klonowaniu zostaw: daje typografię
  (serif tylko H1, H2 i cytat w cudzysłowach, reszta Inter), mapowanie powierzchni,
  pola, wspólny akordeon i ciemną stopkę. Copy: `rozwod-i-sprawy-rodzinne-copy.md`.
  Pozycja siedzi w tablicy `USLUGI` w `site.js`, więc jest naraz w drop-downie
  „Usługi", w kolumnie „Sprawy" w stopce i w okruszkach.
- `sprawy-spadkowe.html` — druga podstrona usługowa, **klon 1:1**
  `rozwod-i-sprawy-rodzinne.html` na copy `spadki-copy.md`: te same pola, te same
  komponenty, zero nowego CSS. Zakres pomocy to grupa `name="spadkowe"`, dwie
  etykiety jak we wzorcu. Opłata w FAQ (100 zł z art. 49 u.k.s.c. + 5 zł za
  wpis do Rejestru Spadkowego) sprawdzona 17.11.2026, stoi też w JSON-LD
  (pytanie 16 w `docs/PYTANIA.md`). Pozycja „Sprawy spadkowe" w `USLUGI`.
- `sprawy-karne.html` — trzecia podstrona usługowa, **klon 1:1** wzorca na copy
  `sprawy-karne-copy.md`. Różnice: w linii meta tajemnica adwokacka zamiast
  mediatora, pod wykazem spraw `.wykaz-dopisek` z linkiem do (przyszłej) strony
  o jeździe po alkoholu — dziś `index.html#sprawy`, sekcja `.osoba` w wersji
  skróconej z innym cytatem. Grupa zakresu `name="karne"`. Otwarte pytania 20–23
  w `docs/PYTANIA.md`. Pozycja „Sprawy karne" w `USLUGI`.
- `sprawy-cywilne.html` — czwarta podstrona usługowa, **klon 1:1** wzorca na copy
  `sprawy-cywilne-copy.md`, zero nowego CSS. Sekcja `.osoba` w wersji skróconej
  (jeden akapit, cytat o statusie majątkowym). Grupa zakresu `name="cywilne"`.
  Otwarte pytania 24–27 w `docs/PYTANIA.md`. Pozycja „Sprawy cywilne" w `USLUGI`.
- `jazda-po-alkoholu.html` — **najważniejsza zakładka kancelarii**, podstrona usługowa
  rozszerzona o cztery moduły własne (`.os-dni`, `.progi`, `.mozliwosci`,
  `.dyskrecja`), dwanaście sekcji, bez bloku mediacji. Pola: biel (nagłówek) · beż
  (oś czasu + karty) · biel (tabela + zakres) · espresso (możliwości) · biel
  (dyskrecja + rozmowa) · beż (podejście, opinie, FAQ na 12 pytań, kontakt).
  Trzy etykiety: oś, tabela, możliwości. **Tabela progów stoi w kodzie dwa razy**
  (tabela + karty na telefon) — zmieniaj oba miejsca i FAQ naraz. Copy poprawione
  merytorycznie (warunkowe umorzenie JEST wpisywane do KRK, czasowo), pytania 28–31
  w `docs/PYTANIA.md`. Pozycja „Jazda po alkoholu" w `USLUGI`.
- `mediacje.html` — **zakładka niezależna**, nie podstrona usługowa (copy
  `mediacje-copy.md`), dziesięć sekcji, **bez „Podejścia" i bez opinii** (bezstronność
  mediatora). `<main class="strona-uslugowa strona-mediacje">`. Moduły własne:
  `.dwie-drogi`, `.plan`, `.ugoda`, `.druga-strona`; reszta z komponentów: nagłówek
  `--uslugi`, `.wykaz` (sprawy), bazowe `.kroki` (cztery kroki), `.rozwidlenie` +
  `.dyzury__tresc` (rola), `.uklad-faq`, kontakt. Pola: biel · beż (dwie drogi) ·
  biel (zakres, plan, przebieg) · espresso (ugoda) · beż (rola, druga strona) · biel
  (FAQ, kontakt). **Kotwica `#dla-drugiej-strony` na karcie** — link wysyłany drugiej
  stronie sporu. W `USLUGI` z `oddzielona: true` (hairline w drop-downie i odstęp
  w stopce). Pytania 32–36 w `docs/PYTANIA.md`.
- `baza-wiedzy.html` — archiwum wpisów, cztery sekcje: nagłówek strony (piasek),
  najnowszy wpis (biel), archiwum (len), zachęta (piasek-2). Sekcja archiwum:
  pasek `.filtr-kategorii` nad całą listą, pod nim `.siatka-8-4` — wpisy
  pogrupowane po kategoriach po lewej, `.karta-autora` (sticky) po prawej.
  Kategorie odpowiadają tablicy `USLUGI` w `site.js` i stoją w tej
  samej kolejności. **Od 17.11.2026 lista składa się z wpisów WordPressa**
  (zob. „Baza wiedzy na wpisach WP" w sekcji WordPress): sekcje „Najnowszy
  wpis", pasek kategorii i grupy archiwum stoją w HTML między znacznikami
  `<!-- WP-PETLA:… -->` i na WP zastępuje je `inc/blog.php`. 12 wierszy
  w HTML to już tylko podgląd projektu (proponowane tematy, nie wpisy).
  Bez wpisów na WP: archiwum pokazuje „Pierwsze wpisy są w przygotowaniu.",
  sekcja „Najnowszy wpis" i pasek znikają.
  **Od 27.10.2026 schowana z menu i stopki** (zakomentowane pozycje w `site.js`,
  `BLOG_UKRYTY` w generatorze), dopóki nie ma prawdziwych wpisów. Okruszki
  podaje sama (`data-okruszki="Baza wiedzy"`).
- `wpis-szablon.html` — **źródło widoku wpisu WP (`single.php`)**, nie plik do
  klonowania i nie strona WP. Celowo poza menu i poza stopką. Cztery sekcje:
  nagłówek wpisu (piasek), treść + szyna ze spisem treści (biel), „przeczytaj
  też" (len), kontakt (piasek). Fragmenty zależne od wpisu stoją między
  znacznikami `WP-PETLA`; karta z telefonem, zastrzeżenie `.akcent` i sekcja
  kontaktu są wspólne dla wszystkich wpisów (teksty ogólne, bez „rozwodu").
  Treść między znacznikami to przykład każdego elementu prozy, nie tekst
  zatwierdzony przez klientkę.
- `tools/wp/blog.php` — PHP Bazy wiedzy na WP (pętle `cupial_petla_*`, spis
  treści z H2, „przeczytaj też", noindex/mapa/RSS przy ukrytym blogu,
  przekierowania archiwów, wyłączone komentarze). Generator kopiuje go do
  motywu jako `inc/blog.php`.
- `polityka-prywatnosci.html` — **PROJEKT do akceptacji klientki** (27.10.2026),
  poza menu: link w stopce i przy zgodzie w formularzu (`#formularz`). Dwie
  sekcje: nagłówek strony (piasek) + proza `.wpis-tresc` bez szyny (biel).
  Opisuje tylko to, co strona faktycznie robi (formularz, logi Apache 14 dni,
  mapa Google na stronie głównej i Kontakcie — od 12.11.2026 dopiero po zgodzie
  z okienka cookies, wybór w localStorage na 12 miesięcy; brak cookies strony;
  fonty z własnego serwera)
  — **zmiana przepływu danych = aktualizacja tego tekstu**. Od 17.11.2026 bez
  `.todo`: zgłoszenia 12 miesięcy (założenie), hosting = WR SYSTEMS Estera
  Lipska (VPS) i PPHU DESIRE Damian Lipski (poczta, DNS), oboje Ogorzelnik 57,
  obowiązuje od 17.11.2026. **Umowy powierzenia nie ma** (regulamin DESIRE jej
  nie zawiera) — do podpisania przez klientkę, pytanie 39.
  W WP to strona ID 3, wskazana w Ustawienia → Prywatność.
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
- Kroje: Schibsted Grotesk (nagłówki, UI) + Source Serif 4 (treść), na podstronach
  usługowych także Inter. **Fonty z własnego serwera** (od 12.11.2026): pliki
  `assets/fonty/*.woff2` i blok `@font-face` na końcu `styles.css` — te same pliki
  i deklaracje, które Google Fonts podaje Chrome'owi na Windows. **Nie linkuj
  fonts.googleapis.com** (polityka prywatności mówi, że strona nie łączy się
  z Google po fonty). `em` w h1/h2
  to nie kursywa, tylko kolor `--braz`. **Podstrona usługowa ma regułę odwrotną**
  (Mikołaj, 14 września 2026, reguła nadrzędna): Source Serif 4 **wyłącznie dla H1,
  H2 i cytatów w cudzysłowach**, **Inter** dla wszystkiego innego (nagłówki wierszy,
  treść, etykiety, przyciski, podpisy, numeracja). `.strona-uslugowa` robi to,
  podmieniając w swoim zasięgu `--font-display` / `--font-ui` / `--font-body` na
  Inter, a H1/H2 dostają `--font-serif`. Błąd, który wystąpił dwa razy: H2
  bezszeryfowy przy szeryfowej treści. W tym zasięgu jest też jeden akcent na
  jasnym tle (`--braz` → `#6B4A2F`), a na espresso akcentem jest `--braz-jasny`.
  Na pozostałych stronach H1 podstron (`.naglowek-strony__tytul`,
  `.wpis-glowa__tytul`) jedzie bazowym groteskiem.
- Kształt: `--r-karta 8px`, `--r-btn 6px`. **Zero cieni.** Ruch: jeden `--ease`, 220 ms.
- Rytm: `.kontener` 1200 px, `.sekcja` padding `clamp(4.5rem, 8vw, 7.5rem)`.
  Breakpointy: 1024 px (menu mobilne, kafle 2 kol.), 860 px (siatki → 1 kol.), 560 px.
- Etykiet `.etykieta` maksymalnie 3 na stronę.

## Słownik komponentów (klasa → co trzyma → kardynalność → tło)

**Układ i typografia**
- `.sekcja` (+ `.biel` / `.pas` / `.zacheta` / `.espresso`) → sekcja strony → tło
  płaszczyzny. `.espresso` (tekst `--biel-85`) i `.sekcja--ciag` (sekcja w tym samym
  polu co poprzednia: hairline na szerokość kontenera, 96 px nad i pod) żyją
  na podstronie usługowej.
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
  szyna (sticky od 1025 px) → N → len. Na podstronie usługowej akordeon ma wspólną
  mechanikę z `.strona-uslugowa`: hairline na górze wiersza, min. 64 px, tytuł
  Inter 600 17 px, **jeden glif** — Lucide plus 16 px obracany o 45° (nigdy osobny ×).
- `.uklad-faq` (+ `__szyna`, `__tytul`, `__karta`, `__telefon`, `__lista`) → pytania:
  320 px / 1fr, gap 72 px, lewa kolumna sticky (H2 + ramka z telefonem, nic więcej),
  prawa — akordeon `name="pytania"`. `top` liczony od menu (`--nav-h` + 32 px), bo
  menu jest sticky. Poniżej 860 px szyna `display: contents`: H2 nad akordeonem,
  ramka pod nim → 1 → beż.
- `.faq--wykaz` (+ `.faq__glowa`, `.faq__nr`, `.faq__tytul`, `.faq__zajawka`)
  → ten sam akordeon w roli ponumerowanego wykazu spraw → N → biel. Numer
  w tym samym rzędzie flex co tytuł (28 px + gap 16 px, linia bazowa, Inter 400
  13 px, `#6B4A2F`), treść wcięta o 44 px, maks. 62ch. Wiersz zamknięty pokazuje
  nazwę **i zajawkę** (Inter 400 15 px). Pozycje są **grupą wyłączną**
  (`<details name="rodzinne">`) — otwarta jest zawsze dokładnie jedna, bez JS-u.
  Każda pozycja: jeden akapit, trzy zdania.
- `.rozpoznanie` (+ `__poz`, `__cytat`, `__odp`, `__cta`, `__cta-tekst`,
  `__cta-tytul`, `__cta-opis`, `__przycisk`) → **kafle** „zdanie klienta
  + odpowiedź" (przebudowa 14 września 2026): 2 kolumny, gap 20 px, karta
  w `--krem`, ramka `rgba(46,38,32,.08)`, radius 4 px, bez cieni. Wypowiedź
  Interem 600 w cudzysłowach drukarskich „ ” (w HTML), hairline, odpowiedź
  Interem 400 15 px — **maks. 2 wiersze, pisane pod miarę, nie przycinane**.
  Hover: cieplejsze tło i mocniejsza ramka, 150 ms, bez podnoszenia. Siódma
  pozycja `__cta` na pełną szerokość z ramką `#6B4A2F` i przyciskiem
  `__przycisk` (tel.). Bez ikon, bez numeracji, bez `data-odslon` → 6+1 → len.
  Karta to `subgrid` na dwa wiersze, więc hairline'y w rzędzie stoją równo.
  Nagłówek sekcji: `.naglowek-sekcji--sytuacje` (etykieta i lead Interem,
  H2 40 px, odstęp do siatki 64 px).
- `.opinia-wiodaca` / `.opinie-rzad` / `.opinia-kolumna` + `.gwiazdki` → opinie Google.
  Wariant `.opinie-rzad--ramka` (+ `.opinia-kolumna__zrodlo`, `.opinie-wszystkie`)
  → jedna ramka w bieli z pionowymi hairline'ami, kolumn tyle, ile opinii
  (`grid-auto-flow: column`, nigdy pusta kolumna), cytat Inter 15 px **maks. 240
  znaków skracanych w treści**, link do Google wyśrodkowany pod ramką → 1 → beż.
- `.mikrofakty` / `.mikrofakt` → pas trzech faktów → 3.
- `.wyimek`, `.podejscie`, `.dyzury__tresc` → wyimek i bloki eseju.
- `.akcent` (+ `--luz`) → pojedynczy akapit wyjęty z toku tekstu, panel w piasku
  (na `.pas` przechodzi w biel) → N → len / biel. To nie cytat: cytat bierze `.wyimek`.
- `.wykaz` / `.wykaz__poz` (+ `__rok`, `__tytul`, `__opis`) → suchy wykaz faktów:
  rok po lewej, fakt po prawej, linia pod pozycją → N → piasek. Od `.osczasu`
  różni się tym, że jest pionowy i bez limitu czterech pól. Modyfikator
  `--zakresy` (od 561 px kolumna roku 11 rem zamiast 8,5, rok bez łamania)
  — dla zakresów typu „2014–2017"; stoi na `o-mnie.html`.
- `.os-dni` (+ `__krok`, `--termin`, `__nr`, `__tytul`, `__opis`, `__termin`, `__final`,
  `__zdanie`) → oś czasu: pionowa szyna z numerowanymi węzłami (32 px), tytuł kroku
  po lewej (17 rem), opis po prawej; krok z terminem ma wypełniony węzeł i znacznik
  tekstowy. Szyna kończy się pełną kropką przy zdaniu i przycisku `.btn--akcent`.
  Poniżej 860 px opis schodzi pod tytuł. Kolor węzła = kolor pola (`--os-tlo`) →
  1 → beż. Od `.kroki` różni się kierunkiem (pion) i gęstością.
- `.progi` (+ `__tabela`, `__kol--lzej/--ciezej`, `__wiersz--kwalifikacja`, `__karty`,
  `__karta--lzej/--ciezej`, `__lista`, `__dopisek`) → tabela porównawcza dwóch stanów:
  hairline'y, nagłówki kolumn Inter 600 13 px z górnym paskiem (cięższa kolumna
  w akcencie), wiersze min. 52 px. Poniżej 861 px tabela znika, a ta sama treść
  stoi jako dwie karty `<dl>` → 1 → biel. **Treść w dwóch miejscach.**
- `.mozliwosci` (+ `__tekst`, `__akapit`, `--pierwszy`, `__ramka`, `__uczciwie`) →
  blok na espresso: tekst 7/12, ramka ze zdaniem i `.btn--jasny` 5/12 wyrównana do
  dołu, krótki pasek `--braz-jasny` na krawędzi ramki → 1 → espresso.
- `.dyskrecja` (+ `__pierwszy`, `__drugi`) → jedyny wyśrodkowany blok: H2, krótka
  kreska w akcencie, większy i spokojniejszy akapit, miara 42 rem → 1 → biel.
- `.btn--akcent` → wypełniony przycisk `#6B4A2F` (Inter 600 16 px, 14/28 px, radius 4),
  ten sam wygląd co `.rozpoznanie__przycisk`. `.wizualnie-ukryte` → tekst tylko dla
  czytników ekranu (np. `<caption>`). `.naglowek-sekcji--modul` → alias
  `.naglowek-sekcji--sytuacje` dla nagłówków nowych modułów.
- `.dwie-drogi` (+ `__droga`, `__glowa`, `__ikona`, `__tytul`, `__lista`, `__wniosek`,
  `__zamkniecie`) → wybór ścieżki: jeden panel w bieli na dwie równorzędne kolumny
  (ikona Lucide w obrysie, lista warunków z kropką, wniosek), pod panelem zdanie
  z kreską w akcencie → 1 → beż.
- `.plan` (+ `__tekst`, `__nota`, `__arkusz`, `__glowa`, `__lista`, `__haczyk`) →
  tekst 5/12 + arkusz dokumentu w beżu 7/12 (ikona pliku, pozycje z haczykiem) →
  1 → biel.
- `.ugoda` (+ `__glowa`, `__wstep`, `__punkty`, `__punkt`, `__tytul`, `__zamkniecie`) →
  na espresso: H2 + akapit w dwóch kolumnach, trzy punkty z paskiem `--braz-jasny`,
  zdanie zamykające → 1 → espresso.
- `.druga-strona` (+ `__tekst`, `__wstep`, `__zasady`, `__nr`, `__stopka`) → karta
  w bieli z górnym paskiem 3 px w akcencie, `scroll-margin-top` pod menu, zasady 2 × 2
  z numerem w kółku, stopka: zdanie + `.btn--akcent` → 1 → beż. Nosi kotwicę.
- `li.oddzielona` (z `oddzielona: true` w `USLUGI`) → pozycja drop-downu i stopki
  oddzielona od reszty; dziś tylko Mediacje.
- `.wykaz-dopisek` → jedno zdanie z `.link` pod `.faq--wykaz`, wcięte o 44 px do
  krawędzi tytułów; odsyła do osobnej podstrony, żeby dwie strony nie konkurowały
  o te same frazy → 0–1 → biel. Stoi na `sprawy-karne.html`.
- `.rozwidlenie` (+ `__rola`, `__albo`, `__nota`) → dwie wykluczające się opcje
  jako para kart ze spójnikiem między nimi → 1 → len.
- `.panel-mediacje--ciemny` (+ `.btn--jasny`) → mediacja na espresso: panel bez
  tła, etykieta i akcenty w `--braz-jasny`, treść w `--biel-85`, `.rozwidlenie`
  jako trzeci wiersz siatki panelu (pola z ramką `--biel-linia`, gap 0, „albo"
  między nimi), nota wyśrodkowana w `--biel-70` → 1 → espresso.
- `.tekst--lead` → wariant `.tekst` w rozmiarze leadu, maks. 46 znaków w wierszu.
- `.foto` (+ proporcje), `.portret`, `.pas-foto`, `.podpis-foto` → zdjęcia i miejsca
  na zdjęcia. `.portret` bez modyfikatora to placeholder (faktura + sygnet);
  `.portret.portret--zdjecie` z `<img>` w środku to portret klientki
  (`assets/beata-cupial-kowalska.jpg` 1024 px + `-600.jpg` w `srcset`, ramka 2:3 jak
  zdjęcie, więc nic nie jest ucięte; obróbka jak `.foto`). Stoi we wszystkich 9 miejscach na portret.
- `.sylwetka` (+ `__foto`, `__tekst`, `__tytul`, `__zawod`, `__nazwa`, `__akapit`,
  `__akcja`) → sekcja „portret + kto to jest": portret 3:4 po lewej, po prawej H2
  w dwóch wierszach (tytuł zawodowy groteskiem, nazwisko szeryfem) i akapity
  o sobie → 1 → biel. Wszystkie `__akapit` mają ten sam krój, stopień i miarę —
  to nie jest para lead + tekst. Nie mylić z `.wstep` (hero strony głównej),
  `.naglowek-strony` (nagłówek podstrony) ani `.wizytowka` (kanały kontaktu).
- `.osoba` (+ `__tekst`, `__akapit`, `__wiecej`, `__foto`, `__cytat`, `__slowa`,
  `__podpis`) → odwrotność `.sylwetka` z cytatem: H2 i akapity po lewej (7/5),
  portret 4:5 po prawej, a cytat klientki jako biała plansza leży na dolnej
  krawędzi zdjęcia i wchodzi w szczelinę między kolumnami; podpis z krótką
  kreską `--braz-jasny` → 1 → piasek. Poniżej 860 px tekst nad portretem.
  Stoi na `rozwod-i-sprawy-rodzinne.html` (#o-mnie) i zastępuje tam dawne
  „Podejście" + „Kto poprowadzi Twoją sprawę".

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
- `.wpis-glowa__tytul` → H1 wpisu wewnątrz `.naglowek-strony` (grotesk, mniejszy
  od `.naglowek-strony__tytul`, bo tytuł wpisu jest zdaniem). Zdanie wprowadzające
  bierze wprost `.naglowek-strony__podtytul`.
- `.wpis-meta` → data · kategoria · autor pod hairlinem, domyka nagłówek wpisu → 1.
- `.wpis-szyna` + `.spis__tytul` / `.spis__lista` → szyna wpisu: spis treści
  (numerowany, kotwice do `h2`) i karta kontaktu. Sticky od 1025 px, jak `.faq-szyna`.
- `.wpis-tresc` → proza wpisu: `h2`/`h3` z własnymi `id`, akapity, listy, `.wyimek`,
  linki stylowane bez klasy, `.akcent` jako zastrzeżenie na końcu → 1 → biel.
  Maks. 66 znaków w wierszu (`.tekst` ma 62 — to blok w sekcji, a nie cała treść).
  Od 17.11.2026 trzyma też markup edytora WP: `blockquote` (+ `cite`) wygląda
  jak `.wyimek`, `figure`/`figcaption` jak zdjęcie z `.podpis-foto`, `ul` ma
  punktory (globalny reset `ul { list-style: none }` je zdejmował). H2 dostają
  `id` same (`inc/blog.php`), autorka niczego nie wpisuje ręcznie.

**Kontakt**
- `.telefon-duzy` + `.telefon-podpis` → telefon jako element typograficzny → 1 na stronę.
- `.kontakt-siatka` / `.kontakt-kol` → trzy kolumny kontaktu (strona główna).
  Nagłówki kolumn to **`h3`** (po H2 sekcji — kolejność nagłówków dla czytników
  i Lighthouse); styl ten sam co dawne `h4`, które zostały w dokumentach roboczych.
  Tak samo nagłówki kolumn stopki (`site.js`).
- `.uklad-kontakt` → siatka sekcji danych: h2 w wierszu 1 lewej kolumny, wizytówka
  i tekst dojazdu w wierszu 2, więc obie kolumny startują na tej samej wysokości.
- `.wizytowka` → kanały kontaktu jako osobne karty: `__kanal` (klikalny, biel),
  `__blok` (statyczny, krem), `__etykieta` + ikona, `__wartosc`, `__opis` → 3 → len.
- `.dane` → dane rejestrowe jako `<dl>` (nazwa, NIP, izba); wewnątrz `.wizytowka`
  dostaje kreskę u góry i drobniejszy `dd`.
- `.godziny` → tabela dzień → godziny → 5 wierszy. Wolna: klient zdjął godziny
  ze strony, komponent żyje już tylko w `design-system.html` i `mockup.html`.
- `.mapa` (+ `--pas`, `--osadzona`) → mapa Google w pasie na całą szerokość.
  **Od 12.11.2026 tylko po zgodzie na cookies:** `<iframe>` ma w HTML `data-src`
  zamiast `src` i atrybut `hidden`; adres podstawia `site.js` (`zgodaCookies`).
  Bez zgody w ramce stoi `.mapa__zgoda` (tytuł, zdanie, „Pokaż mapę" = zgoda,
  link „Otwórz w Google Maps"). Nowa mapa = ten sam wzór, nigdy gołe `src`.
- `.zgoda-cookies` (+ `__tytul`, `__tekst`, `__akcje`) → okienko zgody na dole
  ekranu, składa je `site.js`, pierwsze w `<body>`; biała karta z ramką i paskiem
  `--braz` u góry, bez cieni; „Zgadzam się" / „Nie zgadzam się" w tym samym stylu
  (`.btn--obrys`), z-index pod menu. Wybór w `localStorage`
  (`cupial-zgoda-cookies`, 12 miesięcy). `.stopka__cookies` → przycisk
  „Ustawienia cookies" w linii prawnej stopki (otwiera okienko ponownie).
  **Zmiana przepływu = zmiana polityki prywatności** (`#cookies`, `#google`).
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
  Wariant `--uslugi` (podstrona usługowa, **tło `.biel`** — wyjątek od piasku
  z decyzji Mikołaja z 14 września 2026; od nawigacji odcina go tylko jej dolny
  hairline; padding 48/44 px): okruszki Interem
  13 px → H1 36 px w `--espresso`, bez akcentu i bez kropki → `__lead` (Inter,
  48ch) → `__kontakt` = `__telefon` (ikona + numer, Inter 600 18 px, `#6B4A2F`)
  + `__spotkania` w jednym wierszu → `__meta` pod hairlinem (Inter 14 px,
  separator `·` w akcencie). **Bez** wypełnionego przycisku, `.mikrofakty`,
  etykiety nad H1 i portretu; bez `min-height` i bez `data-odslon`.
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

- Menu: Strona główna · **Usługi (drop-down)** · O mnie · Kontakt
  + numer telefonu jako CTA. „Baza wiedzy" schowana do czasu wpisów (27.10.2026).
- Logo (menu i stopka) to jeden złoty PNG z przezroczystym tłem:
  `assets/logo-cupial-kowalska.png` (sygnet + nazwisko + „Adwokat", 1910 px —
  plik źródłowy). Na stronę idzie `-955.png`: połowa oryginału uśredniana 2×2
  (pierwszy poziom mipmapy), PNG 8-bit jeden kolor + alfa, 12 KB zamiast 38 KB,
  obraz zgodny z oryginałem przy DPR 1–3 (zrzuty 12.11.2026). Nowe logo = podmień
  oryginał i wygeneruj -955 tak samo. `.marka__logo` ma `aspect-ratio: 1910 / 431`.
  Składa je `marka()` jako `img.marka__logo` — 48 px wysokości w menu, 56 px w stopce.
  Nazwę czyta `aria-label` linku. Nie odrysowuj sygnetu w SVG ani tekstem.
- Pozycja z tablicą `children` renderuje się jako drop-down (`.nav__grupa` + `.nav__rozwin`
  + `.nav__podmenu`). Lista obszarów siedzi w tablicy `USLUGI` i napędza **jednocześnie**
  drop-down i kolumnę „Sprawy" w stopce — zmieniasz w jednym miejscu.
- Pozycje z `#` to sekcje strony głównej — na podstronach `site.js` dokleja prefiks `HOME`.
  Samo `"#"` zostaje `"#"` (placeholder bez celu, nie skacze na stronę główną).
  Aktywna pozycja dostaje `aria-current="page"` przez `match:['plik.html']`; rodzic
  drop-downu dostaje `data-aktywna="tak"`, gdy aktywne jest któreś dziecko.
- `site.js` ma **dwa tryby w jednym pliku**. Wersja plikowa: `HOME = 'index.html'`,
  linki to nazwy plików. WordPress: `<script>` ma `data-home` (dokłada go
  generator motywu) — wtedy `x.html` → `HOME + 'x/'`, bieżąca strona liczy się
  z adresu WP (więc `match` z nazwami plików działa bez zmian), logo idzie
  z katalogu motywu. Niczego nie przełączasz ręcznie.
- Stopka: dane kancelarii + kolumny „Sprawy" i „Kancelaria". Rok w linii prawnej
  liczy się sam, obok przycisk „Ustawienia cookies". `site.js` składa też okienko
  zgody na cookies i podpina mapy Google na zgodę (zob. `.zgoda-cookies`). Za `<main class="strona-uslugowa">` stopka stoi na espresso
  (selektor `.strona-uslugowa ~ .stopka`), na pozostałych stronach zostaje jasna.

## Jak stworzyć NOWĄ podstronę (szybko)

1. Skopiuj `<head>` z `kontakt.html` (ikony `assets/favicon*` + `styles.css`
   + `site.js` z `defer`; fontów nie linkujesz — są w `styles.css`), podmień
   `<title>` i `meta description`.
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

## WordPress (lokalnie: Local, `cupial.local`)

- Strona stoi na WP jako **klasyczny motyw `cupial-kowalska`** generowany z tych
  plików HTML: `node tools/build-wp-theme.mjs` → pisze wprost do
  `C:/Users/mikol/Local Sites/cupial/app/public/wp-content/themes/cupial-kowalska`
  (inny cel: argument albo `WP_THEME_DIR`). **Motywu nie edytuj** — zmiana HTML,
  `styles.css` albo `site.js` = przebudowa motywu, nic więcej.
- Każda strona z `STRONY` w generatorze = szablon `szablony/{slug}.php` i strona
  WP o tym slugu (strona główna: slug `strona-glowna`, ustawiona jako front page).
  **Nowa podstrona** = wpis w `STRONY` + przebudowa + strona w WP z tym szablonem.
- Generator: linki `x.html` → `home_url('/x/')`, `assets/ css/ js/` → katalog
  motywu (CSS i JS z `?v=` hasha treści; do motywu idą **zminifikowane** przez
  `minifikujCss` / `minifikujJs` — źródło w `css/` i `js/` zostaje czytelne,
  computed style wszystkich elementów 1:1 sprawdzony 12.11.2026), `wp_head()`/`wp_footer()`, a teksty
  i obrazy w `<main>` owija w `cmk_block`/`cmk_img` (edycja przez wtyczkę
  **CMS-Mikołaj Kubiak**, kit w `cms-mikolaj-kubiak-kit/`, manifest kluczy
  `inc/cmk-keys.php`). Kontroluje, że owijanie nie zmienia ani bajta treści.
- Render gościa = HTML 1:1 z plikiem (WP dokłada tylko canonical i robots),
  zrzuty desktop 1440 / mobile 390 zgodne piksel w piksel (21 września 2026).
- Menu i stopka **nie są edytowalne w CMK** (składa je `site.js`); JSON-LD pod
  `<main>` też nie idzie za poprawkami z edytora. Klucz CMK = hash tekstu:
  zmiana tekstu w HTML odpina poprawkę klientki w tym miejscu.
- **SEO przeniesienia ze starej strony** (Laravel, 4 adresy) — w generatorze:
  `STARE_ADRESY` (301 `/about` → `/o-mnie/`, `/contact` → `/kontakt/`,
  `/services` → `/` + stare obrazki), flaga `noindex` w `STRONY` (dziś
  `/baza-wiedzy/`, sterowana `BLOG_UKRYTY`: noindex i poza mapą witryny), mapa `/wp-sitemap.xml` bez
  użytkowników i taksonomii, 404 z noindex, ikona witryny w WP (opcja `site_icon`).
- **Baza wiedzy na wpisach WP (od 17.11.2026).** Wpis = Wpisy → Dodaj nowy
  (konto klientki — redaktor — może pisać i publikować). Adres
  `/baza-wiedzy/<slug>/` (`permalink_structure` = `/baza-wiedzy/%postname%/`,
  strony bez zmian). Archiwum to dalej strona WP `baza-wiedzy` z szablonem
  i CMK na stałych tekstach; widok wpisu `single.php` z `wpis-szablon.html`,
  **bez CMK** (treść z edytora WP). Pole „Zajawka" = zdanie pod H1 i opis
  w Google; puste → zajawka na liście robi się sama (30 słów + „…").
  Spis treści sam z H2 (od dwóch), zastrzeżenie dokłada szablon. Kategorie WP
  (slug = podstrona usługi): `rozwod-i-sprawy-rodzinne`, `sprawy-spadkowe`,
  `jazda-po-alkoholu`, `sprawy-karne`, `sprawy-cywilne`, `mediacje` + domyślna
  `pozostale` (dawne Uncategorized, grupa na końcu). Kategoria/tag/data →
  301 do archiwum (`#k-<slug>`), komentarze i pingbacki wyłączone.
  **`BLOG_UKRYTY = true`** w generatorze: archiwum i wpisy noindex, wpisy
  poza mapą witryny, RSS → strona główna. **Odsłonięcie** = `false` +
  odkomentowane „Baza wiedzy" w `NAV` i `STOPKA_KANCELARIA` (`site.js`) +
  `node tools/wdroz-motyw.mjs`. Strona WP `wpis-szablon` (ID 17) w koszu.
  Sprawdzone na produkcji dwoma wpisami próbnymi (usunięte).
  Docelowy adres `https://www.cupial-kowalska.pl/`. Analiza, `.htaccess` na
  produkcję i lista kroków na dzień publikacji (**uwaga na pocztę przy DNS**):
  `docs/SEO-MIGRACJA.md`.
- `404.php` i `index.php` składa generator z `.naglowek-strony` — **tekst 404
  nie pochodzi od klientki**, do przejrzenia.
- WP-CLI dla tej instalacji: PHP z `%APPDATA%/Local/lightning-services/php-8.2.29+0`,
  `-c %APPDATA%/Local/run/0JX071YGQ/conf/php/php.ini` (baza na porcie 10090),
  phar z `C:/Program Files (x86)/Local/resources/extraResources/bin/wp-cli/`.

## Produkcja (VPS, od 27.10.2026)

- Strona stoi na VPS-ie `cupial-kowalska-2` (176.112.77.211), WordPress
  w `/var/www/cupial-kowalska`, SSH aliasami `cupial-vps` / `cupial-vps-root`
  (`~/.ssh/config`, klucz). **Treść żyje tam** (poprawki CMK klientki), Local
  jest już tylko warsztatem — bazy z Local na serwer nie wgrywamy ponownie.
- **Zmiana HTML / `styles.css` / `site.js` = `node tools/wdroz-motyw.mjs`**:
  build do katalogu tymczasowego, `php -l` na serwerze, podmiana katalogu
  motywu; poprzedni zostaje w `/root/motyw-poprzedni`. Baza nie jest ruszana.
  Nowa podstrona = jeszcze strona WP z szablonem (`sudo -u www-data wp …`).
- **Poczta strony** (menu w panelu WP, uprawnienie `edit_pages`): adres i hasło
  skrzynki kancelarii wpisuje klientka, hasło leży w bazie zaszyfrowane solą
  AUTH z `wp-config.php`. SMTP `serwer.hosting-desire.pl:465` (na tę nazwę jest
  certyfikat, nie na `mail.cupial-kowalska.pl`). Bez ustawień WP wysyła przez
  Postfix na serwerze — maile mogą trafiać do spamu.
- Konta WP: `mikolaj` (administrator), `beata.cupial-kowalska` (redaktor — CMK
  wymaga tylko `edit_pages`). `admin` z Local do usunięcia, gdy Mikołaj zaloguje
  się swoim kontem.
- **Opublikowana 12.11.2026**: DNS (`@` i `www`) wskazuje VPS, vhost wpuszcza
  wszystkich, HTTPS ma certyfikat Let's Encrypt dla obu nazw (odnawia
  `certbot.timer`). Poczta (MX → `mail` u hosting-desire) bez zmian.
- **Wydajność na serwerze (12.11.2026):** HTTP/2 (`a2enmod http2`), brotli przed
  gzipem (`mods-available/brotli.conf`, jakość 9 — 11 za wolna), w vhoście 443
  `Cache-Control`: CSS/JS/woff2 motywu rok + `immutable` (CSS i JS mają `?v=`),
  obrazy motywu i `uploads` 30 dni. Obrazy motywu **nie mają wersji w adresie** —
  podmiana pliku pod tą samą nazwą dotrze do części odwiedzających dopiero po
  30 dniach, więc nowy obraz = nowa nazwa pliku. Kopie vhosta sprzed zmian:
  `/root/kopie-konfiguracji/2026-11-12/`.
- Kopie zapasowe strony: codziennie 3:30, 14 dni, `/var/backups/cupial`. Stan
  serwera i decyzje: `docs/SEO-MIGRACJA.md`.

## Dane realne i placeholdery

Realne (z briefu i starej strony): telefon **534 477 596**,
e-mail **kancelaria@cupial-kowalska.pl**, adres **ul. Kilińskiego 5 lok. 4, 42-202
Częstochowa** (lewa oficyna, I piętro, po prawej), godziny pracy pn-wt 8:30-17:00,
śr-czw 8:30-15:00, pt po umówieniu, ORA w Częstochowie, opinie Google (imiona autorów
jak w źródle).

Do uzupełnienia: **wpisy w Bazie wiedzy** (wpisy WP; 12 proponowanych tematów
z tytułami i zajawkami stoi jako podgląd w `baza-wiedzy.html` — do zatwierdzenia
przez klientkę i napisania),
**hasło skrzynki do wysyłki formularza** (klientka, menu „Poczta strony" w WP),
**akceptacja polityki prywatności** i **umowa powierzenia** z dostawcami hostingu
(pytanie 39), **zdjęcia z sesji** (portret klientki już jest, jeden
na całą stronę — brakuje kadru „przy biurku" do sekcji o mnie na stronie głównej,
gdzie dziś stoi ten sam portret co w hero), decyzje klientki z komentarzy
`【DO UZUPEŁNIENIA】` w kodzie (zakres spraw — niewidoczne dla odwiedzających).

Uzupełnione 17.11.2026 z publicznych źródeł (szczegóły i linki w
`docs/PYTANIA.md`, sekcja z tą datą): numer wpisu **CZE/Adw/592**; **stały
mediator SO w Częstochowie** (cywilne, gospodarcze, rodzinne — **nie** karne,
więc na `sprawy-karne.html` zostaje „czynny mediator"); **link do opinii Google**
`https://www.google.com/maps?cid=395690172084249377` (6 stron + stopka, nowa
karta); opłata w FAQ spadków; **progi i kary** na `jazda-po-alkoholu.html`
(poprawiona kara z art. 178a § 1 k.k.); trzy braki polityki prywatności.
Na stronach publicznych nie ma już ani jednego `.todo` ani `href="#"`.

Uzupełnione 21.09.2026 z publicznych źródeł: **NIP 5771926637** (Biała lista MF)
w stopce (`KONTAKT.nip` w `site.js`) i w `.dane` na kontakcie; lata i nazwy
w „Moja historia" ze starej strony klientki.
