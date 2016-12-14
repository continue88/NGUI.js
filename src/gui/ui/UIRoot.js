
NGUI.UIRoot = function(gameObject) {
	UnityEngine.MonoBehaviour.call(this, gameObject);
	
};

Object.assign(NGUI.UIRoot.prototype, UnityEngine.MonoBehaviour.prototype, {
	constructor: NGUI.UIRoot,
	Load: function(json) {

	},
});