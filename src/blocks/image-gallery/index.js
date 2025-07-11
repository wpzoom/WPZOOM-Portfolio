import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';

registerBlockType( 'wpzoom-blocks/image-gallery', {
	title: __( 'Image Gallery', 'wpzoom-portfolio' ),
	description: __( 'A simple image gallery block.', 'wpzoom-portfolio' ),
	icon: 'format-gallery',
	category: 'wpzoom-blocks',
	attributes: {
		images: {
			type: 'array',
			default: []
		}
	},
	edit: function( props ) {
		const { attributes, setAttributes } = props;
		const { images } = attributes;

		const onSelectImages = function( selectedImages ) {
			// Store the image data we need (id, url, alt)
			const imageData = selectedImages.map( img => ({
				id: img.id,
				url: img.sizes && img.sizes.medium ? img.sizes.medium.url : img.url,
				alt: img.alt || ''
			}));
			setAttributes({ images: imageData });
		};

		return [
			// Block Settings Panel
			wp.element.createElement( InspectorControls, { key: 'inspector' },
				wp.element.createElement( PanelBody, { 
					title: __( 'Gallery Settings', 'wpzoom-portfolio' ),
					initialOpen: true 
				},
					wp.element.createElement( MediaUploadCheck, null,
						wp.element.createElement( MediaUpload, {
							onSelect: onSelectImages,
							allowedTypes: [ 'image' ],
							multiple: true,
							gallery: true,
							value: images.map( img => img.id ),
							render: function( obj ) {
								return wp.element.createElement( Button, {
									onClick: obj.open,
									variant: 'primary'
								}, images.length === 0 ? 
									__( 'Select Images', 'wpzoom-portfolio' ) : 
									__( 'Edit Gallery (' + images.length + ' images)', 'wpzoom-portfolio' )
								);
							}
						})
					),
					images.length > 0 && wp.element.createElement( Button, {
						onClick: function() { setAttributes({ images: [] }); },
						variant: 'secondary',
						isDestructive: true,
						style: { marginTop: '10px' }
					}, __( 'Clear All', 'wpzoom-portfolio' ) )
				)
			),
			// Block Content - Image Grid
			wp.element.createElement( 'div', { 
				key: 'content',
				className: 'wpzoom-image-gallery-block'
			}, 
				images.length === 0 ? 
					wp.element.createElement( 'div', {
						style: { 
							padding: '40px', 
							border: '2px dashed #ccc',
							textAlign: 'center',
							color: '#666'
						}
					}, __( 'No images selected. Use the block settings to add images.', 'wpzoom-portfolio' ) ) :
					wp.element.createElement( 'div', {
						className: 'wpzoom-gallery-grid'
					}, images.map( function( image, index ) {
						return wp.element.createElement( 'div', {
							key: image.id,
							className: 'wpzoom-gallery-item'
						},
							wp.element.createElement( 'img', {
								src: image.url,
								alt: image.alt,
								style: { 
									width: '100%', 
									height: '200px', 
									objectFit: 'cover',
									borderRadius: '4px'
								}
							})
						);
					})
				)
			)
		];
	},
	save: function( props ) {
		const { attributes } = props;
		const { images } = attributes;

		if ( images.length === 0 ) {
			return null;
		}

		return wp.element.createElement( 'div', {
			className: 'wpzoom-image-gallery-block'
		},
			wp.element.createElement( 'div', {
				className: 'wpzoom-gallery-grid'
			}, images.map( function( image ) {
				return wp.element.createElement( 'div', {
					key: image.id,
					className: 'wpzoom-gallery-item'
				},
					wp.element.createElement( 'img', {
						src: image.url,
						alt: image.alt
					})
				);
			})
		));
	}
} );