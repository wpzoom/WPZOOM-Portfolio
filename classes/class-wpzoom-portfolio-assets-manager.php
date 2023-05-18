<?php
/**
 * WPZOOM Portfolio Assets Manager
 *
 * @since   1.0.5
 * @package WPZOOM_Portfolio
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WPZOOM_Portfolio_Assets_Manager' ) ) {

	/**
	 * Main WPZOOM_Portfolio_Assets_Manager Class.
	 *
	 * @since 1.0.5
	 */
	class WPZOOM_Portfolio_Assets_Manager {

		/**
		 * This class instance.
		 *
		 * @var WPZOOM_Portfolio_Template
		 * @since 1.0.5
		 */
		private static $instance;

		/**
		 * Provides singleton instance.
		 *
		 * @since 1.0.5
		 * @return self instance
		 */
		public static function instance() {			

			if ( null === self::$instance ) {
				self::$instance = new WPZOOM_Portfolio_Assets_Manager();
			}

			return self::$instance;
		}

		/**
		 * The Constructor.
		 */
		public function __construct() {

			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_styles' ) );
			add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_frontend_styles' ) );

		}

		public function enqueue_frontend_styles() {
		
			wp_enqueue_style( 
				'magnificPopup', 
				WPZOOM_PORTFOLIO_URL . 'assets/css/magnific-popup.css', 
				array(), 
				WPZOOM_PORTFOLIO_VERSION
			);

			wp_enqueue_script( 
				'magnificPopup', 
				WPZOOM_PORTFOLIO_URL . 'assets/js/jquery.magnific-popup.min.js', 
				array( 'jquery' ), 
				WPZOOM_PORTFOLIO_VERSION,
				true 
			);

			wp_enqueue_script( 
				'wpzoom-portfolio-block',
				WPZOOM_PORTFOLIO_URL . 'assets/js/wpzoom-portfolio.js',
				array( 'jquery', 'wp-util' ), 
				WPZOOM_PORTFOLIO_VERSION,
				true 
			);

			wp_localize_script( 
				'wpzoom-portfolio-block',
				'WPZoomPortfolioBlock', 
				array(
					'ajaxURL'       => admin_url( 'admin-ajax.php' ),
					'loadingString' => esc_html__( 'Loading...', 'wpzoom-portfolio' )
				) 
			);

		}


	}

}

WPZOOM_Portfolio_Assets_Manager::instance();