
UnityEngine.Transform = function() {
    this.position = new UnityEngine.Vector3();
    this.rotation = new UnityEngine.Quaternion();
    this.lossyScale = new UnityEngine.Vector3();

    this.localPosition = new UnityEngine.Vector3();
    this.localRotation = new UnityEngine.Quaternion();
    this.localScale = new UnityEngine.Vector3();

    this.worldToLocalMatrix = new UnityEngine.Matrix4();
    this.localToWorldMatrix = new UnityEngine.Matrix4();
    this.parent = null; // UnityEngine.Transform
};

UnityEngine.Transform.prototype = {
    constructor: UnityEngine.Transform,
    TransformPoint: function(pos) {
        return pos;
    },
};