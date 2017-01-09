import Ember from 'ember';

import SharedStuff from '../mixins/shared-stuff';
import Movement from '../mixins/movement';

export default Ember.Object.extend(SharedStuff, Movement, {
	direction: 'stopped',
	// The movement speed of ghost
	framesPerMovement: 30,
	init: function() {
		this.set('grids', this.get('level.grids'));
	},
	draw: function() {
		let x             = this.get('x');
		let y             = this.get('y');
		let squareSize    = this.get('squareSize');
		let radiusDivisor = 2;
		this.drawCircle(x, y, squareSize, radiusDivisor, this.get('direction'), '#F55');
	},

	changeDirection: function() {
		let directions = ['left', 'right', 'up', 'down'];
	  	let directionWeights = directions.map(direction => {
	    	return this.chanceOfPacmanIfInDirection(direction);
	  	});
	  	let bestDirection = this.getRandomItem(directions, directionWeights);

	  	this.set('direction', bestDirection);
	},

	chanceOfPacmanIfInDirection: function(direction) {
	  	if(this.pathBlockedInDirection(direction)){
	    	return 0;
	  	} else {
	    	let chances = ((this.get('pac.y') - this.get('y')) * this.get(`directions.${direction}.y`)) +
	                  ((this.get('pac.x') - this.get('x')) * this.get(`directions.${direction}.x`));
	    	return Math.max(chances, 0) + 0.2;
	  	}
	},

	getRandomItem: function(list, weight) {
	  	var totalWeight = weight.reduce(function (prev, cur) {
	      	return prev + cur;
	  	});

	  	var randomNum = Math.random() * totalWeight;
	  	var weightSum = 0;

	  	for (var i = 0; i < list.length; i++) {
	      	weightSum += weight[i];
	      	weightSum = Number(weightSum.toFixed(2));

	      	if (randomNum < weightSum) {
	          	return list[i];
	      	}
	  	}
	},
});