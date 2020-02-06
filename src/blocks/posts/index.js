import apiFetch from '@wordpress/api-fetch';
import { InspectorControls } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { PanelBody, Placeholder, QueryControls, RangeControl, SelectControl, Spinner, ToggleControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { Component, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import ServerSideRender from '@wordpress/server-side-render';

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
			const { categories, amount, order, orderBy, showThumbnail, thumbnailSize, showAuthor, showDate, showCommentCount, showExcerpt, excerptLength, showReadMoreButton } = attributes;
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