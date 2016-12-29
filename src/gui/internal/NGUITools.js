
NGUITools = {
	screenSize: new UnityEngine.Vector2(640, 480),
	FindInParents: function(go, typeName) {
		var comp = go.GetComponent(typeName);
		if (comp === undefined) {
			var t = go.transform.parent;
			while (t !== undefined && comp === undefined) {
				comp = t.gameObject.GetComponent(typeName);
				t = t.parent;
			}
		}
		return comp;
	},
	CalculateRaycastDepth: function(go) {
		var w = go.GetComponent('UIWidget');
		if (w !== undefined) return w.raycastDepth();
		var widgets = go.GetComponentsInChildren('UIWidget');
		if (widgets.length == 0) return 0;
		var depth = 1000000;
		for (var i in widgets) {
			w = widgets[i];
			if (w.enabled === true) depth = Math.min(depth, w.raycastDepth());
		}
		return depth;
	},
	FindCameraForLayer: function(layer) {
		// TODO: add layer supported.
		return NGUI.UICamera.current.camera;
	},
	GetImageUrl: function(atlasUrl, imageName) {
		return atlasUrl.substring(0, atlasUrl.lastIndexOf('/') + 1) + imageName;
	},
};