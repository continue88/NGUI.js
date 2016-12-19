
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
	FindCameraForLayer: function(layer) {
		// TODO: add layer supported.
		return NGUI.UICamera.current.camera;
	},
	GetImageUrl: function(atlasUrl, imageName) {
		return atlasUrl.substring(0, atlasUrl.lastIndexOf('/') + 1) + imageName;
	},
};