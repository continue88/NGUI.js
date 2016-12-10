
NGUI.UIRect = function(gameObject) {
    UnityEngine.MonoBehaviour.call(gameObject);

    this.finalAlpha = 1;
};

Object.assign(NGUI.UIRect.prototype, UnityEngine.MonoBehaviour.prototype, {
    constructor: NGUI.UIRect,
});