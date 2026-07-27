<?php
defined( 'ABSPATH' ) || exit;

class UrbanKey_Admin_Leads_Page {

    public const CAPABILITY = 'manage_options';
    public const PER_PAGE   = 20;

    public static function init(): void {
        add_action( 'admin_menu', [ self::class, 'register_menu' ] );
    }

    public static function register_menu(): void {
        $hook = add_menu_page(
            'Leads',
            'Leads',
            self::CAPABILITY,
            'urbankey-leads',
            [ self::class, 'render_page' ],
            'dashicons-email-alt',
            26
        );

        // Handling POST actions here (rather than in render_page) runs before
        // any admin HTML has been output, so a redirect (avoiding a
        // resubmit-on-refresh prompt) is still possible.
        add_action( "load-{$hook}", [ self::class, 'handle_action' ] );
    }

    public static function render_page(): void {
        if ( ! current_user_can( self::CAPABILITY ) ) {
            return;
        }

        $paged       = max( 1, (int) ( $_GET['paged'] ?? 1 ) );
        $leads       = UrbanKey_Leads::get_page( self::PER_PAGE, $paged );
        $total       = UrbanKey_Leads::count();
        $total_pages = (int) ceil( $total / self::PER_PAGE );
        ?>
        <div class="wrap">
            <h1 class="wp-heading-inline">Leads</h1>
            <span class="uk-leads-count">(<?php echo (int) $total; ?>)</span>

            <table class="widefat striped" style="margin-top:16px;">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Property</th>
                        <th>Notes</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ( empty( $leads ) ) : ?>
                        <tr><td colspan="8">No leads yet.</td></tr>
                    <?php else : ?>
                        <?php foreach ( $leads as $lead ) : ?>
                            <tr>
                                <td><?php echo esc_html( mysql2date( 'M j, Y g:ia', $lead->created_at ) ); ?></td>
                                <td><?php echo esc_html( $lead->name ); ?></td>
                                <td><a href="tel:<?php echo esc_attr( $lead->phone ); ?>"><?php echo esc_html( $lead->phone ); ?></a></td>
                                <td><a href="mailto:<?php echo esc_attr( $lead->email ); ?>"><?php echo esc_html( $lead->email ); ?></a></td>
                                <td>
                                    <?php if ( $lead->property_id && get_post( $lead->property_id ) ) : ?>
                                        <a href="<?php echo esc_url( get_edit_post_link( $lead->property_id ) ); ?>">
                                            <?php echo esc_html( $lead->property_title ?: '#' . $lead->property_id ); ?>
                                        </a>
                                    <?php else : ?>
                                        <?php echo esc_html( $lead->property_title ?: '—' ); ?>
                                    <?php endif; ?>
                                </td>
                                <td><?php echo esc_html( $lead->notes ?: '—' ); ?></td>
                                <td>
                                    <span class="uk-lead-status uk-lead-status--<?php echo esc_attr( $lead->status ); ?>">
                                        <?php echo esc_html( ucfirst( $lead->status ) ); ?>
                                    </span>
                                </td>
                                <td>
                                    <form method="post" style="display:inline-flex; gap:4px;">
                                        <?php wp_nonce_field( 'uk_leads_action' ); ?>
                                        <input type="hidden" name="lead_id" value="<?php echo (int) $lead->id; ?>">
                                        <?php if ( 'new' === $lead->status ) : ?>
                                            <button type="submit" name="uk_lead_action" value="mark_contacted" class="button button-small">
                                                Mark Contacted
                                            </button>
                                        <?php endif; ?>
                                        <button
                                            type="submit"
                                            name="uk_lead_action"
                                            value="delete"
                                            class="button button-small"
                                            onclick="return confirm('Delete this lead?');"
                                        >
                                            Delete
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>

            <?php if ( $total_pages > 1 ) : ?>
                <div class="tablenav">
                    <div class="tablenav-pages">
                        <?php
                        echo wp_kses_post( paginate_links( [
                            'base'    => add_query_arg( 'paged', '%#%' ),
                            'format'  => '',
                            'current' => $paged,
                            'total'   => $total_pages,
                        ] ) );
                        ?>
                    </div>
                </div>
            <?php endif; ?>
        </div>
        <style>
            .uk-leads-count { color: #646970; font-size: 13px; }
            .uk-lead-status { display: inline-block; padding: 2px 10px; border-radius: 10px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
            .uk-lead-status--new { background: #fef3c7; color: #92400e; }
            .uk-lead-status--contacted { background: #d1fae5; color: #065f46; }
        </style>
        <?php
    }

    /**
     * Hooked to load-{$hook}, which fires before any admin HTML is output —
     * unlike handling this inside render_page(), a redirect is still
     * possible here, avoiding a "confirm resubmission" prompt on refresh.
     * Must stay public: WP invokes it as a callback from outside the class.
     */
    public static function handle_action(): void {
        if ( ! isset( $_POST['uk_lead_action'] ) ) {
            return;
        }
        check_admin_referer( 'uk_leads_action' );

        $id     = absint( $_POST['lead_id'] ?? 0 );
        $action = sanitize_key( $_POST['uk_lead_action'] );

        if ( ! $id ) {
            return;
        }

        if ( 'delete' === $action ) {
            UrbanKey_Leads::delete( $id );
        } elseif ( 'mark_contacted' === $action ) {
            UrbanKey_Leads::update_status( $id, 'contacted' );
        }

        wp_safe_redirect( admin_url( 'admin.php?page=urbankey-leads' ) );
        exit;
    }
}
