/**************************************************************
 *
 * Circular Carousel Ready for Lazy Loading 1.0
 *
 **************************************************************/

( function( $ ) {
	'use strict';

	var requestForAppendActive = false;
	var itemsToBeAdded = '';
	var CarouselSnap = function( element, options ) {

		var settings = $.extend( {}, $.fn.carouselSnap.defaults, options );
		var elementsToMove = settings.elementsToMoveOnClick;
		var container = $( element );
		var widthPerItem = container.children().outerWidth( true );
		var moveby = '-=' + ( widthPerItem * elementsToMove ) + 'px';
		var movebyPrev = '+=' + ( widthPerItem * elementsToMove ) + 'px';
		var parentHolderWidth = container.parent().outerWidth();
		var containerWidth = container.children().length * container.children().outerWidth( true );
		var availableItems = container.children().length;
		var countAnimate = 1;
		var availablePanes;
		var timeoutId = null;
		var eventType;

		var initializeSettings = function() {
			containerWidth = container.children().length * container.children().outerWidth( true );
			availablePanes = Math.ceil( availableItems / elementsToMove );
		};

		var lastItemLeftValue = function() {
			return container.children().last().position().left;
		};

		var appendItems = function( shiftedToLeft ) {
			if ( shiftedToLeft ) {
				var lastItemLeftValueInt = lastItemLeftValue();
				for ( var i = 1; i <= elementsToMove; i++ ) {
					var clonedItem = container.children().eq( i - 1 ).clone();
					container.append( clonedItem.css( 'left', lastItemLeftValueInt + widthPerItem * i ) );
				}
			} else {
				var firstItemLeftValue = container.children().first().position().left;
				for ( var i = 1; i <= elementsToMove; i++ ) {
					var clonedItem = container.children().eq( availableItems - 1 ).clone();
					container.prepend( clonedItem.css( 'left', firstItemLeftValue - widthPerItem * i ) );
				}
			}
		};

		var removeTempItems = function( shiftedToLeft ) {
			if ( countAnimate == ( availableItems + elementsToMove ) ) {
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
				countAnimate = 1;
			} else {
				countAnimate++;
			}
		};

		var checkForNewItems = function() {
			if ( requestForAppendActive ) {
				var currentItemsLength = availableItems;
				var lastItemLeftValueInt = lastItemLeftValue();
				container.append( itemsToBeAdded );
				availableItems = container.children().length;
				for ( var i = currentItemsLength; i < availableItems; i++ ) {
					var leftValue = lastItemLeftValueInt + ( widthPerItem * ( i - currentItemsLength + 1 ) );
					container.children().eq( i ).css( 'left', leftValue );
				}
				addStylesToItems( currentItemsLength );
				requestForAppendActive = false;
				itemsToBeAdded = '';
			}
		};

		var shiftLeft = function( event ) {
			checkEvent( 0 , event);
			appendItems( true );
			container.children().animate( {
				'left': moveby
			}, {
				'start': unbindListenToClick,
				'complete': function() {
					removeTempItems( true );
				}
			} );
		};

		/* Check if click or hover and updates all calculations for elements to move. */
		var checkEvent = function( isPrev , event ) {
			var arrows = [ '#' + settings.nextID, '#' + settings.prevID ];
			if ( event != undefined) {
				elementsToMove = settings.elementsToMoveOnClick;
				triggerLeaveHover( arrows[ isPrev ] );
			} else {
				elementsToMove = settings.elementsToMoveOnHover;
			}
			moveby = '-=' + ( widthPerItem * elementsToMove ) + 'px';
			movebyPrev = '+=' + ( widthPerItem * elementsToMove ) + 'px';
		};

		var shiftRight = function( event ) {
			checkEvent( 1 , event );
			appendItems( false );
			container.children().animate( {
				'left': movebyPrev
			}, {
				'start': unbindListenToClick,
				'complete': function() {
					removeTempItems( false );
				}
			} );
		};

		var unbindListenToClick = function() {
			$( '#' + settings.nextID ).off( 'click', shiftLeft );
			$( '#' + settings.prevID ).off( 'click', shiftRight );
		};

		var listenToClick = function() {
			$( '#' + settings.nextID ).on( 'click', shiftLeft );
			$( '#' + settings.prevID ).on( 'click', shiftRight );
		};

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

		var alignCenter = function( alignFlag ) {
			if ( settings.startOnCenter === true ) {
				var nonvisibleItems = ( containerWidth - parentHolderWidth ) / widthPerItem;
				var itemsToShift;
				if ( alignFlag ) {
					itemsToShift = Math.floor( nonvisibleItems / 2 );
				} else {
					itemsToShift = 0;
				}
				for ( var i = 0; i < availableItems; i++ ) {
					var moveByItem = widthPerItem * ( i - itemsToShift );
					container.children().eq( i ).css( 'left', moveByItem );
				}
			} else {
				var itemsToShift = 0;
				for ( var i = 0; i < availableItems; i++ ) {
					var moveByItem = widthPerItem * ( i - itemsToShift );
					container.children().eq( i ).css( 'left', moveByItem );
				}
			}
		};

		var hidePrevNextLink = function() {
			container.parent().find( '.prevNext' ).hide();
		};

		var checkItemsTotal = function() {
			if ( availableItems <= elementsToMove ) {
				hidePrevNextLink();
				alignCenter( false );
			} else if ( availableItems <= 4 ) {
				hidePrevNextLink();
				alignCenter( false );
			} else {
				alignCenter( true );
				listenToClick();
			}
		};

		var addStylesToItems = function( start ) {
			for ( var i = start; i < availableItems; i++ ) {
				container.children().eq( i )
					.css( 'position', 'absolute' )
					.addClass( 'carousel-snap-' + i );
			}
		};

		var setContainerWidth = function() {
			container.css( 'width', containerWidth );
		};

		var appendPrevNextButtons = function() {
			container.after( '<div class="prevNext prevLink" id="' + settings.prevID + '">Previous</div><div class="prevNext nextLink" id="' + settings.nextID + '">Next</div>' );
		};

		var initialize = function() {
			appendPrevNextButtons();
			setContainerWidth();
			addStylesToItems( 0 );
			checkItemsTotal();
			initializeSettings();
			listenToHover();
		};
		initialize();
	};

	$.fn.carouselSnap = function( options ) {
		return this.each( function( key, value ) {
			var element = $( this );
			if ( element.data( 'carouselSnap' ) ) {
				return element.data( 'carouselSnap' );
			}
			var carouselSnap = new CarouselSnap( this, options );
			element.data( 'carouselSnap', carouselSnap );
		} );
	};

	$.fn.carouselSnap.appendItems = function( items ) {
		requestForAppendActive = true;
		itemsToBeAdded = itemsToBeAdded + items;
	};

	$.fn.carouselSnap.defaults = {
		nextID: 'next-slide',
		prevID: 'previous-slide',
		elementsToMoveOnClick: 4,
		elementsToMoveOnHover: 1,
		startOnCenter: true,
		time: 1500
	};

} )( jQuery );