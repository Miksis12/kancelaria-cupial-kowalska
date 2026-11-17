// build-wp-theme.mjs — ze strony statycznej robi klasyczny motyw WordPressa
// z edycją „na stronie" przez wtyczkę CMS-Mikołaj Kubiak.
//
//     node tools/build-wp-theme.mjs [ścieżka-do-katalogu-motywu]
//
// PO CO. Strona idzie na serwer klientki jako kopia zapasowa WordPressa
// (narzędzie do backupu przenosi tylko WP). Szablony PHP generujemy z tych
// samych plików HTML, więc projekt statyczny zostaje źródłem prawdy dla
// STRUKTURY i WYGLĄDU. Treść, którą klientka poprawi w edytorze, żyje w bazie
// (post meta `_cmk_live` / `_cmk_draft`) i przebudowa motywu jej nie kasuje.
// Uwaga: klucz CMK to hash widocznego tekstu — zmiana tekstu w HTML „odpina"
// poprawkę klientki w tym jednym miejscu. Tak działa kit, to świadome.
//
// CO JEST EDYTOWALNE. Tylko <main> każdej strony. Menu i stopkę składa
// js/site.js z tablic NAV / USLUGI / KONTAKT — zmienia się je tam i przebudowuje
// motyw. JSON-LD pod <main> też stoi w HTML i edytor go nie dotyka.
//
// CO SIĘ ZMIENIA WZGLĘDEM HTML (tylko technika, wygląd 1:1):
//   * linki `x.html` → home_url('/x/'), `index.html` → home_url('/'),
//   * `assets/`, `css/`, `js/` → katalog motywu; CSS i JS z `?v=` z hasha treści
//     (cache na serwerze klientki nie trzyma starej wersji po przebudowie),
//   * <script site.js> dostaje data-home — site.js przechodzi w tryb WP,
//   * wp_head() / wp_footer() — konieczne dla edytora CMK (śmieci WP zdejmuje
//     functions.php),
//   * teksty i obrazy w <main> owinięte w cmk_block() / cmk_img().

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

import { annotate } from '../cms-mikolaj-kubiak-kit/tools/annotate.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DOMYSLNY_MOTYW =
  'C:/Users/mikol/Local Sites/cupial/app/public/wp-content/themes/cupial-kowalska';
const MOTYW = process.argv[2] || process.env.WP_THEME_DIR || DOMYSLNY_MOTYW;

// Strony serwisu → strony WordPressa. slug = adres strony w WP i zakres kluczy
// CMK. design-system.html i mockup.html to dokumenty robocze — nie idą na WP.
export const STRONY = [
  { plik: 'index.html',                    slug: 'strona-glowna',            tytul: 'Strona główna' },
  { plik: 'o-mnie.html',                   slug: 'o-mnie',                   tytul: 'O mnie' },
  { plik: 'kontakt.html',                  slug: 'kontakt',                  tytul: 'Kontakt' },
  // noindex: schowana z menu, dopóki 12 pozycji prowadzi do przykładowego
  // szablonu (Mikołaj, 27.10.2026). Powrót: zdjąć flagę + NAV w site.js.
  { plik: 'baza-wiedzy.html',              slug: 'baza-wiedzy',              tytul: 'Baza wiedzy', noindex: true },
  { plik: 'rozwod-i-sprawy-rodzinne.html', slug: 'rozwod-i-sprawy-rodzinne', tytul: 'Rozwód i sprawy rodzinne' },
  { plik: 'sprawy-spadkowe.html',          slug: 'sprawy-spadkowe',          tytul: 'Sprawy spadkowe' },
  { plik: 'sprawy-karne.html',             slug: 'sprawy-karne',             tytul: 'Sprawy karne' },
  { plik: 'sprawy-cywilne.html',           slug: 'sprawy-cywilne',           tytul: 'Sprawy cywilne' },
  { plik: 'jazda-po-alkoholu.html',        slug: 'jazda-po-alkoholu',        tytul: 'Jazda po alkoholu' },
  { plik: 'mediacje.html',                 slug: 'mediacje',                 tytul: 'Mediacje' },
  // noindex: przykładowa treść, której klientka nie zatwierdziła — poza indeksem
  // i poza mapą witryny, dopóki nie powstaną prawdziwe wpisy.
  { plik: 'wpis-szablon.html',             slug: 'wpis-szablon',             tytul: 'Szablon wpisu', noindex: true },
  // Poza menu, link w stopce i przy zgodzie w formularzu. W WP to strona
  // wskazana w Ustawienia → Prywatność (opcja wp_page_for_privacy_policy).
  { plik: 'polityka-prywatnosci.html',     slug: 'polityka-prywatnosci',     tytul: 'Polityka prywatności' },
];

// Adresy STAREJ strony (Laravel, do 09.2026) → nowe. 301 zachowuje to, co stare
// adresy zebrały w Google (w indeksie były wszystkie cztery strony, na dwóch
// hostach). Klucz: ścieżka bez ukośników na brzegach, małymi literami.
// Wartość: '/x/' = strona WP, 'assets/…' = plik w katalogu motywu.
// Pełna analiza: docs/SEO-MIGRACJA.md.
const STARE_ADRESY = {
  'about':            '/o-mnie/',
  'contact':          '/kontakt/',
  'services':         '/',
  'img/about.png':    'assets/beata-cupial-kowalska.jpg',
  'img/favicon.png':  'assets/favicon-96.png',
  'img/gold21.png':   'assets/logo-cupial-kowalska.png',
  'img/gold11.png':   'assets/logo-cupial-kowalska.png',
};

