
NGUI.UISprite = function() {
    NGUI.UIBasicSprite.call();
    this.mAtlas = null;
    this.mSpriteName = '';
    this.mSprite = null; // refrence to UISpriteData
};

Object.assign(NGUI.UISprite.prototype, NGUI.UIBasicSprite.prototype, {
    constructor: NGUI.UISprite,
    get material() { return this.mAtlas ? this.mAtlas.material : null; },
    border: function() {
        var sp = this.GetAtlasSprite();
        if (sp) return new THREE.Vector4(sp.borderLeft, sp.borderBottom, sp.borderRight, sp.borderTop);
        return new THREE.Vector4(0, 0, 0, 0); 
    },
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
