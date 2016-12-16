
NGUI.UIBasicSprite = function(gameObject) {
	NGUI.UIWidget.call(this, gameObject);
	this.mFillAmount = 1.0;
	this.mInvert = false;
	this.mType = SpriteType.Simple;
	this.mFillDirection = FillDirection.Radial360;
	this.mFlip = Flip.Nothing;
	
	this.mOuterUV = new UnityEngine.Rect(0, 0, 1, 1);
	this.mInnerUV = new UnityEngine.Rect(0, 0, 1, 1);
};

SpriteType = {
	Simple: 0,
	Sliced: 1,
	Tiled: 2,
	Filled: 3,
	Advanced: 4,
};
FillDirection = {
	Horizontal: 0,
	Vertical: 1,
	Radial90: 2,
	Radial180: 3,
	Radial360: 4,
};
AdvancedType = {
	Invisible: 0,
	Sliced: 1,
	Tiled: 2,
};
Flip = {
	Nothing: 0,
	Horizontally: 1,
	Vertically: 2,
	Both: 3,
};

gTempPos = [new UnityEngine.Vector2(), new UnityEngine.Vector2(), new UnityEngine.Vector2(), new UnityEngine.Vector2()];
gTempUVs = [new UnityEngine.Vector2(), new UnityEngine.Vector2(), new UnityEngine.Vector2(), new UnityEngine.Vector2()];

