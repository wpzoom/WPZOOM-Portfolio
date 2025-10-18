import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    MediaUpload, 
    MediaUploadCheck,
    PanelColorSettings
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    ToggleControl,
    HorizontalRule,
    RangeControl,
    SelectControl,
    RadioControl
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import {
    blockColors,
    secondaryColors
} from '../portfolio/colors-palette';
import {
    colorIcon,
    fieldsIcon,
    layoutIcon,
    settingsIcon
} from '../../icons';

const Edit = ({ attributes, setAttributes }) => {
    const {
        images, 
        layout,
        columns,
        gap,
        imageSize,
        aspectRatio,
        borderRadius,
        borderRadiusUnit,
        hoverEffect,
        enableLightbox,
        showCaptions 
    } = attributes;

    const onSelectImages = (selectedImages) => {
    // Store the image data we need (id, url, alt, caption, full size)
        const imageData = selectedImages.map(img => ({
            id: img.id,
            url: img.sizes && img.sizes.medium ? img.sizes.medium.url : img.url,
            fullUrl: img.url, // Full size for lightbox
            alt: img.alt || '',
            caption: img.caption || ''
        }));
        setAttributes({ images: imageData });
    };

    // Calculate image styles based on aspect ratio and size
    const getImageStyles = () => {
        const baseStyles = {
            width: '100%',
            borderRadius: borderRadius + borderRadiusUnit,
            objectFit: 'cover'
        };

        // For masonry layout, let images keep their natural dimensions
        if (layout === 'masonry') {
            return baseStyles;
        }

        // For grid layout, apply height and aspect ratio controls
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

    return (
        <>
            <InspectorControls group="settings">
                <PanelBody 
                    icon={fieldsIcon}
                    title={__('Gallery Content', 'wpzoom-portfolio')}
                    initialOpen={true} 
                    className="wpzb-settings-panel"
                >
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectImages}
                            allowedTypes={['image']}
                            multiple={true}
                            gallery={true}
                            value={images.map(img => img.id)}
                            render={({ open }) => (
                                <Button onClick={open} variant="primary">
                                    {images.length === 0 ?
                                        __('Select Images', 'wpzoom-portfolio') : 
                                        __(`Edit Gallery (${images.length} images)`, 'wpzoom-portfolio')
                                    }
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>

                    {images.length > 0 && (
                        <Button
                            onClick={() => setAttributes({ images: [] })}
                            variant="secondary"
                            isDestructive={true}
                            style={{ marginTop: '10px' }}
                        >
                            {__('Clear All', 'wpzoom-portfolio')}
                        </Button>
                    )}
                </PanelBody>

                <PanelBody
                    icon={layoutIcon} 
                    title={__('Layout', 'wpzoom-portfolio')}
                    initialOpen={false} 
                    className="wpzb-settings-panel"
                >
                    <RadioControl
                        className="wpzb-button-select wpzb-button-select-icons"
                        label={__('Layout Type', 'wpzoom-portfolio')}
                        onChange={(value) => setAttributes({ layout: value })}
                        options={[
                            { value: 'grid', label: __('Grid', 'wpzoom-portfolio') },
                            { value: 'masonry', label: __('Masonry', 'wpzoom-portfolio') }
                        ]}
                        selected={layout}
                    />

                    <HorizontalRule />

                    <RangeControl
                        label={__('Number of Columns', 'wpzoom-portfolio')}
                        value={columns}
                        onChange={(value) => setAttributes({ columns: value })}
                        min={1}
                        max={6}
                        help={__('Choose how many columns to display in the gallery grid.', 'wpzoom-portfolio')}
                    />

                    <HorizontalRule />

                    <RangeControl
                        label={__('Gap Between Images', 'wpzoom-portfolio')}
                        value={gap}
                        onChange={(value) => setAttributes({ gap: value })}
                        min={0}
                        max={50}
                        help={__('Adjust the spacing between images in pixels.', 'wpzoom-portfolio')}
                    />

                    <HorizontalRule />

                    {/* Only show image height control when aspect ratio is "auto" AND layout is grid */}
                    {layout === 'grid' && aspectRatio === 'auto' && (
                        <RangeControl
                            label={__('Image Height', 'wpzoom-portfolio')}
                            value={imageSize}
                            onChange={(value) => setAttributes({ imageSize: value })}
                            min={100}
                            max={500}
                            help={__('Set the height of images in pixels.', 'wpzoom-portfolio')}
                        />
                    )}

                    {/* Only show aspect ratio control for grid layout */}
                    {layout === 'grid' && (
                        <SelectControl
                            label={__('Aspect Ratio', 'wpzoom-portfolio')}
                            value={aspectRatio}
                            onChange={(value) => setAttributes({ aspectRatio: value })}
                            options={[
                                { label: __('Auto (Original)', 'wpzoom-portfolio'), value: 'auto' },
                                { label: __('Square (1:1)', 'wpzoom-portfolio'), value: '1' },
                                { label: __('Landscape (16:9)', 'wpzoom-portfolio'), value: '1.777' },
                                { label: __('Landscape (4:3)', 'wpzoom-portfolio'), value: '1.333' },
                                { label: __('Portrait (3:4)', 'wpzoom-portfolio'), value: '0.75' },
                                { label: __('Portrait (9:16)', 'wpzoom-portfolio'), value: '0.5625' }
                            ]}
                            help={aspectRatio === 'auto' ?
                                __('Choose the aspect ratio for all images. When set to "Auto", you can control image height manually.', 'wpzoom-portfolio') :
                                __('Choose the aspect ratio for all images. Image height will be automatically determined by the aspect ratio.', 'wpzoom-portfolio')}
                        />
                    )}

                    {/* Show info text for masonry layout */}
                    {layout === 'masonry' && (
                        <p style={{
                            fontStyle: 'italic',
                            color: '#666',
                            fontSize: '13px',
                            margin: '0 0 16px 0',
                            padding: '12px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '4px'
                        }}>
                            {__('In masonry layout, images maintain their natural dimensions for an organic flow.', 'wpzoom-portfolio')}
                        </p>
                    )}

                    <HorizontalRule />

                    {/* Border Radius Control */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center', 
                        gap: '10px',
                        marginBottom: '16px'
                    }}>
                        <div style={{ flex: '1' }}>
                            <RangeControl
                                label={__('Border Radius', 'wpzoom-portfolio')}
                                value={borderRadius}
                                onChange={(value) => setAttributes({ borderRadius: value })}
                                min={0}
                                max={100}
                                help={__('Adjust the roundness of image corners.', 'wpzoom-portfolio')}
                            />
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <SelectControl
                                value={borderRadiusUnit}
                                onChange={(value) => setAttributes({ borderRadiusUnit: value })}
                                options={[
                                    { label: 'px', value: 'px' },
                                    { label: '%', value: '%' }
                                ]}
                                style={{ minWidth: '60px' }}
                            />
                        </div>
                    </div>
                </PanelBody>

                <PanelBody
                    icon={settingsIcon}
                    title={__('Other Settings', 'wpzoom-portfolio')}
                    initialOpen={false}
                    className="wpzb-settings-panel"
                >
                    <SelectControl
                        label={__('Hover Effect', 'wpzoom-portfolio')}
                        value={hoverEffect}
                        onChange={(value) => setAttributes({ hoverEffect: value })}
                        options={[
                            { label: __('Scale Up', 'wpzoom-portfolio'), value: 'scale-up' },
                            { label: __('Scale Down', 'wpzoom-portfolio'), value: 'scale-down' },
                            { label: __('Grayscale to Color', 'wpzoom-portfolio'), value: 'grayscale' },
                            { label: __('Blur to Sharp', 'wpzoom-portfolio'), value: 'blur' },
                            { label: __('Shadow', 'wpzoom-portfolio'), value: 'shadow' },
                            { label: __('Scale Up + Shadow', 'wpzoom-portfolio'), value: 'scale-shadow' },
                            { label: __('Overlay + Caption', 'wpzoom-portfolio'), value: 'overlay-caption' }
                        ]}
                        help={__('Choose the hover animation effect for gallery images.', 'wpzoom-portfolio')}
                    />

                    <HorizontalRule />

                    <ToggleControl
                        label={__('Enable Lightbox', 'wpzoom-portfolio')}
                        checked={enableLightbox}
                        onChange={(value) => setAttributes({ enableLightbox: value })}
                    />

                    {enableLightbox && (
                        <ToggleControl
                            label={__('Show Captions in Lightbox', 'wpzoom-portfolio')}
                            checked={showCaptions}
                            onChange={(value) => setAttributes({ showCaptions: value })}
                        />
                    )}
                </PanelBody>
            </InspectorControls>

            <InspectorControls group="styles">
                <PanelBody
                    title={__('Colors', 'wpzoom-portfolio')}
                    initialOpen={false}
                    className="wpzb-settings-panel"
                >
                    <p>{__('Color customizations will be available in a future version.', 'wpzoom-portfolio')}</p>
                </PanelBody>
            </InspectorControls>

            {/* Block Content - Image Grid */}
            <div className="wpzoom-image-gallery-block">
                {images.length === 0 ? (
                    <div className="wpzoom-gallery-empty-state">
                        {__('No images selected. Use the block settings to add images.', 'wpzoom-portfolio')}
                    </div>
                ) : (
                        <div
                            className={`wpzoom-gallery-grid wpzoom-gallery-${layout} columns-${columns}`}
                            style={layout === 'masonry' ? { columnGap: gap + 'px' } : { gap: gap + 'px' }}
                        >
                        {images.map((image) => (
                            <div
                                key={image.id}
                                className={`wpzoom-gallery-item hover-${hoverEffect}${enableLightbox ? ' lightbox-enabled' : ''}`}
                                style={layout === 'masonry' ? { marginBottom: gap + 'px' } : {}}
                            >
                                <img src={image.url} alt={image.alt} style={getImageStyles()} />
                                {enableLightbox && (
                                    <div 
                                        className="wpzoom-lightbox-overlay"
                                        style={{ borderRadius: borderRadius + borderRadiusUnit }}
                                    >
                                    </div>
                                )}
                                {hoverEffect === 'overlay-caption' && (
                                    <div
                                        className="wpzoom-caption-overlay"
                                        style={{ borderRadius: `0 0 ${borderRadius}${borderRadiusUnit} ${borderRadius}${borderRadiusUnit}` }}
                                    >
                                        {image.caption || image.alt || __('Image', 'wpzoom-portfolio')}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

const Save = ({ attributes }) => {
    const {
        images, 
        layout,
        columns,
        gap,
        imageSize,
        aspectRatio,
        borderRadius,
        borderRadiusUnit,
        hoverEffect,
        enableLightbox,
        showCaptions 
    } = attributes;

    if (images.length === 0) {
        return null;
    }

    // Calculate image styles based on aspect ratio and size
    const getImageStyles = () => {
        const baseStyles = {
            width: '100%',
            borderRadius: borderRadius + borderRadiusUnit,
            objectFit: 'cover'
        };

        // For masonry layout, let images keep their natural dimensions
        if (layout === 'masonry') {
            return baseStyles;
        }

        // For grid layout, apply height and aspect ratio controls
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

    return (
        <div className={`wpzoom-image-gallery-block${enableLightbox ? ' use-lightbox' : ''}`}>
            <div
                className={`wpzoom-gallery-grid wpzoom-gallery-${layout} columns-${columns}`}
                style={layout === 'masonry' ? { columnGap: gap + 'px' } : { gap: gap + 'px' }}
            >
                {images.map((image) => {
                    const imageElement = (
                        <img src={image.url} alt={image.alt} style={getImageStyles()} />
                    );

                    if (enableLightbox) {
                        return (
                            <div
                                key={image.id}
                                className={`wpzoom-gallery-item hover-${hoverEffect}`}
                                style={layout === 'masonry' ? { marginBottom: gap + 'px' } : {}}
                            >
                                <a
                                    href={image.fullUrl}
                                    className="wpzoom-lightbox-link"
                                    data-title={showCaptions ? image.caption : ''}
                                    data-lightbox="wpzoom-gallery"
                                >
                                    {imageElement}
                                </a>
                                {hoverEffect === 'overlay-caption' && (
                                    <div
                                        className="wpzoom-caption-overlay"
                                        style={{ borderRadius: `0 0 ${borderRadius}${borderRadiusUnit} ${borderRadius}${borderRadiusUnit}` }}
                                    >
                                        {image.caption || image.alt || 'Image'}
                                    </div>
                                )}
                            </div>
                        );
                    } else {
                        return (
                            <div
                                key={image.id}
                                className={`wpzoom-gallery-item hover-${hoverEffect}`}
                                style={layout === 'masonry' ? { marginBottom: gap + 'px' } : {}}
                            >
                                {imageElement}
                                {hoverEffect === 'overlay-caption' && (
                                    <div
                                        className="wpzoom-caption-overlay"
                                        style={{ borderRadius: `0 0 ${borderRadius}${borderRadiusUnit} ${borderRadius}${borderRadiusUnit}` }}
                                    >
                                        {image.caption || image.alt || 'Image'}
                                    </div>
                                )}
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
};

registerBlockType('wpzoom-blocks/image-gallery', {
    title: __('Image Gallery', 'wpzoom-portfolio'),
    description: __('A simple image gallery block.', 'wpzoom-portfolio'),
    icon: 'format-gallery',
    category: 'wpzoom-blocks',
    attributes: {
        images: {
            type: 'array',
            default: []
        },
        layout: {
            type: 'string',
            default: 'grid'
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
            default: 0
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
    edit: Edit,
    save: Save
});