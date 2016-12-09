
NGUI.UIWidget = function() {
    NGUI.UIRect.call();
    
    this.mColor = new THREE.Color(1, 1, 1), // THREE.ColorKeywords.white
    this.mPivot = NGUI.UIWidget.Pivot.Center;
    this.mWidth = 100;
    this.mHeight = 100;
    this.mDepth = 0;
    this.mChanged = false;
    this.mMoved = false;
    this.mIsInFront = true;
    this.mIsVisibleByAlpha = true;
    this.mIsVisibleByPanel = true;
    this.mDrawRegion = new THREE.Vector4(0, 0, 1, 1);
    this.mLocalToPanel = new THREE.Matrix4();
    this.mMatrixFrame = 1;

    // public variables.
    this.fillGeometry = true;
    this.panel = null;
    this.drawCall = null;
    this.geometry = new NGUI.UIGeometry();
};

NGUI.UIWidget.Pivot = {
    TopLeft: 0,
    Top: 1,
    TopRight: 2,
    Left: 3,
    Center: 4,
    Right: 5,
    BottomLeft: 6,
    Bottom: 7,
    BottomRight: 8,
};

Object.assign(NGUI.UIWidget.prototype, NGUI.UIRect.prototype, {
    constructor: NGUI.UIWidget,
	get pivotOffset() { return NGUIMath.GetPivotOffset(this.mPivot); },
    get material() { return null; },
    isVisible: function() { return this.mIsVisibleByAlpha && this.mIsVisibleByPanel && this.mIsInFront && this.finalAlpha > 0.001; },
    hasVertices: function() { return this.geometry.hasVertices(); },
    border: function() { return new THREE.Vector4(0, 0, 0, 0); },
    OnFill: function(verts, uvs, cols) { },
    UpdateVisibility: function(visibleByAlpha, visibleByPanel) {
		if (this.mIsVisibleByAlpha != visibleByAlpha || this.mIsVisibleByPanel != visibleByPanel) {
			this.mChanged = true;
			this.mIsVisibleByAlpha = visibleByAlpha;
			this.mIsVisibleByPanel = visibleByPanel;
			return true;
		}
		return false;
    },
    drawingDimensions: function() {
        var offset = this.pivotOffset;
        var x0 = -offset.x * this.mWidth;
        var y0 = -offset.y * this.mHeight;
        var x1 = x0 + this.mWidth;
        var y1 = y0 + this.mHeight;
        return new THREE.Vector4(
            this.mDrawRegion.x == 0 ? x0 : UnityEngine.Mathf.Lerp(x0, x1, this.mDrawRegion.x),
            this.mDrawRegion.y == 0 ? y0 : UnityEngine.Mathf.Lerp(y0, y1, this.mDrawRegion.y),
            this.mDrawRegion.z == 1 ? x1 : UnityEngine.Mathf.Lerp(x0, x1, this.mDrawRegion.z),
            this.mDrawRegion.w == 1 ? y1 : UnityEngine.Mathf.Lerp(y0, y1, this.mDrawRegion.w));
    },
    UpdateGeometry: function(frame) {
        if (this.mChanged) {
            this.mChanged = false;
            if (this.mIsVisibleByAlpha && this.finalAlpha > 0.001) {
                var hadVertices = this.geometry.hasVertices;
                if (this.fillGeometry) {
                    this.geometry.Clear();
                    this.OnFill(this.geometry.verts, this.geometry.uvs, this.geometry.cols);
                }
                if (geometry.hasVertices) {
					if (this.mMatrixFrame != frame) {
						this.mLocalToPanel = this.panel.worldToLocal * this.transform.localToWorldMatrix;
						this.mMatrixFrame = frame;
					}
					this.geometry.ApplyTransform(this.mLocalToPanel);
					this.mMoved = false;
					return true;
                }
            }
            
            if (this.fillGeometry) this.geometry.Clear();
            this.mMoved = false;
            return true;
        }
        else if (this.mMoved && this.geometry.hasVertices()) {
            if (this.mMatrixFrame != frame) {
                this.mLocalToPanel = this.panel.worldToLocal * this.transform.localToWorldMatrix;
                this.mMatrixFrame = frame;
            }
			this.geometry.ApplyTransform(this.mLocalToPanel);
            this.mMoved = false;
            return true;
        }
        this.mMoved = false;
        return false;
    },
    WriteToBuffers: function(v, u, c) {
        this.geometry.WriteToBuffers(v, u, c);
    },
});