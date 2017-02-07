
UnityEngine.Component = function(gameObject) {
	UnityEngine.Object.call(this);
	this.gameObject = gameObject;
	this.transform = gameObject.transform; // UnityEngine.Transform
};

Object.extend(UnityEngine.Component.prototype = Object.create(UnityEngine.Object.prototype), {
	constructor: UnityEngine.Component,
	Load: function(json) {
		UnityEngine.Object.prototype.Load.call(this, json);
	},
	GetComponent: function(type) { return this.gameObject.GetComponent(type); },
	GetComponentInChildren: function(type) { return this.gameObject.GetComponentInChildren(type); },
	GetComponentsInChildren: function(type) { return this.gameObject.GetComponentsInChildren(type); },
});