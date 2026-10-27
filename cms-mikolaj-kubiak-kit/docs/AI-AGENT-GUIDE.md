# AI-AGENT-GUIDE — wdrożenie kitu „CMS-Mikołaj Kubiak" na nową stronę

Czytasz to jako instancja AI, która ma dodać edycję „na stronie" do projektu WordPress. Poniżej masz cały model i procedurę. Trzymaj się jej; na końcu jest checklista akceptacji.

## 1. Cel
Klient ma edytować treść (teksty + obrazy) **wprost na żywej stronie**, zapisać **szkic**, podejrzeć i **opublikować**. Wygląd strony dla gościa musi pozostać **1:1** (wtyczka nie zmienia renderu gościa). UI edytora ma przejąć brand strony (kolor/font).

NIE używaj gotowców (Elementor/Editus/Divi) — edytują `post_content`/bloki; ten kit edytuje treść renderowaną z **szablonów PHP**, nie ruszając układu.

## 2. Architektura (musisz to rozumieć)
- **Helper w szablonie:** każdy edytowalny fragment woła
  `<?php cmk_block('KLUCZ', function () { ?>…DOMYŚLNY HTML ELEMENTU…<?php }); ?>`
  (obrazy: `cmk_img('KLUCZ', function(){ ?><img …><?php });`).
  Forma z **domknięciem** sprawia, że dynamiczny PHP w środku (np. `home_url()`) nadal działa.
- **Render (wtyczka, `inc/render.php`):** uruchamia domknięcie → ma `default`. Jeśli istnieje override dla KLUCZA → zachowuje tag otwierający/zamykający defaultu, podmienia **tylko innerHTML**. `data-cmk`/`data-cmk-img` dokleja **wyłącznie dla redaktora** (gość: czysto 1:1).
- **Klucz:** `{scope}:{tag}:{hash8(widoczny_tekst)}`; `scope` = slug strony albo `global` (komponenty współdzielone, np. baner CTA — edycja raz = wszędzie). Hash z treści → stabilny przy przestawianiu sekcji.
- **Storage (sloty draft/live):** per strona `post meta _cmk_live` / `_cmk_draft`; globalne `option cmk_global_live` / `cmk_global_draft`. Sentinel `__CMK_RESET__` = „wróć do szablonu".
- **Render dla gościa = LIVE.** Redaktor z `?cmk_preview=1` = LIVE+DRAFT (draft wygrywa).
- **REST (`inc/rest.php`, namespace domyślnie `cmk/v1`):** `/content` (zapis draft), `/publish` (draft→live + czyszczenie cache), `/discard`. `permission_callback = current_user_can(cmk_capability())`, nonce `X-WP-Nonce`, sanityzacja `wp_kses` (tekstowa allowlista), walidacja kluczy wg manifestu.
- **Edytor (`inc/admin.php` + `assets/editor.js`/`editor.css`):** ładowany TYLKO dla redaktora. Przycisk „✎ Edytuj stronę" → tryb edycji (`contenteditable` na `[data-cmk]`, pasek: Zapisz szkic / Podgląd / Publikuj / Odrzuć / Wyjście; B/I/link/reset; podmiana obrazów przez `wp.media`; autosave; guard niezapisanych zmian).
- **Fallback:** jeśli wtyczka nieaktywna, motyw definiuje `cmk_block`/`cmk_img` jako „echo default" → strona = 1:1.

## 3. Procedura wdrożenia

### Krok 0 — wymagania
Klasyczny motyw WP, PHP 8+. Treść renderowana z szablonów PHP. Najlepiej, gdy motyw używa zmiennych CSS w `:root` (np. `--c-orange`, `--font`) — wtedy UI edytora dopasuje się sam.

### Krok 1 — wgraj wtyczkę
Skopiuj `plugin/cms-mikolaj-kubiak` → `wp-content/plugins/cms-mikolaj-kubiak`. (Aktywujesz w kroku 5.)

### Krok 2 — oznacz edytowalne fragmenty (`cmk_block`/`cmk_img`)
Dwie ścieżki:

