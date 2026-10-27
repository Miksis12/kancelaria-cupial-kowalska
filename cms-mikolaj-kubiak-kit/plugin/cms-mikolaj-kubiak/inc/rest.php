<?php
/**
 * REST API edytora: zapis szkicu / publikacja / odrzucenie.
 * Namespace `cmk/v1` (jak formularz kontaktowy). Tylko dla redaktorów.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Allowlista wp_kses — wyłącznie formatowanie tekstu (BEZ svg/script/style/on* — bezpiecznie i bez psucia SVG). */
function cmk_allowed_html() {
	return array(
		'span'   => array( 'class' => true ),
		'strong' => array(),
		'b'      => array(),
		'em'     => array(),
		'i'      => array(),
		'u'      => array(),
		'br'     => array(),
		'sub'    => array(),
		'sup'    => array(),
		'small'  => array(),
		'a'      => array( 'href' => true, 'title' => true, 'target' => true, 'rel' => true, 'class' => true ),
	);
}

/**
 * Sanityzacja override. Inline-SVG (dekoracyjne ikony/strzałki) są atomowe — chronimy je
 * przed wp_kses (który psuje camelCase `viewBox`): wycinamy do placeholderów, kses-ujemy
 * resztę (tekst/formatowanie), po czym przywracamy bezpieczne SVG.
 */
function cmk_sanitize( $html ) {
	$svgs = array();
	$html = preg_replace_callback( '#<svg\b[\s\S]*?</svg>#i', function ( $m ) use ( &$svgs ) {
		$i            = count( $svgs );
		$svgs[ $i ]   = cmk_safe_svg( $m[0] );
		return '[[CMK-SVG-' . $i . ']]';
	}, $html );
	$html = wp_kses( $html, cmk_allowed_html() );
	$html = preg_replace_callback( '/\[\[CMK-SVG-(\d+)\]\]/', function ( $m ) use ( $svgs ) {
		$i = (int) $m[1];
		return isset( $svgs[ $i ] ) ? $svgs[ $i ] : '';
	}, $html );
	return $html;
}

/** Bezpieczne SVG (zachowuje case viewBox): usuwa script, foreignObject, handlery on... oraz linki javascript. */
function cmk_safe_svg( $svg ) {
	$svg = preg_replace( '#<script\b[\s\S]*?</script>#i', '', $svg );
	$svg = preg_replace( '#<foreignObject\b[\s\S]*?</foreignObject>#i', '', $svg );
	$svg = preg_replace( '/\son[a-z]+\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+)/i', '', $svg );
	$svg = preg_replace( '/\s(?:xlink:href|href)\s*=\s*("\s*javascript:[^"]*"|\'\s*javascript:[^\']*\')/i', '', $svg );
	return $svg;
}

function cmk_rest_perm() {
	return current_user_can( cmk_capability() );
}

add_action( 'rest_api_init', function () {
	$perm = 'cmk_rest_perm';
	register_rest_route( cmk_namespace(), '/content', array(
		'methods'             => 'POST',
		'callback'            => 'cmk_rest_save',
		'permission_callback' => $perm,
	) );
	register_rest_route( cmk_namespace(), '/publish', array(
		'methods'             => 'POST',
		'callback'            => 'cmk_rest_publish',
		'permission_callback' => $perm,
	) );
	register_rest_route( cmk_namespace(), '/discard', array(
		'methods'             => 'POST',
		'callback'            => 'cmk_rest_discard',
		'permission_callback' => $perm,
	) );
} );