Object.assign(NGUI.UIBasicSprite.prototype, NGUI.UIWidget.prototype, {
	constructor: NGUI.UIBasicSprite,
	pixelSize: function() { return 1; },
	texture: function() { return undefined; },
	drawingUVs: function() {
		switch (this.mFlip) {
			case Flip.Horizontally: return new UnityEngine.Vector4(this.mOuterUV.xMax, this.mOuterUV.yMin, this.mOuterUV.xMin, this.mOuterUV.yMax);
			case Flip.Vertically: return new UnityEngine.Vector4(this.mOuterUV.xMin, this.mOuterUV.yMax, this.mOuterUV.xMax, this.mOuterUV.yMin);
			case Flip.Both: return new UnityEngine.Vector4(this.mOuterUV.xMax, this.mOuterUV.yMax, this.mOuterUV.xMin, this.mOuterUV.yMin);
			default: return new UnityEngine.Vector4(this.mOuterUV.xMin, this.mOuterUV.yMin, this.mOuterUV.xMax, this.mOuterUV.yMax);
		}
	},
	drawingColor: function() { 
		return new UnityEngine.Color32(
			this.mColor.r * 255,
			this.mColor.g * 255,
			this.mColor.b * 255,
			this.finalAlpha * 255); 
	},
	Load: function(json) {
		NGUI.UIWidget.prototype.Load.call(this, json);
		this.mType = json.t | SpriteType.Simple;
		this.mFlip = json.f | Flip.Nothing;
		this.mFillAmount = json.fa | 1;
		this.mFillDirection = json.fd | FillDirection.Radial360;
		this.invert = json.fi | false;
	},
	Fill: function(verts, uvs, cols, outer, inner) {
		this.mOuterUV = outer;
		this.mInnerUV = inner;
		switch (this.mType) {
		case SpriteType.Simple:
			this.SimpleFill(verts, uvs, cols);
			break;
		case SpriteType.Sliced:
			this.SlicedFill(verts, uvs, cols);
			break;
		case SpriteType.Filled:
			this.FilledFill(verts, uvs, cols);
			break;
		case SpriteType.Tiled:
			this.TiledFill(verts, uvs, cols);
			break;
		case SpriteType.Advanced:
			this.AdvancedFill(verts, uvs, cols);
			break;
		}
	},
	SimpleFill: function(verts, uvs, cols) {
		var v = this.drawingDimensions();
		var u = this.drawingUVs();
		var c = this.drawingColor();
		verts.push(new UnityEngine.Vector3(v.x, v.y));
		verts.push(new UnityEngine.Vector3(v.x, v.w));
		verts.push(new UnityEngine.Vector3(v.z, v.w));
		verts.push(new UnityEngine.Vector3(v.z, v.y));
		uvs.push(new UnityEngine.Vector2(u.x, u.y));
		uvs.push(new UnityEngine.Vector2(u.x, u.w));
		uvs.push(new UnityEngine.Vector2(u.z, u.w));
		uvs.push(new UnityEngine.Vector2(u.z, u.y));
		cols.push(c);
		cols.push(c);
		cols.push(c);
		cols.push(c);
	},
	SlicedFill: function(verts, uvs, cols) {
		var br = this.border().multiplyScalar(this.pixelSize());
		if (br.x === 0 && br.y === 0 && br.z === 0 && br.w === 0)
			return this.SimpleFill(verts, uvs, cols);

		var c = this.drawingColor();
		var v = this.drawingDimensions();

		gTempPos[0].x = v.x;
		gTempPos[0].y = v.y;
		gTempPos[3].x = v.z;
		gTempPos[3].y = v.w;

		if (this.mFlip == Flip.Horizontally || 
			this.mFlip == Flip.Both) {
			gTempPos[1].x = gTempPos[0].x + br.z;
			gTempPos[2].x = gTempPos[3].x - br.x;
			gTempUVs[3].x = this.mOuterUV.xMin;
			gTempUVs[2].x = this.mInnerUV.xMin;
			gTempUVs[1].x = this.mInnerUV.xMax;
			gTempUVs[0].x = this.mOuterUV.xMax;
		}
		else {
			gTempPos[1].x = gTempPos[0].x + br.x;
			gTempPos[2].x = gTempPos[3].x - br.z;
			gTempUVs[0].x = this.mOuterUV.xMin;
			gTempUVs[1].x = this.mInnerUV.xMin;
			gTempUVs[2].x = this.mInnerUV.xMax;
			gTempUVs[3].x = this.mOuterUV.xMax;
		}

		if (this.mFlip == Flip.Vertically || 
			this.mFlip == Flip.Both) {
			gTempPos[1].y = gTempPos[0].y + br.w;
			gTempPos[2].y = gTempPos[3].y - br.y;
			gTempUVs[3].y = this.mOuterUV.yMin;
			gTempUVs[2].y = this.mInnerUV.yMin;
			gTempUVs[1].y = this.mInnerUV.yMax;
			gTempUVs[0].y = this.mOuterUV.yMax;
		}
		else {
			gTempPos[1].y = gTempPos[0].y + br.y;
			gTempPos[2].y = gTempPos[3].y - br.w;
			gTempUVs[0].y = this.mOuterUV.yMin;
			gTempUVs[1].y = this.mInnerUV.yMin;
			gTempUVs[2].y = this.mInnerUV.yMax;
			gTempUVs[3].y = this.mOuterUV.yMax;
		}

		for (var x = 0; x < 3; ++x) {
			var x2 = x + 1;
			for (var y = 0; y < 3; ++y) {
				if (this.centerType == AdvancedType.Invisible && x == 1 && y == 1)
					continue;
				var y2 = y + 1;
				verts.push(new UnityEngine.Vector3(gTempPos[x].x, gTempPos[y].y));
				verts.push(new UnityEngine.Vector3(gTempPos[x].x, gTempPos[y2].y));
				verts.push(new UnityEngine.Vector3(gTempPos[x2].x, gTempPos[y2].y));
				verts.push(new UnityEngine.Vector3(gTempPos[x2].x, gTempPos[y].y));
				uvs.push(new UnityEngine.Vector2(gTempUVs[x].x, gTempUVs[y].y));
				uvs.push(new UnityEngine.Vector2(gTempUVs[x].x, gTempUVs[y2].y));
				uvs.push(new UnityEngine.Vector2(gTempUVs[x2].x, gTempUVs[y2].y));
				uvs.push(new UnityEngine.Vector2(gTempUVs[x2].x, gTempUVs[y].y));
				cols.push(c);
				cols.push(c);
				cols.push(c);
				cols.push(c);
			}
		}
	},
	FilledFill: function(verts, uvs, cols) {
		if (this.mFillAmount < 0.001) return;
		var v = this.drawingDimensions();
		var u = this.drawingUVs();
		var c = this.drawingColor();
		if (this.mFillDirection == FillDirection.Horizontal || 
			this.mFillDirection == FillDirection.Vertical) {
			if (this.mFillDirection == FillDirection.Horizontal) {
				var fill = (u.z - u.x) * this.mFillAmount;
				if (this.mInvert) {
					v.x = v.z - (v.z - v.x) * this.mFillAmount;
					u.x = u.z - fill;
				}
				else {
					v.z = v.x + (v.z - v.x) * this.mFillAmount;
					u.z = u.x + fill;
				}
			}
			else if (this.mFillDirection == FillDirection.Vertical) {
				var fill = (u.w - u.y) * this.mFillAmount;
				if (this.mInvert) {
					v.y = v.w - (v.w - v.y) * this.mFillAmount;
					u.y = u.w - fill;
				}
				else {
					v.w = v.y + (v.w - v.y) * this.mFillAmount;
					u.w = u.y + fill;
				}
			}
		}

		gTempPos[0] = new UnityEngine.Vector2(v.x, v.y);
		gTempPos[1] = new UnityEngine.Vector2(v.x, v.w);
		gTempPos[2] = new UnityEngine.Vector2(v.z, v.w);
		gTempPos[3] = new UnityEngine.Vector2(v.z, v.y);

		gTempUVs[0] = new UnityEngine.Vector2(u.x, u.y);
		gTempUVs[1] = new UnityEngine.Vector2(u.x, u.w);
		gTempUVs[2] = new UnityEngine.Vector2(u.z, u.w);
		gTempUVs[3] = new UnityEngine.Vector2(u.z, u.y);

		if (this.mFillAmount < 1) {
			if (this.mFillDirection == FillDirection.Radial90) {
				if (NGUI.UIBasicSprite.RadialCut(gTempPos, gTempUVs, this.mFillAmount, this.mInvert, 0)) {
					for (var i = 0; i < 4; ++i) {
						verts.push(gTempPos[i]);
						uvs.push(gTempUVs[i]);
						cols.push(c);
					}
				}
				return;
			}

			if (this.mFillDirection == FillDirection.Radial180) {
				for (var side = 0; side < 2; ++side) {
					var fx0 = 0;
					var fx1 = 0;
					var fy0 = 0;
					var fy1 = 1;

					if (side == 0) { fx0 = 0; fx1 = 0.5; }
					else { fx0 = 0.5; fx1 = 1; }

					gTempPos[0].x = Mathf.Lerp(v.x, v.z, fx0);
					gTempPos[1].x = gTempPos[0].x;
					gTempPos[2].x = Mathf.Lerp(v.x, v.z, fx1);
					gTempPos[3].x = gTempPos[2].x;

					gTempPos[0].y = Mathf.Lerp(v.y, v.w, fy0);
					gTempPos[1].y = Mathf.Lerp(v.y, v.w, fy1);
					gTempPos[2].y = gTempPos[1].y;
					gTempPos[3].y = gTempPos[0].y;

					gTempUVs[0].x = Mathf.Lerp(u.x, u.z, fx0);
					gTempUVs[1].x = gTempUVs[0].x;
					gTempUVs[2].x = Mathf.Lerp(u.x, u.z, fx1);
					gTempUVs[3].x = gTempUVs[2].x;

					gTempUVs[0].y = Mathf.Lerp(u.y, u.w, fy0);
					gTempUVs[1].y = Mathf.Lerp(u.y, u.w, fy1);
					gTempUVs[2].y = gTempUVs[1].y;
					gTempUVs[3].y = gTempUVs[0].y;

					var val = !this.mInvert ? this.mFillAmount * 2 - side : this.mFillAmount * 2 - (1 - side);
					if (NGUI.UIBasicSprite.RadialCut(gTempPos, gTempUVs, Mathf.Clamp01(val), !this.mInvert, NGUIMath.RepeatIndex(side + 3, 4))) {
						for (var i = 0; i < 4; ++i) {
							verts.push(gTempPos[i]);
							uvs.push(gTempUVs[i]);
							cols.push(c);
						}
					}
				}
				return;
			}

			if (this.mFillDirection == FillDirection.Radial360) {
				for (var corner = 0; corner < 4; ++corner) {
					var fx0 = 0;
					var fx1 = 0;
					var fy0 = 0;
					var fy1 = 0;

					if (corner < 2) { fx0 = 0; fx1 = 0.5; }
					else { fx0 = 0.5; fx1 = 1; }

					if (corner == 0 || corner == 3) { fy0 = 0; fy1 = 0.5; }
					else { fy0 = 0.5; fy1 = 1; }

					gTempPos[0].x = Mathf.Lerp(v.x, v.z, fx0);
					gTempPos[1].x = gTempPos[0].x;
					gTempPos[2].x = Mathf.Lerp(v.x, v.z, fx1);
					gTempPos[3].x = gTempPos[2].x;

					gTempPos[0].y = Mathf.Lerp(v.y, v.w, fy0);
					gTempPos[1].y = Mathf.Lerp(v.y, v.w, fy1);
					gTempPos[2].y = gTempPos[1].y;
					gTempPos[3].y = gTempPos[0].y;

					gTempUVs[0].x = Mathf.Lerp(u.x, u.z, fx0);
					gTempUVs[1].x = gTempUVs[0].x;
					gTempUVs[2].x = Mathf.Lerp(u.x, u.z, fx1);
					gTempUVs[3].x = gTempUVs[2].x;

					gTempUVs[0].y = Mathf.Lerp(u.y, u.w, fy0);
					gTempUVs[1].y = Mathf.Lerp(u.y, u.w, fy1);
					gTempUVs[2].y = gTempUVs[1].y;
					gTempUVs[3].y = gTempUVs[0].y;

					var val = this.mInvert ?
						this.mFillAmount * 4 - NGUIMath.RepeatIndex(corner + 2, 4) :
						this.mFillAmount * 4 - (3 - NGUIMath.RepeatIndex(corner + 2, 4));

					if (NGUI.UIBasicSprite.RadialCut(gTempPos, gTempUVs, Mathf.Clamp01(val), this.mInvert, NGUIMath.RepeatIndex(corner + 2, 4))) {
						for (var i = 0; i < 4; ++i) {
							verts.push(gTempPos[i]);
							uvs.push(gTempUVs[i]);
							cols.push(c);
						}
					}
				}
				return;
			}
		}

		// Fill the buffer with the quad for the sprite
		for (var i = 0; i < 4; ++i) {
			verts.push(gTempPos[i]);
			uvs.push(gTempUVs[i]);
			cols.push(c);
		}
	},
	TiledFill: function(verts, uvs, cols) {
		var tex = this.texture();
		if (tex === undefined) return;

		var size = new UnityEngine.Vector2(this.mInnerUV.width * tex.width, this.mInnerUV.height * tex.height);
		size.multiplyScalar(this.pixelSize());
		if (size.x < 2 || size.y < 2) return;

		var c = this.drawingColor();
		var v = this.drawingDimensions();
		var u = new UnityEngine.Vector2();
		if (this.mFlip === Flip.Horizontally || this.mFlip === Flip.Both) {
			u.x = this.mInnerUV.xMax;
			u.z = this.mInnerUV.xMin;
		} else {
			u.x = this.mInnerUV.xMin;
			u.z = this.mInnerUV.xMax;
		}
		if (this.mFlip === Flip.Vertically || this.mFlip === Flip.Both) {
			u.y = this.mInnerUV.yMax;
			u.w = this.mInnerUV.yMin;
		} else {
			u.y = this.mInnerUV.yMin;
			u.w = this.mInnerUV.yMax;
		}

		var x0 = v.x;
		var y0 = v.y;
		var u0 = u.x;
		var v0 = u.y;
		while (y0 < v.w) {
			x0 = v.x;
			var y1 = y0 + size.y;
			var v1 = u.w;
			if (y1 > v.w) {
				v1 = Mathf.Lerp(u.y, u.w, (v.w - y0) / size.y);
				y1 = v.w;
			}
			while (x0 < v.z){
				var x1 = x0 + size.x;
				var u1 = u.z;
				if (x1 > v.z){
					u1 = Mathf.Lerp(u.x, u.z, (v.z - x0) / size.x);
					x1 = v.z;
				}
				verts.push(new UnityEngine.Vector3(x0, y0));
				verts.push(new UnityEngine.Vector3(x0, y1));
				verts.push(new UnityEngine.Vector3(x1, y1));
				verts.push(new UnityEngine.Vector3(x1, y0));
				uvs.push(new UnityEngine.Vector2(u0, v0));
				uvs.push(new UnityEngine.Vector2(u0, v1));
				uvs.push(new UnityEngine.Vector2(u1, v1));
				uvs.push(new UnityEngine.Vector2(u1, v0));
				cols.push(c);
				cols.push(c);
				cols.push(c);
				cols.push(c);
				x0 += size.x;
			}
			y0 += size.y;
		}
	},
	AdvancedFill: function(verts, uvs, cols) {
		// not implemented...
	}
});


