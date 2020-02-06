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
 * Class WPZOOM_Blocks_Posts
 *
 * Container class of the Posts block used in the WPZOOM Blocks WordPress plugin.
 *
 * @since 1.0.0
 */
class WPZOOM_Blocks_Posts {
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
			'default' => 5
		],
		'categories' => [
			'type' => 'string',
			'default' => ''
		],
		'excerptLength' => [
			'type' => 'number',
			'default' => 150
		],
		'order' => [
			'type' => 'string',
			'default' => 'desc'
		],
		'orderBy' => [
			'type' => 'string',
			'default' => 'date'
		],
		'showAuthor' => [
			'type' => 'boolean',
			'default' => true
		],
		'showCommentCount' => [
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
		'showReadMoreButton' => [
			'type' => 'boolean',
			'default' => true
		],
		'showThumbnail' => [
			'type' => 'boolean',
			'default' => true
		],
		'thumbnailSize' => [
			'type' => 'string',
			'default' => 'thumbnail'
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
		// Hook into the REST API in order to add some custom things
		add_action( 'rest_api_init', array( $this, 'rest_featured_media' ) );

		// Add some extra needed styles on the frontend
		add_action( 'wp_enqueue_scripts', function() { wp_enqueue_style( 'dashicons' ); } );
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
		$class = 'wpzoom-blocks_posts-block';

		// Might need to align the block
		$align = isset( $attr[ 'align' ] ) ? ' align' . $attr[ 'align' ] : '';

		// Fetch recent posts using the specified attributes
		$query = new WP_Query( array(
			'cat'            => $attr[ 'categories' ],
			'order'          => $attr[ 'order' ],
			'orderby'        => $attr[ 'orderBy' ],
			'posts_per_page' => $attr[ 'amount' ]
		) );

		// If the above query returned any results...
		if ( $query->have_posts() ) {
			// Go through every post in the results...
			foreach ( $query->posts as $post ) {
				// Declare several variables to be used for outputting the post in this iteration
				$id = $post->ID;
				$permalink = esc_url( get_permalink( $post ) );
				$title = get_the_title( $post );
				$title_attr = the_title_attribute( array( 'post' => $post, 'echo' => false ) );
				$thumbnail = get_the_post_thumbnail( $post, $attr[ 'thumbnailSize' ] );

				// Open the list item for this post
				$output .= '<li class="' . $class . '_post ' . $class . '_post-' . $id . '">';

				// Add a wrapper article around the entire post (including the thumbnail)
				$output .= '<article class="' . $class . '_post-wrap">';

				// If the thumbnail should be shown...
				if ( $attr[ 'showThumbnail' ] && ! empty( $thumbnail ) ) {
					// Add it to the output
					$output .= '<div class="' . $class . '_post-thumbnail">
						<a href="' . $permalink . '" title="' . $title_attr . '" rel="bookmark">' . $thumbnail . '</a>
					</div>';
				}

				// Add a wrapper div around just the post details (excluding the thumbnail)
				$output .= '<div class="' . $class . '_post-details">';

				// Add the post title to the output
				$output .= '<h3 class="' . $class . '_post-title">
					<a href="' . $permalink . '" title="' . $title_attr . '" rel="bookmark">' . $title . '</a>
				</h3>';

				// Add a wrapper div around just the post meta if needed
				if ( $attr[ 'showAuthor' ] || $attr[ 'showDate' ] || $attr[ 'showCommentCount' ] ) {
					$output .= '<div class="' . $class . '_post-meta">';
				}

				// If the author should be shown...
				if ( $attr[ 'showAuthor' ] ) {
					// Get the author details
					$author_name = get_the_author_meta( 'display_name', $post->post_author );
					$author_url = esc_url( get_author_posts_url( $post->post_author ) );
					$author_title = esc_attr( sprintf( __( 'Posts by %s' ), $author_name ) );

					// Add the author to the output
					$output .= '<cite class="' . $class . '_post-author">
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
					$output .= '<time datetime="' . $datetime . '" class="' . $class . '_post-date">
						<a href="' . $date_url . '" title="' . $date_title . '">' . $date . '</a>
					</time>';
				}

				// If the comment count should be shown...
				if ( $attr[ 'showCommentCount' ] ) {
					// Get the comment count details
					$number = get_comments_number( $post );
					$zero = __( 'No Comments', 'wpzoom-blocks' );
					$one = __( '1 Comment', 'wpzoom-blocks' );
					$more = sprintf( _n( '%s Comment', '%s Comments', $number, 'wpzoom-blocks' ), number_format_i18n( $number ) );
					$comments = 0 == $number ? $zero : ( 1 == $number ? $one : $more );
					$comments_url = esc_url( get_comments_link( $post ) );
					$comments_title = esc_attr( sprintf( __( '%s on this post', 'wpzoom-blocks' ), $comments ) );

					// Add the comment count to the output
					$output .= '<span class="' . $class . '_post-comment-count">
						<a href="' . $comments_url . '" title="' . $comments_title . '">' . $comments . '</a>
					</span>';
				}

				// Close the post meta wrapper div if needed
				if ( $attr[ 'showAuthor' ] || $attr[ 'showDate' ] || $attr[ 'showCommentCount' ] ) {
					$output .= '</div>';
				}

				// If the excerpt should be shown...
				if ( $attr[ 'showExcerpt' ] ) {
					// Get the excerpt
					$raw_cont = get_the_content( '', false, $post );
					$cont = str_replace( ']]>', ']]&gt;', apply_filters( 'the_content', excerpt_remove_blocks( strip_shortcodes( $raw_cont ) ) ) );
					$excerpt = force_balance_tags( html_entity_decode( wp_trim_words( htmlentities( $cont ), $attr[ 'excerptLength' ], null ) ) );

					// Add the excerpt to the output
					$output .= '<div class="' . $class . '_post-content">' . $excerpt . '</div>';
				}

				// If the Read More button should be shown...
				if ( $attr[ 'showReadMoreButton' ] ) {
					// Get the label for the button
					$readmore = __( 'Read More', 'wpzoom-blocks' );
					$readmore_title = esc_attr( __( 'Continue reading this post...', 'wpzoom-blocks' ) );

					// Add the button to the output
					$output .= '<div class="' . $class . '_post-readmore-button wp-block-button">
						<a href="' . $permalink . '" title="' . $readmore_title . '" class="wp-block-button__link">' . $readmore . '</a>
					</div>';
				}

				// Close the post details wrapper div
				$output .= '</div>';

				// Close the post wrapper article
				$output .= '</article>';

				// Close the list item for this post
				$output .= '</li>';
			}

			// Reset the WordPress post data so this block doesn't mess up the main query
			wp_reset_postdata();
		} else {
			// The query had no posts so return a 'no posts' message
			$output .= '<li class="' . $class . '_no-posts">' . __( 'No posts.', 'wpzoom-blocks' ) . '</li>';
		}

		// Return the final output
		return "<div class=\"wpzoom-blocks $class$align\"><ul class=\"{$class}_posts-list\">$output</ul></div><!--.$class-->";
	}

	/**
	 * Adds extra needed data in the REST API related to media library images.
	 *
	 * @access public
	 * @return void
	 * @since  1.0.0
	 * @see    register_rest_route()
	 * @see    register_rest_field()
	 * @see    WPZOOM_Blocks_Posts::get_rest_image_sizes()
	 * @see    WPZOOM_Blocks_Posts::get_featured_media_urls()
	 */
	public function rest_featured_media() {
		// Register the 'image-sizes' REST API route
		register_rest_route(
			'wpzoom-blocks/v1',
			'/image-sizes',
			array(
				'methods' => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_rest_image_sizes' ),
				'permission_callback' => function() { return current_user_can( 'edit_posts' ); }
			)
		);

		// Register the 'featured_media_urls' REST API field on all post types
		register_rest_field(
			get_post_types(),
			'featured_media_urls',
			array(
				'get_callback' => array( $this, 'get_featured_media_urls' ),
				'update_callback' => null,
				'schema' => array(
					'description' => __( 'Different sized featured images', 'wpzoom-blocks' ),
					'type' => 'array'
				)
			)
		);
	}

	/**
	 * Returns a REST response containing all available media library image sizes.
	 *
	 * @access public
	 * @return array
	 * @since  1.0.0
	 * @see    get_intermediate_image_sizes()
	 */
	public function get_rest_image_sizes() {
		// Call the built-in get_intermediate_image_sizes() WordPress function to get an array of sizes
		$raw_sizes = get_intermediate_image_sizes();

		// Build an array with sizes and their labels
		$sizes = array();
		foreach ( $raw_sizes as $raw_size ) {
			$sizes[] = array( 'label' => ucwords( preg_replace( '/[_-]/', ' ', $raw_size ) ), 'value' => $raw_size );
		}

		// Return the sizes array properly formatted for a rest response
		return rest_ensure_response( $sizes );
	}

	/**
	 * Returns an array of all the available image size URLs for the featured media from the given post object.
	 *
	 * @access public
	 * @param  WP_Post|Object $object The object that is the context to get the featured media ID from.
	 * @return array
	 * @since  1.0.0
	 * @see    get_intermediate_image_sizes()
	 * @see    wp_get_attachment_image_src()
	 */
	function get_featured_media_urls( $object ) {
		// Initialize the array that will be returned
		$featured_media_urls = array();

		// If the given object has attached featured media...
		if ( isset( $object[ 'featured_media' ] ) ) {
			// Keep track of the featured media ID
			$featured_media_id = $object[ 'featured_media' ];

			// Call wp_get_attachment_image_src() with the default options for the best chance to get a fallback
			$thumb = wp_get_attachment_image_src( $featured_media_id );

			// If the size above was found...
			if ( is_array( $thumb ) ) {
				// Set it so it will be present as a fallback if no other sizes can be found
				$featured_media_urls[ 'thumbnail' ] = $thumb;
			}

			// Go through every available image size...
			foreach ( get_intermediate_image_sizes() as $size ) {
				// Get the featured media source attached to the given object in the size from the current iteration
				$src = wp_get_attachment_image_src( $featured_media_id, $size, false );

				// If the size was found...
				if ( is_array( $src ) ) {
					// Add it to the array of size URLs
					$featured_media_urls[ $size ] = $src;
				}
			}

		}

		// Return the array
		return $featured_media_urls;
	}
}