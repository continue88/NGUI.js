// autogen by combine tools.


//
// ..\src\gui\gui.js
//

UnityEngine={

};

NGUI={

};

//
// ..\src\gui\unity3d\Color.js
//

UnityEngine.Color = function ( r, g, b, a ) {
	this.r = r || 0;
	this.g = g || 0;
	this.b = b || 0;
	this.a = a || 0;
};

UnityEngine.Color.prototype = {
	constructor: UnityEngine.Color,
	add: function(v) {
		this.r += v.r;
		this.g += v.g;
		this.b += v.b;
		this.a += v.a;
	},
	sub: function(v) {
		this.r -= v.r;
		this.g -= v.g;
		this.b -= v.b;
		this.a -= v.a;
	},
};

//
// ..\src\gui\unity3d\Component.js
//

UnityEngine.Component = function(gameObject) {
	this.gameObject = gameObject;
	this.transform = gameObject.transform; // UnityEngine.Transform
};

UnityEngine.Component.prototype = {
	constructor: UnityEngine.Component,
};

//
// ..\src\gui\unity3d\GameObject.js
//

UnityEngine.GameObject = function () {
	this.name = '';
	this.transform = new UnityEngine.Transform(this);
	this.components = [];
};

UnityEngine.GameObject.prototype = {
	constructor: UnityEngine.GameObject,
	Load: function(json) {
		this.name = json.name;
		if (json.transform) this.transform.Load(json.transform);
		if (json.children) {
			for (var i in json.children) {
				var go = new UnityEngine.GameObject();
				go.transform.setParent(this.transform);
				go.Load(json.children[i]);
			}
		}
		if (json.components) {
			for (var i in json.components) {
				var componentData = json.components[i];
				var componentTypeName = componentData.typeName;
				var componentType = NGUI[componentTypeName] | UnityEngine[componentTypeName];
				if (componentType) {
					var component = new componentType(this);
					component.Load(componentData);
					this.components.push(component);
				}
			}
		}
		return this;
	},
};

//
// ..\src\gui\unity3d\Mathf.js
//

UnityEngine.Mathf = {
	lerp: function(t, a, b) {
		return a + t * (b - a);
	},
	Clamp01: function(val) {
		return Math.min(Math.max(0, val), 1);
	}
}

//
// ..\src\gui\unity3d\Matrix4x4.js
//

UnityEngine.Matrix4x4 = function () {
	this.elements = new Float32Array( [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	] );
};

UnityEngine.Matrix4x4.prototype = {
	constructor: UnityEngine.Matrix4x4,
	set: function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {
		var te = this.elements;
		te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
		te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
		te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
		te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;
		return this;
	},
	identity: function () { return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); },
	equals: function (matrix) {
		var te = this.elements;
		var me = matrix.elements;
		for (var i = 0; i < 16; i ++ ) {
			if ( te[ i ] !== me[ i ] ) return false;
		}
		return true;
	},
	transpose: function () {
		var te = this.elements;
		var tmp;
		tmp = te[ 1 ]; te[ 1 ] = te[ 4 ]; te[ 4 ] = tmp;
		tmp = te[ 2 ]; te[ 2 ] = te[ 8 ]; te[ 8 ] = tmp;
		tmp = te[ 6 ]; te[ 6 ] = te[ 9 ]; te[ 9 ] = tmp;
		tmp = te[ 3 ]; te[ 3 ] = te[ 12 ]; te[ 12 ] = tmp;
		tmp = te[ 7 ]; te[ 7 ] = te[ 13 ]; te[ 13 ] = tmp;
		tmp = te[ 11 ]; te[ 11 ] = te[ 14 ]; te[ 14 ] = tmp;
		return this;
	},
	getInverse: function ( m ) {
		var te = this.elements,
			me = m.elements,
			n11 = me[ 0 ], n21 = me[ 1 ], n31 = me[ 2 ], n41 = me[ 3 ],
			n12 = me[ 4 ], n22 = me[ 5 ], n32 = me[ 6 ], n42 = me[ 7 ],
			n13 = me[ 8 ], n23 = me[ 9 ], n33 = me[ 10 ], n43 = me[ 11 ],
			n14 = me[ 12 ], n24 = me[ 13 ], n34 = me[ 14 ], n44 = me[ 15 ],

			t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
			t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
			t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
			t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
			
		var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
		if (det === 0) return this.identity();

		var detInv = 1 / det;
		te[ 0 ] = t11 * detInv;
		te[ 1 ] = ( n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44 ) * detInv;
		te[ 2 ] = ( n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44 ) * detInv;
		te[ 3 ] = ( n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43 ) * detInv;
		te[ 4 ] = t12 * detInv;
		te[ 5 ] = ( n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44 ) * detInv;
		te[ 6 ] = ( n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44 ) * detInv;
		te[ 7 ] = ( n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43 ) * detInv;
		te[ 8 ] = t13 * detInv;
		te[ 9 ] = ( n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44 ) * detInv;
		te[ 10 ] = ( n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44 ) * detInv;
		te[ 11 ] = ( n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43 ) * detInv;
		te[ 12 ] = t14 * detInv;
		te[ 13 ] = ( n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34 ) * detInv;
		te[ 14 ] = ( n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34 ) * detInv;
		te[ 15 ] = ( n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33 ) * detInv;
		return this;
	},
	makeRotationFromQuaternion: function ( q ) {
		var te = this.elements;
		var x = q.x, y = q.y, z = q.z, w = q.w;
		var x2 = x + x, y2 = y + y, z2 = z + z;
		var xx = x * x2, xy = x * y2, xz = x * z2;
		var yy = y * y2, yz = y * z2, zz = z * z2;
		var wx = w * x2, wy = w * y2, wz = w * z2;
		te[ 0 ] = 1 - ( yy + zz );
		te[ 4 ] = xy - wz;
		te[ 8 ] = xz + wy;
		te[ 1 ] = xy + wz;
		te[ 5 ] = 1 - ( xx + zz );
		te[ 9 ] = yz - wx;
		te[ 2 ] = xz - wy;
		te[ 6 ] = yz + wx;
		te[ 10 ] = 1 - ( xx + yy );
		// last column
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;
		// bottom row
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;
		return this;
	},
	scale: function ( v ) {
		var te = this.elements;
		var x = v.x, y = v.y, z = v.z;
		te[ 0 ] *= x; te[ 4 ] *= y; te[ 8 ] *= z;
		te[ 1 ] *= x; te[ 5 ] *= y; te[ 9 ] *= z;
		te[ 2 ] *= x; te[ 6 ] *= y; te[ 10 ] *= z;
		te[ 3 ] *= x; te[ 7 ] *= y; te[ 11 ] *= z;
		return this;
	},
	setPosition: function ( v ) {
		var te = this.elements;
		te[ 12 ] = v.x;
		te[ 13 ] = v.y;
		te[ 14 ] = v.z;
		return this;
	},
	SetTRS: function(position, quaternion, scale ) {
		this.makeRotationFromQuaternion( quaternion );
		this.scale( scale );
		this.setPosition( position );
		return this;
	},
	MultiplyMatrices: function ( a, b ) {
		var ae = a.elements;
		var be = b.elements;
		var te = this.elements;
		var a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
		var a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
		var a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
		var a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];
		var b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
		var b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
		var b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
		var b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];
		te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
		te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
		te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
		te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
		return this;
	},
	MultiplyPoint: function(v) {
		var x = v.x, y = v.y, z = v.z;
		var e = this.elements;
		var d = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] );
		return new UnityEngine.Vector3(
			( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ] ) * d,
			( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ] ) * d,
			( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * d);
	},
	MultiplyPoint3x4: function(v) {
		var x = v.x, y = v.y, z = v.z;
		var e = this.elements;
		return new UnityEngine.Vector3(
			e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ],
			e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ],
			e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ]);
	},
	MultiplyVector: function(v) {
		var x = v.x, y = v.y, z = v.z;
		var e = this.elements;
		return new UnityEngine.Vector3(
			e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z,
			e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z,
			e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z);
	},
};

