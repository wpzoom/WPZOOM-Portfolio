<?php
/**
 * Plugin Name: WPZOOM Blocks
 * Plugin URI: https://wpzoom.com/plugins/gutenberg-blocks/
 * Description: Custom Gutenberg blocks designed by WPZOOM.
 * Author: WPZOOM
 * Author URI: https://wpzoom.com
 * Version: 1.0.0
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package WPZOOM_Blocks
 */

// Exit if accessed directly
defined( 'ABSPATH' ) || exit;

// Hook the plugin into WordPress
add_action( 'init', function() { (new WPZOOM_Blocks())->init(); } );

/**
 * Class WPZOOM_Blocks
 * 
 * Main container class of the WPZOOM Blocks WordPress plugin.
 * 
 * @since 1.0.0
 */
class WPZOOM_Blocks {
	/**
	 * The path to this plugin's root directory.
	 * 
	 * @since 1.0.0
	 */
	public $plugin_dir_path;

	/**
	 * The URL to this plugin's root directory.
	 * 
	 * @since 1.0.0
	 */
	public $plugin_dir_url;

	/**
	 * The path to this plugin's "main" directory.
	 * 
	 * @since 1.0.0
	 */
	public $main_dir_path;

	/**
	 * The URL to this plugin's "main" directory.
	 * 
	 * @since 1.0.0
	 */
	public $main_dir_url;

	/**
	 * The path to this plugin's "blocks" directory.
	 * 
	 * @since 1.0.0
	 */
	public $blocks_dir_path;

	/**
	 * The URL to this plugin's "blocks" directory.
	 * 
	 * @since 1.0.0
	 */
	public $blocks_dir_url;

	/**
	 * Basic class initialization.
	 * 
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function __construct() {
		// Assign the values for the plugin dir/url
		$this->plugin_dir_path = plugin_dir_path( __FILE__ );
		$this->plugin_dir_url = plugin_dir_url( __FILE__ );

		// Assign the values for the main dir/url
		$this->main_dir_path = trailingslashit( $this->plugin_dir_path . 'build' );
		$this->main_dir_url = trailingslashit( $this->plugin_dir_url . 'build' );

		// Assign the values for the blocks dir/url
		$this->blocks_dir_path = trailingslashit( $this->main_dir_path . 'blocks' );
		$this->blocks_dir_url = trailingslashit( $this->main_dir_url . 'blocks' );
	}

	/**
	 * Initializes the plugin and sets up needed hooks and features.
	 * 
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function init() {
		// Load the correct translation files for the plugin
		load_plugin_textdomain( 'wpzoom-blocks', false, basename( __DIR__ ) . '/languages' );

		// Filter the Gutenberg block categories to add the custom plugin one
		add_filter( 'block_categories', array( $this, 'filter_block_categories' ), 10, 2 );

		// Load in all needed assets for the plugin
		$this->load_assets();

		// Enqueue the main scripts and styles in the Gutenberg editor
		add_action( 'enqueue_block_editor_assets', function() { wp_enqueue_script( 'wpzoom-blocks-js-index-main' ); wp_enqueue_style( 'wpzoom-blocks-css-editor-main' ); } );
		add_action( 'enqueue_block_assets', function() { wp_enqueue_script( 'wpzoom-blocks-js-script-main' ); wp_enqueue_style( 'wpzoom-blocks-css-style-main' ); } );
	}

	/**
	 * Loads in all the needed assets for the plugin.
	 * 
	 * @since 1.0.0
	 *
	 * @return void
	 */
	//public function enqueue_block_editor_assets() {
	public function load_assets() {
		// Set a fallback for files with no version/dependency info
		$no_asset = array( 'dependencies' => array( 'wp-blocks', 'wp-data', 'wp-element', 'wp-i18n', 'wp-polyfill' ), 'version' => '-1' );

		// Go through the main directory and each sub-directory in the blocks directory...
		foreach ( array_merge( array( $this->main_dir_path ), glob( $this->blocks_dir_path . '*', GLOB_ONLYDIR | GLOB_NOSORT ) ) as $path ) {
			// Get the slug for the directory in the current iteration
			$slug = 0 === substr_compare( $path, 'build/', -strlen( 'build/' ) ) ? 'main' : str_replace( $this->blocks_dir_path, '', $path );

			// Consistent slashing
			$path = trailingslashit( $path );

			// Go through every possible script/style there could be in the directory from the current iteration...
			foreach ( array( 'index' => 'js', 'script' => 'js', 'editor' => 'css', 'style' => 'css' ) as $name => $ext ) {
				// If a script/style with the given name exists in the directory from the current iteration...
				if ( file_exists( "$path$name.$ext" ) ) {
					// Get the version/dependency info
					$asset_file = "$path$name.asset.php";
					$asset = file_exists( $asset_file ) ? include( $asset_file ) : $no_asset;

					// Register the script/style so it can be enqueued later
					$func = 'js' == $ext ? 'wp_register_script' : 'wp_register_style';
					$url = trailingslashit( 'main' == $slug ? $this->main_dir_url : $this->blocks_dir_url . $slug ) . "$name.$ext";
					$func( "wpzoom-blocks-$ext-$name-$slug", $url, $asset[ 'dependencies' ], $asset[ 'version' ] );

					// If the file in the current iteration is a script...
					if ( 'js' == $ext && function_exists( 'wp_set_script_translations' ) ) {
						// Setup the translations for it
						wp_set_script_translations( "wpzoom-blocks-js-$name-$slug", 'wpzoom-blocks', plugin_dir_path( __FILE__ ) . 'languages' );
					}
				}
			}

			// If the file in the current iteration is in a block...
			if ( 'main' != $slug ) {
				// Register the block with Gutenberg
				register_block_type( "wpzoom-blocks/$slug", array(
					'editor_script' => "wpzoom-blocks-js-index-$slug",
					'editor_style' => "wpzoom-blocks-css-editor-$slug",
					'script' => "wpzoom-blocks-js-script-$slug",
					'style' => "wpzoom-blocks-css-style-$slug"
				) );
			}
		}
	}

	/**
	 * Adds the WPZOOM category to the Gutenberg block categories, if not already present.
	 * 
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function filter_block_categories( $categories, $post ) {
		// Get a list of all the block category slugs
		$category_slugs = wp_list_pluck( $categories, 'slug' );

		// Return the list of categories with our custom category included
		return in_array( 'wpzoom', $category_slugs, true ) ? $categories : array_merge(
			$categories,
			array(
				array(
					'slug' => 'wpzoom',
					'title' => __( 'WPZOOM', 'wpzoom-blocks' ),
					'icon' => 'wordpress'
				)
			)
		);
	}
}