
NGUI.UIRect = function(gameObject) {
	UnityEngine.MonoBehaviour.call(this, gameObject);

	this.leftAnchor = new NGUI.AnchorPoint();
	this.rightAnchor = new NGUI.AnchorPoint();
	this.bottomAnchor = new NGUI.AnchorPoint();
	this.topAnchor = new NGUI.AnchorPoint();

	this.finalAlpha = 1;
	this.mSides = [];
	this.mCam = undefined;
	this.mUpdateAnchors = true;
	this.mUpdateFrame = -1;
	this.mAnchorsCached = false;
};

Object.assign(NGUI.UIRect.prototype, UnityEngine.MonoBehaviour.prototype, {
	constructor: NGUI.UIRect,
	cameraRayDistance: function() {
		if (this.mCam === undefined) return 0;
		if (this.mCam.isOrthoGraphic) return 100;
		return (this.mCam.nearClipPlane + this.mCam.farClipPlane) * 0.5;
	},
	Load: function(json) {
		//if (json)
	},
	GetSides: function(relativeTo) {
		if (this.mCam !== undefined) return this.mCam.GetSides(this.cameraRayDistance(), relativeTo);
		var pos = this.transform.position;
		for (var i = 0; i < 4; ++i) this.mSides[i] = pos;
		if (relativeTo !== undefined) {
			for (var i = 0; i < 4; ++i)
				this.mSides[i] = relativeTo.InverseTransformPoint(this.mSides[i]);
		}
		return this.mSides;
	},
	OnAnchor: function() { },
	UpdateAnchors: function(frame) {
		var anchored = false;
		this.mUpdateFrame = frame;
		if (this.leftAnchor.target !== undefined) {
			anchored = true;
			if (this.leftAnchor.rect !== undefined && this.leftAnchor.rect.mUpdateFrame !== frame)
				this.leftAnchor.rect.UpdateAnchors(frame);
		}
		if (this.bottomAnchor.target!== undefined) {
			anchored = true;
			if (this.bottomAnchor.rect !== undefined && this.bottomAnchor.rect.mUpdateFrame !== frame)
				this.bottomAnchor.rect.UpdateAnchors(frame);
		}
		if (this.rightAnchor.target!== undefined) {
			anchored = true;
			if (this.rightAnchor.rect !== undefined && this.rightAnchor.rect.mUpdateFrame !== frame)
				this.rightAnchor.rect.UpdateAnchors(frame);
		}
		if (this.topAnchor.target!== undefined) {
			anchored = true;
			if (this.topAnchor.rect !== undefined && this.topAnchor.rect.mUpdateFrame !== frame)
				this.topAnchor.rect.UpdateAnchors(frame);
		}
		if (anchored) this.OnAnchor();
	},
});