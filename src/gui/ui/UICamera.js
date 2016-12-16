
NGUI.UICamera = function(gameObject) {
	NGUI.MonoBehaviour.call(this, gameObject);
};

Object.assign(NGUI.UICamera.prototype, NGUI.MonoBehaviour.prototype, {
	constructor: NGUI.UICamera,
    Load: function(json) {
        // load json.
    },
});