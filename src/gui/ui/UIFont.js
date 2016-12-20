
NGUI.UIFont = function() {
    this.mFont = new NGUI.BMFont();
    this.bmFont = this.mFont;
    this.mSymbols = [];
    this.mAtlas = undefined;
}

Object.assign(NGUI.UIFont.prototype, {
    constructor: NGUI.UIFont,
    defaultSize: function() { return this.mFont.charSize; },
    hasSymbols: function() { return this.mSymbols.length > 0; },
    Load: function(json) {
        if (json.font !== undefined) this.mFont.Load(json.font);
        if (json.symbols !== undefined) {
            for (var i in json.symbols) {
                var symbol = new NGUI.BMGlyph();
                symbol.Load(json.symbols[i]);
                this.mSymbols.push(symbol);
            }
        }
        if (json.atlas !== undefined)
		    this.mAtlas = UnityEngine.Resources.Load(json.atlas, 'UIAtlas');
    }
});
