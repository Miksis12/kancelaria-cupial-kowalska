<?php
/**
 * Ładowanie edytora front-end — wyłącznie dla zalogowanego redaktora.
 * Gość nie dostaje ani bajta JS/CSS edytora.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'wp_enqueue_scripts', function () {
	if ( is_admin() || ! cmk_can_edit() ) {
		return;
	}

	wp_enqueue_style( 'cmk-editor', CMK_URL . 'assets/editor.css', array(), CMK_VER );
	wp_enqueue_script( 'cmk-editor', CMK_URL . 'assets/editor.js', array(), CMK_VER, true );
	wp_enqueue_media(); // wp.media — podmiana zdjęć

	// Adaptacyjny UI: pasek/przyciski edytora przejmują brand strony.
	// Domyślnie czytają tokeny hosta (--c-orange / --font / …); host z innymi
	// nazwami zmiennych nadpisuje filtr `cmk_ui`.
	$ui = apply_filters( 'cmk_ui', array(
		'accent'    => 'var(--c-orange, #F26722)',
		'accent-2'  => 'var(--c-orange-hover, #E15A12)',
		'on-accent' => '#ffffff',
		'bar-bg'    => 'var(--c-olive-deep, #23231e)',
		'bar-fg'    => 'var(--c-on-dark, #f6f3ec)',
		'font'      => 'var(--font, system-ui, -apple-system, "Segoe UI", sans-serif)',
	) );
	$root = ':root{';
	foreach ( $ui as $k => $v ) {
		$root .= '--cmk-' . preg_replace( '/[^a-z0-9\-]/', '', $k ) . ':' . $v . ';';
	}
	$root .= '}';
	wp_add_inline_style( 'cmk-editor', $root );

	$post_id = ( is_page() || is_front_page() ) ? get_queried_object_id() : 0;
	$has_draft = ( $post_id && get_post_meta( $post_id, '_cmk_draft', true ) ) || get_option( 'cmk_global_draft', false );

	wp_localize_script( 'cmk-editor', 'CMK_EDIT', array(
		'rest'     => esc_url_raw( rest_url( cmk_namespace() . '/' ) ),
		'nonce'    => wp_create_nonce( 'wp_rest' ),
		'postId'   => $post_id,
		'preview'  => cmk_is_preview(),
		'hasDraft' => (bool) $has_draft,
		'editable' => $post_id > 0, // 404 itp. nie mają posta → edycja wyłączona
	) );
}, 30 );
