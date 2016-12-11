
UnityEngine.Component = function(gameObject) {
	this.gameObject = gameObject;
	this.transform = gameObject.transform; // UnityEngine.Transform
};

UnityEngine.Component.prototype = {
	constructor: UnityEngine.Component,
};