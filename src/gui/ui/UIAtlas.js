
NGUI.UIAtlas = function(gameObject) {
	this.material = undefined;
	this.mSprites = {}; // NGUI.UISpriteData
}

NGUI.UIAtlas.prototype = {
	constructor: NGUI.UIAtlas,
	GetSprite: function(name) {
		return this.mSprites[name];
	},
	Load: function(json) {
		var sprites = json.sprites; // sprites
		if (sprites !== undefined) {
			for (var key in sprites) {
				var sprite = new NGUI.UISpriteData();
				sprite.Load(sprites[key]);
				this.mSprites[sprite.name] = sprite;
			}
		}
		this.material = json.mat; // just copy
	}
};