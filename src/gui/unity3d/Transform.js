
UnityEngine.Transform = function() {
    this.position = new THREE.Vector3();
    this.rotation = new THREE.Quaternion();
    this.lossyScale = new THREE.Vector3();

    this.localPosition = new THREE.Vector3();
    this.localRotation = new THREE.Quaternion();
    this.localScale = new THREE.Vector3();

    this.worldToLocalMatrix = new THREE.Matrix4();
    this.localToWorldMatrix = new THREE.Matrix4();
    this.parent = null; // UnityEngine.Transform
};

UnityEngine.Transform.prototype = {
    constructor: UnityEngine.Transform,
    TransformPoint: function(pos) {
        return pos;
    },
};