const PLIK_NA_ADRES = new Map(STRONY.map(s =>
  [s.plik.replace(/\.html$/, ''), s.plik === 'index.html' ? '/' : `/${s.slug}/`]));

const T = '<?php echo $t; ?>';


// --- pomocnicze --------------------------------------------------------------

function odcisk(plik) {
  return createHash('sha1').update(fs.readFileSync(plik)).digest('hex').slice(0, 8);
}

function policz(tekst, fraza) {
  return tekst.split(fraza).length - 1;
}

function podmienRaz(tekst, fraza, nowa, gdzie) {
  const n = policz(tekst, fraza);
  if (n !== 1) throw new Error(`${gdzie}: „${fraza}" występuje ${n} razy, oczekiwano 1`);
  return tekst.replace(fraza, () => nowa);
}

function phpStr(s) {
  return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

/** Minifikacja CSS bez zależności (12.11.2026). Wycina komentarze i zbędne
 *  białe znaki: spacje zostają pojedyncze, znikają tylko przy { } ; , oraz
 *  po „:", a średnik przed „}" odpada. Zawartości cudzysłowów nie dotyka,
 *  wartości i selektorów nie przerabia — spacja przed „(" zostaje (`and (`
 *  w @media), `+`/`-` w calc() też. Źródło w css/ zostaje czytelne. */
export function minifikujCss(css, gdzie = 'CSS') {
  let out = '';
  let spacja = false;
  for (let i = 0; i < css.length;) {
    const c = css[i];
    if (c === '/' && css[i + 1] === '*') {
      const k = css.indexOf('*/', i + 2);
      if (k < 0) throw new Error(`${gdzie}: niedomknięty komentarz`);
      i = k + 2;
      continue;
    }
    if (/\s/.test(c)) { spacja = true; i++; continue; }
    let token = c;
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < css.length && css[j] !== c) {
        if (css[j] === '\\') j++;
        else if (css[j] === '\n') throw new Error(`${gdzie}: cudzysłów bez zamknięcia w linii`);
        j++;
      }
      token = css.slice(i, j + 1);
      i = j + 1;
    } else {
      i++;
    }
    if (spacja && out && !'{};,:'.includes(out[out.length - 1]) && !'{};,'.includes(token[0])) out += ' ';
    spacja = false;
    if (token === '}' && out.endsWith(';')) out = out.slice(0, -1);
    out += token;
  }
  return out + '\n';
}

/** Minifikacja JS — celowo tylko liniowa: wypada komentarz blokowy, który
 *  zaczyna linię, wcięcia i puste linie. Kodu nie składa w jedną linię
 *  (ASI zostaje nietknięte) i nie musi rozumieć regexów ani stringów.
 *  Szablony `…` i kontynuacje „\" na końcu linii przerywają build, bo tam
 *  zdjęcie wcięcia zmieniłoby treść. Wynik musi się skompilować. */
export function minifikujJs(js, gdzie = 'JS') {
  const out = [];
  let wKomentarzu = false;
  for (const linia of js.split(/\r?\n/)) {
    const t = linia.trim();
    if (wKomentarzu) {
      const k = t.indexOf('*/');
      if (k < 0) continue;
      wKomentarzu = false;
      if (t.slice(k + 2).trim()) throw new Error(`${gdzie}: kod za końcem komentarza: ${t}`);
      continue;
    }
    if (t.startsWith('/*')) {
      const k = t.indexOf('*/', 2);
      if (k < 0) { wKomentarzu = true; continue; }
      if (!t.slice(k + 2).trim()) continue;
    }
    if (!t) continue;
    if (t.includes('`') || t.endsWith('\\')) throw new Error(`${gdzie}: szablon lub kontynuacja linii — minifikacja liniowa niebezpieczna: ${t}`);
    out.push(t);
  }
  if (wKomentarzu) throw new Error(`${gdzie}: niedomknięty komentarz`);
  const wynik = out.join('\n') + '\n';
  new vm.Script(wynik, { filename: gdzie });   // rzuci SyntaxError, gdyby coś się rozjechało
  return wynik;
}

function kopiuj(zrodlo, cel) {
  if (fs.statSync(zrodlo).isDirectory()) {
    fs.mkdirSync(cel, { recursive: true });
    for (const w of fs.readdirSync(zrodlo)) {
      if (w === 'Thumbs.db' || w === 'desktop.ini') continue;
      kopiuj(path.join(zrodlo, w), path.join(cel, w));
    }
  } else {
    fs.mkdirSync(path.dirname(cel), { recursive: true });
    fs.copyFileSync(zrodlo, cel);
  }
}


// --- przekształcenia HTML ----------------------------------------------------

/** `href="kontakt.html#x"` → adres WordPressa. Nieznany plik = błąd builda. */
function przepiszLinki(html, gdzie) {
  return html.replace(/href="([\w-]+)\.html(#[^"]*)?"/g, (m, plik, kotwica) => {
    const adres = PLIK_NA_ADRES.get(plik);
    if (!adres) throw new Error(`${gdzie}: link do ${plik}.html — tej strony nie ma w STRONY`);
    return `href="<?php echo esc_url( home_url( '${adres}' ) ); ?>${kotwica || ''}"`;
  });
}

/** assets/ css/ js/ → katalog motywu; CSS i JS z odciskiem treści. */
function przepiszAssety(html, wersje) {
  html = html.replace(/(src|href)="(assets|css|js)\/([^"]*)"/g, (m, attr, kat, reszta) => {
    const v = wersje[`${kat}/${reszta}`];
    return `${attr}="${T}/${kat}/${reszta}${v ? '?v=' + v : ''}"`;
  });
  // srcset: każdy adres po przecinku, nie tylko pierwszy
  html = html.replace(/srcset="([^"]*)"/g, (m, lista) =>
    `srcset="${lista.replace(/(^|,\s*)assets\//g, `$1${T}/assets/`)}"`);
  return html;
}