NGUI.UIBasicSprite.RadialCut = function(xy, uv, fill, invert, corner) {
	if (fill < 0.001) return false;
	if ((corner & 1) == 1) invert = !invert;
	if (!invert && fill > 0.999) return true;
	
	var angle = Mathf.Clamp01(fill);
	if (invert) angle = 1 - angle;
	angle *= 90 * Mathf.Deg2Rad;

	var cos = Math.cos(angle);
	var sin = Math.sin(angle);
	NGUI.UIBasicSprite.RadialCut2(xy, cos, sin, invert, corner);
	NGUI.UIBasicSprite.RadialCut2(uv, cos, sin, invert, corner);
	return true;
}

NGUI.UIBasicSprite.RadialCut2 = function(xy, cos, sin, invert, corner) {
	var i0 = corner;
	var i1 = NGUIMath.RepeatIndex(corner + 1, 4);
	var i2 = NGUIMath.RepeatIndex(corner + 2, 4);
	var i3 = NGUIMath.RepeatIndex(corner + 3, 4);
	if ((corner & 1) == 1) {
		if (sin > cos) {
			cos /= sin;
			sin = 1;
			if (invert) {
				xy[i1].x = Mathf.Lerp(xy[i0].x, xy[i2].x, cos);
				xy[i2].x = xy[i1].x;
			}
		} else if (cos > sin) {
			sin /= cos;
			cos = 1;
			if (!invert) {
				xy[i2].y = Mathf.Lerp(xy[i0].y, xy[i2].y, sin);
				xy[i3].y = xy[i2].y;
			}
		} else {
			cos = 1;
			sin = 1;
		}
		if (!invert) xy[i3].x = Mathf.Lerp(xy[i0].x, xy[i2].x, cos);
		else xy[i1].y = Mathf.Lerp(xy[i0].y, xy[i2].y, sin);
	} else {
		if (cos > sin) {
			sin /= cos;
			cos = 1;
			if (!invert) {
				xy[i1].y = Mathf.Lerp(xy[i0].y, xy[i2].y, sin);
				xy[i2].y = xy[i1].y;
			}
		} else if (sin > cos) {
			cos /= sin;
			sin = 1;
			if (invert) {
				xy[i2].x = Mathf.Lerp(xy[i0].x, xy[i2].x, cos);
				xy[i3].x = xy[i2].x;
			}
		} else {
			cos = 1;
			sin = 1;
		}
		if (invert) xy[i3].y = Mathf.Lerp(xy[i0].y, xy[i2].y, sin);
		else xy[i1].x = Mathf.Lerp(xy[i0].x, xy[i2].x, cos);
	}
}