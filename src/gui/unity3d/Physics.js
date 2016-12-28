
UnityEngine.Physics = {
    Colliders: [],
    Add: function(collider) {
        this.Colliders.push(collider);
    },
    Remove: function(collider) {
        var index = this.Colliders.indexOf(collider);
        if (index >= 0) this.Colliders.splice(index, 1);
    },
    RaycastAll: function(ray, distance, layerMask) {
        var ret = [];
        for (var i in this.Colliders) {
            var collider = this.Colliders[i];
            if (collider.RayTest(ray, distance)) ret.push(collider);
        }
        return ret;
    },
};