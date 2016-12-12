
GUIRenderer = function (params) {
};

GUIRenderer.prototype = {
	renderSingleObject: function(gl, mesh, material) {
		var shader = material.shader;
		var meshAttributes = mesh.attributes;
		var shaderAttributes = shader.getAttributes();
		for (var name in shaderAttributes) {
			var shaderAttribute = shaderAttributes[name];
			if (shaderAttribute > 0) {
				var meshAttribute = meshAttributes[name];
				if (meshAttribute !== undefined) {
					var type = gl.FLOAT;
					var array = meshAttribute.array;
					var normalized = geometryAttribute.normalized;
					gl.bindBuffer(gl.ARRAY_BUFFER, buffer );
					gl.vertexAttribPointer(shaderAttribute, size, type, normalized, 0, startIndex * size * array.BYTES_PER_ELEMENT );
				}
			} else {

			}
		}
	},
	renderObjects: function() {
	},
	render: function() {
	},
};