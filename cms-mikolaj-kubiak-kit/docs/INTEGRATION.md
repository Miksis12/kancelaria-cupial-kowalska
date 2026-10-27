# INTEGRATION — szybka integracja (dla człowieka)

Pełny model i pułapki: `AI-AGENT-GUIDE.md`. Tu skrót.

## 1. Wgraj wtyczkę
Skopiuj `plugin/cms-mikolaj-kubiak` → `wp-content/plugins/`.

## 2. Oznacz edytowalne treści
Każdy edytowalny fragment szablonu owiń helperem:
```php
<?php cmk_block('home:p:intro', function () { ?><p class="lead">Tekst…</p><?php }); ?>
<?php cmk_img('home:img:hero', function () { ?><img class="hero" src="…" width="1600" height="900"><?php }); ?>
```
- **Automatycznie:** w buildzie motywu przepuść HTML przez `tools/annotate.mjs` (owija elementy + generuje manifest). 
- **Ręcznie:** owiń wybrane fragmenty samodzielnie (klucz unikalny i stabilny).
- **Automatycznie edytowalny jest każdy widoczny tekst** w `<main>` (nagłówki, akapity, listy, etykiety/tytuły kart w `<span>`/`<div>` oraz w tagach inline użytych jako samodzielny nagłówek — `<strong>`/`<b>`/`<em>`/`<label>`…) + obrazy. Annotate schodzi do kontenerów i owija najmniejszy element z tekstem; prozę z inline `<span>`/`<a>`/`<strong>` owija w całości.
- **Akordeony/FAQ i przyciski:** treść w zwiniętych kartach oraz nagłówki uwięzione w `<button>` bywają nieedytowalne — kit rozwiązuje to sam w trybie edycji, ale przy budowie motywu przeczytaj sekcję 6 w `AI-AGENT-GUIDE.md`.
- Inline-`<svg>` jest OK (atomowe, chronione przy zapisie). Pomijane są tylko: dekoracje `aria-hidden`, elementy bez tekstu oraz **linki `tel:`/`mailto:`** (żeby edycja nie rozjechała numeru/e-maila z `href`).

## 3. Manifest kluczy
Wygeneruj `THEME/inc/cmk-keys.php` (robi to `annotate.mjs`). Przy ręcznym podejściu możesz wyłączyć whitelistę: `add_filter('cmk_require_manifest','__return_false');`.

## 4. functions.php motywu
Wklej snippet z `examples/functions-snippet.php`:
- fallback `cmk_block`/`cmk_img` (strona działa bez wtyczki),
- opcjonalnie `cmk_ui` (branding UI — patrz `THEMING.md`).

## 5. Aktywuj
`wp plugin activate cms-mikolaj-kubiak`. Klientowi nadaj rolę **Redaktor** (lub Administrator).

## 6. Użycie (klient)
Zaloguj się do `/wp-admin`, wejdź na stronę, kliknij **„✎ Edytuj stronę"** (róg). Klikasz w tekst i piszesz; B/I/link; klik w zdjęcie → biblioteka mediów. **Zapisz szkic** → **Podgląd** → **Publikuj**.

## 7. Sprawdź
HTML dla gościa = jak przed integracją (1:1). REST `/{namespace}/content` bez logowania → 401. Edycja → szkic → publikacja → widoczne dla gościa.

## Migracja na produkcję
Wtyczka = pliki; treści = `wp_postmeta`/`wp_options`. Pełny backup (WPVivid/Duplicator) przenosi komplet.
