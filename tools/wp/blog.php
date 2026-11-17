<?php
/**
 * Baza wiedzy na wpisach WordPressa (od 17.11.2026).
 *
 * ŹRÓDŁO: tools/wp/blog.php w projekcie statycznym. Generator motywu
 * (tools/build-wp-theme.mjs) kopiuje ten plik do inc/blog.php — kopii
 * w motywie NIE EDYTUJ.
 *
 * Funkcje cupial_petla_<nazwa>() stoją w szablonach w miejscu fragmentów
 * HTML oznaczonych <!-- WP-PETLA:<nazwa> --> … <!-- /WP-PETLA:<nazwa> -->:
 *   baza-wiedzy.html  → szablony/baza-wiedzy.php (archiwum, strona WP),
 *   wpis-szablon.html → single.php (pojedynczy wpis WP).
 * Markup jest ten sam co w HTML, więc wygląd daje css/styles.css bez zmian.
 *
 * PRZEŁĄCZNIK CUPIAL_BLOG_UKRYTY (definiuje functions.php, wartość z BLOG_UKRYTY
 * w generatorze): true = archiwum i wpisy z noindex, wpisy poza mapą witryny,
 * kanały RSS wyłączone. Pozycje „Baza wiedzy" w menu i stopce to osobna
 * sprawa — zakomentowane w js/site.js (NAV, STOPKA_KANCELARIA).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const CUPIAL_STRZALKA = '<svg class="strzalka" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';


/* --- Adresy, kategorie, drobne formaty ------------------------------------ */

function cupial_blog_url( $kotwica = '' ) {
	return home_url( '/baza-wiedzy/' ) . $kotwica;
}

/** Kolejność grup = kolejność USLUGI w js/site.js. Slug kategorii WP = slug
 *  podstrony usługi. Kategorie spoza listy idą na koniec, alfabetycznie. */
function cupial_blog_kolejnosc() {
	return array(
		'rozwod-i-sprawy-rodzinne',
		'sprawy-spadkowe',
		'jazda-po-alkoholu',
		'sprawy-karne',
		'sprawy-cywilne',
		'mediacje',
	);
}

function cupial_blog_sortuj( array $kategorie ) {
	$kolejnosc = array_flip( cupial_blog_kolejnosc() );
	usort( $kategorie, function ( $a, $b ) use ( $kolejnosc ) {
		$pa = $kolejnosc[ $a->slug ] ?? 100;
		$pb = $kolejnosc[ $b->slug ] ?? 100;
		return $pa === $pb ? strcmp( $a->name, $b->name ) : $pa - $pb;
	} );
	return $kategorie;
}

/** Kategorie z co najmniej jednym opublikowanym wpisem. */
function cupial_blog_kategorie() {
	static $lista = null;
	if ( null === $lista ) {
		$terms = get_terms( array( 'taxonomy' => 'category', 'hide_empty' => true ) );
		$lista = is_wp_error( $terms ) ? array() : cupial_blog_sortuj( $terms );
	}
	return $lista;
}

/** Kategoria główna wpisu: pierwsza w kolejności USLUGI. */
function cupial_wpis_kategoria( $wpis ) {
	$kat = get_the_category( $wpis->ID );
	return $kat ? cupial_blog_sortuj( $kat )[0] : null;
}

function cupial_wpis_data( $wpis ) {
	return '<time datetime="' . esc_attr( get_the_date( 'Y-m-d', $wpis ) ) . '">'
		. esc_html( get_the_date( 'd.m.Y', $wpis ) ) . '</time>';
}

/** 1 wpis, 2–4 wpisy (poza 12–14), 5+ wpisów. */
function cupial_liczba_wpisow( $n ) {
	$n = (int) $n;
	if ( 1 === $n ) {
		return '1 wpis';
	}
	$j = $n % 10;
	$d = $n % 100;
	return $n . ( ( $j >= 2 && $j <= 4 && ( $d < 12 || $d > 14 ) ) ? ' wpisy' : ' wpisów' );
}

