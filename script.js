// read: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
// READ: http://www.sitepoint.com/basic-animation-with-canvas-and-javascript/
// read: http://mdn.beonex.com/en/Canvas_tutorial/Optimizing_canvas.html

'use strict';









var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

context.fillStyle = '#00FF00';    // set a fill color

// 141 HTML color words 
var colors = [
	'AliceBlue',
	'AntiqueWhite',
	'Aqua',
	'Aquamarine',
	'Azure',
	'Beige',
	'Bisque',
	'Black',
	'BlanchedAlmond',
	'Blue',
	'BlueViolet',
	'Brown',
	'BurlyWood',
	'CadetBlue',
	'Chartreuse',
	'Chocolate',
	'Coral',
	'CornflowerBlue',
	'Cornsilk',
	'Crimson',
	'Cyan',
	'DarkBlue',
	'DarkCyan',
	'DarkGoldenRod',
	'DarkGray',
	'DarkGreen',
	'DarkKhaki',
	'DarkMagenta',
	'DarkOliveGreen',
	'DarkOrange',
	'DarkOrchid',
	'DarkRed',
	'DarkSalmon',
	'DarkSeaGreen',
	'DarkSlateBlue',
	'DarkSlateGray',
	'DarkTurquoise',
	'DarkViolet',
	'DeepPink',
	'DeepSkyBlue',
	'DimGray',
	'DodgerBlue',
	'FireBrick',
	'FloralWhite',
	'ForestGreen',
	'Fuchsia',
	'Gainsboro',
	'GhostWhite',
	'Gold',
	'GoldenRod',
	'Gray',
	'Green',
	'GreenYellow',
	'HoneyDew',
	'HotPink',
	'IndianRed ',
	'Indigo ',
	'Ivory',
	'Khaki',
	'Lavender',
	'LavenderBlush',
	'LawnGreen',
	'LemonChiffon',
	'LightBlue',
	'LightCoral',
	'LightCyan',
	'LightGoldenRodYellow',
	'LightGray',
	'LightGreen',
	'LightPink',
	'LightSalmon',
	'LightSeaGreen',
	'LightSkyBlue',
	'LightSlateGray',
	'LightSteelBlue',
	'LightYellow',
	'Lime',
	'LimeGreen',
	'Linen',
	'Magenta',
	'Maroon',
	'MediumAquaMarine',
	'MediumBlue',
	'MediumOrchid',
	'MediumPurple',
	'MediumSeaGreen',
	'MediumSlateBlue',
	'MediumSpringGreen',
	'MediumTurquoise',
	'MediumVioletRed',
	'MidnightBlue',
	'MintCream',
	'MistyRose',
	'Moccasin',
	'NavajoWhite',
	'Navy',
	'OldLace',
	'Olive',
	'OliveDrab',
	'Orange',
	'OrangeRed',
	'Orchid',
	'PaleGoldenRod',
	'PaleGreen',
	'PaleTurquoise',
	'PaleVioletRed',
	'PapayaWhip',
	'PeachPuff',
	'Peru',
	'Pink',
	'Plum',
	'PowderBlue',
	'Purple',
	'RebeccaPurple',
	'Red',
	'RosyBrown',
	'RoyalBlue',
	'SaddleBrown',
	'Salmon',
	'SandyBrown',
	'SeaGreen',
	'SeaShell',
	'Sienna',
	'Silver',
	'SkyBlue',
	'SlateBlue',
	'SlateGray',
	'Snow',
	'SpringGreen',
	'SteelBlue',
	'Tan',
	'Teal',
	'Thistle',
	'Tomato',
	'Turquoise',
	'Violet',
	'Wheat',
	'White',
	'WhiteSmoke',
	'Yellow',
	'YellowGreen' 	
];


var STATES = {
	move : 0,
	pause: false,
};

var score = 0;

var theSquare = {
	x : 200,
	y : 450,
	width : 100,
	height : 10,
	acceleration : 1,
	bounciness : 0.75,
	friction : 0.1,
	speed : 0
};

var theBalls = []; // please avoid immature jokes (remember there are no real privates in JS)

// Ponder: how about an assign function?
var ABall = function () {
	this.x = Math.random() * canvas.width;
	this.y = 0;
	this.maxSpeedX = 4;
	this.speedX = 0.25;
	this.speedY = 3;
	this.doomed = false;
};

ABall.prototype.move = function () {
	this.x += this.speedX;
	this.y += this.speedY;
};

