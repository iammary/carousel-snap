/**************************************************************
 *
 * Circular Carousel Ready for Lazy Loading 1.0
 *
 **************************************************************/

( function ( $ ) {
	'use strict';

	var requestForAppendActive = false;
	var itemsToBeAdded         = '';
	var requestForRemoveActive = true;

	var container;
	var widthPerItem;

	var getAvailableItems = function () {
		return container.children().length;
	}

	var CarouselSnap = function ( element, options ) {

		var settings          = $.extend( {}, $.fn.carouselSnap.defaults, options );
		var elementsToMove    = settings.elementsToMove;
		container         = $( element );
		widthPerItem      = container.children().outerWidth( true );
		var moveby            = '-=' + ( widthPerItem * elementsToMove ) + 'px';
		var movebyPrev        = '+=' + ( widthPerItem * elementsToMove ) + 'px';
		var parentHolderWidth = container.parent().outerWidth();
		var containerWidth    = getAvailableItems() * container.children().outerWidth( true );
		var availableItems    = getAvailableItems();
		var countAnimate      = 1;

		var initializeSettings = function () {
			containerWidth = getAvailableItems() * container.children().outerWidth( true );
		};

		var lastItemLeftValue = function () {
			return container.children().last().position().left
		}

		var appendTempItems = function ( shiftedToLeft ) {
			if ( shiftedToLeft ) {
				var lastItemLeftValueInt = lastItemLeftValue();
				for ( var i = 1; i <= settings.elementsToMove; i++ ) {
					var clonedItem = container.children().eq( i - 1 ).clone();
					container.append( clonedItem.css( 'left', lastItemLeftValueInt + widthPerItem * i ) );
				}
			} else {
				var firstItemLeftValue = container.children().first().position().left;
				for ( var i = 1; i <= settings.elementsToMove; i++ ) {
					var clonedItem = container.children().eq( availableItems - 1 ).clone();
					container.prepend( clonedItem.css( 'left', firstItemLeftValue - widthPerItem * i ) );
				}
			}
		}

		var checkForNewItems = function () {
			if ( requestForAppendActive ) {
				var currentItemsLength = getAvailableItems();
				var lastItemLeftValueInt = lastItemLeftValue();
				container.append( itemsToBeAdded );
				for (var i = currentItemsLength; i < getAvailableItems(); i++) {
					var leftValue = lastItemLeftValueInt + ( widthPerItem * ( i - currentItemsLength + 1 ) );
					container.children().eq( i ).css( 'left', leftValue );
				}
				addStylesToItems( currentItemsLength );
				requestForAppendActive = false;
				itemsToBeAdded = '';
			}
		};

		var removeTempItems = function ( shiftedToLeft ) {
			if ( countAnimate == getAvailableItems() ) {
				if ( shiftedToLeft ) {
					for ( var i = 1; i <= settings.elementsToMove; i++ ) {
						container.children().first().remove();
					}
				} else {
					for ( var i = 1; i <= settings.elementsToMove; i++ ) {
						container.children().last().remove();
					}
				}
				checkForNewItems();
				requestForRemoveActive = true;
				console.log( 'removeTempItems' );
				listenToClick();
				countAnimate = 1;
			} else {
				countAnimate++;
			}
		}

		var shiftLeft = function () {
			console.log( 'shiftLeft' )
			appendTempItems( true );
			container.children().animate( {
				'left': moveby
			}, {
					'start'    : unbindListenToClick,
					'complete' : function () {
						removeTempItems( true );
					}
			} );
		}

		var shiftRight = function () {
			appendTempItems( false );
			container.children().animate( {
				'left': movebyPrev
			}, {
					'start'    : unbindListenToClick,
					'complete' : function () {
						removeTempItems( false );
					}
			} );
		}

		var unbindListenToClick = function () {
			requestForRemoveActive = false;
			$( '#' + settings.nextID ).off( 'click', shiftLeft);
			$( '#' + settings.prevID ).off( 'click', shiftRight);
		}

		var listenToClick = function () {
			console.log( 'listenToClick' )
			$( '#' + settings.nextID ).on( 'click', shiftLeft);
			$( '#' + settings.prevID ).on( 'click', shiftRight);
		}

		var alignCenter = function ( alignFlag ) {
			var nonvisibleItems = ( containerWidth - parentHolderWidth ) / widthPerItem;
			var itemsToShift;
			if ( alignFlag ) {
				itemsToShift = Math.floor( nonvisibleItems / 2 );
			} else {
				itemsToShift = 0;
			}
			for (var i = 0; i < availableItems; i++) {
				var moveByItem = widthPerItem * ( i  - itemsToShift );
				container.children().eq( i ).css( 'left', moveByItem )
			}
		}

		var hidePrevNextLink = function () {
			container.parent().find('.prevNext').hide();
		}

		var checkItemsTotal = function () {
			if ( availableItems <= settings.elementsToMove ) {
				hidePrevNextLink();
				alignCenter( false );
			} else {
				alignCenter( true );
				listenToClick();
			}
		}

		var addStylesToItems = function ( start ) {
			console.log( 'addStylesToItems ')
			for (var i = start; i < getAvailableItems(); i++) {
				container.children().eq( i )
				.css( 'position', 'absolute' )
				.addClass( 'carousel-snap-' + i );
			}
		};

		var setContainerWidth = function () {
			container.css( 'width', containerWidth );
		}

		var appendPrevNextButtons = function () {
			container.after( '<div class="prevNext prevLink" id="' + settings.prevID + '">Previous</div><div class="prevNext nextLink" id="' + settings.nextID + '">Next</div>' );
		};

		var initialize = function () {
			appendPrevNextButtons();
			setContainerWidth();
			addStylesToItems( 0 );
			checkItemsTotal();
			initializeSettings();
		};
		initialize();
	};

	$.fn.carouselSnap = function ( options ) {
		return this.each( function ( key, value ) {
			var element = $( this );
			if ( element.data( 'carouselSnap' ) ) {
				return element.data( 'carouselSnap' );
			}
			var carouselSnap = new CarouselSnap( this, options );
			element.data( 'carouselSnap', carouselSnap );
		} );
	};

	$.fn.carouselSnap.appendItems = function ( items ) {
		requestForAppendActive = true;
		itemsToBeAdded = itemsToBeAdded + items;
	}

	$.fn.carouselSnap.removeItem = function ( itemClass, callback ) {
		if ( element.data( 'carouselSnap' ) ) {
			var el = container.find( itemClass );
			if ( requestForRemoveActive && el.length ) {
				var start = el.index() + 1;
				for ( var i = start; i < getAvailableItems(); i++ ) {
					var currentLeft = container.children().eq( i ).position().left;
					container.children().eq( i ).css( 'left', currentLeft - widthPerItem )
				}
				el.remove();
				callback ( true, 'Success' );
			} else {
				if ( el.length ) {
					callback( false, 'Dom not ready' );
				} else {
					callback( false, 'Item not found' );
				}
			}
		} else {
			callback( false, 'Container does not have instance of Carousel Snap' );
		}
	}

	$.fn.carouselSnap.defaults = {
		nextID: 'next-slide',
		prevID: 'previous-slide',
		elementsToMove: 4,
		startOnCenter: true,
	};

} )( jQuery );