/** Wiersz .wpis-poz — ten sam markup co w baza-wiedzy.html. */
function cupial_wpis_wiersz( $wpis ) {
	return '
              <li>
                <a class="wpis-poz" href="' . esc_url( get_permalink( $wpis ) ) . '">
                  <span class="wpis-poz__data">' . cupial_wpis_data( $wpis ) . '</span>
                  <span class="wpis-poz__tytul">' . esc_html( get_the_title( $wpis ) ) . '</span>
                  <span class="wpis-poz__zajawka">' . esc_html( get_the_excerpt( $wpis ) ) . '</span>
                  <span class="wpis-poz__strzalka">' . CUPIAL_STRZALKA . '</span>
                </a>
              </li>';
}


/* --- Archiwum: szablony/baza-wiedzy.php ----------------------------------- */

/** Sekcja „Najnowszy wpis" — bez wpisów nie ma sekcji. */
function cupial_petla_najnowszy() {
	$wpisy = get_posts( array( 'numberposts' => 1 ) );
	if ( ! $wpisy ) {
		return;
	}
	$wpis = $wpisy[0];
	$kat  = cupial_wpis_kategoria( $wpis );
	$url  = get_permalink( $wpis );
	?>
    <section class="sekcja biel">
      <div class="kontener">
        <div class="siatka-7-5">
          <div data-odslon>
            <p class="etykieta">Najnowszy wpis</p>
            <h2 class="wpis-wiodacy__tytul">
              <a href="<?php echo esc_url( $url ); ?>"><?php echo esc_html( get_the_title( $wpis ) ); ?></a>
            </h2>
            <p class="wpis-wiodacy__zajawka"><?php echo esc_html( get_the_excerpt( $wpis ) ); ?></p>
            <p class="wpis-wiodacy__akcja">
              <a class="btn btn--pelny" href="<?php echo esc_url( $url ); ?>">
                Czytaj wpis
                <?php echo CUPIAL_STRZALKA; ?>
              </a>
            </p>
          </div>

          <div class="szyna-karta" data-odslon>
            <dl class="dane">
<?php if ( $kat ) : ?>
              <dt>Kategoria</dt>
              <dd><a class="link" href="#k-<?php echo esc_attr( $kat->slug ); ?>"><?php echo esc_html( $kat->name ); ?></a></dd>

<?php endif; ?>
              <dt>Data</dt>
              <dd><?php echo cupial_wpis_data( $wpis ); ?></dd>

              <dt>Autor</dt>
              <dd>Beata Cupiał-Kowalska, adwokat</dd>
            </dl>
          </div>
        </div>
      </div>
    </section>
	<?php
}

/** Pasek kategorii — tylko gdy wpisy są w co najmniej dwóch kategoriach. */
function cupial_petla_filtr() {
	$kategorie = cupial_blog_kategorie();
	if ( count( $kategorie ) < 2 ) {
		return;
	}
	$wszystkie = (int) wp_count_posts( 'post' )->publish;
	echo '<nav class="filtr-kategorii" data-filtr aria-label="Kategorie wpisów" data-odslon>' . "\n";
	echo '          <a class="filtr-kategorii__poz" href="#archiwum" data-kategoria="wszystkie" aria-current="true">Wszystkie <span class="filtr-kategorii__ile">' . $wszystkie . '</span></a>' . "\n";
	foreach ( $kategorie as $k ) {
		$id = 'k-' . $k->slug;
		echo '          <a class="filtr-kategorii__poz" href="#' . esc_attr( $id ) . '" data-kategoria="' . esc_attr( $id ) . '">'
			. esc_html( $k->name ) . ' <span class="filtr-kategorii__ile">' . (int) $k->count . '</span></a>' . "\n";
	}
	echo '        </nav>';
}

/** Grupy wpisów pod nazwami kategorii (id grupy = „k-" + slug kategorii). */
function cupial_petla_archiwum() {
	$kategorie = cupial_blog_kategorie();
	if ( ! $kategorie ) {
		echo '<p class="drugorzedny">Pierwsze wpisy są w przygotowaniu.</p>';
		return;
	}
	foreach ( $kategorie as $k ) {
		$wpisy = get_posts( array( 'category' => $k->term_id, 'numberposts' => -1 ) );
		if ( ! $wpisy ) {
			continue;
		}
		?>
          <section class="archiwum__grupa" id="k-<?php echo esc_attr( $k->slug ); ?>" data-odslon>
            <div class="archiwum__glowa">
              <h3><?php echo esc_html( $k->name ); ?></h3>
              <p class="archiwum__licznik"><?php echo esc_html( cupial_liczba_wpisow( count( $wpisy ) ) ); ?></p>
            </div>
            <ul class="wpisy"><?php
			foreach ( $wpisy as $wpis ) {
				echo cupial_wpis_wiersz( $wpis );
			}
			?>

            </ul>
          </section>
		<?php
	}
}