/** Komentarze HTML chowamy przed annotate — w środku bywa markup (np. „<h1>"),
 *  który annotate wziąłby za element. Znacznik PHP nie zawiera „<" i annotate
 *  wycina go z tekstu do hasha, więc klucze nie zależą od komentarzy. */
function schowajKomentarze(html) {
  const komentarze = [];
  const ukryty = html.replace(/<!--[\s\S]*?-->/g, (k) => {
    komentarze.push(k);
    return `<?php /*CMK-KOMENTARZ-${komentarze.length - 1}*/ ?>`;
  });
  const przywroc = (s) => s.replace(/<\?php \/\*CMK-KOMENTARZ-(\d+)\*\/ \?>/g,
    (m, i) => komentarze[Number(i)]);
  return { ukryty, przywroc };
}

/** Odwrotność annotate — kontrola, że owijanie nie zmieniło ani bajta treści. */
function zdejmijOwijki(html) {
  return html
    .replace(/<\?php cmk_(?:block|img)\('[^']*', function \(\)(?: use \([^)]*\))? \{ \?>/g, '')
    .replace(/<\?php \}\); \?>\n/g, '');
}

function oznaczMain(html, slug, gdzie) {
  const a = html.indexOf('<main');
  const b = html.lastIndexOf('</main>');
  if (a < 0 || b < a) throw new Error(`${gdzie}: nie znalazłem <main>…</main>`);
  const main = html.slice(a, b + '</main>'.length);

  const { ukryty, przywroc } = schowajKomentarze(main);
  const { html: oznaczony, keys } = annotate(ukryty, slug);
  const wynik = przywroc(oznaczony);

  if (zdejmijOwijki(wynik) !== main) {
    throw new Error(`${gdzie}: annotate zmienił treść <main> — przerwane`);
  }
  return { html: html.slice(0, a) + wynik + html.slice(b + '</main>'.length), keys };
}

/** Formularz „oddzwonię": action na admin-post.php, komunikat po wysłaniu
 *  i pola techniczne (oba składa functions.php). W HTML formularz ma
 *  action="#" — na stronie statycznej nie wysyła. */
function formularzWp(html, gdzie) {
  return podmienRaz(html,
    '<form class="formularz" action="#" method="post" data-odslon>',
    `<form class="formularz" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post" data-odslon>
            <?php cupial_formularz_komunikat(); cupial_formularz_pola(); ?>`,
    gdzie);
}

function naglowekSzablonu(nazwa, zrodlo) {
  return `<?php
/**
 * Template Name: ${nazwa}
 *
 * Wygenerowane z ${zrodlo} przez tools/build-wp-theme.mjs.
 * NIE EDYTUJ — zmiany rób w projekcie statycznym i przebuduj motyw.
 */
$t = get_template_directory_uri();
?>
`;
}

function szablon(strona, wersje) {
  const gdzie = strona.plik;
  let html = fs.readFileSync(path.join(ROOT, strona.plik), 'utf8');

  html = przepiszLinki(html, gdzie);
  html = przepiszAssety(html, wersje);
  html = podmienRaz(html,
    `<script src="${T}/js/site.js?v=${wersje['js/site.js']}" defer></script>`,
    `<script src="${T}/js/site.js?v=${wersje['js/site.js']}" data-home="<?php echo esc_url( home_url( '/' ) ); ?>" defer></script>`,
    gdzie);
  html = podmienRaz(html, '</head>', '<?php wp_head(); ?>\n</head>', gdzie);
  html = podmienRaz(html, '</body>', '<?php wp_footer(); ?>\n</body>', gdzie);
  if (strona.plik === 'kontakt.html') html = formularzWp(html, gdzie);

  const { html: oznaczony, keys } = oznaczMain(html, strona.slug, gdzie);
  return { php: naglowekSzablonu(strona.tytul, strona.plik) + oznaczony, keys };
}


// --- widoki awaryjne (404, index.php) ----------------------------------------
// Serwis nie ma strony 404 ani widoku wpisu WordPressa. Oba składamy
// z istniejących klocków (.naglowek-strony, .sekcja, .wpis-tresc) — zero nowego
// CSS. Tekst 404 NAPISAŁ GENERATOR, nie klientka — do przejrzenia.

function widokAwaryjny(wersje, { tytul, okruszki, h1, tresc, noindex }) {
  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tytul}</title>
${noindex ? '  <meta name="robots" content="noindex, follow">\n' : ''}  <link rel="icon" href="${T}/assets/favicon.ico" sizes="32x32">
  <link rel="icon" type="image/png" sizes="96x96" href="${T}/assets/favicon-96.png">
  <link rel="apple-touch-icon" href="${T}/assets/apple-touch-icon.png">
  <link rel="stylesheet" href="${T}/css/styles.css?v=${wersje['css/styles.css']}">
  <script src="${T}/js/site.js?v=${wersje['js/site.js']}" data-home="<?php echo esc_url( home_url( '/' ) ); ?>" defer></script>
<?php wp_head(); ?>
</head>
<body>

  <div data-nav></div>

  <main id="gora">

    <section class="naglowek-strony pas">
      <div class="kontener">
        <div data-okruszki="${okruszki}"></div>
        ${h1}
      </div>
    </section>
${tresc}
  </main>

  <div data-footer></div>

<?php wp_footer(); ?>
</body>
</html>
`;
}

function widok404(wersje) {
  return `<?php
