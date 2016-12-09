
UnityEngine.Vector2 = function ( x, y ) {
	this.x = x || 0;
	this.y = y || 0;
};

UnityEngine.Vector2.prototype = {
	constructor: UnityEngine.Vector2,
	set: function(x, y) { this.x = x; this.y = y; },
    add: function(v) {
		this.x += v.x;
		this.y += v.y;
    },
	sub: function(v) {
		this.x -= v.x;
		this.y -= v.y;
	},
	dot: function(v) {
		return this.x * v.x + this.y * v.y;
	},
	multiply: function (v) {
		this.x *= v.x;
		this.y *= v.y;
		return this;
	},
	multiplyScalar: function ( scalar ) {
		if ( isFinite( scalar ) ) {
			this.x *= scalar;
			this.y *= scalar;
		} else {
			this.x = 0;
			this.y = 0;
		}
		return this;
	},
	divide: function ( v ) {
		this.x /= v.x;
		this.y /= v.y;
		return this;
	},
	divideScalar: function ( scalar ) {
		return this.multiplyScalar( 1 / scalar );
	},
	sqrMagnitude: function () {
		return this.x * this.x + this.y * this.y;
	},
	magnitude: function () {
		return Math.sqrt( this.x * this.x + this.y * this.y );
	},
};