/**************************************************************
 *
 * Circular Carousel Ready for Lazy Loading 1.0
 *
 **************************************************************/

( function ( $ ) {
	'use strict';

	var CarouselSnap = function ( element, settings, pluginUsed ) {

		var showMsg = function ( msg ) {
			console.log( msg );
		}

		var availableItems;

		var elementsToMove         = settings.elementsToMoveOnClick;
		var container              = $( element );
		var updatePositionActive   = true;
		var shiftLeftCount         = 0;
		var shiftRightCount        = 0;
		var countAnimate           = 1;
		var requestForAppendActive = false;
		var timeoutId              = null;


		var getAvailableItems = function () {
			return container.children().length;
		}

		var hidePrevNextLink = function () {
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

		var moveby     = '-=' + ( getWidthPerItem() * elementsToMove ) + 'px';
		var movebyPrev = '+=' + ( getWidthPerItem() * elementsToMove ) + 'px';

		var setContainerWidth = function () {
			container.css( 'width', getContainerWidth( container ) );
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
				console.log( 'settings.elementsToMoveOnClick ' + settings.elementsToMoveOnClick );
				if ( getAvailableItems() == settings.elementsToMoveOnClick ) {
					console.log( 'hiding' )
					hidePrevNextLink();
				}
				for ( var i = 1; i < getAvailableItems(); i++ ) {
					var previousLeft = container.children().eq( i - 1 ).position().left;
					container.children().eq( i ).css( {
						'left'     : previousLeft + getWidthPerItem(),
						'position' : 'absolute'
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

		var lastItemLeftValue = function () {
			return container.children().last().position().left
		}

		var firstItemLeftValue = function () {
			return container.children().first().position().left;
		}

		var appendTempItems = function ( shiftedToLeft ) {
			if ( shiftedToLeft ) {
				var lastItemLeftValueInt = lastItemLeftValue();
				for ( var i = 1; i <= elementsToMove; i++ ) {
					var clonedItem = container.children().eq( i - 1 ).clone( true );
					container.append( clonedItem.css( 'left', lastItemLeftValueInt + getWidthPerItem() * i ) );
				}
			} else {
				var firstItemLeftValueInt = firstItemLeftValue();
				availableItems = getAvailableItems()
				for ( var i = 1; i <= elementsToMove; i++ ) {
					var clonedItem = container.children().eq( availableItems - 1 ).clone( true );
					container.prepend( clonedItem.css( 'left', firstItemLeftValueInt - getWidthPerItem() * i ) );
				}
			}
		}

		var checkForNewItems = function () {
			if ( requestForAppendActive ) {
				var currentItemsLength = getAvailableItems();
				var lastItemLeftValueInt = lastItemLeftValue();
				container.append( itemsToBeAdded );
				for (var i = currentItemsLength; i < getAvailableItems(); i++) {
					var leftValue = lastItemLeftValueInt + ( getWidthPerItem() * ( i - currentItemsLength + 1 ) );
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
					for ( var i = 1; i <= elementsToMove; i++ ) {
						container.children().first().remove();
					}
				} else {
					for ( var i = 1; i <= elementsToMove; i++ ) {
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

		var checkEvent = function( isPrev , event ) {
			var arrows = [ '#' + settings.nextID, '#' + settings.prevID ];
			if ( event != undefined) {
				elementsToMove = settings.elementsToMoveOnClick;
				triggerLeaveHover( arrows[ isPrev ] );
			} else {
				elementsToMove = settings.elementsToMoveOnHover;
			}
			moveby     = '-=' + ( getWidthPerItem() * elementsToMove ) + 'px';
			movebyPrev = '+=' + ( getWidthPerItem() * elementsToMove ) + 'px';
		};

		var shiftLeft = function ( event ) {
			if ( !shiftLeftCount ) {
				checkEvent( 0 , event);
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

		var shiftRight = function ( event ) {
			if( !shiftRightCount ) {
				checkEvent( 1 , event );
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

		var onHover = function( element, callback ) {
			$( element ).hover( function() {
				//start time
				if ( !timeoutId ) {
					timeoutId = window.setInterval( function() {
						callback();
					}, settings.time );
				}
			}, function() {
				//reset time
				if ( timeoutId ) {
					window.clearInterval( timeoutId );
					timeoutId = null;
				}
			} );
		};

		var triggerLeaveHover = function( element ) {
			window.clearInterval( timeoutId );
			timeoutId = null;
			$( element ).trigger( 'mouseleave' );
			$( element ).trigger( 'mouseenter' );
		};

		var listenToHover = function() {
			onHover( '#' + settings.nextID, shiftLeft );
			onHover( '#' + settings.prevID, shiftRight );
		};

		var listenToClick = function () {
			$( '#' + settings.nextID ).on( 'click', shiftLeft );
			$( '#' + settings.prevID ).on( 'click', shiftRight );
		}

		var unbindListenToClick = function () {
			updatePositionActive   = false;
			$( '#' + settings.nextID ).off( 'click',  shiftLeft);
			$( '#' + settings.prevID ).off( 'click', shiftRight);
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
					listenToHover();
				}
			}
		}

		initialize();

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
		elementsToMoveOnHover : 4,
		startOnCenter         : true,
		time                  : 1500,
		updatePosition        : false
	};

} )( jQuery );