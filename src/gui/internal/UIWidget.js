
NGUI.UIWidget = function(gameObject) {
	NGUI.UIRect.call(this, gameObject);
	
	this.mColor = new UnityEngine.Color(1, 1, 1, 1),
	this.mPivot = WidgetPivot.Center;
	this.mWidth = 100;
	this.mHeight = 100;
	this.mDepth = 0;
	this.mMoved = false;
	this.mIsInFront = true;
	this.mIsVisibleByAlpha = true;
	this.mIsVisibleByPanel = true;
	this.mDrawRegion = new UnityEngine.Vector4(0, 0, 1, 1);
	this.mLocalToPanel = new UnityEngine.Matrix4x4();
	this.mOldV0 = new UnityEngine.Vector3();
	this.mOldV1 = new UnityEngine.Vector3();
	this.mCorners = [];//
	this.mAlphaFrameID = 0;

	// public variables.
	this.minWidth = 2;
	this.minHeight = 2;
	this.aspectRatio = 1;
	this.keepAspectRatio = AspectRatioSource.Free;
	this.fillGeometry = true;
	this.autoResizeBoxCollider = true;
	this.panel = undefined;
	this.drawCall = undefined;
	this.geometry = new NGUI.UIGeometry();

	for (var i = 0; i < 4; i++) this.mCorners[i] = new UnityEngine.Vector3();
};

WidgetPivot = {
	TopLeft: 0,
	Top: 1,
	TopRight: 2,
	Left: 3,
	Center: 4,
	Right: 5,
	BottomLeft: 6,
	Bottom: 7,
	BottomRight: 8,
};

AspectRatioSource = {
	Free: 0,
	BasedOnWidth: 1,
	BasedOnHeight: 2,
}

