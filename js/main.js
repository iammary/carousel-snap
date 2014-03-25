( function( $ ){

	var colorArrays     = [ 'black', 'red', 'green', 'blue' ];
	var color           = 0;
	var fetchMultiplier = 0;

	var removeElements = function ( e ) {
		var classname = $(e).attr('class').substring(7)
		$('.' + classname ).remove();
		$( '.vid-tab' ).carouselSnap( {
				updatePosition: true
			} );
	}


	/* Loading effect */
	var loadingEffect = {
		'show' :	function () {
								var x = 0;
								$( 'body' ).append( '<div id="loading"></div>' )
								setInterval( function () {
									x = ++x % 4;
									$( '#loading' ).html( 'loading' + Array( x + 1 ).join( '.' ) );
								}, 300 );
							},
		'hide' :	function () {
								$( '#loading' ).remove();
							}
	}

	var loadElements = function ( color, callback ) {

		/* Unbind trigger to API Call event */
		$( '#remove' ).off( 'click', removeElements );
		$( '#appendNow' ).off( 'click', loadMoreElements );

		color = color ? color : '';
		loadingEffect.show();

		/* new elements rendered */
		var items = '';

		/* API Call Simulation */
		setTimeout( function () {
			for( var j = 0; j < 4; j++ ) {
				for ( var i = 1; i <= 6; i++ ) {
					var countItem = i + ( j * 6 ) + ( fetchMultiplier * 24 );
					items = items + '<li class="dummy ' + color + '"><div class="divs">' + countItem + '</div></li>';
				}
			}
			fetchMultiplier++;
			// $( '#remove' ).on( 'click', removeElements );
			// $( '#appendNow' ).on( 'click', loadMoreElements );
			callback( items );
		}, 1000 )
	}

	loadElements( 0, function( items ) {
			$('.vid-tab').append( items );
			loadingEffect.hide();
			$( '.vid-tab' ).carouselSnap( {
				elementsToMoveOnClick: 4
			} );
			$('.vid-tab li').click(function( e ){
				removeElements( this )
			})
	} )

	var loadMoreElements = function () {
		loadElements( colorArrays[ color++ ], function( items ) {
			$('.vid-tab').carouselSnap.appendItems( items )
			loadingEffect.hide();
		} );
		color = ( color > 3 ) ? 0 : color;
	}

})( jQuery );