
NGUI.UISprite = function() {
	NGUI.UIBasicSprite.call();
	this.mAtlas = undefined;
	this.mSpriteName = '';
	this.mSprite = undefined; // refrence to UISpriteData
};

Object.assign(NGUI.UISprite.prototype, NGUI.UIBasicSprite.prototype, {
	constructor: NGUI.UISprite,
	get material() { return this.mAtlas ? this.mAtlas.material : undefined; },
	border: function() {
		var sp = this.GetAtlasSprite();
		if (sp) return new UnityEngine.Vector4(sp.borderLeft, sp.borderBottom, sp.borderRight, sp.borderTop);
		return new UnityEngine.Vector4(0, 0, 0, 0); 
	},
	Load: function(json) {
		NGUI.UIBasicSprite.Load.call(this, json);
		// json.atlas; // TODO: find atlas with name.
		this.mSpriteName = this.sprite;
	},
	GetAtlasSprite: function() {
		if (this.mAtlas !== undefined && this.mSprite === undefined) 
			this.mSprite = this.mAtlas.GetSprite(this.mSpriteName);
		return this.mSprite;
	},
	OnFill: function(verts, uvs, cols) {
		if (this.mAtlas === undefined) return;
		var mat = this.mAtlas.material;
		if (mat === undefined || mat.image === undefined) return;

		var sprite = this.GetAtlasSprite();
		if (sprite === undefined) return;

		var outer = new NGUI.Rect(sprite.x, sprite.y, sprite.width, sprite.height);
		var inner = new NGUI.Rect(sprite.x + sprite.borderLeft, sprite.y + sprite.borderTop,
			sprite.width - sprite.borderLeft - sprite.borderRight,
			sprite.height - sprite.borderBottom - sprite.borderTop);

		var image = mat.image;
		outer = NGUIMath.ConvertToTexCoords(outer, image.width, image.height);
		inner = NGUIMath.ConvertToTexCoords(inner, image.width, image.height);
		this.Fill(verts, uvs, cols, outer, inner);
	},
});
