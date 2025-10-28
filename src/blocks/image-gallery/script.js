(function($) {
    'use strict';

    $(document).ready(function() {
        initializeGalleryLightbox();
        initializeGalleryMasonry();
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
    
    function initializeGalleryMasonry() {
        // Skip inside the block editor iframe; editor script manages Masonry there
        if (
            typeof wp !== 'undefined' &&
            wp.data &&
            wp.data.subscribe &&
            document.querySelector('.block-editor-block-list__layout')
        ) {
            return;
        }

        if (typeof Masonry === 'undefined' || typeof imagesLoaded === 'undefined') {
            return;
        }

        $('.wpzoom-gallery-masonry').each(function () {
            var el = this;
            var sizer = el.querySelector('.wpzoom-masonry-sizer');
            var gutterSizer = el.querySelector('.wpzoom-masonry-gutter-sizer');

            var masonryInstance = new Masonry(el, {
                itemSelector: '.wpzoom-gallery-item',
                percentPosition: true,
                columnWidth: el.querySelector('.wpzoom-masonry-sizer') || '.wpzoom-gallery-item',
                gutter: el.querySelector('.wpzoom-masonry-gutter-sizer') || 0
            });

            imagesLoaded(el).on('progress', function () {
                masonryInstance.layout();
            });
        });
    }

})(jQuery);