/**
 * Initialize Magnific Popup for WPZOOM Image Gallery blocks
 */
(function($) {
    'use strict';
    
    // Initialize when DOM is ready
    $(document).ready(function() {
        initializeGalleryLightbox();
    });
    
    // Also initialize after Gutenberg block updates (for editor preview)
    $(document).on('DOMNodeInserted', function(e) {
        if ($(e.target).find('.wpzoom-image-gallery-block.use-lightbox').length) {
            setTimeout(initializeGalleryLightbox, 100);
        }
    });
    
    function initializeGalleryLightbox() {
        // Check if Magnific Popup is available
        if (typeof $.fn.magnificPopup === 'undefined') {
            return;
        }
        
        // Initialize lightbox for each gallery
        $('.wpzoom-image-gallery-block.use-lightbox').each(function() {
            var $gallery = $(this);
            
            // Destroy existing instance if any
            if ($gallery.find('.wpzoom-lightbox-link').hasClass('mfp-image')) {
                $gallery.find('.wpzoom-lightbox-link').magnificPopup('destroy');
            }
            
            // Initialize Magnific Popup
            $gallery.find('.wpzoom-lightbox-link').magnificPopup({
                type: 'image',
                gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
                },
                image: {
                    titleSrc: function(item) {
                        var title = item.el.attr('data-title');
                        return title ? title : '';
                    },
                    verticalFit: true
                },
                zoom: {
                    enabled: true,
                    duration: 300
                },
                callbacks: {
                    beforeOpen: function() {
                        // Add custom class to body when lightbox opens
                        $('body').addClass('wpzoom-lightbox-open');
                    },
                    afterClose: function() {
                        // Remove custom class when lightbox closes
                        $('body').removeClass('wpzoom-lightbox-open');
                    }
                }
            });
        });
    }
    
})(jQuery); 