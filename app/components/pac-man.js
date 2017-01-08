// Import Ember
import Ember from 'ember';

// Import models
import Pac from '../models/pac';
import Level from '../models/level';

// Import mixins
import SharedStuff from '../mixins/shared-stuff';

// Import addons
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

// pac-man is an Ember Component
// Mixin "KeyboardShortcuts" addon into this class
export default Ember.Component.extend(KeyboardShortcuts, SharedStuff, {
    
    score: 0,
    levelNumber: 1,
    
    init: function() {
    	this._super();
    	this.set('level', Level.create());
    	this.get('level').initGrids();

    	this.set('pac', Pac.create({
		  	grids: this.get('level.grids'),
		  	squareSize: this.get('level.squareSize')
		}));

		this.set('screenPixelWidth', this.get('level.screenPixelWidth'));
		this.set('screenPixelHeight', this.get('level.screenPixelHeight'));
    },

	// The lifecycle of a component in emberjs
	didInsertElement: function() {
		// Init function
		this.loop();
	},

	drawPellet: function(x, y) {
	   let radiusDivisor = 6;
	   this.drawCircle(x, y, this.get('level.squareSize'), radiusDivisor, 'stopped');
	},

	drawWalls: function(x, y) {
	    let squareSize = this.get('level.squareSize');
	    let ctx = this.get('ctx');
	    ctx.fillStyle = '#000';
		ctx.fillRect(x * squareSize,
                 	 y * squareSize,
                     squareSize,
                     squareSize);
	},

	drawGrid: function() {
	    let squareSize = this.get('level.squareSize');
	    let ctx = this.get('ctx');
	    ctx.fillStyle = '#000';

	    let grids = this.get('level.grids');
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
	    ctx.clearRect(0, 0, this.get('level.screenPixelWidth'), this.get('level.screenPixelHeight'));
	},

	loop: function() {
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
	    let grids = this.get('level.grids');

	    if(grids[y][x] == 2) {
	    	// Increase score
	    	this.incrementProperty('score');
	 	    grids[y][x] = 0;

	 	    if(this.get('level').isComplete()) {
		      this.incrementProperty('levelNumber');
		      this.restart();
		    }
	    }
	},

	restart: function() {
		this.get('pac').restart();
  		this.get('level').restart();	    
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