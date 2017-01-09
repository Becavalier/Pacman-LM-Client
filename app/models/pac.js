import Ember from 'ember';

import SharedStuff from '../mixins/shared-stuff';
import Movement from '../mixins/movement';

export default Ember.Object.extend(SharedStuff, Movement, {
	x: 0,
    y: 0,
    direction: 'stopped',
    intent: 'stopped',

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

	restart: function() {
		this.set('frameCycle', 0);
  		this.set('direction', 'stopped');
	}

});