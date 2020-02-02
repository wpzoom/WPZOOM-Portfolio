import apiFetch from '@wordpress/api-fetch';
import { InspectorControls } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { PanelBody, QueryControls, RangeControl, SelectControl, ToggleControl, Spinner, Placeholder } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { dateI18n, format, __experimentalGetSettings } from '@wordpress/date';
import { Component, RawHTML } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

registerBlockType( 'wpzoom-blocks/posts', {
	title: __( 'Posts', 'wpzoom-blocks' ),
	description: __( 'Display a customizable list of posts.', 'wpzoom-blocks' ),
	icon: 'list-view',
	category: 'wpzoom-blocks',
	supports: { html: false },
	example: {},
	edit: withSelect( ( select, props ) => {
		const { getEntityRecords } = select( 'core' );
		const { attributes } = props;
		const { categories, amount, order, orderBy, thumbnailSize } = attributes;

		return {
			posts: getEntityRecords( 'postType', 'post', { categories: categories, orderby: orderBy, order: order, per_page: amount, status: 'publish' } ),
			categoriesList: getEntityRecords( 'taxonomy', 'category', { per_page: -1, hide_empty: false } )
		};
	} )( class extends Component {
		constructor() {
			super( ...arguments );

			this.state = {
				imageSizes: []
			};
		}

		componentDidMount() {
			this.isStillMounted = true;

			this.fetchRequest = apiFetch( { path: '/wpzoom-blocks/v1/image-sizes' } );

			this.fetchRequest.then(
				( imageSizes ) => {
					if ( this.isStillMounted ) {
						this.setState( { imageSizes } );
					}
				}
			);

			this.fetchRequest.catch(
				() => {
					if ( this.isStillMounted ) {
						this.setState( { imageSizes: [] } );
					}
				}
			);
		}

		componentWillUnmount() {
			this.isStillMounted = false;
		}

		render() {
			const { attributes, setAttributes, posts, categoriesList, name, className } = this.props;
			const { categories, amount, order, orderBy, showThumbnail, thumbnailSize, showDate, showExcerpt, excerptLength, showReadMoreButton } = attributes;
			const { imageSizes } = this.state;
			const clazz = name.replace( /[\/]/i, '_' ) + '-block';
			const dateFormat = __experimentalGetSettings().formats.date;

			if ( ! posts || ! categoriesList || ! imageSizes ) {
				return (
					<>
						<Placeholder icon="list-view" label={ __( 'WPZOOM Blocks - Posts', 'wpzoom-blocks' ) }>
							<Spinner /> { __( 'Loading posts...', 'wpzoom-blocks' ) }
						</Placeholder>
					</>
				);
			}

			if ( posts && posts.length === 0 ) {
				return (
					<>
						<Placeholder icon="list-view" label={ __( 'WPZOOM Blocks - Posts', 'wpzoom-blocks' ) }>
							{ __( 'No posts found.', 'wpzoom-blocks' ) }
						</Placeholder>
					</>
				);
			}

			return (
				<>
					<InspectorControls>
						<PanelBody title={ __( 'Options', 'wpzoom-blocks' ) }>
							<QueryControls
								{ ...{ order, orderBy } }
								numberOfItems={ amount }
								categoriesList={ categoriesList }
								selectedCategoryId={ categories }
								onOrderChange={ ( value ) => setAttributes( { order: value } ) }
								onOrderByChange={ ( value ) => setAttributes( { orderBy: value } ) }
								onCategoryChange={ ( value ) => setAttributes( { categories: '' !== value ? value : undefined } ) }
								onNumberOfItemsChange={ ( value ) => setAttributes( { amount: value } ) }
							/>

							<ToggleControl
								label={ __( 'Show Post Thumbnail', 'wpzoom-blocks' ) }
								checked={ showThumbnail }
								onChange={ ( value ) => setAttributes( { showThumbnail: value } ) }
							/>

							{ showThumbnail &&
								<SelectControl
									label={ __( 'Post Thumbnail Size', 'wpzoom-blocks' ) }
									value={ thumbnailSize }
									options={ imageSizes }
									onChange={ ( value ) => setAttributes( { thumbnailSize: value } ) }
								/>
							}

							<ToggleControl
								label={ __( 'Show Post Date', 'wpzoom-blocks' ) }
								checked={ showDate }
								onChange={ ( value ) => setAttributes( { showDate: value } ) }
							/>

							<ToggleControl
								label={ __( 'Show Post Excerpt', 'wpzoom-blocks' ) }
								checked={ showExcerpt }
								onChange={ ( value ) => setAttributes( { showExcerpt: value } ) }
							/>

							{ showExcerpt &&
								<RangeControl
									label={ __( 'Excerpt Length', 'wpzoom-blocks' ) }
									value={ excerptLength }
									onChange={ ( value ) => setAttributes( { excerptLength: value } ) }
									min={ 1 }
									max={ 1000 }
								/>
							}

							<ToggleControl
								label={ __( 'Show Read More Button', 'wpzoom-blocks' ) }
								checked={ showReadMoreButton }
								onChange={ ( value ) => setAttributes( { showReadMoreButton: value } ) }
							/>
						</PanelBody>
					</InspectorControls>

					<div className={ `wpzoom-blocks ${clazz}` }>
						<ul className={ `${clazz}_posts-list` }>
							{ posts.map( ( post, i ) => {
								const titleTrimmed = 'title' in post && typeof post.title === 'object' && 'rendered' in post.title
								                     ? post.title.rendered.trim()
								                     : __( '(no title)', 'wpzoom-blocks' );
								let image = false;

								if ( showThumbnail && post.featured_media_urls && typeof post.featured_media_urls === 'object' ) {
									if ( thumbnailSize in post.featured_media_urls ) {
										image = post.featured_media_urls[ thumbnailSize ];
									} else if ( 'thumbnail' in post.featured_media_urls ) {
										image = post.featured_media_urls.thumbnail;
									} else {
										let first = post.featured_media_urls[ Object.keys( post.featured_media_urls )[0] ];

										if ( first ) {
											image = first;
										}
									}
								}

								return ( <li key={ post.id } className={ `${clazz}_post ${clazz}_post-${post.id}` }>
									<div className={ `${clazz}_post-wrap` }>
										{ showThumbnail && image && Array.isArray( image ) && image.length > 0 &&
											<div className={ `${clazz}_post-thumbnail` }>
												<a href={ post.link } title={ titleTrimmed }>
													<img src={ image[0] } width={ image[1] } height={ image[2] } alt={ titleTrimmed } />
												</a>
											</div>
										}

										<div className={ `${clazz}_post-details` }>
											<h3 className={ `${clazz}_post-title` }>
												<a href={ post.link } title={ titleTrimmed }>
													{ titleTrimmed ? ( <RawHTML>{ titleTrimmed }</RawHTML> ) : __( '(no title)', 'wpzoom-blocks' ) }
												</a>
											</h3>

											{ showDate && post.date_gmt &&
												<time dateTime={ format( 'c', post.date_gmt ) } className={ `${clazz}_post-date` }>
													{ dateI18n( dateFormat, post.date_gmt ) }
												</time>
											}

											{ showExcerpt && 'content' in post && typeof post.content === 'object' && 'rendered' in post.content &&
												<div className={ `${clazz}_post-content` }>
													<RawHTML key="html">
														{ post.content.rendered.trim().split( ' ', excerptLength ).join( ' ' ) }
													</RawHTML>
												</div>
											}

											{ showReadMoreButton &&
												<div className={ `${clazz}_post-readmore-button wp-block-button` }>
													<a href={ post.link } title={ __( 'Continue reading this post...', 'wpzoom-blocks' ) } className={ `wp-block-button__link` }>
														{ __( 'Read More', 'wpzoom-blocks' ) }
													</a>
												</div>
											}
										</div>
									</div>
								</li> );
							} ) }
						</ul>
					</div>
				</>
			);
		}
	} )
} );