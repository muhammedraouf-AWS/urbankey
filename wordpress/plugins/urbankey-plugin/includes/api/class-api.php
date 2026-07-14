<?php
defined( 'ABSPATH' ) || exit;

require_once URBANKEY_PLUGIN_DIR . 'includes/api/class-properties-controller.php';
require_once URBANKEY_PLUGIN_DIR . 'includes/api/class-agents-controller.php';
require_once URBANKEY_PLUGIN_DIR . 'includes/api/class-search-controller.php';
require_once URBANKEY_PLUGIN_DIR . 'includes/api/class-auth-controller.php';

class UrbanKey_API {

    public static function init(): void {
        add_action( 'rest_api_init', [ self::class, 'register_routes' ] );
    }

    public static function register_routes(): void {
        ( new UrbanKey_Properties_Controller() )->register_routes();
        ( new UrbanKey_Agents_Controller() )->register_routes();
        ( new UrbanKey_Search_Controller() )->register_routes();
        ( new UrbanKey_Auth_Controller() )->register_routes();
    }
}