ABall.prototype.checkCollisions = function () {
	
		// the ball hits the square (not to be mixed up with shit and fan)
		if (this.y > theSquare.y // the ball is lower than the square
			&& this.x > theSquare.x // the ball is right of the square's left corner
			&& this.x < theSquare.x + theSquare.width // the ball is left of the square's right corner
			&& this.y < theSquare.y + theSquare.height
		) {
			play_multi_sound('beepandbass');
			this.speedY = Math.abs(this.speedY) * -1;
			this.speedX = 
				this.maxSpeedX 
				* (this.x - theSquare.x - theSquare.width / 2) / (theSquare.width / 2); 
		}
		
		// ball hits the wall
		//     left wall
		if (this.x < 0) {
			play_multi_sound('flipper');
			this.x = 0;
			this.speedX *= -1;
		}
		
		//     right wall
		if (this.x > canvas.width) {
			play_multi_sound('flipper');
			this.x = canvas.width;
			this.speedX *= -1;
		}
		
		//     the ceiling
		if (this.y < 0) {
			play_multi_sound('flipper');
			this.y = 0;
			this.speedY *= -1;
		}
		
		//     the ground a.k.a. the death zone
		if (this.y > canvas.width) {
			play_multi_sound('crash');
			// reset the ball to starting position
			this.y = 0;
			this.speedY *= -1;
			this.doomed = true;
		}
} ;

ABall.prototype.checkForBlocks = function (allBlocks) {
	for (var i = 0; i < allBlocks.length; i++) {
		if (this.x > allBlocks[i].x
			&& this.x < allBlocks[i].x + allBlocks[i].width
			&& this.y > allBlocks[i].y
			&& this.y < allBlocks[i].y + allBlocks[i].height
		) {
			play_multi_sound('bliq');
			allBlocks[i].x += 1000;
			score++;
			this.speedY *= 1.02;
			
			var ballsOldPosition = {
				x : this.x - this.speedX,
				y : this.y - this.speedY
			};
			// Check if the ball did hit in y direction
			if (ballsOldPosition.x > allBlocks[i].x
				&& ballsOldPosition.x < allBlocks[i].x + allBlocks[i].width) {
				// if so reverse the y speed
				this.speedX *= -1;		
			} else {
				// otherwise take the x
				this.speedY *= -1;
			}
		}
	}
};

// ###

ABall.prototype.draw = function () {
		context.beginPath();
		context.arc(this.x, this.y, 4, 0, 2 * Math.PI, false);
		context.fillStyle = 'green';
		context.fill();
		context.lineWidth = 2;
		context.strokeStyle = '#003300';
		context.stroke();
};

theBalls.push(new ABall());
theBalls.push(new ABall());
theBalls.push(new ABall());
theBalls.push(new ABall()); // I said NO immature jokes...

console.log(theBalls);

var theBall = {
	x : Math.random() * canvas.width,
	y : 175,
	maxSpeedX : 4,
	speedX : 0.25,
	speedY : 3
};

// This is quick an dirty. Like most of this. So very dirty...
var theBlocks = function () {
	var blocks = [];
	for (var j = 0; j < 4; j++) {
		for (var i = 0; i < 9; i++) {
			blocks.push({
				color : colors[Math.floor(Math.random() * 141)],
				x : i * 50 + 25,
				y : j * 25 + 50,
				width : 40,
				height : 20
			});
		}
	}
	return blocks;
} ();

var renderABlock = function (aBlock) {
	context.fillStyle = aBlock.color;
	context.fillRect(
		aBlock.x,    	// upper left corner x
		aBlock.y,     	// upper left corner Y
		aBlock.width,	// width
        aBlock.height	// height
	);
	context.strokeStyle = "#000000";
    context.lineWidth   = 2;
	context.strokeRect(
		aBlock.x,    	// upper left corner x
		aBlock.y,     	// upper left corner Y
		aBlock.width,	// width
        aBlock.height	// height
	);
};

var checkCollision = function (aBlock) {
	// ball hits the block
	if (theBall.x > aBlock.x
		&& theBall.x < aBlock.x + aBlock.width
		&& theBall.y > aBlock.y
		&& theBall.y < aBlock.y + aBlock.height
	) {
		play_multi_sound('bliq');
		aBlock.x += 1000;
		score++;
		theBall.speedY *= 1.02;
		
		var ballsOldPosition = {
			x : theBall.x - theBall.speedX,
			y : theBall.y - theBall.speedY
		};
		// Check if the ball did hit in y direction
		if (ballsOldPosition.x > aBlock.x
			&& ballsOldPosition.x < aBlock.x + aBlock.width) {
			// if so reverse the y speed
			theBall.speedX *= -1;		
		} else {
			// otherwise take the x
			theBall.speedY *= -1;
		}
	}
};

var lastTimestamp = 0;
var averageTimePerFrame = 16;

var timepoint_1;
var timepoint_2;
var timepoint_average = 0;

//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
// THE LOOOP

