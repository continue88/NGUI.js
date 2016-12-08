
NGUI.UIWidget = function() {
    NGUI.UIRect.call();
    
    this.mColor = new THREE.Color(1, 1, 1), // THREE.ColorKeywords.white
    this.mPivot = NGUI.UIWidget.Pivot.Center;
    this.mWidth = 100;
    this.mHeight = 100;
    this.mDepth = 0;
    this.mDrawRegion = new THREE.Vector4(0, 0, 1, 1);

    // public variables.
    this.panel = null;
    this.geometry = null;// new NGUI.UIGeometry();
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
	get pivotOffset() { return NGUIMath.GetPivotOffset(pivot); },
    get drawingDimensions() {
        var offset = pivotOffset;
        var x0 = -offset.x * this.mWidth;
        var y0 = -offset.y * this.mHeight;
        var x1 = x0 + this.mWidth;
        var y1 = y0 + this.mHeight;
        return new THREE.Vector4(
            this.mDrawRegion.x == 0 ? x0 : Mathf.Lerp(x0, x1, this.mDrawRegion.x),
            this.mDrawRegion.y == 0 ? y0 : Mathf.Lerp(y0, y1, this.mDrawRegion.y),
            this.mDrawRegion.z == 1 ? x1 : Mathf.Lerp(x0, x1, this.mDrawRegion.z),
            this.mDrawRegion.w == 1 ? y1 : Mathf.Lerp(y0, y1, this.mDrawRegion.w));
    },
});