//
// ..\src\gui\unity3d\Material.js
//

UnityEngine.Material = function() {
	this.shader = null; // UnityEngine.Shader
};

UnityEngine.Material.prototype = {
	constructor: UnityEngine.Material,
	Load: function(json) {

	},
};

//
// ..\src\gui\unity3d\MonoBehaviour.js
//


UnityEngine.MonoBehaviour = function(gameObject) {
	UnityEngine.Component.call(gameObject);
	this.enabled = true;
};

Object.assign(UnityEngine.MonoBehaviour.prototype, UnityEngine.Component.prototype, {
	constructor: UnityEngine.MonoBehaviour,
});

//
// ..\src\gui\unity3d\Quaternion.js
//

UnityEngine.Quaternion = function ( x, y, z, w ) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = w || 1;
};

UnityEngine.Quaternion.prototype = {
	constructor: UnityEngine.Quaternion,
	set: function(x, y, z, w) { this.x = x; this.y = y; this.z = z; this.w = w; },
	euler: function(x, y, z) {
		var c1 = Math.cos( x * 0.5 );
		var c2 = Math.cos( y * 0.5 );
		var c3 = Math.cos( z * 0.5 );
		var s1 = Math.sin( x * 0.5 );
		var s2 = Math.sin( y * 0.5 );
		var s3 = Math.sin( z * 0.5 );
		this.x = s1 * c2 * c3 + c1 * s2 * s3;
		this.y = c1 * s2 * c3 - s1 * c2 * s3;
		this.z = c1 * c2 * s3 + s1 * s2 * c3;
		this.w = c1 * c2 * c3 - s1 * s2 * s3;
	},
};

//
// ..\src\gui\unity3d\Rect.js
//

UnityEngine.Rect = function(left, top, width, height) {
	this.xMin = left;
	this.xMax = left + width;
	this.yMin = top;
	this.yMax = top + height;
};

UnityEngine.Rect.prototype = {
	constructor: UnityEngine.Rect,
	get left() { return this.xMin; },
	get top() { return this.yMin; },
	get width() { return this.xMax - this.xMin; },
	get height() { return this.yMax - this.yMin; },
};

//
// ..\src\gui\unity3d\Shader.js
//

UnityEngine.Shader = function(json) {
	if (!json) json = {};
	this.name = json.name;
	this.Cull = json.Cull | 'Off';
	this.Lighting = json.Lighting | 'Off';
	this.ZWrite = json.ZWrite | 'Off';
	this.Fog = json.Fog | { Mode: 'Off' };
	this.Offset = json.Offset | [-1, -1];
	this.Blend = json.Blend | ['SrcAlpha', 'OneMinusSrcAlpha'];
	this.vertexShader = json.vertexShader | 'void main() {\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}';
	this.fragmentShader = json.fragmentShader | 'void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}';

	this.program = null;
	this.gl = null; // parse form the context.
	this.cachedUniforms = undefined;
	this.cachedAttributes = undefined;

	function fetchAttributeLocations( gl, program ) {
		var attributes = {};
		var n = gl.getProgramParameter( program, gl.ACTIVE_ATTRIBUTES );
		for ( var i = 0; i < n; i ++ ) {
			var info = gl.getActiveAttrib( program, i );
			var name = info.name;
			attributes[ name ] = gl.getAttribLocation( program, name );
		}
		return attributes;
	}

	function compileSource(gl, type, src) {
		var shader = gl.createShader( type );
		gl.shaderSource( shader, src );
		gl.compileShader( shader );
		if ( gl.getShaderParameter( shader, gl.COMPILE_STATUS ) === false )
			console.error( 'THREE.WebGLShader: Shader couldn\'t compile.' );
		return shader;
	}

	function compileShader(gl, vertexShader, fragmentShader) {
		var program = gl.createProgram();
		var glVertexShader = compileSource(gl, gl.VERTEX_SHADER, vertexShader);
		var glFragmentShader = compileSource(gl, gl.FRAGMENT_SHADER, fragmentShader);
		gl.attachShader(program, glVertexShader);
		gl.attachShader(program, glFragmentShader);
		gl.linkProgram( program );
		if (gl.getProgramParameter(program, gl.LINK_STATUS) === false) {
			var programLog = gl.getProgramInfoLog(program);
			var vertexLog = gl.getShaderInfoLog(glVertexShader);
			var fragmentLog = gl.getShaderInfoLog(glFragmentShader);
			console.error('THREE.WebGLProgram: shader error: ', 
				gl.getError(), 
				'gl.VALIDATE_STATUS',
				gl.getProgramParameter(program, gl.VALIDATE_STATUS),
				'gl.getProgramInfoLog', 
				programLog,
				vertexLog, 
				fragmentLog);
		}
		gl.deleteShader(glVertexShader);
		gl.deleteShader(glFragmentShader);
		return program;
	}

	function getUniforms(gl, program) {
		var n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
		var rePathPart = /([\w\d_]+)(\])?(\[|\.)?/g,
		for ( var i = 0; i !== n; ++ i ) {
			var activeInfo = gl.getActiveUniform(program, i);
			var path = info.name;
			var addr = gl.getUniformLocation(program, path);

			//parseUniform(activeInfo, addr, this);
			var path = activeInfo.name, pathLength = path.length;
			rePathPart.lastIndex = 0;
			for (; ;) {
				var match = rePathPart.exec( path ),
					matchEnd = rePathPart.lastIndex,
					id = match[ 1 ],
					idIsIndex = match[ 2 ] === ']',
					subscript = match[ 3 ];
				if (idIsIndex ) id = id | 0; // convert to integer
				if (subscript === undefined ||
					subscript === '[' && matchEnd + 2 === pathLength ) {
					this.cachedUniforms[id] = 
					addUniform(container, subscript === undefined ?
							new SingleUniform(id, activeInfo, addr) :
							new PureArrayUniform(id, activeInfo, addr));
					break;
				} else { // step into inner node / create it in case it doesn't exist
					var map = container.map,
						next = map[id];
					if (next === undefined) {
						next = new StructuredUniform(id);
						addUniform(container, next);
					}
					container = next;
				}
			}
		}
	}

	function getAttributes(gl, program) {
		var attributes = {};
		var n = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
		for (var i = 0; i < n; i ++) {
			var info = gl.getActiveAttrib(program, i);
			var name = info.name;
			attributes[name] = gl.getAttribLocation(program, name);
		}
		return attributes;
	}
};

