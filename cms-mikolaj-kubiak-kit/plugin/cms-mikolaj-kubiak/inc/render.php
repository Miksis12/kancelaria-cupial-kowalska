<?php
/**
 * Render edytowalnych bloków + dostęp do override'ów (sloty draft/live).
 *
 * Model:
 *  - per strona: post meta `_cmk_live` (publiczne) i `_cmk_draft` (robocze) — tablice klucz→HTML.
 *  - globalne (klucze `global:*`): opcje `cmk_global_live` / `cmk_global_draft`.
 *  - sentinel '__CMK_RESET__' w draft = „wróć do szablonu" (przy publikacji usuwa klucz z live).
 *
 * Gość widzi LIVE. Redaktor z `?cmk_preview=1` widzi LIVE+DRAFT (draft wygrywa).
 * Atrybuty `data-cmk` dokładamy WYŁĄCZNIE dla redaktora (gość: czyste 1:1).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const CMK_RESET = '__CMK_RESET__';

/* ---- Konfiguracja (nadpisywalna filtrami per projekt) ---- */
function cmk_namespace() {
	return apply_filters( 'cmk_namespace', 'cmk/v1' );        // REST namespace
}
function cmk_capability() {
	return apply_filters( 'cmk_capability', 'edit_pages' );    // kto może edytować
}

function cmk_can_edit() {
	return is_user_logged_in() && current_user_can( cmk_capability() );
}

function cmk_is_preview() {
	return cmk_can_edit() && isset( $_GET['cmk_preview'] ) && '1' === $_GET['cmk_preview'];
}

function cmk_arr( $v ) {
	return is_array( $v ) ? $v : array();
}

/** Mapa aktywnych override'ów dla bieżącego żądania: ['page'=>[], 'global'=>[]]. */
function cmk_active_overrides() {
	static $cache = null;
	if ( null !== $cache ) {
		return $cache;
	}
	$preview = cmk_is_preview();
	$post_id = ( is_page() || is_front_page() ) ? get_queried_object_id() : 0;

	$page_live  = $post_id ? cmk_arr( get_post_meta( $post_id, '_cmk_live', true ) ) : array();
	$page_draft = $post_id ? cmk_arr( get_post_meta( $post_id, '_cmk_draft', true ) ) : array();
	$gl_live    = cmk_arr( get_option( 'cmk_global_live', array() ) );
	$gl_draft   = cmk_arr( get_option( 'cmk_global_draft', array() ) );

	$cache = array(
		'page'   => $preview ? array_merge( $page_live, $page_draft ) : $page_live,
		'global' => $preview ? array_merge( $gl_live, $gl_draft ) : $gl_live,
	);
	return $cache;
}

/** Manifest kluczy z motywu (whitelist + podglądy). */
function cmk_manifest() {
	static $m = null;
	if ( null === $m ) {
		$f = apply_filters( 'cmk_manifest_path', get_template_directory() . '/inc/cmk-keys.php' );
		$m = file_exists( $f ) ? cmk_arr( require $f ) : array();
	}
	return $m;
}

function cmk_key_is_global( $key ) {
	return 0 === strpos( $key, 'global:' );
}

function cmk_key_valid( $key ) {
	// Motywy bez manifestu (ręcznie owijane) mogą wyłączyć whitelistę: add_filter('cmk_require_manifest','__return_false').
	if ( ! apply_filters( 'cmk_require_manifest', true ) ) {
		return (bool) preg_match( '/^[a-z0-9:_#-]+$/i', $key );
	}
	$m = cmk_manifest();
	if ( cmk_key_is_global( $key ) ) {
		return isset( $m['global'][ $key ] );
	}
	$slug = explode( ':', $key )[0];
	return isset( $m[ $slug ][ $key ] );
}

/** Zachowuje tag otwierający i zamykający z defaultu, podmienia tylko innerHTML. */
function cmk_replace_inner( $default, $inner ) {
	$gt    = strpos( $default, '>' );
	$close = strrpos( $default, '</' );
	if ( false === $gt || false === $close || $close < $gt ) {
		return $default;
	}
	return substr( $default, 0, $gt + 1 ) . $inner . substr( $default, $close );
}

/** Wstawia atrybut (np. data-cmk) do pierwszego tagu otwierającego. */
function cmk_inject_attr( $html, $attr, $value ) {
	$gt = strpos( $html, '>' );
	if ( false === $gt ) {
		return $html;
	}
	$open = substr( $html, 0, $gt );
	if ( false !== strpos( $open, $attr . '=' ) ) {
		return $html; // już jest
	}
	$at = ( '/' === substr( $html, $gt - 1, 1 ) ) ? $gt - 1 : $gt; // przed '/>' jeśli void
	return substr( $html, 0, $at ) . ' ' . $attr . '="' . esc_attr( $value ) . '"' . substr( $html, $at );
}

/** Buduje <img> z załącznika, zachowując klasę z defaultu (object-fit trzyma layout). */
function cmk_img_from_attachment( $default, $val ) {
	$id = is_array( $val ) ? (int) ( $val['id'] ?? 0 ) : (int) $val;
	if ( ! $id ) {
		return $default;
	}
	$class = preg_match( '/\bclass="([^"]*)"/i', $default, $m ) ? $m[1] : '';
	$attrs = array( 'class' => $class );
	if ( is_array( $val ) && isset( $val['alt'] ) ) {
		$attrs['alt'] = sanitize_text_field( $val['alt'] );
	}
	$img = wp_get_attachment_image( $id, 'full', false, $attrs );
	return $img ? $img : $default;
}

/** Wspólny render elementu edytowalnego. Zwraca HTML. */
function cmk_render_el( $key, $render, $is_img ) {
	if ( is_callable( $render ) ) {
		ob_start();
		$render();
		$default = ob_get_clean();
	} else {
		$default = (string) $render;
	}

	$ov     = cmk_active_overrides();
	$bucket = cmk_key_is_global( $key ) ? $ov['global'] : $ov['page'];
	$has    = array_key_exists( $key, $bucket ) && CMK_RESET !== $bucket[ $key ];

	if ( $is_img ) {
		$html = $has ? cmk_img_from_attachment( $default, $bucket[ $key ] ) : $default;
		return cmk_can_edit() ? cmk_inject_attr( $html, 'data-cmk-img', $key ) : $html;
	}

	$html = $has ? cmk_replace_inner( $default, $bucket[ $key ] ) : $default;
	return cmk_can_edit() ? cmk_inject_attr( $html, 'data-cmk', $key ) : $html;
}

/* ---- Helpery wołane przez szablony (generowane przez build-wp-theme.mjs) ---- */
if ( ! function_exists( 'cmk_block' ) ) {
	function cmk_block( $key, $render ) {
		echo cmk_render_el( $key, $render, false ); // phpcs:ignore — HTML zsanityzowany przy zapisie
	}
}
if ( ! function_exists( 'cmk_img' ) ) {
	function cmk_img( $key, $render ) {
		echo cmk_render_el( $key, $render, true ); // phpcs:ignore
	}
}

/* ---- Aliasy wsteczne: motywy wołające sk_block()/sk_img() też działają ---- */
if ( ! function_exists( 'sk_block' ) ) {
	function sk_block( $key, $render ) { cmk_block( $key, $render ); }
}
if ( ! function_exists( 'sk_img' ) ) {
	function sk_img( $key, $render ) { cmk_img( $key, $render ); }
}
