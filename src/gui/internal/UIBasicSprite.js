
NGUI.UIBasicSprite = function() {
    NGUI.UIWidget.call();
    this.mOuterUV = new NGUI.Rect(0, 0, 1, 1);
    this.mInnerUV = new NGUI.Rect(0, 0, 1, 1);
};

NGUI.UIBasicSprite.Type = {
    Simple: 0,
    Sliced: 1,
    Tiled: 2,
    Filled: 3,
    Advanced: 4,
};
NGUI.UIBasicSprite.FillDirection = {
    Horizontal: 0,
    Vertical: 1,
    Radial90: 2,
    Radial180: 3,
    Radial360: 4,
};
NGUI.UIBasicSprite.AdvancedType = {
    Invisible: 0,
    Sliced: 1,
    Tiled: 2,
};
NGUI.UIBasicSprite.Flip = {
    Nothing: 0,
    Horizontally: 1,
    Vertically: 2,
    Both: 3,
};

Object.assign(NGUI.UIBasicSprite.prototype, NGUI.UIWidget.prototype, {
    constructor: NGUI.UIBasicSprite,
    get drawingUVs() {
        switch (this.mFlip) {
            case NGUI.Flip.Horizontally: return new THREE.Vector4(this.mOuterUV.xMax, this.mOuterUV.yMin, this.mOuterUV.xMin, this.mOuterUV.yMax);
            case NGUI.Flip.Vertically: return new THREE.Vector4(this.mOuterUV.xMin, this.mOuterUV.yMax, this.mOuterUV.xMax, this.mOuterUV.yMin);
            case NGUI.Flip.Both: return new THREE.Vector4(this.mOuterUV.xMax, this.mOuterUV.yMax, this.mOuterUV.xMin, this.mOuterUV.yMin);
            default: return new THREE.Vector4(this.mOuterUV.xMin, this.mOuterUV.yMin, this.mOuterUV.xMax, this.mOuterUV.yMax);
        }
    },
    get drawingColor() { return new THREE.Color(this.mColor.r, this.mColor.g, this.mColor.b, this.this.finalAlpha); },
	Fill: function(verts, uvs, cols, outer, inner) {
		this.mOuterUV = outer;
		this.mInnerUV = inner;
		switch (type) {
        case NGUI.UIBasicSprite.Type.Simple:
            this.SimpleFill(verts, uvs, cols);
            break;
        case NGUI.UIBasicSprite.Type.Sliced:
            this.SlicedFill(verts, uvs, cols);
            break;
        case NGUI.UIBasicSprite.Type.Filled:
            this.FilledFill(verts, uvs, cols);
            break;
        case NGUI.UIBasicSprite.Type.Tiled:
            this.TiledFill(verts, uvs, cols);
            break;
        case NGUI.UIBasicSprite.Type.Advanced:
            this.AdvancedFill(verts, uvs, cols);
            break;
		}
	},
	SimpleFill: function(verts, uvs, cols) {
		var v = this.drawingDimensions;
		var u = this.drawingUVs;
		var c = this.drawingColor;
		verts.Add(new THREE.Vector3(v.x, v.y));
		verts.Add(new THREE.Vector3(v.x, v.w));
		verts.Add(new THREE.Vector3(v.z, v.w));
		verts.Add(new THREE.Vector3(v.z, v.y));
		uvs.Add(new THREE.Vector2(u.x, u.y));
		uvs.Add(new THREE.Vector2(u.x, u.w));
		uvs.Add(new THREE.Vector2(u.z, u.w));
		uvs.Add(new THREE.Vector2(u.z, u.y));
		cols.Add(c);
		cols.Add(c);
		cols.Add(c);
		cols.Add(c);
	},
});
