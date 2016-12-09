// autogen by combine tools.


//
// "E:\Projects\H5\NGUI.js\src\gui\gui.js"
//

UnityEngine={

};

NGUI={

};

//
// "E:\Projects\H5\NGUI.js\src\gui\unity3d\GameObject.js"
//

UnityEngine.GameObject = function () {
    this.transform = new UnityEngine.Transform();
}

//
// "E:\Projects\H5\NGUI.js\src\gui\unity3d\Mathf.js"
//

UnityEngine.Mathf = {
	lerp: function(t, a, b) {
		return a + t * (b - a);
	},
	Clamp01: function(val) {
		return Math.min(Math.max(0, val), 1);
	}
}

//
// "E:\Projects\H5\NGUI.js\src\gui\unity3d\Rect.js"
//

UnityEngine.Rect = function(left, top, width, height) {
    this.xMin = left;
    this.xMax = left + width;
    this.yMin = top;
    this.yMax = top + height;
};

UnityEngine.Rect.prototype = {
    constructor: UnityEngine.Rect,
    get left() { return this.xMin; },
    get top() { return this.yMin; },
    get width() { return this.xMax - this.xMin; },
    get height() { return this.yMax - this.yMin; },
    copy: function(source) {
        this.xMin = source.xMin;
        this.xMax = source.xMax;
        this.yMin = source.yMin;
        this.yMax = source.yMax;
        return this;
    },
};

//
// "E:\Projects\H5\NGUI.js\src\gui\unity3d\Transform.js"
//

UnityEngine.Transform = function() {
    this.position = new THREE.Vector3();
    this.rotation = new THREE.Quaternion();
    this.lossyScale = new THREE.Vector3();

    this.localPosition = new THREE.Vector3();
    this.localRotation = new THREE.Quaternion();
    this.localScale = new THREE.Vector3();

    this.worldToLocalMatrix = new THREE.Matrix4();
    this.localToWorldMatrix = new THREE.Matrix4();
    this.parent = null; // UnityEngine.Transform
};

UnityEngine.Transform.prototype = {
    constructor: UnityEngine.Transform,
    TransformPoint: function(pos) {
        return pos;
    },
};

//
// "E:\Projects\H5\NGUI.js\src\gui\internal\NGUIMath.js"
//

NGUIMath = {
    ConvertToTexCoords: function(rect, width, height) {
		var final = rect;
		if (width != 0 && height != 0) {
			final.xMin = rect.xMin / width;
			final.xMax = rect.xMax / width;
			final.yMin = 1 - rect.yMax / height;
			final.yMax = 1 - rect.yMin / height;
		}
		return final;
    },
    GetPivotOffset: function(pv) {
		var v = new THREE.Vector2();
		if (pv == NGUI.UIWidget.Pivot.Top || pv == NGUI.UIWidget.Pivot.Center || pv == NGUI.UIWidget.Pivot.Bottom) v.x = 0.5;
		else if (pv == NGUI.UIWidget.Pivot.TopRight || pv == NGUI.UIWidget.Pivot.Right || pv == NGUI.UIWidget.Pivot.BottomRight) v.x = 1;
		else v.x = 0;

		if (pv == NGUI.UIWidget.Pivot.Left || pv == NGUI.UIWidget.Pivot.Center || pv == NGUI.UIWidget.Pivot.Right) v.y = 0.5;
		else if (pv == NGUI.UIWidget.Pivot.TopLeft || pv == NGUI.UIWidget.Pivot.Top || pv == NGUI.UIWidget.Pivot.TopRight) v.y = 1;
		else v.y = 0;

		return v;
	},
	RepeatIndex: function(val, max) {
		if (max < 1) return 0;
		while (val < 0) val += max;
		while (val >= max) val -= max;
		return val;
	}
};

//
// "E:\Projects\H5\NGUI.js\src\gui\internal\NGUITools.js"
//

NGUITools = {
    screenSize: new THREE.Vector2(100, 100),
};

//
// "E:\Projects\H5\NGUI.js\src\gui\internal\UIDrawCall.js"
//

NGUI.UIDrawCall = function (name, panel, material) {
    
    this.depthStart = 2147483647; // MaxValue = 2147483647
    this.depthEnd = -2147483648; // int.MinValue = -2147483648;

    this.baseMaterial = material;
    this.renderQueue = panel.startingRenderQueue;
    this.mSortingOrder = panel.mSortingOrder;
    this.manager = panel;
    this.panel = null; // NGUI.UIPanel
    this.isDirty = false;
    
    this.verts = [];// Vector3
    this.uvs = [];// Vector3
    this.cols = [];// Vector3
}

