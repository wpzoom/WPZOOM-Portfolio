import apiFetch from '@wordpress/api-fetch';
import { InspectorControls } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { Disabled, HorizontalRule, PanelBody, Placeholder, RadioControl, RangeControl, SelectControl, Spinner, TextControl, ToggleControl, TreeSelect } from '@wordpress/components';
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

function dynamicSort( property ) {
	var sortOrder = 1;

	if ( property[0] === '-' ) {
		sortOrder = -1;
		property = property.substr( 1 );
	}

	return function( a, b ) {
		if ( sortOrder == -1 ) {
			return b[ property ].localeCompare( a[ property ] );
		} else {
			return a[ property ].localeCompare( b[ property ] );
		}        
	}
}

registerBlockType( 'wpzoom-blocks/portfolio', {
	title: __( 'Portfolio', 'wpzoom-blocks' ),
	description: __( 'Display a customizable list of portfolio items.', 'wpzoom-blocks' ),
	icon: 'images-alt2',
	category: 'wpzoom-blocks',
	supports: {
		align: true,
		html: false
	},
	example: {},
	edit: withSelect( select => {
		const { getEntityRecords } = select( 'core' );

		var cats = [];
		var cats1 = getEntityRecords( 'taxonomy', 'portfolio', { per_page: -1, hide_empty: false } );
		if ( Array.isArray( cats1 ) ) cats.push( ...cats1 );
		var cats2 = getEntityRecords( 'taxonomy', 'category', { per_page: -1, hide_empty: false } );
		if ( Array.isArray( cats2 ) ) cats.push( ...cats2 );
		cats.sort( dynamicSort( 'name' ) );
		cats.unshift( { id: -1, name: __( 'All', 'wpzoom-blocks' ) } );

		return {
			categoriesList: cats
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
			const { amount, categories, columnsAmount, excerptLength, layout, lazyLoad, lightbox,
					lightboxCaption, order, orderBy, readMoreLabel, showAuthor, showCategoryFilter, showDate,
					showExcerpt, showReadMore, showThumbnail, showViewAll, source, thumbnailSize, viewAllLabel, viewAllLink } = attributes;
			const { imageSizes } = this.state;

			if ( ! categoriesList || ! imageSizes ) {
				return (
					<>
						<Placeholder icon="list-view" label={ __( 'WPZOOM Portfolio', 'wpzoom-blocks' ) }>
							<Spinner /> { __( 'Loading...', 'wpzoom-blocks' ) }
						</Placeholder>
					</>
				);
			}

			const termsTree = buildTermsTree( categoriesList );

			let fields = <>
				<ToggleControl
					label={ __( 'Show Author', 'wpzoom-blocks' ) }
					checked={ showAuthor }
					onChange={ ( value ) => setAttributes( { showAuthor: value } ) }
				/>

				<HorizontalRule />

				<ToggleControl
					label={ __( 'Show Date', 'wpzoom-blocks' ) }
					checked={ showDate }
					onChange={ ( value ) => setAttributes( { showDate: value } ) }
				/>

				<HorizontalRule />

				<ToggleControl
					label={ __( 'Show Excerpt', 'wpzoom-blocks' ) }
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
			</>;

			if ( 'list' != layout ) {
				fields = <Disabled>{ fields }</Disabled>;
			}

			return (
				<>
					<InspectorControls>
						<PanelBody title={ __( 'Options', 'wpzoom-blocks' ) } className="wpzb-settings-panel">
							<PanelBody title={ __( 'Filtering', 'wpzoom-blocks' ) } className="wpzb-sub-panel">
								<SelectControl
									label={ __( 'Portfolio Items Source', 'wpzoom-blocks' ) }
									value={ source }
									options={ [
										{
											label: __( 'Portfolio Posts', 'wpzoom-blocks' ),
											value: 'portfolio_item'
										},
										{
											label: __( 'Blog Posts', 'wpzoom-blocks' ),
											value: 'post'
										}
									] }
									onChange={ ( value ) => setAttributes( { source: value } ) }
								/>

								<SelectControl
									label={ __( 'Order By', 'wpzoom-blocks' ) }
									value={ `${ orderBy }/${ order }` }
									options={ [
										{
											label: __( 'Newest to Oldest', 'wpzoom-blocks' ),
											value: 'date/desc'
										},
										{
											label: __( 'Oldest to Newest', 'wpzoom-blocks' ),
											value: 'date/asc'
										},
										{
											label: __( 'A → Z', 'wpzoom-blocks' ),
											value: 'title/asc'
										},
										{
											label: __( 'Z → A', 'wpzoom-blocks' ),
											value: 'title/desc'
										}
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
									help={ __( 'Multiple selections allowed.', 'wpzoom-blocks' ) }
									tree={ termsTree }
									selectedId={ typeof categories !== 'undefined' && categories.length > 0 ? categories : [-1] }
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

							<PanelBody title={ __( 'Layout', 'wpzoom-blocks' ) } className="wpzb-sub-panel">
								<RadioControl
									className="wpzb-button-select wpzb-button-select-icons"
									label={ __( 'Layout Type', 'wpzoom-blocks' ) }
									onChange={ ( value ) => setAttributes( { layout: value } ) }
									options={ [
										{ value: 'list', label: __( 'List', 'wpzoom-blocks' ) },
										{ value: 'grid', label: __( 'Grid', 'wpzoom-blocks' ) }
									] }
									selected={ layout }
								/>

								{ layout == 'grid' &&
									<RangeControl
										label={ __( 'Amount of Columns', 'wpzoom-blocks' ) }
										max={ 10 }
										min={ 1 }
										onChange={ ( value ) => setAttributes( { columnsAmount: value } ) }
										value={ columnsAmount }
									/>
								}

								<HorizontalRule />

								<ToggleControl
									label={ __( 'Show Category Filter at the Top', 'wpzoom-blocks' ) }
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

							<PanelBody title={ __( 'Fields', 'wpzoom-blocks' ) } className="wpzb-sub-panel">
								<ToggleControl
									label={ __( 'Show Thumbnail', 'wpzoom-blocks' ) }
									checked={ showThumbnail }
									onChange={ ( value ) => setAttributes( { showThumbnail: value } ) }
								/>

								{ showThumbnail &&
									<SelectControl
										label={ __( 'Thumbnail Size', 'wpzoom-blocks' ) }
										value={ thumbnailSize }
										options={ imageSizes }
										onChange={ ( value ) => setAttributes( { thumbnailSize: value } ) }
									/>
								}

								<HorizontalRule />


								{ fields }
							</PanelBody>

							<PanelBody title={ __( 'Other', 'wpzoom-blocks' ) } className="wpzb-sub-panel">
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