# PYTANIA I PRZYJĘTE ZAŁOŻENIA

*Aktualne dla design systemu v2 i mockupu v2 (3 września 2026).*

Dokument żywy. Każda pozycja to decyzja, której brief nie przewidział, wraz z **założeniem**, na którym powstał design system i mockup. Założenie jest odwracalne: zmiana odpowiedzi zmienia konkretne, wskazane miejsca.

Status: 🔴 zmienia treść hero i kolejność sekcji · 🟡 zmienia copy · ⚪ do potwierdzenia

---

## Cztery pytania do klientki (wersja 1, 3 września 2026)

### 1. Które dwa lub trzy obszary spraw są wiodące? 🔴
**Dlaczego pytamy:** obecna strona wymienia osiem obszarów równorzędnie. Strona główna nie może mówić o wszystkim naraz: nagłówek hero, lead i kolejność kafli muszą wskazywać, po co ludzie przychodzą najczęściej.
**Przyjęte założenie:** wiodące są sprawy **rodzinne, cywilne i spadkowe**, potem karne; umowy, prawo pracy, administracyjne i odszkodowania jako uzupełnienie. Stąd taki lead w hero i taka kolejność kafli.
**Co się zmieni po odpowiedzi:** lead hero oraz podział w sekcji „Zakres spraw". Od wersji 2 mockupu ten podział jest widoczny w układzie: trzy wiodące obszary mają duże kafle z chipami, pozostałe pięć to indeks w wierszach. Zmiana odpowiedzi zamienia kafle miejscami z wierszami.

### 2. Piszemy do odwiedzającego „Ty" czy „Pani/Pan"? 🟡
**Dlaczego pytamy:** cała treść strony zależy od tej decyzji. Obecna strona miesza oba („Bronię Ciebie", „reprezentując Państwa"). Dla spraw rodzinnych i karnych „Ty" brzmi bliżej i cieplej, dla firm i urzędów forma grzecznościowa brzmi bezpieczniej.
**Przyjęte założenie:** **„Ty"**, w tonie spokojnym i rzeczowym, bez spoufalania. Tak jest napisany mockup.
**Co się zmieni po odpowiedzi:** nagłówek hero, lead, kafle, kroki współpracy, FAQ, pas CTA. Design system zostaje bez zmian.

### 3. Zdjęcia i logo: będzie sesja, i czy zostaje sześciokątny monogram ze złotem? ⚪
**Dlaczego pytamy:** hero i „O mnie" opierają się na portrecie w świetle dziennym; bez sesji trzeba zbudować te sekcje inaczej (wnętrze, typografia). Obecne logo (monogram „B" w sześciokącie, złoto `#C19B69`) to jedyny element z wartością marki na starej stronie; z jego złota wyprowadziliśmy brązowy akcent.
**Przyjęte założenie:** sesja **będzie** (brief kadrów w design systemie, sekcja 05); monogram **zostaje** i jest odrysowany w wektorze; akcent to przyciemniony brąz `#7E5E36`, a nie żywe złoto.
**Co się zmieni po odpowiedzi:** bez sesji hero dostaje wnętrze kancelarii albo wariant typograficzny; jeśli klientka woli oryginalne złoto, wymieniamy jeden token `--braz`.

### 4. Jakie dowody zaufania możemy pokazać i jak ma wyglądać pierwszy kontakt? ⚪
**Dlaczego pytamy:** mockup świadomie nie ma wymyślonych liczb ani opinii. Jeśli istnieją prawdziwe opinie w Google, wchodzą do pasa faktów lub do osobnej sekcji. Druga część pytania: czy pierwsza konsultacja jest płatna i czy klientka chce formularz na stronie głównej, czy wyłącznie telefon.
**Przyjęte założenie:** brak publicznych opinii (pas faktów pokazuje tylko sprawdzalne fakty ze strony); **telefon jako główny kanał**, formularz na podstronie Kontakt; zasada rozliczenia pierwszej rozmowy oznaczona w FAQ jako do ustalenia.
**Co się zmieni po odpowiedzi:** trzeci fakt w pasie pod hero, piąte pytanie FAQ, ewentualnie formularz w sekcji Kontakt (komponent gotowy w design systemie).

---

## Założenia dodatkowe (bez pytania, do wiedzy)

- **Struktura strony głównej (v2):** 9 sekcji, każda w innym układzie — hero z wykrwawionym zdjęciem i pasem faktów, sytuacje, zakres spraw, o mnie z osią czasu, pas foto, współpraca, pytania, pas zachęty, kontakt. Baza wiedzy / blog nie wchodzi, dopóki klientka nie zadeklaruje pisania.
- **Sekcja „Sytuacje" (nowa w v2):** osiem zdań opisujących sytuację klienta, po jednym na każdy obszar. Treść jest propozycją i wymaga akceptacji: to najbardziej „mówiąca głosem klientki" część strony.
- **Treść kroków współpracy** i drugi akapit „O mnie" to propozycje tonu; wymagają akceptacji.
- **Adresy URL** nowej strony: `/zakres-spraw/…`, `/o-mnie/`, `/kontakt/`; przekierowania 301 ze starych `/about`, `/services`, `/contact`.
- **Bez ciemnych sekcji**, bez granatu i zieleni, bez zimnej bieli: wprost z briefu.

