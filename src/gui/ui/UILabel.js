
NGUI.UILabel = function(gameObject) {
    NGUI.UIWidget.call(this, gameObject);
    this.bitmapFont = undefined;
    this.fontSize = 20;
    this.value = "";
    this.overflowMethod = LabelOverflow.ShrinkContent;
    this.alignment = TextAlignment.Automatic;
    this.gradientTop = new UnityEngine.Color(1, 1, 1, 1);
    this.gradientBottom = new UnityEngine.Color(1, 1, 1, 1);
    this.effectStyle = LabelEffect.None;
    this.effectColor = new UnityEngine.Color(0, 0, 0, 1);
    this.effectDistance = new UnityEngine.Vector2(1, 1);
    this.spacingX = 0;
    this.spacingY = 0;
    this.maxLineCount = 0;
    this.supportEncoding = false;
    this.symbolStyle = SymbolStyle.Normal;
    this.fontStyle = FontStyle.Normal;
    this.applyGradient = false;

    this.mCalculatedSize = new UnityEngine.Vector2(0, 0);
    this.mScale = 1;
    this.mPrintedSize = 0;
    this.mLastWidth = 0;
    this.mLastHeight = 0;
    this.mShouldBeProcessed = false;
    this.mProcessedText = "";
    this.mPremultiply = false;
	this.mMaxLineWidth = 0;
	this.mMaxLineHeight = 0;
	this.mLineWidth = 0;
};

LabelEffect = {
    None: 0,
    Shadow: 1,
    Outline: 2,
};

LabelOverflow = {
    ShrinkContent: 0,
    ClampContent: 1,
    ResizeFreely: 2,
    ResizeHeight: 3,
};

TextAlignment ={
    Automatic : 0,
    Left: 1,
    Center: 2,
    Right: 3,
    Justified: 4,
};

SymbolStyle = {
    None: 0,
    Normal: 1,
    Colored: 2,
};

FontStyle = {
    Normal: 0,
    Bold: 1,
    Italic: 2,
    BoldAndItalic: 3,
};

