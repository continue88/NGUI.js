
NGUI.UICamera = function(gameObject) {
	UnityEngine.MonoBehaviour.call(this, gameObject);
};

Object.assign(NGUI.UICamera.prototype, UnityEngine.MonoBehaviour.prototype, {
	constructor: NGUI.UICamera,
    Load: function(json) {
        // load json.
    },
});