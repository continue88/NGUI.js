
UnityEngine.Material = function() {
	this.shader = undefined; // UnityEngine.Shader
};

UnityEngine.Material.prototype = {
	constructor: UnityEngine.Material,
	Load: function(json) {
	},
	setValue: function(name, value) { this.shader.cachedUniforms.setValue(name, value); },
};