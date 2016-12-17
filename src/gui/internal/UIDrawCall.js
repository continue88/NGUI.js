
NGUI.UIDrawCall = function (name, panel, texture) {
	this.widgetCount = 0;
	this.depthStart = 2147483647; // MaxValue = 2147483647
	this.depthEnd = -2147483648; // int.MinValue = -2147483648;
	this.isDirty = false;

	this.texture = texture;
	this.renderQueue = panel.startingRenderQueue;
	this.manager = panel;
	this.panel = panel; // NGUI.UIPanel
	
	this.verts = [];// Vector3
	this.uvs = [];// Vector2
	this.cols = [];// Vector3

	this.mMesh = undefined;
	this.mSortingOrder = panel.mSortingOrder;
	this.mClipCount = panel.clipCount();

	this.localToWorldMatrix = new UnityEngine.Matrix4x4();
	this.ClipRange = []; // Vector4
	this.ClipArgs = []; // Vector4
};

NGUI.UIDrawCall.prototype = {
	constructor: NGUI.UIDrawCall,
	destroy: function() {
		if (this.mMesh) {
			this.mMesh.destroy();
			this.mMesh = undefined;
		}
	},
	BuildTriangles: function(vertexCount) {
		var index = 0;
		var indexCount = vertexCount / 4 * 6;
		var indexBuffer = new Uint16Array(indexCount);
		for (var i = 0; i < vertexCount; i += 4) {
			indexBuffer[index++] = i;
			indexBuffer[index++] = i + 1;
			indexBuffer[index++] = i + 2;
			indexBuffer[index++] = i + 2;
			indexBuffer[index++] = i + 3;
			indexBuffer[index++] = i;
		}
	},
	UpdateGeometry: function(count) {
		this.mMesh = new UnityEngine.Mesh();
		this.mMesh.CopyVertexData(this.verts, this.uvs, this.cols, this.BuildTriangles(this.verts.length));
		// clean.
		this.verts.length = 0;
		this.uvs.length = 0;
		this.cols.length = 0;
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
			if (currentPanel.hasClipping()) {
				var angle = 0;
				var cr = currentPanel.drawCallClipRange.clone();
				if (currentPanel != this.panel) {
					var pos = currentPanel.transform.InverseTransformPoint(this.panel.transform.position);
					cr.x -= pos.x;
					cr.y -= pos.y;
					var v0 = this.panel.transform.rotation.eulerAngles();
					var v1 = currentPanel.transform.rotation.eulerAngles();
					var diff = v1.sub(v0);
					diff.x = NGUIMath.WrapAngle(diff.x);
					diff.y = NGUIMath.WrapAngle(diff.y);
					diff.z = NGUIMath.WrapAngle(diff.z);
					angle = diff.z;
				}
				this.SetClipping(i++, cr, currentPanel.mClipSoftness, angle);
			}
			currentPanel = currentPanel.parentPanel;
		}
	},
};