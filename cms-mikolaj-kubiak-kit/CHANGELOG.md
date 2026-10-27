# Changelog — CMS-Mikołaj Kubiak

## 1.2.0 — 2026-07-07
Cel wydania: **„da się edytować totalnie wszystko"** — usunięcie trzech klas fragmentów,
które przy standardowej instalacji zostawały nieedytowalne.

### annotate.mjs
- **Nagłówki inline są teraz edytowalne.** Samodzielne tagi inline użyte jako nagłówek/etykieta
  (`<strong>`, `<b>`, `<em>`, `<i>`, `<u>`, `<s>`, `<mark>`, `<small>`, `<cite>`, `<q>`, `<code>`,
  `<abbr>`, `<dfn>`, `<time>`, `<label>`, `<address>`, `<ins>`, `<del>`, `<sub>`, `<sup>`, `<kbd>`,
  `<samp>`, `<var>`, `<output>`, `<data>`) są owijane jak liść tekstowy. Rozwiązuje „nie da się
  dotykać nagłówków kart" tam, gdzie tytuł to `<strong style="display:block">` zamiast `<h3>`.
  Te tagi WPLECIONE w prozę/anchor nadal nie są owijane osobno (rodzic owija się w całości) —
  brak podwójnego owijania. Konfiguracja: `INLINE_LEAF_TAGS`.
- **Warunkowe `use (...)` w domknięciu.** Zmienne PHP użyte w owijanym elemencie (np.
  `$t = get_template_directory_uri()` w `<img src="<?php echo $t; ?>/…">`) są przechwytywane do
  domknięcia — ale tylko gdy realnie występują (superglobale/`$this` pomijane). Zapobiega
  `src="/assets/…"` → 404, bez ryzyka `Undefined variable` na motywach bez danej zmiennej.
- `button` dodane do `NESTED_CANDIDATE_RE` — kontener z `<button>` (np. pille) schodzi w głąb,
  a same przyciski nie są owijane w źródle.

### editor.js (tryb edycji redaktora)
- **Odblokowanie nagłówków uwięzionych w `<button>`.** Przeglądarki (Firefox, Safari, część
  wersji Chromium) nie pozwalają postawić kursora w treści `<button>` → nagłówek pytania FAQ
  (`<button><h3>…</h3></button>`) był nieedytowalny mimo `contenteditable`. W trybie edycji taki
  przycisk jest zamieniany na `<div role="button" data-cmk-was-button>` (atrybuty + dzieci
  zachowane). Wyłącznie DOM edytora — nie zapisywane, gość widzi 1:1.
- **Odsłanianie zwiniętych paneli.** Treść ukryta w zamkniętym akordeonie/tabie
  (`max-height:0; overflow:hidden`, `display:none`, `[hidden]`) jest odsłaniana przy wejściu w
  tryb edycji, więc każdy `[data-cmk]` jest widoczny i klikalny. Celuje tylko w kontenery z
  sygnaturą zwijania (nie rusza kadrów obrazów).

### docs
- `AI-AGENT-GUIDE.md`: nowa sekcja **6. Wymagania po stronie motywu (komponenty interaktywne)** —
  akordeony/przyciski, oraz uwaga, że przełączanie akordeonu dla GOŚCIA to zadanie JS motywu
  (kit go nie dostarcza). Nowe pozycje checklisty.
- `INTEGRATION.md`: noty o nagłówkach inline i akordeonach/przyciskach.

**Kompatybilność:** render dla gościa nadal 1:1. Istniejące klucze/override'y bez zmian
(nagłówki inline dodają NOWE klucze `:{tag}:` — nie kolidują z dotychczasowymi). Po aktualizacji
motywu generowanego przez `annotate.mjs` przebuduj szablony i manifest (`inc/cmk-keys.php`).

## 1.1.0
Pierwsza wersja kitu (edycja „na stronie", szkic→podgląd→publikuj, annotate.mjs, manifest,
branding UI, REST cmk/v1).
