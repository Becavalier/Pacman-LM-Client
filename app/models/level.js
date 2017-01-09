import Ember from 'ember';

import Maze from '../models/maze';

import SharedStuff from '../mixins/shared-stuff';

export default Ember.Object.extend(SharedStuff, {
	squareSize: 30,
	// Set maze scale (works when 'mazeDefault' is set to false)
	mazeScale: 5,
	// It's better to enable this option in dev mode
	mazeDefault: false,
	// '0' means space, '1' means block, '2' means space with pellet
	grids: [],

	initGrids: function() {
		if(this.get('mazeDefault')) {
			this.set('grids', [
			  	[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1],
			  	[0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
			  	[0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1],
			  	[0, 0, 0, 0, 2, 2, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
			  	[0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1],
			  	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
			  	[0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1],
			  	[0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
			  	[0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1],
			  	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			  	[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1],
			  	[1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1],
			  	[0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1],
			  	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			  	[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1],
			  	[1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1],
			]);
		} else {
			if(this.get('grids').length === 0) {
				this.set('grids', Maze.create().generate(this.get('mazeScale')));
			} 
		}
	},

	screenHeight: Ember.computed(function() {
		return this.get('grids').length;
	}),

    screenWidth: Ember.computed(function() {
    	return this.get('grids').length;
    }),

    // The "computed property" will be cached
    screenPixelWidth: Ember.computed(function() {
	    return this.get('screenWidth') * this.get('squareSize');
	}),

	screenPixelHeight: Ember.computed(function() {
	    return this.get('screenHeight') * this.get('squareSize');
	}),

	isComplete: function() {
	    let hasPelletsLeft = false;
	    let grid = this.get('grids');

	    grid.forEach(row => {
	      	row.forEach(cell => {
	        	if(cell === 2){
	          		hasPelletsLeft = true;
	        	}
	      	});
	    });

	    return !hasPelletsLeft;
	},

	restart: function() {
		let grids = this.get('grids');
	    grids.forEach((row, rowIndex) => {
	        row.forEach((cell, columnIndex) => {
	     		if(cell === 0){
	        		grids[rowIndex][columnIndex] = 2;
	      		}
    		});
	  	});
	},

	drawPellet: function(x, y) {
	   let radiusDivisor = 6;
	   this.drawCircle(x, y, this.get('squareSize'), radiusDivisor, 'stopped', '#616161');
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
	    let ctx = this.get('ctx');
	    ctx.fillStyle = '#000';

	    let grids = this.get('grids');
	    grids.forEach((grid, gridIndex) => {
	    	grid.forEach((mapPoint, mapPointIndex) => {
	    		if(mapPoint === 1) {
	    			this.drawWalls(mapPointIndex, gridIndex);
	    		}

	    		if(mapPoint === 2) {
	    			this.drawPellet(mapPointIndex, gridIndex);
	    		}
	    	});
	    });
	},

	clearScreen: function() {
	    let ctx = this.get('ctx');
	    ctx.clearRect(0, 0, this.get('screenPixelWidth'), this.get('screenPixelHeight'));
	},

});