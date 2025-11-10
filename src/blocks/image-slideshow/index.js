import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useMemo } from '@wordpress/element';
import {
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    useBlockProps
} from '@wordpress/block-editor';
import { useDispatch } from '@wordpress/data';
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
        scrollStyle,
        scrollDirection,
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
        spaceBetween,
        spaceBetweenTablet,
        spaceBetweenMobile,
        slideHeight,
        fixedHeight,
        imageFit,
        // Other Settings
        enableLightbox,
        // Style Settings
        borderRadius,
        borderRadiusUnit,
        arrowColor,
        arrowBackground,
        dotColor,
        dotActiveColor,
        align
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
            styles.height = fixedHeight + 'px';
        }

        return styles;
    };

    const getImageStyles = () => {
        const styles = {
            width: '100%',
            borderRadius: borderRadius + borderRadiusUnit
        };

        if (slideHeight === 'fixed') {
            styles.height = fixedHeight + 'px';
            styles.objectFit = imageFit;
        } else {
            styles.height = 'auto';
        }

        return styles;
    };

    // Reference for Swiper instance
    const swiperRef = useRef(null);
    const containerRef = useRef(null);

    // Force full remount of Swiper container in editor when key settings change
    const editorSwiperKey = useMemo(() => (
        [
            images.length,
            slidesToShow,
            transitionSpeed,
            autoplay ? 1 : 0,
            autoplaySpeed,
            scrollStyle,
            scrollDirection,
            infiniteLoop ? 1 : 0,
            pauseOnHover ? 1 : 0,
            showArrows ? 1 : 0,
            showDots ? 1 : 0,
            dotsPosition,
            align || ''
        ].join('|')
    ), [images.length, slidesToShow, transitionSpeed, autoplay, autoplaySpeed, scrollStyle, scrollDirection, infiniteLoop, pauseOnHover, showArrows, showDots, dotsPosition, align]);

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

            // Toggle smooth class for linear timing
            if (scrollStyle === 'smooth') {
                containerRef.current.classList.add('smooth-scroll');
            } else {
                containerRef.current.classList.remove('smooth-scroll');
            }

            swiperRef.current = new Swiper(containerRef.current, {
                modules: [Navigation, Pagination, Autoplay],
                slidesPerView: slidesToShow,
                spaceBetween: spaceBetween,
                loop: infiniteLoop && images.length > slidesToShow,
                speed: transitionSpeed,
                autoplay: autoplay ? {
                    delay: scrollStyle === 'smooth' ? 0 : autoplaySpeed,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: pauseOnHover,
                    reverseDirection: scrollDirection === 'right'
                } : false,
                navigation: showArrows ? {
                    nextEl: '.editor-swiper-button-next',
                    prevEl: '.editor-swiper-button-prev',
                } : false,
                pagination: showDots ? {
                    el: '.editor-swiper-pagination',
                    clickable: true,
                } : false,
                breakpoints: {
                    320: { spaceBetween: spaceBetweenMobile },
                    768: { spaceBetween: spaceBetweenTablet },
                    1024: { spaceBetween: spaceBetween }
                },
                observer: true,
                observeParents: true,
                observeSlideChildren: true,
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
    }, [images, slidesToShow, infiniteLoop, transitionSpeed, autoplay, autoplaySpeed, scrollStyle, scrollDirection, pauseOnHover, showArrows, showDots, dotsPosition, spaceBetween, spaceBetweenTablet, spaceBetweenMobile, align]);

    // Apply custom colors
    const applyEditorCustomColors = () => {
        if (!containerRef.current) return;

        const prevArrow = containerRef.current.querySelector('.editor-swiper-button-prev');
        const nextArrow = containerRef.current.querySelector('.editor-swiper-button-next');
        const paginationEl = containerRef.current.querySelector('.editor-swiper-pagination');

        if (prevArrow && nextArrow && showArrows) {
            prevArrow.style.color = arrowColor;
            nextArrow.style.color = arrowColor;
            
            if (arrowStyle !== 'default') {
                prevArrow.style.backgroundColor = arrowBackground;
                nextArrow.style.backgroundColor = arrowBackground;
            }
        }

        // Set CSS variables for dots colors in editor
        if (paginationEl && showDots) {
            containerRef.current.style.setProperty('--wpzoom-dot-color', dotColor);
            containerRef.current.style.setProperty('--wpzoom-dot-active-color', dotActiveColor);
        }
    };

    // Re-apply colors when they change
    useEffect(() => {
        applyEditorCustomColors();
    }, [arrowColor, arrowBackground, arrowStyle, dotColor, dotActiveColor]);

    const { selectBlock } = useDispatch('core/block-editor');

    const blockProps = useBlockProps({
        className: `wpzoom-image-slideshow-block arrow-style-${arrowStyle} dots-position-${dotsPosition} scroll-style-${scrollStyle} scroll-direction-${scrollDirection}`,
        onMouseDownCapture: () => selectBlock(clientId),
        onClick: (e) => e.stopPropagation()
    });

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
                            <SelectControl
                                label={__('Scroll Style', 'wpzoom-portfolio')}
                                value={scrollStyle}
                                onChange={(value) => setAttributes({ scrollStyle: value })}
                                options={[
                                    { label: __('Default (pause between slides)', 'wpzoom-portfolio'), value: 'default' },
                                    { label: __('Smooth (continuous scroll)', 'wpzoom-portfolio'), value: 'smooth' }
                                ]}
                                help={__('Choose between stepped or continuous scrolling.', 'wpzoom-portfolio')}
                            />

                            <HorizontalRule />
                            <RadioControl
                                label={__('Scroll Direction', 'wpzoom-portfolio')}
                                selected={scrollDirection}
                                options={[
                                    { label: __('Left', 'wpzoom-portfolio'), value: 'left' },
                                    { label: __('Right', 'wpzoom-portfolio'), value: 'right' }
                                ]}
                                onChange={(value) => setAttributes({ scrollDirection: value })}
                                help={__('Direction of automatic scrolling.', 'wpzoom-portfolio')}
                            />

                            {scrollStyle !== 'smooth' && (
                                <>
                                    <HorizontalRule />
                                    <RangeControl
                                        label={__('Autoplay Delay (ms)', 'wpzoom-portfolio')}
                                        value={autoplaySpeed}
                                        onChange={(value) => setAttributes({ autoplaySpeed: value })}
                                        min={1000}
                                        max={10000}
                                        step={500}
                                        help={__('Time between slide transitions.', 'wpzoom-portfolio')}
                                    />
                                </>
                            )}
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
                    <p style={{ margin: '6px 0 8px', fontWeight: 600, fontSize: '12px' }}>{__('Desktop', 'wpzoom-portfolio')}</p>
                    <RangeControl
                        label={__('Slides to Show', 'wpzoom-portfolio')}
                        value={slidesToShow}
                        onChange={(value) => setAttributes({ slidesToShow: value })}
                        min={1}
                        max={4}
                    />

                    <RangeControl
                        label={__('Spacing', 'wpzoom-portfolio')}
                        value={spaceBetween}
                        onChange={(value) => setAttributes({ spaceBetween: value })}
                        min={0}
                        max={100}
                        step={1}
                    />

                    <HorizontalRule />

                    <p style={{ margin: '6px 0 8px', fontWeight: 600, fontSize: '12px' }}>{__('Tablet', 'wpzoom-portfolio')}</p>
                    <RangeControl
                        label={__('Slides to Show', 'wpzoom-portfolio')}
                        value={slidesToShowTablet}
                        onChange={(value) => setAttributes({ slidesToShowTablet: value })}
                        min={1}
                        max={3}
                    />

                    <RangeControl
                        label={__('Spacing', 'wpzoom-portfolio')}
                        value={spaceBetweenTablet}
                        onChange={(value) => setAttributes({ spaceBetweenTablet: value })}
                        min={0}
                        max={100}
                        step={1}
                    />

                    <HorizontalRule />

                    <p style={{ margin: '6px 0 8px', fontWeight: 600, fontSize: '12px' }}>{__('Mobile', 'wpzoom-portfolio')}</p>
                    <RangeControl
                        label={__('Slides to Show', 'wpzoom-portfolio')}
                        value={slidesToShowMobile}
                        onChange={(value) => setAttributes({ slidesToShowMobile: value })}
                        min={1}
                        max={2}
                    />

                    <RangeControl
                        label={__('Spacing', 'wpzoom-portfolio')}
                        value={spaceBetweenMobile}
                        onChange={(value) => setAttributes({ spaceBetweenMobile: value })}
                        min={0}
                        max={60}
                        step={1}
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
                            <RangeControl
                                label={__('Fixed Height (px)', 'wpzoom-portfolio')}
                                value={fixedHeight}
                                onChange={(value) => setAttributes({ fixedHeight: value })}
                                min={200}
                                max={1200}
                                step={10}
                                help={__('Set the height for all slides in pixels.', 'wpzoom-portfolio')}
                            />
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

            <div {...blockProps}>
                {images.length === 0 ? (
                    <div className="wpzoom-slideshow-empty-state">
                        <div className="wpzoom-slideshow-empty-header">
                            <span className="dashicons dashicons-images-alt2"></span>
                            <h3 className="wpzoom-slideshow-empty-title">
                                {__('Image Slideshow', 'wpzoom-portfolio')}
                            </h3>
                        </div>
                        <p className="wpzoom-slideshow-empty-description">
                            {__('Add images to create a slideshow', 'wpzoom-portfolio')}
                        </p>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={onSelectImages}
                                allowedTypes={['image']}
                                multiple
                                gallery
                                value={images.map(img => img.id)}
                                render={({ open }) => (
                                    <Button
                                        onClick={open}
                                        variant="primary"
                                        className="wpzoom-slideshow-empty-button"
                                    >
                                        {__('Add Images', 'wpzoom-portfolio')}
                                    </Button>
                                )}
                            />
                        </MediaUploadCheck>
                    </div>
                ) : (
                        <div
                            key={editorSwiperKey}
                            ref={containerRef}
                            className="swiper wpzoom-slideshow-container"
                            style={{ pointerEvents: 'none' }}
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
                                <div style={{ pointerEvents: 'auto' }}>
                                    <div className="swiper-button-prev editor-swiper-button-prev"></div>
                                    <div className="swiper-button-next editor-swiper-button-next"></div>
                                </div>
                            )}

                            {showDots && (
                                <div className="swiper-pagination editor-swiper-pagination" style={{ pointerEvents: 'auto' }}></div>
                            )}
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
        scrollStyle,
        scrollDirection,
        infiniteLoop,
        pauseOnHover,
        showArrows,
        arrowStyle,
        showDots,
        dotsPosition,
        slidesToShow,
        slidesToShowTablet,
        slidesToShowMobile,
        spaceBetween,
        spaceBetweenTablet,
        spaceBetweenMobile,
        slideHeight,
        fixedHeight,
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
        scrollStyle,
        scrollDirection,
        infiniteLoop,
        pauseOnHover,
        showArrows,
        arrowStyle,
        showDots,
        dotsPosition,
        slidesToShow,
        slidesToShowTablet,
        slidesToShowMobile,
        spaceBetween,
        spaceBetweenTablet,
        spaceBetweenMobile,
        slideHeight,
        fixedHeight,
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
            borderRadius: borderRadius + borderRadiusUnit,
            display: 'block'
        };

        if (slideHeight === 'fixed') {
            styles.height = fixedHeight + 'px';
            styles.objectFit = imageFit;
        } else {
            styles.height = 'auto';
        }

        return styles;
    };

    const blockProps = useBlockProps.save({
        className: `wpzoom-image-slideshow-block${enableLightbox ? ' use-lightbox' : ''} arrow-style-${arrowStyle} dots-position-${dotsPosition} scroll-style-${scrollStyle} scroll-direction-${scrollDirection}`
    });

    return (
        <div
            {...blockProps}
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
    supports: {
        align: ['left', 'center', 'right', 'wide', 'full']
    },
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
        scrollStyle: {
            type: 'string',
            default: 'default'
        },
        scrollDirection: {
            type: 'string',
            default: 'left'
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
        spaceBetween: {
            type: 'number',
            default: 15
        },
        spaceBetweenTablet: {
            type: 'number',
            default: 15
        },
        spaceBetweenMobile: {
            type: 'number',
            default: 10
        },
        slideHeight: {
            type: 'string',
            default: 'fixed'
        },
        fixedHeight: {
            type: 'number',
            default: 650
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