NGUI.UIDrawCall.Clipping = {
    None: 0,
    SoftClip: 3,				// Alpha-based clipping with a softened edge
    ConstrainButDontClip: 4,	// No actual clipping, but does have an area
};

NGUI.UIDrawCall.prototype = {
    constructor: NGUI.UIDrawCall,
    UpdateGeometry: function(count) {
    },
};

//
// "E:\Projects\H5\NGUI.js\src\gui\internal\UIGeometry.js"
//

NGUI.UIGeometry = function() {
    this.verts = [];
    this.uvs = [];
    this.cols = [];
    this.mRtpVerts = [];
}

NGUI.UIGeometry.prototype = {
    constructor: NGUI.UIGeometry,
    hasVertices: function() { return this.verts.length > 0; },
    clear: function() {
        if (this.verts.length > 0) this.verts = [];
        if (this.uvs.length > 0) this.uvs = [];
        if (this.cols.length > 0) this.cols = [];
        if (this.mRtpVerts.length > 0) this.mRtpVerts = [];
    },
    ApplyTransform: function(widgetToPanel) {
		if (this.verts.length > 0) {
			this.mRtpVerts = [];
			for (var i = 0, imax = this.verts.length; i < imax; ++i) 
                this.mRtpVerts.push(widgetToPanel.MultiplyPoint3x4(this.verts[i]));
        }
        else if (this.mRtpVerts.length > 0)
            this.mRtpVerts = [];
    },
    WriteToBuffers: function(v, u, c) {
        for (var i = 0; i < this.mRtpVerts.length; ++i) {
            v.push(this.mRtpVerts.buffer[i]);
            u.push(this.uvs.buffer[i]);
            c.push(this.cols.buffer[i]);
        }
    }
}

//
// "E:\Projects\H5\NGUI.js\src\gui\internal\UIRect.js"
//

NGUI.UIRect = function() {
    this.finalAlpha = 1;
    this.transform = null; // UnityEngine.Transform
    this.gameObject = null; // UnityEngine.GameObject
    this.enabled = true;
};

NGUI.UIRect.prototype = {
    constructor: NGUI.UIRect,
    copy: function(source) {
        return this;
    },
};

//
// "E:\Projects\H5\NGUI.js\src\gui\internal\UIWidget.js"
//

NGUI.UIWidget = function() {
    NGUI.UIRect.call();
    
    this.mColor = new THREE.Color(1, 1, 1), // THREE.ColorKeywords.white
    this.mPivot = NGUI.UIWidget.Pivot.Center;
    this.mWidth = 100;
    this.mHeight = 100;
    this.mDepth = 0;
    this.mChanged = false;
    this.mMoved = false;
    this.mIsInFront = true;
    this.mIsVisibleByAlpha = true;
    this.mIsVisibleByPanel = true;
    this.mDrawRegion = new THREE.Vector4(0, 0, 1, 1);
    this.mLocalToPanel = new THREE.Matrix4();
    this.mMatrixFrame = 1;

    // public variables.
    this.fillGeometry = true;
    this.panel = null;
    this.drawCall = null;
    this.geometry = new NGUI.UIGeometry();
};

NGUI.UIWidget.Pivot = {
    TopLeft: 0,
    Top: 1,
    TopRight: 2,
    Left: 3,
    Center: 4,
    Right: 5,
    BottomLeft: 6,
    Bottom: 7,
    BottomRight: 8,
};

