

NGUI.UIToggle = function(gameObject) {
	UnityEngine.MonoBehaviour.call(this, gameObject);

    this.group = 0;
    this.activeSpriteId = 0;
    this.startsActive = false;
    this.instantTween = false;
    this.optionCanBeNone = false;
    this.activeSprite = undefined;
    this.activeAnimation = undefined;

    this.mIsActive = false;
    this.mStarted = false;
    
	NGUI.UIToggle.list.push(this);
}

NGUI.UIToggle.list = [];
NGUI.UIToggle.current = undefined;

Object.extend(NGUI.UIToggle.prototype = Object.create(UnityEngine.MonoBehaviour.prototype), {
	constructor: NGUI.UIToggle,
    getValue: function() { return this.mStarted ? this.mIsActive : this.startsActive; },
    setvalue: function(v) {
        if (!this.mStarted) this.startsActive = v;
        else if (this.group == 0 || v || this.optionCanBeNone || !this.mStarted) this.Set(v);
    },
    Load: function(json) {
        UnityEngine.MonoBehaviour.prototype.Load.call(this, json);
        this.group = json.g || 0;
        this.activeSpriteId = json.as || 0;
        this.startsActive = json.sa || false;
        this.instantTween = json.it || false;
        this.optionCanBeNone = json.cn || false;
    },
    Start: function() {
        if (this.activeSpriteId)
            this.activeSprite = UnityEngine.Object.FindObjectWithId(this.activeSpriteId);
        if (this.startsChecked) {
            this.startsChecked = false;
            this.startsActive = true;
        }
        this.mIsActive = !this.startsActive;
        this.mStarted = true;
        var instant = this.instantTween;
        this.instantTween = true;
        this.Set(this.startsActive);
        this.instantTween = instant;
    },
    OnClick: function() {
        this.setvalue(!this.getValue());
    },
    Set: function(state) {
		if (!this.mStarted) {
			this.mIsActive = state;
			this.startsActive = state;
			if (this.activeSprite !== undefined) this.activeSprite.setAlpha(state ? 1 : 0);
		} else if (this.mIsActive != state) {
			if (this.group !== 0 && state) {
                var list = NGUI.UIToggle.list;
				for (var i = 0, imax = list.length; i < imax; ) {
					var cb = list[i];
					if (cb != this && cb.group == this.group) cb.Set(false);
					if (list.length != imax) {
						imax = list.length;
						i = 0;
					} else ++i;
				}
			}
			this.mIsActive = state;
			if (this.activeSprite !== undefined) {
				if (this.instantTween)
                    this.activeSprite.setAlpha(this.mIsActive ? 1 : 0);
				else
					NGUI.TweenAlpha.Begin(this.activeSprite.gameObject, 0.15, this.mIsActive ? 1 : 0);
			}
		}
    },
});