Object.extend(NGUI.UIWidget.prototype = Object.create(NGUI.UIRect.prototype), {
	constructor: NGUI.UIWidget,
	setColor: function(value) { var alphaChanged = this.mColor.a != value.a; this.mColor = value; this.Invalidate(alphaChanged); },
	getColor: function() { return this.mColor; },
	getAlpha: function() { return this.mColor.a; },
	setAlpha: function(a) { this.mColor.a = a; this.Invalidate(); },
	pivotOffset: function() { return NGUIMath.GetPivotOffset(this.mPivot); },
	texture: function() { return undefined; },
	isVisible: function() { return this.mIsVisibleByAlpha && this.mIsVisibleByPanel && this.mIsInFront && this.finalAlpha > 0.001; },
	hasVertices: function() { return this.geometry.hasVertices(); },
	border: function() { return new UnityEngine.Vector4(0, 0, 0, 0); },
	raycastDepth: function() {
		return (this.panel !== undefined) ? this.mDepth + this.panel.mDepth * 1000 : this.mDepth;
	},
	drawingDimensions: function() {
		var offset = this.pivotOffset();
		var x0 = -offset.x * this.mWidth;
		var y0 = -offset.y * this.mHeight;
		var x1 = x0 + this.mWidth;
		var y1 = y0 + this.mHeight;
		return new UnityEngine.Vector4(
			this.mDrawRegion.x == 0 ? x0 : Mathf.Lerp(x0, x1, this.mDrawRegion.x),
			this.mDrawRegion.y == 0 ? y0 : Mathf.Lerp(y0, y1, this.mDrawRegion.y),
			this.mDrawRegion.z == 1 ? x1 : Mathf.Lerp(x0, x1, this.mDrawRegion.z),
			this.mDrawRegion.w == 1 ? y1 : Mathf.Lerp(y0, y1, this.mDrawRegion.w));
	},
	OnFill: function(verts, uvs, cols) { },
	Load: function(json) {
		NGUI.UIRect.prototype.Load.call(this, json);
		if (json.c !== undefined)
			this.mColor.set32(json.c.r || 0, json.c.g || 0, json.c.b || 0, json.c.a || 255);
		this.mPivot = (json.p !== undefined) ? json.p : WidgetPivot.Center;
		this.keepAspectRatio = json.k || AspectRatioSource.Free;
		this.aspectRatio = json.a || 1;
		this.finalAlpha = this.mColor.a;
		this.mWidth = json.w || 100;
		this.mHeight = json.h || 100;
		this.mDepth = json.d || 0;
		this.CreatePanel(); // ensure we have a parent panel.
	},
	Invalidate: function(includeChildren) {
		this.mChanged = true;
		this.UpdateFinalAlpha(UnityEngine.Time.frameCount);
	},
	UpdateFinalAlpha: function(frameID) {
		this.finalAlpha = this.panel ? (this.panel.CalculateFinalAlpha(frameID) * this.mColor.a) : this.mColor.a;
	},
	CalculateFinalAlpha: function(frameID) {
		if (this.mAlphaFrameID !== frameID) {
			this.mAlphaFrameID = frameID;
			this.UpdateFinalAlpha();
		}
		return this.finalAlpha;
	},
	CreatePanel: function() {
		if (this.panel === undefined) {
			this.panel = NGUITools.FindInParents(this.gameObject, 'UIPanel');
			this.panel.AddWidget(this);
		}
		return this.panel;
	},
	UpdateTransform: function() {
		var trans = this.transform;
		if (this.mMoved !== true && trans.hasChanged) {
			trans.hasChanged = false;
			this.mLocalToPanel.MultiplyMatrices(this.panel.worldToLocal, trans.localToWorldMatrix);
			var offset = this.pivotOffset();
			var x0 = -offset.x * this.mWidth;
			var y0 = -offset.y * this.mHeight;
			var x1 = x0 + this.mWidth;
			var y1 = y0 + this.mHeight;
			var wt = this.transform;
			var v0 = wt.TransformPoint(new UnityEngine.Vector3(x0, y0, 0));
			var v1 = wt.TransformPoint(new UnityEngine.Vector3(x1, y1, 0));
			v0 = this.panel.worldToLocal.MultiplyPoint3x4(v0);
			v1 = this.panel.worldToLocal.MultiplyPoint3x4(v1);
			if (UnityEngine.Vector3.SqrMagnitude(this.mOldV0, v0) > 0.000001 ||
				UnityEngine.Vector3.SqrMagnitude(this.mOldV1, v1) > 0.000001) {
				this.mMoved = true;
				this.mOldV0 = v0;
				this.mOldV1 = v1;
			}
		}
	},
	UpdateVisibility: function(visibleByAlpha, visibleByPanel) {
		if (this.mIsVisibleByAlpha != visibleByAlpha || this.mIsVisibleByPanel != visibleByPanel) {
			this.mChanged = true;
			this.mIsVisibleByAlpha = visibleByAlpha;
			this.mIsVisibleByPanel = visibleByPanel;
			return true;
		}
		return false;
	},
	OnAnchor: function() {
		var lt, bt, rt, tt;
		var trans = this.transform;
		var parent = trans.parent;
		var pos = trans.localPosition;
		var pvt = this.pivotOffset().clone();

		// Attempt to fast-path if all anchors match
		if (this.leftAnchor !== undefined && 
			this.rightAnchor !== undefined &&
			this.bottomAnchor !== undefined &&
			this.topAnchor !== undefined && 
			this.leftAnchor.target === this.bottomAnchor.target &&
			this.leftAnchor.target === this.rightAnchor.target &&
			this.leftAnchor.target === this.topAnchor.target) {
			var sides = this.leftAnchor.GetSides(parent);
			if (sides !== undefined) {
				lt = Mathf.Lerp(sides[0].x, sides[2].x, this.leftAnchor.relative) + this.leftAnchor.absolute;
				rt = Mathf.Lerp(sides[0].x, sides[2].x, this.rightAnchor.relative) + this.rightAnchor.absolute;
				bt = Mathf.Lerp(sides[3].y, sides[1].y, this.bottomAnchor.relative) + this.bottomAnchor.absolute;
				tt = Mathf.Lerp(sides[3].y, sides[1].y, this.topAnchor.relative) + this.topAnchor.absolute;
				this.mIsInFront = true;
			} else { // Anchored to a single transform
				var lp = this.GetLocalPos(this.leftAnchor, parent);
				lt = lp.x + this.leftAnchor.absolute;
				bt = lp.y + this.bottomAnchor.absolute;
				rt = lp.x + this.rightAnchor.absolute;
				tt = lp.y + this.topAnchor.absolute;
				this.mIsInFront = (!this.hideIfOffScreen || lp.z >= 0);
			}
		} else {
			pvt = pvt.clone();
			this.mIsInFront = true;
			if (this.leftAnchor !== undefined) { // Left anchor point
				var sides = this.leftAnchor.GetSides(parent);
				if (sides !== undefined)
					lt = Mathf.Lerp(sides[0].x, sides[2].x, this.leftAnchor.relative) + this.leftAnchor.absolute;
				else
					lt = this.GetLocalPos(this.leftAnchor, parent).x + this.leftAnchor.absolute;
			}
			else lt = pos.x - pvt.x * this.mWidth;
			if (this.rightAnchor !== undefined) { // Right anchor point
				var sides = this.rightAnchor.GetSides(parent);
				if (sides !== undefined)
					rt = Mathf.Lerp(sides[0].x, sides[2].x, this.rightAnchor.relative) + this.rightAnchor.absolute;
				else
					rt = this.GetLocalPos(this.rightAnchor, parent).x + this.rightAnchor.absolute;
			}
			else rt = pos.x - pvt.x * this.mWidth + this.mWidth;
			if (this.bottomAnchor !== undefined) { // Bottom anchor point
				var sides = this.bottomAnchor.GetSides(parent);
				if (sides !== undefined)
					bt = Mathf.Lerp(sides[3].y, sides[1].y, this.bottomAnchor.relative) + this.bottomAnchor.absolute;
				else
					bt = this.GetLocalPos(this.bottomAnchor, parent).y + this.bottomAnchor.absolute;
			}
			else bt = pos.y - pvt.y * this.mHeight;
			if (this.topAnchor !== undefined) { // Top anchor point
				var sides = this.topAnchor.GetSides(parent);
				if (sides !== undefined)
					tt = Mathf.Lerp(sides[3].y, sides[1].y, this.topAnchor.relative) + this.topAnchor.absolute;
				else
					tt = this.GetLocalPos(this.topAnchor, parent).y + this.topAnchor.absolute;
			}
			else tt = pos.y - pvt.y * this.mHeight + this.mHeight;
		}

		// Calculate the new position, width and height
		var newPos = new UnityEngine.Vector3(Mathf.Lerp(lt, rt, pvt.x), Mathf.Lerp(bt, tt, pvt.y), pos.z);
		var w = Mathf.FloorToInt(rt - lt + 0.5);
		var h = Mathf.FloorToInt(tt - bt + 0.5);

		// Maintain the aspect ratio if requested and possible
		if (this.keepAspectRatio !== AspectRatioSource.Free && this.aspectRatio !== 0) {
			if (keepAspectRatio === AspectRatioSource.BasedOnHeight)
				w = Mathf.RoundToInt(h * this.aspectRatio);
			else h = Mathf.RoundToInt(w / this.aspectRatio);
		}

		// Don't let the width and height get too small
		if (w < this.minWidth) w = this.minWidth;
		if (h < this.minHeight) h = this.minHeight;

		// Update the position if it has changed
		if (UnityEngine.Vector3.SqrMagnitude(pos, newPos) > 0.001) {
			this.transform.localPosition = newPos;
			this.transform.needUpdate = true;
			if (this.mIsInFront) this.mChanged = true;
		}

		// Update the width and height if it has changed
		if (this.mWidth !== w || this.mHeight !== h) {
			this.mWidth = w;
			this.mHeight = h;
			if (this.mIsInFront) this.mChanged = true;
			//if (autoResizeBoxCollider) ResizeCollider();
		}
	},
	UpdateGeometry: function(frame) {
		if (this.mChanged === true) {
			this.mChanged = false;
			if (this.mIsVisibleByAlpha === true && this.finalAlpha > 0.001) {
				var hadVertices = this.geometry.hasVertices();
				if (this.fillGeometry === true) {
					this.geometry.Clear();
					this.OnFill(this.geometry.verts, this.geometry.uvs, this.geometry.cols);
				}
				if (this.geometry.hasVertices() === true) {
					this.mLocalToPanel.MultiplyMatrices(this.panel.worldToLocal, this.transform.localToWorldMatrix);
					this.geometry.ApplyTransform(this.mLocalToPanel);
					this.mMoved = false;
					return true;
				}
			}
			
			if (this.fillGeometry === true) this.geometry.Clear();
			this.mMoved = false;
			return true;
		} else if (this.mMoved === true && this.geometry.hasVertices() === true) {
			this.mLocalToPanel.MultiplyMatrices(this.panel.worldToLocal, this.transform.localToWorldMatrix);
			this.geometry.ApplyTransform(this.mLocalToPanel);
			this.mMoved = false;
			return true;
		}
		this.mMoved = false;
		return false;
	},
	WriteToBuffers: function(v, u, c) {
		this.geometry.WriteToBuffers(v, u, c);
	},
	GetSides: function(relativeTo) {
		var offset = this.pivotOffset();
		var x0 = -offset.x * this.mWidth;
		var y0 = -offset.y * this.mHeight;
		var x1 = x0 + this.mWidth;
		var y1 = y0 + this.mHeight;
		var cx = (x0 + x1) * 0.5;
		var cy = (y0 + y1) * 0.5;
		var localToWorld = this.transform.localToWorldMatrix;
		this.mCorners[0].set(x0, cy, 0).ApplyTransform(localToWorld);
		this.mCorners[1].set(cx, y1, 0).ApplyTransform(localToWorld);
		this.mCorners[2].set(x1, cy, 0).ApplyTransform(localToWorld);
		this.mCorners[3].set(cx, y0, 0).ApplyTransform(localToWorld);
		if (relativeTo !== undefined) {
			var worldToLocal = relativeTo.worldToLocalMatrix;
			for (var i in this.mCorners)
				this.mCorners[i].ApplyTransform(worldToLocal);
		}
		return this.mCorners;
	}
});