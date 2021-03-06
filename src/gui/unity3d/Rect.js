
UnityEngine.Rect = function(left, top, width, height) {
	this.xMin = left;
	this.xMax = left + width;
	this.yMin = top;
	this.yMax = top + height;
};

UnityEngine.Rect.prototype = {
	constructor: UnityEngine.Rect,
	clone: function () { return new this.constructor(this.left, this.top, this.width, this.height); },
	set: function(left, top, width, height) {
		this.xMin = left;
		this.xMax = left + width;
		this.yMin = top;
		this.yMax = top + height;
	},
	get left() { return this.xMin; },
	get top() { return this.yMin; },
	get width() { return this.xMax - this.xMin; },
	get height() { return this.yMax - this.yMin; },
};