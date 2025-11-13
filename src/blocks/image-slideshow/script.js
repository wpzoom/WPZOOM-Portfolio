/**
 * Frontend JavaScript for Image Slideshow Block
 * Initializes Swiper sliders with custom settings
 */

import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, Keyboard, A11y } from 'swiper/modules';

document.addEventListener('DOMContentLoaded', function () {
    const slideshowBlocks = document.querySelectorAll('.wpzoom-image-slideshow-block');

    slideshowBlocks.forEach((block) => {
        const container = block.querySelector('.wpzoom-slideshow-container');
        
        if (!container) return;

        // Get settings from data attribute
        const settingsAttr = block.getAttribute('data-slideshow-settings');
        
        if (!settingsAttr) return;

        const settings = JSON.parse(settingsAttr);

        // Build Swiper configuration
        const swiperConfig = {
            // Modules
            modules: [Navigation, Pagination, Autoplay, Keyboard, A11y],
            
            // Core settings
            loop: settings.infiniteLoop,
            speed: settings.transitionSpeed,
            slidesPerView: settings.slidesToShow,
            spaceBetween: settings.spaceBetween,

            // Autoplay
            autoplay: settings.autoplay ? {
                delay: settings.scrollStyle === 'smooth' ? 0 : settings.autoplaySpeed,
                disableOnInteraction: false,
                pauseOnMouseEnter: settings.pauseOnHover,
                reverseDirection: settings.scrollDirection === 'right'
            } : false,

            // Navigation arrows
            navigation: settings.showArrows ? {
                nextEl: block.querySelector('.swiper-button-next'),
                prevEl: block.querySelector('.swiper-button-prev'),
            } : false,

            // Pagination dots
            pagination: settings.showDots ? {
                el: block.querySelector('.swiper-pagination'),
                clickable: true,
                dynamicBullets: false
            } : false,

            // Responsive breakpoints
            breakpoints: {
                // Mobile
                320: {
                    slidesPerView: settings.slidesToShowMobile,
                    spaceBetween: settings.spaceBetweenMobile
                },
                // Tablet
                768: {
                    slidesPerView: settings.slidesToShowTablet,
                    spaceBetween: settings.spaceBetweenTablet
                },
                // Desktop
                1024: {
                    slidesPerView: settings.slidesToShow,
                    spaceBetween: settings.spaceBetween
                }
            },

            // Accessibility
            a11y: {
                enabled: true,
                prevSlideMessage: 'Previous slide',
                nextSlideMessage: 'Next slide',
                paginationBulletMessage: 'Go to slide {{index}}'
            },

            // Lazy loading
            lazy: {
                loadPrevNext: true,
                loadPrevNextAmount: 2
            },

            // Keyboard control
            keyboard: {
                enabled: true,
                onlyInViewport: true
            },

            // Touch settings
            touchEventsTarget: 'container',
            simulateTouch: true,
            touchRatio: 1,
            touchAngle: 45,
            grabCursor: true,

            // Effect
            effect: 'slide',

            // CSS mode for better performance (optional)
            cssMode: false,

            // Watch for DOM updates
            observer: true,
            observeParents: true,
            observeSlideChildren: true
        };

        // Add smooth class for linear timing
        if (settings.scrollStyle === 'smooth') {
            container.classList.add('smooth-scroll');
        } else {
            container.classList.remove('smooth-scroll');
        }

        // Initialize Swiper
        const swiper = new Swiper(container, swiperConfig);

        // Apply custom arrow colors
        if (settings.showArrows) {
            const prevArrow = block.querySelector('.swiper-button-prev');
            const nextArrow = block.querySelector('.swiper-button-next');

            if (prevArrow && nextArrow) {
                prevArrow.style.color = settings.arrowColor;
                nextArrow.style.color = settings.arrowColor;
                
                // Apply background for circle/square styles
                if (settings.arrowStyle !== 'default') {
                    prevArrow.style.backgroundColor = settings.arrowBackground;
                    nextArrow.style.backgroundColor = settings.arrowBackground;
                }
            }
        }

        // Apply custom dot colors via CSS variables (simpler and scoping-safe)
        if (settings.showDots) {
            block.style.setProperty('--wpzoom-dot-color', settings.dotColor);
            block.style.setProperty('--wpzoom-dot-active-color', settings.dotActiveColor);
        }

        // Initialize lightbox if enabled
        if (block.classList.contains('use-lightbox')) {
            initializeLightbox(block);
        }
    });
});

/**
 * Initialize lightbox functionality
 * Uses the existing Magnific Popup library from the plugin
 */
function initializeLightbox(block) {
    // Check if Magnific Popup is available
    if (typeof jQuery !== 'undefined' && jQuery.fn.magnificPopup) {
        jQuery(block).find('.wpzoom-lightbox-link').magnificPopup({
            type: 'image',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1]
            },
            image: {
                titleSrc: function(item) {
                    return item.el.find('img').attr('alt') || '';
                },
                verticalFit: true
            },
            closeBtnInside: false,
            closeOnContentClick: true,
            mainClass: 'mfp-img-mobile mfp-with-zoom',
            zoom: {
                enabled: true,
                duration: 300
            },
            callbacks: {
                open: function() {
                    // Pause autoplay when lightbox opens
                    const swiper = block.querySelector('.wpzoom-slideshow-container').swiper;
                    if (swiper && swiper.autoplay) {
                        swiper.autoplay.stop();
                    }
                },
                close: function() {
                    // Resume autoplay when lightbox closes
                    const swiper = block.querySelector('.wpzoom-slideshow-container').swiper;
                    if (swiper && swiper.autoplay) {
                        swiper.autoplay.start();
                    }
                }
            }
        });
    }
}

