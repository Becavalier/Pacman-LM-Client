import Ember from 'ember';

export default Ember.Mixin.create({
	canvasID: "myCanvas",
	// Set animation frames
    frameCycle: 1,
	framesPerMovement: 12,
	directions: {
	    'up': {
	    	x: 0, 
	    	y: -1
	    },
	    'down': {
	    	x: 0, 
	    	y: 1
	    },
	    'left': {
	    	x: -1, 
	    	y: 0
	    },
	    'right': {
	    	x: 1, 
	    	y: 0
	    },
	    'stopped': {
	    	x: 0, 
	    	y: 0
	    }
	},
	// Turn ctx into a "computed property", we can use "this.get" to get it like a inner property
    ctx: Ember.computed(function() {
	    let canvas = document.getElementById(this.get("canvasID"));
	    let ctx = canvas.getContext("2d");
	    return ctx;
	}),

	drawCircle: function(x, y, squareSize, radiusDivisor, direction, color = '#000') {
	    let ctx = this.get('ctx');

	  	let pixelX = (x + 1/2 + this.offsetFor('x', direction)) * squareSize;
	  	let pixelY = (y + 1/2 + this.offsetFor('y', direction)) * squareSize;

	  	ctx.fillStyle = color;
	  	ctx.beginPath();
	  	ctx.arc(pixelX, pixelY, squareSize/radiusDivisor, 0, Math.PI * 2, false);
	  	ctx.closePath();
	  	ctx.fill();
	},

	offsetFor: function(coordinate, direction) {
	  	let frameRatio = this.get('frameCycle') / this.get('framesPerMovement');
	  	return this.get(`directions.${direction}.${coordinate}`) * frameRatio;
	}

});