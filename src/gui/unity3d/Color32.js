
UnityEngine.Color32 = function(r, g, b, a) {
	this.r = r || 0;
	this.g = g || 0;
	this.b = b || 0;
	this.a = a || 255;
};

UnityEngine.Color32.prototype = {
	constructor: UnityEngine.Color32,
	clone: function() { return new this.constructor(this.r, this.g, this.b, this.a); },
	set: function(r, g, b, a) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
		return this;
	},
}