import Ember from 'ember';

import Maze from '../models/maze';

export default Ember.Object.extend({
	squareSize: 30,
	// Set maze scale (works when 'mazeDefault' is set to false)
	mazeScale: 12,
	// It's better to enable this option in dev mode
	mazeDefault: false,
	// '0' means space, '1' means block, '2' means space with pellet
	grids: [],

	initGrids: function() {
		if(this.get('mazeDefault')) {
			this.set('grids', [
			  	[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1],
			  	[0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 1],
			  	[0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1],
			  	[0, 0, 0, 0, 2, 2, 0, 1, 0, 2, 1, 0, 0, 1, 0, 1],
			  	[0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 0, 0, 1, 0, 1],
			  	[1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 1, 0, 1],
			  	[0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1],
			  	[0, 1, 0, 1, 0, 2, 2, 1, 0, 0, 0, 0, 0, 1, 0, 0],
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
	}
});