
UnityEngine.Component = function(gameObject) {
	UnityEngine.Object.call(this);
	this.gameObject = gameObject;
	this.transform = gameObject.transform; // UnityEngine.Transform
};

Object.assign(UnityEngine.Component.prototype, UnityEngine.Object.prototype, {
	constructor: UnityEngine.Component,
	Load: function(json) {
		UnityEngine.Object.prototype.Load.call(this, json);
	},
});