
UnityEngine.BoxCollider = function(gameObject) {
    UnityEngine.Collider.call(this, gameObject);
    this.center = new UnityEngine.Vector3(0, 0, 0);
    this.size = new UnityEngine.Vector3(0, 0, 0);
};

Object.assign(UnityEngine.BoxCollider.prototype = Object.create(UnityEngine.Collider.prototype), {
	constructor: UnityEngine.BoxCollider,
	Load: function(json) {
		UnityEngine.Collider.prototype.Load.call(this, json);
        if (json.c !== undefined) this.center.set(json.c.x || 0, json.c.y || 0, json.c.z || 0);
        if (json.s !== undefined) this.size.set(json.s.x || 0, json.s.y || 0, json.s.z || 0);
	},
});
