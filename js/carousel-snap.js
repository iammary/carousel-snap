/**************************************************************
 *
 * Carousel Snap 1.0
 *
 **************************************************************/

( function( $ ) {
	var CarouselSnap = function( element, options ) {
		var settings = $.extend( {}, $.fn.carouselSnap.defaults, options );
		var container = $( element );
		var containerLength = container.children().length * container.children().outerWidth( true );
		var setContainerWidth = function() {
			container.css( 'width', containerLength );
		};
		var appendPrevNextButtons = function() {
			container.after( '<div class="prevNext prevLink" id="' + settings.prevID + '">Previous</div><div class="prevNext nextLink" id="' + settings.nextID + '">Next</div>' );
		};
		var initialize = function() {
			appendPrevNextButtons();
			setContainerWidth();
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
	$.fn.carouselSnap.checkHover = function( element, callback ) {
		$( element ).hover( function( ) {
			//get start time
			$( this ).data( 'onHover', new Date().getTime() );
		}, function() {
			//get end time
			var outHover = new Date().getTime();
			//time is start
			var hoverTime = ( outHover - $( this ).data( 'onHover' ) ) / 1000;
			//return time in seconds
			callback( hoverTime );
		} );
	};

	$.fn.carouselSnap.defaults = {
		nextID: 'next-slide',
		prevID: 'previous-slide'
	};

} )( jQuery );