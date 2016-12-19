
UnityEngine.Transform = function(gameObject) {
	UnityEngine.Component.call(this, gameObject);

	this.transform = this;
	this.position = new UnityEngine.Vector3(0, 0, 0);
	this.rotation = new UnityEngine.Quaternion();
	this.lossyScale = new UnityEngine.Vector3(1, 1, 1);

	this.localPosition = new UnityEngine.Vector3(0, 0, 0);
	this.localRotation = new UnityEngine.Quaternion();
	this.localScale = new UnityEngine.Vector3(1, 1, 1);

	this.worldToLocalMatrix = new UnityEngine.Matrix4x4();
	this.localToWorldMatrix = new UnityEngine.Matrix4x4();

	this.parent = undefined; // UnityEngine.Transform
	this.children = [];
	this.needUpdate = false;
	this.hasChanged = false;
};

Object.assign(UnityEngine.Transform.prototype, UnityEngine.Component.prototype, {
	constructor: UnityEngine.Transform,
	exec: function(action, recursive) {
		action(this); // do this action.
		if (recursive) { for (var i in this.children) this.children[i].exec(action); }
	},
	setParent: function(parent) {
		this.parent = parent;
		parent.children.push(this);
		this.setNeedUpdate(true); // update all children.
	},
	setNeedUpdate(recursive) {
		this.exec(function(self) { self.needUpdate = true; }, true); // update all children.
	},
	Load: function(json) {
		if (json.t) this.localPosition.set(json.t.x || 0, json.t.y || 0, json.t.z || 0);
		if (json.r) this.localRotation.euler(json.r.x || 0, json.r.y || 0, json.r.z || 0);
		if (json.s) this.localScale.set(json.s.x || 1, json.s.y || 1, json.s.z || 1);
		this.needUpdate = true;
	},
	Update: function() {
		if (!this.needUpdate) return;
		this.needUpdate = false;
		this.hasChanged = true; // tell other i changed.
		var localMatrix = new UnityEngine.Matrix4x4();
		localMatrix.SetTRS(this.localPosition, this.localRotation, this.localScale);
		if (this.parent === undefined) {
			this.localToWorldMatrix = localMatrix;
			this.worldToLocalMatrix.getInverse(this.localToWorldMatrix);
			this.position = this.localPosition.clone();
			this.rotation = this.localRotation.clone();
			this.lossyScale = this.localScale.clone();
		} else {
			this.localToWorldMatrix.MultiplyMatrices(this.parent.localToWorldMatrix, localMatrix);
			this.worldToLocalMatrix.getInverse(this.localToWorldMatrix);
			this.position = this.parent.localToWorldMatrix.MultiplyPoint3x4(this.localPosition);
			this.rotation.multiply(this.parent.rotation, this.localRotation);
			this.lossyScale = this.parent.lossyScale.clone().multiply(this.localScale);
		}
		for (var i in this.children)
			this.children[i].Update();
	},
	InverseTransformPoint: function(pos) {
		return this.worldToLocalMatrix.MultiplyPoint3x4(pos);
	},
	TransformPoint: function(pos) {
		return this.localToWorldMatrix.MultiplyPoint3x4(pos);
	},
});