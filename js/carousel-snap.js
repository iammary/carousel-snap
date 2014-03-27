/* global jQuery */

/**************************************************************
 *
 * Circular Carousel Ready for Lazy Loading 2.0.1
 *
 **************************************************************/

( function ( $ ) {
	'use strict';

	var CarouselSnap = function ( element, settings ) {

		var availableItems;
		var elementsToMove          = settings.elementsToMoveOnClick;
		var container               = $( element );
		var updatePositionActive    = true;
		var shiftLeftCount          = 0;
		var shiftRightCount         = 0;
		var countAnimate            = 1;
		var timeoutId               = null;
		this.itemsToBeAdded         = '';
		this.requestForAppendActive = false;
		var _this                   = this;

		this.setItemsToBeAdded = function ( items ) {
			_this.itemsToBeAdded = _this.itemsToBeAdded + items;
		};

		var getAvailableItems = function () {
			return container.children().length;
		};

		var hidePrevNextLink = function () {
			container.parent().find('.prevNext').hide();
		};

		var showPrevNextLink = function () {
			container.parent().find('.prevNext').show();
		};

		var getContainerWidth = function () {
			return getAvailableItems() * container.children().outerWidth( true );
		};

		var getparentHolderWidth = function () {
			return container.parent().outerWidth();
		};

		var getWidthPerItem = function () {
			return container.children().outerWidth( true );
		};

		var moveby     = '-=' + ( getWidthPerItem() * elementsToMove ) + 'px';
		var movebyPrev = '+=' + ( getWidthPerItem() * elementsToMove ) + 'px';

		var setContainerWidth = function () {
			container.css( 'width', getContainerWidth( container ) );
		};

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
				container.children().eq( i ).css( 'left', moveByItem );
			}
		};

		var checkItemsTotal = function () {
			if ( getAvailableItems() <= elementsToMove ) {
				hidePrevNextLink();
				alignCenter( false );
				return false;
			} else {
				alignCenter( true );
				return true;
			}
		};

		var hideShowLinks = function () {
			if ( getAvailableItems() === ( getContainerWidth/getWidthPerItem ) ) {
				hidePrevNextLink();
			} else {
				showPrevNextLink();
			}
		};

		this.updateItemPosition = function () {
			availableItems = getAvailableItems();
			if ( getAvailableItems() ) {
				hideShowLinks();
				for ( var i = 1; i < getAvailableItems(); i++ ) {
					var previousLeft = container.children().eq( i - 1 ).position().left;
					container.children().eq( i ).css( {
						'left'     : previousLeft + getWidthPerItem(),
						'position' : 'absolute'
					} );
				}
				checkItemsTotal();
			}
		};

		var appendPrevNextButtons = function ( newInstance ) {
			if ( newInstance ) {
				container.after( '<div class="prevNext prevLink" id="' + settings.prevID + '">Previous</div><div class="prevNext nextLink" id="' + settings.nextID + '">Next</div>' );
			} else {
				hideShowLinks();
			}
		};

		var addStylesToItems = function ( start, addClass ) {
			for (var i = start; i < getAvailableItems(); i++ ) {
				container.children().eq( i ).css( 'position', 'absolute' );
			}
			if ( addClass ) {
				for (var j = start; j < getAvailableItems(); j++ ) {
					container.children().eq( j ).addClass( 'carousel-snap-' + j );
				}
			}
		};

		var lastItemLeftValue = function () {
			return container.children().last().position().left;
		};

		var firstItemLeftValue = function () {
			return container.children().first().position().left;
		};

		var appendTempItems = function ( shiftedToLeft ) {
			if ( shiftedToLeft ) {
				var lastItemLeftValueInt = lastItemLeftValue();
				for ( var i = 1; i <= elementsToMove; i++ ) {
					var clonedItem = container.children().eq( i - 1 ).clone( true );
					container.append( clonedItem.css( 'left', lastItemLeftValueInt + getWidthPerItem() * i ) );
				}
			} else {
				var firstItemLeftValueInt = firstItemLeftValue();
				availableItems = getAvailableItems();
				for ( var j = 1; j <= elementsToMove; j++ ) {
					var clonedItemR = container.children().eq( availableItems - 1 ).clone( true );
					container.prepend( clonedItemR.css( 'left', firstItemLeftValueInt - getWidthPerItem() * j ) );
				}
			}
		};

		var checkForNewItems = function () {
			if ( _this.requestForAppendActive ) {
				var currentItemsLength = getAvailableItems();
				var lastItemLeftValueInt = lastItemLeftValue();
				container.append( _this.itemsToBeAdded );
				for (var i = currentItemsLength; i < getAvailableItems(); i++) {
					var leftValue = lastItemLeftValueInt + ( getWidthPerItem() * ( i - currentItemsLength + 1 ) );
					container.children().eq( i ).css( 'left', leftValue );
				}
				addStylesToItems( currentItemsLength );
				_this.requestForAppendActive = false;
				_this.itemsToBeAdded = '';
			}
		};

		var resetAfterCompleteAnimation = function () {
			checkForNewItems();
			listenToClick();
			updatePositionActive = true;
			countAnimate         = 1;
			shiftLeftCount       = 0;
			shiftRightCount      = 0;
			settings.afterShift();
		};

		var removeTempItems = function ( shiftedToLeft, callback ) {
			if ( countAnimate === getAvailableItems() ) {
				if ( shiftedToLeft ) {
					for ( var i = 1; i <= elementsToMove; i++ ) {
						container.children().first().remove();
					}
				} else {
					for ( var j = 1; j <= elementsToMove; j++ ) {
						container.children().last().remove();
					}
				}
				callback();
			} else {
				countAnimate++;
			}
		};

		var checkEvent = function( isPrev , event ) {
			var arrows = [ '#' + settings.nextID, '#' + settings.prevID ];
			if ( event !== undefined) {
				elementsToMove = settings.elementsToMoveOnClick;
				triggerLeaveHover( arrows[ isPrev ] );
			} else {
				elementsToMove = settings.elementsToMoveOnHover;
			}
			moveby     = '-=' + ( getWidthPerItem() * elementsToMove ) + 'px';
			movebyPrev = '+=' + ( getWidthPerItem() * elementsToMove ) + 'px';
		};

		var shiftLeft = function ( event ) {
			settings.beforeShift();
			if ( !shiftLeftCount ) {
				checkEvent( 0 , event);
				appendTempItems( true );
				container.children().animate( {
					'left': moveby
				}, {
						'start'    : unbindListenToClick,
						'complete' : function () {
							removeTempItems( true, resetAfterCompleteAnimation );
						}
				} );
			}
			shiftLeftCount++;
		};

		var shiftRight = function ( event ) {
			settings.beforeShift();
			if( !shiftRightCount ) {
				checkEvent( 1 , event );
				appendTempItems( false );
				container.children().animate( {
					'left': movebyPrev
				}, {
						'start'    : unbindListenToClick,
						'complete' : function () {
							removeTempItems( false, resetAfterCompleteAnimation );
						}
				} );
			}
			shiftRightCount++;
		};

		var onHover = function( element, callback ) {
			$( element ).hover( function() {
				if ( !timeoutId ) {
					timeoutId = window.setInterval( function() {
						callback();
					}, settings.time );
				}
			}, function() {
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
		};

		var unbindListenToClick = function () {
			updatePositionActive   = false;
			$( '#' + settings.nextID ).off( 'click',  shiftLeft);
			$( '#' + settings.prevID ).off( 'click', shiftRight);
		};

		this.initialize = function ( newInstance ) {
			setContainerWidth();
			appendPrevNextButtons( newInstance );
			addStylesToItems( 0, true );
			if ( checkItemsTotal() ) {
				listenToClick();
				listenToHover();
			}
		};

	};

	$.fn.carouselSnap = function ( options ) {
		return this.each( function ( key, value ) {
			var element     = $( this );
			var settings    = $.extend( {}, $.fn.carouselSnap.defaults, options );
			var carouselSnap    = element.data( 'carouselSnap' );
			var newInstance = false;
			if ( !carouselSnap ) {
				carouselSnap = new CarouselSnap( this, settings );
				element.data( 'carouselSnap', carouselSnap );
				newInstance = true;
			}
			carouselSnap.initialize( newInstance );
		} );
	};

	$.fn.carouselAppend = function ( items, callback ) {
		return this.each( function ( key, value ) {
			var carousel = $( this ).data( 'carouselSnap' );
			var success  = false;
			var msg      = 'Item not an instance of carouselSnap';
			if ( carousel ) {
				success = true;
				msg     = 'Items successfully appended';
				carousel.setItemsToBeAdded( items );
				carousel.requestForAppendActive = true;
			}
			if ( callback ) {
				callback( success, msg );
			}
		} );
	};

	$.fn.carouselRemove = function ( e, callback ) {
		var carousel = $( e ).parent().data( 'carouselSnap' );
		var success  = false;
		var msg      = 'Item not an instance of carouselSnap';
		if ( carousel ) {
			$( e ).remove();
			carousel.updateItemPosition();
			success = true;
			msg     = 'Item successfully removed';
		}
		if ( callback ) {
			callback( success, msg );
		}
	};

	$.fn.carouselSnap.defaults = {
		nextID                : 'next-slide',
		prevID                : 'previous-slide',
		elementsToMoveOnClick : 1,
		elementsToMoveOnHover : 1,
		startOnCenter         : true,
		time                  : 10000,
		beforeShift           : function () {},
		afterShift            : function () {}
	};

} )( jQuery );