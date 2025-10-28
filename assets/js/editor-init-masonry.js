(function () {
    const { subscribe, select } = wp.data;

    let timeout = null;

    function applyMasonry() {
        let containers = document.getElementsByClassName('wpzoom-blocks_portfolio-block');

        [].forEach.call(containers, function (el) {
            if (el.classList.contains('layout-masonry')) {
                var elem = el.querySelector('.wpzoom-blocks_portfolio-block_items-list');
                if (!elem) return;

                var msnry = new Masonry(elem, {
                    itemSelector: '.wpzoom-blocks_portfolio-block_item',
                });

                imagesLoaded(el).on('progress', function () {
                    msnry.layout();
                });
            }
        });

        // Image Gallery: apply Masonry in editor as well
        let galleryContainers = document.getElementsByClassName('wpzoom-gallery-masonry');
        [].forEach.call(galleryContainers, function (el) {
            var existing = Masonry.data(el);
            var sizer = el.querySelector('.wpzoom-masonry-sizer');
            var gutterSizer = el.querySelector('.wpzoom-masonry-gutter-sizer');
            var options = {
                itemSelector: '.wpzoom-gallery-item',
                percentPosition: true,
                columnWidth: sizer || '.wpzoom-gallery-item',
                gutter: gutterSizer || 0
            };



            if (!existing) {
                existing = new Masonry(el, options);
            } else {
                existing.options = Object.assign(existing.options || {}, options);
                existing.layout();
            }



            imagesLoaded(el).on('progress', function () { existing.layout(); });
        });

        // Image Gallery: destroy Masonry when switching back to grid
        let nonMasonryGalleries = document.querySelectorAll('.wpzoom-gallery-grid:not(.wpzoom-gallery-masonry)');
        [].forEach.call(nonMasonryGalleries, function (el) {
            var existing = Masonry.data(el);
            if (existing) {
                existing.destroy();
            }
        });
    }

    // Run Masonry initially
    applyMasonry();

    subscribe(() => {

        // Wait 500ms before reapplying Masonry (adjust delay as needed)
        timeout = setTimeout(() => {
            applyMasonry();
        }, 1);
    });
})();