---

## Pytania do klientki — podstrona Kontakt (wersja 2, 5 września 2026)

Powstał `kontakt.html`. Cztery decyzje, których brief ani copy strony głównej nie
rozstrzygały. Każda ma przyjęte założenie, widoczne na stronie.

### 5. Godziny pracy kancelarii — ROZSTRZYGNIĘTE, pytanie wycofane ⚪
**Decyzja Mikołaja z 7 września 2026:** sekcja „Kiedy zwykle zastaniesz mnie w kancelarii"
**wypada** z podstrony kontaktu, razem z tabelą godzin i `openingHoursSpecification`
w JSON-LD. Strona nie podaje już żadnych godzin, więc nie ma czego potwierdzać
u klientki. Spójne z „nie obiecuję sztywnych godzin przyjęć" ze strony głównej.
**Gdyby wracało:** godziny ze starej strony to pn-wt 8:30-17:00, śr-czw 8:30-15:00,
piątek po umówieniu; komponent `.godziny` nadal jest w `styles.css`.

### 6. Formularz „oddzwonię": zostaje i pod jaki adres ma wysyłać? ⚪
**Dlaczego pytamy:** założenie z pytania 4 (telefon jako główny kanał, formularz na
podstronie Kontakt) jest zrealizowane, ale statyczny HTML nie ma dokąd wysłać zgłoszenia.
**Przyjęte założenie:** formularz **wchodzi**, w minimalnej wersji: imię, telefon, pora
telefonu, krótki opis sprawy, zgoda. Nie prosi o e-mail ani o dokumenty. Atrybut `action`
jest pusty i oznaczony `【DO UZUPEŁNIENIA】` — podpinamy go przy imporcie na WordPressa.
**Co się zmieni po odpowiedzi:** jeśli klientka nie chce formularza, wypada cała sekcja
05 i blok `.formularz*` z `styles.css`. Jeśli chce — potrzebny jest adres e-mail, na który
mają lecieć zgłoszenia.

### 7. Kto odpowiada za politykę prywatności i klauzulę RODO? 🔴
**Dlaczego pytamy:** formularz zbiera dane osobowe, więc obok zgody musi stać informacja
o przetwarzaniu danych (administrator, cel, podstawa, okres, prawa). Bez niej strona nie
powinna wejść na produkcję. Kancelaria zwykle ma już taką klauzulę na potrzeby RODO.
**Przyjęte założenie:** klientka dostarcza własną treść polityki prywatności i klauzuli
informacyjnej; na razie oba linki prowadzą do `#`.
**Co się zmieni po odpowiedzi:** dochodzi podstrona `polityka-prywatnosci.html`, a linki
w formularzu i w stopce zaczynają na nią wskazywać.

### 8. NIP i dane rejestrowe kancelarii ⚪
**Dlaczego pytamy:** NIP jest w stopce i w danych kontaktowych podstrony, w obu miejscach
jako `do uzupełnienia`. Przy okazji: czy w danych ma się pojawić numer wpisu na listę
adwokatów?
**Przyjęte założenie:** NIP wchodzi do stopki i do `.dane`; numeru wpisu nie pokazujemy,
zostaje sama informacja o Okręgowej Radzie Adwokackiej w Częstochowie.
**Co się zmieni po odpowiedzi:** dwa `<span class="todo">` w `js/site.js` (stopka) i
`kontakt.html` (lista `.dane`).

### Założenia dodatkowe (bez pytania, do wiedzy)

