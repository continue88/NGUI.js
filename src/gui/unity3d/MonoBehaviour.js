

UnityEngine.MonoBehaviour = function(gameObject) {
    UnityEngine.Component.call(gameObject);
    this.enabled = true;
};

Object.assign(UnityEngine.MonoBehaviour.prototype, UnityEngine.Component.prototype, {
    constructor: UnityEngine.MonoBehaviour,
});