<?php
defined( 'ABSPATH' ) || exit;

class UrbanKey_Properties_Controller extends WP_REST_Controller {

    protected $namespace = URBANKEY_API_NAMESPACE;
    protected $rest_base = 'properties';

    public function register_routes() {
        register_rest_route( $this->namespace, '/' . $this->rest_base, [
            [
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [ $this, 'get_items' ],
                'permission_callback' => '__return_true',
                'args'                => $this->get_collection_params(),
            ],
        ] );

        register_rest_route( $this->namespace, '/' . $this->rest_base . '/(?P<slug>[a-z0-9-]+)', [
            [
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [ $this, 'get_item' ],
                'permission_callback' => '__return_true',
            ],
        ] );
    }

    public function get_items( $request ) {
        $page     = (int) $request->get_param( 'page' ) ?: 1;
        $per_page = min( (int) $request->get_param( 'per_page' ) ?: 12, 50 );

        $args = [
            'post_type'      => 'property',
            'post_status'    => 'publish',
            'posts_per_page' => $per_page,
            'paged'          => $page,
            'meta_query'     => [],
            'tax_query'      => [],
        ];

        $search = $request->get_param( 'search' );
        if ( $search ) {
            $args['s'] = sanitize_text_field( $search );
        }

        $listing_type = $request->get_param( 'listing_type' );
        if ( $listing_type ) {
            $args['meta_query'][] = [
                'key'   => '_listing_type',
                'value' => sanitize_text_field( $listing_type ),
            ];
        }

        $status = $request->get_param( 'status' );
        if ( $status ) {
            $args['meta_query'][] = [
                'key'   => '_status',
                'value' => sanitize_text_field( $status ),
            ];
        }

        if ( $request->get_param( 'featured' ) ) {
            $args['meta_query'][] = [
                'key'   => '_featured',
                'value' => '1',
            ];
        }

        $min_price = $request->get_param( 'min_price' );
        $max_price = $request->get_param( 'max_price' );
        if ( $min_price || $max_price ) {
            $price_query = [ 'key' => '_price', 'type' => 'NUMERIC' ];
            if ( $min_price && $max_price ) {
                $price_query['value']   = [ (float) $min_price, (float) $max_price ];
                $price_query['compare'] = 'BETWEEN';
            } elseif ( $min_price ) {
                $price_query['value']   = (float) $min_price;
                $price_query['compare'] = '>=';
            } else {
                $price_query['value']   = (float) $max_price;
                $price_query['compare'] = '<=';
            }
            $args['meta_query'][] = $price_query;
        }

        $min_beds = $request->get_param( 'min_beds' );
        if ( $min_beds ) {
            $args['meta_query'][] = [
                'key'     => '_bedrooms',
                'value'   => (int) $min_beds,
                'compare' => '>=',
                'type'    => 'NUMERIC',
            ];
        }

        $max_beds = $request->get_param( 'max_beds' );
        if ( $max_beds ) {
            $args['meta_query'][] = [
                'key'     => '_bedrooms',
                'value'   => (int) $max_beds,
                'compare' => '<=',
                'type'    => 'NUMERIC',
            ];
        }

        $min_baths = $request->get_param( 'min_baths' );
        if ( $min_baths ) {
            $args['meta_query'][] = [
                'key'     => '_bathrooms',
                'value'   => (float) $min_baths,
                'compare' => '>=',
                'type'    => 'NUMERIC',
            ];
        }

        $min_area = $request->get_param( 'min_area' );
        $max_area = $request->get_param( 'max_area' );
        if ( $min_area || $max_area ) {
            $area_query = [ 'key' => '_area', 'type' => 'NUMERIC' ];
            if ( $min_area && $max_area ) {
                $area_query['value']   = [ (float) $min_area, (float) $max_area ];
                $area_query['compare'] = 'BETWEEN';
            } elseif ( $min_area ) {
                $area_query['value']   = (float) $min_area;
                $area_query['compare'] = '>=';
            } else {
                $area_query['value']   = (float) $max_area;
                $area_query['compare'] = '<=';
            }
            $args['meta_query'][] = $area_query;
        }

        $city = $request->get_param( 'city' );
        if ( $city ) {
            $args['meta_query'][] = [
                'key'     => '_city',
                'value'   => sanitize_text_field( $city ),
                'compare' => 'LIKE',
            ];
        }

        $amenities_param = $request->get_param( 'amenities' );
        if ( $amenities_param ) {
            $amenity_slugs = array_filter( array_map( 'sanitize_text_field', explode( ',', $amenities_param ) ) );
            if ( ! empty( $amenity_slugs ) ) {
                $args['tax_query'][] = [
                    'taxonomy' => 'amenity',
                    'field'    => 'slug',
                    'terms'    => $amenity_slugs,
                    'operator' => 'AND',
                ];
            }
        }

        $type = $request->get_param( 'type' );
        if ( $type ) {
            $args['tax_query'][] = [
                'taxonomy' => 'property_type',
                'field'    => 'slug',
                'terms'    => sanitize_text_field( $type ),
            ];
        }

        $orderby = $request->get_param( 'orderby' ) ?: 'date';
        $order   = strtoupper( $request->get_param( 'order' ) ?: 'DESC' );

        if ( 'price' === $orderby ) {
            $args['meta_key'] = '_price';
            $args['orderby']  = 'meta_value_num';
        } elseif ( 'area' === $orderby ) {
            $args['meta_key'] = '_area';
            $args['orderby']  = 'meta_value_num';
        } else {
            $args['orderby'] = 'date';
        }
        $args['order'] = in_array( $order, [ 'ASC', 'DESC' ], true ) ? $order : 'DESC';

        $query = new WP_Query( $args );

        $properties = array_map( [ $this, 'prepare_property' ], $query->posts );

        return rest_ensure_response( [
            'data'       => $properties,
            'pagination' => [
                'total'       => (int) $query->found_posts,
                'totalPages'  => (int) $query->max_num_pages,
                'currentPage' => $page,
                'perPage'     => $per_page,
            ],
        ] );
    }

