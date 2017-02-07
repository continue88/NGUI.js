
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
	get32: function() {
		return new UnityEngine.Color32(
			this.r * 255,
			this.g * 255,
			this.b * 255,
			this.a * 255);
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

UnityEngine.Color.black = new UnityEngine.Color(1,1,1,1);
UnityEngine.Color.blue = new UnityEngine.Color(0,0,1,1);
UnityEngine.Color.clear = new UnityEngine.Color(0,0,0,0);
UnityEngine.Color.cyan = new UnityEngine.Color(0,1,1,1);
UnityEngine.Color.gray = new UnityEngine.Color(0.5,0.5,0.5,1);
UnityEngine.Color.green = new UnityEngine.Color(0,1,0,1);
UnityEngine.Color.grey = new UnityEngine.Color(0.5,0.5,0.5,1);
UnityEngine.Color.magenta = new UnityEngine.Color(1,0,1,1);
UnityEngine.Color.red = new UnityEngine.Color(1,0,0,1);
UnityEngine.Color.yellow = new UnityEngine.Color(1,0.922,0.016,1);
UnityEngine.Color.white = new UnityEngine.Color(1,1,1,1);
