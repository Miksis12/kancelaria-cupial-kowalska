<?php
/**
 * Wklej do functions.php motywu. Dwie rzeczy obowiązkowe (fallback) + opcjonalna konfiguracja.
 */

/* ── 1) FALLBACK (obowiązkowe) ──────────────────────────────────────────────
 * Gdy wtyczka „CMS-Mikołaj Kubiak" jest nieaktywna, helpery muszą po prostu
 * wypisać default → strona renderuje się 1:1 bez wtyczki. (Wtyczka, gdy aktywna,
 * definiuje własne cmk_block/cmk_img wcześniej, więc te fallbacki się nie odpalą.)
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

/* ── 2) BRANDING UI EDYTORA (opcjonalne) ────────────────────────────────────
 * Jeśli motyw używa --c-orange / --font w :root — POMIŃ, edytor przejmie je sam.
 * Jeśli masz inne nazwy tokenów, zmapuj je tu (patrz docs/THEMING.md).
 */
// add_filter( 'cmk_ui', function ( $ui ) {
// 	$ui['accent']   = 'var(--brand, #0a7)';
// 	$ui['accent-2'] = 'var(--brand-dark, #086)';
// 	$ui['bar-bg']   = '#1b1b1b';
// 	$ui['font']     = 'var(--font-sans, system-ui)';
// 	return $ui;
// } );

/* ── 3) INNE USTAWIENIA (opcjonalne) ────────────────────────────────────────*/
// add_filter( 'cmk_namespace', fn() => 'mojeapi/v1' );      // domyślnie 'cmk/v1'
// add_filter( 'cmk_capability', fn() => 'edit_pages' );      // kto może edytować
// add_filter( 'cmk_manifest_path', fn( $p ) => get_stylesheet_directory() . '/inc/cmk-keys.php' );
// add_filter( 'cmk_require_manifest', '__return_false' );    // motyw owijany ręcznie, bez manifestu
