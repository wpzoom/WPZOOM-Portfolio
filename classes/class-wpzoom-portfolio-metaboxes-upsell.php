<?php
/**
 * Video Metabox settings class.
 *
 * @package Wpzoom_Portfolio
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

/**
 * Extends the functionality of the base plugin to add new features.
 *
 * @since 1.0.0
 */

 class WPZOOM_Portfolio_Metaboxes_Upsell {

	/**
	 * The Constructor.
	 */
	public function __construct() {

		add_action( 'add_meta_boxes', array( $this, 'add_meta_box' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );

	}

	public function enqueue_admin_scripts() {

		$current_screen = get_current_screen();
		if( $current_screen->id !== 'portfolio_item' ) {
			return;
		}

        wp_enqueue_style(
            'wpzoom-video-embed',
            WPZOOM_PORTFOLIO_URL . 'assets/admin/css/admin-video.css',
            array(),
            WPZOOM_PORTFOLIO_VERSION
        );

	}

	public function add_meta_box( $post_type ) {

		global $wp_meta_boxes;

		if ( ! isset( $wp_meta_boxes['portfolio_item']['normal']['high']['wpzoom_portfolio_video_settings'] ) ) {
			add_meta_box(
				'wpzoom_portfolio_video_settings',
				'Video Settings [PRO only] <span>PRO</span>',
				array( $this, 'video_settings' ),
				'portfolio_item',
				'normal',
				'high'
			);
		}

	}


	public function video_settings( $post ) {

		$this->get_tabs_inline_style();	

		?>
		<div class="portfolio-tabs">
			<ul class="metabox-tabs">
				<li data-tab-order="0" class="tab ui-tabs-tab ui-corner-top ui-state-default ui-tab ui-tabs-active ui-state-active">
					<a class="active" href="#portfolio-popup"><?php _e( 'Video Lightbox', 'wpzoom-portfolio'); ?></a>
				</li>
				<li data-tab-order="1" class="tab">
					<a href="#portfolio-background"><?php _e( 'Video Background on Hover', 'wpzoom-portfolio'); ?></a>
				</li>
			</ul>

			<div class="zoom-tab" id="portfolio-popup">

				<div class="radio-switcher">

					<p class="description">Using this option you can display a video in a lightbox which can be opened clicking on the <strong>Play</strong> button in galleries.</p>

					<h3><?php _e('Select Video Source:', 'wpzoom-portfolio'); ?></h3>

					<input type="radio" name="wpzoom_portfolio_popup_video_type" id="video_6" value="self_hosted">
					<label for="video_6" class="label_vid_self"><?php _e( 'Self-Hosted Video', 'wpzoom-portfolio' ) ?></label>

					&nbsp;&nbsp;&nbsp;<input type="radio" id="video_7" name="wpzoom_portfolio_popup_video_type" value="external_hosted" checked>
					<label class="label_vid_url" for="video_7"><strong class="wpz_video_embed_icons"><span class="wpzoom-youtube-play-icon"></span><?php _e( 'YouTube', 'wpzoom-portfolio' ) ?> <span class="wpz_embed_sep">/</span> <span class="wpzoom-vimeo-icon"></span><?php _e( 'Vimeo', 'wpzoom-portfolio' ) ?></strong></label>

				</div>

				<div class="wpzoom_external_hosted switch-wrapper" style="display: inline-block; width: 100%;">
					<p>
						<label for="wpzoom_portfolio_video_popup_url"><strong><?php _e( 'Insert Video URL', 'wpzoom-portfolio' ); ?></strong>
							<em><?php _e( '(YouTube and Vimeo only)', 'wpzoom-portfolio' ); ?></em>
						</label>

						<span class="preview-video-input-span">
							<input type="text" id="wpzoom_portfolio_video_popup_url" class="preview-video-input widefat" name="wpzoom_portfolio_video_popup_url" data-response-type="thumb" value="https://vimeo.com/211672238"/>
						</span>
					</p>
					<div class="wpzoom_video_external_preview">
						<?php if( has_post_thumbnail() ) { ?>
						<div style="float: left;">
							<img style="float: left;" src="<?php echo get_the_post_thumbnail_url(); ?>" width="400">
							<small style="float: left; clear: both; margin-top: 10px;" class="button button-disabled">This is the Featured Image</small>
						</div>
						<?php } ?>
					</div>
				</div>

			</div>
		</div>
		<div class="wpzoom-overlay-metabox-upsell">
			<a href="https://www.wpzoom.com/plugins/portfolio-grid/" target="_blank">Buy Portfolio PRO</a>
		</div>
	<?php
	}

	/**
	 * Inline styles for tabs that a rendered in metaboxes.
	 */
	public function get_tabs_inline_style(){
		?>
		<style type="text/css">

            .wpz_list {
                font-size: 12px;
            }

            .wpz_border {
                border-bottom: 1px solid #EEEEEE;
                padding: 0 0 10px;
            }

			ul.metabox-tabs {
				margin-bottom: 25px;
				padding: 0;
                display: flex;
                border-bottom: 1px solid #e1e1e1;
                justify-content: flex-start;
			}
			ul.metabox-tabs li {
				list-style: none;
                padding: 15px;
                margin: 0 10px 0 0;
			}
			ul.metabox-tabs li.tab a {
 				outline: none;
                font-weight: 600;
				text-decoration: none;
 			}

            ul.metabox-tabs li a:hover {
                color: var(--wp-admin-theme-color);
            }

			ul.metabox-tabs li.ui-tabs-active  {
                border-bottom: 1px solid var(--wp-admin-theme-color);
                box-shadow: inset 0 0 0 var(--wp-admin-border-width-focus) transparent,inset 0 -1.5px 0 0 var(--wp-admin-theme-color)
			}

			ul.metabox-tabs li.link {
				margin-left: 4px;
			}
			ul.metabox-tabs li.link a {
				text-decoration: none;
			}
			ul.metabox-tabs li.link a:hover {
				text-decoration: underline;
			}
			ul.metabox-tabs {
			}
			ul.metabox-tabs li a {
				color: #454545;
			}

			.zoom-tab {
				padding: 10px 0 15px;
			}
			.zoom-tab .dnt{
				display: none;
			}
			.preview-video-input-span {
				position: relative;
			}
			.preview-video-input-span img.wpzoom-preloader {
				position: absolute;
				right: 6px;
				top: 0;
			}
			.wpz_video_embed_icons i {
				font-size: 20px;
				margin: 0 5px 0 0;
				vertical-align: middle;
			}
			.wpz_video_embed_icons .fa-youtube-play {
				color: #cc181e;
			}
			.wpz_video_embed_icons .fa-vimeo {
				color: #1ab7ea;
			}
			.wpz_embed_sep {
				color: #ccc;
				font-weight: normal;
				margin: 0 5px;
			}
		</style>
		<?php
	}
 }
 
new WPZOOM_Portfolio_Metaboxes_Upsell;