// read: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
// READ: http://www.sitepoint.com/basic-animation-with-canvas-and-javascript/
// read: http://mdn.beonex.com/en/Canvas_tutorial/Optimizing_canvas.html

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

context.fillStyle = '#00FF00';	// set a fill color

var theLoop = function (timestamp) {	
	timestamp = timestamp || 0;
	// clear the canvas, otherwise moving objects will create ,lines‘
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillRect(
		  0 + timestamp / 100	// upper left corner x
		, 0 + timestamp / 50	// upper left corner Y
		,50						// width
		,50);					// height
	window.requestAnimationFrame(theLoop);
};

// call the requestAnimationFrame for the first time
window.requestAnimationFrame(theLoop);


