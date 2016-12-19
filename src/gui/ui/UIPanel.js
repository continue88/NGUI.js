
NGUI.UIPanel = function(gameObject) {
	NGUI.UIRect.call(this, gameObject);

	this.mAlpha = 1;
	this.mDepth = 0;
	this.mSortingOrder = 0;
	this.mUpdateFrame = 0;
	this.mUpdateScroll = false;
	this.mRebuild = true;
	this.mForced = false;
	this.mResized = false;
	this.mClipOffset = new UnityEngine.Vector2();
	this.mClipRange = new UnityEngine.Vector4();
	this.mClipSoftness = new UnityEngine.Vector4();
	this.mMin = new UnityEngine.Vector2();
	this.mMax = new UnityEngine.Vector2();
	this.mClipping = Clipping.None;
	this.mSortWidgets = false;

	this.startingRenderQueue = 3000;
	this.drawCallClipRange = new UnityEngine.Vector4(0, 0, 1, 1);
	this.renderQueue = RenderQueue.Automatic;
	this.widgets = []; // NGUI.UIWidget list
	this.drawCalls = []; // NGUI.UIDrawCall
	this.parentPanel = undefined;
	this.worldToLocal = undefined;

	NGUI.UIPanel.list.push(this);
};

RenderQueue = {
	Automatic: 0,
	StartAt: 1,
	Explicit: 2,
};

Clipping = {
	None: 0,
	SoftClip: 3,				// Alpha-based clipping with a softened edge
	ConstrainButDontClip: 4,	// No actual clipping, but does have an area
};

// static variables and function.
NGUI.UIPanel.list = [];
NGUI.UIPanel.UpdateAll = function(frame) {
	var list = NGUI.UIPanel.list;
	for (var i in list)
		list[i].UpdateSelf(frame);

	var rq = 3000;
	for (var i in list) {
		var p = list[i];
		if (p.renderQueue === RenderQueue.Automatic) {
			p.startingRenderQueue = rq;
			p.UpdateDrawCalls();
			rq += p.drawCalls.length + 2;
		}
		else if (p.renderQueue === RenderQueue.StartAt) {
			p.UpdateDrawCalls();
			if (p.drawCalls.length != 0)
				rq = Math.max(rq, p.startingRenderQueue + p.drawCalls.length);
		}
		else { // Explicit
			p.UpdateDrawCalls();
			if (p.drawCalls.length !== 0)
				rq = Math.max(rq, p.startingRenderQueue + 1);
		}
	}
};
NGUI.UIPanel.Foreach = function(action) {
	var list = NGUI.UIPanel.list;
	for (var i in list) action(list[i]);
};

