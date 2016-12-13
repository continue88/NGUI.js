
UnityEngine.Quaternion = function ( x, y, z, w ) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = w || 1;
};

UnityEngine.Quaternion.prototype = {
	constructor: UnityEngine.Quaternion,
	set: function(x, y, z, w) { this.x = x; this.y = y; this.z = z; this.w = w; },
	euler: function(x, y, z) {
		var c1 = Math.cos( x * 0.5 );
		var c2 = Math.cos( y * 0.5 );
		var c3 = Math.cos( z * 0.5 );
		var s1 = Math.sin( x * 0.5 );
		var s2 = Math.sin( y * 0.5 );
		var s3 = Math.sin( z * 0.5 );
		this.x = s1 * c2 * c3 + c1 * s2 * s3;
		this.y = c1 * s2 * c3 - s1 * c2 * s3;
		this.z = c1 * c2 * s3 + s1 * s2 * c3;
		this.w = c1 * c2 * c3 - s1 * s2 * s3;
	},
	eulerAngles: function() {
		return new UnityEngine.Vector3();
	},
	multiply: function(a, b) {
		var qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
		var qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;
		this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
		return this;
	},
};