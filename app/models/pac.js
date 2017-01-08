import Ember from 'ember';

import SharedStuff from '../mixins/shared-stuff';

export default Ember.Object.extend(SharedStuff, {
	x: 0,
    y: 0,
    direction: 'stopped',
    intent: 'stopped',

    draw: function() {
	   let x = this.get('x');
	   let y = this.get('y');
	   let radiusDivisor = 2;
	   this.drawCircle(x, y, this.get('squareSize'), radiusDivisor, this.get('direction'));
	},

	changeDirection: function() {
		let intent = this.get('intent');
	    if(this.pathBlockedInDirection(intent)) {
	      	this.set('direction', 'stopped');
	    } else {
	      	this.set('direction', intent);
	    }
	},

	pathBlockedInDirection: function(direction) {
		// Get floor type
	    let cellTypeInDirection = this.cellTypeInDirection(direction);
	    // If floor is a block(1 or undefined)?
	    return Ember.isEmpty(cellTypeInDirection) || cellTypeInDirection === 1;
	},

	cellTypeInDirection: function(direction) {
	    let nextX = this.nextCoordinate('x', direction);
	    let nextY = this.nextCoordinate('y', direction);

	    return this.get(`grids.${nextY}.${nextX}`);
	},

	nextCoordinate: function(coordinate, direction) {
	  	return this.get(coordinate) + this.get(`directions.${direction}.${coordinate}`);
	},

	move: function() {
	  	if(this.animationCompleted()) {
	    	this.finalizeMove();
	    	this.changeDirection();
	  	} else if(this.get('direction') == 'stopped') {
	    	this.changeDirection();
	  	} else {
	    	this.incrementProperty('frameCycle');
	  	}
	},

	animationCompleted: function() {
	  	return this.get('frameCycle') == this.get('framesPerMovement');
	},

	finalizeMove: function() {
	  	let direction = this.get('direction');
	  	this.set('x', this.nextCoordinate('x', direction));
	  	this.set('y', this.nextCoordinate('y', direction));

	  	this.set('frameCycle', 1);
	},

	restart: function() {
		this.set('frameCycle', 0);
  		this.set('direction', 'stopped');
	}

});