/* --- Pojedynczy wpis: single.php ------------------------------------------- */

/** Treść wpisu po filtrach WP + spis treści ze śródtytułów H2. Liczone raz,
 *  na początku single.php, bo spis stoi w szynie PRZED treścią. */
function cupial_wpis_stan( $nowy = null ) {
	static $stan = array( 'tresc' => '', 'spis' => array() );
	if ( null !== $nowy ) {
		$stan = $nowy;
	}
	return $stan;
}

function cupial_wpis_przygotuj() {
	$html   = apply_filters( 'the_content', get_the_content() );
	$spis   = array();
	$uzyte  = array();
	$html   = preg_replace_callback(
		'/<h2(\s[^>]*)?>(.*?)<\/h2>/is',
		function ( $m ) use ( &$spis, &$uzyte ) {
			$atrybuty = $m[1] ?? '';
			$tekst    = trim( wp_strip_all_tags( $m[2] ) );
			if ( preg_match( '/\sid=(["\'])(.*?)\1/i', $atrybuty, $id ) ) {
				$kotwica = $id[2];
			} else {
				$baza    = sanitize_title( $tekst );
				$baza    = '' !== $baza ? $baza : 'sekcja';
				$kotwica = $baza;
				for ( $i = 2; isset( $uzyte[ $kotwica ] ); $i++ ) {
					$kotwica = $baza . '-' . $i;
				}
				$atrybuty .= ' id="' . esc_attr( $kotwica ) . '"';
			}
			$uzyte[ $kotwica ] = true;
			$spis[]            = array( $kotwica, $tekst );
			return '<h2' . $atrybuty . '>' . $m[2] . '</h2>';
		},
		$html
	);
	cupial_wpis_stan( array( 'tresc' => $html, 'spis' => $spis ) );
}

/** Meta description: zajawka z edytora albo początek treści (do 155 znaków). */
function cupial_wpis_opis() {
	$tekst = has_excerpt() ? get_the_excerpt() : wp_strip_all_tags( strip_shortcodes( get_the_content() ) );
	$tekst = trim( preg_replace( '/\s+/u', ' ', html_entity_decode( $tekst, ENT_QUOTES, 'UTF-8' ) ) );
	if ( mb_strlen( $tekst ) > 155 ) {
		$tekst = rtrim( mb_substr( $tekst, 0, 154 ) ) . '…';
	}
	return $tekst;
}

/** Tytuł do okruszków — pionowa kreska rozdziela kroki w data-okruszki. */
function cupial_wpis_okruszek() {
	return str_replace( '|', '–', html_entity_decode( wp_strip_all_tags( get_the_title() ), ENT_QUOTES, 'UTF-8' ) );
}

function cupial_petla_wpis_naglowek() {
	$wpis = get_post();
	$kat  = cupial_wpis_kategoria( $wpis );
	?>
<h1 class="wpis-glowa__tytul"><?php echo esc_html( get_the_title() ); ?></h1>
<?php if ( has_excerpt() ) : ?>
        <p class="naglowek-strony__podtytul"><?php echo esc_html( get_the_excerpt() ); ?></p>
<?php endif; ?>

        <p class="wpis-meta">
          <span><?php echo cupial_wpis_data( $wpis ); ?></span>
<?php if ( $kat ) : ?>
          <span>Kategoria: <a href="<?php echo esc_url( cupial_blog_url( '#k-' . $kat->slug ) ); ?>"><?php echo esc_html( $kat->name ); ?></a></span>
<?php endif; ?>
          <span><b>Beata Cupiał-Kowalska</b>, adwokat</span>
        </p>
	<?php
}