/**
 * Strona 404. Tekst napisał generator, nie klientka — do przejrzenia.
 * Wygenerowane przez tools/build-wp-theme.mjs — NIE EDYTUJ.
 */
$t = get_template_directory_uri();
?>
` + widokAwaryjny(wersje, {
    tytul: 'Nie znaleziono strony · Adwokat Beata Cupiał-Kowalska, Częstochowa',
    okruszki: 'Nie znaleziono strony',
    h1: `<h1 class="naglowek-strony__tytul">Nie znaleziono strony</h1>
        <p class="naglowek-strony__podtytul">Pod tym adresem nie ma strony. Przejdź na <a class="link" href="<?php echo esc_url( home_url( '/' ) ); ?>">stronę główną</a>.</p>`,
    tresc: '',
    noindex: false,   // noindex dokłada filtr wp_robots w functions.php
  });
}

function widokIndex(wersje) {
  // Wpis / archiwum / wyszukiwarka WordPressa — serwis ich nie używa, ale motyw
  // musi mieć index.php. Pusta pętla = to samo co 404.
  return `<?php
/**
 * Awaryjny widok WordPressa (wpisy, archiwa, wyszukiwarka). Serwis z nich nie
 * korzysta — wszystkie strony mają własne szablony w szablony/.
 * Wygenerowane przez tools/build-wp-theme.mjs — NIE EDYTUJ.
 */
if ( ! have_posts() ) {
	include get_template_directory() . '/404.php';
	return;
}
the_post();
$t = get_template_directory_uri();
?>
` + widokAwaryjny(wersje, {
    tytul: '<?php echo esc_html( wp_strip_all_tags( get_the_title() ) ); ?> · Adwokat Beata Cupiał-Kowalska',
    okruszki: '<?php echo esc_attr( wp_strip_all_tags( get_the_title() ) ); ?>',
    h1: '<h1 class="naglowek-strony__tytul"><?php the_title(); ?></h1>',
    tresc: `
    <section class="sekcja biel">
      <div class="kontener">
        <div class="wpis-tresc"><?php the_content(); ?></div>
      </div>
    </section>
`,
    noindex: false,
  });
}


// --- pliki motywu ------------------------------------------------------------

function styleCss() {
  return `/*
Theme Name: Cupiał-Kowalska
Author: Mikołaj Kubiak
Description: Kancelaria Adwokacka Beata Cupiał-Kowalska. Klasyczny motyw wygenerowany ze strony statycznej przez tools/build-wp-theme.mjs. NIE EDYTUJ plików motywu — przy następnej przebudowie zmiany znikną. Poprawki wprowadzaj w projekcie statycznym i przebuduj motyw. Style strony: css/styles.css. Treść edytowalna przez wtyczkę CMS-Mikołaj Kubiak.
Version: 1.0.0
Requires at least: 6.4
Requires PHP: 8.0
Text Domain: cupial-kowalska
*/
`;
}

function functionsPhp() {
  return `<?php
/**
 * Motyw „Cupiał-Kowalska" — wygenerowany przez tools/build-wp-theme.mjs.
 * NIE EDYTUJ — zmiany rób w generatorze i przebuduj motyw.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* --- CMS-Mikołaj Kubiak: fallback ----------------------------------------
 * Gdy wtyczka jest nieaktywna, helpery wypisują treść domyślną — strona
 * renderuje się 1:1 bez wtyczki. Aktywna wtyczka definiuje je wcześniej.
 */
if ( ! function_exists( 'cmk_block' ) ) {
	function cmk_block( $key, $render ) {
		if ( is_callable( $render ) ) { $render(); } else { echo $render; }
	}
}
if ( ! function_exists( 'cmk_img' ) ) {
	function cmk_img( $key, $render ) {
		if ( is_callable( $render ) ) { $render(); } else { echo $render; }
	}
}

/* --- Branding edytora CMK --------------------------------------------------
 * Motyw nie używa tokenów --c-orange / --font, więc mapujemy tokeny strony:
 * akcent --braz, pasek na --espresso, krój UI Schibsted Grotesk.
 */
add_filter( 'cmk_ui', function ( $ui ) {
	$ui['accent']    = '#7E5E36';
	$ui['accent-2']  = '#6B4A2F';
	$ui['on-accent'] = '#FDFCFA';
	$ui['bar-bg']    = '#2E2620';
	$ui['bar-fg']    = '#FDFCFA';
	$ui['font']      = '"Schibsted Grotesk", "Segoe UI", system-ui, sans-serif';
	return $ui;
} );

/* --- Czystka <head> --------------------------------------------------------
 * Strona statyczna nie ma znaczników, które WordPress dokłada sam. wp_head()
 * zostaje (potrzebuje go edytor CMK), ale zdejmujemy z niego to, czego wersja
 * statyczna nie ma — zwłaszcza arkusze bloków i global styles, które potrafią
 * nadpisać układ. Nazwy hooków sprawdzone na WP 7.1. Zostają: canonical
 * i meta robots (niewidoczne, a robots pilnuje „nie indeksuj" na stagingu).
 */
remove_action( 'wp_head', 'rsd_link' );
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'wp_generator' );
remove_action( 'wp_head', 'wp_shortlink_wp_head' );
remove_action( 'wp_head', 'rest_output_link_wp_head' );
remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
remove_action( 'wp_head', 'wp_oembed_add_host_js' );
remove_action( 'wp_head', 'feed_links', 2 );
remove_action( 'wp_head', 'feed_links_extra', 3 );
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'wp_head', 'wp_resource_hints', 2 );
remove_action( 'wp_head', 'wp_enqueue_img_auto_sizes_contain_css_fix', 0 );
remove_action( 'wp_head', 'wp_print_auto_sizes_contain_css_fix', 1 );
remove_action( 'wp_enqueue_scripts', 'wp_enqueue_global_styles' );
remove_action( 'wp_enqueue_scripts', 'wp_enqueue_emoji_styles' );
remove_action( 'wp_enqueue_scripts', 'wp_enqueue_classic_theme_styles' );
remove_action( 'wp_footer', 'wp_enqueue_global_styles', 1 );
remove_action( 'wp_footer', 'wp_print_speculation_rules', 10 );
remove_action( 'wp_footer', 'the_block_template_skip_link', 10 );

