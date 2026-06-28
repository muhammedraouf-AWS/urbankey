<?php
defined( 'ABSPATH' ) || exit;

class UrbanKey_Post_Types {

    public static function init(): void {
        add_action( 'init', [ self::class, 'register' ] );
    }

    public static function register(): void {
        self::register_property();
        self::register_project();
        self::register_agent();
        self::register_developer();
    }

    private static function register_property(): void {
        register_post_type( 'property', [
            'label'               => __( 'Properties', 'urbankey' ),
            'public'              => false,
            'show_ui'             => true,
            'show_in_rest'        => false, // handled by custom API
            'supports'            => [ 'title', 'editor', 'thumbnail', 'custom-fields' ],
            'menu_icon'           => 'dashicons-building',
            'rewrite'             => false,
        ] );
    }

    private static function register_project(): void {
        register_post_type( 'uk_project', [
            'label'               => __( 'Projects', 'urbankey' ),
            'public'              => false,
            'show_ui'             => true,
            'show_in_rest'        => false,
            'supports'            => [ 'title', 'editor', 'thumbnail', 'custom-fields' ],
            'menu_icon'           => 'dashicons-building',
            'rewrite'             => false,
        ] );
    }

    private static function register_agent(): void {
        register_post_type( 'uk_agent', [
            'label'               => __( 'Agents', 'urbankey' ),
            'public'              => false,
            'show_ui'             => true,
            'show_in_rest'        => false,
            'supports'            => [ 'title', 'editor', 'thumbnail', 'custom-fields' ],
            'menu_icon'           => 'dashicons-id-alt',
            'rewrite'             => false,
        ] );
    }

    private static function register_developer(): void {
        register_post_type( 'uk_developer', [
            'label'               => __( 'Developers', 'urbankey' ),
            'public'              => false,
            'show_ui'             => true,
            'show_in_rest'        => false,
            'supports'            => [ 'title', 'editor', 'thumbnail', 'custom-fields' ],
            'menu_icon'           => 'dashicons-groups',
            'rewrite'             => false,
        ] );
    }
}
