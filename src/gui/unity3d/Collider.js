
UnityEngine.Collider = function(gameObject) {
    UnityEngine.Component.call(this, gameObject);
};

Object.extend(UnityEngine.Collider.prototype = Object.create(UnityEngine.Component.prototype), {
	constructor: UnityEngine.Collider,
	Awake: function() {
		UnityEngine.Physics.Add(this);
	},
	OnDestroy: function() {
		UnityEngine.Physics.Remove(this);
	},
	Load: function(json) {
		UnityEngine.Component.prototype.Load.call(this, json);
	},
});