    public function get_item( $request ) {
        $slug = $request->get_param( 'slug' );
        $post = get_page_by_path( $slug, OBJECT, 'property' );

        if ( ! $post || 'publish' !== $post->post_status ) {
            return new WP_Error(
                'rest_not_found',
                __( 'Property not found.', 'urbankey' ),
                [ 'status' => 404 ]
            );
        }

        return rest_ensure_response( $this->prepare_property( $post ) );
    }

    private function prepare_property( $post ) {
        $meta = get_post_meta( $post->ID );

        $get = function ( $key, $default = null ) use ( $meta ) {
            return isset( $meta[ $key ][0] ) ? $meta[ $key ][0] : $default;
        };

        $gallery_ids = maybe_unserialize( $get( '_gallery', [] ) );
        $images      = [];
        if ( is_array( $gallery_ids ) ) {
            foreach ( $gallery_ids as $img_id ) {
                $src = wp_get_attachment_image_src( (int) $img_id, 'full' );
                if ( $src ) {
                    $images[] = [
                        'id'     => (int) $img_id,
                        'url'    => $src[0],
                        'alt'    => get_post_meta( (int) $img_id, '_wp_attachment_image_alt', true ),
                        'width'  => (int) $src[1],
                        'height' => (int) $src[2],
                    ];
                }
            }
        }

        $amenity_terms = wp_get_post_terms( $post->ID, 'amenity' );
        $amenities     = [];
        if ( ! is_wp_error( $amenity_terms ) ) {
            foreach ( $amenity_terms as $term ) {
                $amenities[] = [
                    'id'    => $term->slug,
                    'label' => $term->name,
                    'icon'  => get_term_meta( $term->term_id, 'icon', true ) ?: $term->slug,
                ];
            }
        }

        $agent_id = (int) $get( '_agent_id', 0 );
        $agent    = null;
        if ( $agent_id > 0 ) {
            $agent_post = get_post( $agent_id );
            if ( $agent_post && 'publish' === $agent_post->post_status ) {
                $am  = get_post_meta( $agent_id );
                $ag  = function ( $key, $default = null ) use ( $am ) {
                    return isset( $am[ $key ][0] ) ? $am[ $key ][0] : $default;
                };
                $av_id  = get_post_thumbnail_id( $agent_id );
                $av_src = $av_id ? wp_get_attachment_image_src( $av_id, 'medium' ) : null;
                $agent  = [
                    'id'              => $agent_id,
                    'slug'            => $agent_post->post_name,
                    'name'            => get_the_title( $agent_post ),
                    'email'           => $ag( '_email', '' ),
                    'phone'           => $ag( '_phone', '' ),
                    'whatsapp'        => $ag( '_whatsapp', '' ),
                    'avatar'          => $av_src ? $av_src[0] : null,
                    'yearsExperience' => (int) $ag( '_years_experience', 0 ),
                ];
            }
        }

        return [
            'id'          => $post->ID,
            'slug'        => $post->post_name,
            'title'       => get_the_title( $post ),
            'description' => wp_strip_all_tags( apply_filters( 'the_content', $post->post_content ) ),
            'price'       => (float) $get( '_price', 0 ),
            'currency'    => $get( '_currency', 'USD' ),
            'status'      => $get( '_status', 'available' ),
            'type'        => $get( '_property_type', 'apartment' ),
            'listingType' => $get( '_listing_type', 'sale' ),
            'bedrooms'    => (int) $get( '_bedrooms', 0 ),
            'bathrooms'   => (float) $get( '_bathrooms', 0 ),
            'area'        => (float) $get( '_area', 0 ),
            'areaUnit'    => $get( '_area_unit', 'sqft' ),
            'floors'      => $get( '_floors' ) ? (int) $get( '_floors' ) : null,
            'yearBuilt'   => $get( '_year_built' ) ? (int) $get( '_year_built' ) : null,
            'location'    => [
                'address'     => $get( '_address', '' ),
                'city'        => $get( '_city', '' ),
                'state'       => $get( '_state', '' ),
                'country'     => $get( '_country', '' ),
                'zipCode'     => $get( '_zip_code', '' ),
                'coordinates' => [
                    'lat' => (float) $get( '_latitude', 0 ),
                    'lng' => (float) $get( '_longitude', 0 ),
                ],
            ],
            'images'      => $images,
            'amenities'   => $amenities,
            'featured'    => (bool) $get( '_featured', false ),
            'agentId'     => $agent_id ?: null,
            'agent'       => $agent,
            'createdAt'   => get_the_date( 'c', $post ),
            'updatedAt'   => get_the_modified_date( 'c', $post ),
        ];
    }

