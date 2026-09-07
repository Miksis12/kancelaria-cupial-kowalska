# ANALIZA INSPIRACJI — kancelaria Cupiał-Kowalska

**Data:** 2026-09-03
**Materiał:** pełne zrzuty (desktop 1440 px, mobile 390 px) w `_analiza/screens/`, pobrany HTML/CSS w `_analiza/`, treść obecnej strony klientki (strona główna, O mnie, Zakres usług, Kontakt).
**Cel dokumentu:** rozebrać trzy referencje na części pierwsze (system, decyzje, sekcje), wskazać co bierzemy, a czego świadomie nie, i z tego wyprowadzić kierunek dla nowej strony.

Brief klientki w jednym zdaniu: **jasno, beżowo, przyjemnie dla oka, bez przepychu; liczą się treści, nie wizualizacja.** Odpada: ciemny granat, ciemna zieleń, zimna chirurgiczna biel.

---

## 1. taczkowska.vercel.app — „szwajcarska kartka"

### System
| Warstwa | Co jest |
|---|---|
| Paleta | 5 wartości, **zero koloru akcentowego**: biel `#FFFFFF`, kość słoniowa `#EFEDE6` (pasma), greige `#C9C4B4` (hero, stopka, panel menu), tusz `#101413`, etykieta `#63625B`. Wyróżnienie robi odwrócenie (ciemny blok), nie kolor. Jedyny kolor: `#8A2B1E` wyłącznie dla błędu formularza. |
| Typografia | **Inter** 300/400/500 do wszystkiego + **Geist Mono** do etykiet (13 px, rozstrzelenie 0,16 em, wersaliki), dat, numerów i danych kontaktowych. Hero 44–112 px w wadze 300, interlinia 1,05. Body 17 px / 1,6. |
| Geometria | Promień **0**. Zero cieni. Hairline `rgba(16,20,19,.28)`. Pasek akcentu 3 × 80 px pod nagłówkiem sekcji. Ścięty róg 40 px na bloku odwróconym. Kontener 1320 px. |
| Rytm | Cztery wysokości sekcji (96 / 128 px), jeden nadnagłówek na sekcję, biel po bieli oddzielana linią. |
| Ruch | Wyłącznie odsłanianie treści przy scrollu (GSAP), pełny stan końcowy bez JS. |

### Sekcje strony głównej (kolejność, układ, po co)
1. **Hero pełnoekranowy na wideo/zdjęciu**, tekst lewo-dół, 2 CTA (biały pełny + obrys), mono-etykieta z nazwiskiem i miastem.
2. **Pas faktów** 4 kolumny na kości słoniowej („ponad 20 lat", „12 książek", instytucje, biegła sądowa) + jedno zdanie o pierwszej rozmowie.
3. **Specjalizacje jako numerowane wiersze 2-kolumnowe**: lewo numer + tytuł + akapit „bólu" klienta; prawo akapit „co robię" + chipy pod-usług + mono-textlink „Dowiedz się więcej". Pod listą jedno zdanie o sprawach spoza specjalizacji.
4. **Blok pilny** (ciemny, ścięty róg): „liczy się każdy dzień", telefon jako biały przycisk.
5. **O mnie**: tekst lewo, portret cz-b prawo, textlink „Pełna sylwetka".
6. **Dlaczego ja**: 3 kolumny rozdzielone pionowymi hairline'ami na kości słoniowej.
7. **Formularz** 2-kolumnowy: intro + zapewnienie o tajemnicy lewo, pola z samym dolnym podkreśleniem prawo.
8. **Współpraca**: 4 numerowane wiersze (numer / tytuł / opis) na paśmie.
9. **Uczciwie**: sekcja „czego nie prowadzę" — tekst 2-kolumnowy.
10. **FAQ**: tytuł lewo, akordeon z numerami i plusem prawo.
11. **Kontakt**: dane w mono + godziny + dojazd, placeholder mapy, przycisk „Otwórz w mapach".
12. **Stopka** na greige, 3 kolumny linków, pas prawny.

### Decyzje, które warto zrozumieć
- Hierarchia budowana **skalą i wagą 300**, nie kolorem. Strona jest „droga" przez dyscyplinę, nie przez efekty.
- Mono jako sygnatura: każdy nadnagłówek, numer i dana kontaktowa jest w monospace. Jedna decyzja robi całą tożsamość.
- Treść pisana od „bólu" klienta („Ukazał się materiał, w którym nie zgadza się połowa faktów…"), dopiero potem nazwa usługi.
- Sekcja „czego nie robię" buduje wiarygodność.
- Fotografia wyłącznie czarno-biała.

