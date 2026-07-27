<?php
defined( 'ABSPATH' ) || exit;

/**
 * Leads live in a dedicated table (not a custom post type) — they're
 * transactional contact-form submissions, not editorial content, and don't
 * need revisions, taxonomies, or any of the post machinery.
 */
class UrbanKey_Leads {

    public const DB_VERSION = '1.0';
    public const OPTION_KEY = 'urbankey_leads_db_version';

    /**
     * Called directly from urbankey-plugin.php's own plugins_loaded
     * callback — NOT re-hooked to 'plugins_loaded' here. Registering a
     * callback for the same action that's currently mid-dispatch doesn't
     * run it until the action's *next* firing, and plugins_loaded only
     * fires once per request, so that pattern would silently never run.
     */
    public static function init(): void {
        self::maybe_upgrade();
    }

    /**
     * Runs the table creation/migration on the next request after deploy,
     * rather than relying on register_activation_hook — the plugin is
     * already active on the live site, so an activation hook alone would
     * never fire again without a manual deactivate/reactivate.
     */
    public static function maybe_upgrade(): void {
        if ( get_option( self::OPTION_KEY ) === self::DB_VERSION ) {
            return;
        }
        self::create_table();
        update_option( self::OPTION_KEY, self::DB_VERSION );
    }

    private static function table_name(): string {
        global $wpdb;
        return $wpdb->prefix . 'uk_leads';
    }

    public static function create_table(): void {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();
        $table            = self::table_name();

        $sql = "CREATE TABLE {$table} (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            property_id BIGINT UNSIGNED NULL,
            property_title VARCHAR(255) NOT NULL DEFAULT '',
            name VARCHAR(191) NOT NULL,
            phone VARCHAR(32) NOT NULL,
            email VARCHAR(191) NOT NULL,
            notes TEXT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'new',
            created_at DATETIME NOT NULL,
            PRIMARY KEY  (id),
            KEY property_id (property_id),
            KEY created_at (created_at)
        ) {$charset_collate};";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta( $sql );
    }

    /**
     * @return int|false New lead ID, or false on failure.
     */
    public static function insert( array $data ) {
        global $wpdb;

        $inserted = $wpdb->insert(
            self::table_name(),
            [
                'property_id'    => $data['property_id'] ?: null,
                'property_title' => $data['property_title'] ?? '',
                'name'           => $data['name'],
                'phone'          => $data['phone'],
                'email'          => $data['email'],
                'notes'          => $data['notes'] ?? '',
                'status'         => 'new',
                'created_at'     => current_time( 'mysql' ),
            ],
            [ '%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s' ]
        );

        return $inserted ? (int) $wpdb->insert_id : false;
    }

    public static function get_page( int $per_page = 20, int $paged = 1 ): array {
        global $wpdb;
        $offset = ( max( 1, $paged ) - 1 ) * $per_page;

        return $wpdb->get_results( $wpdb->prepare(
            "SELECT * FROM " . self::table_name() . " ORDER BY created_at DESC LIMIT %d OFFSET %d",
            $per_page,
            $offset
        ) );
    }

    public static function count(): int {
        global $wpdb;
        return (int) $wpdb->get_var( "SELECT COUNT(*) FROM " . self::table_name() );
    }

    public static function update_status( int $id, string $status ): void {
        global $wpdb;
        $wpdb->update(
            self::table_name(),
            [ 'status' => $status ],
            [ 'id' => $id ],
            [ '%s' ],
            [ '%d' ]
        );
    }

    public static function delete( int $id ): void {
        global $wpdb;
        $wpdb->delete( self::table_name(), [ 'id' => $id ], [ '%d' ] );
    }
}
