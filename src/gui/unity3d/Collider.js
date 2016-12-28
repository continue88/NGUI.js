
UnityEngine.Collider = function(gameObject) {
    UnityEngine.Component.call(this, gameObject);
};

Object.assign(UnityEngine.Collider.prototype = Object.create(UnityEngine.Component.prototype), {
	constructor: UnityEngine.Collider,
	Load: function(json) {
		UnityEngine.Component.prototype.Load.call(this, json);
	},
});