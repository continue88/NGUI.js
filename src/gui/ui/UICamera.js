
NGUI.UICamera = function(gameObject) {
	UnityEngine.MonoBehaviour.call(this, gameObject);
    this.camera = undefined;
};

NGUI.UICamera.current = undefined;

Object.assign(NGUI.UICamera.prototype, UnityEngine.MonoBehaviour.prototype, {
	constructor: NGUI.UICamera,
    Load: function(json) {
        UnityEngine.MonoBehaviour.prototype.Load.call(this, json);
        this.camera = this.gameObject.GetComponent('Camera');
        if (this.camera !== undefined) {
            var uiRoot = NGUITools.FindInParents(this.gameObject, 'UIRoot');
            if (uiRoot !== undefined) uiRoot.camera = this.camera;
        }
        NGUI.UICamera.current = this;
    },
});