UnityEngine.Shader.prototype = {
	constructor: UnityEngine.Shader,
	destroy: function() {
		this.gl.deleteProgram(this.program);
		this.program = undefined;
	},
	Load: function(json) {
		this.vertexShader = json.vs;
		this.fragmentShader = json.ps; 
	},

};

//
// ..\src\gui\unity3d\ShaderUniforms.js
//

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

//
// ..\src\gui\unity3d\Transform.js
//

UnityEngine.Transform = function(gameObject) {
	UnityEngine.Component.call(gameObject);

	this.position = new UnityEngine.Vector3(0, 0, 0);
	this.rotation = new UnityEngine.Quaternion();
	this.lossyScale = new UnityEngine.Vector3(1, 1, 1);

	this.localPosition = new UnityEngine.Vector3(0, 0, 0);
	this.localRotation = new UnityEngine.Quaternion();
	this.localScale = new UnityEngine.Vector3(1, 1, 1);

	this.worldToLocalMatrix = new UnityEngine.Matrix4();
	this.localToWorldMatrix = new UnityEngine.Matrix4();
	this.parent = null; // UnityEngine.Transform
	this.children = [];
	this.needUpdate = false;
};

Object.assign(UnityEngine.Transform.prototype, UnityEngine.Component.prototype, {
	constructor: UnityEngine.Transform,
	setParent: function(parent) {
		this.parent = parent;
		parent.children.push(this);
	},
	Load: function(json) {
		if (json.t) this.localPosition.set(json.t.x, json.t.y, json.t.z);
		if (json.r) this.localRotation.euler(json.r.x, json.r.y, json.r.z);
		if (json.s) this.localScale.set(json.s.x, json.s.y, json.s.z);
		this.needUpdate = true;
	},
	Update: function() {
		if (!this.needUpdate) return;
		this.needUpdate = false;
		var localMatrix = new UnityEngine.Matrix4();
		localMatrix.SetTRS(this.localPosition, this.localRotation, this.localScale);
		this.localToWorldMatrix.MultiplyMatrices(localMatrix, this.parent.localToWorldMatrix);
		for (var i in this.children)
			this.children[i].Update();
	},
	TransformPoint: function(pos) {
		return this.localToWorldMatrix.MultiplyPoint3x4(pos);
	},
});

//
// ..\src\gui\unity3d\Vector2.js
//

UnityEngine.Vector2 = function ( x, y ) {
	this.x = x || 0;
	this.y = y || 0;
};

UnityEngine.Vector2.prototype = {
	constructor: UnityEngine.Vector2,
	set: function(x, y) { this.x = x; this.y = y; },
    add: function(v) {
		this.x += v.x;
		this.y += v.y;
    },
	sub: function(v) {
		this.x -= v.x;
		this.y -= v.y;
	},
	dot: function(v) {
		return this.x * v.x + this.y * v.y;
	},
	multiply: function (v) {
		this.x *= v.x;
		this.y *= v.y;
		return this;
	},
	multiplyScalar: function ( scalar ) {
		if ( isFinite( scalar ) ) {
			this.x *= scalar;
			this.y *= scalar;
		} else {
			this.x = 0;
			this.y = 0;
		}
		return this;
	},
	divide: function ( v ) {
		this.x /= v.x;
		this.y /= v.y;
		return this;
	},
	divideScalar: function ( scalar ) {
		return this.multiplyScalar( 1 / scalar );
	},
	sqrMagnitude: function () {
		return this.x * this.x + this.y * this.y;
	},
	magnitude: function () {
		return Math.sqrt( this.x * this.x + this.y * this.y );
	},
};

//
// ..\src\gui\unity3d\Vector3.js
//

UnityEngine.Vector3 = function ( x, y, z ) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
};

UnityEngine.Vector3.prototype = {
	constructor: UnityEngine.Vector3,
	set: function(x, y, z) { this.x = x; this.y = y; this.z = z; },
	add: function(v) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
	},
	sub: function(v) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
	},
	dot: function(v) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	},
	multiply: function (v) {
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
		return this;
	},
	multiplyScalar: function ( scalar ) {
		if ( isFinite( scalar ) ) {
			this.x *= scalar;
			this.y *= scalar;
			this.z *= scalar;
		} else {
			this.x = 0;
			this.y = 0;
			this.z = 0;
		}
		return this;
	},
	divide: function ( v ) {
		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;
		return this;
	},
	divideScalar: function ( scalar ) {
		return this.multiplyScalar( 1 / scalar );
	},
	sqrMagnitude: function () {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	},
	magnitude: function () {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	},
};

//
// ..\src\gui\unity3d\Vector4.js
//

UnityEngine.Vector4 = function ( x, y, z, w ) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = w || 0;
};

UnityEngine.Vector4.prototype = {
	constructor: UnityEngine.Vector4,
	set: function(x, y, z, w) { this.x = x; this.y = y; this.z = z; this.w = w; },
	add: function(v) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		this.w += v.w;
	},
	sub: function(v) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		this.w -= v.w;
	},
	dot: function(v) {
		return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
	},
	multiply: function (v) {
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
		this.w *= v.w;
		return this;
	},
	multiplyScalar: function ( scalar ) {
		if ( isFinite( scalar ) ) {
			this.x *= scalar;
			this.y *= scalar;
			this.z *= scalar;
			this.w *= scalar;
		} else {
			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.w = 0;
		}
		return this;
	},
	divide: function ( v ) {
		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;
		this.w /= v.w;
		return this;
	},
	divideScalar: function ( scalar ) {
		return this.multiplyScalar( 1 / scalar );
	},
	sqrMagnitude: function () {
		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
	},
	magnitude: function () {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	},
};

//
// ..\src\gui\internal\NGUIMath.js
//

