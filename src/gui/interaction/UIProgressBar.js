

NGUI.UIProgressBar = function(gameObject) {
	UnityEngine.MonoBehaviour.call(this, gameObject);

    this.mValue = 0;
    this.mIsDirty = false;
    this.mFG = undefined;

    this.alpha = 1;
    this.numberOfSteps = 0;
    this.foregroundWidget = undefined;
    this.backgroundWidget = undefined;
    this.thumb = undefined;
    this.fillDirection = UIProgressBarFillDirection.LeftToRight;
}

UIProgressBarFillDirection = {
    LeftToRight: 0,
    RightToLeft: 1,
    BottomToTop: 2,
    TopToBottom: 3,
};

Object.extend(NGUI.UIProgressBar.prototype = Object.create(UnityEngine.MonoBehaviour.prototype), {
	constructor: NGUI.UIProgressBar,
    get value() {
        if (this.numberOfSteps > 1) return Mathf.Round(this.mValue * (this.numberOfSteps - 1)) / (this.numberOfSteps - 1);
        return this.mValue; 
    },
    set value(v) {
        var val = Mathf.Clamp01(v);
        if (this.mValue !== val) {
            var before = this.value;
            this.mValue = val;
            if (before !== this.value)
                this.ForceUpdate();
        }
    },
    get isHorizontal() { return (this.mFill === UIProgressBarFillDirection.LeftToRight || this.mFill === UIProgressBarFillDirection.RightToLeft); },
    get isInverted() { return (this.mFill === UIProgressBarFillDirection.RightToLeft || this.mFill === UIProgressBarFillDirection.TopToBottom); },
    Load: function(json) {
    },
    Start: function() {
    },
    ForceUpdate: function() {
		this.mIsDirty = false;
		if (this.mFG !== undefined) {
			var sprite = this.mFG;
            var value = this.value;
			if (this.isHorizontal) {
				if (sprite !== undefined && sprite.type === SpriteType.Filled) {
					if (sprite.fillDirection === FillDirection.Horizontal || sprite.fillDirection === FillDirection.Vertical) {
						sprite.fillDirection = FillDirection.Horizontal;
						sprite.invert = this.isInverted;
					}
					sprite.fillAmount = value;
				} else {
					this.mFG.drawRegion = this.isInverted ?
						new UnityEngine.Vector4(1 - value, 0, 1, 1) :
						new UnityEngine.Vector4(0, 0, value, 1);
					this.mFG.enabled = value > 0.001;
				}
			} else if (sprite !== undefined && sprite.type === FillDirection.Filled) {
				if (sprite.fillDirection === FillDirection.Horizontal || sprite.fillDirection === FillDirection.Vertical) {
					sprite.fillDirection = FillDirection.Vertical;
					sprite.invert = this.isInverted;
				}
				sprite.fillAmount = value;
			} else {
				this.mFG.drawRegion = this.isInverted ?
					new UnityEngine.Vector4(0, 1 - value, 1, 1) :
					new UnityEngine.Vector4(0, 0, 1, value);
				this.mFG.enabled = value > 0.001;
			}
		}

		if (this.thumb && (this.mFG || this.mBG)) {
			var corners = (this.mFG !== undefined) ? this.mFG.localCorners.clone() : this.mBG.localCorners.clone();
			var br = (this.mFG !== undefined) ? this.mFG.border : this.mBG.border;
			corners[0].x += br.x;
			corners[1].x += br.x;
			corners[2].x -= br.z;
			corners[3].x -= br.z;
			corners[0].y += br.y;
			corners[1].y -= br.w;
			corners[2].y -= br.w;
			corners[3].y += br.y;
			var t = (this.mFG !== undefined) ? this.mFG.transform : this.mBG.transform;
            var localToWorld = t.localToWorldMatrix;
			for (var i = 0; i < 4; ++i) corners[i].ApplayTransform(localToWorld);// = t.TransformPoint(corners[i]);
			if (this.isHorizontal) {
				var v0 = UnityEngine.Vector3.Lerp(corners[0], corners[1], 0.5);
				var v1 = UnityEngine.Vector3.Lerp(corners[2], corners[3], 0.5);
				this.SetThumbPosition(UnityEngine.Vector3.Lerp(v0, v1, this.isInverted ? 1 - value : value));
			} else {
				var v0 = UnityEngine.Vector3.Lerp(corners[0], corners[3], 0.5);
				var v1 = UnityEngine.Vector3.Lerp(corners[1], corners[2], 0.5);
				this.SetThumbPosition(UnityEngine.Vector3.Lerp(v0, v1, this.isInverted ? 1 - value : value));
			}
		}
    },
    SetThumbPosition: function(worldPos) {
		var t = this.thumb.parent;
		if (t !== undefined) {
			worldPos.ApplayTransform(t.worldToLocalMatrix);
			worldPos.x = Mathf.Round(worldPos.x);
			worldPos.y = Mathf.Round(worldPos.y);
			worldPos.z = 0;
			if (UnityEngine.Vector3.Distance(thumb.localPosition, worldPos) > 0.001)
				thumb.localPosition = worldPos;
		} else if (UnityEngine.Vector3.Distance(thumb.position, worldPos) > 0.00001)
			thumb.position = worldPos;
    },
});