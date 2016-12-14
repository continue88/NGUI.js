

UnityEngine.MonoBehaviour = function(gameObject) {
	UnityEngine.Component.call(this, gameObject);
	this.enabled = true;
};

Object.assign(UnityEngine.MonoBehaviour.prototype, UnityEngine.Component.prototype, {
	constructor: UnityEngine.MonoBehaviour,
});