NGUIMath = {
	ConvertToTexCoords: function(rect, width, height) {
		var final = rect;
		if (width != 0 && height != 0) {
			final.xMin = rect.xMin / width;
			final.xMax = rect.xMax / width;
			final.yMin = 1 - rect.yMax / height;
			final.yMax = 1 - rect.yMin / height;
		}
		return final;
	},
	GetPivotOffset: function(pv) {
		var v = new UnityEngine.Vector2();
		if (pv == NGUI.UIWidget.Pivot.Top || pv == NGUI.UIWidget.Pivot.Center || pv == NGUI.UIWidget.Pivot.Bottom) v.x = 0.5;
		else if (pv == NGUI.UIWidget.Pivot.TopRight || pv == NGUI.UIWidget.Pivot.Right || pv == NGUI.UIWidget.Pivot.BottomRight) v.x = 1;
		else v.x = 0;

		if (pv == NGUI.UIWidget.Pivot.Left || pv == NGUI.UIWidget.Pivot.Center || pv == NGUI.UIWidget.Pivot.Right) v.y = 0.5;
		else if (pv == NGUI.UIWidget.Pivot.TopLeft || pv == NGUI.UIWidget.Pivot.Top || pv == NGUI.UIWidget.Pivot.TopRight) v.y = 1;
		else v.y = 0;

		return v;
	},
	RepeatIndex: function(val, max) {
		if (max < 1) return 0;
		while (val < 0) val += max;
		while (val >= max) val -= max;
		return val;
	}
};

//
// ..\src\gui\internal\NGUITools.js
//

NGUITools = {
	screenSize: new UnityEngine.Vector2(100, 100),
};

//
// ..\src\gui\internal\UIDrawCall.js
//

NGUI.UIDrawCall = function (name, panel, material) {
	this.widgetCount = 0;
	this.depthStart = 2147483647; // MaxValue = 2147483647
	this.depthEnd = -2147483648; // int.MinValue = -2147483648;
	this.isDirty = false;

	this.baseMaterial = material;
	this.renderQueue = panel.startingRenderQueue;
	this.mSortingOrder = panel.mSortingOrder;
	this.manager = panel;
	this.panel = null; // NGUI.UIPanel
	
	this.verts = [];// Vector3
	this.uvs = [];// Vector3
	this.cols = [];// Vector3
};

NGUI.UIDrawCall.prototype = {
	constructor: NGUI.UIDrawCall,
	UpdateGeometry: function(count) {
	},
};

//
// ..\src\gui\internal\UIGeometry.js
//

NGUI.UIGeometry = function() {
	this.verts = [];
	this.uvs = [];
	this.cols = [];
	this.mRtpVerts = [];
}

NGUI.UIGeometry.prototype = {
	constructor: NGUI.UIGeometry,
	hasVertices: function() { return this.verts.length > 0; },
	clear: function() {
		if (this.verts.length > 0) this.verts = [];
		if (this.uvs.length > 0) this.uvs = [];
		if (this.cols.length > 0) this.cols = [];
		if (this.mRtpVerts.length > 0) this.mRtpVerts = [];
	},
	ApplyTransform: function(widgetToPanel) {
		if (this.verts.length > 0) {
			this.mRtpVerts = [];
			for (var i = 0, imax = this.verts.length; i < imax; ++i) 
				this.mRtpVerts.push(widgetToPanel.MultiplyPoint3x4(this.verts[i]));
		}
		else if (this.mRtpVerts.length > 0)
			this.mRtpVerts = [];
	},
	WriteToBuffers: function(v, u, c) {
		for (var i = 0; i < this.mRtpVerts.length; ++i) {
			v.push(this.mRtpVerts.buffer[i]);
			u.push(this.uvs.buffer[i]);
			c.push(this.cols.buffer[i]);
		}
	}
}

//
// ..\src\gui\internal\UIRect.js
//

NGUI.UIRect = function(gameObject) {
	UnityEngine.MonoBehaviour.call(gameObject);

	this.finalAlpha = 1;
};

Object.assign(NGUI.UIRect.prototype, UnityEngine.MonoBehaviour.prototype, {
	constructor: NGUI.UIRect,
});

//
// ..\src\gui\internal\UIWidget.js
//

NGUI.UIWidget = function(gameObject) {
	NGUI.UIRect.call(gameObject);
	
	this.mColor = new UnityEngine.Color(1, 1, 1), // UnityEngine.ColorKeywords.white
	this.mPivot = NGUI.UIWidget.Pivot.Center;
	this.mWidth = 100;
	this.mHeight = 100;
	this.mDepth = 0;
	this.mChanged = false;
	this.mMoved = false;
	this.mIsInFront = true;
	this.mIsVisibleByAlpha = true;
	this.mIsVisibleByPanel = true;
	this.mDrawRegion = new UnityEngine.Vector4(0, 0, 1, 1);
	this.mLocalToPanel = new UnityEngine.Matrix4();
	this.mMatrixFrame = 1;

	// public variables.
	this.fillGeometry = true;
	this.panel = null;
	this.drawCall = null;
	this.geometry = new NGUI.UIGeometry();
};

NGUI.UIWidget.Pivot = {
	TopLeft: 0,
	Top: 1,
	TopRight: 2,
	Left: 3,
	Center: 4,
	Right: 5,
	BottomLeft: 6,
	Bottom: 7,
	BottomRight: 8,
};

Object.assign(NGUI.UIWidget.prototype, NGUI.UIRect.prototype, {
	constructor: NGUI.UIWidget,
	get pivotOffset() { return NGUIMath.GetPivotOffset(this.mPivot); },
	get material() { return null; },
	isVisible: function() { return this.mIsVisibleByAlpha && this.mIsVisibleByPanel && this.mIsInFront && this.finalAlpha > 0.001; },
	hasVertices: function() { return this.geometry.hasVertices(); },
	border: function() { return new UnityEngine.Vector4(0, 0, 0, 0); },
	OnFill: function(verts, uvs, cols) { },
	UpdateVisibility: function(visibleByAlpha, visibleByPanel) {
		if (this.mIsVisibleByAlpha != visibleByAlpha || this.mIsVisibleByPanel != visibleByPanel) {
			this.mChanged = true;
			this.mIsVisibleByAlpha = visibleByAlpha;
			this.mIsVisibleByPanel = visibleByPanel;
			return true;
		}
		return false;
	},
	drawingDimensions: function() {
		var offset = this.pivotOffset;
		var x0 = -offset.x * this.mWidth;
		var y0 = -offset.y * this.mHeight;
		var x1 = x0 + this.mWidth;
		var y1 = y0 + this.mHeight;
		return new UnityEngine.Vector4(
			this.mDrawRegion.x == 0 ? x0 : UnityEngine.Mathf.Lerp(x0, x1, this.mDrawRegion.x),
			this.mDrawRegion.y == 0 ? y0 : UnityEngine.Mathf.Lerp(y0, y1, this.mDrawRegion.y),
			this.mDrawRegion.z == 1 ? x1 : UnityEngine.Mathf.Lerp(x0, x1, this.mDrawRegion.z),
			this.mDrawRegion.w == 1 ? y1 : UnityEngine.Mathf.Lerp(y0, y1, this.mDrawRegion.w));
	},
	UpdateGeometry: function(frame) {
		if (this.mChanged) {
			this.mChanged = false;
			if (this.mIsVisibleByAlpha && this.finalAlpha > 0.001) {
				var hadVertices = this.geometry.hasVertices;
				if (this.fillGeometry) {
					this.geometry.Clear();
					this.OnFill(this.geometry.verts, this.geometry.uvs, this.geometry.cols);
				}
				if (geometry.hasVertices) {
					if (this.mMatrixFrame != frame) {
						this.mLocalToPanel = this.panel.worldToLocal * this.transform.localToWorldMatrix;
						this.mMatrixFrame = frame;
					}
					this.geometry.ApplyTransform(this.mLocalToPanel);
					this.mMoved = false;
					return true;
				}
			}
			
			if (this.fillGeometry) this.geometry.Clear();
			this.mMoved = false;
			return true;
		}
		else if (this.mMoved && this.geometry.hasVertices()) {
			if (this.mMatrixFrame != frame) {
				this.mLocalToPanel = this.panel.worldToLocal * this.transform.localToWorldMatrix;
				this.mMatrixFrame = frame;
			}
			this.geometry.ApplyTransform(this.mLocalToPanel);
			this.mMoved = false;
			return true;
		}
		this.mMoved = false;
		return false;
	},
	WriteToBuffers: function(v, u, c) {
		this.geometry.WriteToBuffers(v, u, c);
	},
});

