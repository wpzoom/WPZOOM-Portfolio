<?php
/**
 * WPZOOM Blocks - Custom Gutenberg blocks designed by WPZOOM.
 *
 * @package WPZOOM_Blocks
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
	 * @var array
	 * @access public
	 * @since 1.0.0
	 */
	public const ATTRIBUTES = [
		'categories' => [
			'type' => 'string',
			'default' => ''
		],
		'amount' => [
			'type' => 'number',
			'default' => 5
		],
		'order' => [
			'type' => 'string',
			'default' => 'desc'
		],
		'orderBy' => [
			'type' => 'string',
			'default' => 'date'
		],
		'showThumbnail' => [
			'type' => 'boolean',
			'default' => true
		],
		'thumbnailSize' => [
			'type' => 'string',
			'default' => 'thumbnail'
		],
		'showDate' => [
			'type' => 'boolean',
			'default' => true
		],
		'showExcerpt' => [
			'type' => 'boolean',
			'default' => true
		],
		'excerptLength' => [
			'type' => 'number',
			'default' => 150
		],
		'showReadMoreButton' => [
			'type' => 'boolean',
			'default' => true
		]
	];

	/**
	 * Renders the block contents on the frontend.
	 *
	 * @access public
	 * @static
	 * @param array  $attr    Array containing the block attributes.
	 * @param string $content String containing the block content.
	 * @return string
	 * @since 1.0.0
	 */
	public static function render( $attr, $content ) {
		$recent_posts = wp_get_recent_posts( array(
			'numberposts' => -1,
			'post_status' => 'publish'
		) );

		if ( 0 === count( $recent_posts ) ) {
			return 'No posts';
		}

		$output = '<ul>';

		foreach ( $recent_posts as $post ) {
			$output .= '<li><a href="' . get_permalink( $post[ 'ID' ] ) . '">' . $post[ 'post_title' ] . '</a></li>';
		}

		wp_reset_query();

		$output .= '</ul>';

		return $output;
	}
}