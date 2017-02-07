
NGUI.UIFont = function() {
    this.mFont = new NGUI.BMFont();
    this.mSymbols = [];
    this.mAtlas = undefined;
    this.mSprite = undefined;
    this.mUVRect = new UnityEngine.Rect(0, 0, 1, 1);

    // dynamic font.
    this.mDynamicFont = undefined;
    this.mDynamicFontSize = 16;
    this.mDynamicFontStyle = UnityEngine.FontStyle.Normal;

    this.bmFont = this.mFont;
}

NGUI.UIFont.prototype = {
    constructor: NGUI.UIFont,
    get texWidth() { return this.mFont !== undefined ? this.mFont.texWidth : 0; },
    get texHeight() { return this.mFont !== undefined ? this.mFont.texHeight : 0; },
    get uvRect() { return this.mUVRect; },
    get dynamicFont() { return this.mDynamicFont; },
    get dynamicFontStyle() { return this.mDynamicFontStyle; },
    get isDynamic() { return this.mDynamicFont !== undefined; },
    get defaultSize() { return this.isDynamic ? this.mDynamicFontSize : this.mFont.charSize; },
    get hasSymbols() { return this.mSymbols.length > 0; },
    texture: function() { return this.mAtlas !== undefined ? this.mAtlas.texture : undefined; },
    Load: function(json) {
        //if (json.dynamic) this.mDynamicFont
        if (json.font !== undefined) this.mFont.Load(json.font);
        if (json.symbols !== undefined) {
            for (var i in json.symbols) {
                var symbol = new NGUI.BMSymbol();
                symbol.Load(json.symbols[i]);
                this.mSymbols.push(symbol);
            }
        }
        if (json.atlas !== undefined)
		    this.mAtlas = UnityEngine.Resources.Load(json.atlas, 'UIAtlas');
        this.UpdateUVRect();
    },
    UpdateUVRect: function() {
        this.mSprite = this.mAtlas.GetSprite(this.mFont.spriteName);
        var tex = this.mAtlas.texture;
        if (tex === undefined) return;
        this.mUVRect = new UnityEngine.Rect(
            this.mSprite.x - this.mSprite.paddingLeft,
            this.mSprite.y - this.mSprite.paddingTop,
            this.mSprite.width + this.mSprite.paddingLeft + this.mSprite.paddingRight,
            this.mSprite.height + this.mSprite.paddingTop + this.mSprite.paddingBottom);
        this.mUVRect = NGUIMath.ConvertToTexCoords(this.mUVRect, tex.width, tex.height);
        if (this.mSprite.hasPadding) this.Trim();
    },
    Trim: function() {
		var texture = this.mAtlas.texture;
		if (texture !== undefined && this.mSprite !== undefined) {
			var full = NGUIMath.ConvertToPixels(this.mUVRect, texture.width, texture.height, true);
			var trimmed = new UnityEngine.Rect(this.mSprite.x, this.mSprite.y, this.mSprite.width, this.mSprite.height);
			var xMin = Mathf.RoundToInt(trimmed.xMin - full.xMin);
			var yMin = Mathf.RoundToInt(trimmed.yMin - full.yMin);
			var xMax = Mathf.RoundToInt(trimmed.xMax - full.xMin);
			var yMax = Mathf.RoundToInt(trimmed.yMax - full.yMin);
			this.mFont.Trim(xMin, yMin, xMax, yMax);
		}
    },
};
