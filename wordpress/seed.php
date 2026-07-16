<?php
/**
 * UrbanKey — Database Seeder
 *
 * ⚠️  DELETE THIS FILE from the server immediately after running.
 *
 * Steps:
 *   1. Upload this file to your WordPress root (public_html/)
 *   2. Visit: https://saddlebrown-mouse-814822.hostingersite.com/seed.php?key=uk_seed_dev_2024
 *   3. DELETE the file from the server when done
 */

define( 'SEED_KEY', 'uk_seed_dev_2024' );

if ( ! isset( $_GET['key'] ) || ! hash_equals( SEED_KEY, $_GET['key'] ) ) {
    http_response_code( 403 );
    die( '<b>403 Forbidden.</b> Append <code>?key=uk_seed_dev_2024</code> to the URL.' );
}

require_once __DIR__ . '/wp-load.php';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the ID of an existing post with this exact title/post_type, or 0.
 * Keeps this script safe to re-run without duplicating previously seeded content.
 */
function uk_find_existing( $title, $post_type ) {
    $query = new WP_Query( array(
        'post_type'      => $post_type,
        'title'          => $title,
        'post_status'    => 'any',
        'posts_per_page' => 1,
        'fields'         => 'ids',
        'no_found_rows'  => true,
    ) );
    return ! empty( $query->posts ) ? (int) $query->posts[0] : 0;
}

function uk_create_property( $args ) {
    $existing_id = uk_find_existing( $args['title'], 'property' );
    if ( $existing_id ) {
        return array( 'ok' => true, 'title' => $args['title'], 'id' => $existing_id, 'skipped' => true );
    }

    $post_id = wp_insert_post( array(
        'post_title'   => $args['title'],
        'post_content' => $args['description'],
        'post_status'  => 'publish',
        'post_type'    => 'property',
    ), true );

    if ( is_wp_error( $post_id ) ) {
        return array( 'ok' => false, 'title' => $args['title'], 'error' => $post_id->get_error_message() );
    }

    $meta = array(
        '_price'         => $args['price'],
        '_currency'      => $args['currency']      ?? 'USD',
        '_listing_type'  => $args['listing_type'],
        '_status'        => $args['status']         ?? 'available',
        '_property_type' => $args['property_type']  ?? 'apartment',
        '_featured'      => $args['featured']       ? '1' : '0',
        '_bedrooms'      => $args['bedrooms']       ?? 0,
        '_bathrooms'     => $args['bathrooms']      ?? 1,
        '_area'          => $args['area']           ?? 0,
        '_area_unit'     => $args['area_unit']      ?? 'sqft',
        '_floors'        => $args['floors']         ?? '',
        '_year_built'    => $args['year_built']     ?? '',
        '_address'       => $args['address']        ?? '',
        '_city'          => $args['city']           ?? '',
        '_state'         => $args['state']          ?? '',
        '_country'       => $args['country']        ?? 'USA',
        '_zip_code'      => $args['zip_code']       ?? '',
        '_latitude'      => $args['latitude']       ?? 0,
        '_longitude'     => $args['longitude']      ?? 0,
    );

    foreach ( $meta as $key => $value ) {
        update_post_meta( $post_id, $key, $value );
    }

    if ( ! empty( $args['amenities'] ) ) {
        wp_set_object_terms( $post_id, $args['amenities'], 'amenity' );
    }

    return array( 'ok' => true, 'title' => $args['title'], 'id' => $post_id );
}

function uk_create_agent( $args ) {
    $existing_id = uk_find_existing( $args['name'], 'uk_agent' );
    if ( $existing_id ) {
        return array( 'ok' => true, 'name' => $args['name'], 'id' => $existing_id, 'skipped' => true );
    }

    $post_id = wp_insert_post( array(
        'post_title'   => $args['name'],
        'post_content' => $args['bio'] ?? '',
        'post_status'  => 'publish',
        'post_type'    => 'uk_agent',
    ), true );

    if ( is_wp_error( $post_id ) ) {
        return array( 'ok' => false, 'name' => $args['name'], 'error' => $post_id->get_error_message() );
    }

    $meta = array(
        '_email'            => $args['email']            ?? '',
        '_phone'            => $args['phone']            ?? '',
        '_whatsapp'         => $args['whatsapp']         ?? '',
        '_years_experience' => $args['years_experience'] ?? 0,
        '_licence_number'   => $args['licence_number']   ?? '',
    );

    foreach ( $meta as $key => $value ) {
        update_post_meta( $post_id, $key, $value );
    }

    return array( 'ok' => true, 'name' => $args['name'], 'id' => $post_id );
}

