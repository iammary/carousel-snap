/**************************************************************
 *
 * Circular Carousel Ready for Lazy Loading 1.0
 *
 **************************************************************/

( function ( $ ) {
	'use strict';

	var getAvailableItems = function ( container ) {
		return container.children().length;
	}

	var hidePrevNextLink = function ( container ) {
		container.parent().find('.prevNext').hide();
	}

	var getContainerWidth = function ( container ) {
		return getAvailableItems( container ) * container.children().outerWidth( true );
	}

	var getparentHolderWidth = function ( container ) {
		return container.parent().outerWidth();
	}

	var getWidthPerItem = function ( container ) {
		return container.children().outerWidth( true )
	}

	var setContainerWidth = function ( container ) {
		console.log( 'Container width ' + getContainerWidth( container )  )
		container.css( 'width', getContainerWidth( container ) );
	}

	var alignCenter = function ( container, alignFlag ) {
		var nonvisibleItems = ( getContainerWidth( container ) - getparentHolderWidth( container ) ) / getWidthPerItem( container );
		var itemsToShift;
		if ( alignFlag ) {
			itemsToShift = Math.floor( nonvisibleItems / 2 );
		} else {
			itemsToShift = 0;
		}
		for (var i = 0; i < getAvailableItems( container ); i++) {
			var moveByItem = getWidthPerItem( container ) * ( i  - itemsToShift );
			container.children().eq( i ).css( 'left', moveByItem )
		}
	}

	var addStylesToItems = function ( container, start, addClass ) {
		console.log( 'Available items ' + getAvailableItems( container ) )
		for (var i = start; i < getAvailableItems( container ); i++) {
			container.children().eq( i )
			.css( 'position', 'absolute' )
		}
		if ( addClass ) {
			for (var i = start; i < getAvailableItems( container ); i++) {
				container.children().eq( i )
				.addClass( 'carousel-snap-' + i );
			}
		}
	};

	var checkItemsTotal = function ( container, elementsToMove ) {
		if ( getAvailableItems( container ) <= elementsToMove ) {
			hidePrevNextLink( container );
			alignCenter( container, false );
			return false;
		} else {
			alignCenter( container, true );
			return true;
		}
	}

	var CarouselSnap = function ( element, options, pluginUsed ) {

		var bindactive= false;
		var requestForAppendActive = false;
		var itemsToBeAdded         = '';
		var requestForRemoveActive = true;
		var updatePositionActive   = true;

		var container;
		var widthPerItem;
		var elementsToMove;
		var containerWidth;
		var elementMain = $( element );

		var showMsg = function ( msg ) {
			//console.log( msg + ' from ' + $( elementMain ).parent().attr('id') )
		}
		var shiftLeftCount = 0;
		var shiftRightCount = 0;

		var settings          = $.extend( {}, $.fn.carouselSnap.defaults, options );
		elementsToMove    = settings.elementsToMove;
		container         = $( element );
		widthPerItem      = getWidthPerItem( container );
		var moveby            = '-=' + ( widthPerItem * elementsToMove ) + 'px';
		var movebyPrev        = '+=' + ( widthPerItem * elementsToMove ) + 'px';
		var availableItems    = getAvailableItems( container );
		var countAnimate      = 1;

		var initializeSettings = function () {
			//containerWidth = getContainerWidth( container );
		};

		var lastItemLeftValue = function () {
			showMsg( container.children().last() )
			return container.children().last().position().left
		}
		var firstItemLeftValue = function () {
			showMsg( container.children().last() )
			return container.children().first().position().left;
		}

		var appendTempItems = function ( shiftedToLeft ) {
			if ( shiftedToLeft ) {
				var lastItemLeftValueInt = lastItemLeftValue();
				for ( var i = 1; i <= settings.elementsToMove; i++ ) {
					var clonedItem = container.children().eq( i - 1 ).clone();
					container.append( clonedItem.css( 'left', lastItemLeftValueInt + widthPerItem * i ) );
				}
			} else {
				var firstItemLeftValueInt = firstItemLeftValue();
				availableItems = getAvailableItems( container )
				for ( var i = 1; i <= settings.elementsToMove; i++ ) {
					var clonedItem = container.children().eq( availableItems - 1 ).clone();
					console.log( 'first' + firstItemLeftValueInt )
					container.prepend( clonedItem.css( 'left', firstItemLeftValueInt - widthPerItem * i ) );
				}
			}
		}

		var checkForNewItems = function () {
			if ( requestForAppendActive ) {
				var currentItemsLength = getAvailableItems( container );
				var lastItemLeftValueInt = lastItemLeftValue();
				container.append( itemsToBeAdded );
				for (var i = currentItemsLength; i < getAvailableItems( container ); i++) {
					var leftValue = lastItemLeftValueInt + ( widthPerItem * ( i - currentItemsLength + 1 ) );
					container.children().eq( i ).css( 'left', leftValue );
				}
				addStylesToItems( container, currentItemsLength );
				requestForAppendActive = false;
				itemsToBeAdded = '';
			}
		};

		var removeTempItems = function ( shiftedToLeft ) {
			if ( countAnimate == getAvailableItems( container ) ) {
				if ( shiftedToLeft ) {
					for ( var i = 1; i <= settings.elementsToMove; i++ ) {
						console.log( 'remove first')
						container.children().first().remove();
					}
				} else {
					for ( var i = 1; i <= settings.elementsToMove; i++ ) {
						console.log( 'remove last' )
						container.children().last().remove();
					}
				}
				checkForNewItems();
				requestForRemoveActive = true;
				updatePositionActive   = true;
				showMsg( 'removeTempItems' );
				listenToClick();
				countAnimate = 1;
				shiftLeftCount = 0;
				shiftRightCount = 0;
			} else {
				countAnimate++;
			}
		}

		var shiftLeft = function () {
			console.log( 'bindactive: ' + bindactive  );
			if ( !shiftLeftCount ) {
				showMsg( 'shiftLeft' );
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
			console.log( 'bindactive: ' + bindactive  );
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
			bindactive = false;
			requestForRemoveActive = false;
			updatePositionActive   = false;
			$( '#' + settings.nextID ).off( 'click',  shiftLeft);
			$( '#' + settings.prevID ).off( 'click', shiftRight);
		}

		var listenToClick = function () {
			bindactive = true;
			showMsg( 'listenToClick' )
			//showMsg( container )
			$( '#' + settings.nextID ).on( 'click', shiftLeft);
			$( '#' + settings.prevID ).on( 'click', shiftRight);
		}






		var appendPrevNextButtons = function () {
			container.after( '<div class="prevNext prevLink" id="' + settings.prevID + '">Previous</div><div class="prevNext nextLink" id="' + settings.nextID + '">Next</div>' );
		};

		// $.fn.carouselSnap.appendItems = function ( items ) {
		// 	requestForAppendActive = true;
		// 	itemsToBeAdded = itemsToBeAdded + items;
		// }

		// $.fn.carouselSnap.removeItem = function ( itemClass, callback ) {
		// 	var el = container.find( itemClass );
		// 	if ( requestForRemoveActive && el.length ) {
		// 		var start = el.index() + 1;
		// 		for ( var i = start; i < getAvailableItems( container ); i++ ) {
		// 			var currentLeft = container.children().eq( i ).position().left;
		// 			container.children().eq( i ).css( 'left', currentLeft - widthPerItem )
		// 		}
		// 		el.remove();
		// 		callback ( true, 'Success' );
		// 	} else {
		// 		if ( el.length ) {
		// 			callback( false, 'Dom not ready' );
		// 		} else {
		// 			callback( false, 'Item not found' );
		// 		}
		// 	}
		// }

		var updateItemPosition = function ( callback ) {
			availableItems = getAvailableItems( container );
			if ( getAvailableItems( container ) ) {
				for ( var i = 1; i < getAvailableItems( container ); i++ ) {
					var previousLeft = container.children().eq( i-1 ).position().left;
					container.children().eq( i ).css( 'left', previousLeft + widthPerItem )
					container.children().eq( i ).css( 'position', 'absolute' )
				}
				// for ( var i = 0; i < getAvailableItems( container ); i++ ) {
				// 	var currentLeft = container.children().eq( i ).position().left;
				// 	container.children().eq( i ).css( 'left', currentLeft + widthPerItem )
				// 	container.children().eq( i ).css( 'position', 'absolute' )
				// }
				checkItemsTotal( container, elementsToMove );
				callback ( true, 'Success' );
			} else {
				callback( false, 'Dom not ready' );
			}
		}
		var initialize = function () {
			// if ( pluginUsed ) {
			// 	unbindListenToClick();
			// 	console.log( '<<<<< Updating Position >>>>>' )
			// 	// updateItemPosition( function( success ) {
			// 	// 	if ( success ) {
			// 	//
			// 	// 	}
			// 	// });
			// 	if ( checkItemsTotal( container, elementsToMove ) ) {
			// 		if ( getAvailableItems( container ) > elementsToMove ) {
			// 			container.parent().find('.prevNext').show();
			// 		} else {
			// 			container.parent().find('.prevNext').hide();
			// 		}
			// 	}
			// 	setContainerWidth( container );
			// 	addStylesToItems( container, 0 );

			// 	if ( checkItemsTotal( container, elementsToMove ) ) {
			// 		listenToClick();
			// 	}
			// } else {
			if ( settings.updatePosition ) {
				updateItemPosition( function( res ) {
					setContainerWidth( container );
					console.log( 'Update result: ' + res )
				} )
			} else {
				var addClass = false;
				setContainerWidth( container );
				if ( !pluginUsed ) {
					appendPrevNextButtons();
					addClass = true;
				}
				addStylesToItems( container, 0, addClass );
				if ( checkItemsTotal( container, elementsToMove ) ) {
					listenToClick();
				}
				initializeSettings();
			}

			//}
		};
		initialize();
	};

	$.fn.carouselSnap = function ( options ) {
		return this.each( function ( key, value ) {
			var element = $( this );
			var settings  = $.extend( {}, $.fn.carouselSnap.defaults, options );
			console.log( '**********************************************' )
			console.log( 'Initalizing ' + element.parent().attr('id') );
			console.log( '**********************************************' )
			// console.log( 'items before condition ' + element.children().length )
			console.log( ' items on plugin call ' + element.children().length );

			var pluginUsed = false;
			if ( element.data( 'carouselSnap' ) ) {
				console.log( 'reusing' )
				pluginUsed = true;
			}

			// 	console.log( 'Rerendering ' + element.parent().attr('id') )
			// 	console.log( 'items ' + element.children().length )
			// 	if ( element.children().length <= settings.elementsToMove ) {
			// 		// console.log( 'hidePrevNextLink' )
			// 		// addStylesToItems( element, 0 );
			// 		// checkItemsTotal( element, settings.elementsToMove );
			// 		element.parent().find('.prevNext').hide();
			// 	} else {
			// 		element.parent().find('.prevNext').show();
			// 		// setContainerWidth( element );
			// 		// addStylesToItems( element, 0 );
			// 	}
			// 	setContainerWidth( element );
			// 	addStylesToItems( element, 0 );
			// 	checkItemsTotal( element, settings.elementsToMove );
			// 	return element.data( 'carouselSnap' );
			// }
			var carouselSnap = new CarouselSnap( this, options, pluginUsed );
			element.data( 'carouselSnap', carouselSnap );
		} );
	};



	$.fn.carouselSnap.defaults = {
		nextID: 'next-slide',
		prevID: 'previous-slide',
		elementsToMove: 4,
		startOnCenter: true,
		updatePosition: false
	};

} )( jQuery );