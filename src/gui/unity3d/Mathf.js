
Mathf = UnityEngine.Mathf = {
	FloorToInt: function(v) { return Math.floor(v); },
	Lerp: function(t, a, b) {
		return a + t * (b - a);
	},
	Clamp01: function(val) {
		return Math.min(Math.max(0, val), 1);
	}
}