function uk_create_developer( $args ) {
    $existing_id = uk_find_existing( $args['name'], 'uk_developer' );
    if ( $existing_id ) {
        return array( 'ok' => true, 'name' => $args['name'], 'id' => $existing_id, 'skipped' => true );
    }

    $post_id = wp_insert_post( array(
        'post_title'   => $args['name'],
        'post_content' => $args['bio'] ?? '',
        'post_status'  => 'publish',
        'post_type'    => 'uk_developer',
    ), true );

    if ( is_wp_error( $post_id ) ) {
        return array( 'ok' => false, 'name' => $args['name'], 'error' => $post_id->get_error_message() );
    }

    $meta = array(
        '_established' => $args['established'] ?? '',
        '_website'     => $args['website']      ?? '',
    );

    foreach ( $meta as $key => $value ) {
        update_post_meta( $post_id, $key, $value );
    }

    return array( 'ok' => true, 'name' => $args['name'], 'id' => $post_id );
}

function uk_create_project( $args ) {
    $existing_id = uk_find_existing( $args['title'], 'uk_project' );
    if ( $existing_id ) {
        return array( 'ok' => true, 'title' => $args['title'], 'id' => $existing_id, 'skipped' => true );
    }

    $post_id = wp_insert_post( array(
        'post_title'   => $args['title'],
        'post_content' => $args['description'],
        'post_status'  => 'publish',
        'post_type'    => 'uk_project',
    ), true );

    if ( is_wp_error( $post_id ) ) {
        return array( 'ok' => false, 'title' => $args['title'], 'error' => $post_id->get_error_message() );
    }

    $meta = array(
        '_developer_id'    => $args['developer_id']    ?? 0,
        '_status'          => $args['status'],
        '_completion_date' => $args['completion_date'] ?? '',
        '_total_units'     => $args['total_units']     ?? 0,
        '_available_units' => $args['available_units'] ?? 0,
        '_currency'        => $args['currency']        ?? 'USD',
        '_min_price'       => $args['min_price']       ?? 0,
        '_max_price'       => $args['max_price']       ?? 0,
        '_address'         => $args['address']         ?? '',
        '_city'            => $args['city']            ?? '',
        '_country'         => $args['country']         ?? 'USA',
        '_latitude'        => $args['latitude']        ?? 0,
        '_longitude'       => $args['longitude']       ?? 0,
        '_units'           => wp_json_encode( $args['units']        ?? array() ),
        '_payment_plan'    => wp_json_encode( $args['payment_plan'] ?? array() ),
    );

    foreach ( $meta as $key => $value ) {
        update_post_meta( $post_id, $key, $value );
    }

    if ( ! empty( $args['amenities'] ) ) {
        wp_set_object_terms( $post_id, $args['amenities'], 'amenity' );
    }

    return array( 'ok' => true, 'title' => $args['title'], 'id' => $post_id );
}

// ---------------------------------------------------------------------------
// Seed: Agents
// ---------------------------------------------------------------------------

$agents = array(
    array(
        'name'            => 'Sarah Mitchell',
        'bio'             => 'Senior luxury property specialist with 8 years of experience in high-end residential sales across Miami and the surrounding area.',
        'email'           => 'sarah@urbankey.com',
        'phone'           => '+1 305 555 0101',
        'whatsapp'        => '+13055550101',
        'years_experience'=> 8,
        'licence_number'  => 'FL-RE-2016-004821',
    ),
    array(
        'name'            => 'James Rivera',
        'bio'             => 'Commercial and residential property expert with 12 years specialising in waterfront and investment properties.',
        'email'           => 'james@urbankey.com',
        'phone'           => '+1 305 555 0202',
        'whatsapp'        => '+13055550202',
        'years_experience'=> 12,
        'licence_number'  => 'FL-RE-2012-001337',
    ),
);

// ---------------------------------------------------------------------------
// Seed: Developers
// ---------------------------------------------------------------------------

