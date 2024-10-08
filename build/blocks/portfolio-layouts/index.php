<?php
/**
 * WPZOOM Portfolio Layouts - Custom Gutenberg blocks designed by WPZOOM.
 *
 * @package   WPZOOM_Blocks
 * @author    WPZOOM
 * @copyright 2020 WPZOOM
 * @license   GPL-2.0-or-later
 */

// Exit if accessed directly
defined( 'ABSPATH' ) || exit;

/**
 * Class WPZOOM_Blocks_Portfolio_Layouts
 *
 * Container class of the Portfolio block used in the WPZOOM Blocks WordPress plugin.
 *
 * @since 1.0.0
 */
class WPZOOM_Blocks_Portfolio_Layouts {


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
		'layoutId' => [
			'type'    => 'string',
			'default' => '-1'
		],
	];

	/**
	 * Basic class initialization.
	 *
	 * @access public
	 * @return void
	 * @since  1.0.0
	 */
	public function __construct() {}

	/**
	 * Renders the block contents on the frontend.
	 *
	 * @access public
	 * @param  array  $attr    Array containing the block attributes.
	 * @param  string $content String containing the block content.
	 * @return string
	 * @since  1.0.0
	 */
	public function render( $attributes, $content ) {

		$layout_id = isset( $attributes['layoutId'] ) ? $attributes['layoutId'] : null;
		$align = isset( $attributes['align'] ) ? ' align' . $attributes['align'] : '';
		
		$blocks = array();

		if( ! $layout_id ) {
			return '';	
		}

		$layout = get_post( intval( $layout_id ) );

		if( ! $layout ) {
			return '';
		}
		if ( has_blocks( $layout->post_content ) ) {
			$blocks = parse_blocks( $layout->post_content );
		}
		
		$output = '';

		foreach( $blocks as $block ) {
			$output .= render_block( $block );
		}

		return sprintf( 
			'<div class="wpzoom-portfolio-layout%3$s" id="wpzoom-portfolio-layout-%2$d">%1$s</div>',
			$output,
			intval( $layout_id ),
			esc_attr( $align )
		);

	}

}