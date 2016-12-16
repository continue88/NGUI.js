
NGUI.UICamera = function(gameObject) {
	UnityEngine.MonoBehaviour.call(this, gameObject);
};

Object.assign(NGUI.UICamera.prototype, UnityEngine.MonoBehaviour.prototype, {
	constructor: NGUI.UICamera,
    Load: function(json) {
        var uiRoot = NGUITools.FindInParents(this.gameObject, 'UIRoot');
        if (uiRoot !== undefined) uiRoot.camera = this;
    },
});