//
// ..\src\gui\internal\UIBasicSprite.js
//

NGUI.UIBasicSprite = function(gameObject) {
	NGUI.UIWidget.call(gameObject);
	this.mOuterUV = new UnityEngine.Rect(0, 0, 1, 1);
	this.mInnerUV = new UnityEngine.Rect(0, 0, 1, 1);
	this.mFillAmount = 1.0;
	this.mInvert = false;
	this.mType = SpriteType.Simple;
	this.mFillDirection = FillDirection.Radial360;
	this.mFlip = Flip.Nothing;
};

SpriteType = {
	Simple: 0,
	Sliced: 1,
	Tiled: 2,
	Filled: 3,
	Advanced: 4,
};
FillDirection = {
	Horizontal: 0,
	Vertical: 1,
	Radial90: 2,
	Radial180: 3,
	Radial360: 4,
};
AdvancedType = {
	Invisible: 0,
	Sliced: 1,
	Tiled: 2,
};
Flip = {
	Nothing: 0,
	Horizontally: 1,
	Vertically: 2,
	Both: 3,
};

gTempPos = [new UnityEngine.Vector2(), new UnityEngine.Vector2(), new UnityEngine.Vector2(), new UnityEngine.Vector2()];
gTempUVs = [new UnityEngine.Vector2(), new UnityEngine.Vector2(), new UnityEngine.Vector2(), new UnityEngine.Vector2()];

