
UnityEngine.Mesh = function() {
	this.vertices = undefined;
	this.uv = undefined;
	this.colors = undefined;
	this.colors32 = undefined;

	this.triangles = undefined;
	this.normals = undefined;
	this.tangents = undefined;

	this.vertexCount = 0;
	this.triangleCount = 0;
	this.attributes = {};
};

function CopyVector3sArray(vectors) {
	var offset = 0;
	var array = new Float32Array(vectors.length * 3);
	for (var i in vectors) {
		var vector = vectors[i];
		array[offset++] = vector.x;
		array[offset++] = vector.y;
		array[offset++] = vector.z;
	}
	return array;
}
function CopyVector4sArray(vectors) {
	var offset = 0;
	var array = new Float32Array(vectors.length * 4);
	for (var i in vectors) {
		var vector = vectors[i];
		array[offset++] = vector.x;
		array[offset++] = vector.y;
		array[offset++] = vector.z;
		array[offset++] = vector.w;
	}
	return array;
}
function CopyVector2sArray(uvs) {
	var offset = 0;
	var array = new Float32Array(uvs.length * 2);
	for (var i in uvs) {
		var vector = uvs[i];
		array[offset++] = vector.x;
		array[offset++] = vector.y;
	}
	return array;
}
function CopyColorsArray(colors) {
	var offset = 0;
	var array = new Float32Array(vectors.length * 4);
	for (var i in colors) {
		var color = colors[i];
		array[offset++] = color.r;
		array[offset++] = color.g;
		array[offset++] = color.b;
		array[offset++] = color.a;
	}
	return array;
}
function CopyColors32Array(colors32) {
	var offset = 0;
	var array = new Uint8ClampedArray(colors32.length * 4);
	for (var i in colors32) {
		var color32 = colors32[i];
		array[offset++] = color32.r;
		array[offset++] = color32.g;
		array[offset++] = color32.b;
		array[offset++] = color32.a;
	}
	return array;
}

UnityEngine.Mesh.prototype = {
	constructor: UnityEngine.Mesh,
	destroy: function() {
		for (var i in this.attributes) {
			var attrib = this.attributes[i];
			// TODO: destroy attrib.glBuffer
			WebGL.gl.deleteBuffer(attrib.glBuffer);
		}
	},
	hasIndexBuffer: function() { return this.attributes.index !== undefined; },
	UpdateBuffer: function(gl, name, dataArray, bufferType, dynamic, size, type, normalized, stride, offset) {
		var attrib = this.attributes[name];
		if (attrib === undefined) {
			this.attributes[name] = attrib = {
				glBuffer: gl.createBuffer(),
				usage: dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW,
				size: size,
				type: type,
				normalized: normalized,
				stride: stride,
				offset: offset,
			};
			gl.bindBuffer(bufferType, attrib.glBuffer);
			gl.bufferData(bufferType, dataArray, attrib.usage);
		} else {
			gl.bindBuffer(bufferType, attrib.glBuffer);
			gl.bufferSubData(bufferType, 0, dataArray);
		}
	},
	UpdateBuffers: function(gl) {
		if (this.vertices === undefined) return; // skip update.
		if (this.vertices !== undefined) this.UpdateBuffer(gl, 'position', this.vertices, gl.ARRAY_BUFFER, true, 3, gl.FLOAT, false, 3 * 4, 0);
		if (this.uv !== undefined) this.UpdateBuffer(gl, 'uv', this.uv, gl.ARRAY_BUFFER, true, 2, gl.FLOAT, false, 2 * 4, 0);
		if (this.colors !== undefined) this.UpdateBuffer(gl, 'color', this.colors, gl.ARRAY_BUFFER, true, 4, gl.FLOAT, false, 4 * 4, 0);
		if (this.colors32 !== undefined) this.UpdateBuffer(gl, 'color', this.colors32, gl.ARRAY_BUFFER, true, 4, gl.UNSIGNED_BYTE, true, 4 * 1, 0);
		if (this.triangles !== undefined) this.UpdateBuffer(gl, 'index', this.triangles, gl.ELEMENT_ARRAY_BUFFER, false, 1, gl.UNSIGNED_SHORT, false, 1 * 2, 0);
		this.vertices = undefined;
		this.uv = undefined;
		this.colors = undefined;
		this.colors32 = undefined;
	},
	CopyVertexData: function(verts, uvs, colors32, triangles) {
		this.vertexCount = verts.Length;
		this.triangleCount = (triangles !== undefined) ? triangles.length / 3 : verts.Length / 3;
		this.vertices = verts.ToArray();//CopyVector3sArray(verts);
		this.uv = uvs.ToArray();//CopyVector2sArray(uvs);
		this.colors32 = colors32.ToArray();//CopyColors32Array(colors32);
		this.triangles = triangles;
	},
	SetupVertexAttrib: function(gl, vertexAttrib, programAttrib) {
		gl.enableVertexAttribArray( programAttrib ); // TODO: check do we need enable again???
		gl.bindBuffer( gl.ARRAY_BUFFER, vertexAttrib.glBuffer );
		gl.vertexAttribPointer( programAttrib,
			vertexAttrib.size, 
			vertexAttrib.type, 
			vertexAttrib.normalized, 
			vertexAttrib.stride,
			vertexAttrib.offset);
		//var error = gl.getError();
		//if (error != gl.NO_ERROR)	console.error(vertexAttrib);
	},
	SetupVertexAttribs: function(gl, programAttributes) {
		if (this.vertices !== undefined) this.UpdateBuffers(gl);
		this.SetupVertexAttrib(gl, this.attributes.position, programAttributes.position);
		this.SetupVertexAttrib(gl, this.attributes.uv, programAttributes.uv);
		this.SetupVertexAttrib(gl, this.attributes.color, programAttributes.color);
		if (this.attributes.index !== undefined) // setup index buffer.
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.attributes.index.glBuffer);
	},
}