import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { withSelect, useSelect } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';
import { PanelBody, QueryControls, RangeControl, SelectControl, ToggleControl, Spinner, Placeholder } from '@wordpress/components';
import { dateI18n, format, __experimentalGetSettings } from '@wordpress/date';

registerBlockType( 'wpzoom-blocks/posts', {
	title: __( 'Posts' ),
	description: __( 'Display a list of posts, optionally filtered/sorted by category or other requisites.' ),
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
	} )( ( props ) => {
		const { attributes, setAttributes, posts, categoriesList, className } = props;
		const { categories, amount, order, orderBy, showThumbnail, thumbnailSize, showDate, showExcerpt, excerptLength, showReadMoreButton } = attributes;
		const clazz = props.name.replace( /[\/]/i, '_' ) + '-block';
		const dateFormat = __experimentalGetSettings().formats.date;

		if ( ! posts ) {
			return (
				<>
					<Placeholder icon="list-view" label={ __( 'WPZOOM Blocks - Posts' ) }>
						<Spinner /> { __( 'Loading posts...' ) }
					</Placeholder>
				</>
			);
		}

		if ( posts && posts.length === 0 ) {
			return (
				<>
					<Placeholder icon="list-view" label={ __( 'WPZOOM Blocks - Posts' ) }>
						{ __( 'No posts found.' ) }
					</Placeholder>
				</>
			);
		}

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Options' ) }>
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
							label={ __( 'Show Post Thumbnail' ) }
							checked={ showThumbnail }
							onChange={ ( value ) => setAttributes( { showThumbnail: value } ) }
						/>

						{ showThumbnail &&
							<SelectControl
								label={ __( 'Post Thumbnail Size' ) }
								value={ thumbnailSize }
								options={ [
									{ label: __( 'Full' ), value: 'full' },
									{ label: __( 'Medium' ), value: 'medium' },
									{ label: __( 'Thumbnail' ), value: 'thumbnail' }
// TODO: GET ALL IMAGE SIZES...
								] }
								onChange={ ( value ) => setAttributes( { thumbnailSize: value } ) }
							/>
						}

						<ToggleControl
							label={ __( 'Show Post Date' ) }
							checked={ showDate }
							onChange={ ( value ) => setAttributes( { showDate: value } ) }
						/>

						<ToggleControl
							label={ __( 'Show Post Excerpt' ) }
							checked={ showExcerpt }
							onChange={ ( value ) => setAttributes( { showExcerpt: value } ) }
						/>

						{ showExcerpt &&
							<RangeControl
								label={ __( 'Excerpt Length' ) }
								value={ excerptLength }
								onChange={ ( value ) => setAttributes( { excerptLength: value } ) }
								min={ 1 }
								max={ 1000 }
							/>
						}

						<ToggleControl
							label={ __( 'Show Read More Button' ) }
							checked={ showReadMoreButton }
							onChange={ ( value ) => setAttributes( { showReadMoreButton: value } ) }
						/>
					</PanelBody>
				</InspectorControls>

				<ul className={ `wpzoom-blocks ${clazz}` }>
					{ posts.map( ( post, i ) => {
						const titleTrimmed = 'title' in post && typeof post.title === 'object' && 'rendered' in post.title ? post.title.rendered.trim() : __( '(no title)' );
						let image = false;

						if ( post.featured_media ) {
							let { media = null } = useSelect( ( select ) => { return { media: select( 'core' ).getMedia( post.featured_media ) }; }, [ post.featured_media ] );

							if ( typeof media === 'object' && media !== null && 'media_details' in media && 'sizes' in media.media_details ) {
								if ( thumbnailSize in media.media_details.sizes ) {
									image = media.media_details.sizes[ thumbnailSize ];
								} else if ( 'thumbnail' in media.media_details.sizes ) {
									image = media.media_details.sizes.thumbnail;
								} else {
									image = { source_url: media.source_url, height: media.media_details.height, width: media.media_details.width };
								}

								image.alt = media.alt_text.trim() || media.title.rendered.trim();
							}
						}

						return ( <li key={ post.id } className={ `${clazz}_post ${clazz}_post-${post.id}` }>
							{ showThumbnail && image && image.source_url && image.height && image.width &&
								<div className={ `${clazz}_post-thumbnail` }>
									<a href={ post.link } title={ titleTrimmed }>
										<img src={ image.source_url } height={ image.height } width={ image.width } alt={ image.alt } />
									</a>
								</div>
							}

							<h3 className={ `${clazz}_post-title` }>
								<a href={ post.link } title={ titleTrimmed }>{ titleTrimmed ? ( <RawHTML>{ titleTrimmed }</RawHTML> ) : __( '(no title)' ) }</a>
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
									<a href={ post.link } title={ __( 'Continue reading this post...' ) } className={ `wp-block-button__link` }>{ __( 'Read More' ) }</a>
								</div>
							}
						</li> );
					} ) }
				</ul>
			</>
		);
	} )
} );