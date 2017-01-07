// Import Ember
import Ember from 'ember';

// Import models
import Pac from '../models/pac';

// Import mixins
import SharedStuff from '../mixins/shared-stuff';

// Import addons
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

// pac-man is an Ember Component
// Mixin the "KeyboardShortcuts" into this class
export default Ember.Component.extend(KeyboardShortcuts, SharedStuff, {
    
    score: 0,
    levelNumber: 1,
    
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
    
	// The lifecycle of a component in emberjs
	didInsertElement: function() {
		this.set('pac', Pac.create())
		// Init function
		this.loop();
	},

	drawPellet: function(x, y) {
	   let radiusDivisor = 6;
	   this.drawCircle(x, y, radiusDivisor, 'stopped');
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

	loop: function(){
	  	this.get('pac').move();

	  	this.processAnyPellets();

	  	this.clearScreen();
	  	this.drawGrid();
	  	this.get('pac').draw();

	  	Ember.run.later(this, this.loop, 1000/60);
	},

	processAnyPellets: function() {
	    let x = this.get('pac.x');
	    let y = this.get('pac.y');
	    let grids = this.get('grids');

	    if(grids[y][x] == 2) {
	    	// Increase score
	    	this.incrementProperty('score');
	 	    grids[y][x] = 0;

	 	    if(this.levelComplete()) {
		      this.incrementProperty('levelNumber');
		      this.restartLevel();
		    }
	    }
	},

	levelComplete: function() {
		let hasPelletsLeft = false;
	    let grids = this.get('grids');

	 	grids.forEach(row => {
	   	  	row.forEach(cell => {
	      		if(cell == 2) {
	        		hasPelletsLeft = true
	     		 }
	    	});
	 	});

	  	return !hasPelletsLeft;
	},

	restartLevel: function() {
	    this.set('pac.frameCycle', 0);
  		this.set('pac.direction', 'stopped');

	    let grids = this.get('grids');
	    grids.forEach((row, rowIndex) => {
	        row.forEach((cell, columnIndex) => {
	     		if(cell == 0){
	        		grids[rowIndex][columnIndex] = 2
	      		}
    		});
	  	});
	},

  	keyboardShortcuts: {
	    up: function() {
	    	this.set('pac.intent', 'up');
	    },
	    down: function() {
	    	this.set('pac.intent', 'down');
	    },
	    left: function() {
	    	this.set('pac.intent', 'left');
	    },
	    right: function() {
	    	this.set('pac.intent', 'right');
	    }
	},

});