Object.assign(NGUI.UIWidget.prototype, NGUI.UIRect.prototype, {
    constructor: NGUI.UIWidget,
	get pivotOffset() { return NGUIMath.GetPivotOffset(this.mPivot); },
    get material() { return null; },
    isVisible: function() { return this.mIsVisibleByAlpha && this.mIsVisibleByPanel && this.mIsInFront && this.finalAlpha > 0.001; },
    hasVertices: function() { return this.geometry.hasVertices(); },
    border: function() { return new THREE.Vector4(0, 0, 0, 0); },
    OnFill: function(verts, uvs, cols) { },
    UpdateVisibility: function(visibleByAlpha, visibleByPanel) {
		if (this.mIsVisibleByAlpha != visibleByAlpha || this.mIsVisibleByPanel != visibleByPanel) {
			this.mChanged = true;
			this.mIsVisibleByAlpha = visibleByAlpha;
			this.mIsVisibleByPanel = visibleByPanel;
			return true;
		}
		return false;
    },
    drawingDimensions: function() {
        var offset = this.pivotOffset;
        var x0 = -offset.x * this.mWidth;
        var y0 = -offset.y * this.mHeight;
        var x1 = x0 + this.mWidth;
        var y1 = y0 + this.mHeight;
        return new THREE.Vector4(
            this.mDrawRegion.x == 0 ? x0 : UnityEngine.Mathf.Lerp(x0, x1, this.mDrawRegion.x),
            this.mDrawRegion.y == 0 ? y0 : UnityEngine.Mathf.Lerp(y0, y1, this.mDrawRegion.y),
            this.mDrawRegion.z == 1 ? x1 : UnityEngine.Mathf.Lerp(x0, x1, this.mDrawRegion.z),
            this.mDrawRegion.w == 1 ? y1 : UnityEngine.Mathf.Lerp(y0, y1, this.mDrawRegion.w));
    },
    UpdateGeometry: function(frame) {
        if (this.mChanged) {
            this.mChanged = false;
            if (this.mIsVisibleByAlpha && this.finalAlpha > 0.001) {
                var hadVertices = this.geometry.hasVertices;
                if (this.fillGeometry) {
                    this.geometry.Clear();
                    this.OnFill(this.geometry.verts, this.geometry.uvs, this.geometry.cols);
                }
                if (geometry.hasVertices) {
					if (this.mMatrixFrame != frame) {
						this.mLocalToPanel = this.panel.worldToLocal * this.transform.localToWorldMatrix;
						this.mMatrixFrame = frame;
					}
					this.geometry.ApplyTransform(this.mLocalToPanel);
					this.mMoved = false;
					return true;
                }
            }
            
            if (this.fillGeometry) this.geometry.Clear();
            this.mMoved = false;
            return true;
        }
        else if (this.mMoved && this.geometry.hasVertices()) {
            if (this.mMatrixFrame != frame) {
                this.mLocalToPanel = this.panel.worldToLocal * this.transform.localToWorldMatrix;
                this.mMatrixFrame = frame;
            }
			this.geometry.ApplyTransform(this.mLocalToPanel);
            this.mMoved = false;
            return true;
        }
        this.mMoved = false;
        return false;
    },
    WriteToBuffers: function(v, u, c) {
        this.geometry.WriteToBuffers(v, u, c);
    },
});

//
// "E:\Projects\H5\NGUI.js\src\gui\internal\UIBasicSprite.js"
//

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


//
// "E:\Projects\H5\NGUI.js\src\gui\ui\UIAtlas.js"
//

NGUI.UIAtlas = function() {
    this.material = new THREE.SpriteMaterial();
    this.mSprites = {}; // NGUI.UISpriteData
}

NGUI.UIAtlas.prototype = {
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
};

//
// "E:\Projects\H5\NGUI.js\src\gui\ui\UIPanel.js"
//

NGUI.UIPanel = function() {
    NGUI.UIRect.call();

    this.mDepth = 0;
    this.mSortingOrder = 0;
    this.mUpdateFrame = 0;
    this.mUpdateScroll = false;
    this.mRebuild = false;
    this.mForced = false;
    this.mResized = false;
    this.mClipOffset = new THREE.Vector2();
    this.mClipRange = new THREE.Vector4();
    this.mMin = new THREE.Vector2();
    this.mMax = new THREE.Vector2();
    this.mClipping = NGUI.UIDrawCall.Clipping.None;

    this.startingRenderQueue = 3000;
    this.drawCallClipRange = new THREE.Vector4(0, 0, 1, 1);
    this.renderQueue = NGUI.UIPanel.RenderQueue.Automatic;
    this.widgets = []; // NGUI.UIWidget list
    this.drawCalls = []; // NGUI.UIDrawCall
};

NGUI.UIPanel.RenderQueue = {
    Automatic: 0,
    StartAt: 1,
    Explicit: 2,
};

