<?php
defined( 'ABSPATH' ) || exit;

class UrbanKey_Auth_Controller {

    public function register_routes(): void {
        register_rest_route( 'urbankey/v1', '/register', [
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => [ $this, 'register_user' ],
            'permission_callback' => '__return_true',
            'args'                => $this->get_register_params(),
        ] );
    }

    public function register_user( $request ) {
        $email      = sanitize_email( $request->get_param( 'email' ) );
        $password   = $request->get_param( 'password' );
        $first_name = sanitize_text_field( $request->get_param( 'firstName' ) );
        $last_name  = sanitize_text_field( $request->get_param( 'lastName' ) );

        if ( empty( $email ) || empty( $password ) || empty( $first_name ) || empty( $last_name ) ) {
            return new WP_Error( 'missing_fields', 'All fields are required.', [ 'status' => 400 ] );
        }

        if ( ! is_email( $email ) ) {
            return new WP_Error( 'invalid_email', 'Invalid email address.', [ 'status' => 400 ] );
        }

        if ( email_exists( $email ) ) {
            return new WP_Error( 'email_exists', 'An account with this email already exists.', [ 'status' => 409 ] );
        }

        if ( strlen( $password ) < 8 ) {
            return new WP_Error( 'weak_password', 'Password must be at least 8 characters.', [ 'status' => 400 ] );
        }

        $user_id = wp_create_user( $email, $password, $email );

        if ( is_wp_error( $user_id ) ) {
            return new WP_Error( 'registration_failed', $user_id->get_error_message(), [ 'status' => 500 ] );
        }

        wp_update_user( [
            'ID'         => $user_id,
            'first_name' => $first_name,
            'last_name'  => $last_name,
            'display_name' => trim( $first_name . ' ' . $last_name ),
        ] );

        return rest_ensure_response( [
            'success' => true,
            'message' => 'Account created successfully.',
            'userId'  => $user_id,
        ] );
    }

    private function get_register_params(): array {
        return [
            'email'     => [ 'type' => 'string', 'required' => true ],
            'password'  => [ 'type' => 'string', 'required' => true ],
            'firstName' => [ 'type' => 'string', 'required' => true ],
            'lastName'  => [ 'type' => 'string', 'required' => true ],
        ];
    }
}
