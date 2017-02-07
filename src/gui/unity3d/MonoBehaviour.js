

UnityEngine.MonoBehaviour = function(gameObject) {
	UnityEngine.Component.call(this, gameObject);
	this.enabled = true;
};

Object.extend(UnityEngine.MonoBehaviour.prototype = Object.create(UnityEngine.Component.prototype), {
	constructor: UnityEngine.MonoBehaviour,
	Load: function(json) {
		UnityEngine.Component.prototype.Load.call(this, json);
	},
});