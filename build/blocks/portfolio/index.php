<?php
/**
 * WPZOOM Blocks - Custom Gutenberg blocks designed by WPZOOM.
 *
 * @package   WPZOOM_Blocks
 * @author    WPZOOM
 * @copyright 2020 WPZOOM
 * @license   GPL-2.0-or-later
 */

// Exit if accessed directly
defined( 'ABSPATH' ) || exit;

/**
 * Class WPZOOM_Blocks_Portfolio
 *
 * Container class of the Portfolio block used in the WPZOOM Blocks WordPress plugin.
 *
 * @since 1.0.0
 */
class WPZOOM_Blocks_Portfolio {
	/**
	 * Attributes for the block, used in the Gutenberg editor.
	 *
	 * @var    array
	 * @access public
	 * @since  1.0.0
	 */
	public $attributes = [
		'align' => [
			'type' => 'string',
			'default' => ''
		],
		'amount' => [
			'type' => 'number',
			'default' => 6
		],
		'alwaysPlayBackgroundVideo' => [
			'type' => 'boolean',
			'default' => false
		],
		'categories' => [
			'type' => 'array',
			'items' => [ 'type' => 'string' ]
		],
		'columnsAmount' => [
			'type' => 'number',
			'default' => 4
		],
		'excerptLength' => [
			'type' => 'number',
			'default' => 20
		],
		'layout' => [
			'type' => 'string',
			'default' => 'grid'
		],
		'lazyLoad' => [
			'type' => 'boolean',
			'default' => true
		],
		'lightbox' => [
			'type' => 'boolean',
			'default' => true
		],
		'lightboxCaption' => [
			'type' => 'boolean',
			'default' => false
		],
		'order' => [
			'type' => 'string',
			'default' => 'desc'
		],
		'orderBy' => [
			'type' => 'string',
			'default' => 'date'
		],
		'readMoreLabel' => [
			'type' => 'string',
			'default' => 'Read More'
		],
		'showAuthor' => [
			'type' => 'boolean',
			'default' => true
		],
		'showBackgroundVideo' => [
			'type' => 'boolean',
			'default' => true
		],
		'showCategoryFilter' => [
			'type' => 'boolean',
			'default' => true
		],
		'showDate' => [
			'type' => 'boolean',
			'default' => true
		],
		'showExcerpt' => [
			'type' => 'boolean',
			'default' => true
		],
		'showReadMore' => [
			'type' => 'boolean',
			'default' => true
		],
		'showThumbnail' => [
			'type' => 'boolean',
			'default' => true
		],
		'showViewAll' => [
			'type' => 'boolean',
			'default' => true
		],
		'thumbnailSize' => [
			'type' => 'string',
			'default' => 'thumbnail'
		],
		'viewAllLabel' => [
			'type' => 'string',
			'default' => 'View All'
		],
		'viewAllLink' => [
			'type' => 'string',
			'default' => ''
		]
	];

