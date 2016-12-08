
NGUI.UIGeometry = function() {
    this.verts = [];
    this.uvs = [];
    this.cols = [];
    this.mRtpVerts = [];
}

NGUI.UIGeometry.prototype = {
    constructor: NGUI.UIGeometry,
    hasVertices: function() { return this.verts.length > 0; },
    clear: function() {
        if (this.verts.length > 0) this.verts = [];
        if (this.uvs.length > 0) this.uvs = [];
        if (this.cols.length > 0) this.cols = [];
        if (this.mRtpVerts.length > 0) this.mRtpVerts = [];
    },
    ApplyTransform: function(widgetToPanel) {
		if (this.verts.length > 0) {
			this.mRtpVerts = [];
			for (var i = 0, imax = this.verts.length; i < imax; ++i) 
                this.mRtpVerts.add(widgetToPanel.MultiplyPoint3x4(this.verts[i]));
        }
        else if (this.mRtpVerts.length > 0)
            this.mRtpVerts = [];
    },
    WriteToBuffers: function(v, u, c) {
        for (var i = 0; i < this.mRtpVerts.length; ++i) {
            v.Add(this.mRtpVerts.buffer[i]);
            u.Add(this.uvs.buffer[i]);
            c.Add(this.cols.buffer[i]);
        }
    }
}