**A) Motyw generowany z HTML (zalecane, jak w „Borkowska"):** w buildzie motywu uruchom `tools/annotate.mjs` na HTML `<main>` każdej strony (PO własnych podmianach linków/assetów). Funkcja:
```js
import { annotate } from './tools/annotate.mjs';
const { html, keys } = annotate(bodyHtml, slug); // owija elementy w cmk_block/cmk_img
```
Zbierz `keys` wszystkich stron do manifestu (krok 3). Konfiguracja na górze `annotate.mjs`: `BLOCK_TAGS` (proza), `LEAF_TAGS` (`span`/`div` — owijane tylko jako liść tekstowy), `GLOBAL_SELECTOR` (klasa sekcji globalnej), `BLOCK_FN`/`IMG_FN`.

Domyślnie annotate czyni edytowalnym **każdy widoczny tekst** w `<main>` (nagłówki, akapity, listy, etykiety/karty w `<span>`/`<div>`, a także tekst w tagach inline użytych jako **samodzielny nagłówek/etykieta** — `<strong>`, `<b>`, `<em>`, `<label>`, `<time>`…, np. tytuł karty zapisany jako `<strong style="display:block">`) oraz obrazy. Automatycznie wyklucza jedynie: dekoracje `aria-hidden`, elementy bez tekstu oraz **linki `tel:`/`mailto:`** (patrz niżej).

**B) Motyw pisany ręcznie:** owiń istotne fragmenty sam:
```php
<?php cmk_block('home:p:intro', function () { ?><p class="lead">Tekst wstępu…</p><?php }); ?>
```
Klucz musi być **unikalny i stabilny**. Dla obrazów `cmk_img('home:img:hero', function(){ ?><img class="hero" src="…" width=… height=…><?php });`.

**Kontenery, linki i SVG (ważne, nie cofaj):**
- **Proza w całości:** blok (`<p>`/`<h*>`/`<li>`/`<summary>`…) z inline `<span>`/`<a>`/`<em>` jest owijany JAKO CAŁOŚĆ — tekst prozy zostaje edytowalny, a wewnętrzne formatowanie/linki zachowane. Blok schodzi w głąb tylko gdy zawiera **zagnieżdżony blok** (np. `<li>` z `<p>`).
- **Kontenery/liście:** `<div>`/`<span>` (oraz anchory nie-tel/mailto) są owijane tylko gdy są **liściem tekstowym**; jeśli zawierają zagnieżdżonych kandydatów — annotate **schodzi do środka** i owija liście osobno (dzięki temu tytuły/podtytuły kart w `<span>` są edytowalne, a wrappery strukturalne nie są owijane w całości).
- **Inline użyte jako nagłówek/etykieta:** `<strong>`/`<b>`/`<em>`/`<label>`/`<time>`… stojące **samodzielnie** (tytuł karty typu `<strong style="display:block">…`) są owijane jako liść → edytowalne. To samo `<strong>` **wplecione w prozę** (`<p>… <strong>x</strong> …</p>` lub `<a>Czytaj <strong>więcej</strong></a>`) NIE jest owijane osobno — rodzic-blok/anchor owija się w całości (żadnego podwójnego owijania). Sterują tym `INLINE_LEAF_TAGS` na górze `annotate.mjs`.
- **Zmienne PHP w owijanym elemencie:** jeśli owijany fragment odwołuje się do zmiennej motywu (np. `<img src="<?php echo $t; ?>/…">`, `$t = get_template_directory_uri()`), annotate dokłada `use (…)` do domknięcia (przechwyt WARUNKOWY — tylko realnie użyte zmienne; superglobale/`$this` pomijane). Bez tego `$t` byłoby puste → `src="/assets/…"` (root domeny) → 404.
- **Linki:** anchory prowadzące do sekcji/podstron są edytowalne w warstwie tekstu (`href` zawsze zachowany przy zapisie). **Wyjątek:** `tel:`/`mailto:` — cały anchor jest pomijany (edycja rozjechałaby widoczny numer/e-mail z `href`); dodatkowo `editor.js` blokuje edycję takich linków wplecionych w akapit (`contenteditable=false`, jak SVG).
- Inline-`<svg>` JEST dozwolone (atomowe): w edytorze `contenteditable=false`, a przy zapisie `cmk_sanitize()` chroni je przed `wp_kses` (placeholder → kses tekstu → przywrócenie SVG z `viewBox`). **Nie wykluczaj** elementów z SVG.
- **Czego NIE owijać:** fragmenty w 100% dynamiczne (same `<?php …?>`), dekoracje `aria-hidden`, linki `tel:`/`mailto:`.

