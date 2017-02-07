
UnityEngine.Transform = function(gameObject) {
	UnityEngine.Component.call(this, gameObject);

	this.transform = this;
	this.mPosition = new UnityEngine.Vector3(0, 0, 0);
	this.mRotation = new UnityEngine.Quaternion();
	this.mLossyScale = new UnityEngine.Vector3(1, 1, 1);

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

Object.extend(UnityEngine.Transform.prototype = Object.create(UnityEngine.Component.prototype), {
	constructor: UnityEngine.Transform,
	get position() { return this.mPosition; },
	set position(v) {
		this.localPosition.setv(v).ApplyTransform(this.worldToLocalMatrix);
		this.setNeedUpdate(true);
	},
	get rotation() { return this.mRotation; },
	get lossyScale() { return this.mLossyScale; },
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
		UnityEngine.Component.prototype.Load.call(this, json);
		if (json.t) this.localPosition.set(json.t.x || 0, json.t.y || 0, json.t.z || 0);
		if (json.r) this.localRotation.euler(json.r.x || 0, json.r.y || 0, json.r.z || 0);
		if (json.s) this.localScale.set(json.s.x || 1, json.s.y || 1, json.s.z || 1);
		this.needUpdate = true;
	},
	Find: function(name) {
		var sep = name.lastIndexOf('/');
		var childName = sep > 0 ? name.substring(0, sep) : name;
		for (var i in this.children) {
			var child = this.children[i];
			if (child.gameObject.name === childName)
				return sep > 0 ? child.Find(name.substring() + 1) : child;
		}
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
			this.mPosition.setv(this.localPosition);
			this.mRotation.setv(this.localRotation);
			this.mLossyScale.setv(this.localScale);
		} else {
			this.localToWorldMatrix.MultiplyMatrices(this.parent.localToWorldMatrix, localMatrix);
			this.worldToLocalMatrix.getInverse(this.localToWorldMatrix);
			this.mPosition.setv(this.localPosition).ApplyTransform(this.parent.localToWorldMatrix);
			this.mRotation.multiply(this.parent.mRotation, this.localRotation);
			this.mLossyScale.setv(this.parent.mLossyScale).multiply(this.localScale);
		}
		for (var i in this.children)
			this.children[i].Update();
	},
	InverseTransformPoint: function(pos) { return this.worldToLocalMatrix.MultiplyPoint3x4(pos); },
	InverseTransformDirection: function(dir) { return this.worldToLocalMatrix.MultiplyVector(dir); },
	TransformPoint: function(pos) { return this.localToWorldMatrix.MultiplyPoint3x4(pos); },
	TransformDirection: function(dir) { return this.mRotation.multiplyVector(dir); },
});