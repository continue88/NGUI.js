
UnityEngine.Ray = function() {
    this.direction = new UnityEngine.Vector3();
    this.origin = new UnityEngine.Vector3();
};

UnityEngine.Ray.prototype = {
    constructor: UnityEngine.Ray,
    GetPoint: function(distance) {
        return new UnityEngine.Vector3(
            this.origin.x + this.direction.x * distance,
            this.origin.y + this.direction.y * distance,
            this.origin.z + this.direction.z * distance);
    },
};