add_action( 'wp_enqueue_scripts', function () {
	wp_dequeue_style( 'wp-block-library' );
	wp_dequeue_style( 'wp-block-library-theme' );
	wp_dequeue_style( 'global-styles' );
	wp_dequeue_style( 'classic-theme-styles' );
}, 100 );

/* Pasek administratora wszedłby na przyklejone menu (.nav jest sticky, top 0).
 * Edytor CMK ma własny przycisk i pasek, więc pasek WP nie jest potrzebny. */
add_filter( 'show_admin_bar', '__return_false' );

/* Ikonę witryny ustawiamy w WP (opcja site_icon) tylko po to, żeby gołe
 * /favicon.ico nie przekierowywało na logo WordPressa. Znaczniki <link rel="icon">
 * ma już <head> każdej strony, więc wp_site_icon() by je zdublował. */
remove_action( 'wp_head', 'wp_site_icon', 99 );

/* --- SEO: przeniesienie ze starej strony -------------------------------------
 * Pełna analiza i lista kroków na dzień publikacji: docs/SEO-MIGRACJA.md.
 */

/* 301 ze starych adresów (Laravel, do 09.2026) na nowe. Priorytet 0 — przed
 * redirect_canonical(), który próbowałby zgadywać podobny adres. */
function cupial_stare_adresy() {
	$t = get_template_directory_uri();
	return array(
${Object.entries(STARE_ADRESY).map(([k, v]) => `\t\t${phpStr(k)} => ${v.startsWith('/')
    ? `home_url( ${phpStr(v)} )` : `$t . ${phpStr('/' + v)}`},`).join('\n')}
	);
}
add_action( 'template_redirect', function () {
	$sciezka = strtolower( trim( (string) wp_parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH ), '/' ) );
	$baza    = strtolower( trim( (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH ), '/' ) );
	if ( '' !== $baza && 0 === strpos( $sciezka . '/', $baza . '/' ) ) {
		$sciezka = ltrim( substr( $sciezka, strlen( $baza ) ), '/' );
	}
	$mapa = cupial_stare_adresy();
	if ( isset( $mapa[ $sciezka ] ) ) {
		wp_safe_redirect( $mapa[ $sciezka ], 301, 'Cupial-Kowalska' );
		exit;
	}
}, 0 );

/* Strony poza indeksem (przykładowa treść bez akceptacji klientki). */
function cupial_noindex_slugi() {
	return array( ${STRONY.filter(s => s.noindex).map(s => phpStr(s.slug)).join(', ')} );
}
function cupial_noindex_id() {
	$id = array();
	foreach ( cupial_noindex_slugi() as $slug ) {
		$p = get_page_by_path( $slug );
		if ( $p ) { $id[] = $p->ID; }
	}
	return $id;
}
add_filter( 'wp_robots', function ( $robots ) {
	/* pusta lista w is_page() znaczy „dowolna strona" — stąd warunek na $slugi */
	$slugi = cupial_noindex_slugi();
	if ( is_404() || ( $slugi && is_page( $slugi ) ) ) {
		$robots['noindex'] = true;
		$robots['follow']  = true;
	}
	return $robots;
} );

/* Mapa witryny: same strony. Lista użytkowników zdradzałaby login konta
 * administratora, taksonomie są puste (serwis nie ma wpisów WP). */
add_filter( 'wp_sitemaps_add_provider', function ( $provider, $nazwa ) {
	return in_array( $nazwa, array( 'users', 'taxonomies' ), true ) ? false : $provider;
}, 10, 2 );
add_filter( 'wp_sitemaps_posts_query_args', function ( $args, $typ ) {
	if ( 'page' === $typ ) {
		$args['post__not_in'] = array_merge( $args['post__not_in'] ?? array(), cupial_noindex_id() );
	}
	return $args;
}, 10, 2 );

/* --- Login konta nie wycieka -------------------------------------------------
 * Lista użytkowników w REST API tylko dla zalogowanych, a /?author=1 i archiwa
 * autorów (zdradzałyby login w adresie) prowadzą na stronę główną.
 */
add_filter( 'rest_endpoints', function ( $e ) {
	if ( ! is_user_logged_in() ) {
		unset( $e['/wp/v2/users'], $e['/wp/v2/users/(?P<id>[\\d]+)'] );
	}
	return $e;
} );
add_action( 'template_redirect', function () {
	if ( is_author() || isset( $_GET['author'] ) ) {
		wp_safe_redirect( home_url( '/' ), 301 );
		exit;
	}
}, 1 );

/* --- Formularz „oddzwonię" (kontakt) -----------------------------------------
 * Generator wstawia do szablonu kontaktu action na admin-post.php oraz
 * cupial_formularz_komunikat() i cupial_formularz_pola(). Zgłoszenie idzie
 * mailem na skrzynkę kancelarii, strona go nie przechowuje. Adresata można
 * nadpisać w wp-config.php (np. na czas testu).
 */
if ( ! defined( 'CUPIAL_FORMULARZ_DO' ) ) {
	define( 'CUPIAL_FORMULARZ_DO', 'kancelaria@cupial-kowalska.pl' );
}