$developers = array(
    'meridian' => array(
        'name'        => 'Meridian Developments',
        'bio'         => 'A leading master-planned community developer with over 15 years of experience delivering award-winning residential and mixed-use projects across the Miami metro area.',
        'established' => 2008,
        'website'     => 'https://meridiandevelopments.example.com',
    ),
    'skyline' => array(
        'name'        => 'Skyline Holdings',
        'bio'         => 'A boutique developer known for architecturally distinctive high-rise towers, blending contemporary design with resort-style amenities.',
        'established' => 1998,
        'website'     => 'https://skylineholdings.example.com',
    ),
);

// ---------------------------------------------------------------------------
// Seed: Amenity terms
// ---------------------------------------------------------------------------

$amenity_terms = array(
    'swimming-pool'  => 'Swimming Pool',
    'gym'            => 'Gym',
    'parking'        => 'Parking',
    'concierge'      => 'Concierge',
    'balcony'        => 'Balcony',
    'sea-view'       => 'Sea View',
    'smart-home'     => 'Smart Home',
    'security'       => '24/7 Security',
    'pet-friendly'   => 'Pet Friendly',
    'rooftop'        => 'Rooftop Terrace',
);

foreach ( $amenity_terms as $slug => $name ) {
    if ( ! term_exists( $slug, 'amenity' ) ) {
        wp_insert_term( $name, 'amenity', array( 'slug' => $slug ) );
    }
}

// ---------------------------------------------------------------------------
// Seed: Properties
// ---------------------------------------------------------------------------

