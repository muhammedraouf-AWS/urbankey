<?php
defined( 'ABSPATH' ) || exit;

class UrbanKey_Webhooks {

    public function __construct() {
        add_action( 'save_post_property', array( $this, 'on_property_save' ), 20, 2 );
        add_action( 'save_post_uk_agent', array( $this, 'on_agent_save' ), 20, 2 );
        add_action( 'before_delete_post', array( $this, 'on_post_delete' ), 10, 1 );
        add_action( 'wp_trash_post', array( $this, 'on_post_delete' ), 10, 1 );
    }

    public function on_property_save( $post_id, $post ) {
        if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) return;
        $this->notify( array(
            'post_type' => 'property',
            'slug'      => $post->post_name,
        ) );
    }

    public function on_agent_save( $post_id, $post ) {
        if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) return;
        $this->notify( array( 'post_type' => 'uk_agent' ) );
    }

    public function on_post_delete( $post_id ) {
        $post_type = get_post_type( $post_id );
        if ( ! in_array( $post_type, array( 'property', 'uk_agent' ), true ) ) return;
        $this->notify( array( 'post_type' => $post_type ) );
    }

    private function notify( $body ) {
        $frontend_url = defined( 'URBANKEY_FRONTEND_URL' ) ? URBANKEY_FRONTEND_URL : '';
        $secret       = defined( 'URBANKEY_REVALIDATE_SECRET' ) ? URBANKEY_REVALIDATE_SECRET : '';

        if ( ! $frontend_url || ! $secret ) return;

        wp_remote_post(
            trailingslashit( $frontend_url ) . 'api/revalidate',
            array(
                'headers'  => array(
                    'Content-Type'         => 'application/json',
                    'x-revalidate-secret'  => $secret,
                ),
                'body'     => wp_json_encode( $body ),
                'timeout'  => 5,
                'blocking' => false,
            )
        );
    }
}