	/**
	 * Basic class initialization.
	 *
	 * @access public
	 * @return void
	 * @since  1.0.0
	 */
	public function __construct() {
		// Add the portfolio post type
		register_post_type( 'wpzb_portfolio', array(
			'can_export'          => true,
			'description'         => __( 'A portfolio type for featuring items in your portfolio.', 'wpzoom-blocks' ),
			'exclude_from_search' => false,
			'has_archive'         => true,
			'hierarchical'        => false,
			'labels'              => array(
				'add_new'                  => _x( 'Add New', 'wpzb_portfolio', 'wpzoom-blocks' ),
				'add_new_item'             => __( 'Add New Portfolio Item', 'wpzoom-blocks' ),
				'all_items'                => __( 'All Portfolio Items', 'wpzoom-blocks' ),
				'archives'                 => _x( 'Portfolio Archives', 'The post type archive label used in nav menus. Default "Post Archives". Added in 4.4', 'wpzoom-blocks' ),
				'attributes'               => __( 'Portfolio Item Attributes', 'wpzoom-blocks' ),
				'edit_item'                => __( 'Edit Portfolio Item', 'wpzoom-blocks' ),
				'featured_image'           => _x( 'Cover Image', 'Overrides the "Featured Image" phrase for this post type. Added in 4.3', 'wpzoom-blocks' ),
				'filter_items_list'        => _x( 'Filter portfolio items list', 'Screen reader text for the filter links heading on the post type listing screen. Default "Filter posts list". Added in 4.4', 'wpzoom-blocks' ),
				'insert_into_item'         => _x( 'Insert into portfolio item', 'Overrides the "Insert into post" phrase (used when inserting media into a post). Added in 4.4', 'wpzoom-blocks' ),
				'items_list'               => _x( 'Portfolio Items list', 'Screen reader text for the items list heading on the post type listing screen. Default "Posts list". Added in 4.4', 'wpzoom-blocks' ),
				'items_list_navigation'    => _x( 'Portfolio Items list navigation', 'Screen reader text for the pagination heading on the post type listing screen. Default "Posts list navigation". Added in 4.4', 'wpzoom-blocks' ),
				'item_published'           => __( 'Portfolio Item published.', 'wpzoom-blocks' ),
				'item_published_privately' => __( 'Portfolio Item published privately.', 'wpzoom-blocks' ),
				'item_reverted_to_draft'   => __( 'Portfolio Item reverted to draft.', 'wpzoom-blocks' ),
				'item_scheduled'           => __( 'Portfolio Item scheduled.', 'wpzoom-blocks' ),
				'item_updated'             => __( 'Portfolio Item updated.', 'wpzoom-blocks' ),
				'menu_name'                => _x( 'Portfolio', 'Admin Menu text', 'wpzoom-blocks' ),
				'name'                     => _x( 'Portfolio', 'Post type general name', 'wpzoom-blocks' ),
				'name_admin_bar'           => _x( 'Portfolio Item', 'Add New on Toolbar', 'wpzoom-blocks' ),
				'new_item'                 => __( 'New Portfolio Item', 'wpzoom-blocks' ),
				'not_found'                => __( 'No portfolio items found.', 'wpzoom-blocks' ),
				'not_found_in_trash'       => __( 'No portfolio items found in Trash.', 'wpzoom-blocks' ),
				'parent_item_colon'        => __( 'Parent Portfolio Items:', 'wpzoom-blocks' ),
				'remove_featured_image'    => _x( 'Remove cover image', 'Overrides the "Remove featured image" phrase for this post type. Added in 4.3', 'wpzoom-blocks' ),
				'search_items'             => __( 'Search Portfolio Items', 'wpzoom-blocks' ),
				'set_featured_image'       => _x( 'Set cover image', 'Overrides the "Set featured image" phrase for this post type. Added in 4.3', 'wpzoom-blocks' ),
				'singular_name'            => _x( 'Portfolio Item', 'Post type singular name', 'wpzoom-blocks' ),
				'uploaded_to_this_item'    => _x( 'Uploaded to this portfolio item', 'Overrides the "Uploaded to this post" phrase (used when viewing media attached to a post). Added in 4.4', 'wpzoom-blocks' ),
				'use_featured_image'       => _x( 'Use as cover image', 'Overrides the "Use as featured image" phrase for this post type. Added in 4.3', 'wpzoom-blocks' ),
				'view_item'                => __( 'View Portfolio Item', 'wpzoom-blocks' ),
				'view_items'               => __( 'View Portfolio Items', 'wpzoom-blocks' )
			),
			'menu_icon'           => 'dashicons-portfolio',
			'menu_position'       => 26,
			'public'              => true,
			'rewrite'             => array( 'slug' => 'portfolio/%category%' ),
			'show_in_rest'        => true,
			'supports'            => array( 'author', 'custom-fields', 'editor', 'excerpt', 'revisions', 'thumbnail', 'title' ),
		) );

		// Add the portfolio categories taxonomy
		register_taxonomy( 'wpzb_portfolio_category', 'wpzb_portfolio', array(
			'description'       => __( 'Categories for portfolio items.', 'wpzoom-blocks' ),
			'hierarchical'      => true,
			'labels'            => array(
				'add_new_item'               => __( 'Add New Category', 'wpzoom-blocks' ),
				'add_or_remove_items'        => __( 'Add or remove categories', 'wpzoom-blocks' ),
				'all_items'                  => __( 'All Categories', 'wpzoom-blocks' ),
				'back_to_items'              => __( '&larr; Back to Categories', 'wpzoom-blocks' ),
				'choose_from_most_used'      => __( 'Choose from the most used categories', 'wpzoom-blocks' ),
				'edit_item'                  => __( 'Edit Category', 'wpzoom-blocks' ),
				'items_list'                 => __( 'Categories list', 'wpzoom-blocks' ),
				'items_list_navigation'      => __( 'Categories list navigation', 'wpzoom-blocks' ),
				'most_used'                  => _x( 'Most Used', 'categories', 'wpzoom-blocks' ),
				'name'                       => _x( 'Categories', 'taxonomy general name', 'wpzoom-blocks' ),
				'new_item_name'              => __( 'New Category Name', 'wpzoom-blocks' ),
				'no_terms'                   => __( 'No categories', 'wpzoom-blocks' ),
				'not_found'                  => __( 'No categories found.', 'wpzoom-blocks' ),
				'parent_item'                => __( 'Parent Category', 'wpzoom-blocks' ),
				'parent_item_colon'          => __( 'Parent Category:', 'wpzoom-blocks' ),
				'popular_items'              => __( 'Popular Categories', 'wpzoom-blocks' ),
				'search_items'               => __( 'Search Categories', 'wpzoom-blocks' ),
				'separate_items_with_commas' => __( 'Separate categories with commas', 'wpzoom-blocks' ),
				'singular_name'              => _x( 'Category', 'taxonomy singular name', 'wpzoom-blocks' ),
				'update_item'                => __( 'Update Category', 'wpzoom-blocks' ),
				'view_item'                  => __( 'View Category', 'wpzoom-blocks' )
			),
			'public'            => true,
			'rewrite'           => array( 'slug' => 'portfolio' ),
			'show_admin_column' => true,
			'show_in_rest'      => true
		) );

		// Register the post meta fields for storing a video for a portfolio item
		register_post_meta( 'wpzb_portfolio', '_wpzb_portfolio_video_type', array(
			'show_in_rest'      => true,
			'type'              => 'string',
			'single'            => true,
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => function () { return current_user_can( 'edit_posts' ); }
		) );
		register_post_meta( 'wpzb_portfolio', '_wpzb_portfolio_video_id', array(
			'show_in_rest'      => true,
			'type'              => 'string',
			'single'            => true,
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => function () { return current_user_can( 'edit_posts' ); }
		) );
		register_post_meta( 'wpzb_portfolio', '_wpzb_portfolio_video_url', array(
			'show_in_rest'      => true,
			'type'              => 'string',
			'single'            => true,
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => function () { return current_user_can( 'edit_posts' ); }
		) );

		// Ensure there is a Uncategorized category for the portfolio post type
		if ( is_null( term_exists( 'uncategorized', 'wpzb_portfolio_category' ) ) ) {
			wp_insert_term( __( 'Uncategorized', 'wpzoom-blocks' ), 'wpzb_portfolio_category', array( 'slug' => 'uncategorized' ) );
		}

		// Ensure the Uncategorized category is the default for the portfolio post type
		$term = get_term_by( 'slug', 'uncategorized', 'wpzb_portfolio_category' );
		if ( false === get_option( 'default_wpzb_portfolio_category', false ) && $term ) {
			update_option( 'default_wpzb_portfolio_category', $term->term_id );
		}

		// Use the Uncategorized category for any portfolio posts saved without a category selected
		add_action( 'save_post', array( $this, 'set_default_object_terms' ), 10, 3 );

		// Filter post type links for portfolio items
		add_filter( 'post_type_link', array( $this, 'post_type_link_replace' ), 1, 3 );
	}

