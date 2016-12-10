
UnityEngine.Transform = function(gameObject) {
    UnityEngine.Component.call(gameObject);

    this.position = new UnityEngine.Vector3(0, 0, 0);
    this.rotation = new UnityEngine.Quaternion();
    this.lossyScale = new UnityEngine.Vector3(1, 1, 1);

    this.localPosition = new UnityEngine.Vector3(0, 0, 0);
    this.localRotation = new UnityEngine.Quaternion();
    this.localScale = new UnityEngine.Vector3(1, 1, 1);

    this.worldToLocalMatrix = new UnityEngine.Matrix4();
    this.localToWorldMatrix = new UnityEngine.Matrix4();
    this.parent = null; // UnityEngine.Transform
    this.children = [];
    
};

Object.assign(UnityEngine.Transform.prototype, UnityEngine.Component.prototype, {
    constructor: UnityEngine.Transform,
    Load: function(json) {
        if (json.t) this.localPosition.set(json.t.x, json.t.y, json.t.z);
        if (json.r) this.localRotation.euler(json.r.x, json.r.y, json.r.z);
        if (json.s) this.localScale.set(json.s.x, json.s.y, json.s.z);
    },
    TransformPoint: function(pos) {
        return pos;
    },
});