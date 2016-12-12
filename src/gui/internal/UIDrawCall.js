
NGUI.UIDrawCall = function (name, panel, material) {

	this.mClipCount = 0;

	this.widgetCount = 0;
	this.depthStart = 2147483647; // MaxValue = 2147483647
	this.depthEnd = -2147483648; // int.MinValue = -2147483648;
	this.isDirty = false;

	this.baseMaterial = material;
	this.renderQueue = panel.startingRenderQueue;
	this.mSortingOrder = panel.mSortingOrder;
	this.manager = panel;
	this.panel = undefined; // NGUI.UIPanel
	
	this.verts = [];// Vector3
	this.uvs = [];// Vector3
	this.cols = [];// Vector3

	this.ClipRange = []; // Vector4
	this.ClipArgs = []; // Vector4
};

NGUI.UIDrawCall.prototype = {
	constructor: NGUI.UIDrawCall,
	UpdateGeometry: function(count) {
	},
};