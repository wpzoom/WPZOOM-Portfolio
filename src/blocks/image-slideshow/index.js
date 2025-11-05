import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import {
    InspectorControls,
    MediaUpload,
    MediaUploadCheck
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

import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

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

const Edit = ({ attributes, setAttributes, clientId }) => {
    const {
        images,
        // Slideshow Settings
        autoplay,
        autoplaySpeed,
        transitionSpeed,
        infiniteLoop,
        pauseOnHover,
        // Navigation Settings
        showArrows,
        arrowStyle,
        showDots,
        dotsPosition,
        // Display Settings
        slidesToShow,
        slidesToShowTablet,
        slidesToShowMobile,
        slideHeight,
        imageFit,
        // Other Settings
        enableLightbox,
        // Style Settings
        borderRadius,
        borderRadiusUnit,
        arrowColor,
        arrowBackground,
        dotColor,
        dotActiveColor
    } = attributes;

    const onSelectImages = (selectedImages) => {
        const imageData = selectedImages.map(img => ({
            id: img.id,
            url: img.url,
            alt: img.alt || '',
            caption: img.caption || ''
        }));
        setAttributes({ images: imageData });
    };

    const getSlideStyles = () => {
        const styles = {
            borderRadius: borderRadius + borderRadiusUnit
        };

        if (slideHeight === 'fixed') {
            styles.height = '400px';
        }

        return styles;
    };

    const getImageStyles = () => {
        const styles = {
            width: '100%',
            borderRadius: borderRadius + borderRadiusUnit
        };

        if (slideHeight === 'fixed') {
            styles.height = '400px';
            styles.objectFit = imageFit;
        } else {
            styles.height = 'auto';
        }

        return styles;
    };

    // Reference for Swiper instance
    const swiperRef = useRef(null);
    const containerRef = useRef(null);

    // Initialize Swiper in the editor
    useEffect(() => {
        if (!containerRef.current || images.length === 0) return;

        // Destroy existing instance
        if (swiperRef.current) {
            swiperRef.current.destroy(true, true);
        }

        // Small delay to ensure DOM is ready
        setTimeout(() => {
            if (!containerRef.current) return;

            swiperRef.current = new Swiper(containerRef.current, {
                modules: [Navigation, Pagination, Autoplay],
                slidesPerView: slidesToShow,
                spaceBetween: 15,
                loop: infiniteLoop && images.length > slidesToShow,
                speed: transitionSpeed,
                autoplay: autoplay ? {
                    delay: autoplaySpeed,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: pauseOnHover
                } : false,
                navigation: showArrows ? {
                    nextEl: '.editor-swiper-button-next',
                    prevEl: '.editor-swiper-button-prev',
                } : false,
                pagination: showDots ? {
                    el: '.editor-swiper-pagination',
                    clickable: true,
                } : false,
                on: {
                    init: function() {
                        // Apply custom colors after init
                        applyEditorCustomColors();
                    }
                }
            });
        }, 100);

        // Cleanup
        return () => {
            if (swiperRef.current) {
                swiperRef.current.destroy(true, true);
                swiperRef.current = null;
            }
        };
    }, [images, slidesToShow, infiniteLoop, transitionSpeed, autoplay, autoplaySpeed, pauseOnHover, showArrows, showDots, dotsPosition]);

    // Apply custom colors
    const applyEditorCustomColors = () => {
        if (!containerRef.current) return;

        const prevArrow = containerRef.current.querySelector('.editor-swiper-button-prev');
        const nextArrow = containerRef.current.querySelector('.editor-swiper-button-next');

        if (prevArrow && nextArrow && showArrows) {
            prevArrow.style.color = arrowColor;
            nextArrow.style.color = arrowColor;
            
            if (arrowStyle !== 'default') {
                prevArrow.style.backgroundColor = arrowBackground;
                nextArrow.style.backgroundColor = arrowBackground;
            }
        }
    };

    // Re-apply colors when they change
    useEffect(() => {
        applyEditorCustomColors();
    }, [arrowColor, arrowBackground, arrowStyle, dotColor, dotActiveColor]);

    return (
        <>
            <InspectorControls group="settings">
                <PanelBody
                    icon={fieldsIcon}
                    title={__('Slideshow Content', 'wpzoom-portfolio')}
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
                                        __(`Edit Slideshow (${images.length} images)`, 'wpzoom-portfolio')
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
                    icon={settingsIcon}
                    title={__('Slideshow Settings', 'wpzoom-portfolio')}
                    initialOpen={false}
                    className="wpzb-settings-panel"
                >
                    <ToggleControl
                        label={__('Autoplay', 'wpzoom-portfolio')}
                        checked={autoplay}
                        onChange={(value) => setAttributes({ autoplay: value })}
                        help={__('Automatically advance slides.', 'wpzoom-portfolio')}
                    />

                    {autoplay && (
                        <>
                            <HorizontalRule />
                            <RangeControl
                                label={__('Autoplay Speed (ms)', 'wpzoom-portfolio')}
                                value={autoplaySpeed}
                                onChange={(value) => setAttributes({ autoplaySpeed: value })}
                                min={1000}
                                max={10000}
                                step={500}
                                help={__('Time between slide transitions.', 'wpzoom-portfolio')}
                            />
                        </>
                    )}

                    <HorizontalRule />

                    <RangeControl
                        label={__('Transition Speed (ms)', 'wpzoom-portfolio')}
                        value={transitionSpeed}
                        onChange={(value) => setAttributes({ transitionSpeed: value })}
                        min={200}
                        max={2000}
                        step={100}
                        help={__('Speed of slide transitions.', 'wpzoom-portfolio')}
                    />

                    <HorizontalRule />

                    <ToggleControl
                        label={__('Infinite Loop', 'wpzoom-portfolio')}
                        checked={infiniteLoop}
                        onChange={(value) => setAttributes({ infiniteLoop: value })}
                        help={__('Loop back to the first slide after the last one.', 'wpzoom-portfolio')}
                    />

                    <HorizontalRule />

                    <ToggleControl
                        label={__('Pause on Hover', 'wpzoom-portfolio')}
                        checked={pauseOnHover}
                        onChange={(value) => setAttributes({ pauseOnHover: value })}
                        help={__('Pause autoplay when hovering over slides.', 'wpzoom-portfolio')}
                    />
                </PanelBody>

                <PanelBody
                    icon={layoutIcon}
                    title={__('Navigation Settings', 'wpzoom-portfolio')}
                    initialOpen={false}
                    className="wpzb-settings-panel"
                >
                    <ToggleControl
                        label={__('Show Navigation Arrows', 'wpzoom-portfolio')}
                        checked={showArrows}
                        onChange={(value) => setAttributes({ showArrows: value })}
                    />

                    {showArrows && (
                        <>
                            <HorizontalRule />
                            <SelectControl
                                label={__('Arrow Style', 'wpzoom-portfolio')}
                                value={arrowStyle}
                                onChange={(value) => setAttributes({ arrowStyle: value })}
                                options={[
                                    { label: __('Default', 'wpzoom-portfolio'), value: 'default' },
                                    { label: __('Circle', 'wpzoom-portfolio'), value: 'circle' },
                                    { label: __('Square', 'wpzoom-portfolio'), value: 'square' }
                                ]}
                            />
                        </>
                    )}

                    <HorizontalRule />

                    <ToggleControl
                        label={__('Show Dots', 'wpzoom-portfolio')}
                        checked={showDots}
                        onChange={(value) => setAttributes({ showDots: value })}
                    />

                    {showDots && (
                        <>
                            <HorizontalRule />
                            <SelectControl
                                label={__('Dots Position', 'wpzoom-portfolio')}
                                value={dotsPosition}
                                onChange={(value) => setAttributes({ dotsPosition: value })}
                                options={[
                                    { label: __('Bottom', 'wpzoom-portfolio'), value: 'bottom' },
                                    { label: __('Top', 'wpzoom-portfolio'), value: 'top' }
                                ]}
                            />
                        </>
                    )}
                </PanelBody>

                <PanelBody
                    icon={layoutIcon}
                    title={__('Display Settings', 'wpzoom-portfolio')}
                    initialOpen={false}
                    className="wpzb-settings-panel"
                >
                    <RangeControl
                        label={__('Slides to Show (Desktop)', 'wpzoom-portfolio')}
                        value={slidesToShow}
                        onChange={(value) => setAttributes({ slidesToShow: value })}
                        min={1}
                        max={4}
                        help={__('Number of slides visible at once on desktop.', 'wpzoom-portfolio')}
                    />

                    <HorizontalRule />

                    <RangeControl
                        label={__('Slides to Show (Tablet)', 'wpzoom-portfolio')}
                        value={slidesToShowTablet}
                        onChange={(value) => setAttributes({ slidesToShowTablet: value })}
                        min={1}
                        max={3}
                        help={__('Number of slides visible at once on tablets.', 'wpzoom-portfolio')}
                    />

                    <HorizontalRule />

                    <RangeControl
                        label={__('Slides to Show (Mobile)', 'wpzoom-portfolio')}
                        value={slidesToShowMobile}
                        onChange={(value) => setAttributes({ slidesToShowMobile: value })}
                        min={1}
                        max={2}
                        help={__('Number of slides visible at once on mobile.', 'wpzoom-portfolio')}
                    />

                    <HorizontalRule />

                    <SelectControl
                        label={__('Slide Height', 'wpzoom-portfolio')}
                        value={slideHeight}
                        onChange={(value) => setAttributes({ slideHeight: value })}
                        options={[
                            { label: __('Auto (Original)', 'wpzoom-portfolio'), value: 'auto' },
                            { label: __('Fixed Height', 'wpzoom-portfolio'), value: 'fixed' }
                        ]}
                        help={slideHeight === 'auto' ?
                            __('Slides adapt to image heights.', 'wpzoom-portfolio') :
                            __('All slides have the same fixed height.', 'wpzoom-portfolio')
                        }
                    />

                    {slideHeight === 'fixed' && (
                        <>
                            <HorizontalRule />
                            <SelectControl
                                label={__('Image Fit', 'wpzoom-portfolio')}
                                value={imageFit}
                                onChange={(value) => setAttributes({ imageFit: value })}
                                options={[
                                    { label: __('Cover (Fill)', 'wpzoom-portfolio'), value: 'cover' },
                                    { label: __('Contain (Fit)', 'wpzoom-portfolio'), value: 'contain' }
                                ]}
                                help={imageFit === 'cover' ?
                                    __('Images will fill the space and may be cropped.', 'wpzoom-portfolio') :
                                    __('Images will fit within the space without cropping.', 'wpzoom-portfolio')
                                }
                            />
                        </>
                    )}
                </PanelBody>

                <PanelBody
                    icon={settingsIcon}
                    title={__('Other Settings', 'wpzoom-portfolio')}
                    initialOpen={false}
                    className="wpzb-settings-panel"
                >
                    <ToggleControl
                        label={__('Enable Lightbox', 'wpzoom-portfolio')}
                        checked={enableLightbox}
                        onChange={(value) => setAttributes({ enableLightbox: value })}
                        help={__('Open images in lightbox when clicked.', 'wpzoom-portfolio')}
                    />
                </PanelBody>
            </InspectorControls>

            <InspectorControls group="styles">
                <PanelBody
                    title={__('Slide Styling', 'wpzoom-portfolio')}
                    initialOpen={true}
                    className="wpzb-settings-panel"
                >
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
                                help={__('Adjust the roundness of slide corners.', 'wpzoom-portfolio')}
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

                {showArrows && (
                    <PanelBody
                        title={__('Arrow Styling', 'wpzoom-portfolio')}
                        initialOpen={false}
                        className="wpzb-settings-panel"
                    >
                        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#757575' }}>
                            {__('Arrow Color', 'wpzoom-portfolio')}
                        </p>
                        <input
                            type="color"
                            value={arrowColor}
                            onChange={(e) => setAttributes({ arrowColor: e.target.value })}
                            style={{ width: '100%', height: '40px', cursor: 'pointer', marginBottom: '16px' }}
                        />

                        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#757575' }}>
                            {__('Arrow Background', 'wpzoom-portfolio')}
                        </p>
                        <input
                            type="color"
                            value={arrowBackground}
                            onChange={(e) => setAttributes({ arrowBackground: e.target.value })}
                            style={{ width: '100%', height: '40px', cursor: 'pointer' }}
                        />
                    </PanelBody>
                )}

                {showDots && (
                    <PanelBody
                        title={__('Dot Styling', 'wpzoom-portfolio')}
                        initialOpen={false}
                        className="wpzb-settings-panel"
                    >
                        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#757575' }}>
                            {__('Dot Color', 'wpzoom-portfolio')}
                        </p>
                        <input
                            type="color"
                            value={dotColor}
                            onChange={(e) => setAttributes({ dotColor: e.target.value })}
                            style={{ width: '100%', height: '40px', cursor: 'pointer', marginBottom: '16px' }}
                        />

                        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#757575' }}>
                            {__('Active Dot Color', 'wpzoom-portfolio')}
                        </p>
                        <input
                            type="color"
                            value={dotActiveColor}
                            onChange={(e) => setAttributes({ dotActiveColor: e.target.value })}
                            style={{ width: '100%', height: '40px', cursor: 'pointer' }}
                        />
                    </PanelBody>
                )}
            </InspectorControls>

            <div className="wpzoom-image-slideshow-block">
                {images.length === 0 ? (
                    <div className="wpzoom-slideshow-empty-state">
                        {__('No images selected. Use the block settings to add images to your slideshow.', 'wpzoom-portfolio')}
                    </div>
                ) : (
                    <div className="wpzoom-slideshow-editor-preview">
                        <div 
                            ref={containerRef}
                            className={`swiper wpzoom-slideshow-container arrow-style-${arrowStyle} dots-position-${dotsPosition}`}
                        >
                            <div className="swiper-wrapper">
                                {images.map((image) => (
                                    <div key={image.id} className="swiper-slide">
                                        <img
                                            src={image.url}
                                            alt={image.alt}
                                            style={getImageStyles()}
                                        />
                                    </div>
                                ))}
                            </div>

                            {showArrows && (
                                <>
                                    <div className="swiper-button-prev editor-swiper-button-prev"></div>
                                    <div className="swiper-button-next editor-swiper-button-next"></div>
                                </>
                            )}

                            {showDots && (
                                <div className="swiper-pagination editor-swiper-pagination"></div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

const Save = ({ attributes }) => {
    const {
        images,
        autoplay,
        autoplaySpeed,
        transitionSpeed,
        infiniteLoop,
        pauseOnHover,
        showArrows,
        arrowStyle,
        showDots,
        dotsPosition,
        slidesToShow,
        slidesToShowTablet,
        slidesToShowMobile,
        slideHeight,
        imageFit,
        enableLightbox,
        borderRadius,
        borderRadiusUnit,
        arrowColor,
        arrowBackground,
        dotColor,
        dotActiveColor
    } = attributes;

    if (images.length === 0) {
        return null;
    }

    const slideshowSettings = {
        autoplay,
        autoplaySpeed,
        transitionSpeed,
        infiniteLoop,
        pauseOnHover,
        showArrows,
        arrowStyle,
        showDots,
        dotsPosition,
        slidesToShow,
        slidesToShowTablet,
        slidesToShowMobile,
        slideHeight,
        imageFit,
        borderRadius: borderRadius + borderRadiusUnit,
        arrowColor,
        arrowBackground,
        dotColor,
        dotActiveColor
    };

    const getImageStyles = () => {
        const styles = {
            width: '100%',
            borderRadius: borderRadius + borderRadiusUnit
        };

        if (slideHeight === 'fixed') {
            styles.height = '400px';
            styles.objectFit = imageFit;
        }

        return styles;
    };

    return (
        <div
            className={`wpzoom-image-slideshow-block${enableLightbox ? ' use-lightbox' : ''} arrow-style-${arrowStyle} dots-position-${dotsPosition}`}
            data-slideshow-settings={JSON.stringify(slideshowSettings)}
        >
            <div className="swiper wpzoom-slideshow-container">
                <div className="swiper-wrapper">
                    {images.map((image) => {
                        const slideContent = (
                            <img
                                src={image.url}
                                alt={image.alt}
                                style={getImageStyles()}
                                loading="lazy"
                            />
                        );

                        return (
                            <div key={image.id} className="swiper-slide">
                                {enableLightbox ? (
                                    <a
                                        href={image.url}
                                        className="wpzoom-lightbox-link"
                                        data-lightbox="wpzoom-slideshow"
                                    >
                                        {slideContent}
                                    </a>
                                ) : (
                                    slideContent
                                )}
                            </div>
                        );
                    })}
                </div>

                {showArrows && (
                    <>
                        <div className="swiper-button-prev"></div>
                        <div className="swiper-button-next"></div>
                    </>
                )}

                {showDots && (
                    <div className="swiper-pagination"></div>
                )}
            </div>
        </div>
    );
};

registerBlockType('wpzoom-blocks/image-slideshow', {
    title: __('Image Slideshow', 'wpzoom-portfolio'),
    description: __('Display images in a beautiful, responsive slideshow with autoplay and navigation.', 'wpzoom-portfolio'),
    icon: 'images-alt2',
    category: 'wpzoom-blocks',
    attributes: {
        images: {
            type: 'array',
            default: []
        },
        // Slideshow Settings
        autoplay: {
            type: 'boolean',
            default: true
        },
        autoplaySpeed: {
            type: 'number',
            default: 3000
        },
        transitionSpeed: {
            type: 'number',
            default: 600
        },
        infiniteLoop: {
            type: 'boolean',
            default: true
        },
        pauseOnHover: {
            type: 'boolean',
            default: true
        },
        // Navigation Settings
        showArrows: {
            type: 'boolean',
            default: true
        },
        arrowStyle: {
            type: 'string',
            default: 'default'
        },
        showDots: {
            type: 'boolean',
            default: true
        },
        dotsPosition: {
            type: 'string',
            default: 'bottom'
        },
        // Display Settings
        slidesToShow: {
            type: 'number',
            default: 1
        },
        slidesToShowTablet: {
            type: 'number',
            default: 1
        },
        slidesToShowMobile: {
            type: 'number',
            default: 1
        },
        slideHeight: {
            type: 'string',
            default: 'auto'
        },
        imageFit: {
            type: 'string',
            default: 'cover'
        },
        // Other Settings
        enableLightbox: {
            type: 'boolean',
            default: true
        },
        // Style Settings
        borderRadius: {
            type: 'number',
            default: 0
        },
        borderRadiusUnit: {
            type: 'string',
            default: 'px'
        },
        arrowColor: {
            type: 'string',
            default: '#ffffff'
        },
        arrowBackground: {
            type: 'string',
            default: '#000000'
        },
        dotColor: {
            type: 'string',
            default: '#cccccc'
        },
        dotActiveColor: {
            type: 'string',
            default: '#000000'
        }
    },
    edit: Edit,
    save: Save
});

