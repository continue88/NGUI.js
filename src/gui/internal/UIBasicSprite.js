
NGUI.UIBasicSprite = function() {
    NGUI.UIWidget.call();
    this.mOuterUV = new UnityEngine.Rect(0, 0, 1, 1);
    this.mInnerUV = new UnityEngine.Rect(0, 0, 1, 1);
    this.mFillAmount = 1.0;
    this.mInvert = false;
    this.mType = NGUI.UIBasicSprite.Type.Simple;
    this.mFillDirection = NGUI.UIBasicSprite.FillDirection.Radial360;
    this.mFlip = NGUI.UIBasicSprite.Flip.Nothing;
};

NGUI.UIBasicSprite.Type = {
    Simple: 0,
    Sliced: 1,
    Tiled: 2,
    Filled: 3,
    Advanced: 4,
};
NGUI.UIBasicSprite.FillDirection = {
    Horizontal: 0,
    Vertical: 1,
    Radial90: 2,
    Radial180: 3,
    Radial360: 4,
};
NGUI.UIBasicSprite.AdvancedType = {
    Invisible: 0,
    Sliced: 1,
    Tiled: 2,
};
NGUI.UIBasicSprite.Flip = {
    Nothing: 0,
    Horizontally: 1,
    Vertically: 2,
    Both: 3,
};

mTempPos = [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()];
mTempUVs = [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()];

