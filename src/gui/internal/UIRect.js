
NGUI.UIRect = function() {
    this.finalAlpha = 1;
    this.transform = null; // UnityEngine.Transform
    this.gameObject = null; // UnityEngine.GameObject
    this.enabled = true;
};

NGUI.UIRect.prototype = {
    constructor: NGUI.UIRect,
    copy: function(source) {
        return this;
    },
};