// ES6 import/export
import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

// pac-man is an Ember Component
// Mixin the "KeyboardShortcuts" into this class
export default Ember.Component.extend(KeyboardShortcuts, {
	x: 1,
    y: 2,
    squareSize: 40,
    canvasID: "myCanvas",
    // '0' means space, '1' means block, '2' means space with pellet
    grids: [
	  	[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
	  	[0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1],
	  	[0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1],
	  	[0, 0, 0, 0, 2, 2, 0, 1, 1, 1, 1],
	  	[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
	  	[1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
	  	[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
	  	[0, 1, 0, 1, 0, 2, 2, 1, 1, 1, 1],
	  	[0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1],
	  	[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
	  	[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
	  	[1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
	],
	screenHeight: Ember.computed(function() {
		return this.get('grids').length;
	}),
    screenWidth: Ember.computed(function() {
    	var gridsRow = this.get('grids').pop();
    	var gridWidth = gridsRow.length;
    	// Set back
    	this.get('grids').push(gridsRow);

    	return gridWidth;
    }),
    // The "computed property" will be cached
    screenPixelWidth: Ember.computed(function() {
	    return this.get('screenWidth') * this.get('squareSize');
	}),
	screenPixelHeight: Ember.computed(function() {
	    return this.get('screenHeight') * this.get('squareSize');
	}),
    // Turn ctx into a "computed property", we can use "this.get" to get it like a inner property
    ctx: Ember.computed(function() {
	    let canvas = document.getElementById(this.get("canvasID"));
	    let ctx = canvas.getContext("2d");
	    return ctx;
	}),
	// The lifecycle of a component in emberjs
	didInsertElement: function() {
		// Init function
		this.drawPac();
		this.drawGrid();
	},

	drawCircle(x, y, radiusDivisor) {
	   let ctx = this.get('ctx')
	   let squareSize = this.get('squareSize');

	   let pixelX = (x + 1/2) * squareSize;
	   let pixelY = (y + 1/2) * squareSize;

	   ctx.fillStyle = '#000';
	   ctx.beginPath();
	   ctx.arc(pixelX, pixelY, squareSize / radiusDivisor, 0, Math.PI * 2, false);
	   ctx.closePath();
	   ctx.fill();
	},

	drawPac() {
	   let x = this.get('x');
	   let y = this.get('y');
	   let radiusDivisor = 2;
	   this.drawCircle(x, y, radiusDivisor)
	},

	drawPellet(x, y) {
	   let radiusDivisor = 6;
	   this.drawCircle(x, y, radiusDivisor)
	},

	drawWalls: function(x, y) {
	    let squareSize = this.get('squareSize');
	    let ctx = this.get('ctx');
	    ctx.fillStyle = '#000';
		ctx.fillRect(x * squareSize,
                 	 y * squareSize,
                     squareSize,
                     squareSize);
	},

	drawGrid: function() {
	    let squareSize = this.get('squareSize');
	    let ctx = this.get('ctx');
	    ctx.fillStyle = '#000';

	    let grids = this.get('grids');
	    grids.forEach((grid, gridIndex) => {
	    	grid.forEach((mapPoint, mapPointIndex) => {
	    		if(mapPoint == 1) {
	    			this.drawWalls(mapPointIndex, gridIndex);
	    		}

	    		if(mapPoint == 2) {
	    			this.drawPellet(mapPointIndex, gridIndex);
	    		}
	    	});
	    });
	},

	clearScreen: function() {
	    let ctx = this.get('ctx');
	    ctx.clearRect(0, 0, this.get('screenPixelWidth'), this.get('screenPixelHeight'))
	},

	movePacMan: function(direction, amount) {
	    this.incrementProperty(direction, amount);

	    if(this.collidedWithBorder() || this.collidedWithWall()) {
	        this.decrementProperty(direction, amount)
	    }

	    this.processAnyPellets();
	    this.clearScreen();
	    // Repaint function
	    this.drawPac();
	    this.drawGrid();
	},

	processAnyPellets: function() {
	    let x = this.get('x');
	    let y = this.get('y');
	    let grids = this.get('grids');

	    if(grids[y][x] == 2){
	 	   grids[y][x] = 0;
	    }
	},
	// Detect if the PAC had been moved out of the board
	collidedWithBorder: function() {
	    let x = this.get('x');
	    let y = this.get('y');
	    let screenHeight = this.get('screenHeight');
	    let screenWidth = this.get('screenWidth');

	    let pacOutOfBounds = x < 0 ||
	                         y < 0 ||
	                         x >= screenWidth ||
	                         y >= screenHeight
	    return pacOutOfBounds;
	},

	collidedWithWall: function() {
	    let x = this.get('x');
  		let y = this.get('y');
  		return this.get('grids')[y][x] == 1;
	},

  	keyboardShortcuts: {
	    up: function() {
	        this.movePacMan('y', -1); 
	    },
	    down: function() {
	        this.movePacMan('y', 1); 
	    },
	    left: function() {
	        this.movePacMan('x', -1); 
	    },
	    right: function() {
	        this.movePacMan('x', 1); 
	    }
	},


});