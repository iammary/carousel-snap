/* global jQuery */

( function( $ ){

'use strict';

	var colorArrays     = [ 'black', 'red', 'green', 'blue' ];
	var color           = 0;
	var fetchMultiplier = 0;

	/* Loading effect */
	var loadingEffect = {
		'show' :	function () {
								var x = 0;
								$( 'body' ).append( '<div id="loading"></div>' );
								setInterval( function () {
									x = ++x % 4;
									$( '#loading' ).html( 'loading' + new Array( x + 1 ).join( '.' ) );
								}, 300 );
							},
		'hide' :	function () {
								$( '#loading' ).remove();
							}
	};

	var loadElements = function ( color, callback ) {

		color = color ? color : '';
		loadingEffect.show();

		/* new elements rendered */
		var items = '';

		/* API Call Simulation */
		setTimeout( function () {
			for( var j = 0; j < 4; j++ ) {
				for ( var i = 1; i <= 6; i++ ) {
					var countItem = i + ( j * 6 ) + ( fetchMultiplier * 4 );
					items = items + '<li class="dummy ' + color + '"><div class="divs">' + countItem + '</div></li>';
				}
			}
			fetchMultiplier++;
			callback( items );
		}, 1000 );
	};

	loadElements( 0, function( items ) {

			$('.vid-tab').append( items );
			loadingEffect.hide();

			$( '.vid-tab' ).carouselSnap( {
				elementsToMoveOnClick: 4,
				beforeShift: loadMoreElements
			} );

			$('.vid-tab li').click( function () {
				$('.vid-tab').carouselRemove( this,
					function ( res, msg) {
						console.log( msg );
				} );
			} );
	} );

	var loadMoreElements = function () {
		loadElements( colorArrays[ color++ ], function ( items ) {
			$('.vid-tab').carouselAppend( items,
				function ( res, msg ) {
					console.log( msg );
				}
			);
			loadingEffect.hide();
		} );
		color = ( color > 3 ) ? 0 : color;
	};

})( jQuery );