- **Opis dojazdu** („lewa oficyna, pierwsze piętro, po prawej stronie") pochodzi ze starej
  strony i jest podany jako fakt. Warto potwierdzić, że nadal się zgadza.
- **Sekcja „Jak wygląda pierwsza rozmowa"** (cztery kroki) została napisana, a potem
  zdjęta decyzją Mikołaja z 7 września 2026. Podstrona kontaktu ma dziś trzy sekcje:
  wstęp z telefonem, dane z mapą, formularz. Temat „co się dzieje po pierwszym telefonie"
  jest nadal nieobsłużony — jeśli ma wrócić, to raczej na podstronie o mnie albo w FAQ.
- **Formularz nie obiecuje czasu odpowiedzi.** Zamiast tego mówi, że nie jest kanałem
  pilnym, i odsyła do telefonu przy terminach procesowych.

---

## Pytanie z 7 września 2026 — nawigacja

### 9. Aktualności: czy klientka będzie je pisać? 🔴
**Dlaczego pytamy:** menu ma teraz układ Strona główna · Usługi (drop-down) · O mnie ·
Aktualności · Kontakt. Pozycja „Aktualności" prowadzi na razie donikąd (`#`), bo podstrony
nie ma. Wcześniejsze założenie brzmiało: baza wiedzy / blog nie wchodzi, dopóki klientka
nie zadeklaruje pisania. Pusta zakładka „Aktualności" na stronie kancelarii szkodzi
bardziej niż jej brak — odwiedzający widzi, że strona stoi.
**Przyjęte założenie:** zakładka **zostaje w menu**, bo taka była decyzja o układzie
nawigacji; treści dostarczy klientka. Jeśli nie powstaną, pozycję wycinamy z `NAV`
w `js/site.js` (jedna linia) razem z odpowiednikiem w stopce.
**Co się zmieni po odpowiedzi:** albo powstaje `aktualnosci.html` z listą wpisów, albo
pozycja znika z menu i ze stopki.

### Założenie dodatkowe: drop-down „Usługi"
Sześć pozycji drop-downu (rozwody i sprawy rodzinne, spadki i dział spadku, prawo jazdy
i jazda po alkoholu, sprawy karne, sprawy cywilne, mediacje) prowadzi **na razie do
rejestru spraw na stronie głównej**, bo podstron obszarów jeszcze nie ma. Docelowo każda
dostaje własny adres — wtedy zmienia się `href` w tablicy `USLUGI` w `js/site.js`
i wchodzi to jednocześnie w menu i w stopkę.

---

## Pytania do klientki — podstrona „O mnie" (wersja 3, 7 września 2026)

Powstał `o-mnie.html` na podstawie `o-mnie-copy.md`. Siedem z ośmiu sekcji stoi na
gotowej treści. Jedna czeka na dane, których nie da się zastąpić założeniem.

### 10. Ścieżka zawodowa: pięć dat i nazw — BLOKUJE SEKCJĘ 🔴
**Dlaczego pytamy:** sekcja „Krótko o tym, skąd się tu wzięłam" ma być suchym wykazem
faktów. Jej cała wartość polega na tym, że są to daty i nazwy, a nie deklaracje. Nie da
się jej napisać z założenia: wymyślony rok studiów albo numer wpisu to nie jest ryzyko
copy, tylko nieprawda o adwokacie.
**Potrzebne:** (1) rok ukończenia studiów i uczelnia, (2) rok ukończenia aplikacji
i izba, przy której się odbywała, (3) rok wpisu na listę adwokatów i numer wpisu,
(4) rok otwarcia własnej kancelarii i czym zajmowała się wcześniej, (5) rok uzyskania
uprawnień mediatora, skąd pochodzą i czy jest na liście stałych mediatorów przy Sądzie
Okręgowym w Częstochowie.
**Przyjęte założenie:** sekcja **stoi na stronie z placeholderami** `<span class="todo">`
w miejscu każdej daty i nazwy, żeby było widać, ile dokładnie danych brakuje. Jedyny
fakt wpisany na twardo to izba wpisu (ORA w Częstochowie, z briefu) i to, że aplikacja
była adwokacka — co wynika z tytułu zawodowego, ale warto potwierdzić.
**Co się zmieni po odpowiedzi:** wpisujemy lata w `.wykaz__rok` i nazwy w `.wykaz__opis`.
Pozycji, której roku klientka nie poda, **nie zastępujemy ogólnikiem — usuwamy cały
wiersz**. Jeśli nie da się podać żadnej daty, wypada cała sekcja 03; wtedy sekcja
„Dyżury" musi przejść z bieli na piasek, żeby utrzymać naprzemienność płaszczyzn.

### 11. Akapit o wnioskach o wyznaczenie pełnomocnikiem ⚪
**Dlaczego pytamy:** w sekcji o dyżurach stoi zdanie: „Zdarza się, że osoby, które
poznałam na takim dyżurze, występują potem do sądu o wyznaczenie mnie swoim
pełnomocnikiem. […] To jest ta rekomendacja, którą cenię najbardziej." To najmocniejszy
dowód zaufania na całej stronie, ale mówi o cudzych decyzjach procesowych.
**Przyjęte założenie:** zdanie **zostaje** — jego łagodniejszy wariant stoi już na stronie
głównej i przeszedł bez zastrzeżeń.
**Co się zmieni po odpowiedzi:** przy sprzeciwie usuwamy blok `.akcent` z sekcji „Dyżury";
reszta sekcji broni się bez niego.

### 12. Sekcja prywatna — świadomie nie powstała ⚪
**Dlaczego pytamy:** copy przewidywało opcjonalną sekcję „Poza pracą". Zasada z briefu
mówi, żeby nie wymyślać faktów, a wymyślona pasja szkodzi bardziej niż jej brak.
**Przyjęte założenie:** sekcji **nie ma**. Strona ma osiem sekcji zamiast dziewięciu.
**Co się zmieni po odpowiedzi:** jeśli klientka zechce coś o sobie powiedzieć, sekcja
wchodzi między „Podejście" (piasek) a „Zakres praktyki" (biel) — czyli musi być w lnie.

### Założenia dodatkowe (bez pytania, do wiedzy)

- **Tytuł zawodowy w H1** brzmi „Adwokat", a nie `[tytuł zawodowy]` z copy: wynika
  z briefu i ze stopki (wpis na listę ORA w Częstochowie).
- **Zdanie „Wiem, co powiedziałaś w czerwcu"** z copy zostało przepisane na
  „Pamiętam, co ustaliliśmy w czerwcu", bo forma z copy zwracała się wyłącznie
  do kobiety, a reszta strony pisze w rodzaju neutralnym.
- **Lokalizacja dyżurów** („w Częstochowie i okolicy" w nawiasie w copy) została
  pominięta zamiast oznaczona `.todo` — zdanie działa bez niej i nie trzeba go
  potwierdzać. Wraca, jeśli klientka poda konkretne punkty.
- **Rejestr spraw na `o-mnie.html`** prowadzi tymczasowo do `index.html#sprawy`,
  tak samo jak drop-down „Usługi". Podmiana pięciu `href` po powstaniu podstron.

---

## Baza wiedzy (`baza-wiedzy.html` + `wpis-szablon.html`)

Zakładka stoi, ale **żaden wpis nie jest napisany**. W archiwum jest dwanaście
zaproponowanych tematów: tytuły i jednozdaniowe zajawki, daty jako `.todo`,
wszystkie wiersze prowadzą do szablonu wpisu. Strona nie sygnalizuje tego
odwiedzającemu — nota o roboczym stanie archiwum została zdjęta na życzenie
Mikołaja, więc **stan pilnuje ten dokument, nie sama strona**.

### A. Nazwa zakładki: „Baza wiedzy" zamiast „Aktualności" ⚪
**Dlaczego pytamy:** menu przewidywało „Aktualności". Nazwa obiecuje regularne
newsy, a zakładka, na której ostatni wpis ma pół roku, działa przeciwko kancelarii.
**Przyjęte założenie:** zakładka nazywa się **„Baza wiedzy"** i zbiera teksty
evergreen — wyjaśnienia, które nie tracą aktualności. Plik: `baza-wiedzy.html`.
**Co się zmieni po odpowiedzi:** powrót do „Aktualności" to zmiana jednego `label`
w tablicy `NAV` w `js/site.js` (i tego samego w `STOPKA_KANCELARIA`). Nazwa pliku,
układ i komponenty zostają bez zmian.

### B. Które tematy wchodzą jako pierwsze i kto pisze teksty? 🔴
**Dlaczego pytamy:** dwanaście tematów to propozycja oparta na zakresie spraw
i na pytaniach, które już stoją w FAQ na stronie głównej. Nie wiemy, które z nich
klientka uznaje za swoje, ani czy chce pisać sama.
**Przyjęte założenie:** kolejność kategorii **jak w menu** (rozwód i sprawy rodzinne,
spadki, prawo jazdy, sprawy karne, sprawy cywilne, mediacje), a wpisem wiodącym
jest „Ile trwa rozwód" — bo to najczęstsze pytanie w FAQ.
**Co się zmieni po odpowiedzi:** tytuły i zajawki w `baza-wiedzy.html`, liczniki
w nagłówkach grup i w chipach, oraz sekcja „Najnowszy wpis".

### C. Czy przy wpisach mają stać daty? ⚪
**Dlaczego pytamy:** data buduje wiarygodność świeżego tekstu i szkodzi staremu.
W tekstach evergreen bywa zbędna, ale jej brak wygląda podejrzanie przy wpisach,
które komentują zmianę przepisów.
**Przyjęte założenie:** **daty są** — w archiwum, w metryczce wpisu i w karcie
najnowszego wpisu; wszystkie stoją dziś jako `.todo`.
**Co się zmieni po odpowiedzi:** rezygnacja z dat to usunięcie `.wpis-poz__data`
z wierszy (kolumna zniknie sama, siatka ma trzy pola) i jednego `<span>`
z `.wpis-meta`. Sam komponent zostaje.

### D. Podpis pod wpisem ⚪
**Dlaczego pytamy:** metryczka wpisu podpisuje tekst nazwiskiem i tytułem.
**Przyjęte założenie:** **„Beata Cupiał-Kowalska, adwokat"** — jedyna autorka,
zgodnie z tym, co strona mówi o prowadzeniu kancelarii samodzielnie.
**Co się zmieni po odpowiedzi:** jeden `<span>` w `.wpis-meta` w każdym wpisie.

### Założenia dodatkowe (bez pytania, do wiedzy)

- **Zastrzeżenie na końcu wpisu** („wpis wyjaśnia zagadnienie ogólnie i nie jest
  poradą prawną") stoi w szablonie jako stały element i ma zostać w każdym wpisie.
- **Chipy kategorii nie są filtrem**, tylko kotwicami do grup — działają bez JS
  i nie chowają treści przed wyszukiwarką. Po imporcie na WordPressa mogą zostać
  kotwicami albo stać się linkami do archiwów kategorii WP.
- **Kategorie są kopią tablicy `USLUGI`** z `site.js`, w tej samej kolejności.
  Nowy obszar spraw w menu = nowa kategoria w archiwum.
- **Szablon wpisu (`wpis-szablon.html`) celowo nie jest w menu ani w stopce** —
  to plik do klonowania. Gdy powstaną prawdziwe wpisy, wiersze w archiwum
  przestają na niego wskazywać, ale sam plik zostaje jako wzorzec.

---

## Pytania do klientki — podstrona „Rozwód i sprawy rodzinne" (wersja 4, 7 września 2026)

Powstał `rozwod-i-sprawy-rodzinne.html` na copy `rozwod-i-sprawy-rodzinne-copy.md`.
Copy samo zostawiło siedem miejsc do potwierdzenia; poniżej te, które realnie
stoją dziś na stronie, oraz decyzje podjęte za klientkę.

### 13. Status mediatora: czy jest na liście stałych mediatorów? 🟡
**Dlaczego pytamy:** copy dawało wybór „czynny mediator / mediator wpisany na listę
stałych mediatorów przy Sądzie Okręgowym w Częstochowie". To druga wersja jest
konkretem wartym podania wprost — jest sprawdzalna i różnicuje od konkurencji.
**Przyjęte założenie:** na stronie stoi **„Jestem czynnym mediatorem"**, czyli
sformułowanie, które już jest na stronie głównej i w „O mnie", więc jest pewne.
**Co się zmieni po odpowiedzi:** jedno zdanie w panelu mediacji na tej podstronie
(oznaczone komentarzem 【DO UZUPEŁNIENIA】) plus, dla spójności, to samo zdanie
w `index.html` i `o-mnie.html`.

### 14. Opłata sądowa 600 zł w FAQ ⚪
**Dlaczego pytamy:** copy świadomie zostawiło kwotę, bo to fakt ustawowy, a nie
obietnica, i buduje wiarygodność. Klientka może jednak nie chcieć żadnych kwot
na stronie.
**Przyjęte założenie:** **kwota zostaje**, w pytaniu „Ile kosztuje rozwód?", razem
z wyraźnym rozdzieleniem opłaty sądowej od wynagrodzenia kancelarii (to drugie
bez widełek).
**Co się zmieni po odpowiedzi:** jedno zdanie w FAQ na tej podstronie i wpis
w JSON-LD `FAQPage` (ta sama treść w dwóch miejscach — zmieniać oba naraz).

### 15. Opisy spraw w akordeonie: czy są zgodne ze stanem faktycznym? 🟡
**Dlaczego pytamy:** sekcja „Sprawy rodzinne, które prowadzę" ma sześć pozycji
z opisami dłuższymi niż w copy (decyzja Mikołaja z 7 września). Dopisane zdania
to ogólne fakty proceduralne — zabezpieczenie na czas sprawy, sprawy o pojedyncze
decyzje rodzicielskie, egzekucja kontaktów, nakłady przy podziale majątku, kredyt
niedzielony przez sąd. Nie ma tam żadnej deklaracji o skuteczności ani o czasie
trwania.
**Przyjęte założenie:** **klientka prowadzi wszystkie sześć rodzajów spraw**
w podanym zakresie.
**Co się zmieni po odpowiedzi:** pozycji, której klientka nie prowadzi, nie
skracamy do ogólnika — usuwamy ją w całości i przenumerowujemy resztę.

### Założenia dodatkowe (bez pytania, do wiedzy)

- **Sekcja mediacji nie jest ciemna**, choć copy prosiło o „blok na ciemnym tle".
  Ciemnych sekcji nie ma w całym projekcie (brief). Rolę odcięcia bierze piaskowy
  panel `.panel-mediacje` stojący na lnie — tak samo jak na stronie głównej.
- **Trzy punkty „Szybciej / Taniej / Poufnie"** z copy nie weszły — decyzja
  Mikołaja z 7 września. Argument o czasie i koszcie niesie już esej w panelu.
- **Portretu na tej podstronie nie ma** — decyzja Mikołaja z 7 września. Copy
  przewidywało kadr 3:4 przy sekcji „o mnie"; do czasu sesji zdjęciowej
  placeholder w tak długiej stronie czytał się jak brak, nie jak układ.
- **Cytat wiodący w opiniach** (`.opinia-wiodaca`) zostaje wyróżnikiem strony
  głównej. Tutaj stoją trzy równorzędne kolumny, otwarte opinią mówiącą wprost
  o sprawie rozwodowej.
- **Sekcja „czy to Twoja sytuacja" nie jest klikalna.** Sześć zdań to rozpoznanie
  sytuacji, nie spis treści — nie ma dokąd z nich prowadzić, więc nie mają
  hoveru ani strzałki.
- **Wejścia na podstronę:** drop-down „Usługi", kolumna „Sprawy" w stopce,
  okruszki, pierwszy wiersz rejestru na `index.html` i na `o-mnie.html`.
  Wszystkie idą z jednej tablicy `USLUGI` w `site.js` albo z ręcznego `href`
  w dwóch rejestrach.

---

## Pytania do klientki — podstrona „Sprawy spadkowe" (14 września 2026)

Powstał `sprawy-spadkowe.html` na copy `spadki-copy.md`, sklonowany 1:1 z podstrony
„Rozwód i sprawy rodzinne". Wejścia: drop-down „Usługi", kolumna „Sprawy" w stopce,
okruszki, wiersz „Sprawy spadkowe" w rejestrze na `index.html` i na `o-mnie.html`.

### 16. Opłata sądowa w FAQ: 100 zł czy 50 zł? 🔴
**Dlaczego pytamy:** copy podaje „100 zł od wniosku + 5 zł za wpis w Rejestrze
Spadkowym" i samo oznacza to jako do potwierdzenia. Według ustawy o kosztach
sądowych w sprawach cywilnych (art. 49) opłata stała od wniosku o stwierdzenie
nabycia spadku to **50 zł**, do tego 5 zł za wpis do Rejestru Spadkowego.
Trzeba sprawdzić stan prawny na dzień publikacji.
**Przyjęte założenie:** zdanie stoi na stronie jako `<span class="todo">`
i **nie wchodzi do JSON-LD**.
**Co się zmieni po odpowiedzi:** jedno zdanie w FAQ i odpowiedź w `FAQPage`.

### 17. Testamenty i darowizny: czy klientka to prowadzi? 🟡
**Dlaczego pytamy:** pozycja 06 „Zanim dojdzie do sporu" mówi o pomocy przy
testamencie, darowiznach i umowie o zrzeczenie się dziedziczenia.
**Przyjęte założenie:** tak, pozycja stoi.
**Co się zmieni po odpowiedzi:** przy „nie" pozycja 06 wypada w całości,
wykaz ma pięć pozycji.

### 18. Zachowek po stronie zobowiązanego 🟡
**Dlaczego pytamy:** pozycja 03 kończy się zdaniem „Prowadzę te sprawy z obu stron,
także wtedy, gdy to od Ciebie ktoś żąda zapłaty".
**Przyjęte założenie:** tak.
**Co się zmieni po odpowiedzi:** przy „nie" wypada ostatnie zdanie pozycji 03
i druga połowa jej zajawki.

### 19. Status mediatora 🟡
Jak w pytaniu 13: do czasu potwierdzenia stoi „Jestem czynnym mediatorem".

### Założenia dodatkowe (bez pytania, do wiedzy)

- **Etykiety sekcji:** copy podaje pięć („W czym pomagam", „Bez niespodzianek",
  „Jak pracuję" ponad dwie ze wzorca). System dopuszcza trzy na stronę, więc
  zostały dwie, dokładnie jak na stronie rozwodów.
- **Opinie:** trzy z wizytówki Google, które nie nazywają rodzaju sprawy
  (Irys 2006, Kamila Sapota, Karolina Bieniek). Opinia o sprawie rozwodowej
  została na stronie rozwodów.
- **Dojście do kancelarii:** copy miało „Lokal na parterze, pierwsze piętro,
  po prawej" z dopiskiem do uzupełnienia. Na stronie stoi opis z danych realnych:
  „Lewa oficyna, pierwsze piętro, po prawej stronie".
- **„Bez stałych godzin przyjęć"** z copy nie weszło: kancelaria ma znane godziny
  pracy (klientka zdjęła je tylko ze strony), więc zdanie mogłoby być nieprawdziwe.
  Zostało „Termin dogrywamy telefonicznie".
- **Nazwa pozycji w menu:** „Spadki i dział spadku" → „Sprawy spadkowe", tak jak
  w okruszkach z copy i w rejestrze na stronie głównej. Ta sama nazwa kategorii
  w `baza-wiedzy.html`, bo kategorie odpowiadają tablicy `USLUGI`.

---

## Pytania do klientki — podstrona „Sprawy karne" (14 września 2026)

Powstał `sprawy-karne.html` na copy `sprawy-karne-copy.md`, sklonowany 1:1 z podstrony
„Rozwód i sprawy rodzinne". Wejścia: drop-down „Usługi", kolumna „Sprawy" w stopce,
okruszki, wiersz „Sprawy karne" w rejestrze na `index.html` i na `o-mnie.html`.

### 20. Reprezentacja pokrzywdzonego 🟡
**Dlaczego pytamy:** pozycja 04 w zakresie pomocy pokazuje kancelarię także po
drugiej stronie sali. To wyróżnik, ale kieruje na stronę inny typ klienta.
**Przyjęte założenie:** tak, pozycja stoi.
**Co się zmieni po odpowiedzi:** przy „nie" wypada pozycja 04, a z pozycji 03
i karty „Zgłosiłem przestępstwo, a sprawę umorzono" trzeba zdjąć wątek pokrzywdzonego.

### 21. Apelacja w sprawach po innym obrońcy 🟡
**Przyjęte założenie:** tak (ostatnie zdanie pozycji 06).
**Co się zmieni po odpowiedzi:** przy „nie" wypada to jedno zdanie.

### 22. Sprawy przed sądem okręgowym w pierwszej instancji 🟡
**Przyjęte założenie:** tak (ostatnie pytanie FAQ).
**Co się zmieni po odpowiedzi:** przy „nie" wypada zdanie o sądzie okręgowym,
w FAQ i w JSON-LD.

### 23. Terminy procesowe w liczbach ⚪
FAQ i zakres podają terminy ogólnie („krótki termin", „kilka dni"); liczbą stoi
tylko czternaście dni na apelację. Jeśli klientka woli konkretne liczby
(np. siedem dni na wniosek o uzasadnienie wyroku), wchodzą po jej weryfikacji.

### Założenia dodatkowe (bez pytania, do wiedzy)

- **Link do strony o jeździe po alkoholu** pod listą spraw prowadzi na razie do
  listy spraw na stronie głównej (`index.html#sprawy`), jak pozycja w menu.
  Po powstaniu podstrony podmienia się jeden `href`.
- **Etykiety sekcji, opinie, dojście do kancelarii i „bez stałych godzin przyjęć"**
  potraktowane tak samo jak na stronie spadków (patrz wyżej).

---

## Pytania do klientki — podstrona „Sprawy cywilne" (14 września 2026)

Powstał `sprawy-cywilne.html` na copy `sprawy-cywilne-copy.md`, sklonowany 1:1
z podstrony „Rozwód i sprawy rodzinne". Wejścia: drop-down „Usługi", kolumna
„Sprawy" w stopce, okruszki, wiersz „Sprawy cywilne" w rejestrze na `index.html`
i na `o-mnie.html`.

### 24. Egzekucja i współwłasność (pozycje 05 i 06) 🟡
**Dlaczego pytamy:** copy dopisało je jako propozycję rozszerzenia; na spotkaniu
padły wprost tylko pozwy o zapłatę i eksmisje.
**Przyjęte założenie:** obie pozycje stoją.
**Co się zmieni po odpowiedzi:** przy „nie" wypadają pozycje 05 i 06, karty
„Komornik zajął mi konto" i „Mam nieruchomość na współwłasność" oraz ostatnie
pytanie FAQ (także w JSON-LD). Kart jest wtedy cztery, siatka zostaje równa.

### 25. Eksmisje po stronie lokatorów 🟡
**Przyjęte założenie:** po obu stronach (ostatnie zdanie pozycji 02).
**Co się zmieni po odpowiedzi:** przy „nie" zdanie brzmi „wyłącznie dla właścicieli".

### 26. Sprawdzanie umów przed podpisaniem 🟡
**Przyjęte założenie:** tak (ostatnie zdanie pozycji 04).
**Co się zmieni po odpowiedzi:** przy „nie" wypada to jedno zdanie.

### 27. Kwoty opłat i liczba dni na sprzeciw ⚪
Celowo ich nie ma: opłata od pozwu zależy od wartości sporu. Wchodzą tylko
po weryfikacji, jeśli klientka będzie chciała.

### Założenia dodatkowe (bez pytania, do wiedzy)

- **Poprawka merytoryczna w pozycji 05:** copy miało „doprowadzić do wznowienia
  terminu". Takiej instytucji nie ma; chodzi o **przywrócenie terminu** (tak samo
  pisze copy w FAQ). Na stronie stoi „przywrócenia terminu".
- **Zajawka pozycji 02 „Najczęstsza sprawa cywilna, jaką prowadzę"** to deklaracja
  o praktyce kancelarii, oparta na briefie (eksmisje jako trzon). Do potwierdzenia
  przy okazji pytania 25.
- **Etykiety sekcji, opinie, dojście do kancelarii i „bez stałych godzin przyjęć"**
  potraktowane tak samo jak na stronie spadków.

---

## Pytania do klientki — podstrona „Jazda po alkoholu" (14 września 2026)

Powstał `jazda-po-alkoholu.html` na copy `jazda-po-alkoholu-copy.md`: szkielet
podstrony usługowej plus cztery moduły własne (oś czasu, tabela progów, blok
możliwości, blok dyskrecji), bez bloku mediacji. Wejścia: drop-down „Usługi",
kolumna „Sprawy" w stopce, okruszki, wiersz w rejestrze na `index.html`
i na `o-mnie.html`, link pod wykazem spraw na `sprawy-karne.html`.

### 28. Progi, kary, zakazy i świadczenie w tabeli i FAQ 🔴
**Dlaczego pytamy:** copy samo oznacza wszystkie liczby do weryfikacji na dzień
publikacji. Sprawdziłem je z tym, co wiem o przepisach (art. 87 kw, art. 178a,
42, 43a i 44b kk, ustawa o wychowaniu w trzeźwości): wartości w copy się zgadzają.
**Przyjęte założenie:** liczby stoją na stronie bez `.todo`, z komentarzem
w HTML. Tabela jest w kodzie **dwa razy** (tabela na desktop, karty na telefon).
**Co się zmieni po odpowiedzi:** poprawka liczby = tabela, karta i FAQ naraz,
także w JSON-LD.

### 29. Wypadki ze skutkiem śmiertelnym lub ciężkim uszczerbkiem 🟡
**Przyjęte założenie:** tak (pozycja 06 zakresu).
**Co się zmieni po odpowiedzi:** przy „nie" pozycja 06 zawęża się do jazdy mimo zakazu.

### 30. Zdanie o prawie do obrony w bloku dyskrecji 🟡
**Dlaczego pytamy:** copy wskazuje je jako najbardziej narażony wizerunkowo fragment.
**Przyjęte założenie:** zostaje.
**Co się zmieni po odpowiedzi:** przy „nie" wypada drugie zdanie drugiego akapitu.

### 31. Warunkowe umorzenie jako realna droga 🟡
**Przyjęte założenie:** strona o nim mówi (zakres 03, blok możliwości, FAQ, karta
„To był pierwszy raz"), ostrożnie i bez obietnicy wyniku.
**Co się zmieni po odpowiedzi:** przy „nie" blok możliwości trzeba przepisać.

### Poprawki merytoryczne względem copy (do wiedzy)

- **Warunkowe umorzenie a rejestr karny.** Copy w trzech miejscach twierdziło,
  że przy warunkowym umorzeniu **nie ma wpisu** do Krajowego Rejestru Karnego.
  To nieprawda: KRK gromadzi dane o osobach, wobec których warunkowo umorzono
  postępowanie, a wpis usuwa się po zakończeniu okresu próby. Na stronie stoi
  „wpis jest tylko czasowy" (zakres 03, blok możliwości, FAQ „Czy da się uniknąć
  wpisu do rejestru karnego?"). Sama teza „bez skazania" jest prawdziwa i została.
- **Jazda mimo zakazu:** copy mówiło, że „zakaz zostaje przedłużony". Sąd orzeka
  **kolejny** zakaz; tak stoi na stronie.
- **Literówki:** „na wprawę" → „na rozprawę" (oś czasu, krok 06), „nie mieszczę
  mi się to w głowie" → „nie mieści mi się to w głowie" (karta sytuacji).

### Założenia dodatkowe (bez pytania, do wiedzy)

- **Etykiety:** copy podaje siedem. Zostały trzy (oś czasu, tabela, blok
  możliwości); karty sytuacji stoją tu bez etykiety.
- **Znacznik „Termin: 7 dni od doręczenia"** przy kroku 05 osi czasu to wyróżnienie
  faktu z tekstu kroku, nie nowa treść.
- **Nazwa w menu:** „Prawo jazdy i jazda po alkoholu" → „Jazda po alkoholu", jak
  w okruszkach z copy; ta sama nazwa kategorii w `baza-wiedzy.html`.
- **Opinie, dojście do kancelarii i „bez stałych godzin przyjęć"** potraktowane tak
  samo jak na pozostałych podstronach usługowych.

---

## Pytania do klientki — zakładka „Mediacje" (14 września 2026)

Powstał `mediacje.html` na copy `mediacje-copy.md`. To zakładka niezależna, nie
podstrona usługowa: dziesięć sekcji, bez „Podejścia" i bez opinii Google. W menu
stoi w „Usługach" (decyzja Mikołaja), oddzielona hairline'em od reszty pozycji;
copy rekomendowało osobną pozycję w menu głównym. Wszystkie przyciski „Więcej
o mediacjach" (strona główna i cztery podstrony usługowe) prowadzą teraz tutaj.

### 32. Lista stałych mediatorów przy Sądzie Okręgowym w Częstochowie 🔴
**Przyjęte założenie:** „czynny mediator", jak w całym serwisie.
**Co się zmieni po odpowiedzi:** przy „tak" konkret wchodzi do leadu nagłówka
i zmienia brzmienie sekcji „W jakich sprawach mediuję" oraz FAQ.

### 33. Kategorie mediacji 🟡
**Dlaczego pytamy:** pozycje 04 (sprawy o zapłatę) i 05 (pojednanie w sprawach
karnych) to propozycja rozszerzenia z copy.
**Co się zmieni po odpowiedzi:** pozycja, której klientka nie prowadzi, wypada.

### 34. Zdanie o nieudanej mediacji 🟡
**Dlaczego pytamy:** „jeżeli mediacja się nie powiedzie, w tej samej sprawie nie
będę mogła reprezentować żadnej ze stron". Kosztuje klientów, ale jest najbardziej
wiarygodnym fragmentem strony.
**Przyjęte założenie:** zostaje.

### 35. Plan rodzicielski jako efekt mediacji 🟡
**Przyjęte założenie:** tak, cała sekcja 04 na tym stoi.
**Co się zmieni po odpowiedzi:** przy „nie" sekcja wypada, a pole bieli ma dwie sekcje.

### 36. Rozliczanie kosztów mediacji ⚪
FAQ mówi „strony zwykle dzielą koszty po połowie". Do potwierdzenia.

### Poprawki merytoryczne względem copy (do wiedzy)

- **Zwrot opłaty sądowej po ugodzie przed mediatorem.** Copy mówiło, że przy ugodzie
  przed rozpoczęciem rozprawy „zwrot jest pełny". Z tego, co wiem, ustawa o kosztach
  sądowych w sprawach cywilnych (art. 79) przewiduje w takich sytuacjach zwrot
  **części** opłaty od pozwu (większej przed rozpoczęciem rozprawy, mniejszej
  później), a nie całości. Na stronie stoi zdanie bez ułamka: „zwrot części opłaty
  od pozwu, a im wcześniej do niej dojdzie, tym ten zwrot jest wyższy". Warto
  sprawdzić aktualne brzmienie przepisu przed publikacją.
- **Do wiedzy, bez zmiany tekstu:** FAQ „Odmowa nie działa na Twoją niekorzyść"
  jest prawdziwe dla odmowy zgody na mediację. Kodeks pozwala jednak obciążyć
  kosztami stronę, która **uchyla się** od mediacji, na którą wcześniej się zgodziła
  (art. 103 kpc). Zdania o wycofaniu zgody „na każdym etapie" to nie przekreśla,
  ale klientka może chcieć to doprecyzować.

### Założenia dodatkowe (bez pytania, do wiedzy)

- **Okruszki:** Strona główna › Usługi › Mediacje (copy: bez „Usługi"), bo strona
  siedzi w drop-downie.
- **Kotwica `#dla-drugiej-strony`** stoi na samej karcie, z odstępem pod menu.
  Link do wysłania: `mediacje.html#dla-drugiej-strony`, po imporcie na WordPressa
  `/mediacje/#dla-drugiej-strony`.
- **Etykiety:** trzy z pięciu z copy (dwie drogi, plan rodzicielski, ugoda).
- **Dojście do kancelarii:** dane realne zamiast „do uzupełnienia" z copy.

