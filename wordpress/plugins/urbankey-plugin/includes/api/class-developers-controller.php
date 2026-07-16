<?php
defined( 'ABSPATH' ) || exit;

class UrbanKey_Developers_Controller extends WP_REST_Controller {

    protected $namespace = URBANKEY_API_NAMESPACE;
    protected $rest_base = 'developers';

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
            'post_type'      => 'uk_developer',
            'post_status'    => 'publish',
            'posts_per_page' => $per_page,
            'paged'          => $page,
            'orderby'        => 'title',
            'order'          => 'ASC',
        ];

        $search = $request->get_param( 'search' );
        if ( $search ) {
            $args['s'] = sanitize_text_field( $search );
        }

        $query = new WP_Query( $args );

        $developers = array_map( [ $this, 'prepare_developer' ], $query->posts );

        return rest_ensure_response( [
            'data'       => $developers,
            'pagination' => [
                'total'       => (int) $query->found_posts,
                'totalPages'  => (int) $query->max_num_pages,
                'currentPage' => $page,
                'perPage'     => $per_page,
            ],
        ] );
    }

    public function get_item( $request ) {
        $post = get_page_by_path( $request->get_param( 'slug' ), OBJECT, 'uk_developer' );

        if ( ! $post || 'publish' !== $post->post_status ) {
            return new WP_Error(
                'rest_not_found',
                __( 'Developer not found.', 'urbankey' ),
                [ 'status' => 404 ]
            );
        }

        return rest_ensure_response( $this->prepare_developer( $post ) );
    }

    private function prepare_developer( $post ) {
        $meta = get_post_meta( $post->ID );

        $get = function ( $key, $default = null ) use ( $meta ) {
            return isset( $meta[ $key ][0] ) ? $meta[ $key ][0] : $default;
        };

        $logo_id  = get_post_thumbnail_id( $post->ID );
        $logo_src = $logo_id ? wp_get_attachment_image_src( $logo_id, 'large' ) : null;

        $projects_count = ( new WP_Query( [
            'post_type'      => 'uk_project',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'fields'         => 'ids',
            'meta_query'     => [
                [
                    'key'   => '_developer_id',
                    'value' => $post->ID,
                ],
            ],
        ] ) )->found_posts;

        return [
            'id'             => $post->ID,
            'slug'           => $post->post_name,
            'name'           => get_the_title( $post ),
            'bio'            => wp_strip_all_tags( apply_filters( 'the_content', $post->post_content ) ),
            'logo'           => $logo_src ? $logo_src[0] : null,
            'established'    => $get( '_established' ) ? (int) $get( '_established' ) : null,
            'website'        => $get( '_website', '' ),
            'projectsCount'  => (int) $projects_count,
        ];
    }

    public function get_collection_params() {
        return [
            'page'     => [ 'type' => 'integer', 'default' => 1, 'minimum' => 1 ],
            'per_page' => [ 'type' => 'integer', 'default' => 12, 'minimum' => 1, 'maximum' => 50 ],
            'search'   => [ 'type' => 'string' ],
        ];
    }
}
