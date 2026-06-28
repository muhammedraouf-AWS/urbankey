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
        header( 'Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce' );
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
        ];

        // Add production domain from constant if defined (set in wp-config.php)
        if ( defined( 'URBANKEY_FRONTEND_URL' ) && URBANKEY_FRONTEND_URL ) {
            $origins[] = URBANKEY_FRONTEND_URL;
        }

        return $origins;
    }
}
