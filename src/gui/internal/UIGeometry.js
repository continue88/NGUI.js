
NGUI.UIGeometry = function() {
	this.verts = new NGUI.BetterList();
	this.uvs = new NGUI.BetterList();
	this.cols = new NGUI.BetterList();
	this.mRtpVerts = new NGUI.BetterList();
}

NGUI.UIGeometry.prototype = {
	constructor: NGUI.UIGeometry,
	hasVertices: function() { return this.verts.Length > 0; },
	Clear: function() {
		this.verts.Clear();
		this.uvs.Clear();
		this.cols.Clear();
		this.mRtpVerts.Clear();
	},
	ApplyTransform: function(widgetToPanel) {
		var ptpVertes = this.mRtpVerts; 
		ptpVertes.Clear();
		this.verts.Foreach3(function(i, x, y, z) {
			widgetToPanel.MultiplyPoint3x4v(x, y, z, function(x1, y1, z1){
				ptpVertes.AddVector3(x1, y1, z1);
			});
		});
	},
	WriteToBuffers: function(v, u, c) {
		v.AddList(this.mRtpVerts);
		u.AddList(this.uvs);
		c.AddList(this.cols);
	},
}