Object.assign(NGUI.UIBasicSprite.prototype, NGUI.UIWidget.prototype, {
	constructor: NGUI.UIBasicSprite,
	get pixelSize() { return 1; },
	drawingUVs: function() {
		switch (this.mFlip) {
			case Flip.Horizontally: return new UnityEngine.Vector4(this.mOuterUV.xMax, this.mOuterUV.yMin, this.mOuterUV.xMin, this.mOuterUV.yMax);
			case Flip.Vertically: return new UnityEngine.Vector4(this.mOuterUV.xMin, this.mOuterUV.yMax, this.mOuterUV.xMax, this.mOuterUV.yMin);
			case Flip.Both: return new UnityEngine.Vector4(this.mOuterUV.xMax, this.mOuterUV.yMax, this.mOuterUV.xMin, this.mOuterUV.yMin);
			default: return new UnityEngine.Vector4(this.mOuterUV.xMin, this.mOuterUV.yMin, this.mOuterUV.xMax, this.mOuterUV.yMax);
		}
	},
	drawingColor: function() { return new UnityEngine.Color(this.mColor.r, this.mColor.g, this.mColor.b, this.this.finalAlpha); },
	Fill: function(verts, uvs, cols, outer, inner) {
		this.mOuterUV = outer;
		this.mInnerUV = inner;
		switch (this.mType) {
		case SpriteType.Simple:
			this.SimpleFill(verts, uvs, cols);
			break;
		case SpriteType.Sliced:
			this.SlicedFill(verts, uvs, cols);
			break;
		case SpriteType.Filled:
			this.FilledFill(verts, uvs, cols);
			break;
		case SpriteType.Tiled:
			this.TiledFill(verts, uvs, cols);
			break;
		case SpriteType.Advanced:
			this.AdvancedFill(verts, uvs, cols);
			break;
		}
	},
	SimpleFill: function(verts, uvs, cols) {
		var v = this.drawingDimensions();
		var u = this.drawingUVs();
		var c = this.drawingColor();
		verts.push(new UnityEngine.Vector3(v.x, v.y));
		verts.push(new UnityEngine.Vector3(v.x, v.w));
		verts.push(new UnityEngine.Vector3(v.z, v.w));
		verts.push(new UnityEngine.Vector3(v.z, v.y));
		uvs.push(new UnityEngine.Vector2(u.x, u.y));
		uvs.push(new UnityEngine.Vector2(u.x, u.w));
		uvs.push(new UnityEngine.Vector2(u.z, u.w));
		uvs.push(new UnityEngine.Vector2(u.z, u.y));
		cols.push(c);
		cols.push(c);
		cols.push(c);
		cols.push(c);
	},
	SlicedFill: function(verts, uvs, cols) {
		var br = this.border() * pixelSize;
		if (br.x == 0 && br.y == 0 && br.z == 0 && br.w == 0)
			return this.SimpleFill(verts, uvs, cols);

		var c = this.drawingColor();
		var v = this.drawingDimensions();

		gTempPos[0].x = v.x;
		gTempPos[0].y = v.y;
		gTempPos[3].x = v.z;
		gTempPos[3].y = v.w;

		if (this.mFlip == Flip.Horizontally || 
			this.mFlip == Flip.Both) {
			gTempPos[1].x = gTempPos[0].x + br.z;
			gTempPos[2].x = gTempPos[3].x - br.x;
			gTempUVs[3].x = this.mOuterUV.xMin;
			gTempUVs[2].x = this.mInnerUV.xMin;
			gTempUVs[1].x = this.mInnerUV.xMax;
			gTempUVs[0].x = this.mOuterUV.xMax;
		}
		else {
			gTempPos[1].x = gTempPos[0].x + br.x;
			gTempPos[2].x = gTempPos[3].x - br.z;
			gTempUVs[0].x = this.mOuterUV.xMin;
			gTempUVs[1].x = this.mInnerUV.xMin;
			gTempUVs[2].x = this.mInnerUV.xMax;
			gTempUVs[3].x = this.mOuterUV.xMax;
		}

		if (this.mFlip == Flip.Vertically || 
			this.mFlip == Flip.Both) {
			gTempPos[1].y = gTempPos[0].y + br.w;
			gTempPos[2].y = gTempPos[3].y - br.y;
			gTempUVs[3].y = this.mOuterUV.yMin;
			gTempUVs[2].y = this.mInnerUV.yMin;
			gTempUVs[1].y = this.mInnerUV.yMax;
			gTempUVs[0].y = this.mOuterUV.yMax;
		}
		else {
			gTempPos[1].y = gTempPos[0].y + br.y;
			gTempPos[2].y = gTempPos[3].y - br.w;
			gTempUVs[0].y = this.mOuterUV.yMin;
			gTempUVs[1].y = this.mInnerUV.yMin;
			gTempUVs[2].y = this.mInnerUV.yMax;
			gTempUVs[3].y = this.mOuterUV.yMax;
		}

		for (var x = 0; x < 3; ++x) {
			var x2 = x + 1;
			for (var y = 0; y < 3; ++y) {
				if (centerType == AdvancedType.Invisible && x == 1 && y == 1)
					continue;
				var y2 = y + 1;
				verts.push(new UnityEngine.Vector3(gTempPos[x].x, gTempPos[y].y));
				verts.push(new UnityEngine.Vector3(gTempPos[x].x, gTempPos[y2].y));
				verts.push(new UnityEngine.Vector3(gTempPos[x2].x, gTempPos[y2].y));
				verts.push(new UnityEngine.Vector3(gTempPos[x2].x, gTempPos[y].y));
				uvs.push(new UnityEngine.Vector2(gTempUVs[x].x, gTempUVs[y].y));
				uvs.push(new UnityEngine.Vector2(gTempUVs[x].x, gTempUVs[y2].y));
				uvs.push(new UnityEngine.Vector2(gTempUVs[x2].x, gTempUVs[y2].y));
				uvs.push(new UnityEngine.Vector2(gTempUVs[x2].x, gTempUVs[y].y));
				cols.push(c);
				cols.push(c);
				cols.push(c);
				cols.push(c);
			}
		}
	},
	FilledFill: function(verts, uvs, cols) {
		if (this.mFillAmount < 0.001) return;
		var v = this.drawingDimensions();
		var u = this.drawingUVs();
		var c = this.drawingColor();
		if (this.mFillDirection == FillDirection.Horizontal || 
			this.mFillDirection == FillDirection.Vertical) {
			if (this.mFillDirection == FillDirection.Horizontal) {
				var fill = (u.z - u.x) * this.mFillAmount;
				if (this.mInvert) {
					v.x = v.z - (v.z - v.x) * this.mFillAmount;
					u.x = u.z - fill;
				}
				else {
					v.z = v.x + (v.z - v.x) * this.mFillAmount;
					u.z = u.x + fill;
				}
			}
			else if (this.mFillDirection == FillDirection.Vertical) {
				var fill = (u.w - u.y) * this.mFillAmount;
				if (this.mInvert) {
					v.y = v.w - (v.w - v.y) * this.mFillAmount;
					u.y = u.w - fill;
				}
				else {
					v.w = v.y + (v.w - v.y) * this.mFillAmount;
					u.w = u.y + fill;
				}
			}
		}

		gTempPos[0] = new UnityEngine.Vector2(v.x, v.y);
		gTempPos[1] = new UnityEngine.Vector2(v.x, v.w);
		gTempPos[2] = new UnityEngine.Vector2(v.z, v.w);
		gTempPos[3] = new UnityEngine.Vector2(v.z, v.y);

		gTempUVs[0] = new UnityEngine.Vector2(u.x, u.y);
		gTempUVs[1] = new UnityEngine.Vector2(u.x, u.w);
		gTempUVs[2] = new UnityEngine.Vector2(u.z, u.w);
		gTempUVs[3] = new UnityEngine.Vector2(u.z, u.y);

		if (this.mFillAmount < 1) {
			if (this.mFillDirection == FillDirection.Radial90) {
				if (NGUI.UIBasicSprite.RadialCut(gTempPos, gTempUVs, this.mFillAmount, this.mInvert, 0)) {
					for (var i = 0; i < 4; ++i) {
						verts.push(gTempPos[i]);
						uvs.push(gTempUVs[i]);
						cols.push(c);
					}
				}
				return;
			}

			if (this.mFillDirection == FillDirection.Radial180) {
				for (var side = 0; side < 2; ++side) {
					var fx0 = 0;
					var fx1 = 0;
					var fy0 = 0;
					var fy1 = 1;

					if (side == 0) { fx0 = 0; fx1 = 0.5; }
					else { fx0 = 0.5; fx1 = 1; }

					gTempPos[0].x = Mathf.Lerp(v.x, v.z, fx0);
					gTempPos[1].x = gTempPos[0].x;
					gTempPos[2].x = Mathf.Lerp(v.x, v.z, fx1);
					gTempPos[3].x = gTempPos[2].x;

					gTempPos[0].y = Mathf.Lerp(v.y, v.w, fy0);
					gTempPos[1].y = Mathf.Lerp(v.y, v.w, fy1);
					gTempPos[2].y = gTempPos[1].y;
					gTempPos[3].y = gTempPos[0].y;

					gTempUVs[0].x = Mathf.Lerp(u.x, u.z, fx0);
					gTempUVs[1].x = gTempUVs[0].x;
					gTempUVs[2].x = Mathf.Lerp(u.x, u.z, fx1);
					gTempUVs[3].x = gTempUVs[2].x;

					gTempUVs[0].y = Mathf.Lerp(u.y, u.w, fy0);
					gTempUVs[1].y = Mathf.Lerp(u.y, u.w, fy1);
					gTempUVs[2].y = gTempUVs[1].y;
					gTempUVs[3].y = gTempUVs[0].y;

					var val = !this.mInvert ? this.mFillAmount * 2 - side : this.mFillAmount * 2 - (1 - side);
					if (NGUI.UIBasicSprite.RadialCut(gTempPos, gTempUVs, Mathf.Clamp01(val), !this.mInvert, NGUIMath.RepeatIndex(side + 3, 4))) {
						for (var i = 0; i < 4; ++i) {
							verts.push(gTempPos[i]);
							uvs.push(gTempUVs[i]);
							cols.push(c);
						}
					}
				}
				return;
			}

			if (this.mFillDirection == FillDirection.Radial360) {
				for (var corner = 0; corner < 4; ++corner) {
					var fx0 = 0;
					var fx1 = 0;
					var fy0 = 0;
					var fy1 = 0;

					if (corner < 2) { fx0 = 0; fx1 = 0.5; }
					else { fx0 = 0.5; fx1 = 1; }

					if (corner == 0 || corner == 3) { fy0 = 0; fy1 = 0.5; }
					else { fy0 = 0.5; fy1 = 1; }

					gTempPos[0].x = Mathf.Lerp(v.x, v.z, fx0);
					gTempPos[1].x = gTempPos[0].x;
					gTempPos[2].x = Mathf.Lerp(v.x, v.z, fx1);
					gTempPos[3].x = gTempPos[2].x;

					gTempPos[0].y = Mathf.Lerp(v.y, v.w, fy0);
					gTempPos[1].y = Mathf.Lerp(v.y, v.w, fy1);
					gTempPos[2].y = gTempPos[1].y;
					gTempPos[3].y = gTempPos[0].y;

					gTempUVs[0].x = Mathf.Lerp(u.x, u.z, fx0);
					gTempUVs[1].x = gTempUVs[0].x;
					gTempUVs[2].x = Mathf.Lerp(u.x, u.z, fx1);
					gTempUVs[3].x = gTempUVs[2].x;

					gTempUVs[0].y = Mathf.Lerp(u.y, u.w, fy0);
					gTempUVs[1].y = Mathf.Lerp(u.y, u.w, fy1);
					gTempUVs[2].y = gTempUVs[1].y;
					gTempUVs[3].y = gTempUVs[0].y;

					var val = this.mInvert ?
						this.mFillAmount * 4 - NGUIMath.RepeatIndex(corner + 2, 4) :
						this.mFillAmount * 4 - (3 - NGUIMath.RepeatIndex(corner + 2, 4));

					if (NGUI.UIBasicSprite.RadialCut(gTempPos, gTempUVs, Mathf.Clamp01(val), this.mInvert, NGUIMath.RepeatIndex(corner + 2, 4))) {
						for (var i = 0; i < 4; ++i) {
							verts.push(gTempPos[i]);
							uvs.push(gTempUVs[i]);
							cols.push(c);
						}
					}
				}
				return;
			}
		}

		// Fill the buffer with the quad for the sprite
		for (var i = 0; i < 4; ++i) {
			verts.push(gTempPos[i]);
			uvs.push(gTempUVs[i]);
			cols.push(c);
		}
	},
	AdvancedFill: function(verts, uvs, cols) {
		// not implemented...
	}
});


