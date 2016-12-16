
NGUI.UIRoot = function(gameObject) {
	UnityEngine.MonoBehaviour.call(this, gameObject);
	this.camera = undefined;
	this.drawCalls = [];

	this.manualWidth = 1280;
	this.manualHeight = 1280;
	this.minimumHeight = 320;
	this.maximumHeight = 1536;
	this.shrinkPortraitUI = false;
	this.fitWidth = false;
	this.fitHeight = false;
	this.scalingStyle = NGUI.Scaling.Flexible;
};

NGUI.Scaling = {
	Flexible: 0,
	Constrained: 1,
	ConstrainedOnMobiles: 2,
};

NGUI.Constraint = {
	Fit: 0,
	Fill: 1,
	FitWidth: 2,
	FitHeight: 3,
};

Object.assign(NGUI.UIRoot.prototype, UnityEngine.MonoBehaviour.prototype, {
	constructor: NGUI.UIRoot,
	get constraint() {
		if (this.fitWidth)
			return this.fitHeight ? NGUI.Constraint.Fit : NGUI.Constraint.FitWidth;
		return this.fitHeight ? NGUI.Constraint.FitHeight : NGUI.Constraint.Fill;
	},
	get activeScaling() {
		if (this.scalingStyle === NGUI.Scaling.ConstrainedOnMobiles)
			return NGUI.Scaling.Constrained;
		return this.scalingStyle;
	},
	get activeHeight() {
		var scaling = this.activeScaling;
		if (scaling === NGUI.Scaling.Flexible) {
			var screen = NGUITools.screenSize.clone();
			var aspect = screen.x / screen.y;
			if (screen.y < this.minimumHeight) {
				screen.y = this.minimumHeight;
				screen.x = screen.y * aspect;
			} else if (screen.y > this.maximumHeight) {
				screen.y = this.maximumHeight;
				screen.x = screen.y * aspect;
			}
			var height = Mathf.RoundToInt((this.shrinkPortraitUI && screen.y > screen.x) ? screen.y / aspect : screen.y);
			return height;
		} else {
			var cons = this.constraint;
			if (cons === NGUI.Constraint.FitHeight)
				return this.manualHeight;
			var screen = NGUITools.screenSize.clone();
			var aspect = screen.x / screen.y;
			var initialAspect = this.manualWidth / this.manualHeight;
			switch (cons) {
			case NGUI.Constraint.FitWidth:
				return Mathf.RoundToInt(manualWidth / aspect);
			case NGUI.Constraint.Fit:
				return (initialAspect > aspect) ? Mathf.RoundToInt(this.manualWidth / aspect) : manualHeight;
			case NGUI.Constraint.Fill:
				return (initialAspect < aspect) ? Mathf.RoundToInt(manualWidth / aspect) : manualHeight;
			}
			return manualHeight;
		}
	},
	Update: function() {
		var calcActiveHeight = this.activeHeight;
		var floatEpsilon = 0.00001; 
		if (calcActiveHeight > 0) {
			var size = 2 / calcActiveHeight;
			var ls = this.transform.localScale;
			if (!(Math.abs(ls.x - size) <= floatEpsilon) ||
				!(Math.abs(ls.y - size) <= floatEpsilon) ||
				!(Math.abs(ls.z - size) <= floatEpsilon)) {
				this.transform.localScale.set(size, size, size);
				this.transform.setNeedUpdate(true);
			}
		}
	},
	Load: function(json) {
		// load ...
	},
	GetDrawCalls: function() {
		return this.drawCalls;
	},
	GetCamera: function() {
		return this.camera;
	},
});