/** Zapis zmian do slotu DRAFT (post meta dla kluczy stron, opcja dla `global:*`). */
function cmk_rest_save( WP_REST_Request $req ) {
	$p       = $req->get_json_params();
	$post_id = isset( $p['postId'] ) ? (int) $p['postId'] : 0;
	$text    = ( isset( $p['text'] ) && is_array( $p['text'] ) ) ? $p['text'] : array();
	$img     = ( isset( $p['img'] ) && is_array( $p['img'] ) ) ? $p['img'] : array();
	$reset   = ( isset( $p['reset'] ) && is_array( $p['reset'] ) ) ? $p['reset'] : array();

	$page_draft = $post_id ? cmk_arr( get_post_meta( $post_id, '_cmk_draft', true ) ) : array();
	$gl_draft   = cmk_arr( get_option( 'cmk_global_draft', array() ) );

	$put = function ( $key, $val ) use ( &$page_draft, &$gl_draft ) {
		if ( cmk_key_is_global( $key ) ) {
			$gl_draft[ $key ] = $val;
		} else {
			$page_draft[ $key ] = $val;
		}
	};

	$n = 0;
	foreach ( $text as $key => $html ) {
		if ( ! cmk_key_valid( $key ) ) { continue; }
		$put( $key, cmk_sanitize( (string) $html ) );
		$n++;
	}
	foreach ( $img as $key => $val ) {
		if ( ! cmk_key_valid( $key ) ) { continue; }
		$id = is_array( $val ) ? (int) ( $val['id'] ?? 0 ) : (int) $val;
		if ( ! $id ) { continue; }
		$clean = array( 'id' => $id );
		if ( is_array( $val ) && isset( $val['alt'] ) ) {
			$clean['alt'] = sanitize_text_field( $val['alt'] );
		}
		$put( $key, $clean );
		$n++;
	}
	foreach ( $reset as $key ) {
		if ( ! cmk_key_valid( $key ) ) { continue; }
		$put( $key, CMK_RESET );
		$n++;
	}

	if ( $post_id ) {
		update_post_meta( $post_id, '_cmk_draft', $page_draft );
	}
	update_option( 'cmk_global_draft', $gl_draft, false );

	return new WP_REST_Response( array( 'ok' => true, 'saved' => $n ), 200 );
}

function cmk_apply_draft( $live, $draft ) {
	foreach ( $draft as $k => $v ) {
		if ( CMK_RESET === $v ) {
			unset( $live[ $k ] );
		} else {
			$live[ $k ] = $v;
		}
	}
	return $live;
}

/** Publikacja: draft → live (per strona + globalne), czyszczenie draftów i cache. */
function cmk_rest_publish( WP_REST_Request $req ) {
	$p       = $req->get_json_params();
	$post_id = isset( $p['postId'] ) ? (int) $p['postId'] : 0;

	if ( $post_id ) {
		$live  = cmk_apply_draft( cmk_arr( get_post_meta( $post_id, '_cmk_live', true ) ), cmk_arr( get_post_meta( $post_id, '_cmk_draft', true ) ) );
		update_post_meta( $post_id, '_cmk_live', $live );
		delete_post_meta( $post_id, '_cmk_draft' );
	}

	$gl_live = cmk_apply_draft( cmk_arr( get_option( 'cmk_global_live', array() ) ), cmk_arr( get_option( 'cmk_global_draft', array() ) ) );
	update_option( 'cmk_global_live', $gl_live, false );
	delete_option( 'cmk_global_draft' );

	cmk_purge_caches();
	return new WP_REST_Response( array( 'ok' => true ), 200 );
}

/** Odrzucenie szkicu (per strona + globalne). */
function cmk_rest_discard( WP_REST_Request $req ) {
	$p       = $req->get_json_params();
	$post_id = isset( $p['postId'] ) ? (int) $p['postId'] : 0;
	if ( $post_id ) {
		delete_post_meta( $post_id, '_cmk_draft' );
	}
	delete_option( 'cmk_global_draft' );
	return new WP_REST_Response( array( 'ok' => true ), 200 );
}

/** Best-effort czyszczenie popularnych cache po publikacji. */
function cmk_purge_caches() {
	if ( function_exists( 'wp_cache_flush' ) ) { wp_cache_flush(); }
	if ( function_exists( 'rocket_clean_domain' ) ) { rocket_clean_domain(); }
	if ( function_exists( 'w3tc_flush_all' ) ) { w3tc_flush_all(); }
	if ( function_exists( 'wp_cache_clear_cache' ) ) { wp_cache_clear_cache(); }
	if ( has_action( 'litespeed_purge_all' ) ) { do_action( 'litespeed_purge_all' ); }
}