function cupial_formularz_pola() {
	echo '<input type="hidden" name="action" value="cupial_kontakt">';
	echo '<input type="hidden" name="t" value="' . esc_attr( time() ) . '">';
	/* pułapka na boty: człowiek tego pola nie widzi */
	echo '<p hidden><label>Zostaw to pole puste <input type="text" name="strona_www" value="" tabindex="-1" autocomplete="off"></label></p>';
}

function cupial_formularz_komunikat() {
	$stan   = isset( $_GET['formularz'] ) ? sanitize_key( wp_unslash( $_GET['formularz'] ) ) : '';
	$tel    = '<a class="link" href="tel:+48534477596">534 477 596</a>';
	$teksty = array(
		'wyslano' => 'Dziękuję, zgłoszenie dotarło. Oddzwonię tego samego dnia albo następnego rana.',
		'braki'   => 'Wpisz imię i numer telefonu, zaznacz zgodę i wyślij formularz jeszcze raz.',
		'blad'    => 'Nie udało się wysłać zgłoszenia. Zadzwoń: ' . $tel . ' albo spróbuj ponownie za kilka minut.',
	);
	if ( isset( $teksty[ $stan ] ) ) {
		printf( '<p class="akcent" role="%s">%s</p>', 'wyslano' === $stan ? 'status' : 'alert', $teksty[ $stan ] );
	}
}

add_action( 'admin_post_nopriv_cupial_kontakt', 'cupial_formularz_wyslij' );
add_action( 'admin_post_cupial_kontakt', 'cupial_formularz_wyslij' );
function cupial_formularz_wyslij() {
	$wroc = function ( $stan ) {
		wp_safe_redirect( add_query_arg( 'formularz', $stan, home_url( '/kontakt/' ) ) . '#formularz', 303 );
		exit;
	};
	$p = wp_unslash( $_POST );

	/* Bot: wypełniona pułapka, brak znacznika czasu albo wysyłka szybciej niż
	 * 3 s po wyświetleniu strony. Udajemy sukces, żeby go niczego nie nauczyć. */
	$t = (int) ( $p['t'] ?? 0 );
	if ( ! empty( $p['strona_www'] ) || $t <= 0 || time() - $t < 3 ) {
		$wroc( 'wyslano' );
	}

	$imie   = mb_substr( sanitize_text_field( $p['imie'] ?? '' ), 0, 100 );
	$tel    = mb_substr( sanitize_text_field( $p['telefon'] ?? '' ), 0, 40 );
	$pora   = mb_substr( sanitize_text_field( $p['pora'] ?? '' ), 0, 200 );
	$sprawa = mb_substr( sanitize_textarea_field( $p['sprawa'] ?? '' ), 0, 5000 );
	if ( '' === $imie || strlen( preg_replace( '/\\D/', '', $tel ) ) < 6 || empty( $p['zgoda'] ) ) {
		$wroc( 'braki' );
	}

	/* Najwyżej 5 zgłoszeń na godzinę z jednego adresu. Pamiętamy skrót z solą
	 * WordPressa, nie sam adres IP (opisane w polityce prywatności). */
	$klucz = 'cupial_formularz_' . wp_hash( (string) ( $_SERVER['REMOTE_ADDR'] ?? '' ) );
	$ile   = (int) get_transient( $klucz );
	if ( $ile >= 5 ) {
		$wroc( 'blad' );
	}
	set_transient( $klucz, $ile + 1, HOUR_IN_SECONDS );

	$tresc = "Prośba o telefon ze strony www.cupial-kowalska.pl\\n\\n"
		. "Imię: {$imie}\\n"
		. "Telefon: {$tel}\\n"
		. 'Kiedy dzwonić: ' . ( '' !== $pora ? $pora : '—' ) . "\\n\\n"
		. "Czego dotyczy sprawa:\\n" . ( '' !== $sprawa ? $sprawa : '—' ) . "\\n\\n"
		. 'Wysłano: ' . wp_date( 'j.m.Y, H:i' ) . "\\n"
		. "Zgoda na kontakt i informacja o przetwarzaniu danych: zaznaczone.\\n";
	$wroc( wp_mail( CUPIAL_FORMULARZ_DO, 'Prośba o telefon: ' . $imie, $tresc ) ? 'wyslano' : 'blad' );
}

/* --- Poczta strony: wysyłka przez skrzynkę kancelarii ------------------------
 * Formularz i maile WordPressa (np. reset hasła) idą przez SMTP skrzynki
 * kancelarii. Adres i hasło wpisuje klientka w panelu: menu „Poczta strony"
 * (każdy, kto może edytować strony — tak jak w edytorze CMK). Hasło leży
 * w bazie zaszyfrowane kluczem z soli AUTH w wp-config.php i nigdy nie wraca
 * do formularza; po zmianie soli trzeba je wpisać ponownie. Bez ustawień
 * WordPress wysyła pocztę z serwera bez logowania — może trafiać do spamu.
 * Host: na tę nazwę wystawiony jest certyfikat serwera poczty.
 */
define( 'CUPIAL_SMTP_HOST', 'serwer.hosting-desire.pl' );
define( 'CUPIAL_SMTP_PORT', 465 );

