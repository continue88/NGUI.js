
UnityEngine.ShaderUniforms = function() {
    // shader value settings.
    setValue1f = function(gl, v) { gl.uniform1f(this.addr, v); };
    setValue2fv = function(gl, v) { if ( v.x === undefined ) gl.uniform2fv(this.addr, v); else gl.uniform2f( this.addr, v.x, v.y ); };
    setValue3fv = function(gl, v) { if ( v.x !== undefined ) gl.uniform3f( this.addr, v.x, v.y, v.z ); else if ( v.r !== undefined ) gl.uniform3f( this.addr, v.r, v.g, v.b ); else gl.uniform3fv(this.addr, v); };
    setValue4fv = function(gl, v) { if ( v.x === undefined ) gl.uniform4fv(this.addr, v); else gl.uniform4f( this.addr, v.x, v.y, v.z, v.w ); };
    setValue2fm = function(gl, v) { gl.uniformMatrix2fv( this.addr, false, v.elements || v ); };
    setValue3fm = function(gl, v) { gl.uniformMatrix3fv( this.addr, false, v.elements || v ); };
    setValue4fm = function(gl, v) { gl.uniformMatrix4fv( this.addr, false, v.elements || v );  };
    setValueT1 = function(gl, v, renderer) {
        var unit = renderer.allocTextureUnit();
        gl.uniform1i(this.addr, unit);
        if (v) renderer.setTexture2D(v, unit);
    };
    setValueT6 = function(gl, v, renderer) { 
        var unit = renderer.allocTextureUnit();
        gl.uniform1i(this.addr, unit);
        if (v) renderer.setTextureCube(v, unit); 
    }; 
    setValue1i = function(gl, v) { gl.uniform1i(this.addr, v); };
    setValue2iv = function(gl, v) { gl.uniform2iv(this.addr, v); };
    setValue3iv = function(gl, v) { gl.uniform3iv(this.addr, v); };
    setValue4iv = function(gl, v) { gl.uniform4iv(this.addr, v); };
    getSingularSetter = function(type) {
        switch (type) {
        case 0x1406: return setValue1f; // FLOAT
        case 0x8b50: return setValue2fv; // _VEC2
        case 0x8b51: return setValue3fv; // _VEC3
        case 0x8b52: return setValue4fv; // _VEC4
        case 0x8b5a: return setValue2fm; // _MAT2
        case 0x8b5b: return setValue3fm; // _MAT3
        case 0x8b5c: return setValue4fm; // _MAT4
        case 0x8b5e: return setValueT1; // SAMPLER_2D
        case 0x8b60: return setValueT6; // SAMPLER_CUBE
        case 0x1404: case 0x8b56: return setValue1i; // INT, BOOL
        case 0x8b53: case 0x8b57: return setValue2iv; // _VEC2
        case 0x8b54: case 0x8b58: return setValue3iv; // _VEC3
        case 0x8b55: case 0x8b59: return setValue4iv; // _VEC4
        }
    };
    setValue1fv = function(gl, v) { gl.uniform1fv( this.addr, v ); },
    setValue1iv = function(gl, v) { gl.uniform1iv( this.addr, v ); },
    setValueV2a = function(gl, v) { gl.uniform2fv( this.addr, flatten( v, this.size, 2 ) ); },
    setValueV3a = function(gl, v) { gl.uniform3fv( this.addr, flatten( v, this.size, 3 ) ); },
    setValueV4a = function(gl, v) { gl.uniform4fv( this.addr, flatten( v, this.size, 4 ) ); },
    setValueM2a = function(gl, v) { gl.uniformMatrix2fv( this.addr, false, flatten( v, this.size, 4 ) ); },
    setValueM3a = function(gl, v) { gl.uniformMatrix3fv( this.addr, false, flatten( v, this.size, 9 ) ); },
    setValueM4a = function(gl, v) { gl.uniformMatrix4fv( this.addr, false, flatten( v, this.size, 16 ) ); },
    setValueT1a = function(gl, v, renderer) {
        gl.uniform1iv(this.addr, units);
        for (var i in v) {
            var tex = v[i];
            if (tex) renderer.setTexture2D(tex, renderer.allocTextureUnit());
        }
    };
    setValueT6a = function(gl, v, renderer) {
        gl.uniform1iv( this.addr, units);
        for (var i in v) {
            var tex = v[i];
            if (tex) renderer.setTextureCube(tex, renderer.allocTextureUnit());
        }
    },
    getPureArraySetter = function(type) {
        switch (type) {
        case 0x1406: return setValue1fv; // FLOAT
        case 0x8b50: return setValueV2a; // _VEC2
        case 0x8b51: return setValueV3a; // _VEC3
        case 0x8b52: return setValueV4a; // _VEC4
        case 0x8b5a: return setValueM2a; // _MAT2
        case 0x8b5b: return setValueM3a; // _MAT3
        case 0x8b5c: return setValueM4a; // _MAT4
        case 0x8b5e: return setValueT1a; // SAMPLER_2D
        case 0x8b60: return setValueT6a; // SAMPLER_CUBE
        case 0x1404: case 0x8b56: return setValue1iv; // INT, BOOL
        case 0x8b53: case 0x8b57: return setValue2iv; // _VEC2
        case 0x8b54: case 0x8b58: return setValue3iv; // _VEC3
        case 0x8b55: case 0x8b59: return setValue4iv; // _VEC4
        }
    };
	SingleUniform = function (id, activeInfo, addr) {
		this.id = id;
		this.addr = addr;
		this.setValue = getSingularSetter(activeInfo.type);
	};
	PureArrayUniform = function(id, activeInfo, addr) {
		this.id = id;
		this.addr = addr;
		this.size = activeInfo.size;
		this.setValue = getPureArraySetter(activeInfo.type);
	};
};