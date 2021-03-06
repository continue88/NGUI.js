
Mathf = UnityEngine.Mathf = {
	Deg2Rad: 0.0174532924,
	Rad2Deg: 57.29578,
	FloorToInt: function(v) { return Math.floor(v); },
	RoundToInt: function(v) { return Math.floor(v + 0.5); },
	Round: function(v) { return Math.floor(v + 0.5); },
	Lerp: function(a, b, t) {
		return a + t * (b - a);
	},
	Clamp: function(val, min, max) {
		return Math.min(Math.max(min, val), max);
	},
	Clamp01: function(val) {
		return Math.min(Math.max(0, val), 1);
	}
}