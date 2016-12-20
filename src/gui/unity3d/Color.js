
UnityEngine.Color = function ( r, g, b, a ) {
	this.r = r || 0;
	this.g = g || 0;
	this.b = b || 0;
	this.a = a || 0;
};

const COLOR_FROM_32 = 1/255;
UnityEngine.Color.Lerp = function(a, b, t) {
	return new UnityEngine.Color(
		Mathf.Lerp(a.r, b.r, t),
		Mathf.Lerp(a.g, b.g, t),
		Mathf.Lerp(a.b, b.b, t),
		Mathf.Lerp(a.a, b.a, t));
}

UnityEngine.Color.prototype = {
	constructor: UnityEngine.Color,
	clone: function () { return new this.constructor(this.r, this.g, this.b, this.a); },
	set: function(r, g, b, a) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
		return this;
	},
	set32: function(r, g, b, a) {
		this.r = r * COLOR_FROM_32;
		this.g = g * COLOR_FROM_32;
		this.b = b * COLOR_FROM_32;
		this.a = a * COLOR_FROM_32;
		return this;
	},
	add: function(v) {
		this.r += v.r;
		this.g += v.g;
		this.b += v.b;
		this.a += v.a;
		return this;
	},
	sub: function(v) {
		this.r -= v.r;
		this.g -= v.g;
		this.b -= v.b;
		this.a -= v.a;
		return this;
	},
	mul: function(v) {
		this.r *= v.r;
		this.g *= v.g;
		this.b *= v.b;
		this.a *= v.a;
		return this;
	},
};