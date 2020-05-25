import apiFetch from '@wordpress/api-fetch';
import { InspectorControls } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { PanelBody, Placeholder, QueryControls, RangeControl, SelectControl, Spinner, ToggleControl, TreeSelect } from '@wordpress/components';
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

registerBlockType( 'wpzoom-blocks/posts', {
	title: __( 'Posts', 'wpzoom-blocks' ),
	description: __( 'Display a customizable list of posts.', 'wpzoom-blocks' ),
	icon: 'list-view',
	category: 'wpzoom-blocks',
	supports: {
		align: true,
		html: false
	},
	example: {},
	edit: withSelect( ( select, props ) => {
		const { getEntityRecords } = select( 'core' );

		return {
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
			const { attributes, setAttributes, categoriesList } = this.props;
			const { categories, amount, columnsAmount, order, orderBy, showThumbnail, thumbnailSize, showAuthor, showDate, showCommentCount, showExcerpt, excerptLength, showReadMoreButton } = attributes;
			const { imageSizes } = this.state;

			if ( ! categoriesList || ! imageSizes ) {
				return (
					<>
						<Placeholder icon="list-view" label={ __( 'WPZOOM Blocks - Posts', 'wpzoom-blocks' ) }>
							<Spinner /> { __( 'Loading...', 'wpzoom-blocks' ) }
						</Placeholder>
					</>
				);
			}

			const termsTree = buildTermsTree( categoriesList );

			return (
				<>
					<InspectorControls>
						<PanelBody title={ __( 'Options', 'wpzoom-blocks' ) }>
							<RangeControl
								label={ __( 'Amount of Columns', 'wpzoom-blocks' ) }
								max={ 10 }
								min={ 1 }
								onChange={ ( value ) => setAttributes( { columnsAmount: value } ) }
								value={ columnsAmount }
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
										label: __( 'Most Popular', 'wpzoom-blocks' ),
										value: 'comments/desc'
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
								label={ __( 'Show Post Author', 'wpzoom-blocks' ) }
								checked={ showAuthor }
								onChange={ ( value ) => setAttributes( { showAuthor: value } ) }
							/>

							<ToggleControl
								label={ __( 'Show Post Date', 'wpzoom-blocks' ) }
								checked={ showDate }
								onChange={ ( value ) => setAttributes( { showDate: value } ) }
							/>

							<ToggleControl
								label={ __( 'Show Post Comment Count', 'wpzoom-blocks' ) }
								checked={ showCommentCount }
								onChange={ ( value ) => setAttributes( { showCommentCount: value } ) }
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

					<Fragment>
						<ServerSideRender block="wpzoom-blocks/posts" attributes={ attributes } />
					</Fragment>
				</>
			);
		}
	} )
} );