<?php
defined( 'ABSPATH' ) || exit;

require_once URBANKEY_PLUGIN_DIR . 'includes/api/class-properties-controller.php';
require_once URBANKEY_PLUGIN_DIR . 'includes/api/class-agents-controller.php';
require_once URBANKEY_PLUGIN_DIR . 'includes/api/class-search-controller.php';
require_once URBANKEY_PLUGIN_DIR . 'includes/api/class-auth-controller.php';
require_once URBANKEY_PLUGIN_DIR . 'includes/api/class-projects-controller.php';
require_once URBANKEY_PLUGIN_DIR . 'includes/api/class-developers-controller.php';
require_once URBANKEY_PLUGIN_DIR . 'includes/api/class-leads-controller.php';

class UrbanKey_API {

    public static function init(): void {
        add_action( 'rest_api_init', [ self::class, 'register_routes' ] );
        add_filter( 'rest_post_dispatch', [ self::class, 'disable_edge_caching' ], 10, 3 );
    }

    public static function register_routes(): void {
        ( new UrbanKey_Properties_Controller() )->register_routes();
        ( new UrbanKey_Agents_Controller() )->register_routes();
        ( new UrbanKey_Search_Controller() )->register_routes();
        ( new UrbanKey_Auth_Controller() )->register_routes();
        ( new UrbanKey_Projects_Controller() )->register_routes();
        ( new UrbanKey_Developers_Controller() )->register_routes();
        ( new UrbanKey_Leads_Controller() )->register_routes();
    }

    /**
     * Hostinger's edge CDN (hcdn) caches responses per-edge for up to 7 days
     * based on Cache-Control, with no awareness that this API's data changes
     * whenever content is published in wp-admin. Different edges then serve
     * different (stale) snapshots to different visitors depending on which
     * PoP they're routed through — the Next.js frontend already handles its
     * own revalidation via ISR/on-demand tags, so the CDN must not cache
     * these responses at all.
     *
     * Deliberately unscoped (originally limited to the urbankey/v1 namespace,
     * which missed the native /wp/v2/* routes the blog feature uses — that
     * gap let a stale cached `featured_media` reference an already-replaced
     * attachment for up to 7 days). This entire install only exists to serve
     * the headless frontend, so there's no REST response here that should
     * ever be edge-cached.
     */
    public static function disable_edge_caching( $response, $server, $request ) {
        if ( $response instanceof WP_REST_Response ) {
            $response->header( 'Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0' );
        }
        return $response;
    }
}
