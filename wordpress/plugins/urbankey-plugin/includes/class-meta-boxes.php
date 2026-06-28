<?php
defined( 'ABSPATH' ) || exit;

class UrbanKey_Meta_Boxes {

    public function __construct() {
        add_action( 'add_meta_boxes', array( $this, 'register_meta_boxes' ) );
        add_action( 'save_post_property', array( $this, 'save_property_meta' ), 10, 2 );
        add_action( 'save_post_uk_agent', array( $this, 'save_agent_meta' ), 10, 2 );
    }

    public function register_meta_boxes() {
        add_meta_box(
            'uk_property_details',
            'Property Details',
            array( $this, 'render_property_meta_box' ),
            'property',
            'normal',
            'high'
        );

        add_meta_box(
            'uk_agent_details',
            'Agent Details',
            array( $this, 'render_agent_meta_box' ),
            'uk_agent',
            'normal',
            'high'
        );
    }

    // ------------------------------------------------------------------
    // Property meta box
    // ------------------------------------------------------------------

    public function render_property_meta_box( $post ) {
        wp_nonce_field( 'uk_save_property_meta', 'uk_property_nonce' );
        $meta = get_post_meta( $post->ID );
        $get  = function ( $key, $default = '' ) use ( $meta ) {
            return isset( $meta[ $key ][0] ) ? $meta[ $key ][0] : $default;
        };
        ?>
        <style>
            .uk-meta-table { width:100%; border-collapse:collapse; }
            .uk-meta-table th { width:180px; padding:8px 12px 8px 0; font-weight:600; text-align:left; vertical-align:top; }
            .uk-meta-table td { padding:6px 0; }
            .uk-meta-table input[type=text],
            .uk-meta-table input[type=number],
            .uk-meta-table select { width:100%; max-width:360px; }
            .uk-meta-section { margin-top:16px; padding-top:12px; border-top:1px solid #ddd; font-weight:700; }
        </style>
        <table class="uk-meta-table">
            <tr><th colspan="2" class="uk-meta-section">Pricing &amp; Listing</th></tr>
            <tr>
                <th><label for="_price">Price</label></th>
                <td><input type="number" id="_price" name="_price" value="<?php echo esc_attr( $get('_price') ); ?>" min="0" step="1"></td>
            </tr>
            <tr>
                <th><label for="_currency">Currency</label></th>
                <td>
                    <select id="_currency" name="_currency">
                        <?php foreach ( array( 'USD', 'EUR', 'GBP', 'AED', 'SAR' ) as $c ) : ?>
                            <option value="<?php echo $c; ?>" <?php selected( $get('_currency', 'USD'), $c ); ?>><?php echo $c; ?></option>
                        <?php endforeach; ?>
                    </select>
                </td>
            </tr>
            <tr>
                <th><label for="_listing_type">Listing Type</label></th>
                <td>
                    <select id="_listing_type" name="_listing_type">
                        <option value="sale" <?php selected( $get('_listing_type', 'sale'), 'sale' ); ?>>For Sale</option>
                        <option value="rent" <?php selected( $get('_listing_type'), 'rent' ); ?>>For Rent</option>
                    </select>
                </td>
            </tr>
            <tr>
                <th><label for="_status">Status</label></th>
                <td>
                    <select id="_status" name="_status">
                        <?php foreach ( array( 'available', 'sold', 'rented', 'off-market' ) as $s ) : ?>
                            <option value="<?php echo $s; ?>" <?php selected( $get('_status', 'available'), $s ); ?>><?php echo ucfirst( str_replace('-', ' ', $s) ); ?></option>
                        <?php endforeach; ?>
                    </select>
                </td>
            </tr>
            <tr>
                <th><label for="_featured">Featured</label></th>
                <td><input type="checkbox" id="_featured" name="_featured" value="1" <?php checked( $get('_featured'), '1' ); ?>></td>
            </tr>

            <tr><th colspan="2" class="uk-meta-section">Property Specs</th></tr>
            <tr>
                <th><label for="_property_type">Property Type</label></th>
                <td>
                    <select id="_property_type" name="_property_type">
                        <?php foreach ( array( 'apartment', 'villa', 'penthouse', 'townhouse', 'studio', 'office', 'retail', 'land' ) as $t ) : ?>
                            <option value="<?php echo $t; ?>" <?php selected( $get('_property_type', 'apartment'), $t ); ?>><?php echo ucfirst( $t ); ?></option>
                        <?php endforeach; ?>
                    </select>
                </td>
            </tr>
            <tr>
                <th><label for="_bedrooms">Bedrooms</label></th>
                <td><input type="number" id="_bedrooms" name="_bedrooms" value="<?php echo esc_attr( $get('_bedrooms', 0) ); ?>" min="0"></td>
            </tr>
            <tr>
                <th><label for="_bathrooms">Bathrooms</label></th>
                <td><input type="number" id="_bathrooms" name="_bathrooms" value="<?php echo esc_attr( $get('_bathrooms', 0) ); ?>" min="0"></td>
            </tr>
            <tr>
                <th><label for="_area">Area</label></th>
                <td><input type="number" id="_area" name="_area" value="<?php echo esc_attr( $get('_area', 0) ); ?>" min="0" step="0.01"></td>
            </tr>
            <tr>
                <th><label for="_area_unit">Area Unit</label></th>
                <td>
                    <select id="_area_unit" name="_area_unit">
                        <option value="sqft" <?php selected( $get('_area_unit', 'sqft'), 'sqft' ); ?>>sqft</option>
                        <option value="sqm" <?php selected( $get('_area_unit'), 'sqm' ); ?>>sqm</option>
                    </select>
                </td>
            </tr>
            <tr>
                <th><label for="_floors">Floors</label></th>
                <td><input type="number" id="_floors" name="_floors" value="<?php echo esc_attr( $get('_floors') ); ?>" min="0"></td>
            </tr>
            <tr>
                <th><label for="_year_built">Year Built</label></th>
                <td><input type="number" id="_year_built" name="_year_built" value="<?php echo esc_attr( $get('_year_built') ); ?>" min="1900" max="2100"></td>
            </tr>

            <tr><th colspan="2" class="uk-meta-section">Location</th></tr>
            <tr>
                <th><label for="_address">Address</label></th>
                <td><input type="text" id="_address" name="_address" value="<?php echo esc_attr( $get('_address') ); ?>"></td>
            </tr>
            <tr>
                <th><label for="_city">City</label></th>
                <td><input type="text" id="_city" name="_city" value="<?php echo esc_attr( $get('_city') ); ?>"></td>
            </tr>
            <tr>
                <th><label for="_state">State / Region</label></th>
                <td><input type="text" id="_state" name="_state" value="<?php echo esc_attr( $get('_state') ); ?>"></td>
            </tr>
            <tr>
                <th><label for="_country">Country</label></th>
                <td><input type="text" id="_country" name="_country" value="<?php echo esc_attr( $get('_country', 'USA') ); ?>"></td>
            </tr>
            <tr>
                <th><label for="_zip_code">Zip Code</label></th>
                <td><input type="text" id="_zip_code" name="_zip_code" value="<?php echo esc_attr( $get('_zip_code') ); ?>"></td>
            </tr>
            <tr>
                <th><label for="_latitude">Latitude</label></th>
                <td><input type="text" id="_latitude" name="_latitude" value="<?php echo esc_attr( $get('_latitude') ); ?>"></td>
            </tr>
            <tr>
                <th><label for="_longitude">Longitude</label></th>
                <td><input type="text" id="_longitude" name="_longitude" value="<?php echo esc_attr( $get('_longitude') ); ?>"></td>
            </tr>

            <tr><th colspan="2" class="uk-meta-section">Media</th></tr>
            <tr>
                <th><label for="_video_url">Video URL</label></th>
                <td><input type="text" id="_video_url" name="_video_url" value="<?php echo esc_attr( $get('_video_url') ); ?>"></td>
            </tr>
            <tr>
                <th><label for="_virtual_tour_url">Virtual Tour URL</label></th>
                <td><input type="text" id="_virtual_tour_url" name="_virtual_tour_url" value="<?php echo esc_attr( $get('_virtual_tour_url') ); ?>"></td>
            </tr>
        </table>
        <?php
    }

    public function save_property_meta( $post_id, $post ) {
        if ( ! isset( $_POST['uk_property_nonce'] ) ) return;
        if ( ! wp_verify_nonce( $_POST['uk_property_nonce'], 'uk_save_property_meta' ) ) return;
        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
        if ( ! current_user_can( 'edit_post', $post_id ) ) return;

        $text_fields = array( '_currency', '_listing_type', '_status', '_address', '_city', '_state', '_country', '_zip_code', '_video_url', '_virtual_tour_url' );
        foreach ( $text_fields as $field ) {
            if ( isset( $_POST[ $field ] ) ) {
                update_post_meta( $post_id, $field, sanitize_text_field( $_POST[ $field ] ) );
            }
        }

        $number_fields = array( '_price', '_bedrooms', '_bathrooms', '_area', '_floors', '_year_built' );
        foreach ( $number_fields as $field ) {
            if ( isset( $_POST[ $field ] ) ) {
                update_post_meta( $post_id, $field, floatval( $_POST[ $field ] ) );
            }
        }

        $float_fields = array( '_latitude', '_longitude' );
        foreach ( $float_fields as $field ) {
            if ( isset( $_POST[ $field ] ) ) {
                update_post_meta( $post_id, $field, floatval( $_POST[ $field ] ) );
            }
        }

        $select_fields = array(
            '_area_unit'     => array( 'sqft', 'sqm' ),
            '_property_type' => array( 'apartment', 'villa', 'penthouse', 'townhouse', 'studio', 'office', 'retail', 'land' ),
        );
        foreach ( $select_fields as $field => $allowed ) {
            if ( isset( $_POST[ $field ] ) && in_array( $_POST[ $field ], $allowed, true ) ) {
                update_post_meta( $post_id, $field, $_POST[ $field ] );
            }
        }

        update_post_meta( $post_id, '_featured', isset( $_POST['_featured'] ) ? '1' : '0' );
    }

    // ------------------------------------------------------------------
    // Agent meta box
    // ------------------------------------------------------------------

    public function render_agent_meta_box( $post ) {
        wp_nonce_field( 'uk_save_agent_meta', 'uk_agent_nonce' );
        $meta = get_post_meta( $post->ID );
        $get  = function ( $key, $default = '' ) use ( $meta ) {
            return isset( $meta[ $key ][0] ) ? $meta[ $key ][0] : $default;
        };
        ?>
        <table class="uk-meta-table">
            <tr>
                <th><label for="_email">Email</label></th>
                <td><input type="text" id="_email" name="_email" value="<?php echo esc_attr( $get('_email') ); ?>"></td>
            </tr>
            <tr>
                <th><label for="_phone">Phone</label></th>
                <td><input type="text" id="_phone" name="_phone" value="<?php echo esc_attr( $get('_phone') ); ?>"></td>
            </tr>
            <tr>
                <th><label for="_whatsapp">WhatsApp</label></th>
                <td><input type="text" id="_whatsapp" name="_whatsapp" value="<?php echo esc_attr( $get('_whatsapp') ); ?>"></td>
            </tr>
            <tr>
                <th><label for="_years_experience">Years Experience</label></th>
                <td><input type="number" id="_years_experience" name="_years_experience" value="<?php echo esc_attr( $get('_years_experience', 0) ); ?>" min="0"></td>
            </tr>
            <tr>
                <th><label for="_licence_number">Licence Number</label></th>
                <td><input type="text" id="_licence_number" name="_licence_number" value="<?php echo esc_attr( $get('_licence_number') ); ?>"></td>
            </tr>
        </table>
        <?php
    }

    public function save_agent_meta( $post_id, $post ) {
        if ( ! isset( $_POST['uk_agent_nonce'] ) ) return;
        if ( ! wp_verify_nonce( $_POST['uk_agent_nonce'], 'uk_save_agent_meta' ) ) return;
        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
        if ( ! current_user_can( 'edit_post', $post_id ) ) return;

        $text_fields = array( '_email', '_phone', '_whatsapp', '_licence_number' );
        foreach ( $text_fields as $field ) {
            if ( isset( $_POST[ $field ] ) ) {
                update_post_meta( $post_id, $field, sanitize_text_field( $_POST[ $field ] ) );
            }
        }

        if ( isset( $_POST['_years_experience'] ) ) {
            update_post_meta( $post_id, '_years_experience', absint( $_POST['_years_experience'] ) );
        }
    }
}