// static variables and function.
NGUI.UIPanel.list = [];
NGUI.UIPanel.UpdateAll = function(frame) {
    var list = NGUI.UIPanel.list;
    for (var i in list)
        list[i].UpdateSelf(frame);

    var rq = 3000;
    for (var i in list) {
        var p = list[i];
        if (p.renderQueue == NGUI.UIPanel.RenderQueue.Automatic) {
            p.startingRenderQueue = rq;
            p.UpdateDrawCalls();
            rq += p.drawCalls.length + 2;
        }
        else if (p.renderQueue == NGUI.UIPanel.RenderQueue.StartAt) {
            p.UpdateDrawCalls();
            if (p.drawCalls.length != 0)
                rq = Math.max(rq, p.startingRenderQueue + p.drawCalls.length);
        }
        else { // Explicit
            p.UpdateDrawCalls();
            if (p.drawCalls.Count != 0)
                rq = Math.max(rq, p.startingRenderQueue + 1);
        }
    }
}

Object.assign(NGUI.UIPanel.prototype, NGUI.UIRect.prototype, {
    constructor: NGUI.UIPanel,
    GetViewSize: function() {
		if (this.mClipping != NGUI.UIDrawCall.Clipping.None)
			return new THREE.Vector2(this.mClipRange.z, this.mClipRange.w);
        return NGUITools.screenSize;
    },
    finalClipRegion: function() {
        var size = this.GetViewSize();
    	if (this.mClipping != NGUI.UIDrawCall.Clipping.None)
            return new THREE.Vector4(this.mClipRange.x + this.mClipOffset.x, this.mClipRange.y + this.mClipOffset.y, size.x, size.y);
        return new THREE.Vector4(0, 0, size.x, size.y);
    },
    UpdateSelf: function(frame) {
		this.UpdateTransformMatrix(frame);
		this.UpdateLayers(frame);
		this.UpdateWidgets(frame);
		if (this.mRebuild) {
			this.mRebuild = false;
			this.FillAllDrawCalls();
		}
		else {
			for (var i = 0; i < this.drawCalls.length;) {
				var dc = this.drawCalls[i];
				if (dc.isDirty && !this.FillDrawCall(dc)) {
					//UIDrawCall.Destroy(dc);
					this.drawCalls.splice(i, 1);
					continue;
				}
				++i;
			}
		}

		if (this.mUpdateScroll) {
			this.mUpdateScroll = false;
			//UIScrollView sv = GetComponent<UIScrollView>();
			//if (sv != null) sv.UpdateScrollbars();
		}
    },
    UpdateTransformMatrix: function(frame) {
        this.worldToLocal = this.transform.worldToLocalMatrix;
        var size = this.GetViewSize() * 0.5;
        var x = this.mClipOffset.x + this.mClipRange.x;
        var y = this.mClipOffset.y + this.mClipRange.y;
        this.mMin.x = x - size.x;
        this.mMin.y = y - size.y;
        this.mMax.x = x + size.x;
        this.mMax.y = y + size.y;
    },
    UpdateLayers: function(frame) {
        // TODO: unity3d layer...
    },
    UpdateWidgets: function(frame) {
		var changed = false;
		for (var i in this.widgets) {
			var w = this.widgets[i];
			if (w.panel != this || !w.enabled)
                continue;
                
            // First update the widget's transform
            if (w.UpdateTransform(frame) || this.mResized) {
                //var vis = forceVisible || (w.CalculateCumulativeAlpha(frame) > 0.001f);
                //w.UpdateVisibility(vis, forceVisible || ((clipped || w.hideIfOffScreen) ? IsVisible(w) : true));
            }
            
            // Update the widget's geometry if necessary
            if (w.UpdateGeometry(frame)) {
                changed = true;
                if (!this.mRebuild) {
                    if (w.drawCall != null)
                        w.drawCall.isDirty = true;
                    else
                        this.FindDrawCall(w);
                }
            }
		}
		this.mResized = false;
    },
    UpdateDrawCalls: function() {
		var trans = this.transform;
		if (this.mClipping != NGUI.UIDrawCall.Clipping.None) {
			this.drawCallClipRange = this.finalClipRegion();
			this.drawCallClipRange.z *= 0.5;
			this.drawCallClipRange.w *= 0.5;
		}
		else drawCallClipRange = new THREE.Vector4(0, 0, 0, 0);

		// Legacy functionality
		if (this.drawCallClipRange.z == 0) this.drawCallClipRange.z = NGUITools.screenSize.x * 0.5;
		if (this.drawCallClipRange.w == 0) this.drawCallClipRange.w = NGUITools.screenSize.y * 0.5;
		var pos = this.transform.localPosition;
        var parent = this.transform.parent;
        if (parent != null)
            pos = parent.TransformPoint(pos);

		var rot = this.transform.rotation;
		var scale = this.transform.lossyScale;
		for (var i in this.drawCalls) {
			var dc = this.drawCalls[i];
			var t = dc.transform;
			t.position = pos;
			t.rotation = rot;
			t.localScale = scale;
			dc.renderQueue = (this.renderQueue == NGUI.UIPanel.RenderQueue.Explicit) ? this.startingRenderQueue : this.startingRenderQueue + i;
			dc.sortingOrder = this.mSortingOrder;
		}
    },
    FillAllDrawCalls: function() {
        if (this.drawCall.length > 0)
            this.drawCall = []; // clear drawCalls

		var mat = null;
		var dc = null;
		var count = 0;
        for (var i in this.widgets) {
            var w = this.widgets[i];
			if (!w.isVisible() || !w.hasVertices()) {
                w.drawCall = null;
                continue;
            }
            var mt = w.material;
            if (mat != mt) {
                if (dc != null && dc.verts.length != 0) {
                    this.drawCalls.push(dc);
                    dc.UpdateGeometry(count);
                    count = 0;
                    dc = null;
                }
                mat = mt;
            }

            if (mat != null) {
                if (dc == null) {
                    dc = new NGUI.UIDrawCall("", this, mat);
                    dc.depthStart = w.mDepth;
                    dc.depthEnd = dc.depthStart;
                    dc.panel = this;
                }
                else {
                    var rd = w.depth;
                    if (rd < dc.depthStart) dc.depthStart = rd;
                    if (rd > dc.depthEnd) dc.depthEnd = rd;
                }
                w.drawCall = dc;

                ++count;
                w.WriteToBuffers(dc.verts, dc.uvs, dc.cols);
            }
        }
    },
});