function cupial_poczta_klucz() {
	return sodium_crypto_generichash( wp_salt( 'auth' ), '', SODIUM_CRYPTO_SECRETBOX_KEYBYTES );
}
function cupial_poczta_zaszyfruj( $haslo ) {
	$nonce = random_bytes( SODIUM_CRYPTO_SECRETBOX_NONCEBYTES );
	return base64_encode( $nonce . sodium_crypto_secretbox( $haslo, $nonce, cupial_poczta_klucz() ) );
}
/** Adres i odszyfrowane hasło skrzynki albo null, gdy nie ustawiono. */
function cupial_poczta_ustawienia() {
	$u      = get_option( 'cupial_poczta', array() );
	$surowe = empty( $u['haslo'] ) ? false : base64_decode( $u['haslo'], true );
	if ( empty( $u['login'] ) || false === $surowe || strlen( $surowe ) <= SODIUM_CRYPTO_SECRETBOX_NONCEBYTES ) {
		return null;
	}
	$haslo = sodium_crypto_secretbox_open(
		substr( $surowe, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES ),
		substr( $surowe, 0, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES ),
		cupial_poczta_klucz()
	);
	return false === $haslo ? null : array( 'login' => $u['login'], 'haslo' => $haslo );
}
function cupial_poczta_ustaw_smtp( $m, $u ) {
	$m->isSMTP();
	$m->Host       = CUPIAL_SMTP_HOST;
	$m->Port       = CUPIAL_SMTP_PORT;
	$m->SMTPSecure = 'ssl';
	$m->SMTPAuth   = true;
	$m->Username   = $u['login'];
	$m->Password   = $u['haslo'];
	$m->Timeout    = 20;
}

add_action( 'phpmailer_init', function ( $m ) {
	$u = cupial_poczta_ustawienia();
	if ( ! $u ) {
		return;
	}
	cupial_poczta_ustaw_smtp( $m, $u );
	$m->setFrom( $u['login'], 'Strona www kancelarii', false );
	$m->Sender = $u['login'];
} );

add_action( 'admin_menu', function () {
	add_menu_page( 'Poczta strony', 'Poczta strony', 'edit_pages', 'cupial-poczta', 'cupial_poczta_widok', 'dashicons-email-alt', 80 );
} );

/* Zapis + próba logowania do skrzynki (bez wysyłania wiadomości). */
add_action( 'admin_post_cupial_poczta', function () {
	if ( ! current_user_can( 'edit_pages' ) ) {
		wp_die( 'Brak uprawnień.' );
	}
	check_admin_referer( 'cupial_poczta' );
	$stare = get_option( 'cupial_poczta', array() );
	$haslo = (string) wp_unslash( $_POST['haslo'] ?? '' ); /* bez sanitize: hasło może mieć dowolne znaki */
	update_option( 'cupial_poczta', array(
		'login' => sanitize_email( wp_unslash( $_POST['login'] ?? '' ) ),
		'haslo' => '' !== $haslo ? cupial_poczta_zaszyfruj( $haslo ) : ( $stare['haslo'] ?? '' ),
	), false );

	$stan = 'bez-hasla';
	$u    = cupial_poczta_ustawienia();
	if ( $u ) {
		require_once ABSPATH . WPINC . '/PHPMailer/PHPMailer.php';
		require_once ABSPATH . WPINC . '/PHPMailer/SMTP.php';
		require_once ABSPATH . WPINC . '/PHPMailer/Exception.php';
		$m = new \\PHPMailer\\PHPMailer\\PHPMailer( true );
		try {
			cupial_poczta_ustaw_smtp( $m, $u );
			$m->smtpConnect();
			$m->smtpClose();
			$stan = 'polaczono';
		} catch ( \\PHPMailer\\PHPMailer\\Exception $e ) {
			$stan = 'blad';
		}
	}
	wp_safe_redirect( admin_url( 'admin.php?page=cupial-poczta&stan=' . $stan ) );
	exit;
} );

function cupial_poczta_widok() {
	$u          = get_option( 'cupial_poczta', array() );
	$stan       = isset( $_GET['stan'] ) ? sanitize_key( wp_unslash( $_GET['stan'] ) ) : '';
	$komunikaty = array(
		'polaczono' => array( 'success', 'Zapisano. Logowanie do skrzynki działa — formularz i poczta WordPressa idą teraz przez nią.' ),
		'blad'      => array( 'error', 'Zapisano, ale logowanie do skrzynki się nie udało. Sprawdź adres i hasło.' ),
		'bez-hasla' => array( 'warning', 'Zapisano adres. Bez hasła poczta idzie z serwera bez logowania do skrzynki.' ),
	);
	?>
	<div class="wrap">
		<h1>Poczta strony</h1>
		<?php if ( isset( $komunikaty[ $stan ] ) ) : ?>
			<div class="notice notice-<?php echo esc_attr( $komunikaty[ $stan ][0] ); ?>"><p><?php echo esc_html( $komunikaty[ $stan ][1] ); ?></p></div>
		<?php endif; ?>
		<p>Formularz „Poproś o telefon” i wiadomości WordPressa (np. link do zmiany hasła) są wysyłane przez skrzynkę kancelarii. Wpisz jej adres i hasło — to samo, którym logujesz się do poczty.</p>
		<p>Stan: <strong><?php echo cupial_poczta_ustawienia() ? 'skrzynka ustawiona' : 'skrzynka nieustawiona — wiadomości mogą trafiać do spamu'; ?></strong></p>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="cupial_poczta">
			<?php wp_nonce_field( 'cupial_poczta' ); ?>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="cupial-login">Adres skrzynki</label></th>
					<td><input name="login" id="cupial-login" type="email" class="regular-text" value="<?php echo esc_attr( $u['login'] ?? CUPIAL_FORMULARZ_DO ); ?>" required></td>
				</tr>
				<tr>
					<th scope="row"><label for="cupial-haslo">Hasło do skrzynki</label></th>
					<td>
						<input name="haslo" id="cupial-haslo" type="password" class="regular-text" autocomplete="new-password" value="">
						<p class="description"><?php echo empty( $u['haslo'] ) ? 'Hasło nie jest jeszcze zapisane.' : 'Hasło jest zapisane. Zostaw pole puste, żeby go nie zmieniać.'; ?></p>
					</td>
				</tr>
			</table>
			<?php submit_button( 'Zapisz i sprawdź połączenie' ); ?>
		</form>
		<p class="description">Serwer poczty: <?php echo esc_html( CUPIAL_SMTP_HOST . ':' . CUPIAL_SMTP_PORT ); ?> (SSL). Sprawdzenie tylko loguje się do skrzynki, niczego nie wysyła.</p>
	</div>
	<?php
}
`;
}

function manifest(wszystkie) {
  let out = `<?php
