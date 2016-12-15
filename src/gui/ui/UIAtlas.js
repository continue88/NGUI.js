
NGUI.UIAtlas = function(gameObject) {
	this.mSprites = {}; // NGUI.UISpriteData
	this.mTexture = new UnityEngine.Texture2D(); // UnityEngine.Texture2D
}

NGUI.UIAtlas.prototype = {
	constructor: NGUI.UIAtlas,
	get texture() { return this.mTexture; },
	GetSprite: function(name) { return this.mSprites[name]; },
	Load: function(json) {
		var sprites = json.sprites; // sprites
		if (sprites !== undefined) {
			for (var key in sprites) {
				var sprite = new NGUI.UISpriteData();
				sprite.Load(sprites[key]);
				this.mSprites[sprite.name] = sprite;
			}
		}
		this.pixelSize = json.pixelSize | 1;
		this.mTexture.width = json.width | 0;
		this.mTexture.height = json.height | 0;

		var tex = this.mTexture;
		UnityEngine.Resources.LoadImage(
			NGUITools.GetImageUrl(json._url_, json.image), 
			function(image){
			tex.image = image; // here is a image...
			tex.width = image.width;
			tex.height = image.height;
		});
	}
};