$properties = array(
    array(
        'title'         => 'Marina Waterfront Penthouse',
        'description'   => 'Spectacular three-bedroom penthouse crowning the Marina Tower with panoramic ocean views from every room. Features a private rooftop terrace, chef\'s kitchen, and direct access to a private marina berth. Finished to the highest specification with marble floors, custom Italian cabinetry, and a Crestron smart-home system throughout.',
        'price'         => 1850000,
        'currency'      => 'USD',
        'listing_type'  => 'sale',
        'status'        => 'available',
        'property_type' => 'penthouse',
        'featured'      => true,
        'bedrooms'      => 3,
        'bathrooms'     => 3,
        'area'          => 3200,
        'area_unit'     => 'sqft',
        'floors'        => 42,
        'year_built'    => 2021,
        'address'       => '1 Marina Boulevard, Penthouse',
        'city'          => 'Miami',
        'state'         => 'Florida',
        'country'       => 'USA',
        'zip_code'      => '33132',
        'latitude'      => 25.7780,
        'longitude'     => -80.1855,
        'amenities'     => array( 'swimming-pool', 'gym', 'concierge', 'parking', 'sea-view', 'smart-home', 'rooftop', 'security' ),
    ),
    array(
        'title'         => 'Palm Hills Estate Villa',
        'description'   => 'An architectural masterpiece set within manicured grounds in the prestigious Palm Hills enclave. This five-bedroom villa offers resort-style living with a 20-metre infinity pool, home cinema, wine cellar, and a separate guest house. Designed by award-winning architect Marco Fonseca with natural stone, timber, and floor-to-ceiling glass.',
        'price'         => 3400000,
        'currency'      => 'USD',
        'listing_type'  => 'sale',
        'status'        => 'available',
        'property_type' => 'villa',
        'featured'      => true,
        'bedrooms'      => 5,
        'bathrooms'     => 4,
        'area'          => 6800,
        'area_unit'     => 'sqft',
        'floors'        => 2,
        'year_built'    => 2019,
        'address'       => '14 Palm Hills Drive',
        'city'          => 'Miami',
        'state'         => 'Florida',
        'country'       => 'USA',
        'zip_code'      => '33156',
        'latitude'      => 25.6722,
        'longitude'     => -80.3127,
        'amenities'     => array( 'swimming-pool', 'gym', 'parking', 'pet-friendly', 'smart-home', 'security' ),
    ),
    array(
        'title'         => 'Coral Gardens Townhouse',
        'description'   => 'Elegant four-bedroom townhouse in the sought-after Coral Gardens gated community. Each of the three levels features generous open-plan living spaces, a private terrace, and a landscaped garden. Two-car garage, community pool, and walking distance to top-rated schools and boutique shopping.',
        'price'         => 1250000,
        'currency'      => 'USD',
        'listing_type'  => 'sale',
        'status'        => 'available',
        'property_type' => 'townhouse',
        'featured'      => true,
        'bedrooms'      => 4,
        'bathrooms'     => 3,
        'area'          => 3100,
        'area_unit'     => 'sqft',
        'floors'        => 3,
        'year_built'    => 2018,
        'address'       => '7 Coral Gardens Lane',
        'city'          => 'Miami',
        'state'         => 'Florida',
        'country'       => 'USA',
        'zip_code'      => '33146',
        'latitude'      => 25.7070,
        'longitude'     => -80.2845,
        'amenities'     => array( 'swimming-pool', 'parking', 'pet-friendly', 'security' ),
    ),
    array(
        'title'         => 'Brickell City Apartment',
        'description'   => 'Contemporary two-bedroom apartment on the 28th floor of the iconic Brickell City Tower. Floor-to-ceiling windows frame sweeping city and bay views. The open-plan layout features a designer kitchen, spa-inspired bathrooms, and a wraparound balcony. World-class amenities include a sky pool, fitness centre, and 24-hour concierge.',
        'price'         => 3500,
        'currency'      => 'USD',
        'listing_type'  => 'rent',
        'status'        => 'available',
        'property_type' => 'apartment',
        'featured'      => false,
        'bedrooms'      => 2,
        'bathrooms'     => 2,
        'area'          => 1150,
        'area_unit'     => 'sqft',
        'floors'        => 28,
        'year_built'    => 2020,
        'address'       => '1010 Brickell Avenue, Unit 2804',
        'city'          => 'Miami',
        'state'         => 'Florida',
        'country'       => 'USA',
        'zip_code'      => '33131',
        'latitude'      => 25.7588,
        'longitude'     => -80.1937,
        'amenities'     => array( 'swimming-pool', 'gym', 'concierge', 'parking', 'balcony', 'security' ),
    ),
    array(
        'title'         => 'Wynwood Design Studio',
        'description'   => 'Stylish studio apartment in the heart of Miami\'s vibrant Wynwood Arts District. Polished concrete floors, exposed brick, and 4.5-metre ceilings create an industrial-chic aesthetic perfectly suited to creative professionals. Steps from galleries, restaurants, and nightlife. Building features a rooftop terrace and co-working lounge.',
        'price'         => 2200,
        'currency'      => 'USD',
        'listing_type'  => 'rent',
        'status'        => 'available',
        'property_type' => 'studio',
        'featured'      => false,
        'bedrooms'      => 0,
        'bathrooms'     => 1,
        'area'          => 560,
        'area_unit'     => 'sqft',
        'floors'        => 4,
        'year_built'    => 2017,
        'address'       => '255 NW 25th Street, Unit 412',
        'city'          => 'Miami',
        'state'         => 'Florida',
        'country'       => 'USA',
        'zip_code'      => '33127',
        'latitude'      => 25.8009,
        'longitude'     => -80.1993,
        'amenities'     => array( 'rooftop', 'balcony' ),
    ),
    array(
        'title'         => 'Financial District Office Suite',
        'description'   => 'Premium Grade-A office suite on the 15th floor of the Financial District\'s most prestigious address. 1,800 sq ft of column-free space fitted with raised access floors, fibre connectivity, and a private meeting room. Panoramic bay views, on-site parking, and shared reception and boardroom facilities.',
        'price'         => 750000,
        'currency'      => 'USD',
        'listing_type'  => 'sale',
        'status'        => 'available',
        'property_type' => 'office',
        'featured'      => false,
        'bedrooms'      => 0,
        'bathrooms'     => 2,
        'area'          => 1800,
        'area_unit'     => 'sqft',
        'floors'        => 15,
        'year_built'    => 2016,
        'address'       => '200 Biscayne Boulevard Way, Suite 1500',
        'city'          => 'Miami',
        'state'         => 'Florida',
        'country'       => 'USA',
        'zip_code'      => '33131',
        'latitude'      => 25.7726,
        'longitude'     => -80.1877,
        'amenities'     => array( 'parking', 'concierge', 'security' ),
    ),
);

// ---------------------------------------------------------------------------
// Seed: Projects (Off-plan)
// ---------------------------------------------------------------------------