### Krok 3 — manifest kluczy (whitelist)
Wtyczka przyjmuje zapis tylko dla kluczy z manifestu `THEME/inc/cmk-keys.php`:
```php
<?php return array(
  'home'   => array( 'home:h2:ab12cd34' => 'Podgląd nagłówka', /* … */ ),
  'global' => array( 'global:h2:ff00aa11' => 'Masz sprawę?…' ),
);
```
`annotate.mjs` generuje go automatycznie. Przy ścieżce ręcznej albo wygeneruj listę, albo wyłącz whitelistę: `add_filter('cmk_require_manifest','__return_false');` (mniej bezpieczne, ale wygodne przy prototypie).

### Krok 4 — fallback + (opcjonalnie) branding UI w `functions.php` motywu
Wklej z `examples/functions-snippet.php`:
- fallback `cmk_block`/`cmk_img` (strona działa bez wtyczki = 1:1),
- (opcjonalnie) `add_filter('cmk_ui', …)` jeśli motyw NIE używa `--c-orange`/`--font` — zmapuj swoje tokeny na akcent/font edytora (patrz `docs/THEMING.md`),
- (opcjonalnie) `cmk_namespace` / `cmk_capability` / `cmk_manifest_path` jeśli potrzebujesz innych wartości niż domyślne.

### Krok 5 — aktywuj i ustaw uprawnienia
`wp plugin activate cms-mikolaj-kubiak`. Edytor widzą użytkownicy z `edit_pages` (rola Redaktor/Administrator). Klient = rola Redaktor.

### Krok 6 — weryfikacja (zrób ZAWSZE)
Patrz checklista niżej. Kluczowe: **render gościa = 1:1** (porównaj HTML przed/po — różnić się może tylko obecność `data-cmk` u zalogowanego redaktora i `?ver`).

