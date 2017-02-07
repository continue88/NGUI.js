
UnityEngine.Vector3 = function ( x, y, z ) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
};

UnityEngine.Vector3.SqrMagnitude = function(v1, v2) {
	if (v2 === undefined)
		return v1.x * v1.x + v1.y * v1.y + v1.z * v1.z;
	var x = v1.x - v2.x,
		y = v1.y - v2.y,
		z = v1.z - v2.z;
	return x * x + y * y + z * z;
}

UnityEngine.Vector3.Distance = function(v1, v2) {
	var x = v1.x - v2.x,
		y = v1.y - v2.y,
		z = v1.z - v2.z;
	return Math.sqrt(x * x + y * y + z * z);
}

UnityEngine.Vector3.prototype = {
	constructor: UnityEngine.Vector3,
	set: function(x, y, z) { this.x = x; this.y = y; this.z = z; return this; },
	setv: function(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; },
	clone: function () { return new this.constructor( this.x, this.y, this.z ); },
	add: function(v) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	},
	sub: function(v) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	},
	dot: function(v) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	},
	cross: function(v) {
		return new UnityEngine.Vector3(
			this.y * v.z - this.z * v.y,
			this.z * v.x - this.x * v.z,
			this.x * v.y - this.y * v.x);
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
	normalize: function() {
		return this.multiplyScalar(1 / this.magnitude());
	},
	sqrMagnitude: function () {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	},
	magnitude: function () {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	},
	ApplyTransform: function(matrix) {
		var x = this.x, y = this.y, z = this.z;
		var e = matrix.elements;
		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ];
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ];
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ];
	},
	toString: function() {
		return "{" + this.x + "," + this.y + "," + this.z + "}";
	},
};

UnityEngine.Vector3.back = new UnityEngine.Vector3(0, 0, -1);
UnityEngine.Vector3.down = new UnityEngine.Vector3(0, -1, 0);
UnityEngine.Vector3.forward = new UnityEngine.Vector3(0, 0, 1);
UnityEngine.Vector3.left = new UnityEngine.Vector3(1, 0, 0);
UnityEngine.Vector3.one = new UnityEngine.Vector3(1, 1, 1);
UnityEngine.Vector3.right = new UnityEngine.Vector3(-1, 0, 0);
UnityEngine.Vector3.up = new UnityEngine.Vector3(0, 1, 0);
UnityEngine.Vector3.zero = new UnityEngine.Vector3(0, 0, 0);