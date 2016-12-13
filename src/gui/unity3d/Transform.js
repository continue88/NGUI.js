
UnityEngine.Transform = function(gameObject) {
	UnityEngine.Component.call(gameObject);

	this.position = new UnityEngine.Vector3(0, 0, 0);
	this.rotation = new UnityEngine.Quaternion();
	this.lossyScale = new UnityEngine.Vector3(1, 1, 1);

	this.localPosition = new UnityEngine.Vector3(0, 0, 0);
	this.localRotation = new UnityEngine.Quaternion();
	this.localScale = new UnityEngine.Vector3(1, 1, 1);

	this.worldToLocalMatrix = new UnityEngine.Matrix4();
	this.localToWorldMatrix = new UnityEngine.Matrix4();

	this.parent = undefined; // UnityEngine.Transform
	this.children = [];
	this.needUpdate = false;
};

Object.assign(UnityEngine.Transform.prototype, UnityEngine.Component.prototype, {
	constructor: UnityEngine.Transform,
	setParent: function(parent) {
		this.parent = parent;
		parent.children.push(this);
	},
	Load: function(json) {
		if (json.t) this.localPosition.set(json.t.x, json.t.y, json.t.z);
		if (json.r) this.localRotation.euler(json.r.x, json.r.y, json.r.z);
		if (json.s) this.localScale.set(json.s.x, json.s.y, json.s.z);
		this.needUpdate = true;
	},
	Update: function() {
		if (!this.needUpdate) return;
		this.needUpdate = false;
		var localMatrix = new UnityEngine.Matrix4();
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