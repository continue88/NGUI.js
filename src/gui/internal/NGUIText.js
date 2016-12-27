
const CHAR_SPACE = ' '.charCodeAt(0);
const CHAR_SPACE2 = '\u2009'.charCodeAt(0);
const CHAR_0 = '0'.charCodeAt(0);
const CHAR_1 = '1'.charCodeAt(0);
const CHAR_2 = '2'.charCodeAt(0);
const CHAR_3 = '3'.charCodeAt(0);
const CHAR_4 = '4'.charCodeAt(0);
const CHAR_5 = '5'.charCodeAt(0);
const CHAR_6 = '6'.charCodeAt(0);
const CHAR_7 = '7'.charCodeAt(0);
const CHAR_8 = '8'.charCodeAt(0);
const CHAR_9 = '9'.charCodeAt(0);
const CHAR_a = 'a'.charCodeAt(0);
const CHAR_A = 'A'.charCodeAt(0);
const CHAR_b = 'b'.charCodeAt(0);
const CHAR_B = 'B'.charCodeAt(0);
const CHAR_c = 'c'.charCodeAt(0);
const CHAR_C = 'C'.charCodeAt(0);
const CHAR_d = 'd'.charCodeAt(0);
const CHAR_D = 'D'.charCodeAt(0);
const CHAR_e = 'e'.charCodeAt(0);
const CHAR_E = 'E'.charCodeAt(0);
const CHAR_f = 'f'.charCodeAt(0);
const CHAR_F = 'F'.charCodeAt(0);
const CHAR_LEFT = '['.charCodeAt(0);
const CHAR_RIGHT = ']'.charCodeAt(0);
const CHAR_SUB = '-'.charCodeAt(0);
const CHAR_UND = '_'.charCodeAt(0);
const CHAR_RET = '\n'.charCodeAt(0);

