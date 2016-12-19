
NGUI.UIRect = function(gameObject) {
	UnityEngine.MonoBehaviour.call(this, gameObject);

	this.leftAnchor = undefined;// new NGUI.AnchorPoint();
	this.rightAnchor = undefined;//new NGUI.AnchorPoint();
	this.bottomAnchor = undefined;//new NGUI.AnchorPoint();
	this.topAnchor = undefined;//new NGUI.AnchorPoint();

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
		UnityEngine.MonoBehaviour.prototype.Load.call(this, json);
		if (json.la !== undefined) this.leftAnchor = new NGUI.AnchorPoint(json.la);
		if (json.ra !== undefined) this.rightAnchor = new NGUI.AnchorPoint(json.ra);
		if (json.ba !== undefined) this.leftAnchor = new NGUI.AnchorPoint(json.ba);
		if (json.ta !== undefined) this.leftAnchor = new NGUI.AnchorPoint(json.ta);
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
	ResetAnchors: function(update) {
		this.mAnchorsCached = true;
		if (this.leftAnchor !== undefined) this.leftAnchor.Link();
		if (this.bottomAnchor !== undefined) this.bottomAnchor.Link();
		if (this.rightAnchor !== undefined) this.rightAnchor.Link();
		if (this.topAnchor !== undefined) this.topAnchor.Link();
		//mCam = NGUITools.FindCameraForLayer(cachedGameObject.layer);
		//FindCameraFor(leftAnchor);
		//FindCameraFor(bottomAnchor);
		//FindCameraFor(rightAnchor);
		//FindCameraFor(topAnchor);
		this.mUpdateAnchors = true;
		if (update) this.UpdateAnchors();
	},
	UpdateAnchors: function(frame) {
		var anchored = false;
		this.mUpdateFrame = frame;
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