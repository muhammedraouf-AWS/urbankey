<?php
defined( 'ABSPATH' ) || exit;

class UrbanKey_Leads_Controller {

    protected $namespace = URBANKEY_API_NAMESPACE;
    protected $rest_base = 'leads';

    public function register_routes(): void {
        register_rest_route( $this->namespace, '/' . $this->rest_base, [
            [
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => [ $this, 'create_lead' ],
                'permission_callback' => '__return_true',
                'args'                => $this->get_params(),
            ],
        ] );
    }

    public function create_lead( $request ) {
        $name  = sanitize_text_field( (string) $request->get_param( 'name' ) );
        $phone = sanitize_text_field( (string) $request->get_param( 'phone' ) );
        $email = sanitize_email( (string) $request->get_param( 'email' ) );
        $notes = sanitize_textarea_field( (string) $request->get_param( 'notes' ) );

        $property_id    = absint( $request->get_param( 'propertyId' ) );
        $property_title = sanitize_text_field( (string) $request->get_param( 'propertyTitle' ) );

        if ( empty( $name ) || empty( $phone ) || empty( $email ) ) {
            return new WP_Error( 'missing_fields', 'Name, phone, and email are required.', [ 'status' => 400 ] );
        }

        if ( ! is_email( $email ) ) {
            return new WP_Error( 'invalid_email', 'Invalid email address.', [ 'status' => 400 ] );
        }

        if ( ! preg_match( '/^\+[1-9]\d{6,14}$/', $phone ) ) {
            return new WP_Error(
                'invalid_phone',
                'Phone must include a country code, e.g. +13055550100.',
                [ 'status' => 400 ]
            );
        }

        $lead_id = UrbanKey_Leads::insert( [
            'property_id'    => $property_id,
            'property_title' => $property_title,
            'name'           => $name,
            'phone'          => $phone,
            'email'          => $email,
            'notes'          => $notes,
        ] );

        if ( ! $lead_id ) {
            return new WP_Error( 'insert_failed', 'Could not save your request. Please try again.', [ 'status' => 500 ] );
        }

        return rest_ensure_response( [
            'success' => true,
            'leadId'  => $lead_id,
        ] );
    }

    private function get_params(): array {
        return [
            'name'          => [ 'type' => 'string', 'required' => true ],
            'phone'         => [ 'type' => 'string', 'required' => true ],
            'email'         => [ 'type' => 'string', 'required' => true ],
            'notes'         => [ 'type' => 'string', 'required' => false ],
            'propertyId'    => [ 'type' => 'integer', 'required' => false ],
            'propertyTitle' => [ 'type' => 'string', 'required' => false ],
        ];
    }
}