//
// ..\src\gui\three\GUIRenderer.js
//

GUIRenderer = function (params) {
	render: function() {
		
	}
}

//
// ..\src\gui\ui\UIAtlas.js
//

NGUI.UIAtlas = function(gameObject) {
	UnityEngine.MonoBehaviour.call(gameObject);

	this.material = new THREE.SpriteMaterial();
	this.mSprites = {}; // NGUI.UISpriteData
}

Object.assign(NGUI.UIAtlas.prototype, UnityEngine.MonoBehaviour.prototype, {
	constructor: NGUI.UIAtlas,
	GetSprite: function(name) {
		return this.mSprites[name];
	},
	Load: function(json) {
		if (!(typeof json === 'object')) return;
		//this.material = json.texture; // material
		var sprites = json.mSprites; // sprites
		if (typeof sprites === 'object') {
			for (var key in sprites) {
				var sprite = new NGUI.UISpriteData();
				sprite.Load(sprites[key]);
				this.mSprites[sprite.name] = sprite;
			}
		}
	}
});

//
// ..\src\gui\ui\UIPanel.js
//

NGUI.UIPanel = function(gameObject) {
	NGUI.UIRect.call(gameObject);

	this.mDepth = 0;
	this.mSortingOrder = 0;
	this.mUpdateFrame = 0;
	this.mUpdateScroll = false;
	this.mRebuild = false;
	this.mForced = false;
	this.mResized = false;
	this.mClipOffset = new UnityEngine.Vector2();
	this.mClipRange = new UnityEngine.Vector4();
	this.mMin = new UnityEngine.Vector2();
	this.mMax = new UnityEngine.Vector2();
	this.mClipping = Clipping.None;

	this.startingRenderQueue = 3000;
	this.drawCallClipRange = new UnityEngine.Vector4(0, 0, 1, 1);
	this.renderQueue = RenderQueue.Automatic;
	this.widgets = []; // NGUI.UIWidget list
	this.drawCalls = []; // NGUI.UIDrawCall
};

RenderQueue = {
	Automatic: 0,
	StartAt: 1,
	Explicit: 2,
};

Clipping = {
	None: 0,
	SoftClip: 3,				// Alpha-based clipping with a softened edge
	ConstrainButDontClip: 4,	// No actual clipping, but does have an area
};

// static variables and function.
NGUI.UIPanel.list = [];
NGUI.UIPanel.UpdateAll = function(frame) {
	var list = NGUI.UIPanel.list;
	for (var i in list)
		list[i].UpdateSelf(frame);

	var rq = 3000;
	for (var i in list) {
		var p = list[i];
		if (p.renderQueue == RenderQueue.Automatic) {
			p.startingRenderQueue = rq;
			p.UpdateDrawCalls();
			rq += p.drawCalls.length + 2;
		}
		else if (p.renderQueue == RenderQueue.StartAt) {
			p.UpdateDrawCalls();
			if (p.drawCalls.length != 0)
				rq = Math.max(rq, p.startingRenderQueue + p.drawCalls.length);
		}
		else { // Explicit
			p.UpdateDrawCalls();
			if (p.drawCalls.Count != 0)
				rq = Math.max(rq, p.startingRenderQueue + 1);
		}
	}
}

