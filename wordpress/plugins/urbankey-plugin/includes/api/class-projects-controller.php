<?php
defined( 'ABSPATH' ) || exit;

class UrbanKey_Projects_Controller extends WP_REST_Controller {

    protected $namespace = URBANKEY_API_NAMESPACE;
    protected $rest_base = 'projects';

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
            'post_type'      => 'uk_project',
            'post_status'    => 'publish',
            'posts_per_page' => $per_page,
            'paged'          => $page,
            'meta_query'     => [],
        ];

        $search = $request->get_param( 'search' );
        if ( $search ) {
            $args['s'] = sanitize_text_field( $search );
        }

        $status = $request->get_param( 'status' );
        if ( $status ) {
            $args['meta_query'][] = [
                'key'   => '_status',
                'value' => sanitize_text_field( $status ),
            ];
        }

        $city = $request->get_param( 'city' );
        if ( $city ) {
            $args['meta_query'][] = [
                'key'     => '_city',
                'value'   => sanitize_text_field( $city ),
                'compare' => 'LIKE',
            ];
        }

        $developer = $request->get_param( 'developer' );
        if ( $developer ) {
            $developer_post = get_page_by_path( sanitize_text_field( $developer ), OBJECT, 'uk_developer' );
            $args['meta_query'][] = [
                'key'   => '_developer_id',
                'value' => $developer_post ? $developer_post->ID : 0,
            ];
        }

        $orderby = $request->get_param( 'orderby' ) ?: 'date';
        $order   = strtoupper( $request->get_param( 'order' ) ?: 'DESC' );

        if ( 'price' === $orderby ) {
            $args['meta_key'] = '_min_price';
            $args['orderby']  = 'meta_value_num';
        } else {
            $args['orderby'] = 'date';
        }
        $args['order'] = in_array( $order, [ 'ASC', 'DESC' ], true ) ? $order : 'DESC';

        $query = new WP_Query( $args );

        $projects = array_map( [ $this, 'prepare_project' ], $query->posts );

        return rest_ensure_response( [
            'data'       => $projects,
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
        $post = get_page_by_path( $slug, OBJECT, 'uk_project' );

        if ( ! $post || 'publish' !== $post->post_status ) {
            return new WP_Error(
                'rest_not_found',
                __( 'Project not found.', 'urbankey' ),
                [ 'status' => 404 ]
            );
        }

        return rest_ensure_response( $this->prepare_project( $post ) );
    }

    private function prepare_project( $post ) {
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

        $master_plan_id  = (int) $get( '_master_plan', 0 );
        $master_plan_src = $master_plan_id ? wp_get_attachment_image_src( $master_plan_id, 'full' ) : null;
        $master_plan     = $master_plan_src
            ? [
                'id'     => $master_plan_id,
                'url'    => $master_plan_src[0],
                'alt'    => get_post_meta( $master_plan_id, '_wp_attachment_image_alt', true ),
                'width'  => (int) $master_plan_src[1],
                'height' => (int) $master_plan_src[2],
            ]
            : null;

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

        $units_decoded = json_decode( (string) $get( '_units', '[]' ), true );
        $units         = is_array( $units_decoded ) ? $units_decoded : [];

        $payment_plan_decoded = json_decode( (string) $get( '_payment_plan', '[]' ), true );
        $payment_plan         = is_array( $payment_plan_decoded ) ? $payment_plan_decoded : [];

        $developer_id = (int) $get( '_developer_id', 0 );
        $developer    = null;
        if ( $developer_id > 0 ) {
            $developer_post = get_post( $developer_id );
            if ( $developer_post && 'publish' === $developer_post->post_status ) {
                $logo_id  = get_post_thumbnail_id( $developer_id );
                $logo_src = $logo_id ? wp_get_attachment_image_src( $logo_id, 'medium' ) : null;
                $developer = [
                    'id'   => $developer_id,
                    'slug' => $developer_post->post_name,
                    'name' => get_the_title( $developer_post ),
                    'logo' => $logo_src ? $logo_src[0] : null,
                ];
            }
        }

        return [
            'id'             => $post->ID,
            'slug'           => $post->post_name,
            'title'          => get_the_title( $post ),
            'description'    => wp_strip_all_tags( apply_filters( 'the_content', $post->post_content ) ),
            'status'         => $get( '_status', 'upcoming' ),
            'completionDate' => $get( '_completion_date' ) ?: null,
            'totalUnits'     => (int) $get( '_total_units', 0 ),
            'availableUnits' => (int) $get( '_available_units', 0 ),
            'currency'       => $get( '_currency', 'USD' ),
            'minPrice'       => (float) $get( '_min_price', 0 ),
            'maxPrice'       => (float) $get( '_max_price', 0 ),
            'location'       => [
                'address'     => $get( '_address', '' ),
                'city'        => $get( '_city', '' ),
                'country'     => $get( '_country', '' ),
                'coordinates' => [
                    'lat' => (float) $get( '_latitude', 0 ),
                    'lng' => (float) $get( '_longitude', 0 ),
                ],
            ],
            'images'         => $images,
            'masterPlan'     => $master_plan,
            'amenities'      => $amenities,
            'units'          => $units,
            'paymentPlan'    => $payment_plan,
            'developerId'    => $developer_id ?: null,
            'developer'      => $developer,
            'createdAt'      => get_the_date( 'c', $post ),
            'updatedAt'      => get_the_modified_date( 'c', $post ),
        ];
    }

    public function get_collection_params() {
        return [
            'page'     => [ 'type' => 'integer', 'default' => 1, 'minimum' => 1 ],
            'per_page' => [ 'type' => 'integer', 'default' => 12, 'minimum' => 1, 'maximum' => 50 ],
            'search'   => [ 'type' => 'string' ],
            'status'   => [ 'type' => 'string', 'enum' => [ 'upcoming', 'under-construction', 'completed' ] ],
            'city'     => [ 'type' => 'string' ],
            'developer'=> [ 'type' => 'string', 'description' => 'Developer slug' ],
            'orderby'  => [ 'type' => 'string', 'enum' => [ 'date', 'price' ], 'default' => 'date' ],
            'order'    => [ 'type' => 'string', 'enum' => [ 'asc', 'desc' ], 'default' => 'desc' ],
        ];
    }
}
