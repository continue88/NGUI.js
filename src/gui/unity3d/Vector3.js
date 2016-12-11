
UnityEngine.Vector3 = function ( x, y, z ) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
};

UnityEngine.Vector3.prototype = {
	constructor: UnityEngine.Vector3,
	set: function(x, y, z) { this.x = x; this.y = y; this.z = z; },
	add: function(v) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
	},
	sub: function(v) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
	},
	dot: function(v) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	},
	multiply: function (v) {
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
		return this;
	},
	multiplyScalar: function ( scalar ) {
		if ( isFinite( scalar ) ) {
			this.x *= scalar;
			this.y *= scalar;
			this.z *= scalar;
		} else {
			this.x = 0;
			this.y = 0;
			this.z = 0;
		}
		return this;
	},
	divide: function ( v ) {
		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;
		return this;
	},
	divideScalar: function ( scalar ) {
		return this.multiplyScalar( 1 / scalar );
	},
	sqrMagnitude: function () {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	},
	magnitude: function () {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	},
};