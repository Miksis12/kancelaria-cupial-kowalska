# THEMING — jak UI edytora dopasowuje się do strony

UI edytora (przycisk „Edytuj", dolny pasek, przyciski, obrysy pól, toast) nie ma sztywnych kolorów — używa zmiennych `--cmk-*`. Wtyczka ustawia je dla redaktora (inline `<style>` w `wp_head`), domyślnie czytając **tokeny brandu strony**. Dzięki temu po wrzuceniu kitu na inny site edytor wygląda „swojo".

## Zmienne UI
| Zmienna | Rola | Domyślnie (z filtra `cmk_ui`) |
|---|---|---|
| `--cmk-accent` | kolor akcentu (przyciski, obrysy, tytuł paska) | `var(--c-orange, #F26722)` |
| `--cmk-accent-2` | akcent hover | `var(--c-orange-hover, #E15A12)` |
| `--cmk-on-accent` | tekst na akcencie | `#ffffff` |
| `--cmk-bar-bg` | tło dolnego paska | `var(--c-olive-deep, #23231e)` |
| `--cmk-bar-fg` | tekst paska | `var(--c-on-dark, #f6f3ec)` |
| `--cmk-font` | krój pisma UI | `var(--font, system-ui…)` |

Jeśli motyw definiuje `--c-orange` / `--font` w `:root` — **nie musisz nic robić**, edytor je przejmie.

## Gdy motyw używa innych nazw zmiennych
Zmapuj swoje tokeny filtrem `cmk_ui` w `functions.php`:
```php
add_filter( 'cmk_ui', function ( $ui ) {
    $ui['accent']    = 'var(--brand, #0a7)';        // Twój token akcentu
    $ui['accent-2']  = 'var(--brand-dark, #086)';
    $ui['on-accent'] = '#fff';
    $ui['bar-bg']    = '#1b1b1b';
    $ui['bar-fg']    = '#f3f3f3';
    $ui['font']      = 'var(--font-sans, system-ui)';
    return $ui;
} );
```
Możesz podać wartości stałe (`#0a7`) albo referencje do zmiennych hosta (`var(--brand)`).

## Uwaga
- Wartości trafiają do inline `<style>:root{--cmk-…}</style>` ładowanego TYLKO dla redaktora — gość ich nie dostaje.
- To dotyczy wyłącznie **wyglądu narzędzia**. Render treści strony dla gościa pozostaje 1:1.
