
NGUI.UIPanel = function() {
    NGUI.UIRect.call();

    this.startingRenderQueue = 3000;
    this.mDepth = 0;
    this.mSortingOrder = 0;
    this.mUpdateFrame = 0;
    this.mUpdateScroll = false;
    this.mRebuild = false;
    this.mClipOffset = new THREE.Vector2();
    this.mClipRange = new THREE.Vector4();
    this.mMin = new THREE.Vector2();
    this.mMax = new THREE.Vector2();

    this.renderQueue = NGUI.UIPanel.RenderQueue.Automatic;
    this.widgets = []; // NGUI.UIWidget list
    this.drawCalls = []; // NGUI.UIDrawCall
};

NGUI.UIPanel.RenderQueue = {
    Automatic: 0,
    StartAt: 1,
    Explicit: 2,
};

// static variables and function.
NGUI.UIPanel.list = [];
NGUI.UIPanel.UpdateAll = function() {
    var list = NGUI.UIPanel.list;
    for (var i in list)
        list[i].UpdateSelf();

    var rq = 3000;
    for (var i in list) {
        var p = list[i];
        if (p.renderQueue == NGUI.UIPanel.RenderQueue.Automatic) {
            p.startingRenderQueue = rq;
            p.UpdateDrawCalls();
            rq += p.drawCalls.length + 2;
        }
        else if (p.renderQueue == NGUI.UIPanel.RenderQueue.StartAt) {
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

    },
    UpdateSelf: function() {
		this.UpdateTransformMatrix();
		this.UpdateLayers();
		this.UpdateWidgets();
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
    UpdateTransformMatrix: function() {
        this.worldToLocal = this.transform.worldToLocalMatrix;
        var size = this.GetViewSize() * 0.5;
        var x = this.mClipOffset.x + this.mClipRange.x;
        var y = this.mClipOffset.y + this.mClipRange.y;
        this.mMin.x = x - size.x;
        this.mMin.y = y - size.y;
        this.mMax.x = x + size.x;
        this.mMax.y = y + size.y;
    },
    UpdateDrawCalls: function() {
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