Object.assign(NGUI.UIPanel.prototype, NGUI.UIRect.prototype, {
	constructor: NGUI.UIPanel,
	GetViewSize: function() {
		if (this.mClipping != Clipping.None)
			return new UnityEngine.Vector2(this.mClipRange.z, this.mClipRange.w);
		return NGUITools.screenSize;
	},
	finalClipRegion: function() {
		var size = this.GetViewSize();
		if (this.mClipping != Clipping.None)
			return new UnityEngine.Vector4(this.mClipRange.x + this.mClipOffset.x, this.mClipRange.y + this.mClipOffset.y, size.x, size.y);
		return new UnityEngine.Vector4(0, 0, size.x, size.y);
	},
	Load: function(json) {

	},
	UpdateSelf: function(frame) {
		this.UpdateTransformMatrix(frame);
		this.UpdateLayers(frame);
		this.UpdateWidgets(frame);
		if (this.mRebuild) {
			this.mRebuild = false;
			this.FillAllDrawCalls();
		}
		else {
			for (var i = 0; i < this.drawCalls.length;) {
				var dc = this.drawCalls[i];
				if (dc.isDirty && !this.FillDrawCall(dc)) {
					//UIDrawCall.Destroy(dc);
					this.drawCalls.splice(i, 1);
					continue;
				}
				++i;
			}
		}

		if (this.mUpdateScroll) {
			this.mUpdateScroll = false;
			//UIScrollView sv = GetComponent<UIScrollView>();
			//if (sv != null) sv.UpdateScrollbars();
		}
	},
	UpdateTransformMatrix: function(frame) {
		this.worldToLocal = this.transform.worldToLocalMatrix;
		var size = this.GetViewSize() * 0.5;
		var x = this.mClipOffset.x + this.mClipRange.x;
		var y = this.mClipOffset.y + this.mClipRange.y;
		this.mMin.x = x - size.x;
		this.mMin.y = y - size.y;
		this.mMax.x = x + size.x;
		this.mMax.y = y + size.y;
	},
	UpdateLayers: function(frame) {
		// TODO: unity3d layer...
	},
	UpdateWidgets: function(frame) {
		var changed = false;
		for (var i in this.widgets) {
			var w = this.widgets[i];
			if (w.panel != this || !w.enabled)
				continue;
				
			// First update the widget's transform
			if (w.UpdateTransform(frame) || this.mResized) {
				//var vis = forceVisible || (w.CalculateCumulativeAlpha(frame) > 0.001f);
				//w.UpdateVisibility(vis, forceVisible || ((clipped || w.hideIfOffScreen) ? IsVisible(w) : true));
			}
			
			// Update the widget's geometry if necessary
			if (w.UpdateGeometry(frame)) {
				changed = true;
				if (!this.mRebuild) {
					if (w.drawCall != null)
						w.drawCall.isDirty = true;
					else
						this.FindDrawCall(w);
				}
			}
		}
		this.mResized = false;
	},
	UpdateDrawCalls: function() {
		var trans = this.transform;
		if (this.mClipping != Clipping.None) {
			this.drawCallClipRange = this.finalClipRegion();
			this.drawCallClipRange.z *= 0.5;
			this.drawCallClipRange.w *= 0.5;
		}
		else drawCallClipRange = new UnityEngine.Vector4(0, 0, 0, 0);

		// Legacy functionality
		if (this.drawCallClipRange.z == 0) this.drawCallClipRange.z = NGUITools.screenSize.x * 0.5;
		if (this.drawCallClipRange.w == 0) this.drawCallClipRange.w = NGUITools.screenSize.y * 0.5;
		var pos = this.transform.localPosition;
		var parent = this.transform.parent;
		if (parent != null)
			pos = parent.TransformPoint(pos);

		var rot = this.transform.rotation;
		var scale = this.transform.lossyScale;
		for (var i in this.drawCalls) {
			var dc = this.drawCalls[i];
			var t = dc.transform;
			t.position = pos;
			t.rotation = rot;
			t.localScale = scale;
			dc.renderQueue = (this.renderQueue == RenderQueue.Explicit) ? this.startingRenderQueue : this.startingRenderQueue + i;
			dc.sortingOrder = this.mSortingOrder;
		}
	},
	FillAllDrawCalls: function() {
		if (this.drawCall.length > 0)
			this.drawCall.length = 0; // clear drawCalls

		var mat = null;
		var dc = null;
		var count = 0;
		for (var i in this.widgets) {
			var w = this.widgets[i];
			if (!w.isVisible() || !w.hasVertices()) {
				w.drawCall = null;
				continue;
			}
			var mt = w.material;
			if (mat != mt) {
				if (dc != null && dc.verts.length != 0) {
					this.drawCalls.push(dc);
					dc.UpdateGeometry(count);
					count = 0;
					dc = null;
				}
				mat = mt;
			}

			if (mat != null) {
				if (dc == null) {
					dc = new NGUI.UIDrawCall("", this, mat);
					dc.depthStart = w.mDepth;
					dc.depthEnd = dc.depthStart;
					dc.panel = this;
				}
				else {
					var rd = w.depth;
					if (rd < dc.depthStart) dc.depthStart = rd;
					if (rd > dc.depthEnd) dc.depthEnd = rd;
				}
				w.drawCall = dc;

				++count;
				w.WriteToBuffers(dc.verts, dc.uvs, dc.cols);
			}
		}
	},
});

//
// ..\src\gui\ui\UIRoot.js
//

NGUI.UIRoot = function(gameObject) {
	UnityEngine.MonoBehaviour.call(gameObject);
	
};

Object.assign(NGUI.UIRoot.prototype, UnityEngine.MonoBehaviour.prototype, {
	constructor: NGUI.UIRoot,
	Load: function(json) {

	},
});

//
// ..\src\gui\ui\UISprite.js
//

NGUI.UISprite = function() {
	NGUI.UIBasicSprite.call();
	this.mAtlas = null;
	this.mSpriteName = '';
	this.mSprite = null; // refrence to UISpriteData
};

Object.assign(NGUI.UISprite.prototype, NGUI.UIBasicSprite.prototype, {
	constructor: NGUI.UISprite,
	get material() { return this.mAtlas ? this.mAtlas.material : null; },
	border: function() {
		var sp = this.GetAtlasSprite();
		if (sp) return new UnityEngine.Vector4(sp.borderLeft, sp.borderBottom, sp.borderRight, sp.borderTop);
		return new UnityEngine.Vector4(0, 0, 0, 0); 
	},
	GetAtlasSprite: function() {
		if (this.mAtlas && !this.mSprite) 
			this.mSprite = this.mAtlas.GetSprite(this.mSpriteName);
		return this.mSprite;
	},
	Load: function(json) {
		// this.mAtlas, find atlas...
	},
	OnFill: function(verts, uvs, cols) {
		var tex = this.mAtlas ? this.mAtlas.material.map : null;
		if (!tex || !tex.image) return;

		var sprite = this.GetAtlasSprite();
		var outer = new NGUI.Rect(sprite.x, sprite.y, sprite.width, sprite.height);
		var inner = new NGUI.Rect(sprite.x + sprite.borderLeft, sprite.y + sprite.borderTop,
			sprite.width - sprite.borderLeft - sprite.borderRight,
			sprite.height - sprite.borderBottom - sprite.borderTop);

		outer = NGUIMath.ConvertToTexCoords(outer, tex.image.width, tex.image.height);
		inner = NGUIMath.ConvertToTexCoords(inner, tex.image.width, tex.image.height);
		this.Fill(verts, uvs, cols, outer, inner);
	},
});


//
// ..\src\gui\ui\UISpriteData.js
//

NGUI.UISpriteData = function() {
	this.name = "Sprite";
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;

	this.borderLeft = 0;
	this.borderRight = 0;
	this.borderTop = 0;
	this.borderBottom = 0;

	this.paddingLeft = 0;
	this.paddingRight = 0;
	this.paddingTop = 0;
	this.paddingBottom = 0;
};

NGUI.UISpriteData.prototype = {
	constructor: NGUI.UISpriteData,
	Load: function(json) {
		Object.assign(this, json);
		return this;
	},
};