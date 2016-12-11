
NGUI.UIAtlas = function(gameObject) {
	UnityEngine.MonoBehaviour.call(gameObject);

	this.material = new THREE.SpriteMaterial();
	this.mSprites = {}; // NGUI.UISpriteData
}

Object.assign(NGUI.UIAtlas.prototype, UnityEngine.MonoBehaviour.prototype, {
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
});