$projects = array(
    array(
        'title'           => 'Meridian Bay Residences',
        'description'     => 'A landmark waterfront community of three residential towers set around a private marina and resort-style pool deck. Meridian Bay Residences offers a curated collection of one-, two-, and three-bedroom homes with floor-to-ceiling glass, expansive terraces, and direct bay views.',
        'developer'       => 'meridian',
        'status'          => 'upcoming',
        'completion_date' => '2027-06',
        'total_units'     => 240,
        'available_units' => 180,
        'currency'        => 'USD',
        'min_price'       => 320000,
        'max_price'       => 1250000,
        'address'         => '1 Meridian Bay Boulevard',
        'city'            => 'Miami',
        'country'         => 'USA',
        'latitude'        => 25.7700,
        'longitude'       => -80.1900,
        'amenities'       => array( 'swimming-pool', 'gym', 'concierge', 'parking', 'sea-view', 'security' ),
        'units'           => array(
            array( 'type' => '1 Bedroom', 'bedrooms' => 1, 'bathrooms' => 1, 'area' => 750,  'areaUnit' => 'sqft', 'priceFrom' => 320000, 'priceTo' => 420000 ),
            array( 'type' => '2 Bedroom', 'bedrooms' => 2, 'bathrooms' => 2, 'area' => 1150, 'areaUnit' => 'sqft', 'priceFrom' => 520000, 'priceTo' => 680000 ),
            array( 'type' => '3 Bedroom', 'bedrooms' => 3, 'bathrooms' => 3, 'area' => 1850, 'areaUnit' => 'sqft', 'priceFrom' => 820000, 'priceTo' => 1250000 ),
        ),
        'payment_plan'    => array(
            array( 'label' => 'On Booking',            'percentage' => 10 ),
            array( 'label' => '20% Construction',      'percentage' => 10 ),
            array( 'label' => '50% Construction',      'percentage' => 15 ),
            array( 'label' => '80% Construction',      'percentage' => 15 ),
            array( 'label' => 'On Handover',            'percentage' => 50, 'dueDate' => '2027-06' ),
        ),
    ),
    array(
        'title'           => 'Skyline Gardens',
        'description'     => 'A striking 45-storey tower rising above the Brickell skyline, Skyline Gardens pairs sculptural architecture with sky gardens on every fifth floor. Currently under construction with select units still available.',
        'developer'       => 'skyline',
        'status'          => 'under-construction',
        'completion_date' => '2026-12',
        'total_units'     => 150,
        'available_units' => 40,
        'currency'        => 'USD',
        'min_price'       => 450000,
        'max_price'       => 900000,
        'address'         => '88 Skyline Gardens Way',
        'city'            => 'Miami',
        'country'         => 'USA',
        'latitude'        => 25.7620,
        'longitude'       => -80.1930,
        'amenities'       => array( 'swimming-pool', 'gym', 'rooftop', 'concierge', 'security', 'smart-home' ),
        'units'           => array(
            array( 'type' => '1 Bedroom', 'bedrooms' => 1, 'bathrooms' => 1, 'area' => 680,  'areaUnit' => 'sqft', 'priceFrom' => 450000, 'priceTo' => 520000 ),
            array( 'type' => '2 Bedroom', 'bedrooms' => 2, 'bathrooms' => 2, 'area' => 1050, 'areaUnit' => 'sqft', 'priceFrom' => 620000, 'priceTo' => 900000 ),
        ),
        'payment_plan'    => array(
            array( 'label' => 'On Booking',   'percentage' => 20 ),
            array( 'label' => 'Under Construction', 'percentage' => 30 ),
            array( 'label' => 'On Handover',  'percentage' => 50, 'dueDate' => '2026-12' ),
        ),
    ),
    array(
        'title'           => 'Coral Vista Towers',
        'description'     => 'A fully completed twin-tower development overlooking Coral Vista Park. Featuring resort-style amenities, a private members lounge, and panoramic city views — now nearly sold out.',
        'developer'       => 'meridian',
        'status'          => 'completed',
        'completion_date' => '2025-01',
        'total_units'     => 300,
        'available_units' => 5,
        'currency'        => 'USD',
        'min_price'       => 380000,
        'max_price'       => 1600000,
        'address'         => '250 Coral Vista Park Drive',
        'city'            => 'Miami',
        'country'         => 'USA',
        'latitude'        => 25.7490,
        'longitude'       => -80.2580,
        'amenities'       => array( 'swimming-pool', 'gym', 'concierge', 'parking', 'pet-friendly', 'security' ),
        'units'           => array(
            array( 'type' => '2 Bedroom', 'bedrooms' => 2, 'bathrooms' => 2, 'area' => 1200, 'areaUnit' => 'sqft', 'priceFrom' => 380000, 'priceTo' => 620000 ),
            array( 'type' => 'Penthouse',  'bedrooms' => 4, 'bathrooms' => 4, 'area' => 3400, 'areaUnit' => 'sqft', 'priceFrom' => 1250000, 'priceTo' => 1600000 ),
        ),
        'payment_plan'    => array(
            array( 'label' => 'Paid in Full at Handover', 'percentage' => 100, 'dueDate' => '2025-01' ),
        ),
    ),
);

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

