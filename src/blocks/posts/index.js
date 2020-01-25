import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { withSelect } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, QueryControls, RangeControl, ToggleControl, Spinner, Placeholder } from '@wordpress/components';

registerBlockType( 'wpzoom-blocks/posts', {
	title: __( 'Posts' ),
	description: __( 'Display a list of posts, optionally filtered/sorted by category or other requisites.' ),
	icon: 'list-view',
	category: 'wpzoom-blocks',
	supports: { html: false },
	example: {},
	edit: withSelect( ( select, props ) => {
		const { attributes } = props;
		const { categories, amount, order, orderBy } = attributes;

		return {
			posts: select( 'core' ).getEntityRecords( 'postType', 'post', { orderby: orderBy, order: order, per_page: amount, status: 'publish' } ),
			categoriesList: select( 'core' ).getEntityRecords( 'taxonomy', 'category', { per_page: -1, hide_empty: false } )
		};
	} )( ( props ) => {
		const { attributes, setAttributes, posts, categoriesList, className } = props;
		const { categories, amount, order, orderBy, showThumbnail, showDate, showExcerpt, excerptLength, showReadMoreButton } = attributes;

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

						{ showExcerpt && <RangeControl
							label={ __( 'Excerpt Length' ) }
							value={ excerptLength }
							onChange={ ( value ) => setAttributes( { excerptLength: value } ) }
							min={ 1 }
							max={ 1000 }
						/> }

						<ToggleControl
							label={ __( 'Show Read More Button' ) }
							checked={ showReadMoreButton }
							onChange={ ( value ) => setAttributes( { showReadMoreButton: value } ) }
						/>
					</PanelBody>
				</InspectorControls>

				<ul>
					{ posts.map( ( post, i ) => <li key={ post.id }><a className={ className } href={ post.link }>{ post.title.rendered }</a></li> ) }
				</ul>
			</>
		);
	} )
} );