Object.assign(NGUI.UIBasicSprite.prototype, NGUI.UIWidget.prototype, {
    constructor: NGUI.UIBasicSprite,
    get pixelSize() { return 1; },
    drawingUVs: function() {
        switch (this.mFlip) {
            case NGUI.UIBasicSprite.Flip.Horizontally: return new THREE.Vector4(this.mOuterUV.xMax, this.mOuterUV.yMin, this.mOuterUV.xMin, this.mOuterUV.yMax);
            case NGUI.UIBasicSprite.Flip.Vertically: return new THREE.Vector4(this.mOuterUV.xMin, this.mOuterUV.yMax, this.mOuterUV.xMax, this.mOuterUV.yMin);
            case NGUI.UIBasicSprite.Flip.Both: return new THREE.Vector4(this.mOuterUV.xMax, this.mOuterUV.yMax, this.mOuterUV.xMin, this.mOuterUV.yMin);
            default: return new THREE.Vector4(this.mOuterUV.xMin, this.mOuterUV.yMin, this.mOuterUV.xMax, this.mOuterUV.yMax);
        }
    },
    drawingColor: function() { return new THREE.Color(this.mColor.r, this.mColor.g, this.mColor.b, this.this.finalAlpha); },
	Fill: function(verts, uvs, cols, outer, inner) {
		this.mOuterUV = outer;
		this.mInnerUV = inner;
		switch (this.mType) {
        case NGUI.UIBasicSprite.Type.Simple:
            this.SimpleFill(verts, uvs, cols);
            break;
        case NGUI.UIBasicSprite.Type.Sliced:
            this.SlicedFill(verts, uvs, cols);
            break;
        case NGUI.UIBasicSprite.Type.Filled:
            this.FilledFill(verts, uvs, cols);
            break;
        case NGUI.UIBasicSprite.Type.Tiled:
            this.TiledFill(verts, uvs, cols);
            break;
        case NGUI.UIBasicSprite.Type.Advanced:
            this.AdvancedFill(verts, uvs, cols);
            break;
		}
	},
	SimpleFill: function(verts, uvs, cols) {
		var v = this.drawingDimensions();
		var u = this.drawingUVs();
		var c = this.drawingColor();
		verts.Add(new THREE.Vector3(v.x, v.y));
		verts.Add(new THREE.Vector3(v.x, v.w));
		verts.Add(new THREE.Vector3(v.z, v.w));
		verts.Add(new THREE.Vector3(v.z, v.y));
		uvs.Add(new THREE.Vector2(u.x, u.y));
		uvs.Add(new THREE.Vector2(u.x, u.w));
		uvs.Add(new THREE.Vector2(u.z, u.w));
		uvs.Add(new THREE.Vector2(u.z, u.y));
		cols.Add(c);
		cols.Add(c);
		cols.Add(c);
		cols.Add(c);
	},
	SlicedFill: function(verts, uvs, cols) {
		var br = this.border() * pixelSize;
		if (br.x == 0 && br.y == 0 && br.z == 0 && br.w == 0)
			return this.SimpleFill(verts, uvs, cols);

		var c = this.drawingColor();
		var v = this.drawingDimensions();

		mTempPos[0].x = v.x;
		mTempPos[0].y = v.y;
		mTempPos[3].x = v.z;
		mTempPos[3].y = v.w;

		if (this.mFlip == NGUI.UIBasicSprite.Flip.Horizontally || 
            this.mFlip == NGUI.UIBasicSprite.Flip.Both) {
			mTempPos[1].x = mTempPos[0].x + br.z;
			mTempPos[2].x = mTempPos[3].x - br.x;
			mTempUVs[3].x = this.mOuterUV.xMin;
			mTempUVs[2].x = this.mInnerUV.xMin;
			mTempUVs[1].x = this.mInnerUV.xMax;
			mTempUVs[0].x = this.mOuterUV.xMax;
		}
		else {
			mTempPos[1].x = mTempPos[0].x + br.x;
			mTempPos[2].x = mTempPos[3].x - br.z;
			mTempUVs[0].x = this.mOuterUV.xMin;
			mTempUVs[1].x = this.mInnerUV.xMin;
			mTempUVs[2].x = this.mInnerUV.xMax;
			mTempUVs[3].x = this.mOuterUV.xMax;
		}

		if (this.mFlip == NGUI.UIBasicSprite.Flip.Vertically || 
            this.mFlip == NGUI.UIBasicSprite.Flip.Both) {
			mTempPos[1].y = mTempPos[0].y + br.w;
			mTempPos[2].y = mTempPos[3].y - br.y;
			mTempUVs[3].y = this.mOuterUV.yMin;
			mTempUVs[2].y = this.mInnerUV.yMin;
			mTempUVs[1].y = this.mInnerUV.yMax;
			mTempUVs[0].y = this.mOuterUV.yMax;
		}
		else {
			mTempPos[1].y = mTempPos[0].y + br.y;
			mTempPos[2].y = mTempPos[3].y - br.w;
			mTempUVs[0].y = this.mOuterUV.yMin;
			mTempUVs[1].y = this.mInnerUV.yMin;
			mTempUVs[2].y = this.mInnerUV.yMax;
			mTempUVs[3].y = this.mOuterUV.yMax;
		}

		for (var x = 0; x < 3; ++x) {
			var x2 = x + 1;
			for (var y = 0; y < 3; ++y) {
				if (centerType == NGUI.UIBasicSprite.AdvancedType.Invisible && x == 1 && y == 1)
                    continue;
				var y2 = y + 1;
				verts.Add(new THREE.Vector3(mTempPos[x].x, mTempPos[y].y));
				verts.Add(new THREE.Vector3(mTempPos[x].x, mTempPos[y2].y));
				verts.Add(new THREE.Vector3(mTempPos[x2].x, mTempPos[y2].y));
				verts.Add(new THREE.Vector3(mTempPos[x2].x, mTempPos[y].y));
				uvs.Add(new THREE.Vector2(mTempUVs[x].x, mTempUVs[y].y));
				uvs.Add(new THREE.Vector2(mTempUVs[x].x, mTempUVs[y2].y));
				uvs.Add(new THREE.Vector2(mTempUVs[x2].x, mTempUVs[y2].y));
				uvs.Add(new THREE.Vector2(mTempUVs[x2].x, mTempUVs[y].y));
				cols.Add(c);
				cols.Add(c);
				cols.Add(c);
				cols.Add(c);
			}
		}
	},
	FilledFill: function(verts, uvs, cols) {
		if (this.mFillAmount < 0.001) return;

		var v = drawingDimensions();
		var u = drawingUVs();
		var c = drawingColor();
        
		if (this.mFillDirection == NGUI.UIBasicSprite.FillDirection.Horizontal || 
            this.mFillDirection == NGUI.UIBasicSprite.FillDirection.Vertical) {
			if (this.mFillDirection == NGUI.UIBasicSprite.FillDirection.Horizontal) {
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
			else if (this.mFillDirection == NGUI.UIBasicSprite.FillDirection.Vertical) {
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

		mTempPos[0] = new THREE.Vector2(v.x, v.y);
		mTempPos[1] = new THREE.Vector2(v.x, v.w);
		mTempPos[2] = new THREE.Vector2(v.z, v.w);
		mTempPos[3] = new THREE.Vector2(v.z, v.y);

		mTempUVs[0] = new THREE.Vector2(u.x, u.y);
		mTempUVs[1] = new THREE.Vector2(u.x, u.w);
		mTempUVs[2] = new THREE.Vector2(u.z, u.w);
		mTempUVs[3] = new THREE.Vector2(u.z, u.y);

		if (this.mFillAmount < 1) {
			if (this.mFillDirection == NGUI.UIBasicSprite.FillDirection.Radial90) {
				if (NGUI.UIBasicSprite.RadialCut(mTempPos, mTempUVs, this.mFillAmount, this.mInvert, 0)) {
					for (var i = 0; i < 4; ++i) {
						verts.Add(mTempPos[i]);
						uvs.Add(mTempUVs[i]);
						cols.Add(c);
					}
				}
				return;
			}

			if (this.mFillDirection == NGUI.UIBasicSprite.FillDirection.Radial180) {
				for (var side = 0; side < 2; ++side) {
					var fx0 = 0;
                    var fx1 = 0;
					var fy0 = 0;
					var fy1 = 1;

					if (side == 0) { fx0 = 0; fx1 = 0.5; }
					else { fx0 = 0.5; fx1 = 1; }

					mTempPos[0].x = Mathf.Lerp(v.x, v.z, fx0);
					mTempPos[1].x = mTempPos[0].x;
					mTempPos[2].x = Mathf.Lerp(v.x, v.z, fx1);
					mTempPos[3].x = mTempPos[2].x;

					mTempPos[0].y = Mathf.Lerp(v.y, v.w, fy0);
					mTempPos[1].y = Mathf.Lerp(v.y, v.w, fy1);
					mTempPos[2].y = mTempPos[1].y;
					mTempPos[3].y = mTempPos[0].y;

					mTempUVs[0].x = Mathf.Lerp(u.x, u.z, fx0);
					mTempUVs[1].x = mTempUVs[0].x;
					mTempUVs[2].x = Mathf.Lerp(u.x, u.z, fx1);
					mTempUVs[3].x = mTempUVs[2].x;

					mTempUVs[0].y = Mathf.Lerp(u.y, u.w, fy0);
					mTempUVs[1].y = Mathf.Lerp(u.y, u.w, fy1);
					mTempUVs[2].y = mTempUVs[1].y;
					mTempUVs[3].y = mTempUVs[0].y;

					var val = !this.mInvert ? this.mFillAmount * 2 - side : this.mFillAmount * 2 - (1 - side);
					if (NGUI.UIBasicSprite.RadialCut(mTempPos, mTempUVs, Mathf.Clamp01(val), !this.mInvert, NGUIMath.RepeatIndex(side + 3, 4))) {
						for (var i = 0; i < 4; ++i) {
							verts.Add(mTempPos[i]);
							uvs.Add(mTempUVs[i]);
							cols.Add(c);
						}
					}
				}
				return;
			}

			if (this.mFillDirection == NGUI.UIBasicSprite.FillDirection.Radial360) {
				for (var corner = 0; corner < 4; ++corner) {
					var fx0 = 0;
                    var fx1 = 0;
                    var fy0 = 0;
                    var fy1 = 0;

					if (corner < 2) { fx0 = 0; fx1 = 0.5; }
					else { fx0 = 0.5; fx1 = 1; }

					if (corner == 0 || corner == 3) { fy0 = 0; fy1 = 0.5; }
					else { fy0 = 0.5; fy1 = 1; }

					mTempPos[0].x = Mathf.Lerp(v.x, v.z, fx0);
					mTempPos[1].x = mTempPos[0].x;
					mTempPos[2].x = Mathf.Lerp(v.x, v.z, fx1);
					mTempPos[3].x = mTempPos[2].x;

					mTempPos[0].y = Mathf.Lerp(v.y, v.w, fy0);
					mTempPos[1].y = Mathf.Lerp(v.y, v.w, fy1);
					mTempPos[2].y = mTempPos[1].y;
					mTempPos[3].y = mTempPos[0].y;

					mTempUVs[0].x = Mathf.Lerp(u.x, u.z, fx0);
					mTempUVs[1].x = mTempUVs[0].x;
					mTempUVs[2].x = Mathf.Lerp(u.x, u.z, fx1);
					mTempUVs[3].x = mTempUVs[2].x;

					mTempUVs[0].y = Mathf.Lerp(u.y, u.w, fy0);
					mTempUVs[1].y = Mathf.Lerp(u.y, u.w, fy1);
					mTempUVs[2].y = mTempUVs[1].y;
					mTempUVs[3].y = mTempUVs[0].y;

					var val = this.mInvert ?
						this.mFillAmount * 4 - NGUIMath.RepeatIndex(corner + 2, 4) :
						this.mFillAmount * 4 - (3 - NGUIMath.RepeatIndex(corner + 2, 4));

					if (NGUI.UIBasicSprite.RadialCut(mTempPos, mTempUVs, Mathf.Clamp01(val), this.mInvert, NGUIMath.RepeatIndex(corner + 2, 4))) {
						for (var i = 0; i < 4; ++i) {
							verts.Add(mTempPos[i]);
							uvs.Add(mTempUVs[i]);
							cols.Add(c);
						}
					}
				}
				return;
			}
		}

		// Fill the buffer with the quad for the sprite
		for (var i = 0; i < 4; ++i) {
			verts.Add(mTempPos[i]);
			uvs.Add(mTempUVs[i]);
			cols.Add(c);
		}
	},
    AdvancedFill: function(verts, uvs, cols) {
        // not implemented...
	}
});
