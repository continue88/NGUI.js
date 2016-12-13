
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
	SetClipping: function(index, cr, soft, angle) {
		angle *= -Mathf.Deg2Rad;
		var sharpness = new UnityEngine.Vector2(1000.0, 1000.0);
		if (soft.x > 0) sharpness.x = cr.z / soft.x;
		if (soft.y > 0) sharpness.y = cr.w / soft.y;
		this.ClipRange[index] = new UnityEngine.Vector4(-cr.x / cr.z, -cr.y / cr.w, 1 / cr.z, 1 / cr.w);
		this.ClipArgs[index] = new UnityEngine.Vector4(sharpness.x, sharpness.y, Math.sin(angle), Math.cos(angle));
	},
	OnWillRenderObject: function() {
		var currentPanel = this.panel;
		for (var i = 0; currentPanel !== undefined; ) {
			if (currentPanel.hasClipping) {
				var angle = 0;
				var cr = currentPanel.drawCallClipRange.clone();
				if (currentPanel != this.panel) {
					var pos = currentPanel.transform.InverseTransformPoint(this.panel.transform.position);
					cr.x -= pos.x;
					cr.y -= pos.y;
					var v0 = panel.transform.rotation.eulerAngles();
					var v1 = currentPanel.transform.rotation.eulerAngles();
					var diff = v1.sub(v0);
					diff.x = NGUIMath.WrapAngle(diff.x);
					diff.y = NGUIMath.WrapAngle(diff.y);
					diff.z = NGUIMath.WrapAngle(diff.z);
					angle = diff.z;
				}
				SetClipping(i++, cr, currentPanel.clipSoftness, angle);
			}
			currentPanel = currentPanel.parentPanel;
		}
	},
};