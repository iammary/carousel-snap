Circular Carousel Snap
======================

A jQuery circular carousel plugin ready for lazy loading functionality.

### Demo

http://iammary.github.io/carousel-snap/

### How to use

1. Identify the container of the items

	```HTML
	<ul id="carousel">
		<li> 1 </li>
		<li> ... </li>
	</ul>
	```

2. Invoke the carouselSnap() function

	```JavaScript
	$( '#carousel' ).carouselSnap();
	```

### Additional Settings

Below is an example of the code with all available options and their defaults:

```JavaScript
$( '#carousel' ).carouselSnap( {
		nextID                : 'next-slide',
		prevID                : 'previous-slide',
		elementsToMoveOnClick : 1,
		elementsToMoveOnHover : 1,
		startOnCenter         : true,
		time                  : 10000,
		beforeShift           : function () {},
		afterShift            : function () {}
} );
```

### Exposed functions

1. Append Items - .carouselAppend( items, callback )

	```JavaScript
	var items = <li>1</li><li>2</li>
	$('#carousel').carouselAppend( items,
		function( res, msg) {

		/*
		*	Wherein 'res' is returned true after
		*	successful append and false otherwise.
		*	Corresponding 'msg' is returned as
		*	well to specify result details.
		*/

			console.log( msg )
		} )
	} )
	```

2. Remove - .carouselRemove( item, callback )

	```JavaScript
	$( '#carousel' ).carouselRemove()
	$('#carousel li').click( function () {
		$('#carousel').carouselRemove( this,
			function( res, msg) {
			/*
			*	Wherein 'res' is returned true after
			*	successful removal and false otherwise.
			*	Corresponding 'msg' is returned
			*	to specify result details.
			*/
			console.log( msg )
		} )
	} )
	```

### Code Reference

Checkout development branch at https://github.com/iammary/carousel-snap/tree/dev

