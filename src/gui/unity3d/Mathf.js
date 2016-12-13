
Mathf = UnityEngine.Mathf = {
	Deg2Rad: 0.0174532924,
	Rad2Deg: 57.29578,
	FloorToInt: function(v) { return Math.floor(v); },
	Lerp: function(t, a, b) {
		return a + t * (b - a);
	},
	Clamp: function(val, min, max) {
		return Math.min(Math.max(min, val), max);
	},
	Clamp01: function(val) {
		return Math.min(Math.max(0, val), 1);
	}
}