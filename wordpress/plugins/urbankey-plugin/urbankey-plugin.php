<?php
/**
 * Plugin Name:       UrbanKey
 * Plugin URI:        https://urbankey.com
 * Description:       Headless real estate API — custom post types, taxonomies, and REST endpoints for the UrbanKey platform.
 * Version:           1.0.0
 * Author:            UrbanKey
 * License:           GPL-2.0-or-later
 * Text Domain:       urbankey
 */

defined( 'ABSPATH' ) || exit;

define( 'URBANKEY_VERSION', '1.0.0' );
define( 'URBANKEY_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'URBANKEY_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'URBANKEY_API_NAMESPACE', 'urbankey/v1' );

// Bootstrap
require_once URBANKEY_PLUGIN_DIR . 'includes/class-post-types.php';
require_once URBANKEY_PLUGIN_DIR . 'includes/class-taxonomies.php';
require_once URBANKEY_PLUGIN_DIR . 'includes/class-cors.php';
require_once URBANKEY_PLUGIN_DIR . 'includes/api/class-api.php';

add_action( 'plugins_loaded', function () {
    UrbanKey_Post_Types::init();
    UrbanKey_Taxonomies::init();
    UrbanKey_CORS::init();
    UrbanKey_API::init();
} );