//
// "E:\Projects\H5\NGUI.js\src\gui\ui\UISprite.js"
//

NGUI.UISprite = function() {
    NGUI.UIBasicSprite.call();
    this.mAtlas = null;
    this.mSpriteName = '';
    this.mSprite = null; // refrence to UISpriteData
};

Object.assign(NGUI.UISprite.prototype, NGUI.UIBasicSprite.prototype, {
    constructor: NGUI.UISprite,
    get material() { return this.mAtlas ? this.mAtlas.material : null; },
    border: function() {
        var sp = this.GetAtlasSprite();
        if (sp) return new THREE.Vector4(sp.borderLeft, sp.borderBottom, sp.borderRight, sp.borderTop);
        return new THREE.Vector4(0, 0, 0, 0); 
    },
    GetAtlasSprite: function() {
        if (this.mAtlas && !this.mSprite) 
            this.mSprite = this.mAtlas.GetSprite(this.mSpriteName);
        return this.mSprite;
    },
    Load: function(json) {
        // this.mAtlas, find atlas...
    },
    OnFill: function(verts, uvs, cols) {
		var tex = this.mAtlas ? this.mAtlas.material.map : null;
        if (!tex || !tex.image) return;

        var sprite = this.GetAtlasSprite();
		var outer = new NGUI.Rect(sprite.x, sprite.y, sprite.width, sprite.height);
		var inner = new NGUI.Rect(sprite.x + sprite.borderLeft, sprite.y + sprite.borderTop,
            sprite.width - sprite.borderLeft - sprite.borderRight,
            sprite.height - sprite.borderBottom - sprite.borderTop);

		outer = NGUIMath.ConvertToTexCoords(outer, tex.image.width, tex.image.height);
		inner = NGUIMath.ConvertToTexCoords(inner, tex.image.width, tex.image.height);
        this.Fill(verts, uvs, cols, outer, inner);
    },
});


//
// "E:\Projects\H5\NGUI.js\src\gui\ui\UISpriteData.js"
//

NGUI.UISpriteData = function() {
	this.name = "Sprite";
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;

	this.borderLeft = 0;
	this.borderRight = 0;
	this.borderTop = 0;
	this.borderBottom = 0;

	this.paddingLeft = 0;
	this.paddingRight = 0;
	this.paddingTop = 0;
	this.paddingBottom = 0;
};

NGUI.UISpriteData.prototype = {
    constructor: NGUI.UISpriteData,
    Load: function(json) {
        Object.assign(this, json);
        return this;
    },
};