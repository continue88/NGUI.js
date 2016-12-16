
NGUI.UISprite = function(gameObject) {
	NGUI.UIBasicSprite.call(this, gameObject);
	this.mAtlas = undefined;
	this.mSpriteName = '';
	this.mSprite = undefined; // refrence to UISpriteData
};

Object.assign(NGUI.UISprite.prototype, NGUI.UIBasicSprite.prototype, {
	constructor: NGUI.UISprite,
	get texture() { return this.mAtlas ? this.mAtlas.texture : undefined; },
	border: function() {
		var sp = this.GetAtlasSprite();
		if (sp) return new UnityEngine.Vector4(sp.borderLeft, sp.borderBottom, sp.borderRight, sp.borderTop);
		return new UnityEngine.Vector4(0, 0, 0, 0); 
	},
	Load: function(json) {
		NGUI.UIBasicSprite.prototype.Load.call(this, json);
		this.mAtlas = UnityEngine.Resources.Load(json.l, 'UIAtlas');
		this.mSpriteName = json.s;
	},
	GetAtlasSprite: function() {
		if (this.mAtlas !== undefined && this.mSprite === undefined) 
			this.mSprite = this.mAtlas.GetSprite(this.mSpriteName);
		return this.mSprite;
	},
	OnFill: function(verts, uvs, cols) {
		if (this.mAtlas === undefined) return;
		var texture = this.mAtlas.texture;
		if (texture === undefined) return;

		var sprite = this.GetAtlasSprite();
		if (sprite === undefined) return;

		var outer = new NGUI.Rect(sprite.x, sprite.y, sprite.width, sprite.height);
		var inner = new NGUI.Rect(sprite.x + sprite.borderLeft, sprite.y + sprite.borderTop,
			sprite.width - sprite.borderLeft - sprite.borderRight,
			sprite.height - sprite.borderBottom - sprite.borderTop);
		outer = NGUIMath.ConvertToTexCoords(outer, texture.width, texture.height);
		inner = NGUIMath.ConvertToTexCoords(inner, texture.width, texture.height);
		this.Fill(verts, uvs, cols, outer, inner);
	},
});
