import apiFetch from '@wordpress/api-fetch';
import { InspectorControls } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { HorizontalRule, PanelBody, Placeholder, QueryControls, RadioControl, RangeControl, SelectControl, Spinner, TextControl, ToggleControl, TreeSelect } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { Component, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { groupBy } from 'lodash';
import ServerSideRender from '@wordpress/server-side-render';

function buildTermsTree( flatTerms ) {
	const flatTermsWithParentAndChildren = flatTerms.map( ( term ) => {
		return {
			children: [],
			parent: null,
			...term,
		};
	} );

	const termsByParent = groupBy( flatTermsWithParentAndChildren, 'parent' );
	if ( termsByParent.null && termsByParent.null.length ) {
		return flatTermsWithParentAndChildren;
	}
	const fillWithChildren = ( terms ) => {
		return terms.map( ( term ) => {
			const children = termsByParent[ term.id ];
			return {
				...term,
				children:
					children && children.length
						? fillWithChildren( children )
						: [],
			};
		} );
	};

	return fillWithChildren( termsByParent[ '0' ] || [] );
}

registerBlockType( 'wpzoom-blocks/portfolio', {
	title: __( 'Portfolio', 'wpzoom-blocks' ),
	description: __( 'Display a customizable list of portfolio items.', 'wpzoom-blocks' ),
	icon: 'portfolio',
	category: 'wpzoom-blocks',
	supports: {
		align: true,
		html: false
	},
	example: {},
	edit: withSelect( ( select, props ) => {
		const { getEntityRecords } = select( 'core' );

		return {
			categoriesList: getEntityRecords( 'taxonomy', 'wpzb_portfolio_category', { per_page: -1, hide_empty: false } )
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
			const { attributes, setAttributes, categoriesList } = this.props;
			const { amount, alwaysPlayBackgroundVideo, categories, columnsAmount, excerptLength, layout, lazyLoad, lightbox,
			        lightboxCaption, order, orderBy, readMoreLabel, showAuthor, showBackgroundVideo, showCategoryFilter, showDate,
			        showExcerpt, showReadMore, showThumbnail, showViewAll, thumbnailSize, viewAllLabel, viewAllLink } = attributes;
			const { imageSizes } = this.state;

			if ( ! categoriesList || ! imageSizes ) {
				return (
					<>
						<Placeholder icon="list-view" label={ __( 'WPZOOM Blocks - Portfolio', 'wpzoom-blocks' ) }>
							<Spinner /> { __( 'Loading...', 'wpzoom-blocks' ) }
						</Placeholder>
					</>
				);
			}

			const termsTree = buildTermsTree( categoriesList );

			return (
				<>
					<InspectorControls>
						<PanelBody title={ __( 'Options', 'wpzoom-blocks' ) } className="wpzb-settings-panel">
							<PanelBody title={ __( 'Layout', 'wpzoom-blocks' ) } className="wpzb-sub-panel">
								<RadioControl
									label={ __( 'Layout Type', 'wpzoom-blocks' ) }
									selected={ layout }
									options={ [
										{ value: 'list', label: __( 'List', 'wpzoom-blocks' ) },
										{ value: 'grid', label: __( 'Grid', 'wpzoom-blocks' ) },
										{ value: 'masonry', label: __( 'Masonry', 'wpzoom-blocks' ) }
									] }
									onChange={ ( value ) => setAttributes( { layout: value } ) }
									className="wpzb-layout-type-select"
								/>

								{ ( layout == 'grid' || layout == 'masonry' ) &&
									<RangeControl
										label={ __( 'Amount of Columns', 'wpzoom-blocks' ) }
										value={ columnsAmount }
										onChange={ ( value ) => setAttributes( { columnsAmount: value } ) }
										min={ 1 }
										max={ 10 }
									/>
								}

								<HorizontalRule />

								<ToggleControl
									label={ __( 'Show Category Filter Buttons', 'wpzoom-blocks' ) }
									checked={ showCategoryFilter }
									onChange={ ( value ) => setAttributes( { showCategoryFilter: value } ) }
								/>

								<HorizontalRule />

								<ToggleControl
									label={ __( 'Show View All Button', 'wpzoom-blocks' ) }
									checked={ showViewAll }
									onChange={ ( value ) => setAttributes( { showViewAll: value } ) }
								/>

								{ showViewAll &&
									<TextControl
										label={ __( 'View All Button Label', 'wpzoom-blocks' ) }
										value={ viewAllLabel }
										onChange={ ( value ) => setAttributes( { viewAllLabel: value } ) }
									/>
								}

								{ showViewAll &&
									<TextControl
										type="url"
										label={ __( 'View All Button Link', 'wpzoom-blocks' ) }
										value={ viewAllLink }
										onChange={ ( value ) => setAttributes( { viewAllLink: value } ) }
									/>
								}
							</PanelBody>

							<PanelBody title={ __( 'Filtering', 'wpzoom-blocks' ) } className="wpzb-sub-panel">
								<SelectControl
									label={ __( 'Order By', 'wpzoom-blocks' ) }
									value={ `${ orderBy }/${ order }` }
									options={ [
										{
											label: __( 'Newest to Oldest', 'wpzoom-blocks' ),
											value: 'date/desc',
										},
										{
											label: __( 'Oldest to Newest', 'wpzoom-blocks' ),
											value: 'date/asc',
										},
										{
											label: __( 'A → Z', 'wpzoom-blocks' ),
											value: 'title/asc',
										},
										{
											label: __( 'Z → A', 'wpzoom-blocks' ),
											value: 'title/desc',
										},
									] }
									onChange={ ( value ) => {
										const [ newOrderBy, newOrder ] = value.split( '/' );
										if ( newOrder !== order ) {
											setAttributes( { order: newOrder } );
										}
										if ( newOrderBy !== orderBy ) {
											setAttributes( { orderBy: newOrderBy } );
										}
									} }
								/>

								<TreeSelect
									label={ __( 'Category', 'wpzoom-blocks' ) }
									noOptionLabel={ __( 'All', 'wpzoom-blocks' ) }
									tree={ termsTree }
									selectedId={ categories }
									multiple
									onChange={ ( value ) => setAttributes( { categories: '' !== value ? value : undefined } ) }
								/>

								<RangeControl
									label={ __( 'Number of Items', 'wpzoom-blocks' ) }
									value={ amount }
									onChange={ ( value ) => setAttributes( { amount: value } ) }
									min={ 1 }
									max={ 100 }
									required
								/>
							</PanelBody>

							<PanelBody title={ __( 'Fields', 'wpzoom-blocks' ) } className="wpzb-sub-panel">
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

								<HorizontalRule />

								<ToggleControl
									label={ __( 'Show Background Video', 'wpzoom-blocks' ) }
									checked={ showBackgroundVideo }
									onChange={ ( value ) => setAttributes( { showBackgroundVideo: value } ) }
								/>

								{ showBackgroundVideo &&
									<ToggleControl
										label={ __( 'Always Play Background Video', 'wpzoom-blocks' ) }
										checked={ alwaysPlayBackgroundVideo }
										onChange={ ( value ) => setAttributes( { alwaysPlayBackgroundVideo: value } ) }
									/>
								}

								<HorizontalRule />

								<ToggleControl
									label={ __( 'Show Post Author', 'wpzoom-blocks' ) }
									checked={ showAuthor }
									onChange={ ( value ) => setAttributes( { showAuthor: value } ) }
								/>

								<HorizontalRule />

								<ToggleControl
									label={ __( 'Show Post Date', 'wpzoom-blocks' ) }
									checked={ showDate }
									onChange={ ( value ) => setAttributes( { showDate: value } ) }
								/>

								<HorizontalRule />

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

								<HorizontalRule />

								<ToggleControl
									label={ __( 'Show Read More Button', 'wpzoom-blocks' ) }
									checked={ showReadMore }
									onChange={ ( value ) => setAttributes( { showReadMore: value } ) }
								/>

								{ showReadMore &&
									<TextControl
										label={ __( 'Read More Button Label', 'wpzoom-blocks' ) }
										value={ readMoreLabel }
										onChange={ ( value ) => setAttributes( { readMoreLabel: value } ) }
									/>
								}
							</PanelBody>

							<PanelBody title={ __( 'Other', 'wpzoom-blocks' ) } className="wpzb-sub-panel">
								<ToggleControl
									label={ __( 'Load Portfolio Items Dynamically (Lazy Load)', 'wpzoom-blocks' ) }
									checked={ lazyLoad }
									onChange={ ( value ) => setAttributes( { lazyLoad: value } ) }
								/>

								<HorizontalRule />

								<ToggleControl
									label={ __( 'Open Portfolio Items in a Lightbox', 'wpzoom-blocks' ) }
									checked={ lightbox }
									onChange={ ( value ) => setAttributes( { lightbox: value } ) }
								/>

								{ lightbox &&
									<ToggleControl
										label={ __( 'Show Lightbox Caption', 'wpzoom-blocks' ) }
										checked={ lightboxCaption }
										onChange={ ( value ) => setAttributes( { lightboxCaption: value } ) }
									/>
								}
							</PanelBody>
						</PanelBody>
					</InspectorControls>

					<Fragment>
						<ServerSideRender block="wpzoom-blocks/portfolio" attributes={ attributes } />
					</Fragment>
				</>
			);
		}
	} )
} );