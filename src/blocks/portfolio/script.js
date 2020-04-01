function ready( fn ) {
	if ( document.readyState != 'loading' ) {
		fn();
	} else {
		document.addEventListener( 'DOMContentLoaded', fn );
	}
}

function delegate( eventName, elementSelector, handler ) {
	document.addEventListener( eventName, function( e ) {
		for ( var target = e.target; target && target != this; target = target.parentNode ) {
			if ( target.matches( elementSelector ) ) {
				handler.call( target, e );
				break;
			}
		}
	}, false );
}

ready( () => {
	delegate( 'click', '.wpzoom-blocks_portfolio-block .wpzoom-blocks_portfolio-block_filter a', function( event ) {
		event.preventDefault();

		let item = this.parentNode;

		if ( item.className ) {
			let classes = item.className.split( /\s/ );

			if ( classes.length > 0 ) {
				let filteredClasses = classes.filter( cn => { return cn.indexOf( 'cat-item-' ) === 0 } );

				if ( filteredClasses.length > 0 ) {
					let catClass = filteredClasses[ 0 ];

					if ( catClass ) {
						let catId = catClass.replace( 'cat-item-', '' ),
						    itemsWrap = item.closest( '.wpzoom-blocks_portfolio-block' ).querySelector( '.wpzoom-blocks_portfolio-block_items-list' ),
						    showItems = 'all' == catId ? itemsWrap.querySelectorAll( '[data-category]' ) : itemsWrap.querySelectorAll( '[data-category="' + catId + '"]' ),
						    hideItems = 'all' == catId ? [] : itemsWrap.querySelectorAll( '[data-category]:not([data-category="' + catId + '"])' );

						item.parentNode.querySelectorAll( 'li' ).forEach( filterBtn => {
							filterBtn.classList.remove( 'current-cat' );
						} );
						item.classList.add( 'current-cat' );

						showItems.forEach( theItem => {
							let classList = theItem.classList;

							if ( classList.contains( 'fade-out' ) ) {
								classList.remove( 'fade-out' );
							}

							if ( ! classList.contains( 'fade-in' ) ) {
								classList.add( 'fade-in' );
							}
						} );

						hideItems.forEach( theItem => {
							let classList = theItem.classList;

							if ( classList.contains( 'fade-in' ) ) {
								classList.remove( 'fade-in' );
							}

							if ( ! classList.contains( 'fade-out' ) ) {
								classList.add( 'fade-out' );
							}
						} );
					}
				}
			}
		}
	} );

	delegate( 'click', '.wpzoom-blocks_portfolio-block .wpzoom-blocks_portfolio-block_show-more a', function( event ) {
		event.preventDefault();

		console.log('Load more...');
	} );
} );