Object.assign(NGUI.UILabel.prototype = Object.create(NGUI.UIWidget.prototype), {
	constructor: NGUI.UILabel,
	texture: function() { return (this.bitmapFont !== undefined) ? this.bitmapFont.texture() : undefined; },
    defaultFontSize: function() { return (this.bitmapFont !== undefined) ? this.bitmapFont.defaultSize() : 16; },
    processedText: function() {
        if (this.mLastWidth !== this.mWidth || this.mLastHeight !== this.mHeight) {
            this.mLastWidth = this.mWidth;
            this.mLastHeight = this.mHeight;
            this.mShouldBeProcessed = true;
        }
        if (this.mShouldBeProcessed) this.ProcessText(false, true);
        return this.mProcessedText;
    },
    Load: function(json) {
		NGUI.UIWidget.prototype.Load.call(this, json);
        this.bitmapFont = UnityEngine.Resources.Load(json.ft, 'UIFont');
        this.fontSize = json.fs || 20;
        this.value = json.tx || "";
        this.overflowMethod = json.of || LabelOverflow.ShrinkContent;
        this.alignment = json.al || TextAlignment.Automatic;
        this.effectStyle = json.es || LabelEffect.None;
        this.spacingX = json.sx || 0;
        this.spacingY = json.sy || 0;
        this.maxLineCount = json.ml || 0;
        this.supportEncoding = json.se || false;
        this.symbolStyle = json.ss || SymbolStyle.Normal;
        this.fontStyle = json.st || FontStyle.Normal;
        if (json.gt) this.gradientTop.set32(json.gt.r || 255, json.gt.g || 255, json.gt.b || 255, json.gt.a || 255);
        if (json.gb) this.gradientBottom.set32(json.gb.r || 255, json.gb.g || 255, json.gb.b || 255, json.gb.a || 255);
        if (json.ec) this.effectColor.set32(json.ec.r || 0, json.ec.g || 0, json.ec.b || 0, json.ec.a || 255);
        if (json.ed) this.effectDistance.set(json.ed.x || 1, json.ed.y || 1);
    },
    UpdateNGUIText: function() {
		NGUIText.fontSize = this.mPrintedSize;
		NGUIText.fontStyle = this.fontSize;
		NGUIText.rectWidth = this.mWidth;
		NGUIText.rectHeight = this.mHeight;
		NGUIText.regionWidth = Mathf.RoundToInt(this.mWidth * (this.mDrawRegion.z - this.mDrawRegion.x));
		NGUIText.regionHeight = Mathf.RoundToInt(this.mHeight * (this.mDrawRegion.w - this.mDrawRegion.y));
		NGUIText.gradient = this.applyGradient;
		NGUIText.gradientTop = this.gradientTop;
		NGUIText.gradientBottom = this.gradientBottom;
		NGUIText.encoding = this.supportEncoding;
		NGUIText.premultiply = this.mPremultiply;
		NGUIText.symbolStyle = this.symbolStyle;
		NGUIText.maxLines = this.maxLineCount;
		NGUIText.spacingX = this.spacingX;
		NGUIText.spacingY = this.spacingY;
		NGUIText.fontScale = (this.mPrintedSize / this.defaultFontSize()) * this.mScale;
        NGUIText.bitmapFont = this.bitmapFont;
		if (this.alignment === TextAlignment.Automatic) {
			var p = this.mPivot;
			if (p === WidgetPivot.Left || p === WidgetPivot.TopLeft || p === WidgetPivot.BottomLeft)
				NGUIText.alignment = TextAlignment.Left;
			else if (p === WidgetPivot.Right || p === WidgetPivot.TopRight || p === WidgetPivot.BottomRight)
				NGUIText.alignment = TextAlignment.Right;
			else 
                NGUIText.alignment = TextAlignment.Center;
		} else {
            NGUIText.alignment = this.alignment;
        }
		NGUIText.Update();
    },
    ProcessText: function(legacyMode, full) {
		this.mChanged = true;
		this.mShouldBeProcessed = false;
		var regionX = this.mDrawRegion.z - this.mDrawRegion.x;
		var regionY = this.mDrawRegion.w - this.mDrawRegion.y;
		NGUIText.rectWidth    = legacyMode ? (this.mMaxLineWidth  !== 0 ? this.mMaxLineWidth  : 1000000) : this.mWidth;
		NGUIText.rectHeight   = legacyMode ? (this.mMaxLineHeight !== 0 ? this.mMaxLineHeight : 1000000) : this.mHeight;
		NGUIText.regionWidth  = (regionX !== 1) ? Mathf.RoundToInt(NGUIText.rectWidth  * regionX) : NGUIText.rectWidth;
		NGUIText.regionHeight = (regionY !== 1) ? Mathf.RoundToInt(NGUIText.rectHeight * regionY) : NGUIText.rectHeight;
		this.mPrintedSize = Math.abs(legacyMode ? Mathf.RoundToInt(this.transform.localScale.x) : this.defaultFontSize());
		this.mScale = 1;
		if (NGUIText.regionWidth < 1 || NGUIText.regionHeight < 0) {
			this.mProcessedText = "";
			return;
		}
		if (full === true) this.UpdateNGUIText();
		if (this.overflowMethod === LabelOverflow.ResizeFreely || this.overflowMethod === LabelOverflow.ResizeHeight) {
			NGUIText.rectHeight = 1000000;
			NGUIText.regionHeight = 1000000;
		}
		if (this.mPrintedSize > 0) {
			var result = { text: "" };
			for (var ps = this.mPrintedSize; ps > 0; --ps) {
                this.mScale = ps / this.mPrintedSize;
                NGUIText.fontScale = (this.fontSize / this.bitmapFont.defaultSize()) * this.mScale;
				NGUIText.Update(false);
				var fits = NGUIText.WrapText(this.value, true, result);
                this.mProcessedText = result.text.replace("\\n", "\n");
				if (this.overflowMethod == LabelOverflow.ShrinkContent && fits !== true) {
					if (--ps > 1) continue;
					else break;
				} else if (this.overflowMethod == LabelOverflow.ResizeFreely) {
					this.mCalculatedSize = NGUIText.CalculatePrintedSize(this.mProcessedText);
					this.mWidth = Math.max(this.minWidth, Mathf.RoundToInt(this.mCalculatedSize.x));
					if (regionX != 1) this.mWidth = Mathf.RoundToInt(this.mWidth / regionX);
					this.mHeight = Math.max(this.minHeight, Mathf.RoundToInt(this.mCalculatedSize.y));
					if (regionY != 1) this.mHeight = Mathf.RoundToInt(this.mHeight / regionY);
					if ((this.mWidth & 1) == 1) ++this.mWidth;
					if ((this.mHeight & 1) == 1) ++this.mHeight;
				} else if (this.overflowMethod == LabelOverflow.ResizeHeight) {
					this.mCalculatedSize = NGUIText.CalculatePrintedSize(this.mProcessedText);
					this.mHeight = Math.max(this.minHeight, Mathf.RoundToInt(this.mCalculatedSize.y));
					if (regionY != 1) this.mHeight = Mathf.RoundToInt(this.mHeight / regionY);
					if ((this.mHeight & 1) == 1) ++this.mHeight;
				} else {
					this.mCalculatedSize = NGUIText.CalculatePrintedSize(this.mProcessedText);
				}
				if (legacyMode)	{
					this.width = Mathf.RoundToInt(this.mCalculatedSize.x);
					this.height = Mathf.RoundToInt(this.mCalculatedSize.y);
					this.transform.localScale.set(1, 1, 1);
				}
				break;
			}
		} else {
			this.transform.localScale.set(1, 1, 1);
			this.mProcessedText = "";
			this.mScale = 1;
		}
		if (full) NGUIText.bitmapFont = undefined;
    },
	ApplyOffset: function(verts, start) {
		var po = this.pivotOffset();
		var fx = Mathf.Lerp(0, -this.mWidth, po.x);
		var fy = Mathf.Lerp(this.mHeight, 0, po.y) + Mathf.Lerp((this.mCalculatedSize.y - this.mHeight), 0, po.y);
		fx = Mathf.RoundToInt(fx);
		fy = Mathf.RoundToInt(fy);
		for (var i = start; i < verts.length; ++i) {
			verts[i].x += fx;
			verts[i].y += fy;
		}
		return new UnityEngine.Vector2(fx, fy);
	},
    ApplyShadow: function(verts, uvs, cols, start, end, x, y) {
		var col = this.effectColor.get32();
		col.a *= this.finalAlpha;
		for (var i = start; i < end; ++i) {
			var v = verts[i].clone();
			var uc = cols[i].clone();
			verts.push(v.clone());
			uvs.push(uvs[i]);
			cols.push(uc.clone());
			v.x += x;
			v.y += y;
			if (uc.a === 255) {
				uc.set(col.r, col.g, col.b, col.a);
			} else {
				uc.set(col.r, col.g, col.b, uc.a / 255 * col.a);
			}
			verts[i] = v;
			cols[i] = uc;
		}
    },
	OnFill: function(verts, uvs, cols) {
        if (this.bitmapFont === undefined) return;
        var offset = verts.length;
		var col = this.mColor;
		col.a = this.finalAlpha;
		var text = this.processedText();
		var start = verts.length;
		this.UpdateNGUIText();
		NGUIText.tint = col;
		NGUIText.Print(text, verts, uvs, cols);
		NGUIText.bitmapFont = null;
		var pos = this.ApplyOffset(verts, start);
		if (this.effectStyle !== LabelEffect.None) {
			var end = verts.length;
			pos.x = this.effectDistance.x;
			pos.y = this.effectDistance.y;
			this.ApplyShadow(verts, uvs, cols, offset, end, pos.x, -pos.y);
			if (this.effectStyle == LabelEffect.Outline) {
				offset = end;
				end = verts.length;
				this.ApplyShadow(verts, uvs, cols, offset, end, -pos.x, pos.y);
				offset = end;
				end = verts.length;
				this.ApplyShadow(verts, uvs, cols, offset, end, pos.x, pos.y);
				offset = end;
				end = verts.length;
				this.ApplyShadow(verts, uvs, cols, offset, end, -pos.x, -pos.y);
			}
		}
    },
});