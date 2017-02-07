
UnityEngine.BoxCollider = function(gameObject) {
    UnityEngine.Collider.call(this, gameObject);
    this.center = new UnityEngine.Vector3(0, 0, 0);
    this.size = new UnityEngine.Vector3(0, 0, 0);
};

Object.extend(UnityEngine.BoxCollider.prototype = Object.create(UnityEngine.Collider.prototype), {
	constructor: UnityEngine.BoxCollider,
	Load: function(json) {
		UnityEngine.Collider.prototype.Load.call(this, json);
        if (json.c !== undefined) this.center.set(json.c.x || 0, json.c.y || 0, json.c.z || 0);
        if (json.s !== undefined) this.size.set(json.s.x || 0, json.s.y || 0, json.s.z || 0);
	},
    RayTest: function(ray, distance) {
        return this.Raycast(ray, undefined, distance);
    },
    Raycast: function(ray, hitInfo, distance) {
        var max = 100000;
        var min = -max;
        var p = this.transform.TransformPoint(this.center).sub(ray.origin);
        var h = this.size.clone().multiply(this.transform.lossyScale).multiplyScalar(0.5);
        var dirMax = 0;
        var dirMin = 0;
        var dir = 0;
        var matrixVec = [
            this.transform.TransformDirection(UnityEngine.Vector3.right),
            this.transform.TransformDirection(UnityEngine.Vector3.up),
            this.transform.TransformDirection(UnityEngine.Vector3.forward)];
        var vectorFloat = [h.x, h.y, h.z];
        for (dir = 0; dir < 3; dir++) {
            var e = matrixVec[dir].dot(p);
            var f = matrixVec[dir].dot(ray.direction);
            if (Math.abs(f) > 0.00001) {
                var t1 = (e + vectorFloat[dir]) / f;
                var t2 = (e - vectorFloat[dir]) / f;
                if (t1 > t2) { var tmp = t1;t1 = t2; t2 = tmp; }
                if (t1 > min) { min = t1; dirMin = dir; }
                if (t2 < max) { max = t2; dirMax = dir; }
                if (min > max) return false;
                if (max < 0.0) return false;
            }
            else if((-e-vectorFloat[dir] > 0.0) || (-e + vectorFloat[dir] < 0.0))
                return false;
        }
        if (hitInfo === undefined) return true;

        if (min > 0.0) {
            dir = dirMin;
            fracOut = min;
        } else {
            dir = dirMax;
            fracOut = max;
        }

        hitInfo.fracOut = Mathf.Clamp01(fracOut);
        hitInfo.posOut = ray.GetPoint(fracOut);
        if (matrixVec[dir].dot(ray.direction) > 0)
            hitInfo.normalOut = matrixVec[dir].multiplyScalar(-1);
        else
            hitInfo.normalOut = matrixVec[dir];
        return true;
    },
});
