<?php
/**
 * Plugin Name:       CMS-Mikołaj Kubiak
 * Description:        Edycja treści „wprost na stronie" (szkic → podgląd → publikuj) dla dowolnego motywu (wywołania cmk_block/cmk_img). Bez zewnętrznych usług.
 * Version:           1.2.0
 * Author:            Mikołaj Kubiak
 * Requires PHP:      8.0
 * Text Domain:       cms-mikolaj-kubiak
 *
 * Definiuje helpery cmk_block()/cmk_img() używane przez szablony motywu (generowane
 * przez build-wp-theme.mjs). Gdy wtyczka jest nieaktywna, motyw ma własny fallback
 * w functions.php → strona renderuje się jako czyste 1:1.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'CMK_DIR', plugin_dir_path( __FILE__ ) );
define( 'CMK_URL', plugin_dir_url( __FILE__ ) );
define( 'CMK_VER', '1.2.0' );

require_once CMK_DIR . 'inc/render.php';
require_once CMK_DIR . 'inc/rest.php';
require_once CMK_DIR . 'inc/admin.php';