var theLoop = function (timestamp) {
	
	timepoint_1 = window.performance.now();
	
	if ( ! STATES.pause) {
			
		//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
		// SQUARE
		
		// move the square
		theSquare.speed += (theSquare.acceleration * STATES.move);
		theSquare.speed *= 1 - theSquare.friction;
		theSquare.x += theSquare.speed;
		
		// square hits wall
		if (theSquare.x < 0) {
			if (theSquare.speed < -1.3) {
				play_multi_sound('switch');	
			}
			theSquare.x = 0;
			theSquare.speed *= - theSquare.bounciness;
		}
		
		// the right wall
		if (theSquare.x + theSquare.width > canvas.width) {
			if (theSquare.speed > 1.3) {
				play_multi_sound('switch');	
			}
			theSquare.x = canvas.width - theSquare.width;
			theSquare.speed *= - theSquare.bounciness;
		}
		
		//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
		// BALL
		
		// O.K. time to move this from one to many balls
		
		theBalls.forEach(function (aSingleBall) {
			aSingleBall.move();
		});
		
		theBalls.forEach(function (aSingleBall) {
			aSingleBall.checkCollisions();
		});
		
		// HACK!!!
		theBalls.forEach(function (aSingleBall, index, array) {
			if (aSingleBall.doomed) {
				console.log(88);
				theBalls.splice(index, 1);
			}
		});
		
		theBalls.forEach(function (aSingleBall) {
			aSingleBall.checkForBlocks(theBlocks);
		});
		/*
		// move the ball
		theBall.x += theBall.speedX;
		theBall.y += theBall.speedY;
		
		// the ball hits the square (not to be mixed up with shit and fan)
		if (theBall.y > theSquare.y // the ball is lower than the square
			&& theBall.x > theSquare.x // the ball is right of the square's left corner
			&& theBall.x < theSquare.x + theSquare.width // the ball is left of the square's right corner
			&& theBall.y < theSquare.y + theSquare.height
		) {
			play_multi_sound('beepandbass');
			theBall.speedY = Math.abs(theBall.speedY) * -1;
			theBall.speedX = 
				theBall.maxSpeedX 
				* (theBall.x - theSquare.x - theSquare.width / 2) / (theSquare.width / 2); 
		}
		
		// ball hits the wall
		//     left wall
		if (theBall.x < 0) {
			play_multi_sound('flipper');
			theBall.x = 0;
			theBall.speedX *= -1;
		}
		
		//     right wall
		if (theBall.x > canvas.width) {
			play_multi_sound('flipper');
			theBall.x = canvas.width;
			theBall.speedX *= -1;
		}
		
		//     the ceiling
		if (theBall.y < 0) {
			play_multi_sound('flipper');
			theBall.y = 0;
			theBall.speedY *= -1;
		}
		
		//     the ground a.k.a. the death zone
		if (theBall.y > canvas.width) {
			play_multi_sound('crash');
			// reset the ball to starting position
			
			theBall.y = 0;
			theBall.speedY *= -1;
		}
		
		
		
		//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
		// BLOCKS
		
		theBlocks.forEach(checkCollision);
		*/
		//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
		// RENDERINGS	
		
		timestamp = timestamp || 0;
	    // clear the canvas, otherwise moving objects will create ,lines‘
	    context.clearRect(0, 0, canvas.width, canvas.height);
		
		averageTimePerFrame = averageTimePerFrame * 0.95 + (timestamp - lastTimestamp) * 0.05;
		
		context.font = "12px Monaco";
		context.fillStyle = "red";
		context.fillText(averageTimePerFrame.toFixed(1), 10, 50);
		context.fillText(timepoint_average.toFixed(1), 10, 64);
		context.fillText('SCORE: ' + score, 10, 20);
		
		/*
		context.beginPath();
		context.arc(theBall.x, theBall.y, 4, 0, 2 * Math.PI, false);
		context.fillStyle = 'green';
		context.fill();
		context.lineWidth = 2;
		context.strokeStyle = '#003300';
		context.stroke();
		*/
		
		
		context.fillRect(
			theSquare.x,    	// upper left corner x
			theSquare.y,     	// upper left corner Y
			theSquare.width,	// width
	        theSquare.height	// height
		);
		
	    context.strokeStyle = "#000000";
	    context.lineWidth   = 2;
		context.strokeRect(
			theSquare.x,    	// upper left corner x
			theSquare.y,     	// upper left corner Y
			theSquare.width,	// width
	        theSquare.height	// height
		);
		
		theBalls.forEach(function (aSingleBall){
			aSingleBall.draw()
		});
		
		theBlocks.forEach(renderABlock);
		
		
		lastTimestamp = timestamp;
		timepoint_average = window.performance.now() - timepoint_1;
	}
	window.requestAnimationFrame(theLoop);
};

//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// call the requestAnimationFrame for the first time
window.requestAnimationFrame(theLoop);




document.addEventListener('keydown', function(event) {
	// Left was pressed
    if (event.keyCode == 37) { 
		STATES.move = - 1;
    }
	// Right was pressed
	if (event.keyCode == 39) {
        STATES.move = 1;
	}
	
    // alert('Key number ' + event.keyCode + ' was pressed');
	
    event.preventDefault();
}, true);

document.addEventListener('keyup', function(event) {
	// Left was pressed
    if (event.keyCode == 37) { 
		STATES.move = 0;
    }
	// Right was pressed
	if (event.keyCode == 39) {
        STATES.move = 0;
	}
	// P was pressed
	
	if (event.keyCode == 80) {
        STATES.pause = ! STATES.pause;
	}
	
    // alert('Key number ' + event.keyCode + ' was pressed');
	
    event.preventDefault();
}, true);

