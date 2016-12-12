
UnityEngine.Mesh = function() {
    this.vertices = undefined;
    this.uv = undefined;
    this.colors = undefined;
    this.colors32 = undefined;

    this.triangles = undefined;
    this.normals = undefined;
    this.tangents = undefined;

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
function CopyVector2sArray(uv) {
    var offset = 0;
    var array = new Float32Array(vectors.length * 2);
    for (var i in vectors) {
        var vector = vectors[i];
        array[offset++] = vector.x;
        array[offset++] = vector.y;
    }
    return array;
}
function CopyColorsArray(colors) {
    var offset = 0;
    var array = new Float32Array(vectors.length * 3);
    for (var i in colors) {
        var color = colors[i];
        array[offset++] = color.r;
        array[offset++] = color.g;
        array[offset++] = color.b;
    }
    return array;
}
function CopyColors32Array(colors32) {
    var offset = 0;
    var array = new Uint32Array(vectors.length);
    for (var i in colors32) array[offset++] = colors32[i];
    return array;
}

UnityEngine.Mesh.prototype = {
    constructor: UnityEngine.Mesh,
    UpdateBuffer: function(gl, name, dataArray, bufferType, dynamic) {
        var attrib = this.attributes[name];
        if (attrib === undefined) {
            this.attributes[name] = attrib = {
                glBuffer: gl.createBuffer(),
                usage: dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW,
            };
            gl.bindBuffer(bufferType, attrib.glBuffer);
            gl.bufferData(bufferType, dataArray, attrib.usage);
        } else {
            gl.bindBuffer(bufferType, attrib.glBuffer);
            gl.bufferSubData(bufferType, 0, dataArray);
        }
    },
    UpdateBuffers: function(gl) {
        if (this.vertices !== undefined) this.UpdateBuffer(gl, 'position', CopyVector3sArray(this.vertices), gl.ARRAY_BUFFER, true);
        if (this.uv !== undefined) this.UpdateBuffer(gl, 'uv', CopyVector2sArray(this.uv), gl.ARRAY_BUFFER, true);
        if (this.colors !== undefined) this.UpdateBuffer(gl, 'color', CopyColorsArray(this.colors), gl.ARRAY_BUFFER, true);
        if (this.colors32 !== undefined) this.UpdateBuffer(gl, 'color', CopyColors32Array(this.colors32), gl.ARRAY_BUFFER, true);
    },
}