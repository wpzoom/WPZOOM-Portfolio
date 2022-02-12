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
			'type'    => 'string',
			'default' => ''
		],
		'amount' => [
			'type'    => 'number',
			'default' => 6
		],
		'alwaysPlayBackgroundVideo' => [
			'type'    => 'boolean',
			'default' => false
		],
		'categories' => [
			'type'  => 'array',
			'items' => [ 'type' => 'string' ]
		],
		'columnsAmount' => [
			'type'    => 'number',
			'default' => 3
		],
		'excerptLength' => [
			'type'    => 'number',
			'default' => 20
		],
		'layout' => [
			'type'    => 'string',
			'default' => 'grid'
		],
		'lightbox' => [
			'type'    => 'boolean',
			'default' => true
		],
		'lightboxCaption' => [
			'type'    => 'boolean',
			'default' => false
		],
		'order' => [
			'type'    => 'string',
			'default' => 'desc'
		],
		'orderBy' => [
			'type'    => 'string',
			'default' => 'date'
		],
		'readMoreLabel' => [
			'type'    => 'string',
			'default' => 'Read More'
		],
		'showAuthor' => [
			'type'    => 'boolean',
			'default' => true
		],
		'showBackgroundVideo' => [
			'type'    => 'boolean',
			'default' => true
		],
		'showCategoryFilter' => [
			'type'    => 'boolean',
			'default' => true
		],
		'showDate' => [
			'type'    => 'boolean',
			'default' => true
		],
		'showExcerpt' => [
			'type'    => 'boolean',
			'default' => true
		],
		'showReadMore' => [
			'type'    => 'boolean',
			'default' => true
		],
		'showThumbnail' => [
			'type'    => 'boolean',
			'default' => true
		],
		'showViewAll' => [
			'type'    => 'boolean',
			'default' => false
		],
		'source' => [
			'type'    => 'string',
			'default' => 'portfolio_item'
		],
		'thumbnailSize' => [
			'type'    => 'string',
			'default' => 'portfolio_item-thumbnail'
		],
		'viewAllLabel' => [
			'type'    => 'string',
			'default' => 'View All'
		],
		'viewAllLink' => [
			'type'    => 'string',
			'default' => ''
		],
		'primaryColor' => [
			'type'    => 'string',
			'default' => '#0BB4AA'
		],
        'secondaryColor' => [
            'type'    => 'string',
            'default' => '#000'
        ]
	];

	/**
	 * The number of result pages for the portfolio items query.
	 *
	 * @var    int
	 * @access private
	 * @since  1.0.0
	 */
	private $result_pages = 0;

	/**
	 * Basic class initialization.
	 *
	 * @access public
	 * @return void
	 * @since  1.0.0
	 */
	public function __construct() {

        // show thumbnail in portfolio list table.
        add_filter( 'manage_portfolio_item_posts_columns', array( $this, 'add_portfolio_item_img_column' ) );
        add_filter( 'manage_portfolio_item_posts_custom_column', array( $this, 'manage_portfolio_item_img_column' ), 10, 2 );


		// Add the portfolio post type
		register_post_type( 'portfolio_item', array(
			'can_export'          => true,
			'description'         => esc_html__( 'A portfolio type for featuring items in your portfolio.', 'wpzoom-portfolio' ),
			'exclude_from_search' => false,
			'has_archive'         => true,
			'hierarchical'        => false,
			'labels'              => array(
				'add_new'                  => esc_html_x( 'Add New', 'portfolio_item', 'wpzoom-portfolio' ),
				'add_new_item'             => esc_html__( 'Add New Portfolio Post', 'wpzoom-portfolio' ),
				'all_items'                => esc_html__( 'All Portfolio Posts', 'wpzoom-portfolio' ),
				'archives'                 => esc_html_x( 'Portfolio Archives', 'The post type archive label used in nav menus. Default "Post Archives". Added in 4.4', 'wpzoom-portfolio' ),
				'attributes'               => esc_html__( 'Portfolio Post Attributes', 'wpzoom-portfolio' ),
				'edit_item'                => esc_html__( 'Edit Portfolio Post', 'wpzoom-portfolio' ),
				'filter_items_list'        => esc_html_x( 'Filter portfolio items list', 'Screen reader text for the filter links heading on the post type listing screen. Default "Filter posts list". Added in 4.4', 'wpzoom-portfolio' ),
				'insert_into_item'         => esc_html_x( 'Insert into portfolio item', 'Overrides the "Insert into post" phrase (used when inserting media into a post). Added in 4.4', 'wpzoom-portfolio' ),
				'items_list'               => esc_html_x( 'Portfolio Items list', 'Screen reader text for the items list heading on the post type listing screen. Default "Posts list". Added in 4.4', 'wpzoom-portfolio' ),
				'items_list_navigation'    => esc_html_x( 'Portfolio Items list navigation', 'Screen reader text for the pagination heading on the post type listing screen. Default "Posts list navigation". Added in 4.4', 'wpzoom-portfolio' ),
				'item_published'           => esc_html__( 'Portfolio Post published.', 'wpzoom-portfolio' ),
				'item_published_privately' => esc_html__( 'Portfolio Post published privately.', 'wpzoom-portfolio' ),
				'item_reverted_to_draft'   => esc_html__( 'Portfolio Post reverted to draft.', 'wpzoom-portfolio' ),
				'item_scheduled'           => esc_html__( 'Portfolio Post scheduled.', 'wpzoom-portfolio' ),
				'item_updated'             => esc_html__( 'Portfolio Post updated.', 'wpzoom-portfolio' ),
				'menu_name'                => esc_html_x( 'Portfolio', 'Admin Menu text', 'wpzoom-portfolio' ),
				'name'                     => esc_html_x( 'Portfolio', 'Post type general name', 'wpzoom-portfolio' ),
				'name_admin_bar'           => esc_html_x( 'Portfolio Post', 'Add New on Toolbar', 'wpzoom-portfolio' ),
				'new_item'                 => esc_html__( 'New Portfolio Post', 'wpzoom-portfolio' ),
				'not_found'                => esc_html__( 'No portfolio posts found.', 'wpzoom-portfolio' ),
				'not_found_in_trash'       => esc_html__( 'No portfolio posts found in Trash.', 'wpzoom-portfolio' ),
				'parent_item_colon'        => esc_html__( 'Parent Portfolio Items:', 'wpzoom-portfolio' ),
				'search_items'             => esc_html__( 'Search Portfolio Posts', 'wpzoom-portfolio' ),
				'singular_name'            => esc_html_x( 'Portfolio Post', 'Post type singular name', 'wpzoom-portfolio' ),
				'uploaded_to_this_item'    => esc_html_x( 'Uploaded to this portfolio item', 'Overrides the "Uploaded to this post" phrase (used when viewing media attached to a post). Added in 4.4', 'wpzoom-portfolio' ),
				'view_item'                => esc_html__( 'View Portfolio Post', 'wpzoom-portfolio' ),
				'view_items'               => esc_html__( 'View Portfolio Posts', 'wpzoom-portfolio' )
			),
			'menu_icon'           => 'dashicons-portfolio',
			'menu_position'       => 26,
			'public'              => true,
            /* The rewrite handles the URL structure. */
            'rewrite'             => array(
                'slug'       => 'project',
                'with_front' => false,
                'pages'      => true,
                'feeds'      => true,
                'ep_mask'    => EP_PERMALINK,
            ),
			'show_in_rest'        => true,
			'supports'            => array( 'author', 'custom-fields', 'editor', 'excerpt', 'revisions', 'thumbnail', 'title' ),
		) );

		// Add the portfolio categories taxonomy
		register_taxonomy( 'portfolio', 'portfolio_item', array(
			'description'       => esc_html__( 'Categories for portfolio items.', 'wpzoom-portfolio' ),
			'hierarchical'      => true,
			'labels'            => array(
				'add_new_item'               => esc_html__( 'Add New Category', 'wpzoom-portfolio' ),
				'add_or_remove_items'        => esc_html__( 'Add or remove categories', 'wpzoom-portfolio' ),
				'all_items'                  => esc_html__( 'All Categories', 'wpzoom-portfolio' ),
				'back_to_items'              => esc_html__( '&larr; Back to Categories', 'wpzoom-portfolio' ),
				'choose_from_most_used'      => esc_html__( 'Choose from the most used categories', 'wpzoom-portfolio' ),
				'edit_item'                  => esc_html__( 'Edit Category', 'wpzoom-portfolio' ),
				'items_list'                 => esc_html__( 'Categories list', 'wpzoom-portfolio' ),
				'items_list_navigation'      => esc_html__( 'Categories list navigation', 'wpzoom-portfolio' ),
				'most_used'                  => esc_html_x( 'Most Used', 'categories', 'wpzoom-portfolio' ),
				'name'                       => esc_html_x( 'Categories', 'taxonomy general name', 'wpzoom-portfolio' ),
				'new_item_name'              => esc_html__( 'New Category Name', 'wpzoom-portfolio' ),
				'no_terms'                   => esc_html__( 'No categories', 'wpzoom-portfolio' ),
				'not_found'                  => esc_html__( 'No categories found.', 'wpzoom-portfolio' ),
				'parent_item'                => esc_html__( 'Parent Category', 'wpzoom-portfolio' ),
				'parent_item_colon'          => esc_html__( 'Parent Category:', 'wpzoom-portfolio' ),
				'popular_items'              => esc_html__( 'Popular Categories', 'wpzoom-portfolio' ),
				'search_items'               => esc_html__( 'Search Categories', 'wpzoom-portfolio' ),
				'separate_items_with_commas' => esc_html__( 'Separate categories with commas', 'wpzoom-portfolio' ),
				'singular_name'              => esc_html_x( 'Category', 'taxonomy singular name', 'wpzoom-portfolio' ),
				'update_item'                => esc_html__( 'Update Category', 'wpzoom-portfolio' ),
				'view_item'                  => esc_html__( 'View Category', 'wpzoom-portfolio' )
			),
			'public'            => true,
            'rewrite'             => array(
                'slug'       => 'portfolio',
                'with_front' => false,
                'pages'      => true,
                'feeds'      => true,
                'ep_mask'    => EP_PERMALINK,
            ),

			'show_admin_column' => true,
			'show_in_rest'      => true
		) );

		// Register the post meta fields for storing a video for a portfolio item
		register_post_meta( 'portfolio_item', '_wpzb_portfolio_video_type', array(
			'show_in_rest'      => true,
			'type'              => 'string',
			'single'            => true,
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => function () { return current_user_can( 'edit_posts' ); }
		) );
		register_post_meta( 'portfolio_item', '_wpzb_portfolio_video_id', array(
			'show_in_rest'      => true,
			'type'              => 'integer',
			'single'            => true,
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => function () { return current_user_can( 'edit_posts' ); }
		) );
		register_post_meta( 'portfolio_item', '_wpzb_portfolio_video_url', array(
			'show_in_rest'      => true,
			'type'              => 'string',
			'single'            => true,
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => function () { return current_user_can( 'edit_posts' ); }
		) );

		// Register a custom image size for use as the default image size
		add_image_size( 'portfolio_item-thumbnail', 600, 400, true );

		// Ensure there is a Uncategorized category for the portfolio post type
		if ( is_null( term_exists( 'uncategorized', 'portfolio' ) ) ) {
			wp_insert_term( esc_html__( 'Uncategorized', 'wpzoom-portfolio' ), 'portfolio', array( 'slug' => 'uncategorized' ) );
		}

		// Ensure the Uncategorized category is the default for the portfolio post type
		$term = get_term_by( 'slug', 'uncategorized', 'portfolio' );
		if ( false === get_option( 'default_portfolio', false ) && $term ) {
			update_option( 'default_portfolio', $term->term_id );
		}

		// Use the Uncategorized category for any portfolio posts saved without a category selected
		add_action( 'save_post', array( $this, 'set_default_object_terms' ), 10, 3 );

		// Filter post type links for portfolio items
		add_filter( 'post_type_link', array( $this, 'post_type_link_replace' ), 1, 3 );

		// Hook into the REST API in order to add some custom things
		add_action( 'rest_api_init', array( $this, 'rest_api_routes' ) );
	}



    /**
      * Add featured image in portfolio list
      *
      * @param array $columns columns of the table.
      *
      * @return array
      */
     public function add_portfolio_item_img_column( $columns = array() ) {
         $column_meta = array(
             'portfolio_item_post_thumbs' => esc_html__( 'Thumbnail', 'wpzoom-portfolio' ),
         );

         // insert after first column.
         $columns = array_slice( $columns, 0, 1, true ) + $column_meta + array_slice( $columns, 1, null, true );

         return $columns;
     }



    /**
         * Add thumb to the column
         *
         * @param bool $column_name column name.
         */
        public function manage_portfolio_item_img_column( $column_name = false ) {
            if ( 'portfolio_item_post_thumbs' === $column_name ) {
                echo '<a href="' . esc_url( get_edit_post_link() ) . '" class="wpzoom-portfolio__thumbnail">';
                if ( has_post_thumbnail() ) {
                    the_post_thumbnail( 'thumbnail' );
                }
                echo '</a>';
            }
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

		// Determine where the portfolio items should come from
		$source = isset( $attr[ 'source' ] ) && ! empty( $attr[ 'source' ] ) ? $attr[ 'source' ] : 'portfolio_item';
		if ( 'portfolio_item' == $source && ! post_type_exists( 'portfolio_item' ) ) {
			$source = 'post';
		}

		// Might need to align the block
		$align = isset( $attr[ 'align' ] ) && ! empty( $attr[ 'align' ] ) ? ' align' . $attr[ 'align' ] : '';

		// Query parameters
		$order = isset( $attr[ 'order' ] ) ? $attr[ 'order' ] : 'desc';
		$order_by = isset( $attr[ 'orderBy' ] ) ? $attr[ 'orderBy' ] : 'date';
		$per_page = isset( $attr[ 'amount' ] ) ? intval( $attr[ 'amount' ] ) : 6;
		$show_thumbnail = isset( $attr[ 'showThumbnail' ] ) ? boolval( $attr[ 'showThumbnail' ] ) : true;
		$thumbnail_size = isset( $attr[ 'thumbnailSize' ] ) ? $attr[ 'thumbnailSize' ] : 'thumbnail';
		$show_video = isset( $attr[ 'showBackgroundVideo' ] ) ? boolval( $attr[ 'showBackgroundVideo' ] ) : true;
		$show_author = isset( $attr[ 'showAuthor' ] ) ? boolval( $attr[ 'showAuthor' ] ) : true;
		$show_date = isset( $attr[ 'showDate' ] ) ? boolval( $attr[ 'showDate' ] ) : true;
		$show_excerpt = isset( $attr[ 'showExcerpt' ] ) ? boolval( $attr[ 'showExcerpt' ] ) : true;
		$excerpt_length = isset( $attr[ 'excerptLength' ] ) ? intval( $attr[ 'excerptLength' ] ) : 20;
		$show_read_more = isset( $attr[ 'showReadMore' ] ) ? boolval( $attr[ 'showReadMore' ] ) : true;

		// CSS classes for query parameters
		$post_type_class = ' post_type-' . $source;
		$order_class = ' order-' . $order;
		$order_by_class = ' orderby-' . $order_by;
		$per_page_class = ' perpage-' . $per_page;
		$thumbnail_class = $show_thumbnail ? ' show-thumbnail' : '';
		$thumbnail_size_class = ' thumbnail-size-' . $thumbnail_size;
		$video_class = $show_video ? ' show-video' : '';
		$author_class = $show_author ? ' show-author' : '';
		$date_class = $show_date ? ' show-date' : '';
		$excerpt_class = $show_excerpt ? ' show-excerpt' : '';
		$excerpt_length_class = ' excerpt-length-' . $excerpt_length;
		$readmore_class = $show_read_more ? ' show-readmore' : '';

		// CSS classes for the layout type and columns amount
		$layout = isset( $attr[ 'layout' ] ) && ! empty( $attr[ 'layout' ] ) ? $attr[ 'layout' ] : 'grid';
		$layout = ' layout-' . $layout;
		$columns = isset( $attr[ 'layout' ] ) && 'list' != $attr[ 'layout' ] &&
		           isset( $attr[ 'columnsAmount' ] ) && ! empty( $attr[ 'columnsAmount' ] ) ? ' columns-' . $attr[ 'columnsAmount' ] : '';

		// Build the category filter buttons, if enabled
		$categories = isset( $attr[ 'categories' ] ) && is_array( $attr[ 'categories' ] ) ? array_filter( $attr[ 'categories' ] ) : array();
		$categories_without_all = ! empty( $categories ) ? array_filter( $categories, function( $v ) { return '-1' != $v; } ) : array();
		$enough_cats = count( $categories_without_all ) > 1 || empty( $categories ) || in_array( '-1', $categories );
		$cats = $this->list_categories( $categories_without_all, $source );
		$cats_filter = $attr[ 'showCategoryFilter' ] && $enough_cats ? '<div class="' . $class . '_filter"><ul>' . $cats . '</ul></div>' : '';

		// Lightbox
		$use_lightbox = isset( $attr[ 'lightbox' ] ) ? $attr[ 'lightbox' ] : true;
		$lightbox_caption = isset( $attr[ 'lightboxCaption' ] ) ? $attr[ 'lightboxCaption' ] : true;
		$lightbox = $use_lightbox ? ( ' use-lightbox' . ( $lightbox_caption ? ' lightbox-with-caption' : '' ) ) : '';

		// Build the View All button, if enabled
		$view_all_label = isset( $attr[ 'viewAllLabel' ] ) && ! empty( $attr[ 'viewAllLabel' ] ) ? $attr[ 'viewAllLabel' ] : esc_html__( 'View All', 'wpzoom-portfolio' );
		$view_all_link = esc_url( ! empty( $attr[ 'viewAllLink' ] ) ? $attr[ 'viewAllLink' ] : site_url( '/portfolio/' ) );
		$show_view_all = isset( $attr[ 'showViewAll' ] ) ? $attr[ 'showViewAll' ] : true;
		$view_all = $show_view_all ? '<div class="' . $class . '_view-all">
			<a href="' . $view_all_link . '" title="' . esc_attr( $view_all_label ) . '" class="wpz-portfolio-button__link">' . $view_all_label . '</a>
		</div>' : '';

		// Build a string with all the CSS classes
		$classes = "$class$order_class$order_by_class$per_page_class$thumbnail_class$thumbnail_size_class$video_class$author_class
		            $date_class$excerpt_class$excerpt_length_class$readmore_class$align$layout$columns$lightbox$post_type_class";

		// Try to get portfolio items
		$items_html = $this->items_html( array(
			'categories'            => $categories,
			'class'                 => 'wpzoom-blocks_portfolio-block',
			'excerpt_length'        => $excerpt_length,
			'layout'                => $layout,
			'order'                 => $order,
			'order_by'              => $order_by,
			'per_page'              => $per_page,
			'read_more_label'       => esc_html__( 'Read More', 'wpzoom-portfolio' ),
			'show_author'           => $show_author,
			'show_background_video' => $show_video,
			'show_date'             => $show_date,
			'show_excerpt'          => $show_excerpt,
			'show_read_more'        => $show_read_more,
			'show_thumbnail'        => $show_thumbnail,
			'source'                => $source,
			'thumbnail_size'        => $thumbnail_size
		) );

		// Show more button
		$show_more = $this->result_pages > 1 ? '<div class="' . $class . '_show-more">
			<a href="#" title="' . esc_attr__( 'Show more portfolio items', 'wpzoom-portfolio' ) . '" class="wpz-portfolio-button__link">' . esc_html__( 'Load More...', 'wpzoom-portfolio' ) . '</a>
		</div>' : '';

		// Build the wrapper for the Show More and View All buttons
		$both_btns = empty( $show_more ) || empty( $view_all ) ? ' single-button' : '';
		$btns_wrap = ! empty( $show_more ) || ! empty( $view_all ) ? "<div class=\"{$class}_show-more-view-all-wrap{$both_btns}\">
			$show_more
			$view_all
		</div>" : '';

		// If there are any portfolio items to show...
		if ( ! empty( $items_html ) ) {
			// Add them to the final output
			$output .= $items_html;
		}
		// Otherwise, the query returned no portfolio items...
		else {
			// Add a 'no portfolio items' message to the output
			$output .= '<li class="' . $class . '_no-portfolio-items">' . esc_html__(  'No portfolio items.', 'wpzoom-portfolio' ) . '</li>';
		}

		$filter_color_hover = '.wpzoom-blocks_portfolio-block .wpzoom-blocks_portfolio-block_filter ul li a:hover,
                         .wpzoom-blocks_portfolio-block .wpzoom-blocks_portfolio-block_filter ul li.current-cat a,
                         .wpzoom-blocks_portfolio-block .wpzoom-blocks_portfolio-block_filter ul li.current-cat a:hover {
							color:' . $attr['primaryColor'] . ';
		                 }';

        $filter_color = '.wpzoom-blocks_portfolio-block .wpzoom-blocks_portfolio-block_filter ul li a {
                                    color:' . $attr['secondaryColor'] . ';
                                 }';
		$button_color_hover = '.wpzoom-blocks_portfolio-block .wpz-portfolio-button__link {
							background:' . $attr['secondaryColor'] . ';
						}';

        $button_color = '.wpzoom-blocks_portfolio-block .wpz-portfolio-button__link:hover,
                        .wpzoom-blocks_portfolio-block .wpz-portfolio-button__link:focus,
                        .wpzoom-blocks_portfolio-block .wpz-portfolio-button__link:active {
                            background:' . $attr['primaryColor'] . ';
                        }';
		$css = sprintf( 
			'<style>%s</style>',
			$filter_color .
            $filter_color_hover .
			$button_color .
            $button_color_hover
		);
		

		// Return the final output
		return "<div class=\"wpzoom-blocks $classes\">$cats_filter<ul class=\"{$class}_items-list\">$output</ul>$btns_wrap</div><!--.$class-->$css";
	}

	/**
	 * Returns the HTML string for all the portfolio items found matching the given query parameters.
	 *
	 * @access public
	 * @param  array  $arguments The arguments used to modify the output.
	 * @return string
	 * @since  1.0.0
	 */
	public function items_html( $arguments = null ) {
		// Setup some default values
		$defaults = array(
			'categories'            => array(),
			'class'                 => 'wpzoom-blocks_portfolio-block',
			'excerpt_length'        => 20,
			'layout'                => 'grid',
			'order'                 => 'desc',
			'order_by'              => 'date',
			'page'                  => 1,
			'per_page'              => 6,
			'read_more_label'       => esc_html__(  'Read More', 'wpzoom-portfolio' ),
			'show_author'           => true,
			'show_background_video' => true,
			'show_date'             => true,
			'show_excerpt'          => true,
			'show_read_more'        => true,
			'show_thumbnail'        => true,
			'source'                => 'portfolio_item',
			'thumbnail_size'        => 'portfolio_item-thumbnail'
		);

		// Parse the arguments to build the arguments array
		$args = wp_parse_args( $arguments, $defaults );

		// The final HTML string value
		$output = '';

		// The CSS class name with a prefix
		$class = $args[ 'class' ];

		// The source of the posts
		$source = $args[ 'source' ];
		if ( 'portfolio_item' == $source && ! post_type_exists( 'portfolio_item' ) ) {
			$source = 'portfolio_item';
		}

		// Build a parameters array to use for the posts query
		$params = array(
			'order'          => $args[ 'order' ],
			'orderby'        => $args[ 'order_by' ],
			'posts_per_page' => $args[ 'per_page' ],
			'paged'          => $args[ 'page' ],
			'post_type'      => $source
		);

		// If filter categories were specified...
		if ( !empty( $args[ 'categories' ] ) && count( array_filter( $args[ 'categories' ] ) ) > 0 && '-1' != $args[ 'categories' ][0] ) {
			// Add them to the parameters for the query
			$params[ 'tax_query' ] = array(
				array(
					'taxonomy' => 'portfolio_item' == $source ? 'portfolio' : 'category',
					'field'    => 'term_id',
					'terms'    => $args[ 'categories' ]
				)
			);
		}

		// Perform the query to get the desired portfolio items
		$query = new WP_Query( $params );

		// Cache the amount of pages returned by the query
		$this->result_pages = $query->max_num_pages;

		// If the above query returned any results...
		if ( $query->have_posts() ) {
			// Go through every portfolio item in the results...
			foreach ( $query->posts as $post ) {
				// Declare several variables to be used for outputting the portfolio item in this iteration
				$id = $post->ID;
				$permalink = esc_url( get_permalink( $post ) );
				$title = get_the_title( $post );
				$title_attr = the_title_attribute( array( 'post' => $post, 'echo' => false ) );
				$the_categories = get_the_terms( $id, ( 'portfolio_item' == $source ? 'portfolio' : 'category' ) );
				$no_category = get_term_by( 'slug', 'uncategorized', ( 'portfolio_item' == $source ? 'portfolio' : 'category' ) );
				$category = ! is_wp_error( $the_categories ) && is_array( $the_categories ) && count( $the_categories ) > 0 ? $the_categories[0]->term_id : $no_category->term_id;
				$thumbnail = get_the_post_thumbnail( $post, $args[ 'thumbnail_size' ] );
				$video_type = 'service' == get_post_meta( $id, '_wpzb_portfolio_video_type', true ) ? 'service' : 'library';
				$video_id = intval( get_post_meta( $id, '_wpzb_portfolio_video_id', true ) );
				$video_url = trim( get_post_meta( $id, '_wpzb_portfolio_video_url', true ) );
				$video = $this->get_video_embed_code( ( 'service' == $video_type ? $video_url : wp_get_attachment_url( $video_id ) ), 'library' == $video_type );
				$has_cover = ( $args[ 'show_background_video' ] && ! empty( $video ) ) || ( $args[ 'show_thumbnail' ] && ! empty( $thumbnail ) );
				$cover_class = $has_cover ? ' has-cover' : '';

				// Open the list item for this portfolio item
				$output .= "<li class='${class}_item ${class}_item-$id ${class}_category-$category$cover_class fade-in'  data-category='$category'>";

				// Add a wrapper article around the entire portfolio item (including the thumbnail)
				$output .= "<article class='${class}_item-wrap'>";

				// If the video should be shown...
				if ( $args[ 'show_background_video' ] && ! empty( $video ) ) {
					// Add it to the output
					$output .= "<div class='${class}_item-bgvid'><div class='${class}_item-media'>$video</div></div>";
				}
				// If the thumbnail should be shown...
				elseif ( $args[ 'show_thumbnail' ] && ! empty( $thumbnail ) ) {
					// Add it to the output
					$output .= "<div class='${class}_item-thumbnail'>
						<div class='${class}_item-media'>
							<a href='$permalink' title='$title_attr' rel='bookmark'>$thumbnail</a>
						</div>
					</div>";
				}

				// Add a wrapper div around just the portfolio item details (excluding the thumbnail)
				$output .= "<div class='${class}_item-details'>";

                // Add the lightbox icon
                $output .= "<span class='${class}_lightbox_icon'><svg enable-background='new 0 0 32 32' id='Layer_4' version='1.1' viewBox='0 0 32 32' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g><rect fill='none' height='30' stroke='#fff' stroke-linejoin='round' stroke-miterlimit='10' stroke-width='2' transform='matrix(6.123234e-17 -1 1 6.123234e-17 0 32)' width='30' x='1' y='1'/><line fill='none' stroke='#fff' stroke-linejoin='round' stroke-miterlimit='10' stroke-width='2' x1='27' x2='5' y1='5' y2='27'/><polyline fill='none' points='16,27 5,27 5,16     ' stroke='#fff' stroke-linejoin='round' stroke-miterlimit='10' stroke-width='2'/><polyline fill='none' points='16,5 27,5 27,16     ' stroke='#fff' stroke-linejoin='round' stroke-miterlimit='10' stroke-width='2'/></g></svg></span>";

				// Add the portfolio item title to the output
				$output .= "<h3 class='${class}_item-title'><a href='$permalink' title='$title_attr' rel='bookmark'>$title</a></h3>";

				// If the layout type is set to list...
				if ( 'list' == $args[ 'layout' ] ) {
					// Add a wrapper div around just the portfolio item meta if needed
					if ( $args[ 'show_author' ] || $args[ 'show_date' ] ) {
						$output .= "<div class='${class}_item-meta'>";
					}

					// If the author should be shown...
					if ( $args[ 'show_author' ] ) {
						// Get the author details
						$author_name = get_the_author_meta( 'display_name', $post->post_author );
						$author_url = esc_url( get_author_posts_url( $post->post_author ) );
						$author_title = esc_attr( sprintf( __( 'Posts by %s', 'wpzoom-portfolio' ), $author_name ) );

						// Add the author to the output
						$output .= "<cite class='${class}_item-author'><a href='$author_url' title='$author_title' rel='author'>$author_name</a></cite>";
					}

					// If the date should be shown...
					if ( $args[ 'show_date' ] ) {
						// Get the properly formatted date
						$date = apply_filters( 'the_date', get_the_date( '', $post ), '', '', '' );
						$datetime = esc_attr( get_the_date( 'c', $post ) );
						$date_url = esc_url( get_day_link( get_the_time( 'Y', $post ), get_the_time( 'm', $post ), get_the_time( 'd', $post ) ) );
						$date_title = esc_attr( sprintf( __( 'Posted on %s', 'wpzoom-portfolio' ), $date ) );

						// Add the date to the output
						$output .= "<time datetime='$datetime' class='${class}_item-date'><a href='$date_url' title='$date_title'>$date</a></time>";
					}

					// Close the portfolio item meta wrapper div if needed
					if ( $args[ 'show_author' ] || $args[ 'show_date' ] ) {
						$output .= '</div>';
					}

					// If the excerpt should be shown...
					if ( $args[ 'show_excerpt' ] ) {
						// Get the excerpt
						$raw_cont = get_the_content( '', false, $post );
						$cont = str_replace( ']]>', ']]&gt;', apply_filters( 'the_content', excerpt_remove_blocks( strip_shortcodes( $raw_cont ) ) ) );
						$excerpt = force_balance_tags( html_entity_decode( wp_trim_words( htmlentities( $cont ), $args[ 'excerpt_length' ], null ) ) );

						// Add the excerpt to the output
						$output .= "<div class='${class}_item-content'>$excerpt</div>";
					}

					// If the Read More button should be shown...
					if ( $args[ 'show_read_more' ] ) {
						// Get the label for the button
						$readmore = $args[ 'read_more_label' ] ? $args[ 'read_more_label' ] : esc_html__( 'Read More', 'wpzoom-portfolio' );
						$readmore_title = esc_attr__( 'Continue reading this post...', 'wpzoom-portfolio' );

						// Add the button to the output
						$output .= "<div class='${class}_item-readmore-button'>
							<a href='$permalink' title='$readmore_title' class='wpz-portfolio-button__link'>$readmore</a>
						</div>";
					}
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
		}

		// Return the final HTML string
		return $output;
	}

	/**
	 * Retrieve an HTML list of categories.
	 *
	 * @access public
	 * @param  array  $only Only show category items for categories included in this array.
	 * @return string
	 * @since  1.0.0
	 * @see    get_categories()
	 */
	public function list_categories( $only = array(), $post_type = 'post' ) {
		// Setup the basic query arguments
		$args = array(
			'child_of'            => 0,
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
			'show_option_all'     => esc_html__( 'All', 'wpzoom-portfolio' ),
			'style'               => 'list',
			'use_desc_for_title'  => 1,
		);

		// If the passed $only argument is not empty...
		if ( ! empty( $only ) ) {
			// Include it in the arguments for the query
			$args[ 'include' ] = $only;
		}

		// If a portfolio taxonomy exists...
		if ( taxonomy_exists( 'portfolio' ) && 'portfolio_item' == $post_type  ) {
			// Add it to the query arguments
			$args[ 'taxonomy' ][] = 'portfolio';
		}

		// Attempt to get all the categories using the above parameters
		$categories = get_categories( $args );

		// The string that will be output
		$output = '';

		// As long as some categories were returned...
		if ( ! empty( $categories ) ) {
			// Add in the All link
			$posts_page = esc_url( str_ireplace( '%category%/', '', get_post_type_archive_link( 'portfolio_item' ) ) );
			$output .= '<li class="cat-item-all current-cat">
				<a href="' . $posts_page . '" class="wpz-portfolio-filter_link">' . esc_html__(  'All', 'wpzoom-portfolio' ) . '</a>
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

		// Return the final output
		return $output;
	}

	/**
	 * Returns an HTML embed code for a given video URL.
	 *
	 * @access public
	 * @param  string $url     The URL to a video to get the embed code for.
	 * @param  bool   $library Whether the URL points to a video in the local media library.
	 * @return string
	 * @since  1.0.0
	 * @see    wp_video_shortcode()
	 * @see    WP_oEmbed
	 * @see    _wp_oembed_get_object()
	 */
	public function get_video_embed_code( $url, $library = true, $autoplay = true, $loop = false ) {
		// The result that will be returned
		$result = '';

		// As long as the passed url is not empty...
		if ( ! empty( $url ) ) {
			// If the url should be treated as a media library url...
			if ( true === $library ) {
				// Get the embed code for the given url
				$embed = wp_video_shortcode( array( 'src' => $url, 'autoplay' => $autoplay, 'loop' => $loop ) );

				// As long as there is an embed code...
				if ( ! empty( $embed ) ) {
					// Filter the embed code and use it as the result
					$result = preg_replace( '/\<video([^>]+)controls="controls"\>/i', '<video$1muted="muted" disablePictureInPicture>', $embed );
				}
			}
			// Otherwise it is a url from an external service...
			else {
				// Try to get the video data for the given url
				$data = _wp_oembed_get_object()->get_data( $url );

				// As long as we got back valid data...
				if ( false !== $data && isset( $data->provider_name ) ) {
					// Determine the service the video is from and the html embed code
					$service = strtolower( trim( $data->provider_name ) );
					$html = isset( $data->html ) ? $data->html : '';

					// As long as there is an embed code...
					if ( ! empty( $html ) ) {
						// Setup some variables
						$autoplay = intval( $autoplay );
						$loop = intval( $loop );
						$args = '';

						// If the service is YouTube...
						if ( 'youtube' == $service ) {
							// Setup the proper arguments
							$args = "&controls=0&modestbranding=1&mute=1&autoplay=$autoplay&loop=$loop";
						}
						// If the service is Vimeo...
						elseif ( 'vimeo' == $service ) {
							// Setup the proper arguments
							$args = "&controls=0&background=1&muted=1&autoplay=$autoplay&loop=$loop";
						}

						// Filter the embed code to add extra needed arguments and use it as the result
						$result = preg_replace( '/\<iframe([^>]+)src="([^"]+)"/i', '<iframe$1src="$2' . $args . '"', $html );
					}
				}
			}
		}

		// Return the result
		return $result;
	}

	/**
	 * Adds extra needed routes in the WordPress REST API.
	 *
	 * @access public
	 * @return void
	 * @since  1.0.0
	 * @see    register_rest_route()
	 */
	public function rest_api_routes() {
		// Register the 'wpzoom-portfolio' REST API route
		register_rest_route(
			'wpzoom-blocks/v1',
			'/portfolio-posts',
			array(
				'methods' => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_rest_portfolio_posts' ),
				'permission_callback' => function() { return ''; }
			)
		);
	}

	/**
	 * Returns a REST response containing portfolio items' details for a given set of portfolio items.
	 *
	 * @access public
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return array
	 * @since  1.0.0
	 */
	public function get_rest_portfolio_posts( $request ) {
		// The results that will be returned in the REST response
		$result = array();

		// As long as it is a valid request...
		if ( ! is_null( $request ) && $request instanceof WP_REST_Request ) {
			// Get the request parameters
			$params = $request->get_params();

			// As long as the parameters are not empty...
			if ( ! empty( $params ) ) {
				// Parse the parameters into variables to use for building the HTML to return
				$layout = isset( $params[ 'layout' ] ) ? $params[ 'layout' ] : 'grid';
				$order = isset( $params[ 'order' ] ) ? $params[ 'order' ] : 'desc';
				$order_by = isset( $params[ 'order_by' ] ) ? $params[ 'order_by' ] : 'date';
				$per_page = isset( $params[ 'per_page' ] ) ? intval( $params[ 'per_page' ] ) : 6;
				$page = isset( $params[ 'page' ] ) ? intval( $params[ 'page' ] ) : 1;
				$categories = isset( $params[ 'cats' ] ) && !empty( $params[ 'cats' ] ) ? json_decode( $params[ 'cats' ] ) : array();
				$show_thumbnail = isset( $params[ 'show_thumbnail' ] ) ? boolval( $params[ 'show_thumbnail' ] ) : true;
				$thumbnail_size = isset( $params[ 'thumbnail_size' ] ) ? $params[ 'thumbnail_size' ] : 'portfolio_item-thumbnail';
				$show_background_video = isset( $params[ 'show_background_video' ] ) ? boolval( $params[ 'show_background_video' ] ) : true;
				$show_author = isset( $params[ 'show_author' ] ) ? boolval( $params[ 'show_author' ] ) : true;
				$show_date = isset( $params[ 'show_date' ] ) ? boolval( $params[ 'show_date' ] ) : true;
				$show_excerpt = isset( $params[ 'show_excerpt' ] ) ? boolval( $params[ 'show_excerpt' ] ) : true;
				$excerpt_length = isset( $params[ 'excerpt_length' ] ) ? intval( $params[ 'excerpt_length' ] ) : 20;
				$show_read_more = isset( $params[ 'show_read_more' ] ) ? boolval( $params[ 'show_read_more' ] ) : true;
				$source = isset( $params[ 'source' ] ) ? $params[ 'source' ] : 'portfolio_item';

				// Build the HTML to return
				$items = $this->items_html( array(
					'class'                 => 'wpzoom-blocks_portfolio-block',
					'layout'                => $layout,
					'order'                 => $order,
					'order_by'              => $order_by,
					'per_page'              => $per_page,
					'page'                  => $page,
					'categories'            => $categories,
					'show_thumbnail'        => $show_thumbnail,
					'thumbnail_size'        => $thumbnail_size,
					'show_background_video' => $show_background_video,
					'show_author'           => $show_author,
					'show_date'             => $show_date,
					'show_excerpt'          => $show_excerpt,
					'excerpt_length'        => $excerpt_length,
					'show_read_more'        => $show_read_more,
					'source'                => $source
				) );

				// Assign the results to return
				$result = array( 'items' => $items, 'has_more' => $page < $this->result_pages );
			}
		}

		// Return the portfolio items array properly formatted for a rest response
		return rest_ensure_response( $result );
	}

	/**
	 * Filters the HTML attributes applied to a category list item's anchor element.
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
		$atts[ 'class' ] = 'wpz-portfolio-filter__link';

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
		$css_classes[] = 'wpz-block-button';

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
		// If the post type is our portfolio type and the link includes the replacement string...
		if ( 'portfolio_item' == get_post_type( $post ) && false !== stripos( $post_link, '%category%' ) ) {
			// Get the categories for the given post
			$cats = get_the_terms( $post, 'portfolio' );

			// As long as there are some categories...
			if ( false !== $cats && !is_wp_error( $cats ) ) {
				// Return the link with the replacement string replaced with the first category
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
		// As long as the post status is Publish and the post type is our portfolio type...
		if ( 'publish' == $post->post_status && 'portfolio_item' == $post->post_type ) {
			// Get the categories for the given post
			$cats = get_the_terms( $post, 'portfolio' );

			// As long as there are no categories...
			if ( false === $cats || is_wp_error( $cats ) ) {
				// Set the category for the given post to Uncategorized
				wp_set_object_terms( $post_id, 'uncategorized', 'portfolio' );
			}
		}
	}
}