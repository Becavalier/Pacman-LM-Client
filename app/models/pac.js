import Ember from 'ember';
import $ from 'jquery';

import SharedStuff from '../mixins/shared-stuff';
import Movement from '../mixins/movement';

export default Ember.Object.extend(SharedStuff, Movement, {
	x: 0,
    y: 0,
    direction: 'stopped',
    intent: 'stopped',
    // The movement speed of ghost
    framesPerMovement: 20,
    // The ability list of the pac
    abilityList: {
    	speedUp: {
    		need: 20,
    		value: 15
    	}
    },
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
	   this.drawCircle(x, y, this.get('squareSize'), radiusDivisor, this.get('direction'), '#17f300');
	   // Draw the shadow
	   this.drawLight(x, y, 4);
	},

	drawLight: function(x, y, radius) {
		let ctx = this.get('ctx');

		x = (x + 1/2 + this.offsetFor('x', this.get('direction'))) * this.get('squareSize');
	  	y = (y + 1/2 + this.offsetFor('y', this.get('direction'))) * this.get('squareSize');

		radius = this.get('squareSize') * radius;
		var radialGradient = ctx.createRadialGradient(x, y, 0, x, y, radius); 
		radialGradient.addColorStop(0, 'rgba(0, 0, 0, 0)'); 
		radialGradient.addColorStop(1, 'rgba(0, 0, 0, 1)'); 
		ctx.beginPath(); 
		ctx.arc(0, 0, 2 * this.get('level.screenPixelWidth'), 0, Math.PI * 2, true); 
		ctx.closePath(); 
		ctx.fillStyle = radialGradient; 
		ctx.fill(); 
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

		      	if($.type(roundOverCallback) === "function") {
		      		roundOverCallback.call(this);
		      	}
		    }
	    }
	},

	// Super abilities
	abilitySpeedUp: function() {
		let need  = this.get('abilityList.speedUp.need');
		let value = this.get('abilityList.speedUp.value');
		let score = this.get('scoreboard.score');

		if(score > need) {
			let defaultFramesPerMovement = this.get('framesPerMovement');
			this.set('framesPerMovement', value);
			this.set('scoreboard.score', score - need);
			Ember.run.later(this, function() {
				this.set('framesPerMovement', defaultFramesPerMovement);
			}, 5000);
		}
	},

	restart: function() {
		this.set('frameCycle', 0);
  		this.set('direction', 'stopped');
	},

});