$results = array();

foreach ( $agents as $agent ) {
    $results[] = array_merge( array( 'type' => 'Agent' ), uk_create_agent( $agent ) );
}

foreach ( $properties as $property ) {
    $results[] = array_merge( array( 'type' => 'Property' ), uk_create_property( $property ) );
}

$developer_ids = array();
foreach ( $developers as $key => $developer ) {
    $result = uk_create_developer( $developer );
    $results[] = array_merge( array( 'type' => 'Developer' ), $result );
    if ( $result['ok'] ) {
        $developer_ids[ $key ] = $result['id'];
    }
}

foreach ( $projects as $project ) {
    $project['developer_id'] = $developer_ids[ $project['developer'] ] ?? 0;
    $results[] = array_merge( array( 'type' => 'Project' ), uk_create_project( $project ) );
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

$success = array_filter( $results, fn( $r ) => $r['ok'] );
$failed  = array_filter( $results, fn( $r ) => ! $r['ok'] );
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>UrbanKey Seeder</title>
<style>
  body { font-family: -apple-system, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #1a1a2e; }
  h1 { font-size: 1.6rem; }
  .badge { display:inline-block; padding:2px 10px; border-radius:20px; font-size:.8rem; font-weight:600; }
  .ok  { background:#d1fae5; color:#065f46; }
  .skip { background:#e0e7ff; color:#3730a3; }
  .err { background:#fee2e2; color:#991b1b; }
  table { width:100%; border-collapse:collapse; margin-top:20px; font-size:.9rem; }
  th { text-align:left; padding:8px 12px; background:#f3f4f6; border-bottom:2px solid #e5e7eb; }
  td { padding:8px 12px; border-bottom:1px solid #f3f4f6; }
  .warn { background:#fff7ed; border:1px solid #fed7aa; border-radius:8px; padding:16px 20px; margin-top:24px; }
  .warn strong { color:#c2410c; }
</style>
</head>
<body>
<h1>UrbanKey — Seed Complete</h1>
<p>
  <span class="badge ok"><?php echo count( $success ); ?> created</span>
  <?php if ( count( $failed ) ) : ?>
    &nbsp;<span class="badge err"><?php echo count( $failed ); ?> failed</span>
  <?php endif; ?>
</p>

<table>
  <thead>
    <tr><th>Type</th><th>Name / Title</th><th>Status</th><th>Post ID</th></tr>
  </thead>
  <tbody>
    <?php foreach ( $results as $r ) : ?>
    <tr>
      <td><?php echo esc_html( $r['type'] ); ?></td>
      <td><?php echo esc_html( $r['title'] ?? $r['name'] ?? '—' ); ?></td>
      <td>
        <?php if ( ! empty( $r['skipped'] ) ) : ?>
          <span class="badge skip">↷ Already exists</span>
        <?php elseif ( $r['ok'] ) : ?>
          <span class="badge ok">✓ Created</span>
        <?php else : ?>
          <span class="badge err">✗ <?php echo esc_html( $r['error'] ); ?></span>
        <?php endif; ?>
      </td>
      <td><?php echo isset( $r['id'] ) ? esc_html( $r['id'] ) : '—'; ?></td>
    </tr>
    <?php endforeach; ?>
  </tbody>
</table>

<div class="warn">
  <strong>⚠️ Delete this file now.</strong><br>
  Connect via SFTP or use the Hostinger File Manager to delete
  <code>public_html/seed.php</code> immediately.
</div>
</body>
</html>
