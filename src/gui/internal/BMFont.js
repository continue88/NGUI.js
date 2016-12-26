
NGUI.BMFont = function() {
    this.charSize = 16;
    this.baseOffset = 0;
    this.texWidth = 0;
    this.texHeight = 0;
    this.spriteName = undefined;
    this.glyphs = [];

    this.mDict = {};
    this.mDictCount = 0;
}

NGUI.BMFont.prototype = {
    constructor: NGUI.BMFont,
    get isValid() { return this.glyphs.length > 0; },
    get glyphCount() { return this.glyphs.length; },
    Clear: function() {
        this.glyphs.length = 0;
        this.mDict = {};
        this.mDictCount = 0;
    },
    Load: function(json) {
        this.charSize = json.charSize || 16;
        this.baseOffset = json.baseOffset || 0;
        this.texWidth = json.texWidth || 0;
        this.texHeight = json.texHeight || 0;
        this.spriteName = json.spriteName;
        for (var i in json.glyphs) {
            var glyph = new NGUI.BMGlyph();
            glyph.Load(json.glyphs[i]);
            this.glyphs.push(glyph);
        }
    },
    GetGlyph: function(index, createIfMissing) {
		var glyph = undefined;
		if (this.mDictCount === 0) {
			for (var i in this.glyphs) {
				var bmg = this.glyphs[i];
				this.mDict[bmg.index] = bmg;
                this.mDictCount++;
			}
		}
        glyph = this.mDict[index];
		if (glyph === undefined && createIfMissing) {
			glyph = new NGUI.BMGlyph();
			glyph.index = index;
			this.glyphs.push(glyph);
            this.mDict[index] = glyph;
            this.mDictCount++;
		}
		return glyph;
    },
    Trim (xMin, yMin, xMax, yMax) {
		for (var i in this.glyphs) {
            var glyph = this.glyphs[i];
            glyph.Trim(xMin, yMin, xMax, yMax);
		}
	},
}