    public function get_collection_params() {
        return [
            'page'         => [ 'type' => 'integer', 'default' => 1, 'minimum' => 1 ],
            'per_page'     => [ 'type' => 'integer', 'default' => 12, 'minimum' => 1, 'maximum' => 50 ],
            'search'       => [ 'type' => 'string' ],
            'listing_type' => [ 'type' => 'string', 'enum' => [ 'sale', 'rent' ] ],
            'status'       => [ 'type' => 'string', 'enum' => [ 'available', 'sold', 'rented', 'off-market' ] ],
            'type'         => [ 'type' => 'string' ],
            'min_price'    => [ 'type' => 'number' ],
            'max_price'    => [ 'type' => 'number' ],
            'min_beds'     => [ 'type' => 'integer' ],
            'max_beds'     => [ 'type' => 'integer' ],
            'min_baths'    => [ 'type' => 'number' ],
            'min_area'     => [ 'type' => 'number' ],
            'max_area'     => [ 'type' => 'number' ],
            'city'         => [ 'type' => 'string' ],
            'amenities'    => [ 'type' => 'string' ],
            'featured'     => [ 'type' => 'boolean' ],
            'orderby'      => [ 'type' => 'string', 'enum' => [ 'date', 'price', 'area' ], 'default' => 'date' ],
            'order'        => [ 'type' => 'string', 'enum' => [ 'asc', 'desc' ], 'default' => 'desc' ],
        ];
    }
}
