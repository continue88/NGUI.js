
NGUI.UIRect = function(gameObject) {
	UnityEngine.MonoBehaviour.call(this, gameObject);

	this.leftAnchor = undefined;// new NGUI.AnchorPoint();
	this.rightAnchor = undefined;//new NGUI.AnchorPoint();
	this.bottomAnchor = undefined;//new NGUI.AnchorPoint();
	this.topAnchor = undefined;//new NGUI.AnchorPoint();
	this.finalAlpha = 1;
	
	this.mCam = undefined;
	this.mUpdateAnchors = true;
	this.mUpdateFrame = -1;
	this.mAnchorsCached = false;
	this.mChanged = false;
};

NGUI.UIRect.mSides = [];

Object.extend(NGUI.UIRect.prototype = Object.create(UnityEngine.MonoBehaviour.prototype), {
	constructor: NGUI.UIRect,
	cameraRayDistance: function() {
		var cam = this.mCam;
		if (cam === undefined) return 0;
		if (cam.isOrthoGraphic)
			return (cam.nearClipPlane + cam.farClipPlane) * 0.5;
		var vec = this.transform.position.clone().sub(cam.transform.position);
		var forward = cam.transform.TransformDirection(UnityEngine.Vector3.forward);
		return forward.dot(vec);
	},
	anchorCamera: function() {
		if (!this.mAnchorsCached) this.ResetAnchors();
		return this.mCam;
	},
	Load: function(json) {
		UnityEngine.MonoBehaviour.prototype.Load.call(this, json);
		if (json.la !== undefined) this.leftAnchor = new NGUI.AnchorPoint(json.la);
		if (json.ra !== undefined) this.rightAnchor = new NGUI.AnchorPoint(json.ra);
		if (json.ba !== undefined) this.bottomAnchor = new NGUI.AnchorPoint(json.ba);
		if (json.ta !== undefined) this.topAnchor = new NGUI.AnchorPoint(json.ta);
		this.mChanged = true;
	},
	Invalidate: function(includeChildren) {
	},
	GetSides: function(relativeTo) {
		if (this.mCam !== undefined) return this.mCam.GetSides(this.cameraRayDistance(), relativeTo);
		var sides = NGUI.UIRect.mSides;
		var pos = this.transform.position;
		for (var i = 0; i < 4; ++i) sides[i].set(pos.x, pos.y, pos.z);
		if (relativeTo !== undefined) {
			var worldToLocal = relativeTo.worldToLocalMatrix;
			for (var i in sides) sides[i].ApplyTransform(worldToLocal);
		}
		return sides;
	},
	OnAnchor: function() { },
	ResetAnchors: function(update) {
		this.mAnchorsCached = true;
		if (this.leftAnchor !== undefined) this.leftAnchor.Link();
		if (this.bottomAnchor !== undefined) this.bottomAnchor.Link();
		if (this.rightAnchor !== undefined) this.rightAnchor.Link();
		if (this.topAnchor !== undefined) this.topAnchor.Link();
		this.mCam = NGUITools.FindCameraForLayer(this.gameObject.layer);
		//FindCameraFor(leftAnchor);
		//FindCameraFor(bottomAnchor);
		//FindCameraFor(rightAnchor);
		//FindCameraFor(topAnchor);
		this.mUpdateAnchors = true;
		if (update) this.UpdateAnchors(UnityEngine.Time.frameCount);
	},
	UpdateAnchors: function(frame) {
		if (this.mUpdateFrame === frame) return;
		this.mUpdateFrame = frame;
		var anchored = false;
		if (this.leftAnchor !== undefined) {
			anchored = true;
			if (this.leftAnchor.rect !== undefined)
				this.leftAnchor.rect.UpdateAnchors(frame);
		}
		if (this.bottomAnchor !== undefined) {
			anchored = true;
			if (this.bottomAnchor.rect !== undefined)
				this.bottomAnchor.rect.UpdateAnchors(frame);
		}
		if (this.rightAnchor !== undefined) {
			anchored = true;
			if (this.rightAnchor.rect !== undefined)
				this.rightAnchor.rect.UpdateAnchors(frame);
		}
		if (this.topAnchor !== undefined) {
			anchored = true;
			if (this.topAnchor.rect !== undefined)
				this.topAnchor.rect.UpdateAnchors(frame);
		}
		if (anchored) this.OnAnchor();
	},
	GetLocalPos: function(ac, trans) {
		if (this.mCam === undefined || ac.targetCam === undefined)
			return this.transform.localPosition;

		var pos = this.mCam.ViewportToWorldPoint(ac.targetCam.WorldToViewportPoint(ac.target.position));
		if (trans != null) pos = trans.InverseTransformPoint(pos);
		pos.x = Math.floor(pos.x + 0.5);
		pos.y = Math.floor(pos.y + 0.5);
		return pos;
	}
});