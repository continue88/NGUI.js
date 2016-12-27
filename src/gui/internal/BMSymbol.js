
NGUI.BMSymbol = function() {
    this.mSprite = undefined;
    this.mIsValid = false;

    this.sequence = undefined;
    this.spriteName = undefined;
    this.length = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.width = 0;
    this.height = 0;
    this.advance = 0;
    this.uvRect = new UnityEngine.Rect();
}

NGUI.BMSymbol.prototype = {
    constructor: NGUI.BMSymbol,
    Load: function(json) {
        this.sequence = json.q;
        this.spriteName = json.s;
        this.offsetX = json.ox;
        this.offsetY = json.oy;
        this.width = json.w;
        this.height = json.h;
        this.advance = json.a;
        this.length = this.sequence.length;
    },
    MarkAsChanged: function() { this.mIsValid = false; },
    Validate: function(atlas) {
        if (atlas === undefined) return;
        if (this.mIsValid !== true) {
            this.mSprite = atlas.GetSprite(this.spriteName);
            if (this.mSprite !== undefined) {
                var tex = atlas.texture;
                if (tex === undefined) {
                    this.mSprite = undefined;
                } else {
                    this.uvRect.set(this.mSprite.x, this.mSprite.y, this.mSprite.width, this.mSprite.height);
                    this.uvRect = NGUIMath.ConvertToTexCoords(this.uvRect, tex.width, tex.height);
                    this.offsetX = this.mSprite.paddingLeft;
                    this.offsetY = this.mSprite.paddingTop;
                    this.width = this.mSprite.width;
                    this.height = this.mSprite.height;
                    this.advance = this.mSprite.width + (this.mSprite.paddingLeft + this.mSprite.paddingRight);
                    this.mIsValid = true;
                }
            }
        }
        return this.mIsValid;
    },
};