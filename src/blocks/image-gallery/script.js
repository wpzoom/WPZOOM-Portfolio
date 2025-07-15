/**
 * Initialize PhotoSwipe for WPZOOM Image Gallery blocks
 */
(function () {
    'use strict';
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        initializePhotoSwipe();
    });
    
    // Also initialize after dynamic content changes (for editor preview and AJAX)
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) { // Element node
                        const galleries = node.querySelectorAll ? node.querySelectorAll('.wpzoom-image-gallery-block.use-photoswipe') : [];
                        if (galleries.length || (node.classList && node.classList.contains('use-photoswipe'))) {
                            setTimeout(initializePhotoSwipe, 100);
                        }
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    function initializePhotoSwipe() {
        // Check if PhotoSwipe is available
        if (typeof PhotoSwipeLightbox === 'undefined') {
            console.warn('PhotoSwipe Lightbox not found - make sure PhotoSwipe library is loaded');
            return;
        }

        if (typeof PhotoSwipe === 'undefined') {
            console.warn('PhotoSwipe core not found - make sure PhotoSwipe library is loaded');
            return;
        }

        // Find all gallery containers
        const galleries = document.querySelectorAll('.wpzoom-photoswipe-gallery');

        if (galleries.length === 0) {
            console.log('No PhotoSwipe galleries found');
            return;
        }
        
        console.log('Found ' + galleries.length + ' PhotoSwipe galleries');

        galleries.forEach(function (gallery) {
            // Skip if already initialized
            if (gallery.dataset.photoswipeInitialized) {
                return;
            }

            // Mark as initialized
            gallery.dataset.photoswipeInitialized = 'true';

            console.log('Initializing PhotoSwipe gallery:', gallery);

            // Get all image items in this gallery
            const items = gallery.querySelectorAll('.wpzoom-photoswipe-item');
            console.log('Found ' + items.length + ' images in gallery');

            // Add click event listeners to prevent default behavior
            items.forEach(function (item) {
                item.addEventListener('click', function (e) {
                    e.preventDefault();
                    console.log('Image clicked, PhotoSwipe should handle this:', item);
                });
            });

            // Initialize PhotoSwipe Lightbox for this gallery
            const lightbox = new PhotoSwipeLightbox({
                gallery: gallery,
                children: '.wpzoom-photoswipe-item',

                // PhotoSwipe options
                pswpModule: PhotoSwipe,

                // UI options
                padding: { top: 20, bottom: 40, left: 100, right: 100 },
                bgOpacity: 0.8,
                spacing: 0.1,
                allowPanToNext: false,

                // Zoom options
                zoom: true,
                maxZoomLevel: 3,

                // Close options
                closeOnVerticalDrag: true,
                escKey: true,
                arrowKeys: true,

                // Show/hide UI elements
                showHideAnimationType: 'fade',

                // Get image data from DOM attributes
                dataSource: function (thumbnailElement, index) {
                    const width = parseInt(thumbnailElement.dataset.pswpWidth) || 1200;
                    const height = parseInt(thumbnailElement.dataset.pswpHeight) || 800;
                    const caption = thumbnailElement.dataset.pswpCaption || '';

                    console.log('Loading image data:', {
                        src: thumbnailElement.href,
                        width: width,
                        height: height,
                        caption: caption
                    });

                    return {
                        src: thumbnailElement.href,
                        width: width,
                        height: height,
                        alt: caption
                    };
                }
            });
            
            // Add event listeners
            lightbox.on('uiRegister', function () {
                console.log('PhotoSwipe UI registered');
            });

            lightbox.on('beforeOpen', function () {
                console.log('PhotoSwipe opening');
            // Add custom class to body when lightbox opens
                document.body.classList.add('wpzoom-photoswipe-open');
            });

            lightbox.on('destroy', function () {
                console.log('PhotoSwipe destroyed');
            // Remove custom class when lightbox closes
                document.body.classList.remove('wpzoom-photoswipe-open');
                // Mark as not initialized so it can be re-initialized if needed
                gallery.dataset.photoswipeInitialized = 'false';
            });

            lightbox.on('change', function () {
                console.log('PhotoSwipe image changed');
            });

            // Initialize the lightbox
            try {
                lightbox.init();
                console.log('PhotoSwipe lightbox initialized successfully');
            } catch (error) {
                console.error('Error initializing PhotoSwipe:', error);
            }
        });
    }
    
})(); 