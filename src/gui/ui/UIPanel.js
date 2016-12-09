
NGUI.UIPanel = function() {
    NGUI.UIRect.call();

    this.mDepth = 0;
    this.mSortingOrder = 0;
    this.mUpdateFrame = 0;
    this.mUpdateScroll = false;
    this.mRebuild = false;
    this.mForced = false;
    this.mResized = false;
    this.mClipOffset = new UnityEngine.Vector2();
    this.mClipRange = new UnityEngine.Vector4();
    this.mMin = new UnityEngine.Vector2();
    this.mMax = new UnityEngine.Vector2();
    this.mClipping = Clipping.None;

    this.startingRenderQueue = 3000;
    this.drawCallClipRange = new UnityEngine.Vector4(0, 0, 1, 1);
    this.renderQueue = RenderQueue.Automatic;
    this.widgets = []; // NGUI.UIWidget list
    this.drawCalls = []; // NGUI.UIDrawCall
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
        if (p.renderQueue == RenderQueue.Automatic) {
            p.startingRenderQueue = rq;
            p.UpdateDrawCalls();
            rq += p.drawCalls.length + 2;
        }
        else if (p.renderQueue == RenderQueue.StartAt) {
            p.UpdateDrawCalls();
            if (p.drawCalls.length != 0)
                rq = Math.max(rq, p.startingRenderQueue + p.drawCalls.length);
        }
        else { // Explicit
            p.UpdateDrawCalls();
            if (p.drawCalls.Count != 0)
                rq = Math.max(rq, p.startingRenderQueue + 1);
        }
    }
}

Object.assign(NGUI.UIPanel.prototype, NGUI.UIRect.prototype, {
    constructor: NGUI.UIPanel,
    GetViewSize: function() {
		if (this.mClipping != Clipping.None)
			return new UnityEngine.Vector2(this.mClipRange.z, this.mClipRange.w);
        return NGUITools.screenSize;
    },
    finalClipRegion: function() {
        var size = this.GetViewSize();
    	if (this.mClipping != Clipping.None)
            return new UnityEngine.Vector4(this.mClipRange.x + this.mClipOffset.x, this.mClipRange.y + this.mClipOffset.y, size.x, size.y);
        return new UnityEngine.Vector4(0, 0, size.x, size.y);
    },
    UpdateSelf: function(frame) {
		this.UpdateTransformMatrix(frame);
		this.UpdateLayers(frame);
		this.UpdateWidgets(frame);
		if (this.mRebuild) {
			this.mRebuild = false;
			this.FillAllDrawCalls();
		}
		else {
			for (var i = 0; i < this.drawCalls.length;) {
				var dc = this.drawCalls[i];
				if (dc.isDirty && !this.FillDrawCall(dc)) {
					//UIDrawCall.Destroy(dc);
					this.drawCalls.splice(i, 1);
					continue;
				}
				++i;
			}
		}

		if (this.mUpdateScroll) {
			this.mUpdateScroll = false;
			//UIScrollView sv = GetComponent<UIScrollView>();
			//if (sv != null) sv.UpdateScrollbars();
		}
    },
    UpdateTransformMatrix: function(frame) {
        this.worldToLocal = this.transform.worldToLocalMatrix;
        var size = this.GetViewSize() * 0.5;
        var x = this.mClipOffset.x + this.mClipRange.x;
        var y = this.mClipOffset.y + this.mClipRange.y;
        this.mMin.x = x - size.x;
        this.mMin.y = y - size.y;
        this.mMax.x = x + size.x;
        this.mMax.y = y + size.y;
    },
    UpdateLayers: function(frame) {
        // TODO: unity3d layer...
    },
    UpdateWidgets: function(frame) {
		var changed = false;
		for (var i in this.widgets) {
			var w = this.widgets[i];
			if (w.panel != this || !w.enabled)
                continue;
                
            // First update the widget's transform
            if (w.UpdateTransform(frame) || this.mResized) {
                //var vis = forceVisible || (w.CalculateCumulativeAlpha(frame) > 0.001f);
                //w.UpdateVisibility(vis, forceVisible || ((clipped || w.hideIfOffScreen) ? IsVisible(w) : true));
            }
            
            // Update the widget's geometry if necessary
            if (w.UpdateGeometry(frame)) {
                changed = true;
                if (!this.mRebuild) {
                    if (w.drawCall != null)
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
		var pos = this.transform.localPosition;
        var parent = this.transform.parent;
        if (parent != null)
            pos = parent.TransformPoint(pos);

		var rot = this.transform.rotation;
		var scale = this.transform.lossyScale;
		for (var i in this.drawCalls) {
			var dc = this.drawCalls[i];
			var t = dc.transform;
			t.position = pos;
			t.rotation = rot;
			t.localScale = scale;
			dc.renderQueue = (this.renderQueue == RenderQueue.Explicit) ? this.startingRenderQueue : this.startingRenderQueue + i;
			dc.sortingOrder = this.mSortingOrder;
		}
    },
    FillAllDrawCalls: function() {
        if (this.drawCall.length > 0)
            this.drawCall = []; // clear drawCalls

		var mat = null;
		var dc = null;
		var count = 0;
        for (var i in this.widgets) {
            var w = this.widgets[i];
			if (!w.isVisible() || !w.hasVertices()) {
                w.drawCall = null;
                continue;
            }
            var mt = w.material;
            if (mat != mt) {
                if (dc != null && dc.verts.length != 0) {
                    this.drawCalls.push(dc);
                    dc.UpdateGeometry(count);
                    count = 0;
                    dc = null;
                }
                mat = mt;
            }

            if (mat != null) {
                if (dc == null) {
                    dc = new NGUI.UIDrawCall("", this, mat);
                    dc.depthStart = w.mDepth;
                    dc.depthEnd = dc.depthStart;
                    dc.panel = this;
                }
                else {
                    var rd = w.depth;
                    if (rd < dc.depthStart) dc.depthStart = rd;
                    if (rd > dc.depthEnd) dc.depthEnd = rd;
                }
                w.drawCall = dc;

                ++count;
                w.WriteToBuffers(dc.verts, dc.uvs, dc.cols);
            }
        }
    },
});