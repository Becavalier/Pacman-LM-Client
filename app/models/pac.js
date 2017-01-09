import Ember from 'ember';

import SharedStuff from '../mixins/shared-stuff';
import Movement from '../mixins/movement';

export default Ember.Object.extend(SharedStuff, Movement, {
	x: 0,
    y: 0,
    direction: 'stopped',
    intent: 'stopped',

    init: function() {
    	// Variables
		this.set('grids', this.get('level.grids'));
		this.set('squareSize', this.get('level.squareSize'));
		// Methods
		this.set('isComplete', this.get('level.isComplete'));
	},

    draw: function() {
	   let x = this.get('x');
	   let y = this.get('y');
	   let radiusDivisor = 2;
	   this.drawCircle(x, y, this.get('squareSize'), radiusDivisor, this.get('direction'), '#5F5');
	},

	changeDirection: function() {
		let intent = this.get('intent');
	    if(this.pathBlockedInDirection(intent)) {
	      	this.set('direction', 'stopped');
	    } else {
	      	this.set('direction', intent);
	    }
	},

	processAnyPellets: function(roundOverCallback) {
	    let x = this.get('x');
	    let y = this.get('y');
	    let grids = this.get('grids');

	    if(grids[y][x] === 2) {
	    	// Increase score
	    	this.incrementProperty('scoreboard.score');
	 	    grids[y][x] = 0;

	 	    if(this.isComplete()) {
		      	this.incrementProperty('scoreboard.levelNumber');
		      	this.set('intent', 'stopped');

		      	roundOverCallback && roundOverCallback();
		    }
	    }
	},

	restart: function() {
		this.set('frameCycle', 0);
  		this.set('direction', 'stopped');
	}

});