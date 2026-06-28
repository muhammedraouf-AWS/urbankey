<?php
defined( 'ABSPATH' ) || exit;

class UrbanKey_Search_Controller extends WP_REST_Controller {

    protected $namespace = URBANKEY_API_NAMESPACE;
    protected $rest_base = 'search';

    public function register_routes() {
        register_rest_route( $this->namespace, '/' . $this->rest_base, [
            [
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [ $this, 'search' ],
                'permission_callback' => '__return_true',
                'args'                => [
                    'q' => [
                        'required'  => true,
                        'type'      => 'string',
                        'minLength' => 2,
                    ],
                ],
            ],
        ] );
    }

    public function search( $request ) {
        $query_string = sanitize_text_field( $request->get_param( 'q' ) );

        $query = new WP_Query( [
            'post_type'      => [ 'property', 'uk_project', 'uk_agent' ],
            'post_status'    => 'publish',
            's'              => $query_string,
            'posts_per_page' => 10,
        ] );

        $results = [];
        foreach ( $query->posts as $post ) {
            $results[] = [
                'id'    => $post->ID,
                'slug'  => $post->post_name,
                'title' => get_the_title( $post ),
                'type'  => $post->post_type,
            ];
        }

        return rest_ensure_response( [
            'query'   => $query_string,
            'results' => $results,
            'total'   => (int) $query->found_posts,
        ] );
    }
}
