/**************************************************************
 *
 * Carousel Snap 1.0
 *
 **************************************************************/

( function( $ ) {
	var CarouselSnap = function( element, options ) {

		var settings = $.extend( {}, $.fn.carouselSnap.defaults, options );

		var currentPane  = 0;
		var domReady     = true;
		var container    = $( element );
		var visibleItems = settings.elementsToMove;

		var itemLength;
		var containerLength;
		var currentTotalPanes;
		var paneToFetch;
		var totalPanes;

		var moveby = '-=' + ( container.children().outerWidth( true ) * visibleItems ) + 'px';
		var movebyPrev = '+=' + ( container.children().outerWidth( true ) * visibleItems ) + 'px';

		var setContainerWidth = function() {
			containerLength = container.children().length * container.children().outerWidth( true );
			container.css( 'width', containerLength );
		};
		var appendPrevNextButtons = function() {
			container.after( '<div class="prevNext prevLink" id="' + settings.prevID + '">Previous</div><div class="prevNext nextLink" id="' + settings.nextID + '">Next</div>' );
		};

		var listenToHover = function() {
			// $.fn.carouselSnap.checkHover( '#' + settings.nextID, function() {
			// 	if ( currentIndex < remainingPanes ) {
			// 		console.log( 'here' );
			// 		console.log( 'currentIndex next' + currentIndex );
			// 		console.log( 'remainingPanes ' + remainingPanes );
			// 		currentIndex++;
			// 		container.children().animate( {
			// 			'left': moveby
			// 		} );
			// 	}
			// } );

			// $.fn.carouselSnap.checkHover( '#' + settings.prevID , function() {
			// 	if ( currentIndex > 0 ) {
			// 		currentIndex--;
			// 		console.log( 'currentIndex' + currentIndex );
			// 		container.children().animate( {
			// 			'left': movebyPrev
			// 		} );
			// 	}
			// } );
		};

		var initializeSettings = function () {
			itemLength = 	container.children().length;
			paneToFetch = ( itemLength / visibleItems );
			currentTotalPanes = paneToFetch - 1;
			totalPanes = Math.ceil( ( settings.totalItems / visibleItems ) );
		}

		var fetchOnFirstPane = function () {
			settings.onFirstScroll( function( domCheck ) {
				domReady = domCheck;
			} );
			setContainerWidth();
			initializeSettings();
		}

		var listenToClick = function () {
			console.log(	'totalPanes: ' + totalPanes );
			console.log(	'currentPane: ' + (currentPane + 1) );
			console.log( 'currentTotalPanes: ' + (currentTotalPanes + 1) );
			$( '#' + settings.nextID ).click( function() {
				if( (currentPane < currentTotalPanes) && domReady ){
					if ( !currentPane ) {
						fetchOnFirstPane();
					}
					currentPane++;
					console.log(	'currentPane: ' + currentPane );
					console.log( 'currentTotalPanes: ' + ( currentTotalPanes + 1 ) );
					container.children().animate( { 'left': moveby } );
	      }
			})
			$( '#' + settings.prevID ).click( function() {
				if( currentPane > 0 ){
	        currentPane--;
	        console.log( 'currentPane: ' + (currentPane + 1) );
	        container.children().animate( { 'left': movebyPrev } );
	      }
			})
		}

		var initialize = function () {
			appendPrevNextButtons();
			setContainerWidth();
			initializeSettings();
			listenToClick();
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

	/**
	 * function to get time on how long did the user hover on the element.
	 * To use
	 * checkHover( '#theelement' , function( hoverTime){
	 *   code to do with the time;
	 * } )
	 * @param  html element The element to check.
	 * @param  function callback  Called when function is done.
	 * @return Object hoverTime The time it is hovering on the element in seconds.
	 */
	var timeoutId;
	$.fn.carouselSnap.checkHover = function( element, callback ) {
		$( element ).hover( function() {
			//start time
			if ( !timeoutId ) {
				timeoutId = window.setInterval( function() {
					callback();
				}, $.fn.carouselSnap.defaults.time );
			}
		}, function() {
			//reset time
			if ( timeoutId ) {
				window.clearInterval( timeoutId );
				timeoutId = null;
			}
		} );
	};

	$.fn.carouselSnap.defaults = {
		nextID: 'next-slide',
		prevID: 'previous-slide',
		elementsToMove: 3,
		time: 2000,
		loadPerFetch: 10,
		onFirstScroll: function( callback ) {
			callback( true );
		},
		totalItems: 60
	};

} )( jQuery );