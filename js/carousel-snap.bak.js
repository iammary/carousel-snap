/**************************************************************
 *
 * Circular Carousel Ready for Lazy Loading 1.0
 *
 **************************************************************/

( function ( $ ) {
	'use strict';

	var CarouselSnap = function ( element, settings, pluginUsed ) {

		var availableItems;

		var elementsToMove       = settings.elementsToMove;
		var container            = $( element );
		var updatePositionActive = true;

		var getAvailableItems = function () {
			return container.children().length;
		}

		var hidePrevNextLink = function ()) {
			container.parent().find('.prevNext').hide();
		}

		var getContainerWidth = function () {
			return getAvailableItems() * container.children().outerWidth( true );
		}

		var getparentHolderWidth = function () {
			return container.parent().outerWidth();
		}

		var getWidthPerItem = function () {
			return container.children().outerWidth( true )
		}

		var alignCenter = function ( alignFlag ) {
			var nonvisibleItems = ( getContainerWidth() - getparentHolderWidth() ) / getWidthPerItem();
			var itemsToShift;
			if ( alignFlag ) {
				itemsToShift = Math.floor( nonvisibleItems / 2 );
			} else {
				itemsToShift = 0;
			}
			for (var i = 0; i < getAvailableItems(); i++) {
				var moveByItem = getWidthPerItem() * ( i  - itemsToShift );
				container.children().eq( i ).css( 'left', moveByItem )
			}
		}

		var checkItemsTotal = function ( container, elementsToMove ) {
			if ( getAvailableItems() <= elementsToMove ) {
				hidePrevNextLink();
				alignCenter( false );
				return false;
			} else {
				alignCenter( true );
				return true;
			}
		}

		var updateItemPosition = function () {
			availableItems = getAvailableItems();
			if ( getAvailableItems() ) {
				for ( var i = 1; i < getAvailableItems(); i++ ) {
					var previousLeft = container.children().eq( i - 1 ).position().left;
					container.children().eq( i ).css( {
						'left', previousLeft + widthPerItem,
						'position', 'absolute'
					} )
				}
				checkItemsTotal();
			}
		}

		var appendPrevNextButtons = function () {
			container.after( '<div class="prevNext prevLink" id="' + settings.prevID + '">Previous</div><div class="prevNext nextLink" id="' + settings.nextID + '">Next</div>' );
		};

		var addStylesToItems = function ( start, addClass ) {
			for (var i = start; i < getAvailableItems(); i++ ) {
				container.children().eq( i ).css( 'position', 'absolute' )
			}
			if ( addClass ) {
				for (var i = start; i < getAvailableItems(); i++ ) {
					container.children().eq( i ).addClass( 'carousel-snap-' + i );
				}
			}
		};

		var appendTempItems = function ( shiftedToLeft ) {
			if ( shiftedToLeft ) {
				var lastItemLeftValueInt = lastItemLeftValue();
				for ( var i = 1; i <= settings.elementsToMove; i++ ) {
					var clonedItem = container.children().eq( i - 1 ).clone( true );
					container.append( clonedItem.css( 'left', lastItemLeftValueInt + widthPerItem * i ) );
				}
			} else {
				var firstItemLeftValueInt = firstItemLeftValue();
				availableItems = getAvailableItems()
				for ( var i = 1; i <= settings.elementsToMove; i++ ) {
					var clonedItem = container.children().eq( availableItems - 1 ).clone( true );
					container.prepend( clonedItem.css( 'left', firstItemLeftValueInt - widthPerItem * i ) );
				}
			}
		}

		var checkForNewItems = function () {
			// if ( requestForAppendActive ) {
			// 	var currentItemsLength = getAvailableItems();
			// 	var lastItemLeftValueInt = lastItemLeftValue();
			// 	container.append( itemsToBeAdded );
			// 	for (var i = currentItemsLength; i < getAvailableItems(); i++) {
			// 		var leftValue = lastItemLeftValueInt + ( widthPerItem * ( i - currentItemsLength + 1 ) );
			// 		container.children().eq( i ).css( 'left', leftValue );
			// 	}
			// 	addStylesToItems( container, currentItemsLength );
			// 	requestForAppendActive = false;
			// 	itemsToBeAdded = '';
			// }
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
				listenToClick();
				updatePositionActive = true;
				countAnimate         = 1;
				shiftLeftCount       = 0;
				shiftRightCount      = 0;
			} else {
				countAnimate++;
			}
		}

		var shiftLeft = function () {
			if ( !shiftLeftCount ) {
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
			shiftLeftCount++;
		}

		var shiftRight = function () {
			if( !shiftRightCount ) {
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
			shiftRightCount++;
		}

		var unbindListenToClick = function () {
			updatePositionActive   = false;
			$( '#' + settings.nextID ).off( 'click',  shiftLeft);
			$( '#' + settings.prevID ).off( 'click', shiftRight);
		}

		var listenToClick = function () {
			$( '#' + settings.nextID ).on( 'click', shiftLeft );
			$( '#' + settings.prevID ).on( 'click', shiftRight );
		}

		var initialize = function () {
			setContainerWidth();
			if ( settings.updatePosition ) {
				updateItemPosition();
			} else {
				var addClass = false;
				if ( !pluginUsed ) {
					appendPrevNextButtons();
					addClass = true;
				}
				addStylesToItems( 0, addClass );
				if ( checkItemsTotal() ) {
					listenToClick();
				}
			}
		}

	}


	$.fn.carouselSnap = function ( options ) {
		return this.each( function ( key, value ) {
			var element    = $( this );
			var settings   = $.extend( {}, $.fn.carouselSnap.defaults, options );
			var pluginUsed = false;
			if ( element.data( 'carouselSnap' ) ) {
				pluginUsed = true;
			}
			var carouselSnap = new CarouselSnap( this, settings, pluginUsed );
			element.data( 'carouselSnap', carouselSnap );
		} );
	};

	$.fn.carouselSnap.defaults = {
		nextID                : 'next-slide',
		prevID                : 'previous-slide',
		elementsToMoveOnClick : 4,
		elementsToMoveOnHover : 1,
		startOnCenter         : true,
		time                  : 1500,
		updatePosition        : false
	};

} )( jQuery );