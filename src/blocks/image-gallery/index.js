import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, Button, ToggleControl, HorizontalRule, RangeControl, SelectControl } from '@wordpress/components';

registerBlockType( 'wpzoom-blocks/image-gallery', {
	title: __( 'Image Gallery', 'wpzoom-portfolio' ),
	description: __( 'A simple image gallery block.', 'wpzoom-portfolio' ),
	icon: 'format-gallery',
	category: 'wpzoom-blocks',
    attributes: {
		images: {
			type: 'array',
			default: []
        },
        columns: {
            type: 'number',
            default: 3
        },
        gap: {
            type: 'number',
            default: 15
        },
        imageSize: {
            type: 'number',
            default: 200
        },
        aspectRatio: {
            type: 'string',
            default: 'auto'
        },
        borderRadius: {
            type: 'number',
            default: 4
        },
        borderRadiusUnit: {
            type: 'string',
            default: 'px'
        },
        hoverEffect: {
            type: 'string',
            default: 'scale-up'
        },
        enableLightbox: {
            type: 'boolean',
            default: true
        },
        showCaptions: {
            type: 'boolean',
            default: true
		}
	},
	edit: function( props ) {
		const { attributes, setAttributes } = props;
        const { images, columns, gap, imageSize, aspectRatio, borderRadius, borderRadiusUnit, hoverEffect, enableLightbox, showCaptions } = attributes;

		const onSelectImages = function( selectedImages ) {
            // Store the image data we need (id, url, alt, caption, full size)
			const imageData = selectedImages.map( img => ({
				id: img.id,
				url: img.sizes && img.sizes.medium ? img.sizes.medium.url : img.url,
                fullUrl: img.url, // Full size for lightbox
                alt: img.alt || '',
                caption: img.caption || ''
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
                    }, __('Clear All', 'wpzoom-portfolio')),

                    wp.element.createElement(HorizontalRule),

                    wp.element.createElement(RangeControl, {
                        label: __('Number of Columns', 'wpzoom-portfolio'),
                        value: columns,
                        onChange: function (value) { setAttributes({ columns: value }); },
                        min: 1,
                        max: 6,
                        help: __('Choose how many columns to display in the gallery grid.', 'wpzoom-portfolio')
                    }),

                    wp.element.createElement(RangeControl, {
                        label: __('Gap Between Images', 'wpzoom-portfolio'),
                        value: gap,
                        onChange: function (value) { setAttributes({ gap: value }); },
                        min: 0,
                        max: 50,
                        help: __('Adjust the spacing between images in pixels.', 'wpzoom-portfolio')
                    }),

                    wp.element.createElement(HorizontalRule),

                    // Only show image height control when aspect ratio is "auto"
                    aspectRatio === 'auto' && wp.element.createElement(RangeControl, {
                        label: __('Image Height', 'wpzoom-portfolio'),
                        value: imageSize,
                        onChange: function (value) { setAttributes({ imageSize: value }); },
                        min: 100,
                        max: 500,
                        help: __('Set the height of images in pixels.', 'wpzoom-portfolio')
                    }),

                    wp.element.createElement(SelectControl, {
                        label: __('Aspect Ratio', 'wpzoom-portfolio'),
                        value: aspectRatio,
                        onChange: function (value) { setAttributes({ aspectRatio: value }); },
                        options: [
                            { label: __('Auto (Original)', 'wpzoom-portfolio'), value: 'auto' },
                            { label: __('Square (1:1)', 'wpzoom-portfolio'), value: '1' },
                            { label: __('Landscape (16:9)', 'wpzoom-portfolio'), value: '1.777' },
                            { label: __('Landscape (4:3)', 'wpzoom-portfolio'), value: '1.333' },
                            { label: __('Portrait (3:4)', 'wpzoom-portfolio'), value: '0.75' },
                            { label: __('Portrait (9:16)', 'wpzoom-portfolio'), value: '0.5625' }
                        ],
                        help: aspectRatio === 'auto' ? 
                            __('Choose the aspect ratio for all images. When set to "Auto", you can control image height manually.', 'wpzoom-portfolio') :
                            __('Choose the aspect ratio for all images. Image height will be automatically determined by the aspect ratio.', 'wpzoom-portfolio')
                    }),

                    wp.element.createElement(HorizontalRule),

                    // Border Radius Control
                    wp.element.createElement('div', {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '16px'
                        }
                    },
                        wp.element.createElement('div', { style: { flex: '1' } },
                            wp.element.createElement(RangeControl, {
                                label: __('Border Radius', 'wpzoom-portfolio'),
                                value: borderRadius,
                                onChange: function (value) { setAttributes({ borderRadius: value }); },
                                min: 0,
                                max: 100,
                                help: __('Adjust the roundness of image corners.', 'wpzoom-portfolio')
                            })
                        ),
                        wp.element.createElement('div', { style: { marginTop: '20px' } },
                            wp.element.createElement(SelectControl, {
                                value: borderRadiusUnit,
                                onChange: function (value) { setAttributes({ borderRadiusUnit: value }); },
                                options: [
                                    { label: 'px', value: 'px' },
                                    { label: '%', value: '%' }
                                ],
                                style: { minWidth: '60px' }
                            })
                        )
                    ),

                    wp.element.createElement(HorizontalRule),

                    wp.element.createElement(SelectControl, {
                        label: __('Hover Effect', 'wpzoom-portfolio'),
                        value: hoverEffect,
                        onChange: function (value) { setAttributes({ hoverEffect: value }); },
                        options: [
                            { label: __('Scale Up', 'wpzoom-portfolio'), value: 'scale-up' },
                            { label: __('Scale Down', 'wpzoom-portfolio'), value: 'scale-down' },
                            { label: __('Grayscale to Color', 'wpzoom-portfolio'), value: 'grayscale' }
                        ],
                        help: __('Choose the hover animation effect for gallery images.', 'wpzoom-portfolio')
                    }),

                    wp.element.createElement(HorizontalRule),

                    wp.element.createElement(ToggleControl, {
                        label: __('Enable Lightbox', 'wpzoom-portfolio'),
                        checked: enableLightbox,
                        onChange: function (value) { setAttributes({ enableLightbox: value }); }
                    }),

                    enableLightbox && wp.element.createElement(ToggleControl, {
                        label: __('Show Captions in Lightbox', 'wpzoom-portfolio'),
                        checked: showCaptions,
                        onChange: function (value) { setAttributes({ showCaptions: value }); }
                    })
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
                        className: 'wpzoom-gallery-grid columns-' + columns,
                        style: { gap: gap + 'px' }
					}, images.map( function( image, index ) {
                        // Calculate image styles based on aspect ratio and size
                        const getImageStyles = function () {
                            const baseStyles = {
                                width: '100%',
                                borderRadius: borderRadius + borderRadiusUnit,
                                objectFit: 'cover'
                            };

                            if (aspectRatio === 'auto') {
                                // When aspect ratio is auto, use the set height
                                baseStyles.height = imageSize + 'px';
                            } else {
                                // When aspect ratio is set, let CSS aspect-ratio handle it
                                baseStyles.aspectRatio = aspectRatio;
                                // Don't set height, let it be determined by aspect ratio
                            }

                            return baseStyles;
                        };

						return wp.element.createElement( 'div', {
							key: image.id,
                            className: 'wpzoom-gallery-item hover-' + hoverEffect + (enableLightbox ? ' lightbox-enabled' : '')
						},
							wp.element.createElement( 'img', {
								src: image.url,
								alt: image.alt,
                                style: getImageStyles()
                            }),
                            enableLightbox && wp.element.createElement('div', {
                                className: 'wpzoom-lightbox-overlay',
                                style: {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    opacity: 0,
                                    transition: 'opacity 0.3s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: borderRadius + borderRadiusUnit
                                }
                            },
                                wp.element.createElement('span', {
                                    style: {
                                        color: 'white',
                                        fontSize: '24px',
                                        fontWeight: 'bold'
                                    }
                                }, '🔍')
                            )
						);
					})
				)
			)
		];
	},
	save: function( props ) {
		const { attributes } = props;
        const { images, columns, gap, imageSize, aspectRatio, borderRadius, borderRadiusUnit, hoverEffect, enableLightbox, showCaptions } = attributes;

		if ( images.length === 0 ) {
			return null;
		}

		return wp.element.createElement( 'div', {
            className: 'wpzoom-image-gallery-block' + (enableLightbox ? ' use-lightbox' : '')
		},
			wp.element.createElement( 'div', {
                className: 'wpzoom-gallery-grid columns-' + columns,
                style: { gap: gap + 'px' }
			}, images.map( function( image ) {
                // Calculate image styles based on aspect ratio and size
                const getImageStyles = function () {
                    const baseStyles = {
                        width: '100%',
                        borderRadius: borderRadius + borderRadiusUnit,
                        objectFit: 'cover'
                    };

                    if (aspectRatio === 'auto') {
                        // When aspect ratio is auto, use the set height
                        baseStyles.height = imageSize + 'px';
                    } else {
                        // When aspect ratio is set, let CSS aspect-ratio handle it
                        baseStyles.aspectRatio = aspectRatio;
                        // Don't set height, let it be determined by aspect ratio
                    }

                    return baseStyles;
                };

                const imageElement = wp.element.createElement('img', {
                    src: image.url,
                    alt: image.alt,
                    style: getImageStyles()
                });

                if (enableLightbox) {
                    return wp.element.createElement('div', {
                        key: image.id,
                        className: 'wpzoom-gallery-item hover-' + hoverEffect
                    },
                        wp.element.createElement('a', {
                            href: image.fullUrl,
                            className: 'wpzoom-lightbox-link',
                            'data-title': showCaptions ? image.caption : '',
                            'data-lightbox': 'wpzoom-gallery'
                        }, imageElement)
                    );
                } else {
                    return wp.element.createElement('div', {
                        key: image.id,
                        className: 'wpzoom-gallery-item hover-' + hoverEffect
                    }, imageElement);
                }
			})
		));
	}
} );