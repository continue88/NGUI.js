
UnityEngine.Mathf = {
	lerp: function(t, a, b) {
		return a + t * (b - a);
	},
	Clamp01: function(val) {
		return Math.min(Math.max(0, val), 1);
	}
}