	/**
	 * Renders the block contents on the frontend.
	 *
	 * @access public
	 * @param  array  $attr    Array containing the block attributes.
	 * @param  string $content String containing the block content.
	 * @return string
	 * @since  1.0.0
	 */
	public function render( $attr, $content ) {
		// Specify the output and class variables to be used below
		$output = '';
		$class = 'wpzoom-blocks_portfolio-block';

		// Might need to align the block
		$align = isset( $attr[ 'align' ] ) && ! empty( $attr[ 'align' ] ) ? ' align' . $attr[ 'align' ] : '';

		// CSS classes for the layout type and columns amount
		$layout = isset( $attr[ 'layout' ] ) && ! empty( $attr[ 'layout' ] ) ? ' layout-' . $attr[ 'layout' ] : '';
		$columns = isset( $attr[ 'layout' ] ) && 'list' != $attr[ 'layout' ] &&
		           isset( $attr[ 'columnsAmount' ] ) && ! empty( $attr[ 'columnsAmount' ] ) ? ' columns-' . $attr[ 'columnsAmount' ] : '';

		// Build the category filter buttons, if enabled
		$cats = isset( $attr[ 'categories' ] ) ? $this->list_categories( $attr[ 'categories' ] ) : '';
		$cats_filter = $attr[ 'showCategoryFilter' ] && ! empty( $cats ) ? '<div class="' . $class . '_filter"><ul>' . $cats . '</ul></div>' : '';

		// Build the View All button, if enabled
		$view_all_label = isset( $attr[ 'viewAllLabel' ] ) && ! empty( $attr[ 'viewAllLabel' ] ) ? $attr[ 'viewAllLabel' ] : __( 'View All', 'wpzoom-blocks' );
		$view_all_link = esc_url( ! empty( $attr[ 'viewAllLink' ] ) ? $attr[ 'viewAllLink' ] : site_url( '/portfolio/' ) );
		$view_all = $attr[ 'showViewAll' ] ? '<div class="' . $class . '_view-all wp-block-button">
			<a href="' . $view_all_link . '" title="' . esc_attr( $view_all_label ) . '" class="wp-block-button__link">' . $view_all_label . '</a>
		</div>' : '';

		// Fetch portfolio items using the specified attributes
		$params = array(
			'order'          => isset( $attr[ 'order' ] ) ? $attr[ 'order' ] : 'desc',
			'orderby'        => isset( $attr[ 'orderBy' ] ) ? $attr[ 'orderBy' ] : 'date',
			'posts_per_page' => isset( $attr[ 'orderBy' ] ) ? $attr[ 'amount' ] : 6,
			'post_type'      => array( 'wpzb_portfolio', 'portfolio_item' )
		);
		if ( isset( $attr[ 'categories' ] ) && !empty( $attr[ 'categories' ] ) && count( array_filter( $attr[ 'categories' ] ) ) > 0 ) {
			$params[ 'tax_query' ] = array(
				'relation' => 'OR',
				array(
					'taxonomy' => 'wpzb_portfolio_category',
					'field'    => 'term_id',
					'terms'    => $attr[ 'categories' ]
				),
				array(
					'taxonomy' => 'portfolio',
					'field'    => 'term_id',
					'terms'    => $attr[ 'categories' ]
				)
			);
		}
		$query = new WP_Query( $params );

		// If the above query returned any results...
		if ( $query->have_posts() ) {
			// Go through every portfolio item in the results...
			foreach ( $query->posts as $post ) {
				// Declare several variables to be used for outputting the portfolio item in this iteration
				$id = $post->ID;
				$permalink = esc_url( get_permalink( $post ) );
				$title = get_the_title( $post );
				$title_attr = the_title_attribute( array( 'post' => $post, 'echo' => false ) );
				$thumbnail = get_the_post_thumbnail( $post, $attr[ 'thumbnailSize' ] );

				// Open the list item for this portfolio item
				$output .= '<li class="' . $class . '_portfolio-item ' . $class . '_portfolio-item-' . $id . '">';

				// Add a wrapper article around the entire portfolio item (including the thumbnail)
				$output .= '<article class="' . $class . '_portfolio-item-wrap">';

				// If the thumbnail should be shown...
				if ( $attr[ 'showThumbnail' ] && ! empty( $thumbnail ) ) {
					// Add it to the output
					$output .= '<div class="' . $class . '_portfolio-item-thumbnail">
						<a href="' . $permalink . '" title="' . $title_attr . '" rel="bookmark">' . $thumbnail . '</a>
					</div>';
				}

				// Add a wrapper div around just the portfolio item details (excluding the thumbnail)
				$output .= '<div class="' . $class . '_portfolio-item-details">';

				// Add the portfolio item title to the output
				$output .= '<h3 class="' . $class . '_portfolio-item-title">
					<a href="' . $permalink . '" title="' . $title_attr . '" rel="bookmark">' . $title . '</a>
				</h3>';

				// Add a wrapper div around just the portfolio item meta if needed
				if ( $attr[ 'showAuthor' ] || $attr[ 'showDate' ] ) {
					$output .= '<div class="' . $class . '_portfolio-item-meta">';
				}

				// If the author should be shown...
				if ( $attr[ 'showAuthor' ] ) {
					// Get the author details
					$author_name = get_the_author_meta( 'display_name', $post->post_author );
					$author_url = esc_url( get_author_posts_url( $post->post_author ) );
					$author_title = esc_attr( sprintf( __( 'Posts by %s', 'wpzoom-blocks' ), $author_name ) );

					// Add the author to the output
					$output .= '<cite class="' . $class . '_portfolio-item-author">
						<a href="' . $author_url . '" title="' . $author_title . '" rel="author">' . $author_name . '</a>
					</cite>';
				}

				// If the date should be shown...
				if ( $attr[ 'showDate' ] ) {
					// Get the properly formatted date
					$date = apply_filters( 'the_date', get_the_date( '', $post ), '', '', '' );
					$datetime = esc_attr( get_the_date( 'c', $post ) );
					$date_url = esc_url( get_day_link( get_the_time( 'Y', $post ), get_the_time( 'm', $post ), get_the_time( 'd', $post ) ) );
					$date_title = esc_attr( sprintf( __( 'Posted on %s', 'wpzoom-blocks' ), $date ) );

					// Add the date to the output
					$output .= '<time datetime="' . $datetime . '" class="' . $class . '_portfolio-item-date">
						<a href="' . $date_url . '" title="' . $date_title . '">' . $date . '</a>
					</time>';
				}

				// Close the post meta wrapper div if needed
				if ( $attr[ 'showAuthor' ] || $attr[ 'showDate' ] ) {
					$output .= '</div>';
				}

				// If the excerpt should be shown...
				if ( $attr[ 'showExcerpt' ] ) {
					// Get the excerpt
					$raw_cont = get_the_content( '', false, $post );
					$cont = str_replace( ']]>', ']]&gt;', apply_filters( 'the_content', excerpt_remove_blocks( strip_shortcodes( $raw_cont ) ) ) );
					$excerpt = force_balance_tags( html_entity_decode( wp_trim_words( htmlentities( $cont ), $attr[ 'excerptLength' ], null ) ) );

					// Add the excerpt to the output
					$output .= '<div class="' . $class . '_portfolio-item-content">' . $excerpt . '</div>';
				}

				// If the Read More button should be shown...
				if ( $attr[ 'showReadMore' ] ) {
					// Get the label for the button
					$readmore = $attr[ 'readMoreLabel' ] ? $attr[ 'readMoreLabel' ] : __( 'Read More', 'wpzoom-blocks' );
					$readmore_title = esc_attr( __( 'Continue reading this post...', 'wpzoom-blocks' ) );

					// Add the button to the output
					$output .= '<div class="' . $class . '_portfolio-item-readmore-button wp-block-button">
						<a href="' . $permalink . '" title="' . $readmore_title . '" class="wp-block-button__link">' . $readmore . '</a>
					</div>';
				}

				// Close the portfolio item details wrapper div
				$output .= '</div>';

				// Close the portfolio item wrapper article
				$output .= '</article>';

				// Close the list item for this portfolio item
				$output .= '</li>';
			}

			// Reset the WordPress post data so this block doesn't mess up the main query
			wp_reset_postdata();
		} else {
			// The query had no portfolio items so return a 'no portfolio items' message
			$output .= '<li class="' . $class . '_no-portfolio-items">' . __( 'No portfolio items.', 'wpzoom-blocks' ) . '</li>';
		}

		// Return the final output
		return "<div class=\"wpzoom-blocks $class$align$layout$columns\">$cats_filter<ul class=\"{$class}_items-list\">$output</ul>$view_all</div><!--.$class-->";
	}

