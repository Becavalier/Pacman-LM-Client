// Import Ember
import Ember from 'ember';

// Import models
import Pac from '../models/pac';
import Level from '../models/level';
import Ghost from '../models/ghost';

// Import mixins
import SharedStuff from '../mixins/shared-stuff';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

// Mixin "KeyboardShortcuts" addon into this class
export default Ember.Component.extend(KeyboardShortcuts, SharedStuff, {

	defaultMazeScale: 10,
	scoreboard: {
		score: 0,
		levelNumber: 1
	},

    init: function() {
    	this._super();
    	this.set('level', Level.create({
    		mazeScale: this.get('defaultMazeScale')
    	}));
    	this.get('level').initGrids();

    	this.set('pac', Pac.create({
    		x: 0,
    		y: 0,
		  	level: this.get('level'),
		  	scoreboard: this.get('scoreboard')
		}));

    	// Variables used by view
		this.set('screenPixelWidth', this.get('level.screenPixelWidth'));
		this.set('screenPixelHeight', this.get('level.screenPixelHeight'));

		this.set('ghost', Ghost.create({
			x: 2 * (this.get('defaultMazeScale') - 1),
			y: 2 * (this.get('defaultMazeScale') - 1),
			level: this.get('level'),
			squareSize: this.get('level.squareSize'),
			pac: this.get('pac')
		}));
    },

	// The lifecycle of a component in emberjs
	didInsertElement: function() {
		// Init function
		this.loop();
	},

	loop: function() {
	  	this.get('pac').move();
	  	this.get('ghost').move();

	  	// Main logic
	  	this.get('pac').processAnyPellets(() => {
	  		this.restart();
	  	});

	  	this.get('level').clearScreen();
	  	this.get('level').drawGrid();
	  	this.get('pac').draw();
	  	this.get('ghost').draw();

	  	Ember.run.later(this, this.loop, 1000/60);
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