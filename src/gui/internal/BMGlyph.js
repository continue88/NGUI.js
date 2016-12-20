
NGUI.BMGlyph = function() {
	this.index = 0;
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.offsetX = 0;
	this.offsetY = 0;
	this.advance = 0;
	this.channel = 0;
	this.kerning = undefined;
}

NGUI.BMGlyph.prototype = {
    constructor: NGUI.BMGlyph,
    Load: function(json) {
        this.index = json.i || 0;
        this.x = json.x || 0;
        this.y = json.y || 0;
        this.width = json.w || 0;
        this.height = json.h || 0;
        this.offsetX = json.ox || 0;
        this.offsetY = json.oy || 0;
        this.advance = json.a || 0;
        this.channel = json.c || 0;
    },
	GetKerning: function(previousChar) {
		if (this.kerning !== undefined && previousChar !== 0) {
			for (var i = 0, imax = this.kerning.length; i < imax; i += 2)
				if (this.kerning[i] == previousChar)
					return kerning[i + 1];
		}
		return 0;
	},
    SetKerning: function(previousChar, amount) {
		if (this.kerning === undefined) this.kerning = [];
		for (var i = 0, imax = this.kerning.length; i < imax; i += 2) {
			if (this.kerning[i] == previousChar) {
				kerning[i + 1] = amount;
				return;
			}
		}
		this.kerning.Add(previousChar);
		this.kerning.Add(amount);
	},
    Trim: function(xMin, yMin, xMax, yMax) {
		var x1 = this.x + this.width;
		var y1 = this.y + this.height;
		if (this.x < xMin) {
			var offset = xMin - this.x;
			this.x += offset;
			this.width -= offset;
			this.offsetX += offset;
		}
		if (this.y < yMin) {
			var offset = yMin - this.y;
			this.y += offset;
			this.height -= offset;
			this.offsetY += offset;
		}
		if (this.x1 > xMax) this.width  -= this.x1 - xMax;
		if (this.y1 > yMax) this.height -= this.y1 - yMax;
	},
}