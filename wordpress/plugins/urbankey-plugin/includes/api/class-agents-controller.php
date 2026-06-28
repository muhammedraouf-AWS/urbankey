<?php
defined( 'ABSPATH' ) || exit;

class UrbanKey_Agents_Controller extends WP_REST_Controller {

    protected $namespace = URBANKEY_API_NAMESPACE;
    protected $rest_base = 'agents';

    public function register_routes() {
        register_rest_route( $this->namespace, '/' . $this->rest_base, [
            [
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [ $this, 'get_items' ],
                'permission_callback' => '__return_true',
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

        $query = new WP_Query( [
            'post_type'      => 'uk_agent',
            'post_status'    => 'publish',
            'posts_per_page' => $per_page,
            'paged'          => $page,
        ] );

        $agents = array_map( [ $this, 'prepare_agent' ], $query->posts );

        return rest_ensure_response( [
            'data'       => $agents,
            'pagination' => [
                'total'       => (int) $query->found_posts,
                'totalPages'  => (int) $query->max_num_pages,
                'currentPage' => $page,
                'perPage'     => $per_page,
            ],
        ] );
    }

    public function get_item( $request ) {
        $post = get_page_by_path( $request->get_param( 'slug' ), OBJECT, 'uk_agent' );

        if ( ! $post || 'publish' !== $post->post_status ) {
            return new WP_Error(
                'rest_not_found',
                __( 'Agent not found.', 'urbankey' ),
                [ 'status' => 404 ]
            );
        }

        return rest_ensure_response( $this->prepare_agent( $post ) );
    }

    private function prepare_agent( $post ) {
        $meta = get_post_meta( $post->ID );

        $get = function ( $key, $default = null ) use ( $meta ) {
            return isset( $meta[ $key ][0] ) ? $meta[ $key ][0] : $default;
        };

        $avatar_id  = get_post_thumbnail_id( $post->ID );
        $avatar_src = $avatar_id ? wp_get_attachment_image_src( $avatar_id, 'large' ) : null;

        return [
            'id'              => $post->ID,
            'slug'            => $post->post_name,
            'name'            => get_the_title( $post ),
            'bio'             => wp_strip_all_tags( $post->post_content ),
            'email'           => $get( '_email', '' ),
            'phone'           => $get( '_phone', '' ),
            'whatsapp'        => $get( '_whatsapp', '' ),
            'avatar'          => $avatar_src ? $avatar_src[0] : null,
            'yearsExperience' => (int) $get( '_years_experience', 0 ),
            'licenceNumber'   => $get( '_licence_number', '' ),
            'languages'       => maybe_unserialize( $get( '_languages', [] ) ),
            'specialisations' => maybe_unserialize( $get( '_specialisations', [] ) ),
        ];
    }
}