/**
 * Manifest kluczy CMK (whitelist) — wtyczka przyjmie zapis tylko dla kluczy
 * z tej listy. Wygenerowane przez tools/build-wp-theme.mjs — NIE EDYTUJ.
 */
return array(
`;
  for (const [slug, keys] of wszystkie) {
    out += `\n\t${phpStr(slug)} => array(\n`;
    for (const k of keys) out += `\t\t${phpStr(k.key)} => ${phpStr(k.preview)},\n`;
    out += '\t),\n';
  }
  return out + '\n);\n';
}


// --- kontrole po zbudowaniu --------------------------------------------------

function kontrola(nazwa, php) {
  const zle = [];
  // Każdy adres motywu musi iść przez $t — bez tego strona ładuje się bez CSS.
  const goly = php.match(/(?:src|href|srcset)="(?:\.\/)?(?:assets|css|js)\//g);
  if (goly) zle.push(`${nazwa}: ${goly.length} adres(ów) bez $t`);
  const html = php.match(/href="[^"<]*\.html[^"]*"/g);
  if (html) zle.push(`${nazwa}: linki do plików .html: ${html.join(', ')}`);
  for (const f of ['<?php wp_head(); ?>', '<?php wp_footer(); ?>', 'data-home=']) {
    if (policz(php, f) !== 1) zle.push(`${nazwa}: „${f}" występuje ${policz(php, f)} razy`);
  }
  const opisy = policz(php, '<meta name="description" content=');
  if (nazwa.startsWith('szablony/') && opisy !== 1) zle.push(`${nazwa}: ${opisy} × meta description`);
  return zle;
}


// --- główny przebieg -----------------------------------------------------------

function main() {
  const wersje = {
    'css/styles.css': odcisk(path.join(ROOT, 'css', 'styles.css')),
    'js/site.js': odcisk(path.join(ROOT, 'js', 'site.js')),
  };

  // Katalogi generowane — czyścimy, żeby nie zostały sieroty po starych stronach.
  fs.mkdirSync(MOTYW, { recursive: true });
  for (const k of ['szablony', 'inc', 'css', 'js', 'assets']) {
    fs.rmSync(path.join(MOTYW, k), { recursive: true, force: true });
  }

  const pliki = [];
  const klucze = [];
  for (const s of STRONY) {
    const { php, keys } = szablon(s, wersje);
    pliki.push([`szablony/${s.slug}.php`, php]);
    klucze.push([s.slug, keys]);
  }
  pliki.push(['404.php', widok404(wersje)]);
  pliki.push(['index.php', widokIndex(wersje)]);
  pliki.push(['style.css', styleCss()]);
  pliki.push(['functions.php', functionsPhp()]);
  pliki.push(['inc/cmk-keys.php', manifest(klucze)]);

  const zle = pliki.filter(([n]) => n.endsWith('.php') && n !== 'functions.php' && !n.startsWith('inc/'))
    .flatMap(([n, php]) => kontrola(n, php));
  if (zle.length) {
    console.error('BŁĘDY:\n  ' + zle.join('\n  '));
    process.exit(1);
  }

  for (const [n, tresc] of pliki) {
    const cel = path.join(MOTYW, n);
    fs.mkdirSync(path.dirname(cel), { recursive: true });
    fs.writeFileSync(cel, tresc);
  }
  kopiuj(path.join(ROOT, 'css'), path.join(MOTYW, 'css'));
  kopiuj(path.join(ROOT, 'js'), path.join(MOTYW, 'js'));
  kopiuj(path.join(ROOT, 'assets'), path.join(MOTYW, 'assets'));
  // Do motywu idą wersje zminifikowane (mniej bajtów na łączu); ?v= liczy się
  // ze źródła, więc zmienia się razem z nim.
  const zysk = [];
  for (const [kat, ext, fn] of [['css', '.css', minifikujCss], ['js', '.js', minifikujJs]]) {
    for (const plik of fs.readdirSync(path.join(ROOT, kat)).filter(f => f.endsWith(ext))) {
      const zrodlo = fs.readFileSync(path.join(ROOT, kat, plik), 'utf8');
      const min = fn(zrodlo, `${kat}/${plik}`);
      fs.writeFileSync(path.join(MOTYW, kat, plik), min);
      zysk.push(`${kat}/${plik} ${Math.round(zrodlo.length / 1024)} → ${Math.round(min.length / 1024)} KB`);
    }
  }

  for (const [slug, keys] of klucze) {
    console.log(`+ szablony/${slug}.php`.padEnd(44) + `${keys.length} kluczy CMK`);
  }
  console.log(`+ 404.php, index.php, style.css, functions.php, inc/cmk-keys.php`);
  console.log(`+ css/ js/ assets/   (styles.css?v=${wersje['css/styles.css']}, site.js?v=${wersje['js/site.js']})`);
  console.log(`  minifikacja: ${zysk.join(', ')}`);
  console.log(`→ ${MOTYW}`);
}

main();
