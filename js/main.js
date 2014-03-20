( function( $ ) {

	var colorArrays = [ 'black', 'red', 'green', 'blue' ];
	var color = 0;
	var fetchMultiplier = 0;

	/* Loading effect */
	var loadingEffect = {
		'show': function() {
			var x = 0;
			$( 'body' ).append( '<div id="loading"></div>' )
			setInterval( function() {
				x = ++x % 4;
				$( '#loading' ).html( 'loading' + Array( x + 1 ).join( '.' ) );
			}, 300 );
		},
		'hide': function() {
			$( '#loading' ).remove();
		}
	}

	var loadElements = function( color, callback ) {

		/* Unbind trigger to API Call event */
		$( '#appendNow' ).off( 'click', loadMoreElements );

		color = color ? color : '';
		loadingEffect.show();

		/* new elements rendered */
		var items = '';

		/* API Call Simulation */
		setTimeout( function() {
			for ( var j = 0; j < 4; j++ ) {
				for ( var i = 1; i <= 6; i++ ) {
					var countItem = i + ( j * 6 ) + ( fetchMultiplier * 24 );
					items = items + '<li class="dummy ' + color + '"><div>' + countItem + '</div></li>';
				}
			}
			fetchMultiplier++;
			$( '#appendNow' ).on( 'click', loadMoreElements );
			callback( items );
		}, 1000 )
	}

	loadElements( 0, function( items ) {
		$( '.vid-tab' ).append( items );
		loadingEffect.hide();
		$( '.vid-tab' ).carouselSnap( {
			nextID: 'next-slide',
			prevID: 'previous-slide',
			elementsToMove: 4,
			startOnCenter: false,
			time: 1500

		} );
	} )

	var loadMoreElements = function() {
		loadElements( colorArrays[ color++ ], function( items ) {
			$( '.vid-tab' ).carouselSnap.appendItems( items )
			loadingEffect.hide();
		} );
		color = ( color > 3 ) ? 0 : color;
	}

} )( jQuery );