## 4. Pułapki (znane, nie powtarzaj błędów)
- **Inline-SVG:** dozwolone jako atomowe. `wp_kses` psuje camelCase `viewBox`, dlatego zapis idzie przez `cmk_sanitize()` (chroni SVG), a edytor blokuje edycję SVG (`contenteditable=false`). NIE wracaj do wykluczania elementów z SVG.
- **Stabilność kluczy:** klucz = hash *widocznego tekstu*. Po starcie edytora **treść redakcyjną zmienia się w edytorze (DB), a nie w źródłach motywu**; źródła/generator służą strukturze. Zmiana domyślnego tekstu w źródle → klucz się zmienia (override „odpina się"). To celowe; udokumentuj klientowi.
- **PHP zjada `\n` po `?>`:** annotate dokłada `\n` po wrapperze, żeby render był bajt-w-bajt. Przy ręcznym owijaniu nie przejmuj się (różnice białych znaków nie zmieniają wyglądu).
- **Cache stron na produkcji:** `/publish` woła `cmk_purge_caches()` (popularne wtyczki). Jeśli host ma inny cache — dopnij hook.
- **Migracja:** override'y siedzą w `wp_postmeta`/`wp_options`, wiązane po `post_id`. Pełny backup (WPVivid/Duplicator) przenosi komplet; nie odpalaj destrukcyjnego setupu po wprowadzeniu treści.
- **404 i strony bez posta:** edycja działa na stronach z `post_id` (`is_page()`/front). Klucze `global:*` działają wszędzie (opcje).
- **Tekst uwięziony w `<button>` / w zwiniętym panelu (akordeon, tab):** patrz sekcja 6 — to najczęstszy powód „nie da się edytować tego nagłówka / tej karty". Edytor radzi sobie z tym sam w trybie edycji, ale motyw trzeba znać.

## 5. Filtry konfiguracyjne (PHP)
- `cmk_namespace` (domyślnie `'cmk/v1'`), `cmk_capability` (`'edit_pages'`), `cmk_manifest_path` (`THEME/inc/cmk-keys.php`), `cmk_require_manifest` (`true`), `cmk_ui` (mapa akcent/font/tła UI — patrz THEMING.md).

## 6. Wymagania po stronie motywu (komponenty interaktywne)
Część problemów z edycją NIE leży we wtyczce, tylko w **markupie/JS motywu**. Kit radzi sobie z nimi w trybie edycji (poniżej), ale przy budowie motywu warto ustawić to od razu — inaczej klient zgłosi „nie da się edytować tego nagłówka / otworzyć tej karty".

### 6.1 Tekst edytowalny wewnątrz `<button>` (nagłówek akordeonu)
Jeśli edytowalny nagłówek jest **dzieckiem `<button>`** (typowy trigger akordeonu FAQ: `<button><h3>Pytanie</h3></button>`), część przeglądarek (Firefox, Safari, część wersji Chromium) **nie pozwala postawić kursora** w treści przycisku — mimo `contenteditable` nie da się go edytować (przycisk to atomowa kontrolka).
- **Kit (automat):** w trybie edycji `editor.js` podmienia każdy `<button>` zawierający `[data-cmk]`/`[data-cmk-img]` na `<div role="button" data-cmk-was-button>` (kopiuje atrybuty, przenosi dzieci). Zmiana dotyczy **wyłącznie DOM edytora u redaktora** — nie jest zapisywana ani widziana przez gościa. Edycja działa cross-browser.
- **Zalecenie przy budowie motywu:** trigger akordeonu buduj jako `<div role="button" tabindex="0">…` **albo** trzymaj edytowalny nagłówek **jako rodzeństwo** przełącznika (nie jego dziecko). Wtedy problem nie występuje u nikogo.

### 6.2 Treść ukryta w zwijanym panelu (akordeon / tab / „pokaż więcej")
Odpowiedzi w zamkniętych kartach FAQ siedzą w panelu `max-height:0; overflow:hidden` (albo `display:none`/`[hidden]`). Klient nie dosięgnie ich, dopóki panel jest zwinięty.
- **Kit (automat):** przy wejściu w tryb edycji `editor.js` **odsłania** każdy taki panel zawierający `[data-cmk]` (podnosi `max-height`, `overflow:visible`, zdejmuje `hidden`/`display:none`) — wszystkie fragmenty stają się widoczne i edytowalne naraz. Odsłanianie celuje tylko w kontenery z sygnaturą zwijania (`overflow:hidden` + skończony `max-height`), więc nie rusza kadrów obrazów.
- **Osobna sprawa — przełączanie dla GOŚCIA:** kit **nie** dostarcza JS przełączającego akordeon/taby na żywej stronie. To zadanie motywu. Jeśli motyw pochodzi z prerenderu statycznego (React→HTML) i **nie ma** własnego handlera, komponent jest „zamrożony" dla odwiedzających (pierwsza karta otwarta na stałe, reszta zamknięta, klik nic nie robi) — dopisz krótki vanilla-toggle w JS motywu (zdarzenie `click` na triggerze → przełącz `aria-expanded` + `max-height` panelu + obrót strzałki). To błąd strony niezależny od CMS-a, ale wychodzi przy okazji edycji.

### 6.3 Elementy `aria-hidden`, SVG, `tel:`/`mailto:`
Świadomie nieedytowalne (dekoracje / rozjazd href↔tekst) — patrz Krok 2 i Pułapki. To celowe, nie zgłaszaj jako braku.

## 7. Checklista akceptacji
- [ ] Wtyczka aktywna; strony zwracają 200.
- [ ] **Gość: HTML 1:1** względem stanu sprzed integracji (poza `data-cmk` u redaktora). 
- [ ] `POST /wp-json/{namespace}/content` bez logowania → 401.
- [ ] Zalogowany redaktor: „✎ Edytuj stronę" widoczne; pasek/przyciski w kolorach strony (akcent/font hosta).
- [ ] Edycja akapitu → Zapisz szkic → Podgląd pokazuje zmianę, gość (incognito) jeszcze nie → Publikuj → gość widzi.
- [ ] Próba zapisu `<script>` zostaje wycięta przez `wp_kses`. Nieznany klucz (z manifestem) odrzucony.
- [ ] Podmiana obrazu działa (zachowane proporcje/kadr). „Reset" przywraca default.
- [ ] (Jeśli dotyczy) komponent globalny (CTA) edytowany raz zmienia się na wszystkich stronach.
- [ ] **Nagłówki inline** (tytuły kart w `<strong>`/`<b>`/`<em>`…) są edytowalne (dostają `data-cmk`).
- [ ] **Akordeon/FAQ:** w trybie edycji wszystkie karty są odsłonięte, a nagłówek pytania w `<button>` daje się kliknąć i edytować (przycisk zamieniony na `<div data-cmk-was-button>`). Dla gościa akordeon nadal się przełącza (JS motywu) i render jest 1:1.