NGUIText = {
    glyph: {
        v0: new UnityEngine.Vector2(0, 0),
        v1: new UnityEngine.Vector2(0, 0),
        u0: new UnityEngine.Vector2(0, 0),
        u1: new UnityEngine.Vector2(0, 0),
        advance: 0,
        channel: 0,
        rotatedUVs: false,
    },
    maxLines: 0,
    pixelDensity: 1,
    mColors: [],
	sizeShrinkage: 0.75,
	mBoldOffset: [-0.25, 0, 0.25, 0, 0, -0.25, 0, 0.25],
	IsSpace: function(ch) { return (ch === CHAR_SPACE || ch === 0x200a || ch === 0x200b || ch === CHAR_SPACE2); },
	IsHex: function(ch) { return (ch >= CHAR_0 && ch <= CHAR_9) || (ch >= CHAR_a && ch <= CHAR_f) || (ch >= CHAR_A && ch <= CHAR_F); },
    ReplaceSpaceWithNewline: function(s) {
		var i = s.length - 1;
		if (i > 0 && this.IsSpace(s.charCodeAt(i))) s.splice(i, 1, '\n');
	},
    EndLine: function(s) {
		var i = s.Length - 1;
		if (i > 0 && this.IsSpace(s.charCodeAt(i))) s.splice(i, 1, '\n');
		else s.Append('\n');
	},
    Update: function(request) {
        this.finalSize = Mathf.RoundToInt(this.fontSize / this.pixelDensity);
        this.finalSpacingX = this.spacingX * this.fontScale;
        this.finalLineHeight = (this.fontSize + this.spacingY) * this.fontScale;
        this.useSymbols = (this.bitmapFont !== undefined && this.bitmapFont.hasSymbols()) && this.encoding && this.symbolStyle != SymbolStyle.None;
    },
	EncodeColor24: function(c) {
		var i = 0xFFFFFF & (NGUIMath.ColorToInt(c) >> 8);
		return NGUIMath.DecimalToHex24(i);
	},
	ParseColor24: function(text, offset) {
		var r = (NGUIMath.HexToDecimal(text.charCodeAt(offset))     << 4) | NGUIMath.HexToDecimal(text.charCodeAt(offset + 1));
		var g = (NGUIMath.HexToDecimal(text.charCodeAt(offset + 2)) << 4) | NGUIMath.HexToDecimal(text.charCodeAt(offset + 3));
		var b = (NGUIMath.HexToDecimal(text.charCodeAt(offset + 4)) << 4) | NGUIMath.HexToDecimal(text.charCodeAt(offset + 5));
		var f = 1 / 255;
		return new UnityEngine.Color(f * r, f * g, f * b);
	},
	ParseColor32: function(text, offset) {
		var r = (NGUIMath.HexToDecimal(text.charCodeAt(offset)) << 4) | NGUIMath.HexToDecimal(text.charCodeAt(offset + 1));
		var g = (NGUIMath.HexToDecimal(text.charCodeAt(offset + 2)) << 4) | NGUIMath.HexToDecimal(text.charCodeAt(offset + 3));
		var b = (NGUIMath.HexToDecimal(text.charCodeAt(offset + 4)) << 4) | NGUIMath.HexToDecimal(text.charCodeAt(offset + 5));
		var a = (NGUIMath.HexToDecimal(text.charCodeAt(offset + 6)) << 4) | NGUIMath.HexToDecimal(text.charCodeAt(offset + 7));
		var f = 1 / 255;
		return new UnityEngine.Color(f * r, f * g, f * b, f * a);
	},
    ParseSymbol: function(text, index, colors, premultiply, ret) {
		var length = text.length;
        ret.index = index;
		if (index + 3 > length || text.charCodeAt(index) !== CHAR_LEFT) return false;
		if (text.charCodeAt(ret.index + 2) === CHAR_RIGHT) {
			if (text.charCodeAt(ret.index + 1) === CHAR_SUB) {
				if (colors !== undefined && colors.length > 1) colors.pop();
				ret.index += 3;
                return true;
			}
			var sub3 = text.substr(ret.index, 3);
			switch (sub3) {
            case "[b]":
                ret.bold = true;
                ret.index += 3;
                return true;
            case "[i]":
				ret.italic = true;
				ret.index += 3;
                return true;
            case "[u]":
				ret.underline = true;
				ret.index += 3;
                return true;
			case "[s]":
				ret.strike = true;
				ret.index += 3;
                return true;
			case "[c]":
				ret.ignoreColor = true;
				ret.index += 3;
                return true;
			}
		}

		if (ret.index + 4 > length) return false;
		if (text.charCodeAt(ret.index + 3) === CHAR_RIGHT) {
			var sub4 = text.substr(index, 4);
			switch (sub4) {
			case "[/b]":
				ret.bold = false;
				ret.index += 4;
                return true;
            case "[/i]":
				ret.italic = false;
				ret.index += 4;
                return true;
            case "[/u]":
				ret.underline = false;
				ret.index += 4;
                return true;
            case "[/s]":
				ret.strike = false;
				ret.index += 4;
                return true;
            case "[/c]":
				ret.ignoreColor = false;
				ret.index += 4;
                return true;
            default: {
				var ch0 = text.charCodeAt(ret.index + 1);
				var ch1 = text.charCodeAt(ret.index + 2);
					if (this.IsHex(ch0) && this.IsHex(ch1)) {
						var a = (NGUIMath.HexToDecimal(ch0) << 4) | NGUIMath.HexToDecimal(ch1);
						this.mAlpha = a / 255;
						ret.index += 4;
                        return true;
					}
				}
				break;
			}
		}
		if (ret.index + 5 > length) return false;
		if (text.charCodeAt(ret.index + 4) === CHAR_RIGHT) {
			var sub5 = text.substr(ret.index, 5);
			switch (sub5) {
			case "[sub]":
				ret.sub = 1;
				ret.index += 5;
                return true;
			case "[sup]":
				ret.sub = 2;
				ret.index += 5;
                return true;
			}
		}
		if (ret.index + 6 > length) return false;
		if (text.charCodeAt(ret.index + 5) === CHAR_RIGHT) {
			var sub6 = text.substr(index, 6);
			switch (sub6) {
			case "[/sub]":
				ret.sub = 0;
				ret.index += 6;
                return true;
			case "[/sup]":
				ret.sub = 0;
				ret.index += 6;
                return true;
			case "[/url]":
				ret.index += 6;
                return true;
			}
		}

		if (text.substr(ret.index + 1, 4) === 'url=') {
			var closingBracket = text.indexOf(']', ret.index + 4);
			if (closingBracket != -1) {
				ret.index = closingBracket + 1;
                return true;
			} else {
				ret.index = text.Length;
                return true;
			}
		}

		if (ret.index + 8 > length) return false;
		if (text.charCodeAt(ret.index + 7) === CHAR_RIGHT) {
			var c = this.ParseColor24(text, ret.index + 1);
			if (this.EncodeColor24(c) != text.substr(ret.index + 1, 6).toUpperCase())
				return false;
			if (colors != null) {
				c.a = colors[colors.length - 1].a;
				if (premultiply && c.a != 1)
					c = UnityEngine.Color.Lerp(mInvisible, c, c.a);
				colors.push(c);
			}
			ret.index += 8;
			return true;
		}
		if (ret.index + 10 > length) return false;
		if (text.charCodeAt(ret.index + 9) === CHAR_RIGHT) {
			var c = this.ParseColor32(text, ret.index + 1);
			if (this.EncodeColor32(c) != text.substr(ret.index + 1, 8).toUpperCase())
				return false;
			if (colors !== undefined) {
				if (premultiply && c.a != 1)
					c = UnityEngine.Color.Lerp(this.mInvisible, c, c.a);
				colors.push(c);
			}
			ret.index += 10;
			return true;
		}
		return false;
    },
    StripSymbols: function(text) {
		if (text === undefined) text;
        var ret = {};
        for (var i = 0, imax = text.length; i < imax; ) {
            if (text.charCodeAt(i) === CHAR_LEFT && this.ParseSymbol(text, i, undefined, false, ret)) {
                text = text.substr(0, i) + text.substr(i + ret.index - i);//.Remove(i, ret.index - i);
                imax = text.length;
                continue;
            }
            ++i;
        }
		return text;
    },
    Prepare: function(text) {
    },
    GetSymbol: function(text, index, textLength) {
		var uiFont = this.bitmapFont;
        if (uiFont.mSymbols.length === 0) return;
		textLength -= index;
		for (var i in uiFont.mSymbols) {
			var sym = uiFont.mSymbols[i];
			var symbolLength = sym.length;
			if (symbolLength === 0 || textLength < symbolLength) continue;
			var match = true;
			for (var c = 0; c < symbolLength; ++c) {
				if (text.charCodeAt(index + c) != sym.sequence.charCodeAt(c)) {
					match = false;
					break;
				}
			}
			if (match && sym.Validate(uiFont.atlas)) 
                return sym;
		}
    },
    GetGlyph: function(ch, prev) {
        var thinSpace = false;
        if (ch === CHAR_SPACE2) {
            thinSpace = true;
            ch = CHAR_SPACE;
        }
        var bmg = this.bitmapFont.bmFont.GetGlyph(ch);
        if (bmg !== undefined) {
            var kern = (prev !== 0) ? bmg.GetKerning(prev) : 0;
            this.glyph.v0.x = (prev !== 0) ? bmg.offsetX + kern : bmg.offsetX;
            this.glyph.v1.y = -bmg.offsetY;

            this.glyph.v1.x = this.glyph.v0.x + bmg.width;
            this.glyph.v0.y = this.glyph.v1.y - bmg.height;

            this.glyph.u0.x = bmg.x;
            this.glyph.u0.y = bmg.y + bmg.height;

            this.glyph.u1.x = bmg.x + bmg.width;
            this.glyph.u1.y = bmg.y;

            var adv = bmg.advance;
            if (thinSpace) adv >>= 1;
            this.glyph.advance = adv + kern;
            this.glyph.channel = bmg.channel;
            this.glyph.rotatedUVs = false;
            if (this.fontScale !== 1) {
                this.glyph.v0.multiplyScalar(this.fontScale);
                this.glyph.v1.multiplyScalar(this.fontScale);
                this.glyph.advance *= this.fontScale;
            }
            return this.glyph;
        }
    },
    GetGlyphWidth: function(ch, prev) {
		if (this.bitmapFont === undefined) return 0;
        var thinSpace = false;
        if (ch === CHAR_SPACE2) {
            thinSpace = true;
            ch = CHAR_SPACE;
        }
        var bmg = this.bitmapFont.mFont.GetGlyph(ch);
        if (bmg === undefined) return 0;
        var adv = bmg.advance;
        if (thinSpace) adv >>= 1;
        return this.fontScale * ((prev != 0) ? adv + bmg.GetKerning(prev) : bmg.advance);
    },
    CalculatePrintedSize: function(text) {
		var v = new UnityEngine.Vector2(0, 0);
		if (text !== "") {
			if (this.encoding) text = this.StripSymbols(text);
			this.Prepare(text);
			var x = 0, y = 0, maxX = 0;
			var textLength = text.length, ch = 0, prev = 0;
			for (var i = 0; i < textLength; ++i) {
				ch = text.charCodeAt(i);
				if (ch === CHAR_RET) {
					if (x > maxX) maxX = x;
					x = 0;
					y += this.finalLineHeight;
					continue;
				}
				if (ch < CHAR_SPACE) continue;
				var symbol = this.useSymbols ? this.GetSymbol(text, i, textLength) : undefined;
				if (symbol === undefined) {
					var w = this.GetGlyphWidth(ch, prev);
					if (w !== 0) {
						w += this.finalSpacingX;
						if (Mathf.RoundToInt(x + w) > this.regionWidth) {
							if (x > maxX) maxX = x - this.finalSpacingX;
							x = w;
							y += this.finalLineHeight;
						}
						else x += w;
						prev = ch;
					}
				} else {
					var w = this.finalSpacingX + symbol.advance * this.fontScale;
					if (Mathf.RoundToInt(x + w) > this.regionWidth) {
						if (x > maxX) maxX = x - this.finalSpacingX;
						x = w;
						y += this.finalLineHeight;
					}
					else x += w;
					i += symbol.sequence.length - 1;
					prev = 0;
				}
			}
			v.x = ((x > maxX) ? x - this.finalSpacingX : maxX);
			v.y = (y + this.finalLineHeight);
		}
		return v;
    },
    Align: function(verts, indexOffset, printedWidth) {
		switch (this.alignment) {
        case TextAlignment.Right: {
            var padding = this.rectWidth - printedWidth;
            if (padding < 0) return;
            for (var i = indexOffset; i < verts.length; ++i)
                verts[i].x += padding;
            break;
        }
        case TextAlignment.Center: {
            var padding = (this.rectWidth - printedWidth) * 0.5;
            if (padding < 0) return;
            var diff = Mathf.RoundToInt(this.rectWidth - printedWidth);
            var intWidth = Mathf.RoundToInt(this.rectWidth);
            var oddDiff = (diff & 1) === 1;
            var oddWidth = (intWidth & 1) === 1;
            if ((oddDiff && !oddWidth) || (!oddDiff && oddWidth))
                padding += 0.5 * this.fontScale;
            for (var i = indexOffset; i < verts.length; ++i)
                verts[i].x += padding;
            break;
        }
        case TextAlignment.Justified: {
            if (printedWidth < this.rectWidth * 0.65) return;
            var padding = (this.rectWidth - printedWidth) * 0.5;
            if (padding < 1) return;
            var chars = (verts.length - indexOffset) / 4;
            if (chars < 1) return;
            var progressPerChar = 1 / (chars - 1);
            var scale = this.rectWidth / printedWidth;
            for (var i = indexOffset + 4, charIndex = 1; i < verts.length; ++charIndex) {
                var x0 = verts[i].x;
                var x1 = verts[i + 2].x;
                var w = x1 - x0;
                var x0a = x0 * scale;
                var x1a = x0a + w;
                var x1b = x1 * scale;
                var x0b = x1b - w;
                var progress = charIndex * progressPerChar;
                x0 = Mathf.Lerp(x0a, x0b, progress);
                x1 = Mathf.Lerp(x1a, x1b, progress);
                x0 = Mathf.Round(x0);
                x1 = Mathf.Round(x1);
                verts[i++].x = x0;
                verts[i++].x = x0;
                verts[i++].x = x1;
                verts[i++].x = x1;
            }
            break;
        }}
    },
    Print: function(text, verts, uvs, cols) {
		var indexOffset = verts.length;
		this.Prepare(text);
		this.mColors.push(new UnityEngine.Color(1, 1, 1, 1));
		this.mAlpha = 1;

		var ch = 0, prev = 0;
		var x = 0, y = 0, maxX = 0;
		var sizeF = this.finalSize;

		var gb = this.tint.clone().mul(this.gradientBottom).get32();
		var gt = this.tint.clone().mul(this.gradientTop).get32();
		var uc = this.tint.clone().get32();
		var textLength = text.length;

		var uvRect = new UnityEngine.Rect(0, 0, 1, 1);
		var invX = 0, invY = 0;
		var sizePD = sizeF * this.pixelDensity;

		var subscript = false;
        var textProp = {
			subscriptMode: 0,
			bold: false,
			italic: false,
			underline: false,
			strikethrough: false,
			ignoreColor: false,
		};
        var sizeShrinkage = 0.75;

		var v0x, v1x, v1y, v0y, prevX = 0;
		if (this.bitmapFont !== undefined) {
			uvRect = this.bitmapFont.uvRect;
			invX = uvRect.width / this.bitmapFont.texWidth;
			invY = uvRect.height / this.bitmapFont.texHeight;
		}

		for (var i = 0; i < textLength; ++i) {
			ch = text.charCodeAt(i);
			prevX = x;
			if (ch === CHAR_RET) {
				if (x > maxX) maxX = x;
				if (this.alignment != TextAlignment.Left) {
					this.Align(verts, indexOffset, x - this.finalSpacingX);
					indexOffset = verts.length;
				}
				x = 0;
				y += this.finalLineHeight;
				prev = 0;
				continue;
			}
			if (ch < CHAR_SPACE) {
				prev = ch;
				continue;
			}

			if (this.encoding && this.ParseSymbol(text, i, this.mColors, this.premultiply, textProp)) {
				var fc;
				if (textProp.ignoreColor === true) {
					fc = this.mColors[this.mColors.length - 1].clone();
					fc.a *= this.mAlpha * this.tint.a;
				} else {
					fc = this.tint.clone().mul(this.mColors[this.mColors.length - 1]);
					fc.a *= this.mAlpha;
				}
				uc = fc.get32();
				for (var b = 0, bmax = this.mColors.length - 2; b < bmax; ++b)
					fc.a *= this.mColors[b].a;
				if (this.gradient === true) {
					gb = this.gradientBottom.clone().mul(fc).get32();
					gt = this.gradientTop.clone().mul(fc).get32();
				}
				i = textProp.index - 1;
				continue;
			}
			var symbol = this.useSymbols ? this.GetSymbol(text, i, textLength) : undefined;
			if (symbol !== undefined) {
				v0x = x + symbol.offsetX * this.fontScale;
				v1x = v0x + symbol.width * this.fontScale;
				v1y = -(y + symbol.offsetY * this.fontScale);
				v0y = v1y - symbol.height * this.fontScale;
				if (Mathf.RoundToInt(x + symbol.advance * this.fontScale) > this.regionWidth) {
					if (x === 0) return;
					if (this.alignment != TextAlignment.Left && indexOffset < verts.length) {
						this.Align(verts, indexOffset, x - this.finalSpacingX);
						indexOffset = verts.length;
					}
					v0x -= x;
					v1x -= x;
					v0y -= this.finalLineHeight;
					v1y -= this.finalLineHeight;
					x = 0;
					y += this.finalLineHeight;
					prevX = 0;
				}
				verts.push(new UnityEngine.Vector3(v0x, v0y));
				verts.push(new UnityEngine.Vector3(v0x, v1y));
				verts.push(new UnityEngine.Vector3(v1x, v1y));
				verts.push(new UnityEngine.Vector3(v1x, v0y));
				x += this.finalSpacingX + symbol.advance * this.fontScale;
				i += symbol.length - 1;
				prev = 0;
				if (uvs !== undefined) {
					var uv = symbol.uvRect;
					var u0x = uv.xMin;
					var u0y = uv.yMin;
					var u1x = uv.xMax;
					var u1y = uv.yMax;
					uvs.push(new UnityEngine.Vector2(u0x, u0y));
					uvs.push(new UnityEngine.Vector2(u0x, u1y));
					uvs.push(new UnityEngine.Vector2(u1x, u1y));
					uvs.push(new UnityEngine.Vector2(u1x, u0y));
				}
				if (cols !== undefined) {
					if (this.symbolStyle === SymbolStyle.Colored) {
						for (var b = 0; b < 4; ++b) cols.push(uc);
					} else {
						var col = new UnityEngine.Color32(255, 255, 255, 255);
						col.a = uc.a;
						for (var b = 0; b < 4; ++b) cols.push(col);
					}
				}
			} else {
				var glyph = this.GetGlyph(ch, prev);
				if (glyph === undefined) continue;
				prev = ch;
				if (textProp.subscriptMode !== 0) {
					glyph.v0.x *= this.sizeShrinkage;
					glyph.v0.y *= this.sizeShrinkage;
					glyph.v1.x *= this.sizeShrinkage;
					glyph.v1.y *= this.sizeShrinkage;

					if (textProp.subscriptMode === 1) {
						glyph.v0.y -= this.fontScale * this.fontSize * 0.4;
						glyph.v1.y -= this.fontScale * this.fontSize * 0.4;
					} else {
						glyph.v0.y += this.fontScale * this.fontSize * 0.05;
						glyph.v1.y += this.fontScale * this.fontSize * 0.05;
					}
				}
				v0x = glyph.v0.x + x;
				v0y = glyph.v0.y - y;
				v1x = glyph.v1.x + x;
				v1y = glyph.v1.y - y;
				var w = glyph.advance;
				if (this.finalSpacingX < 0) w += this.finalSpacingX;
				if (Mathf.RoundToInt(x + w) > this.regionWidth) {
					if (x === 0) return;
					if (this.alignment !== TextAlignment.Left && indexOffset < verts.length) {
						this.Align(verts, indexOffset, x - this.finalSpacingX);
						indexOffset = verts.length;
					}
					v0x -= x;
					v1x -= x;
					v0y -= this.finalLineHeight;
					v1y -= this.finalLineHeight;
					x = 0;
					y += this.finalLineHeight;
					prevX = 0;
				}
				if (this.IsSpace(ch)) {
					if (textProp.underline === true)
						ch = CHAR_UND;
					else if (textProp.strikethrough === true)
						ch = CHAR_SUB;
				}
				x += (textProp.subscriptMode === 0) ? this.finalSpacingX + glyph.advance :
					(this.finalSpacingX + glyph.advance) * this.sizeShrinkage;
				if (this.IsSpace(ch)) continue;
				if (uvs !== undefined) {
					if (this.bitmapFont !== undefined) {
						glyph.u0.x = uvRect.xMin + invX * glyph.u0.x;
						glyph.u1.x = uvRect.xMin + invX * glyph.u1.x;
						glyph.u0.y = uvRect.yMax - invY * glyph.u0.y;
						glyph.u1.y = uvRect.yMax - invY * glyph.u1.y;
					}
					for (var j = 0, jmax = (textProp.bold === true ? 4 : 1); j < jmax; ++j) {
						if (glyph.rotatedUVs) {
							uvs.push(glyph.u0.clone());
							uvs.push(new UnityEngine.Vector2(glyph.u1.x, glyph.u0.y));
							uvs.push(glyph.u1.clone());
							uvs.push(new UnityEngine.Vector2(glyph.u0.x, glyph.u1.y));
						} else {
							uvs.push(glyph.u0.clone());
							uvs.push(new UnityEngine.Vector2(glyph.u0.x, glyph.u1.y));
							uvs.push(glyph.u1.clone());
							uvs.push(new UnityEngine.Vector2(glyph.u1.x, glyph.u0.y));
						}
					}
				}
				if (cols != null) {
					if (glyph.channel === 0 || glyph.channel === 15) {
						if (textProp.gradient === true) {
							var min = sizePD + glyph.v0.y / fontScale;
							var max = sizePD + glyph.v1.y / fontScale;
							min /= sizePD;
							max /= sizePD;
							s_c0 = Color.Lerp(gb, gt, min);
							s_c1 = Color.Lerp(gb, gt, max);
							for (var j = 0, jmax = (textProp.bold === true ? 4 : 1); j < jmax; ++j) {
								cols.push(s_c0);
								cols.push(s_c1);
								cols.push(s_c1);
								cols.push(s_c0);
							}
						} else {
							for (var j = 0, jmax = (textProp.bold === true ? 16 : 4); j < jmax; ++j)
								cols.push(uc);
						}
					} else {
						var col = uc.clone();
						col.mul(0.49);
						switch (glyph.channel) {
							case 1: col.b += 0.51; break;
							case 2: col.g += 0.51; break;
							case 4: col.r += 0.51; break;
							case 8: col.a += 0.51; break;
						}
						for (var j = 0, jmax = (textProp.bold === true ? 16 : 4); j < jmax; ++j)
							cols.push(col);
					}
				}
				if (textProp.bold !== true) {
					if (textProp.italic !== true) {
						verts.push(new UnityEngine.Vector3(v0x, v0y));
						verts.push(new UnityEngine.Vector3(v0x, v1y));
						verts.push(new UnityEngine.Vector3(v1x, v1y));
						verts.push(new UnityEngine.Vector3(v1x, v0y));
					} else {
						var slant = this.fontSize * 0.1 * ((v1y - v0y) / this.fontSize);
						verts.push(new UnityEngine.Vector3(v0x - slant, v0y));
						verts.push(new UnityEngine.Vector3(v0x + slant, v1y));
						verts.push(new UnityEngine.Vector3(v1x + slant, v1y));
						verts.push(new UnityEngine.Vector3(v1x - slant, v0y));
					}
				} else {
					for (var j = 0; j < 4; ++j) {
						var a = this.mBoldOffset[j * 2];
						var b = this.mBoldOffset[j * 2 + 1];
						var slant = (textProp.italic ? this.fontSize * 0.1 * ((v1y - v0y) / this.fontSize) : 0);
						verts.push(new UnityEngine.Vector3(v0x + a - slant, v0y + b));
						verts.push(new UnityEngine.Vector3(v0x + a + slant, v1y + b));
						verts.push(new UnityEngine.Vector3(v1x + a + slant, v1y + b));
						verts.push(new UnityEngine.Vector3(v1x + a - slant, v0y + b));
					}
				}

				// Underline and strike-through contributed by Rudy Pangestu.
				if (textProp.underline === true || textProp.strikethrough === true) {
					var dash = this.GetGlyph(textProp.strikethrough ? CHAR_SUB : CHAR_UND, prev);
					if (dash === undefined) continue;
					if (uvs !== undefined) {
						if (this.bitmapFont !== undefined) {
							dash.u0.x = uvRect.xMin + invX * dash.u0.x;
							dash.u1.x = uvRect.xMin + invX * dash.u1.x;
							dash.u0.y = uvRect.yMax - invY * dash.u0.y;
							dash.u1.y = uvRect.yMax - invY * dash.u1.y;
						}
						var cx = (dash.u0.x + dash.u1.x) * 0.5;
						for (var j = 0, jmax = (textProp.bold === true ? 4 : 1); j < jmax; ++j) {
							uvs.push(new UnityEngine.Vector2(cx, dash.u0.y));
							uvs.push(new UnityEngine.Vector2(cx, dash.u1.y));
							uvs.push(new UnityEngine.Vector2(cx, dash.u1.y));
							uvs.push(new UnityEngine.Vector2(cx, dash.u0.y));
						}
					}
					if (subscript === true && textProp.strikethrough === true) {
						v0y = (-y + dash.v0.y) * sizeShrinkage;
						v1y = (-y + dash.v1.y) * sizeShrinkage;
					} else {
						v0y = (-y + dash.v0.y);
						v1y = (-y + dash.v1.y);
					}
					if (textProp.bold === true) {
						for (var j = 0; j < 4; ++j) {
							var a = this.mBoldOffset[j * 2];
							var b = this.mBoldOffset[j * 2 + 1];
							verts.push(new UnityEngine.Vector3(prevX + a, v0y + b));
							verts.push(new UnityEngine.Vector3(prevX + a, v1y + b));
							verts.push(new UnityEngine.Vector3(x + a, v1y + b));
							verts.push(new UnityEngine.Vector3(x + a, v0y + b));
						}
					} else {
						verts.push(new UnityEngine.Vector3(prevX, v0y));
						verts.push(new UnityEngine.Vector3(prevX, v1y));
						verts.push(new UnityEngine.Vector3(x, v1y));
						verts.push(new UnityEngine.Vector3(x, v0y));
					}

					if (textProp.gradient === true) {
						var min = sizePD + dash.v0.y / this.fontScale;
						var max = sizePD + dash.v1.y / this.fontScale;
						min /= sizePD;
						max /= sizePD;
						s_c0 = UnityEngine.Color.Lerp(gb, gt, min);
						s_c1 = UnityEngine.Color.Lerp(gb, gt, max);
						for (var j = 0, jmax = (textProp.bold === true ? 4 : 1); j < jmax; ++j) {
							cols.push(s_c0);
							cols.push(s_c1);
							cols.push(s_c1);
							cols.push(s_c0);
						}
					} else {
						for (var j = 0, jmax = (textProp.bold === true ? 16 : 4); j < jmax; ++j)
							cols.push(uc);
					}
				}
			}
		}

		if (this.alignment != TextAlignment.Left && indexOffset < verts.length) {
			this.Align(verts, indexOffset, x - this.finalSpacingX);
			indexOffset = verts.length;
		}
		this.mColors.length = 0;
    },
    WrapText: function(text, keepCharCount, ret) {
        var regionWidth = this.regionWidth;
        var regionHeight = this.regionHeight;
        var finalLineHeight = this.finalLineHeight;
		if (regionWidth < 1 || regionHeight < 1 || finalLineHeight < 1)
			return false;

        var maxLines = this.maxLines;
        var fontScale = this.fontScale;
        var finalSpacingX = this.finalSpacingX;
		var height = (maxLines > 0) ? Math.min(regionHeight, finalLineHeight * maxLines) : regionHeight;
		var maxLineCount = (maxLines > 0) ? maxLines : 1000000;
		maxLineCount = Mathf.FloorToInt(Math.min(maxLineCount, height / finalLineHeight) + 0.01);
		if (maxLineCount === 0)
            return false;

		if (text.length === 0) text = " ";
		this.Prepare(text);
		var sb = new StringBuilder();
		var textLength = text.length;
		var remainingWidth = regionWidth;
		var start = 0, offset = 0, lineCount = 1, prev = 0;
		var lineIsEmpty = true;
		var fits = true;
		var eastern = false;
		var textSymbols = {};
		for (; offset < textLength; ++offset) {
			var ch = text.charCodeAt(offset);
			if (ch > 12287) eastern = true;
			if (ch === CHAR_RET) {
				if (lineCount === maxLineCount) break;
				remainingWidth = regionWidth;

				// Add the previous word to the final string
				if (start < offset) sb.Append(text.substr(start, offset - start + 1));
				else sb.Append(ch);
				lineIsEmpty = true;
				++lineCount;
				start = offset + 1;
				prev = 0;
				continue;
			}
			if (this.encoding && this.ParseSymbol(text, offset, undefined, false, textSymbols)) {
				offset = textSymbols.index - 1;
				continue;
            }
			var symbol = this.useSymbols ? this.GetSymbol(text, offset, textLength) : undefined;
			var glyphWidth;
			if (symbol === undefined) {
				var w = this.GetGlyphWidth(ch, prev);
				if (w === 0) continue;
				glyphWidth = finalSpacingX + w;
			}
			else glyphWidth = finalSpacingX + symbol.advance * fontScale;
			remainingWidth -= glyphWidth;
			if (this.IsSpace(ch) && !eastern && start < offset) {
				var end = offset - start + 1;
				if (lineCount === maxLineCount && remainingWidth <= 0 && offset < textLength) {
					var cho = text.charCodeAt(offset);
					if (cho < CHAR_SPACE || this.IsSpace(cho)) --end;
				}
				sb.Append(text.substr(start, end));
				lineIsEmpty = false;
				start = offset + 1;
				prev = ch;
			}
			if (Mathf.RoundToInt(remainingWidth) < 0) {
				if (lineIsEmpty || lineCount === maxLineCount) {
					sb.Append(text.substr(start, Math.max(0, offset - start)));
					var space = this.IsSpace(ch);
					if (!space && !eastern) fits = false;
					if (lineCount++ === maxLineCount) {
						start = offset;
						break;
					}
					if (keepCharCount) this.ReplaceSpaceWithNewline(sb);
					else this.EndLine(sb);
					lineIsEmpty = true;
					if (space) {
						start = offset + 1;
						remainingWidth = regionWidth;
					} else {
						start = offset;
						remainingWidth = regionWidth - glyphWidth;
					}
					prev = 0;
				} else {
					lineIsEmpty = true;
					remainingWidth = regionWidth;
					offset = start - 1;
					prev = 0;
					if (lineCount++ === maxLineCount) break;
					if (keepCharCount) this.ReplaceSpaceWithNewline(sb);
					else this.EndLine(sb);
					continue;
				}
			}
			else prev = ch;

			// Advance the offset past the symbol
			if (symbol != undefined) {
				offset += symbol.length - 1;
				prev = 0;
			}
		}

		if (start < offset) sb.Append(text.substr(start, offset - start));
		ret.text = sb.ToString();
		return fits && ((offset === textLength) || (lineCount <= Math.min(maxLines, maxLineCount)));
    },
};
