
NGUI.AnchorPoint = function(relative) {
	this.target = undefined; // UnityEngine.Transform
	this.relative = relative | 0;
	this.absolute = 0;
	this.rect = undefined; // NGUI.UIRect
	this.targetCam = undefined; // NGUI.UICamera
};

NGUI.AnchorPoint.prototype = {
	constructor: NGUI.AnchorPoint,
	Set: function(target, relative, absolute) {
		if (target instanceof UnityEngine.Transform) {
			this.target = target;
		} else {
			absolute = relative;
			relative = target;
		}
		this.relative = relative;
		this.absolute = Math.floor(absolute + 0.5);
	},
	SetToNearest: function(abs0, abs1, abs2, rel0, rel1, rel2) {
		var a0 = Math.abs(abs0);
		var a1 = Math.abs(abs1);
		var a2 = Math.abs(abs2);
		if (a0 < a1 && a0 < a2) this.Set(rel0 | 0, abs0);
		else if (a1 < a0 && a1 < a2) this.Set(rel1 | 0.5, abs1);
		else this.Set(rel2 | 1, abs2);
	},
	SetHorizontal: function(parent, localPos) {
		if (this.rect) {
			var sides = this.rect.GetSides(parent);
			var targetPos = Mathf.Lerp(sides[0].x, sides[2].x, relative);
			this.absolute = Mathf.FloorToInt(localPos - targetPos + 0.5);
		} else {
			var targetPos = target.position;
			if (parent !== undefined) targetPos = parent.InverseTransformPoint(targetPos);
			this.absolute = Mathf.FloorToInt(localPos - targetPos.x + 0.5);
		}
	},
	SetVertical: function(parent, localPos) {
		if (this.rect) {
			var sides = this.rect.GetSides(parent);
			var targetPos = Mathf.Lerp(sides[3].y, sides[1].y, relative);
			this.absolute = Mathf.FloorToInt(localPos - targetPos + 0.5);
		} else {
			var targetPos = target.position;
			if (parent !== undefined) targetPos = parent.InverseTransformPoint(targetPos);
			this.absolute = Mathf.FloorToInt(localPos - targetPos.y + 0.5);
		}
	},
	GetSides: function(relativeTo) {
		if (this.target !== undefined) {
			if (this.rect !== undefined) return this.rect.GetSides(relativeTo);
			if (this.target.camera !== undefined) return this.target.camera.GetSides(relativeTo);
		}
		return undefined;
	}
};