	/**
	 * Retrieve an HTML list of categories.
	 *
	 * @access public
	 * @param  int|array $current_category The ID of a category, or array of IDs of categories, that should get the 'current-cat' class.
	 * @return string
	 * @since  1.0.0
	 * @see    get_categories()
	 */
	public function list_categories( $selected_category = 0 ) {
		$args = array(
			'child_of'            => 0,
			'current_category'    => $selected_category,
			'depth'               => 0,
			'echo'                => 1,
			'exclude'             => '',
			'exclude_tree'        => '',
			'feed'                => '',
			'feed_image'          => '',
			'feed_type'           => '',
			'hide_empty'          => true,
			'hide_title_if_empty' => false,
			'hierarchical'        => true,
			'order'               => 'ASC',
			'orderby'             => 'name',
			'separator'           => '',
			'show_count'          => 0,
			'show_option_all'     => __( 'All', 'wpzoom-blocks' ),
			'style'               => 'list',
			'taxonomy'            => array( 'wpzb_portfolio_category', 'portfolio' ),
			'use_desc_for_title'  => 1,
		);
		$categories = get_categories( $args );
		$output = '';

		if ( ! empty( $categories ) ) {
			$posts_page = '';

			// For taxonomies that belong only to custom post types, point to a valid archive.
			$taxonomy_object = get_taxonomy( 'wpzb_portfolio_category' );
			if ( ! in_array( 'post', $taxonomy_object->object_type ) && ! in_array( 'page', $taxonomy_object->object_type ) ) {
				foreach ( $taxonomy_object->object_type as $object_type ) {
					$_object_type = get_post_type_object( $object_type );

					// Grab the first one.
					if ( ! empty( $_object_type->has_archive ) ) {
						$posts_page = get_post_type_archive_link( $object_type );
						break;
					}
				}
			}

			// Fallback for the 'All' link is the posts page.
			if ( ! $posts_page ) {
				if ( 'page' == get_option( 'show_on_front' ) && get_option( 'page_for_posts' ) ) {
					$posts_page = get_permalink( get_option( 'page_for_posts' ) );
				} else {
					$posts_page = home_url( '/' );
				}
			}

			$posts_page = esc_url( $posts_page );
			$output .= '<li class="wp-block-button cat-item-all' . ( empty( $selected_category ) ? ' current-cat' : '' ) . '">
				<a href="' . $posts_page . '" class="wp-block-button__link">' . __( 'All', 'wpzoom-blocks' ) . '</a>
			</li>';

			// Filter the HTML output by the walk_category_tree() function to add needed CSS classes
			add_filter( 'category_list_link_attributes', array( $this, 'category_list_link_attributes' ), 10, 5 );
			add_filter( 'category_css_class', array( $this, 'category_css_class' ), 10, 4 );

			// Build the HTML for the categories list
			$output .= walk_category_tree( $categories, -1, $args );

			// Remove the filters added above
			remove_filter( 'category_list_link_attributes', array( $this, 'category_list_link_attributes' ) );
			remove_filter( 'category_css_class', array( $this, 'category_css_class' ) );
		}

		return $output;
	}

