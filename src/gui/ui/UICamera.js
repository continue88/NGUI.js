
NGUI.UICamera = function(gameObject) {
	UnityEngine.MonoBehaviour.call(this, gameObject);
    this.camera = undefined;
};

NGUI.UICamera.current = undefined;

Object.assign(NGUI.UICamera.prototype = Object.create(UnityEngine.MonoBehaviour.prototype), {
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
    Update: function() {
        // Test hit...
        ProcessMouse();
    },
    ProcessMouse: function() {
        
    },
    Raycast: function(inPos) {
        var currentCamera = this.camera;
        var dist = currentCamera.farClipPlane - currentCamera.nearClipPlane;
        var ray = currentCamera.ScreenPointToRay(inPos);
        var hits = UnityEngine.Physics.RaycastAll(ray, dist, mask);
        if (hits.length > 1) {
            for (var i in hits) {
                var go = hits[i].gameObject;
                var w = go.GetComponent("UIWidget");
                if (w !== undefined && w.isVisible() !== true)
                    continue;
                var depth = NGUITools.CalculateRaycastDepth(go);
                if (depth !== undefined) {
                    
                }
            }
        } else if (hits.length == 1) {
        } else {
        }
    },
});