Object.assign(NGUI.UIPanel.prototype, NGUI.UIRect.prototype, {
	constructor: NGUI.UIPanel,
	hasClipping: function() { return this.mClipping === Clipping.SoftClip;  },
	getViewSize: function() {
		if (this.mClipping != Clipping.None)
			return new UnityEngine.Vector2(this.mClipRange.z, this.mClipRange.w);
		return NGUITools.screenSize;
	},
	finalClipRegion: function() {
		var size = this.getViewSize();
		if (this.mClipping != Clipping.None)
			return new UnityEngine.Vector4(this.mClipRange.x + this.mClipOffset.x, this.mClipRange.y + this.mClipOffset.y, size.x, size.y);
		return new UnityEngine.Vector4(0, 0, size.x, size.y);
	},
	clipCount: function() {
		var count = 0;
		var p = this;
		while (p !== undefined) {
			if (p.mClipping === Clipping.SoftClip) ++count;
			p = p.parentPanel;
		}
		return count;
	},
	Load: function(json) {
		NGUI.UIRect.prototype.Load.call(this, json);
		this.mAlpha = json.alpha || 1;
		this.mDepth = json.depth || 0;
		this.mClipping = json.clipping || Clipping.None;
		this.mClipOffset.set(json.clipOffset.x || 0, json.clipOffset.y || 0);
		this.mClipRange.set(json.clipRange.x || 0, json.clipRange.y || 0, json.clipRange.z || 0, json.clipRange.w || 0);
		this.mClipSoftness.set(json.clipSoftness.x || 0, json.clipSoftness.y || 0);
		this.mSortingOrder = json.sort || 0;
		this.renderQueue = json.renderQueue || RenderQueue.Automatic;
		this.startingRenderQueue = json.startingRenderQueue || 3000;
		this.mRebuild = true;
		this.FindParent();
	},
	AddWidget: function(w) {
		this.widgets.push(w);
		this.mSortWidgets = true;
	},
	FindParent: function() {
		var parent = this.transform.parent;
		this.parentPanel = (parent !== undefined) ? NGUITools.FindInParents(parent.gameObject, 'UIPanel') : undefined;
	},
	UpdateSelf: function(frame) {
		this.UpdateTransformMatrix(frame);
		this.UpdateLayers(frame);
		this.UpdateWidgets(frame);
		if (this.mRebuild === true) {
			this.mRebuild = false;
			this.FillAllDrawCalls();
		} else {
			for (var i = 0; i < this.drawCalls.length;) {
				var dc = this.drawCalls[i];
				if (dc.isDirty && !this.FillDrawCall(dc)) {
					dc.destroy();
					this.drawCalls.splice(i, 1);
					continue;
				}
				++i;
			}
		}
		if (this.mUpdateScroll) {
			this.mUpdateScroll = false;
			//UIScrollView sv = GetComponent<UIScrollView>();
			//if (sv !== undefined) sv.UpdateScrollbars();
		}
	},
	UpdateTransformMatrix: function(frame) {
		this.worldToLocal = this.transform.worldToLocalMatrix;
		var size = this.getViewSize();
		var x = this.mClipOffset.x + this.mClipRange.x;
		var y = this.mClipOffset.y + this.mClipRange.y;
		this.mMin.x = x - size.x * 0.5;
		this.mMin.y = y - size.y * 0.5;
		this.mMax.x = x + size.x * 0.5;
		this.mMax.y = y + size.y * 0.5;
	},
	UpdateLayers: function(frame) {
		// TODO: unity3d layer...
	},
	SortWidgets: function() {
		this.mSortWidgets = false;
		this.widgets.sort(function(a, b) { return a.mDepth - b.mDepth; });
	},
	UpdateWidgets: function(frame) {
		var changed = false;
		if (this.mSortWidgets === true) this.SortWidgets();
		for (var i in this.widgets) {
			var w = this.widgets[i];
			if (w.panel != this || !w.enabled)
				continue;
			
			w.ResetAnchors(true); // reset and update now.
				
			// First update the widget's transform
			if (w.UpdateTransform(frame) || this.mResized) {
				//var vis = forceVisible || (w.CalculateCumulativeAlpha(frame) > 0.001f);
				//w.UpdateVisibility(vis, forceVisible || ((clipped || w.hideIfOffScreen) ? IsVisible(w) : true));
			}
			
			// Update the widget's geometry if necessary
			if (w.UpdateGeometry(frame)) {
				changed = true;
				if (this.mRebuild !== true) {
					if (w.drawCall !== undefined)
						w.drawCall.isDirty = true;
					else
						this.FindDrawCall(w);
				}
			}
		}
		this.mResized = false;
	},
	UpdateDrawCalls: function() {
		var trans = this.transform;
		if (this.mClipping != Clipping.None) {
			this.drawCallClipRange = this.finalClipRegion();
			this.drawCallClipRange.z *= 0.5;
			this.drawCallClipRange.w *= 0.5;
		}
		else drawCallClipRange = new UnityEngine.Vector4(0, 0, 0, 0);

		// Legacy functionality
		if (this.drawCallClipRange.z == 0) this.drawCallClipRange.z = NGUITools.screenSize.x * 0.5;
		if (this.drawCallClipRange.w == 0) this.drawCallClipRange.w = NGUITools.screenSize.y * 0.5;
		var pos = trans.localPosition;
		var parent = trans.parent;
		if (parent !== undefined)
			pos = parent.TransformPoint(pos);

		var rot = trans.rotation;
		var scale = trans.lossyScale;
		for (var i in this.drawCalls) {
			var dc = this.drawCalls[i];
			dc.localToWorldMatrix.SetTRS(pos, rot, scale);
			dc.renderQueue = (this.renderQueue == RenderQueue.Explicit) ? this.startingRenderQueue : this.startingRenderQueue + i;
			dc.sortingOrder = this.mSortingOrder;
		}
	},
	FillAllDrawCalls: function() {
		if (this.drawCalls.length > 0)
			this.drawCalls.length = 0; // clear drawCalls

		var texture = undefined;
		var dc = undefined;
		var count = 0;
		for (var i in this.widgets) {
			var w = this.widgets[i];
			if (!w.isVisible() || !w.hasVertices()) {
				w.drawCall = undefined;
				continue;
			}
			var mt = w.texture();
			if (texture != mt) {
				if (dc !== undefined && dc.verts.length != 0) {
					this.drawCalls.push(dc);
					dc.UpdateGeometry(count);
					count = 0;
					dc = undefined;
				}
				texture = mt;
			}

			if (texture !== undefined) {
				if (dc === undefined) {
					dc = new NGUI.UIDrawCall("", this, texture);
					dc.depthStart = w.mDepth;
					dc.depthEnd = dc.depthStart;
				} else {
					var rd = w.depth;
					if (rd < dc.depthStart) dc.depthStart = rd;
					if (rd > dc.depthEnd) dc.depthEnd = rd;
				}
				w.drawCall = dc;

				++count;
				w.WriteToBuffers(dc.verts, dc.uvs, dc.cols);
			}
		}

		if (dc !== undefined && dc.verts.length !== 0) {
			this.drawCalls.push(dc);
			dc.UpdateGeometry(count);
		}
	},
});