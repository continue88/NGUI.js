
NGUI.UIButton = function(gameObject) {
	UnityEngine.MonoBehaviour.call(this, gameObject);

    this.tweenTarget = gameObject; // gameObject
    this.duration = 0.2;
    this.defaultColor = UnityEngine.Color.white.clone();
    this.hover = new UnityEngine.Color(225/255,200/255,150/255,1);
    this.pressed = new UnityEngine.Color(183/255,163/255,123/255,1);
    this.disabledColor = UnityEngine.Color.grey.clone();
    this.normalSprite = "";
    this.hoverSprite = "";
    this.pressedSprite = "";
    this.disabledSprite = "";
    this.isEnabled = true;

    this.mInitDone = false;
    this.mState = NGUI.UIButton.State.Normal;
    this.mWidget = undefined;
    this.mSprite = undefined;
}

NGUI.UIButton.State = {
    Normal: 0,
    Hover: 1,
    Pressed: 2,
    Disabled: 3,
};

Object.extend(NGUI.UIButton.prototype = Object.create(UnityEngine.MonoBehaviour.prototype), {
	constructor: NGUI.UIButton,
    Load: function(json) {
        UnityEngine.MonoBehaviour.prototype.Load.call(this, json);
        if (json.cn) this.defaultColor.set32(json.cn.r || 255, json.cn.g || 255, json.cn.b || 255, json.cn.a || 255);
        if (json.ch) this.hover.set32(json.ch.r || 225, json.ch.g || 200, json.ch.b || 150, json.ch.a || 255);
        if (json.cp) this.pressed.set32(json.cp.r || 183, json.cp.g || 163, json.cp.b || 123, json.cp.a || 255);
        if (json.cd) this.disabledColor.set32(json.cd.r || 128, json.cd.g || 128, json.cd.b || 128, json.cd.a || 255);
        if (json.sn) this.normalSprite = json.sn;
        if (json.sh) this.hoverSprite = json.sh;
        if (json.sp) this.pressedSprite = json.sp;
        if (json.sd) this.disabledSprite = json.sd;
    },
    OnInit: function() {
        this.mInitDone = true;
        if (!this.tweenTarget) this.tweenTarget = this.gameObject;
        this.mWidget = this.tweenTarget.GetComponent('UIWidget');
        this.mSprite = this.tweenTarget.GetComponent('UISprite');
        if (this.mWidget) this.defaultColor = this.mWidget.getColor();
        this.mStartingColor = this.defaultColor.clone();
    },
    OnHover: function(isOver) {
        if (!this.isEnabled) return;
        if (!this.mInitDone) this.OnInit();
        if (this.tweenTarget) this.SetState(isOver ? NGUI.UIButton.State.Hover : NGUI.UIButton.State.Normal, false);
    },
    OnClick: function() {
        // SendMessages????
    },
    SetState: function(state, instant) {
		if (!this.mInitDone) {
			this.mInitDone = true;
			this.OnInit();
		}
		if (this.mState != state) {
			this.mState = state;
			this.UpdateColor(instant);
		}
	},
    SetSprite: function(spriteName) {
		if (spriteName && this.mSprite && this.mSprite.spriteName != spriteName) {
			this.mSprite.spriteName = spriteName;
		}
    },
    UpdateColor: function(instant) {
        var tweenTarget = this.tweenTarget;
        if (tweenTarget === undefined) return;
        var State = NGUI.UIButton.State, tc;
        var TweenColor = NGUI.TweenColor;
		switch (this.mState) {
			case State.Hover: 
                tc = TweenColor.Begin(tweenTarget, this.duration, this.hover);
                this.SetSprite(this.hoverSprite); 
                break;
			case State.Pressed: 
                tc = TweenColor.Begin(tweenTarget, this.duration, this.pressed); 
                this.SetSprite(this.pressedSprite); 
                break;
			case State.Disabled:
                tc = TweenColor.Begin(tweenTarget, this.duration, this.disabledColor); 
                this.SetSprite(this.disabledSprite); 
                break;
			default: 
                tc = TweenColor.Begin(tweenTarget, this.duration, this.defaultColor); 
                this.SetSprite(this.normalSprite); 
                break;
		}
		if (instant && tc != null) {
			tc.value = tc.to;
			tc.enabled = false;
		}
	},
});
