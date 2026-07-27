<?php
defined( 'ABSPATH' ) || exit;

class UrbanKey_CORS {

    public static function init(): void {
        add_action( 'init', [ self::class, 'handle_cors' ] );
    }

    public static function handle_cors(): void {
        $allowed_origins = self::get_allowed_origins();
        $origin          = $_SERVER['HTTP_ORIGIN'] ?? '';

        if ( ! in_array( $origin, $allowed_origins, true ) ) {
            return;
        }

        header( "Access-Control-Allow-Origin: {$origin}" );
        header( 'Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS' );
        // Cache-Control/Pragma are sent by the frontend's API client on every
        // request (to force the CDN to revalidate instead of serving a stale
        // cached response) — since they aren't CORS-safelisted headers,
        // browser-side requests (unlike server-side RSC fetches, which aren't
        // subject to CORS at all) preflight and get blocked unless allowed here.
        header( 'Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, Cache-Control, Pragma' );
        header( 'Access-Control-Allow-Credentials: true' );

        if ( 'OPTIONS' === $_SERVER['REQUEST_METHOD'] ) {
            status_header( 200 );
            exit;
        }
    }

    private static function get_allowed_origins(): array {
        $origins = [
            'http://localhost:3000',
            'http://localhost:3001',
            // Hardcoded rather than relying solely on the URBANKEY_FRONTEND_URL
            // wp-config.php constant below — that constant wasn't actually
            // matching this origin in production (likely unset or mismatched),
            // which silently fell through to WordPress core's own default REST
            // CORS handling. That handler allows the origin but doesn't know
            // about the Cache-Control/Pragma headers this app's frontend sends,
            // so preflight requests were failing — with no error visible here,
            // only in the browser making the cross-origin request.
            'https://urbankey-beta.vercel.app',
        ];

        // Add production domain from constant if defined (set in wp-config.php)
        // — lets a future custom domain be added without another deploy.
        if ( defined( 'URBANKEY_FRONTEND_URL' ) && URBANKEY_FRONTEND_URL ) {
            $origins[] = URBANKEY_FRONTEND_URL;
        }

        return $origins;
    }
}