/** Spis treści — od dwóch śródtytułów H2 w górę. */
function cupial_petla_spis() {
	$spis = cupial_wpis_stan()['spis'];
	if ( count( $spis ) < 2 ) {
		return;
	}
	echo '<div class="szyna-karta">' . "\n";
	echo '              <p class="spis__tytul">W tym wpisie</p>' . "\n";
	echo '              <ul class="spis__lista">' . "\n";
	foreach ( $spis as $poz ) {
		echo '                <li><a href="#' . esc_attr( $poz[0] ) . '">' . esc_html( $poz[1] ) . '</a></li>' . "\n";
	}
	echo '              </ul>' . "\n";
	echo '            </div>';
}

function cupial_petla_tresc() {
	echo cupial_wpis_stan()['tresc'];
}

/** „Przeczytaj też" — do trzech wpisów: ta sama kategoria, potem najnowsze. */
function cupial_petla_przeczytaj() {
	$id    = get_the_ID();
	$kat   = wp_get_post_categories( $id );
	$wpisy = $kat ? get_posts( array(
		'numberposts'  => 3,
		'category__in' => $kat,
		'post__not_in' => array( $id ),
	) ) : array();
	if ( count( $wpisy ) < 3 ) {
		$wpisy = array_merge( $wpisy, get_posts( array(
			'numberposts'  => 3 - count( $wpisy ),
			'post__not_in' => array_merge( array( $id ), wp_list_pluck( $wpisy, 'ID' ) ),
		) ) );
	}
	if ( ! $wpisy ) {
		return;
	}
	?>
    <section class="sekcja">
      <div class="kontener">
        <div class="naglowek-sekcji naglowek-sekcji--rozdzielony" data-odslon>
          <h2>Przeczytaj <em>też</em></h2>
          <p><a class="link" href="<?php echo esc_url( cupial_blog_url() ); ?>">Całe archiwum wpisów</a></p>
        </div>

        <ul class="wpisy" data-odslon><?php
		foreach ( $wpisy as $wpis ) {
			echo cupial_wpis_wiersz( $wpis );
		}
		?>

        </ul>
      </div>
    </section>
	<?php
}


/* --- Zachowanie WordPressa ---------------------------------------------------- */

/* Ukrycie bloga: noindex na wpisach (archiwum dostaje go z listy STRONY),
 * wpisy poza mapą witryny. */
add_filter( 'wp_robots', function ( $robots ) {
	if ( CUPIAL_BLOG_UKRYTY && is_singular( 'post' ) ) {
		$robots['noindex'] = true;
		$robots['follow']  = true;
	}
	return $robots;
} );
add_filter( 'wp_sitemaps_post_types', function ( $typy ) {
	if ( CUPIAL_BLOG_UKRYTY ) {
		unset( $typy['post'] );
	}
	return $typy;
} );

/* Archiwa, których serwis nie ma: kategoria → jej grupa w Bazie wiedzy,
 * tagi i daty → Baza wiedzy. Kanały RSS wyłączone, dopóki blog jest ukryty. */
add_action( 'template_redirect', function () {
	if ( is_feed() ) {
		if ( CUPIAL_BLOG_UKRYTY ) {
			wp_safe_redirect( home_url( '/' ), 302, 'Cupial-Kowalska' );
			exit;
		}
		return;
	}
	if ( is_category() ) {
		$k = get_queried_object();
		wp_safe_redirect( cupial_blog_url( $k ? '#k-' . $k->slug : '' ), 301, 'Cupial-Kowalska' );
		exit;
	}
	if ( is_tag() || is_date() ) {
		wp_safe_redirect( cupial_blog_url(), 301, 'Cupial-Kowalska' );
		exit;
	}
}, 2 );

/* Bez komentarzy i pingbacków — serwis ich nie pokazuje, a otwarte
 * przyjmowałyby spam. */
add_filter( 'comments_open', '__return_false', 20 );
add_filter( 'pings_open', '__return_false', 20 );
add_action( 'init', function () {
	remove_post_type_support( 'post', 'comments' );
	remove_post_type_support( 'post', 'trackbacks' );
} );

/* Zajawka automatyczna (gdy pole „Zajawka" jest puste): krótsza i z wielokropkiem. */
add_filter( 'excerpt_length', function () {
	return 30;
} );
add_filter( 'excerpt_more', function () {
	return '…';
} );
