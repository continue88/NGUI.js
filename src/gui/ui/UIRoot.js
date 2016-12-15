
NGUI.UIRoot = function(gameObject) {
	UnityEngine.MonoBehaviour.call(this, gameObject);
	this.camera = undefined;
	this.drawCalls = [];
};

Object.assign(NGUI.UIRoot.prototype, UnityEngine.MonoBehaviour.prototype, {
	constructor: NGUI.UIRoot,
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