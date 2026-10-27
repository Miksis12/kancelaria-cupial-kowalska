# CMS-Mikołaj Kubiak — kit edytora „na stronie"

Przenośny zestaw, który dodaje do dowolnego klasycznego motywu WordPress **edycję treści wprost na żywej stronie** (in-place, WYSIWYG) z przepływem **szkic → podgląd → publikuj**. Bez zewnętrznych usług/SaaS. Gość widzi stronę 1:1 (wtyczka nie zmienia wyglądu), a UI samego edytora **adaptuje się do brandu strony** (kolor akcentu, font).

> **Dla AI:** wdrażając ten kit na nową stronę, przeczytaj **`docs/AI-AGENT-GUIDE.md`** — to kompletna procedura krok po kroku.

## Co jest w środku
```
cms-mikolaj-kubiak-kit/
  plugin/cms-mikolaj-kubiak/   ← wtyczka WordPress (kopiujesz do wp-content/plugins/)
  tools/annotate.mjs           ← narzędzie Node: owija edytowalne elementy w cmk_block()/cmk_img() + manifest kluczy
  docs/
    AI-AGENT-GUIDE.md          ← „przeczytaj i wdróż" — dla przyszłej instancji AI
    INTEGRATION.md             ← integracja krok po kroku (dla człowieka)
    THEMING.md                 ← jak UI edytora adaptuje się do strony (filtr cmk_ui)
  examples/
    functions-snippet.php      ← fallback cmk_block + konfiguracja
    keys.example.php           ← przykładowy manifest
  README.md (ten plik)
  CHANGELOG.md                 ← historia zmian (co przybyło w kolejnych wersjach)
  VERSION
```

## Jak to działa (w skrócie)
1. Edytowalne fragmenty szablonu motywu wołają helper `cmk_block('klucz', function(){ ?>…domyślny HTML…<?php }); ?>` (analogicznie `cmk_img()` dla obrazów).
2. Wtyczka przy renderze: brak override → wypisuje default (+ `data-cmk` tylko dla zalogowanego redaktora); jest override → ten sam tag/atrybuty, podmieniony **tylko innerHTML** (po `wp_kses`).
3. Redaktor wchodzi w tryb edycji („✎ Edytuj stronę"), edytuje tekst/obrazy, zapisuje **szkic** (post meta `_cmk_draft` / opcje `cmk_global_draft`), podgląda (`?cmk_preview=1`), **publikuje** (draft→`_cmk_live`).
4. Bez aktywnej wtyczki motyw ma fallback `cmk_block` (echo default) → strona = czyste 1:1.

## Zależności i bezpieczeństwo
- Klasyczny motyw WP (nie wymaga block theme). PHP 8.0+. Brak zewnętrznych usług.
- Zapis tylko dla `current_user_can('edit_pages')`, nonce `X-WP-Nonce`, `wp_kses` (tekstowa allowlista), walidacja kluczy wg manifestu.
- Migracja między środowiskami: wtyczka = pliki, treści = `wp_postmeta`/`wp_options` → przenosi je każdy pełny backup (np. WPVivid).

## Szybki start
Patrz `docs/INTEGRATION.md` (człowiek) lub `docs/AI-AGENT-GUIDE.md` (AI). Referencyjne wdrożenie: projekt „Borkowska" (motyw `sprawna-kancelaria`).
