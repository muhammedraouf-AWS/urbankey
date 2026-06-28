<?php
defined( 'ABSPATH' ) || exit;

class UrbanKey_Taxonomies {

    public static function init(): void {
        add_action( 'init', [ self::class, 'register' ] );
    }

    public static function register(): void {
        self::register_property_type();
        self::register_amenity();
        self::register_city();
    }

    private static function register_property_type(): void {
        register_taxonomy( 'property_type', [ 'property' ], [
            'label'             => __( 'Property Types', 'urbankey' ),
            'hierarchical'      => false,
            'show_ui'           => true,
            'show_in_rest'      => false,
            'rewrite'           => false,
        ] );
    }

    private static function register_amenity(): void {
        register_taxonomy( 'amenity', [ 'property', 'uk_project' ], [
            'label'             => __( 'Amenities', 'urbankey' ),
            'hierarchical'      => false,
            'show_ui'           => true,
            'show_in_rest'      => false,
            'rewrite'           => false,
        ] );
    }

    private static function register_city(): void {
        register_taxonomy( 'uk_city', [ 'property', 'uk_project', 'uk_agent' ], [
            'label'             => __( 'Cities', 'urbankey' ),
            'hierarchical'      => true, // Country → City → District
            'show_ui'           => true,
            'show_in_rest'      => false,
            'rewrite'           => false,
        ] );
    }
}