### Bierzemy / nie bierzemy
✓ Dyscyplinę 5 wartości i jednego nadnagłówka na sekcję. ✓ Pas faktów pod hero. ✓ Wiersze procesu i FAQ z tytułem z boku. ✓ Blok kontaktu z godzinami i dojazdem. ✓ Copy „od sytuacji klienta".
✗ Zimną biel jako tło (klientka: „chirurgicznie się kojarzy"). ✗ Ciemny hero i bloki odwrócone (klientka chce jasno). ✗ Ostrą geometrię 0 px i mono-etykiety — to sygnatura Taczkowskiej, kopiowanie byłoby widoczne. ✗ Cz-b zdjęć.

---

## 2. adwokatgrubizna.pl — „agencyjny szablon dla kancelarii biznesowej" (WordPress / Elementor, TOP Lawyer)

### System
| Warstwa | Co jest |
|---|---|
| Paleta | Rodzina ciemnej zieleni: `#003D35`, `#002923`, `#1F544D`, `#33544F`; szarości `#F4F6F6`, `#EEF1F1`, `#DAE0DF`; przygaszone `#9CAFAC`, `#667F7B`; biel; **neonowa zieleń `#31CB00`** jako akcent (kwadracik w rogu przycisku, podkreślenia linków, gwiazdki opinii, plus w FAQ). |
| Typografia | **General Sans** (body 17–18 px, `-0.01em`, etykiety 10–12 px wersaliki 0,12 em z kwadratowym znacznikiem) + **szeryfowy krój display** w nagłówkach H1/H2 (transitional serif, waga regular). |
| Geometria | Promień 0–2 px. Karty białe z 1 px obrysem. Dekoracyjne linie siatki (papier milimetrowy) w tle sekcji. Ikony w ciemnozielonych kwadratach. Chipy z ikoną „check" dla pod-usług. |
| Rytm | Długa strona (~11 300 px), 13 sekcji, każda z nadnagłówkiem SEO („Adwokat Gliwice…"). |
| Ruch | Standardowe fade-in Elementora. Cookie banner (CookieYes) zasłania hero. |

### Sekcje strony głównej
1. **Hero ciemnozielony**: nadnagłówek SEO, H2 jako tytuł, 2 akapity, 2 CTA (biały + obrys), odznaka ocen Google, portret wycięty z tła.
2. **Pas liczb** (8+, 100+, 100 mln zł) z małą strzałką wzrostu, na ciemnym.
3. **Wprowadzenie** (H2 szeryfowy + 2 akapity justowane).
4. **Usługi: siatka 2 × 3 kart** — ikona w kwadracie, nadnagłówek, tytuł, **chipy pod-usług**, link „Sprawdź szczegóły". Bardzo skanowalne.
5. **Pas szkoleń** na wybielonym zdjęciu biurowym, centrowany.
6. **„Dlaczego potrzebujesz adwokata"**: 3 równe karty z ikonami + para CTA.
7. **Pas flag** (kraje klientów).
8. **O mnie na ciemnej zieleni**: tekst + wycięty portret + faksymile podpisu.
9. **Opinie**: 5 białych kart z cudzysłowem i gwiazdkami (Google).
10. **Formularz wyceny** na ciemnej zieleni, 2 kolumny.
11. **Blog**: 3 karty ze zdjęciami dokumentów.
12. **FAQ**: 10 pytań, centrowany akordeon.
13. **Pas CTA + stopka** ciemne.

### Decyzje, które warto zrozumieć
- Strona jest zbudowana pod **konwersję i SEO**: dowody zaufania na każdym ekranie (liczby, Google, flagi, opinie), „Poznaj wycenę" powtarzane sześć razy.
- Chipy pod-usług pokazują zakres bez ściany tekstu — to najlepszy element tej strony.
- Ciemna zieleń + neon dają rozpoznawalność, ale też ciężar; strona jest przeładowana (13 sekcji, 3 rodzaje kart, dekoracyjne siatki).

### Bierzemy / nie bierzemy
✓ Chipy pod-usług w kafelkach zakresu (jako opcja). ✓ Opinie i odznakę Google, jeżeli klientka ma opinie. ✓ Godziny/CTA w stopce. ✓ Logikę „dla kogo → dlaczego → kto".
✗ Ciemną zieleń (klientka wykluczyła). ✗ Neonowy akcent, dekoracyjne siatki, wycinane portrety, faksymile podpisu. ✗ Nadnagłówki SEO w każdej sekcji. ✗ Trzy równe karty z ikonami. ✗ Długość strony — u nas maksymalnie 9 sekcji.

---

## 3. Stoch (NSM Legal & Tax, lokalny mockup) — „butikowa redakcja z jednym złotym akcentem"

### System (z `css/styles.css` i `design-system.html`)
| Warstwa | Co jest |
|---|---|
| Paleta | Papier `#F7F5F0`, głębszy papier `#EFECE4`, karty `#FCFBF8`, ciepła czerń `#1C1B18`, tekst drugorzędny `#6E6A61`, **złoto `#B08D42`** (warianty: tekst `#85682B`, kursywa `#A5823A`, na ciemnym `#CFAE63`). Ciemne akty (O mnie, pas CTA, kontakt, stopka). |
| Typografia | **Jost** 300/400 (H1, H2, wielkie numery) + **Instrument Sans** 400–600 (body, UI). Reguła firmowa: **jedna fraza złotą kursywą w każdym H1/H2**. Kicker: linia 32 px + rozstrzelone wersaliki w złocie. |
| Geometria | Przyciski 2 px, **sygnatura: ścięty prawy-dolny róg 0 0 48 px 0** na portretach i wyróżnionych kartach. Hairline zamiast cieni. Kontener 1240 px. |
| Rytm | Sekcje `clamp(5rem, 9vw, 8.5rem)`, jasna po jasnej bez górnego paddingu, nigdy więcej niż 3 jasne sekcje z rzędu. |
| Ruch | Reveal `translateY(24px)` 900 ms, stagger 100–120 ms, jeden easing; hero timeline; parallax portretu 5 %. |
| Zdjęcia | Ciepły monochrom (`grayscale + sepia .22`), portret w hero z `mix-blend-mode: multiply`. |

### Sekcje strony głównej
1. **Hero split**: kicker, H1 ze złotą kursywą, lead, 2 CTA, linia uprawnień (nr wpisów), portret sepia prawo. (Plus 3 warianty hero do wyboru dla klientki.)
2. **„Dwa końce sprawy"**: para kart połączona kółkiem „jedna osoba" — wizualizacja podwójnych uprawnień.
3. **Oferta jako indeks sytuacji** („Kiedy chcesz mieć spokój z rozliczeniami…"): numer / tytuł sytuacji + opis / lista linków do usług.
4. **O mnie — ciemny akt**: portret w złotej ramce, biogram, cytat kursywą.
5. **Zespół**: 4 karty osób (placeholdery numerowane).
6. **Współpraca**: 4 kroki na osi z kropkami + **pas konkretów** (czas odpowiedzi, zasięg, rozliczenie, wielkość klienta).
7. **Pas CTA ciemny**, centrowany.
8. **Media**: siatka logotypów redakcji.
9. **Opinie**, 10. **Baza wiedzy** (3 karty), 11. **FAQ** (tytuł lewo, akordeon prawo), 12. **Kontakt ciemny**, 13. **Stopka ciemna**.

### Decyzje, które warto zrozumieć
- Oferta nazwana **od sytuacji klienta**, nie od gałęzi prawa — obniża próg wejścia.
- Jeden akcent = cała „drogość". Złoto jest przyprawą (linie, numery, kursywa), nigdy tłem.
- Ciemne akty jako rytm strony; jasne i ciemne przeplatają się.
- Design system jest **żywym dokumentem HTML** na tym samym CSS co mockup — format, który powtarzamy tu.

### Bierzemy / nie bierzemy
✓ Ciepłą papierową bazę (klientka chce beże) — ale w innym, głębszym odcieniu. ✓ Hero split z portretem. ✓ Format DS + mockup na wspólnym CSS. ✓ Spec ruchu (jeden easing, reveal raz, pełny fallback). ✓ Nazewnictwo oferty od sytuacji klienta jako opcję na podstrony.
✗ Ciemne akty (klientka: jasno). ✗ Złotą kursywę i kicker z linią — to sygnatura NSM. ✗ Ścięty róg. ✗ Sepia. ✗ Jost/Instrument Sans — te same kroje sprawiłyby, że strony wyglądają jak rodzeństwo.

---

## 4. cupial-kowalska.pl — obecna strona klientki (co jest do wzięcia)

**Stan:** szablon Bootstrap z ok. 2016 r. Złoto `#C19B69` + ciemny `#202126` + biel, Helvetica/Arial, slider hero na stockowej Temidzie, „Kancelaria" w 5 zdaniach, 8 usług jako ikony na czarnym, mapa Google, stopka. Brak CTA poza numerem w nagłówku.

**Treść do przeniesienia (zweryfikowana ze strony):**
- Bio: absolwentka WPiA Uniwersytetu Łódzkiego, praca magisterska 2013 (postępowanie cywilne), aplikacja adwokacka 2014–2016 przy ORA w Częstochowie, egzamin i wpis na listę adwokatów 2017.
- 8 obszarów z opisami: umowy, prawo cywilne, prawo karne, postępowanie administracyjne, prawo rodzinne, prawo pracy, prawo spadkowe, dochodzenie odszkodowań.
- Hasła ze slidera: „Stoję na straży Twoich interesów", „Bronię Ciebie, kiedy czujesz się bezsilny", „Uczę szacunku do prawa tych, którzy go nie szanują". (Trzecie odpada — brzmi konfrontacyjnie.)
- Kontakt: ul. Kilińskiego 5 lok. 4, 42-202 Częstochowa (lewa oficyna, I piętro, po prawej); 534 477 596; kancelaria@cupial-kowalska.pl.
- Godziny: pn–wt 8:30–17:00, śr–czw 8:30–15:00, pt po umówieniu; możliwość spotkania poza godzinami; prośba o wcześniejszy telefon.

**Elementy tożsamości:** sześciokątny sygnet z monogramem „B" + szeryfowy wordmark „Beata Cupiał-Kowalska / Adwokat" w złocie. To jedyne, co ma wartość marki — do odrysowania w wektorze.

**Do wycofania:** slider, stockowa Temida, czarne kafle z ikonami, justowanie, brak CTA.

---

## 5. Wnioski — kierunek dla Cupiał-Kowalskiej

**Odczyt briefu (design read):** strona kancelarii jednoosobowej dla klientów indywidualnych i małych firm z Częstochowy; język **ciepły, spokojny, redakcyjny**; jasna beżowa baza bez ciemnych sekcji; „treść ponad wizualizację" — więc typografia i światło robią całą robotę.

**Pokrętła (wg skillu design-taste-frontend):** DESIGN_VARIANCE 7 · MOTION_INTENSITY 3 · VISUAL_DENSITY 3.
Wariancja podniesiona z 5 do 7 po wersji 1: przy tak oszczędnej palecie i braku ozdób rytm strony musi budować kompozycja, więc w wersji 2 **żaden układ sekcji się nie powtarza** (schematy: `design-system.html`, sekcja 03).

**Czym różnimy się od trzech referencji jednocześnie:**

| | Taczkowska | Stoch | Grubizna | **Cupiał-Kowalska** |
|---|---|---|---|---|
| Tło | zimna biel + greige | jasny papier + ciemne akty | ciemna zieleń | **len `#F3EDE3` + piasek `#E9E0D0`, bez ciemnych sekcji** |
| Tekst | tusz z zielonym podkładem | ciepła czerń | ciemna zieleń | **umbra `#3A2F27` (brąz, nie czerń)** |
| Akcent | brak | złoto | neon | **brąz `#7E5E36` wyprowadzony ze złota logo klientki, tylko na elementach klikalnych** |
| Display | Inter 300 | Jost 300 + złota kursywa | serif | **Schibsted Grotesk 500** |
| Body | Inter | Instrument Sans | General Sans | **Source Serif 4** (szeryf w treści, nie w nagłówkach) |
| Kształt | 0 px, ostro | 2 px + ścięty róg | 0–2 px | **miękkie 8 px / 6 px, zero cieni** |
| Zdjęcia | cz-b | sepia | kolor, wycinane | **kolor, ciepłe światło dzienne, w ramce 8 px** |
| Sygnatura | mono-etykiety | złota kursywa | zielony kwadracik | **szeryfowa treść na lnie + pasy piasku** |

Szczegóły tokenów, dziewięciu układów sekcji i komponentów: `design-system.html` (żywy dokument na `css/styles.css`). Mockup strony głównej z komentarzami: `mockup.html`. Pytania i przyjęte założenia: `docs/PYTANIA.md`.
