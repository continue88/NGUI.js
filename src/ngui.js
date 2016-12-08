// autogen by combine tools.
NGUI={}

//
// "F:\Projects\H5\NGUI.js\src\gui\common\Rect.js"
//

NGUI.Rect = function(left, top, width, height) {
    this.xMin = left;
    this.xMax = left + width;
    this.yMin = top;
    this.yMax = top + height;
};

NGUI.Rect.prototype = {
    constructor: NGUI.Rect,
    get left() { return this.xMin; },
    get top() { return this.yMin; },
    get width() { return this.xMax - this.xMin; },
    get height() { return this.yMax - this.yMin; },
    copy: function(source) {
        this.xMin = source.xMin;
        this.xMax = source.xMax;
        this.yMin = source.yMin;
        this.yMax = source.yMax;
        return this;
    },
};
//
// "F:\Projects\H5\NGUI.js\src\gui\common\Mathf.js"
//

Mathf = {
    
	lerp: function(t, a, b) {
		return a + t * (b - a);
	}
}
//
// "F:\Projects\H5\NGUI.js\src\gui\internal\NGUIMath.js"
//

NGUIMath = {
    ConvertToTexCoords: function(rect, width, height) {
		var final = rect;
		if (width != 0 && height != 0) {
			final.xMin = rect.xMin / width;
			final.xMax = rect.xMax / width;
			final.yMin = 1 - rect.yMax / height;
			final.yMax = 1 - rect.yMin / height;
		}
		return final;
    },
    GetPivotOffset: function(pv) {
		var v = new THREE.Vector2();
		if (pv == NGUI.UIWidget.Pivot.Top || pv == NGUI.UIWidget.Pivot.Center || pv == NGUI.UIWidget.Pivot.Bottom) v.x = 0.5;
		else if (pv == NGUI.UIWidget.Pivot.TopRight || pv == NGUI.UIWidget.Pivot.Right || pv == NGUI.UIWidget.Pivot.BottomRight) v.x = 1;
		else v.x = 0;

		if (pv == NGUI.UIWidget.Pivot.Left || pv == NGUI.UIWidget.Pivot.Center || pv == NGUI.UIWidget.Pivot.Right) v.y = 0.5;
		else if (pv == NGUI.UIWidget.Pivot.TopLeft || pv == NGUI.UIWidget.Pivot.Top || pv == NGUI.UIWidget.Pivot.TopRight) v.y = 1;
		else v.y = 0;

		return v;
	}
};
//
// "F:\Projects\H5\NGUI.js\src\gui\internal\UIRect.js"
//

NGUI.UIRect = function() {
    this.finalAlpha = 1;
};

NGUI.UIRect.prototype = {
    constructor: NGUI.UIRect,
    copy: function(source) {
        return this;
    },
};
//
// "F:\Projects\H5\NGUI.js\src\gui\internal\UIWidget.js"
//

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
	get pivotOffset() { return NGUIMath.GetPivotOffset(this.mPivot); },
    drawingDimensions: function() {
        var offset = this.pivotOffset;
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
//
// "F:\Projects\H5\NGUI.js\src\gui\internal\UIBasicSprite.js"
//

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
    drawingUVs: function() {
        switch (this.mFlip) {
            case NGUI.UIBasicSprite.Flip.Horizontally: return new THREE.Vector4(this.mOuterUV.xMax, this.mOuterUV.yMin, this.mOuterUV.xMin, this.mOuterUV.yMax);
            case NGUI.UIBasicSprite.Flip.Vertically: return new THREE.Vector4(this.mOuterUV.xMin, this.mOuterUV.yMax, this.mOuterUV.xMax, this.mOuterUV.yMin);
            case NGUI.UIBasicSprite.Flip.Both: return new THREE.Vector4(this.mOuterUV.xMax, this.mOuterUV.yMax, this.mOuterUV.xMin, this.mOuterUV.yMin);
            default: return new THREE.Vector4(this.mOuterUV.xMin, this.mOuterUV.yMin, this.mOuterUV.xMax, this.mOuterUV.yMax);
        }
    },
    drawingColor: function() { return new THREE.Color(this.mColor.r, this.mColor.g, this.mColor.b, this.this.finalAlpha); },
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
		var v = this.drawingDimensions();
		var u = this.drawingUVs();
		var c = this.drawingColor();
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

//
// "F:\Projects\H5\NGUI.js\src\gui\ui\UISprite.js"
//

NGUI.UISprite = function() {
    NGUI.UIBasicSprite.call();
    this.mAtlas = null;
    this.mSpriteName = '';
    this.mSprite = null; // refrence to UISpriteData
};

Object.assign(NGUI.UISprite.prototype, NGUI.UIBasicSprite.prototype, {
    constructor: NGUI.UISprite,
    GetAtlasSprite: function() {
        if (this.mAtlas && !this.mSprite) 
            this.mSprite = this.mAtlas.GetSprite(this.mSpriteName);
        return this.mSprite;
    },
    Load: function(json) {
        // this.mAtlas, find atlas...
    },
    OnFill: function(verts, uvs, cols) {
		var tex = this.mAtlas ? this.mAtlas.material.map : null;
        if (!tex || !tex.image) return;

        var sprite = this.GetAtlasSprite();
		var outer = new NGUI.Rect(sprite.x, sprite.y, sprite.width, sprite.height);
		var inner = new NGUI.Rect(sprite.x + sprite.borderLeft, sprite.y + sprite.borderTop,
            sprite.width - sprite.borderLeft - sprite.borderRight,
            sprite.height - sprite.borderBottom - sprite.borderTop);

		outer = NGUIMath.ConvertToTexCoords(outer, tex.image.width, tex.image.height);
		inner = NGUIMath.ConvertToTexCoords(inner, tex.image.width, tex.image.height);
        this.Fill(verts, uvs, cols, outer, inner);
    },
});

//
// "F:\Projects\H5\NGUI.js\src\gui\ui\UIAtlas.js"
//

NGUI.UIAtlas = function() {
    this.material = new THREE.SpriteMaterial();
    this.mSprites = {}; // NGUI.UISpriteData
}

NGUI.UIAtlas.prototype = {
    constructor: NGUI.UIAtlas,
    GetSprite: function(name) {
        return this.mSprites[name];
    },
    Load: function(json) {
        if (!(typeof json === 'object')) return;
        //this.material = json.texture; // material
        var sprites = json.mSprites; // sprites
        if (typeof sprites === 'object') {
            for (var key in sprites) {
                var sprite = new NGUI.UISpriteData();
                sprite.Load(sprites[key]);
                this.mSprites[sprite.name] = sprite;
            }
        }
    }
};
//
// "F:\Projects\H5\NGUI.js\src\gui\ui\UIPanel.js"
//

NGUI.UIPanel = function() {
    NGUI.UIRect.call();
};

Object.assign(NGUI.UIPanel.prototype, NGUI.UIRect.prototype, {
    constructor: NGUI.UIPanel,
});
//
// "F:\Projects\H5\NGUI.js\src\gui\ui\UISpriteData.js"
//

NGUI.UISpriteData = function() {
	this.name = "Sprite";
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;

	this.borderLeft = 0;
	this.borderRight = 0;
	this.borderTop = 0;
	this.borderBottom = 0;

	this.paddingLeft = 0;
	this.paddingRight = 0;
	this.paddingTop = 0;
	this.paddingBottom = 0;
};

NGUI.UISpriteData.prototype = {
    constructor: NGUI.UISpriteData,
    Load: function(json) {
        Object.assign(this, json);
        return this;
    },
};