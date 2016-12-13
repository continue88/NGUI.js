
UnityEngine.Camera = function(gameObject) {
	UnityEngine.Component.call(gameObject);
    this.isOrthoGraphic = false;
    this.nearClipPlane = 0.1;
    this.farClipPlane = 1000;
    this.rect = new UnityEngine.Rect();

	this.worldToCameraMatrix = new UnityEngine.Matrix4x4();
	this.projectionMatrix = new UnityEngine.Matrix4x4();
	this.cameraToWorldMatrix = new UnityEngine.Matrix4x4();
};

Object.assign(NGUI.Camera.prototype, UnityEngine.Component.prototype, {
    constructor: UnityEngine.Camera,
    GetSides: function(depth, relativeTo) {
        var mSides = [];
		if (this.isOrthoGraphic) {
			var os = this.orthographicSize;
                x0 = -os;
                x1 = os;
                y0 = -os;
                y1 = os;
			var rect = this.rect;
			var size = NGUITools.screenSize;
			var aspect = size.x / size.y;
			aspect *= rect.width / rect.height;
			x0 *= aspect;
			x1 *= aspect;

			// We want to ignore the scale, as scale doesn't affect the camera's view region in Unity
			var t = this.transform;
			var rot = t.rotation;
			var pos = t.position;
			mSides[0] = rot * (new UnityEngine.Vector3(x0, 0, depth)) + pos;
			mSides[1] = rot * (new UnityEngine.Vector3(0, y1, depth)) + pos;
			mSides[2] = rot * (new UnityEngine.Vector3(x1, 0, depth)) + pos;
			mSides[3] = rot * (new UnityEngine.Vector3(0, y0, depth)) + pos;
		} else {
			mSides[0] = this.ViewportToWorldPoint(0, 0.5, depth);
			mSides[1] = this.ViewportToWorldPoint(0.5, 1, depth);
			mSides[2] = this.ViewportToWorldPoint(1, 0.5, depth);
			mSides[3] = this.ViewportToWorldPoint(0.5, 0, depth);
		}
		
		if (relativeTo !== undefined) {
			for (var i = 0; i < 4; ++i)
				mSides[i] = relativeTo.InverseTransformPoint(mSides[i]);
		}
		return mSides;
    },
    ViewportToWorldPoint: function(screenX, screenY, screenZ) {
		screenX = 2 * screenX - 1;
		screenY = 1 - 2 * screenY;
		// TODO: ViewportToWorldPoint
    },
});
