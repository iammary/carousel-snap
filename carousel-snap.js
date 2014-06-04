/* global jQuery */

/**************************************************************
 *
 * Circular Carousel Ready for Lazy Loading 4.0.4
 *
 * Bug fixes for navigational buttons on mobile devices
 *
 **************************************************************/

( function ( $ ) {
	'use strict';

	var CarouselSnap = function ( element, settings ) {

		var availableItems;

		var container       = $( element );
		var shiftLeftCount  = 0;
		var shiftRightCount = 0;
		var countAnimate    = 1;
		var timeoutId       = null;
		var _this           = this;
		var availablePanes  = 1;

		this.is_touch_device;
		this.itemsToBeAdded         = '';
		this.requestForAppendActive = false;
		this.rotate                 = settings.rotate;
		this.activePane             = 1;
		this.firstActiveElement     = 1;
		this.currentCloned          = null;

		this.setItemsToBeAdded = function ( items ) {
			_this.itemsToBeAdded = _this.itemsToBeAdded + items;
		};

		this.getLastItemStatus = function ( ) {
			return container.children().last().hasClass( 'active-view' );
		};

		var getparentHolderWidth = function () {
			return container.parent().outerWidth();
		};

		var getWidthPerItem = function () {
			return container.children().outerWidth( true );
		};

		var calcElementsToMove  = function () {
			var shownElements = Math.floor( getparentHolderWidth() / getWidthPerItem() );
			if ( settings.responsive ) {
				return shownElements;
			} else {
				return settings.elementsToMoveOnClick;
			}
		};

		var elementsToMove = calcElementsToMove();

		var getAvailableItems = function () {
			return container.children().length;
		};

		var getTotalPanes = function () {
			elementsToMove = calcElementsToMove();
			return ( Math.ceil( getAvailableItems() / elementsToMove ) );
		};

		var hidePrevNextLink = function () {
			container.parent().find('.prevNext').removeClass('active');
			unbindListenToClick( 'both' );
		};

		var showPrevNextLink = function () {
			container.parent().find('.prevNext').addClass('active');
		};

		var getContainerWidth = function () {
			return getAvailableItems() * container.children().outerWidth( true );
		};

		var moveby     = function () {
			return '-=' + ( getWidthPerItem() * elementsToMove ) + 'px';
		} ;
		var movebyPrev = function () {
			return '+=' + ( getWidthPerItem() * elementsToMove ) + 'px';
		};

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
			for ( var i = 0; i < getAvailableItems(); i++ ) {
				var moveByItem = getWidthPerItem() * ( i  - itemsToShift );
				container.children().eq( i ).css( 'left', moveByItem );
			}
		};

		var checkItemsTotal = function () {
			availablePanes = getTotalPanes();
			_this.updateItemStatus( 0 );
			if ( getAvailableItems() <= elementsToMove ) {
				hidePrevNextLink();
				alignCenter( false );
				return false;
			} else {
				alignCenter( settings.alignCenter );
				return true;
			}
		};

		var fittedElements = function () {
			var elementsOnScreen = Math.ceil( getparentHolderWidth() / getWidthPerItem() );
			if ( elementsOnScreen === calcElementsToMove() ) {
				container.parent().removeClass( 'elements-not-fitted' );
				container.parent().addClass( 'elements-fitted' );
			} else {
				container.parent().removeClass( 'elements-fitted' );
				container.parent().addClass( 'elements-not-fitted' );
			}
		}

		this.hideShowLinks = function () {
			if ( getAvailableItems() <= calcElementsToMove() ) {
				hidePrevNextLink();
			} else {
				fittedElements();
				showPrevNextLink();
			}
		};

		this.updateItemPosition = function () {
			availableItems = getAvailableItems();
			if ( getAvailableItems() ) {
				_this.hideShowLinks();
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
				_this.is_touch_device = 'ontouchstart' in document.documentElement;
				var touch = ( _this.is_touch_device ) ? 'swipe-enabled' : 'swipe-disabled';
				container.after( '<div class="prevNext-holder prev ' + touch + '"><div class="prevNext2 prevLink2 fa fa-angle-left"></div><div id="' + settings.prevID + '" class="prevNext prevLink active fa fa-angle-left"></div></div><div class="prevNext-holder next ' + touch + '"><div class="prevNext2 nextLink2 fa fa-angle-right"></div><div id="' + settings.nextID + '" class="prevNext nextLink fa fa-angle-right"></div></div><div class="lazyload"></div>' );
				unbindListenToClick( 'prev' );
			} else {
				_this.hideShowLinks();
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
					_this.currentCloned = container.children().last();
					settings.afterClone();
				}
			} else {
				var firstItemLeftValueInt = firstItemLeftValue();
				availableItems = getAvailableItems();
				for ( var j = 1; j <= elementsToMove; j++ ) {
					var clonedItemR = container.children().eq( availableItems - 1 ).clone( true );
					container.prepend( clonedItemR.css( 'left', firstItemLeftValueInt - getWidthPerItem() * j ) );
					_this.currentCloned = container.children().first();
					settings.afterClone();
				}
			}
		};

		this.checkForNewItems = function () {
			if ( _this.requestForAppendActive ) {
				var currentItemsLength = getAvailableItems();
				var lastItemLeftValueInt = lastItemLeftValue();
				container.append( _this.itemsToBeAdded );
				for (var i = currentItemsLength; i < getAvailableItems(); i++) {
					var leftValue = lastItemLeftValueInt + ( getWidthPerItem() * ( i - currentItemsLength + 1 ) );
					container.children().eq( i ).css( 'left', leftValue );
				}
				addStylesToItems( currentItemsLength, true );
				_this.requestForAppendActive = false;
				_this.itemsToBeAdded = '';
				availablePanes = getTotalPanes();
				activePaneActions();
			}
		};

		var activePaneActions = function () {
			if ( !_this.rotate ) {
				if ( _this.activePane > 1 ) {
					listenToClick( 'prev' );
				} else {
					unbindListenToClick( 'prev' );
				}
				if ( availablePanes > _this.activePane ) {
					listenToClick( 'next' );
				} else {
					unbindListenToClick( 'next' );
					// settings.lastPaneEvent();
				}
			}
		};

		var updateActivePane = function ( inc ) {
			if ( inc ) {
				if ( _this.activePane === availablePanes ) {
					_this.activePane = 1;
				} else {
					_this.activePane++;
				}
			} else {
				if ( _this.activePane === 1 ) {
					_this.activePane = availablePanes;
				} else {
					_this.activePane--;
				}
			}
			activePaneActions();
		};

		var checkForLastItemStatus = function () {
			if( _this.getLastItemStatus() ) {
				settings.lastPaneEvent();
			}
		};

		var resetAfterCompleteAnimation = function ( shiftedToLeft ) {
			_this.checkForNewItems();
			listenToClick( 'both' );
			countAnimate         = 1;
			shiftLeftCount       = 0;
			shiftRightCount      = 0;
			updateActivePane( shiftedToLeft );
			checkForLastItemStatus();
			settings.afterShift();
		};

		var setActiveItems = function ( shiftedToLeft ) {
			var lastActiveItem = 0;
			var countActiveView = 0;
			for ( var i = 0; i < getAvailableItems(); i++ ) {
				if ( container.children().eq( i ).hasClass( 'active-view' ) ) {
					countActiveView++;
					container.children().eq( i ).removeClass( 'active-view' );
					lastActiveItem = i;
				}
			}
			_this.lastCurrentActiveItem = lastActiveItem - ( countActiveView - elementsToMove );
			_this.firstActiveElement = lastActiveItem - countActiveView;
			if ( shiftedToLeft ) {
				for ( var i = 0; i < elementsToMove; i++ ) {
					container.children().eq( ++_this.lastCurrentActiveItem ).addClass( 'active-view' );
				}

			} else {
				for ( var i = 0; i < elementsToMove; i++ ) {
					container.children().eq( _this.firstActiveElement-- ).addClass( 'active-view' );
				}

			}
		};

		var setActiveRotatingItems = function () {
			container.children().removeClass( 'active-view' );
			for ( var i = 0; i < calcElementsToMove(); i++ ) {
				container.children().eq( i ).addClass( 'active-view' );
			}
		};

		var removeTempItems = function ( shiftedToLeft, callback ) {
			if ( countAnimate === getAvailableItems() ) {
				if ( _this.rotate ) {
					if ( shiftedToLeft ) {
						for ( var i = 1; i <= calcElementsToMove(); i++ ) {
							container.children().first().remove();
							if ( i === calcElementsToMove() ) {
								setActiveRotatingItems();
							}
						}
					} else {
						for ( var j = 1; j <= calcElementsToMove(); j++ ) {
							container.children().last().remove();
							if ( i === calcElementsToMove() ) {
								setActiveRotatingItems();
							}
						}
					}

				} else {
					setActiveItems ( shiftedToLeft );
				}
				callback();
			} else {
				countAnimate++;
			}
		};

		var checkEvent = function( isPrev , event ) {
			var arrows = [ '#' + settings.nextID, '#' + settings.prevID ];
			if ( event !== undefined ) {
				elementsToMove = calcElementsToMove();
				triggerLeaveHover( arrows[ isPrev ] );
			} else {
				elementsToMove = settings.elementsToMoveOnHover;
			}
		};

		var shiftLeft = function ( event ) {
			if ( !shiftLeftCount ) {
				elementsToMove = calcElementsToMove();
				settings.beforeShift();
				if ( event ) {
					checkEvent( 0 , event );
				}
				if ( _this.rotate ) {
					appendTempItems( true );
				}
				unbindListenToClick( 'both' );
				container.children().animate( {
					'left': moveby()
					}, {
						'duration' : 200,
						'start'    : function() {
						},
						'complete' : function () {
							removeTempItems( true, function () {
								resetAfterCompleteAnimation( true );
							} );
						}
				} );
			}
			shiftLeftCount++;
		};

		var shiftRight = function ( event ) {
			if( !shiftRightCount ) {
				elementsToMove = calcElementsToMove();
				settings.beforeShift();
				if ( event ) {
					checkEvent( 1 , event );
				}
				if ( _this.rotate ) {
					appendTempItems( false );
				}
				unbindListenToClick( 'both' );
				container.children().animate( {
					'left': movebyPrev()
					}, {
						'duration' : 200,
						'start'    : function() {
												},
						'complete' : function () {
													removeTempItems( false, function () {
														resetAfterCompleteAnimation( false );
													} );
												}
				} );
			}
			shiftRightCount++;
		};

		_this.seeNextItems = function () {
			shiftLeft();
		}

		_this.seePrevItems = function () {
			shiftRight();
		}
		_this.setActivePositions = function ( container ) {
			//container.find( 'active-view' )
			alignCenter( false );
		}

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

		var listenToClick = function ( element ) {
			switch ( element ) {
				case 'both' :
					$( '#' + settings.nextID ).on( 'click',  shiftLeft ).addClass( 'active' );
					$( '#' + settings.prevID ).on( 'click', shiftRight ).addClass( 'active' );
					break;
				case 'next' :
					$( '#' + settings.nextID ).on( 'click',  shiftLeft ).addClass( 'active' );
					break;
				case 'prev' :
					$( '#' + settings.prevID ).on( 'click',  shiftRight ).addClass( 'active' );
					break;
			}
		};

		var unbindListenToClick = function ( element ) {
			switch ( element ) {
				case 'both' :
					$( '#' + settings.nextID ).removeClass( 'active' );
					$( '#' + settings.prevID ).removeClass( 'active' );
					break;
				case 'next' :
					$( '#' + settings.nextID ).removeClass( 'active' );
					break;
				case 'prev' :
					$( '#' + settings.prevID ).removeClass( 'active' );
					break;
			}
		};

		this.updateItemStatus = function ( start ) {
			for ( var i = start; i < elementsToMove ; i++ ) {
				container.children().eq( i ).addClass( 'active-view' );
			}
		}

		this.rotateCarousel = function ( state ) {
			if ( state ) {
				listenToClick( 'both' );
			}
		};

		var shiftOnLastViewBeforeReset = function ( pane ) {
			var elementsToShift = pane + elementsToMove + 1;
			for ( var i = 0; i < getAvailableItems(); i++ ) {
				var moveByItem = getWidthPerItem() * ( i  - elementsToShift );
				container.children().eq( i ).css( 'left', moveByItem ).removeClass( 'active-view');
				if ( ( i >= elementsToShift ) && i < ( elementsToShift + elementsToMove ) ) {
					container.children().eq( i ).addClass( 'active-view' );
				}
			}
		}

		this.reset = function ( pane ) {
			container.children().first().css( 'left', 0 );
			this.initialize( false );
			_this.activePane = 1;
			shiftOnLastViewBeforeReset( pane );
		};

		this.shiftPanes = function ( panes ) {
			var elementsToShift = ( panes - 1 ) * elementsToMove;
			for ( var i = 0; i < getAvailableItems(); i++ ) {
				var moveByItem = getWidthPerItem() * ( i  - elementsToShift );
				container.children().eq( i ).css( 'left', moveByItem );
			}
			_this.activePane = panes;
		};

		this.initialize = function ( newInstance ) {
			setContainerWidth();
			appendPrevNextButtons( newInstance );
			if ( newInstance ) {
				_this.is_touch_device = 'ontouchstart' in document.documentElement;
				if ( _this.is_touch_device ) {
					container.addClass( 'container-touch' );
				}
				settings.onInitialize();
			};
			addStylesToItems( 0, true );
			if ( checkItemsTotal() ) {
				if ( _this.activePane === 1 && !_this.rotate ) {
					listenToClick( 'next' );
				} else {
					listenToClick( 'both' );
				}
				var shownElements = Math.floor( getparentHolderWidth() / getWidthPerItem() );
				fittedElements();
				listenToHover();
			}
		};

	};

	var initializeChangeWidth = function ( element, container ) {
		$( window ).resize( function () {
			container.setActivePositions( element );
			container.hideShowLinks( false );
		} );
	}

	var initializeSwipe = function ( element, container ) {
		var istouch = 'ontouchstart' in document.documentElement;
		if ( istouch ) {
			element.parent().swipe( {
				threshold        : 0,
				excludedElements : '.noSwipe, .sc-info-icon, .sc-watch-later-icon, .prevNext',
				swipeLeft        : function () {
					if ( element.parent().find( '.nextLink' ).first().hasClass( 'active' ) ) {
						container.seeNextItems();
					}
				},
				swipeRight       : function () {
					if ( element.parent().find( '.prevLink' ).first().hasClass( 'active' ) ) {
						container.seePrevItems();
					}
				}
			} );
		}
	}

	$.fn.carouselSnap = function ( options ) {
		return this.each( function ( key, value ) {
			var element      = $( this );
			var settings     = $.extend( {}, $.fn.carouselSnap.defaults, options );
			var carouselSnap = element.data( 'carouselSnap' );
			var newInstance  = false;
			if ( !carouselSnap ) {
				carouselSnap = new CarouselSnap( this, settings );
				element.data( 'carouselSnap', carouselSnap );
				newInstance = true;
				initializeSwipe( element, carouselSnap );
				initializeChangeWidth( element, carouselSnap );
			}
			carouselSnap.initialize( newInstance );
		} );
	};

	$.fn.carouselRotate = function ( state, callback ) {
		return this.each( function ( key, value ) {
			var carousel = $( this ).data( 'carouselSnap' );
			var success  = false;
			var msg      = 'Item not an instance of carouselSnap';
			if ( carousel ) {
				success         = true;
				carousel.rotate = state;
				carousel.rotateCarousel( state );
				msg = 'Successfully updated carousel rotate option';
			}
			if ( callback ) {
				callback( success, msg );
			}
		} );
	};

	$.fn.getActivePane = function ( callback ) {
		return this.each( function ( key, value ) {
			var carousel   = $( this ).data( 'carouselSnap' );
			var activePane = null;
			var msg        = 'Item not an instance of carouselSnap';
			if ( carousel ) {
				activePane = carousel.firstActiveElement;
				msg     = 'Active pane ' + activePane;
			}
			if ( callback ) {
				callback( activePane, msg );
			}
		} );
	};

	$.fn.lastItemActive = function ( callback ) {
		return this.each( function ( key, value ) {
			var carousel   = $( this ).data( 'carouselSnap' );
			var lastItemStatus = null;
			var msg        = 'Item not an instance of carouselSnap';
			if ( carousel ) {
				lastItemStatus = carousel.getLastItemStatus();
				msg     = 'Last item status - ACTIVE: ' + lastItemStatus;
			}
			if ( callback ) {
				callback( lastItemStatus, msg );
			}
		} );
	};

	$.fn.shiftOnPane = function ( pane, callback ) {
		return this.each( function ( key, value ) {
			var carousel = $( this ).data( 'carouselSnap' );
			var success  = null;
			var msg      = 'Item not an instance of carouselSnap';
			if ( carousel ) {
				carousel.reset( pane );
				msg     = 'Successfully shifted on pane ' + pane;
				success = true;
			}
			if ( callback ) {
				callback( success, msg );
			}
		} );
	};

	$.fn.shiftCarouselLeft = function ( callback ) {
		return this.each( function ( key, value ) {
			var carousel = $( this ).data( 'carouselSnap' );
			var success  = null;
			var msg      = 'Item not an instance of carouselSnap';
			if ( carousel ) {
				carousel.seeNextItems();
				msg     = 'Successfully left shifted ';
				success = true;
			}
			if ( callback ) {
				callback( success, msg );
			}
		} );
	};

	$.fn.shiftCarouselRight = function ( callback ) {
		return this.each( function ( key, value ) {
			var carousel = $( this ).data( 'carouselSnap' );
			var success  = null;
			var msg      = 'Item not an instance of carouselSnap';
			if ( carousel ) {
				carousel.seePrevItems();
				msg     = 'Successfully left shifted ';
				success = true;
			}
			if ( callback ) {
				callback( success, msg );
			}
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
				carousel.checkForNewItems();
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

	$.fn.currentClonedItem = function ( callback ) {
		return this.each( function ( key, value ) {
			var carousel   = $( this ).data( 'carouselSnap' );
			var itemCloned = null;
			var msg        = 'Item not an instance of carouselSnap';
			if ( carousel ) {
				itemCloned = carousel.currentCloned;
				msg     = 'Cuurently cloned item ' + itemCloned;
			}
			if ( callback ) {
				callback( itemCloned, msg );
			}
		} );
	};

	$.fn.carouselSnap.defaults = {
		nextID                : 'next-slide',
		prevID                : 'previous-slide',
		elementsToMoveOnClick : 1,
		elementsToMoveOnHover : 1,
		startOnCenter         : true,
		rotate                : true,
		time                  : 1000000000,
		beforeShift           : function () {},
		afterShift            : function () {},
		lastPaneEvent         : function () {},
		onInitialize          : function () {},
		responsive            : true,
		afterClone            : function () {}
	};

} )( jQuery );