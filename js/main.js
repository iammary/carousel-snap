/* global jQuery */

( function( $ ){

'use strict';

	var colorArrays     = [ 'black', 'red', 'green', 'blue' ];
	var color           = 0;
	var fetchMultiplier = 0;
	var fetchCounter    = 0;
	var countItem       = 1;

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
					items = items + '<li class="dummy ' + color + '"><div class="divs">' + countItem++ + '</div></li>';
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
				elementsToMoveOnClick : 4,
				startOnCenter         : false,
				beforeShift : function () {
					$('.vid-tab').getActivePane( function ( pane, msg ) {
						console.log( msg );
					} );
				},
				lastPaneEvent : function () {
					console.log( '*******last pane ko' );
					if ( fetchCounter < 1 ) {
						loadMoreElements();
					} else if ( fetchCounter === 1 ) {
						console.log( 'main rotate' );
						$('.vid-tab').carouselRotate( true );
					}
					fetchCounter++;
				}
			} );

			$('.vid-tab li').click( function () {
				$('.vid-tab').carouselRemove( this,
					function ( res, msg) {
						console.log( msg );
				} );
			} );
			$( '#shiftonpane' ).click( function() {
				$('.vid-tab').shiftOnPane( 5, function ( success, msg ) {
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