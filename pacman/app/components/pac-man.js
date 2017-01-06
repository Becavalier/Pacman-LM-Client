// ES6 import/export
import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

// pac-man is an Ember Component
// Mixin the "KeyboardShortcuts" into this class
export default Ember.Component.extend(KeyboardShortcuts, {
	x: 1,
    y: 2,
    squareSize: 40,
    canvasID: "myCanvas",
    screenWidth: 20,
    screenHeight: 15,
    // The "computed property" will be cached
    screenPixelWidth: Ember.computed(function(){
	    return this.get('screenWidth') * this.get('squareSize');
	}),
	screenPixelHeight: Ember.computed(function() {
	    return this.get('screenHeight') * this.get('squareSize');
	}),
    // Turn ctx into a "computed property", we can use "this.get" to get it like a inner property
    ctx: Ember.computed(function(){
	    let canvas = document.getElementById(this.get("canvasID"));
	    let ctx = canvas.getContext("2d");
	    return ctx;
	}),
	// The lifecycle of a component in emberjs
	didInsertElement: function() {
		this.drawCircle();
	},

	drawCircle: function() {
	    let ctx = this.get('ctx');
	    let x = this.get('x');
	    let y = this.get('y');
	    let squareSize = this.get('squareSize');

	    let pixelX = (x + 1/2) * squareSize;
	    let pixelY = (y + 1/2) * squareSize;

	    ctx.fillStyle = '#000';
	    ctx.beginPath();
	    ctx.arc(pixelX, pixelY, squareSize/2, 0, Math.PI * 2, false);
	    ctx.closePath();
	    ctx.fill();
	},

	clearScreen: function(){
	    let ctx = this.get('ctx');
	    ctx.clearRect(0, 0, this.get('screenPixelWidth'), this.get('screenPixelHeight'))
	},

	movePacMan: function(direction, amount){
	    this.incrementProperty(direction, amount);

	    if(this.collidedWithBorder()) {
	        this.decrementProperty(direction, amount)
	    }

	    this.clearScreen();
	    this.drawCircle();
	},
	// Detect if the PAC had been moved out of the board
	collidedWithBorder: function(){
	    let x = this.get('x');
	    let y = this.get('y');
	    let screenHeight = this.get('screenHeight');
	    let screenWidth = this.get('screenWidth');

	    let pacOutOfBounds = x < 0 ||
	                         y < 0 ||
	                         x >= screenWidth ||
	                         y >= screenHeight
	    return pacOutOfBounds;
	},

  	keyboardShortcuts: {
	    up: function() {
	        this.movePacMan('y', -1); 
	    },
	    down: function() {
	        this.movePacMan('y', 1); 
	    },
	    left: function() {
	        this.movePacMan('x', -1); 
	    },
	    right: function() {
	        this.movePacMan('x', 1); 
	    }
	},


});