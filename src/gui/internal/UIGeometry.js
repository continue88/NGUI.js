
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
		this.verts.length = 0;
		this.uvs.length = 0;
		this.cols.length = 0;
		this.mRtpVerts.length = 0;
	},
	ApplyTransform: function(widgetToPanel) {
		this.mRtpVerts.length = 0;
		for (var i in this.verts)
			this.mRtpVerts.push(widgetToPanel.MultiplyPoint3x4(this.verts[i]));
	},
	WriteToBuffers: function(v, u, c) {
		for (var i in this.mRtpVerts) {
			v.push(this.mRtpVerts.buffer[i]);
			u.push(this.uvs.buffer[i]);
			c.push(this.cols.buffer[i]);
		}
	},
}