	/**
	 * Filters the HTML attributes applied to a category list item’s anchor element.
	 * 
	 * @access public
	 * @param  array   $atts     The HTML attributes applied to the list item's <a> element, empty strings are ignored.
	 * @param  WP_Term $category Term data object.
	 * @param  int     $depth    Depth of category, used for padding.
	 * @param  array   $args     An array of arguments.
	 * @param  int     $id       ID of the current category.
	 * @return array
	 * @since  1.0.0
	 */
	public function category_list_link_attributes( $atts, $category, $depth, $args, $id ) {
		$atts[ 'class' ] = 'wp-block-button__link';

		return $atts;
	}

	/**
	 * Filters the list of CSS classes to include with each category in the list.
	 * 
	 * @access public
	 * @param  array   $css_classes An array of CSS classes to be applied to each list item.
	 * @param  WP_Term $category    Term data object.
	 * @param  int     $depth       Depth of category, used for padding.
	 * @param  array   $args        An array of wp_list_categories() arguments.
	 * @return array
	 * @since  1.0.0
	 */
	public function category_css_class( $css_classes, $category, $depth, $args ) {
		$css_classes[] = 'wp-block-button';

		return $css_classes;
	}

	/**
	 * Filters the post type link for portfolio posts to properly include the category.
	 * Called during the WordPress `post_type_link` filter.
	 *
	 * @access public
	 * @param  string  $post_link The post's permalink.
	 * @param  WP_Post $post      A WP_Post object representing the post related to the post type link.
	 * @return string
	 * @since  1.0.0
	 * @see    get_the_terms()
	 */
	public function post_type_link_replace( $post_link, $post ) {
		if ( 'wpzb_portfolio' == get_post_type( $post ) && false !== stripos( $post_link, '%category%' ) ) {
			$cats = get_the_terms( $post, 'wpzb_portfolio_category' );

			if ( false !== $cats && !is_wp_error( $cats ) ) {
				return str_ireplace( '%category%', $cats[0]->slug, $post_link );
			}
		}

		return $post_link;
	}

	/**
	 * Sets a portfolio posts' category to "Uncategorized" if no category was set on it.
	 * Called during the WordPress `save_post` hook.
	 *
	 * @access public
	 * @param  string  $post_id The post's ID.
	 * @param  WP_Post $post    A WP_Post object representing the post in question.
	 * @param  boolean $update  Whether the post is being updated (instead of added).
	 * @return void
	 * @since  1.0.0
	 * @see    get_the_terms()
	 * @see    wp_set_object_terms()
	 */
	public function set_default_object_terms( $post_id, $post, $update ) {
		if ( 'publish' == $post->post_status && 'wpzb_portfolio' == $post->post_type ) {
			$cats = get_the_terms( $post, 'wpzb_portfolio_category' );

			if ( false === $cats || is_wp_error( $cats ) ) {
				wp_set_object_terms( $post_id, 'uncategorized', 'wpzb_portfolio_category' );
			}
		}
	}
}