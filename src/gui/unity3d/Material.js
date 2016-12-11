
UnityEngine.Material = function() {
	this.shader = null; // UnityEngine.Shader
};

UnityEngine.Material.prototype = {
	constructor: UnityEngine.Material,
	Load: function(json) {
	},
	setValue: function(name, value) { this.shader.cachedUniforms.setValue(name, value); },
	//SetColor: function(name, color) { this.setValue(name, color); },
	//SetColorArray: function(name, colorArray) { this.setValue(name, colorArray); },
	//SetFloat: function(name, value) { this.setValue(name, value); },
	//SetFloatArray: function(name, valueArray) { this.setValue(name, valueArray); },
	//SetVector: function(name, vector) { this.setValue(name, vector); },
	//SetVectorArray: function(name, vectorArray) { this.setValue(name, vectorArray); },
	//SetMatrix: function(name, matrix) { this.setValue(name, matrix); },
	//SetMatrixArray: function(name, matrixArray) { this.setValue(name, matrixArray); },
	//SetTexture: function(name, texture) { this.setValue(name, texture); },
};