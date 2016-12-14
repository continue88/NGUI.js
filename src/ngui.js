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
// ..\src\gui\unity3d\Color32.js
//

UnityEngine.Color32 = function(r, g, b, a) {
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
    this.a = a || 255;
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
// ..\src\gui\unity3d\Camera.js
//

UnityEngine.Camera = function(gameObject) {
	UnityEngine.Component.call(this, gameObject);

    this.isOrthoGraphic = false;
	this.orthographicSize = 1;
	this.aspect = 1;
	this.fieldOfView = 1;
    this.nearClipPlane = 0.1;
    this.farClipPlane = 1000;
    this.rect = new UnityEngine.Rect();

	this.projectionMatrix = new UnityEngine.Matrix4x4();
	this.cameraToWorldMatrix = this.transform.localToWorldMatrix;
	this.worldToCameraMatrix = this.transform.worldToLocalMatrix;

	// cached matrix. 
	this.viewProjMatrix = undefined;
	this.invViewProjMatrix = undefined; 
};

Object.assign(UnityEngine.Camera.prototype, UnityEngine.Component.prototype, {
    constructor: UnityEngine.Camera,
	Load: function(json) {
		this.isOrthoGraphic = json.orth;
		this.nearClipPlane = json.near;
		this.farClipPlane = json.far;
		this.aspect = json.aspect;
		this.fieldOfView = json.fov;
		if (this.isOrthoGraphic)
			this.projectionMatrix.Ortho(); // TODO: build ortho data.
		else
			this.projectionMatrix.Perspective(this.fieldOfView, this.aspect, this.nearClipPlane, this.farClipPlane);
	},
    GetSides: function(depth, relativeTo) {
        var mSides = [];
		if (this.isOrthoGraphic) {
			var os = this.orthographicSize;
                x0 = -os;
                x1 = os;
                y0 = -os;
                y1 = os;
			var rect = this.rect;
			var size = NGUITools.screenSize;
			var aspect = size.x / size.y;
			aspect *= rect.width / rect.height;
			x0 *= aspect;
			x1 *= aspect;

			// We want to ignore the scale, as scale doesn't affect the camera's view region in Unity
			var t = this.transform;
			var rot = t.rotation;
			var pos = t.position;
			mSides[0] = rot * (new UnityEngine.Vector3(x0, 0, depth)) + pos;
			mSides[1] = rot * (new UnityEngine.Vector3(0, y1, depth)) + pos;
			mSides[2] = rot * (new UnityEngine.Vector3(x1, 0, depth)) + pos;
			mSides[3] = rot * (new UnityEngine.Vector3(0, y0, depth)) + pos;
		} else {
			mSides[0] = this.ViewportToWorldPoint(new UnityEngine.Vector3(0, 0.5, depth));
			mSides[1] = this.ViewportToWorldPoint(new UnityEngine.Vector3(0.5, 1, depth));
			mSides[2] = this.ViewportToWorldPoint(new UnityEngine.Vector3(1, 0.5, depth));
			mSides[3] = this.ViewportToWorldPoint(new UnityEngine.Vector3(0.5, 0, depth));
		}
		
		if (relativeTo !== undefined) {
			for (var i = 0; i < 4; ++i)
				mSides[i] = relativeTo.InverseTransformPoint(mSides[i]);
		}
		return mSides;
    },
    ViewportToWorldPoint: function(screenPoint) {
		screenPoint.x = 2 * screenPoint.x - 1;
		screenPoint.y = 1 - 2 * screenPoint.y;
		screenPoint.z = 0; // TODO: ViewportToWorldPoint
		if (this.viewProjMatrix === undefined) {
			this.viewProjMatrix = new UnityEngine.Matrix4x4();
			this.viewProjMatrix.MultiplyMatrices(this.worldToCameraMatrix, this.projectionMatrix);

			this.invViewProjMatrix = new UnityEngine.Matrix4x4();
			this.invViewProjMatrix.getInverse(this.viewProjMatrix);
		}
		return this.invViewProjMatrix.MultiplyPoint(screenPoint);
    },
});


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
	GetComponent: function(typeName) {
		var componentType = NGUI[componentTypeName] || UnityEngine[componentTypeName];
		for (var i in this.components) {
			var comp = this.components[i];
			if (comp instanceof componentType)
				return comp;
		}
	},
	Load: function(json) {
		this.name = json.name;
		if (json.transform) this.transform.Load(json.transform);
		if (json.components) {
			for (var i in json.components) {
				var componentData = json.components[i];
				var componentTypeName = componentData.meta_type;
				var componentType = NGUI[componentTypeName] || UnityEngine[componentTypeName];
				if (componentType) {
					var component = new componentType(this);
					component.Load(componentData);
					this.components.push(component);
				}
			}
		}
		if (json.children) {
			for (var i in json.children) {
				var go = new UnityEngine.GameObject();
				go.transform.setParent(this.transform);
				go.Load(json.children[i]);
			}
		}
		return this;
	},
};

//
// ..\src\gui\unity3d\Mathf.js
//

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
	clone: function () { return new THREE.Matrix4().fromArray( this.elements ); },
	fromArray: function (array) {
		this.elements.set(array);
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
	Frustum: function(left, right, bottom, top, near, far) {
		var te = this.elements;
		var x = 2 * near / ( right - left );
		var y = 2 * near / ( top - bottom );
		var a = ( right + left ) / ( right - left );
		var b = ( top + bottom ) / ( top - bottom );
		var c = - ( far + near ) / ( far - near );
		var d = - 2 * far * near / ( far - near );
		te[ 0 ] = x;	te[ 4 ] = 0;	te[ 8 ] = a;	te[ 12 ] = 0;
		te[ 1 ] = 0;	te[ 5 ] = y;	te[ 9 ] = b;	te[ 13 ] = 0;
		te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = c;	te[ 14 ] = d;
		te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = - 1;	te[ 15 ] = 0;
		return this;
	},
	Perspective: function(fov, aspect, near, far) {
		var ymax = near * Math.tan( Mathf.Deg2Rad * fov * 0.5 );
		var ymin = - ymax;
		var xmin = ymin * aspect;
		var xmax = ymax * aspect;
		return this.Frustum( xmin, xmax, ymin, ymax, near, far );
	},
	Ortho: function(left, right, top, bottom, near, far) {
		var te = this.elements;
		var w = 1.0 / ( right - left );
		var h = 1.0 / ( top - bottom );
		var p = 1.0 / ( far - near );
		var x = ( right + left ) * w;
		var y = ( top + bottom ) * h;
		var z = ( far + near ) * p;
		te[ 0 ] = 2 * w;	te[ 4 ] = 0;	te[ 8 ] = 0;	te[ 12 ] = - x;
		te[ 1 ] = 0;	te[ 5 ] = 2 * h;	te[ 9 ] = 0;	te[ 13 ] = - y;
		te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = - 2 * p;	te[ 14 ] = - z;
		te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = 0;	te[ 15 ] = 1;
		return this;
	},
};

UnityEngine.Matrix4x4.Temp = new UnityEngine.Matrix4x4();

//
// ..\src\gui\unity3d\Material.js
//

UnityEngine.Material = function() {
	this.shader = undefined; // UnityEngine.Shader
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

//
// ..\src\gui\unity3d\Mesh.js
//

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
            gl.deleteBuffer(attrib.glBuffer);
        }
    },
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
        if (this.vertices === undefined)
            return; // skip update.

        if (this.vertices !== undefined) this.UpdateBuffer(gl, 'position', this.vertices, gl.ARRAY_BUFFER, true, 3, gl.FLOAT, false, 3 * 4, 0);
        if (this.uv !== undefined) this.UpdateBuffer(gl, 'uv', this.uv, gl.ARRAY_BUFFER, true, 2, gl.FLOAT, false, 2 * 4, 0);
        if (this.colors !== undefined) this.UpdateBuffer(gl, 'color', this.colors, gl.ARRAY_BUFFER, true, 4, gl.FLOAT, false, 4 * 4, 0);
        if (this.colors32 !== undefined) this.UpdateBuffer(gl, 'color', this.colors32, gl.ARRAY_BUFFER, true, 4, gl.GL_UNSIGNED_BYTE, false, 4 * 1, 0);
        this.vertices = undefined;
        this.uv = undefined;
        this.colors = undefined;
        this.colors32 = undefined;
    },
    CopyVertexData: function(verts, uvs, colors32) {
        this.vertices = CopyVector3sArray(vertices);
        this.uv = CopyVector2sArray(uvs);
        this.colors32 = CopyColors32Array(colors32);
    },
    SetupVertexAttrib: function(gl, vertexAttrib, programAttrib) {
        gl.bindBuffer( gl.ARRAY_BUFFER, vertexAttrib.glBuffer );
        gl.vertexAttribPointer( programAttrib,
            vertexAttrib.size, 
            vertexAttrib.type, 
            vertexAttrib.normalized, 
            vertexAttrib.stride,
            vertexAttrib.offset);
    },
    SetupVertexAttribs: function(gl, programAttributes) {
        this.UpdateBuffers(gl);
        this.SetupVertexAttrib(gl, this.attributes.position, programAttributes.position);
        this.SetupVertexAttrib(gl, this.attributes.uv, programAttributes.uv);
        this.SetupVertexAttrib(gl, this.attributes.color, programAttributes.color);
    },
}

//
// ..\src\gui\unity3d\MonoBehaviour.js
//


UnityEngine.MonoBehaviour = function(gameObject) {
	UnityEngine.Component.call(this, gameObject);
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
	eulerAngles: function() {
		var matrix = UnityEngine.Matrix4x4.Temp;
		matrix.makeRotationFromQuaternion(this);
		var te = matrix.elements;
		var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
		var m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
		var m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];
		var ret = new UnityEngine.Vector3();
		ret.y = Math.asin(Mathf.Clamp( m13, -1, 1 ));
		if (Math.abs( m13 ) < 0.99999) {
			ret.x = Math.atan2( - m23, m33 );
			ret.z = Math.atan2( - m12, m11 );
		} else {
			ret.x = Math.atan2( m32, m22 );
			ret.z = 0;
		}
		return ret;
	},
	multiply: function(a, b) {
		var qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
		var qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;
		this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
		return this;
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
// ..\src\gui\unity3d\Resources.js
//

UnityEngine.Resources = {
    ResourcesList = {},
    LoadWithType: function(url, type, onLoad) {
        var isScript = (type === 'script'); 
        var element = document.createElement(type);  
        if (isScript) element.type = 'text/javascript';
        element.onload = element.onreadystatechange = function() {  
            if (element.readyState && element.readyState !== 'loaded' && element.readyState !== 'complete')  
                return; 
            
            if (isScript) {
                // the script data file should always begin with: data={...}
                if (onLoad) onLoad(data);
                data = undefined;
            } else {
                if (onLoad) onLoad(element);
            }
        };  
        element.src = url;  
        document.getElementsByTagName('head')[0].appendChild(element);
        return element;  
    },
    Load: function(url, typeName, onLoad) {
        // TODO: check cache.
        this.LoadWithType(url, 'script', function(data) {
            var type = UnityEngine[typeName] || NGUI[typeName];
            if (type !== undefined) {
                var obj = new type();
                obj.Load(data);
                if (onLoad) onLoad(obj);
            } else {
                console.error("Type not found:" + typeName);
            }
        });
    },
    LoadImage: function(url, onLoad) {
        // TODO: check cache.
        this.LoadWithType(url, 'img', function(image) {
            if (onLoad) onLoad(image);
        });
    },
};

//
// ..\src\gui\unity3d\Texture2D.js
//

UnityEngine.Texture2D = function(image) {
    this.image = image;
    this.glTexture = undefined;
    this.glFormat = gl.RGBA;
    this.glType = gl.UNSIGNED_BYTE;
};

UnityEngine.Texture2D.prototype = {
    constructor: UnityEngine.Texture2D,
    destroy: function() {
        if (this.glTexture !== undefined) {
            gl.deleteTexture(this.glTexture);
            this.glTexture = undefined;
        }
    },
    SetupTexture: function(gl, state, slot) {
        if (this.glTexture === undefined) {
            this.glTexture = gl.createTexture();
            state.activeTexture(gl.TEXTURE0 + slot);
            state.bindTexture(gl.TEXTURE_2D, this.glTexture);
            state.texImage2D(gl.TEXTURE_2D, 0, this.glFormat, this.glFormat, this.glType, this.image);
            return;
        }
        state.activeTexture(gl.TEXTURE0 + slot);
        state.bindTexture(gl.TEXTURE_2D, this.glTexture);
    }
};

//
// ..\src\gui\unity3d\Transform.js
//

UnityEngine.Transform = function(gameObject) {
	UnityEngine.Component.call(this, gameObject);

	this.transform = this;
	this.position = new UnityEngine.Vector3(0, 0, 0);
	this.rotation = new UnityEngine.Quaternion();
	this.lossyScale = new UnityEngine.Vector3(1, 1, 1);

	this.localPosition = new UnityEngine.Vector3(0, 0, 0);
	this.localRotation = new UnityEngine.Quaternion();
	this.localScale = new UnityEngine.Vector3(1, 1, 1);

	this.worldToLocalMatrix = new UnityEngine.Matrix4x4();
	this.localToWorldMatrix = new UnityEngine.Matrix4x4();

	this.parent = undefined; // UnityEngine.Transform
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
		if (json.t) this.localPosition.set(json.t.x | 0, json.t.y | 0, json.t.z | 0);
		if (json.r) this.localRotation.euler(json.r.x | 0, json.r.y | 0, json.r.z | 0);
		if (json.s) this.localScale.set(json.s.x | 1, json.s.y | 1, json.s.z | 1);
		this.needUpdate = true;
	},
	Update: function() {
		if (!this.needUpdate) return;
		this.needUpdate = false;
		var localMatrix = new UnityEngine.Matrix4x4();
		localMatrix.SetTRS(this.localPosition, this.localRotation, this.localScale);
		if (this.parent === undefined) {
			this.localToWorldMatrix = localMatrix;
			this.worldToLocalMatrix.getInverse(this.localToWorldMatrix);
			this.position = this.localPosition.clone();
			this.rotation = this.localRotation.clone();
			this.lossyScale = this.localScale.clone();
		} else {
			this.localToWorldMatrix.MultiplyMatrices(this.parent.localToWorldMatrix, localMatrix);
			this.worldToLocalMatrix.getInverse(this.localToWorldMatrix);
			this.position = this.parent.localToWorldMatrix.MultiplyPoint3x4(this.localPosition);
			this.rotation.multiply(this.parent.rotation, this.localRotation);
			this.lossyScale = this.parent.lossyScale.clone().multiply(this.localScale);
		}
		for (var i in this.children)
			this.children[i].Update();
	},
	InverseTransformPoint: function(pos) {
		return this.worldToLocalMatrix.MultiplyPoint3x4(pos);
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
	clone: function () { return new this.constructor( this.x, this.y ); },
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

UnityEngine.Vector3.SqrMagnitude = function(v1, v2) {
	if (v2 === undefined)
		return v1.x * v1.x + v1.y * v1.y + v1.z * v1.z;
	var x = v1.x - v2.x,
		y = v1.y - v2.y,
		z = v1.z - v2.z;
	return x * x + y * y + z * z;
}

UnityEngine.Vector3.prototype = {
	constructor: UnityEngine.Vector3,
	set: function(x, y, z) { this.x = x; this.y = y; this.z = z; },
	clone: function () { return new this.constructor( this.x, this.y, this.z ); },
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
	clone: function () { return new this.constructor( this.x, this.y, this.z, this.w ); },
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
// ..\src\gui\internal\AnchorPoint.js
//

NGUI.AnchorPoint = function(relative) {
    this.target = undefined; // UnityEngine.Transform
    this.relative = relative | 0;
    this.absolute = 0;
    this.rect = undefined; // NGUI.UIRect
    this.targetCam = undefined; // NGUI.UICamera
};

NGUI.AnchorPoint.prototype = {
    constructor: NGUI.AnchorPoint,
    Set: function(target, relative, absolute) {
        if (target instanceof UnityEngine.Transform) {
            this.target = target;
        } else {
            absolute = relative;
            relative = target;
        }
        this.relative = relative;
        this.absolute = Math.floor(absolute + 0.5);
    },
    SetToNearest: function(abs0, abs1, abs2, rel0, rel1, rel2) {
        var a0 = Math.abs(abs0);
        var a1 = Math.abs(abs1);
        var a2 = Math.abs(abs2);
        if (a0 < a1 && a0 < a2) this.Set(rel0 | 0, abs0);
        else if (a1 < a0 && a1 < a2) this.Set(rel1 | 0.5, abs1);
        else this.Set(rel2 | 1, abs2);
    },
    SetHorizontal: function(parent, localPos) {
        if (this.rect) {
            var sides = this.rect.GetSides(parent);
            var targetPos = Mathf.Lerp(sides[0].x, sides[2].x, relative);
            this.absolute = Mathf.FloorToInt(localPos - targetPos + 0.5);
        } else {
            var targetPos = target.position;
            if (parent !== undefined) targetPos = parent.InverseTransformPoint(targetPos);
            this.absolute = Mathf.FloorToInt(localPos - targetPos.x + 0.5);
        }
    },
    SetVertical: function(parent, localPos) {
        if (this.rect) {
            var sides = this.rect.GetSides(parent);
            var targetPos = Mathf.Lerp(sides[3].y, sides[1].y, relative);
            this.absolute = Mathf.FloorToInt(localPos - targetPos + 0.5);
        } else {
            var targetPos = target.position;
            if (parent !== undefined) targetPos = parent.InverseTransformPoint(targetPos);
            this.absolute = Mathf.FloorToInt(localPos - targetPos.y + 0.5);
        }
    },
    GetSides: function(relativeTo) {
        if (this.target !== undefined) {
            if (this.rect !== undefined) return this.rect.GetSides(relativeTo);
            if (this.target.camera !== undefined) return this.target.camera.GetSides(relativeTo);
        }
        return undefined;
    }
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
		if (pv == WidgetPivot.Top || pv == WidgetPivot.Center || pv == WidgetPivot.Bottom) v.x = 0.5;
		else if (pv == WidgetPivot.TopRight || pv == WidgetPivot.Right || pv == WidgetPivot.BottomRight) v.x = 1;
		else v.x = 0;

		if (pv == WidgetPivot.Left || pv == WidgetPivot.Center || pv == WidgetPivot.Right) v.y = 0.5;
		else if (pv == WidgetPivot.TopLeft || pv == WidgetPivot.Top || pv == WidgetPivot.TopRight) v.y = 1;
		else v.y = 0;

		return v;
	},
	RepeatIndex: function(val, max) {
		if (max < 1) return 0;
		while (val < 0) val += max;
		while (val >= max) val -= max;
		return val;
	},
	WrapAngle: function(angle) {
		while (angle > 180) angle -= 360;
		while (angle < -180) angle += 360;
		return angle;
	},
};

//
// ..\src\gui\internal\NGUITools.js
//

NGUITools = {
	screenSize: new UnityEngine.Vector2(100, 100),
	FindInParents: function(go, typeName) {
		var comp = go.GetComponent(typeName);
		if (comp === undefined) {
			var t = go.transform.parent;
			while (t !== undefined && comp === undefined) {
				comp = t.gameObject.GetComponent(typeName);
				t = t.parent;
			}
		}
		return comp;
	},
};

//
// ..\src\gui\internal\UIDrawCall.js
//

NGUI.UIDrawCall = function (name, panel, material) {

	this.mClipCount = panel.clipCount();

	this.widgetCount = 0;
	this.depthStart = 2147483647; // MaxValue = 2147483647
	this.depthEnd = -2147483648; // int.MinValue = -2147483648;
	this.isDirty = false;

	this.baseMaterial = material;
	this.renderQueue = panel.startingRenderQueue;
	this.mSortingOrder = panel.mSortingOrder;
	this.manager = panel;
	this.panel = panel; // NGUI.UIPanel
	
	this.verts = [];// Vector3
	this.uvs = [];// Vector2
	this.cols = [];// Vector3

	this.mMesh = undefined;

	this.ClipRange = []; // Vector4
	this.ClipArgs = []; // Vector4
};

NGUI.UIDrawCall.prototype = {
	constructor: NGUI.UIDrawCall,
	destroy: function() {
		if (this.mMesh) {
			this.mMesh.destroy();
			this.mMesh = undefined;
		}
	},
	UpdateGeometry: function(count) {
		this.mMesh = new UnityEngine.Mesh();
		this.mMesh.CopyVertexData(this.verts, this.uvs, this.cols);
		this.verts.length = 0;
		this.uvs.length = 0;
		this.cols.length = 0;
	},
	SetClipping: function(index, cr, soft, angle) {
		angle *= -Mathf.Deg2Rad;
		var sharpness = new UnityEngine.Vector2(1000.0, 1000.0);
		if (soft.x > 0) sharpness.x = cr.z / soft.x;
		if (soft.y > 0) sharpness.y = cr.w / soft.y;
		this.ClipRange[index] = new UnityEngine.Vector4(-cr.x / cr.z, -cr.y / cr.w, 1 / cr.z, 1 / cr.w);
		this.ClipArgs[index] = new UnityEngine.Vector4(sharpness.x, sharpness.y, Math.sin(angle), Math.cos(angle));
	},
	OnWillRenderObject: function() {
		var currentPanel = this.panel;
		for (var i = 0; currentPanel !== undefined; ) {
			if (currentPanel.hasClipping) {
				var angle = 0;
				var cr = currentPanel.drawCallClipRange.clone();
				if (currentPanel != this.panel) {
					var pos = currentPanel.transform.InverseTransformPoint(this.panel.transform.position);
					cr.x -= pos.x;
					cr.y -= pos.y;
					var v0 = this.panel.transform.rotation.eulerAngles();
					var v1 = currentPanel.transform.rotation.eulerAngles();
					var diff = v1.sub(v0);
					diff.x = NGUIMath.WrapAngle(diff.x);
					diff.y = NGUIMath.WrapAngle(diff.y);
					diff.z = NGUIMath.WrapAngle(diff.z);
					angle = diff.z;
				}
				this.SetClipping(i++, cr, currentPanel.clipSoftness, angle);
			}
			currentPanel = currentPanel.parentPanel;
		}
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
		this.verts.length = 0;
		this.uvs.length = 0;
		this.cols.length = 0;
		this.mRtpVerts.length = 0;
	},
	ApplyTransform: function(widgetToPanel) {
		this.mRtpVerts.length = 0;
		for (var i in this.verts)
			this.mRtpVerts.push(widgetToPanel.MultiplyPoint3x4(this.verts[i]));
	},
	WriteToBuffers: function(v, u, c) {
		for (var i in this.mRtpVerts) {
			v.push(this.mRtpVerts.buffer[i]);
			u.push(this.uvs.buffer[i]);
			c.push(this.cols.buffer[i]);
		}
	},
}

//
// ..\src\gui\internal\UIRect.js
//

NGUI.UIRect = function(gameObject) {
	UnityEngine.MonoBehaviour.call(this, gameObject);

	this.leftAnchor = new NGUI.AnchorPoint();
	this.rightAnchor = new NGUI.AnchorPoint();
	this.bottomAnchor = new NGUI.AnchorPoint();
	this.topAnchor = new NGUI.AnchorPoint();

	this.finalAlpha = 1;
	this.mSides = [];
	this.mCam = undefined;
	this.mUpdateAnchors = true;
	this.mUpdateFrame = -1;
	this.mAnchorsCached = false;
};

Object.assign(NGUI.UIRect.prototype, UnityEngine.MonoBehaviour.prototype, {
	constructor: NGUI.UIRect,
	cameraRayDistance: function() {
		if (this.mCam === undefined) return 0;
		if (this.mCam.isOrthoGraphic) return 100;
		return (this.mCam.nearClipPlane + this.mCam.farClipPlane) * 0.5;
	},
	Load: function(json) {

	},
	GetSides: function(relativeTo) {
		if (this.mCam !== undefined) return this.mCam.GetSides(this.cameraRayDistance(), relativeTo);
		var pos = this.transform.position;
		for (var i = 0; i < 4; ++i) this.mSides[i] = pos;
		if (relativeTo !== undefined) {
			for (var i = 0; i < 4; ++i)
				this.mSides[i] = relativeTo.InverseTransformPoint(this.mSides[i]);
		}
		return this.mSides;
	},
	OnAnchor: function() { },
	UpdateAnchors: function(frame) {
		var anchored = false;
		this.mUpdateFrame = frame;
		if (this.leftAnchor.target !== undefined) {
			anchored = true;
			if (this.leftAnchor.rect !== undefined && this.leftAnchor.rect.mUpdateFrame !== frame)
				this.leftAnchor.rect.UpdateAnchors(frame);
		}
		if (this.bottomAnchor.target!== undefined) {
			anchored = true;
			if (this.bottomAnchor.rect !== undefined && this.bottomAnchor.rect.mUpdateFrame !== frame)
				this.bottomAnchor.rect.UpdateAnchors(frame);
		}
		if (this.rightAnchor.target!== undefined) {
			anchored = true;
			if (this.rightAnchor.rect !== undefined && this.rightAnchor.rect.mUpdateFrame !== frame)
				this.rightAnchor.rect.UpdateAnchors(frame);
		}
		if (this.topAnchor.target!== undefined) {
			anchored = true;
			if (this.topAnchor.rect !== undefined && this.topAnchor.rect.mUpdateFrame !== frame)
				this.topAnchor.rect.UpdateAnchors(frame);
		}
		if (anchored) this.OnAnchor();
	},
});

//
// ..\src\gui\internal\UIWidget.js
//

NGUI.UIWidget = function(gameObject) {
	NGUI.UIRect.call(this, gameObject);
	
	this.mColor = new UnityEngine.Color(1, 1, 1), // UnityEngine.ColorKeywords.white
	this.mPivot = WidgetPivot.Center;
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
	this.minWidth = 2;
	this.minHeight = 2;
	this.aspectRatio = 1;
	this.keepAspectRatio = AspectRatioSource.Free;
	this.fillGeometry = true;
	this.autoResizeBoxCollider = true;
	this.panel = undefined;
	this.drawCall = undefined;
	this.geometry = new NGUI.UIGeometry();
};

WidgetPivot = {
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

AspectRatioSource = {
	Free: 0,
	BasedOnWidth: 1,
	BasedOnHeight: 2,
}

Object.assign(NGUI.UIWidget.prototype, NGUI.UIRect.prototype, {
	constructor: NGUI.UIWidget,
	get pivotOffset() { return NGUIMath.GetPivotOffset(this.mPivot); },
	get material() { return undefined; },
	isVisible: function() { return this.mIsVisibleByAlpha && this.mIsVisibleByPanel && this.mIsInFront && this.finalAlpha > 0.001; },
	hasVertices: function() { return this.geometry.hasVertices(); },
	border: function() { return new UnityEngine.Vector4(0, 0, 0, 0); },
	drawingDimensions: function() {
		var offset = this.pivotOffset;
		var x0 = -offset.x * this.mWidth;
		var y0 = -offset.y * this.mHeight;
		var x1 = x0 + this.mWidth;
		var y1 = y0 + this.mHeight;
		return new UnityEngine.Vector4(
			this.mDrawRegion.x == 0 ? x0 : Mathf.Lerp(x0, x1, this.mDrawRegion.x),
			this.mDrawRegion.y == 0 ? y0 : Mathf.Lerp(y0, y1, this.mDrawRegion.y),
			this.mDrawRegion.z == 1 ? x1 : Mathf.Lerp(x0, x1, this.mDrawRegion.z),
			this.mDrawRegion.w == 1 ? y1 : Mathf.Lerp(y0, y1, this.mDrawRegion.w));
	},
	Load: function(json) {
		NGUI.UIRect.Load.call(this, json);
	},
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
	OnAnchor: function() {
		var lt, bt, rt, tt;
		var trans = this.transform;
		var parent = trans.parent;
		var pos = trans.localPosition;
		var pvt = this.pivotOffset;

		// Attempt to fast-path if all anchors match
		if (this.leftAnchor.target === this.bottomAnchor.target &&
			this.leftAnchor.target === this.rightAnchor.target &&
			this.leftAnchor.target === this.topAnchor.target) {
			var sides = this.leftAnchor.GetSides(parent);
			if (sides !== undefined) {
				lt = NGUIMath.Lerp(sides[0].x, sides[2].x, this.leftAnchor.relative) + this.leftAnchor.absolute;
				rt = NGUIMath.Lerp(sides[0].x, sides[2].x, this.rightAnchor.relative) + this.rightAnchor.absolute;
				bt = NGUIMath.Lerp(sides[3].y, sides[1].y, this.bottomAnchor.relative) + this.bottomAnchor.absolute;
				tt = NGUIMath.Lerp(sides[3].y, sides[1].y, this.topAnchor.relative) + this.topAnchor.absolute;
				this.mIsInFront = true;
			} else { // Anchored to a single transform
				var lp = this.GetLocalPos(leftAnchor, parent);
				lt = lp.x + this.leftAnchor.absolute;
				bt = lp.y + this.bottomAnchor.absolute;
				rt = lp.x + this.rightAnchor.absolute;
				tt = lp.y + this.topAnchor.absolute;
				this.mIsInFront = (!this.hideIfOffScreen || lp.z >= 0);
			}
		} else {
			this.mIsInFront = true;
			if (this.leftAnchor.target !== undefined) { // Left anchor point
				var sides = this.leftAnchor.GetSides(parent);
				if (sides !== undefined)
					lt = Mathf.Lerp(sides[0].x, sides[2].x, this.leftAnchor.relative) + this.leftAnchor.absolute;
				else
					lt = this.GetLocalPos(this.leftAnchor, parent).x + this.leftAnchor.absolute;
			}
			else lt = pos.x - pvt.x * this.mWidth;
			if (this.rightAnchor.target !== undefined) { // Right anchor point
				var sides = this.rightAnchor.GetSides(parent);
				if (sides !== undefined)
					rt = Mathf.Lerp(sides[0].x, sides[2].x, this.rightAnchor.relative) + this.rightAnchor.absolute;
				else
					rt = this.GetLocalPos(this.rightAnchor, parent).x + this.rightAnchor.absolute;
			}
			else rt = pos.x - pvt.x * this.mWidth + this.mWidth;
			if (this.bottomAnchor.target !== undefined) { // Bottom anchor point
				var sides = this.bottomAnchor.GetSides(parent);
				if (sides !== undefined)
					bt = Mathf.Lerp(sides[3].y, sides[1].y, this.bottomAnchor.relative) + this.bottomAnchor.absolute;
				else
					bt = this.GetLocalPos(this.bottomAnchor, parent).y + this.bottomAnchor.absolute;
			}
			else bt = pos.y - pvt.y * MathfmHeight;
			if (this.topAnchor.target !== undefined) { // Top anchor point
				var sides = this.topAnchor.GetSides(parent);
				if (this.sides != null)
					tt = Mathf.Lerp(sides[3].y, sides[1].y, this.topAnchor.relative) + this.topAnchor.absolute;
				else
					tt = this.GetLocalPos(this.topAnchor, parent).y + this.topAnchor.absolute;
			}
			else tt = pos.y - pvt.y * this.mHeight + this.mHeight;
		}

		// Calculate the new position, width and height
		var newPos = new UnityEngine.Vector3(Mathf.Lerp(lt, rt, pvt.x), Mathf.Lerp(bt, tt, pvt.y), pos.z);
		var w = Mathf.FloorToInt(rt - lt + 0.5);
		var h = Mathf.FloorToInt(tt - bt + 0.5);

		// Maintain the aspect ratio if requested and possible
		if (this.keepAspectRatio !== AspectRatioSource.Free && this.aspectRatio !== 0) {
			if (keepAspectRatio === AspectRatioSource.BasedOnHeight)
				w = Mathf.RoundToInt(h * this.aspectRatio);
			else h = Mathf.RoundToInt(w / this.aspectRatio);
		}

		// Don't let the width and height get too small
		if (w < this.minWidth) w = this.minWidth;
		if (h < this.minHeight) h = this.minHeight;

		// Update the position if it has changed
		if (UnityEngine.Vector3.SqrMagnitude(pos, newPos) > 0.001) {
			this.transform.localPosition = newPos;
			this.transform.needUpdate = true;
			if (this.mIsInFront) this.mChanged = true;
		}

		// Update the width and height if it has changed
		if (this.mWidth !== w || this.mHeight !== h) {
			this.mWidth = w;
			this.mHeight = h;
			if (this.mIsInFront) this.mChanged = true;
			//if (autoResizeBoxCollider) ResizeCollider();
		}
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
	NGUI.UIWidget.call(this, gameObject);
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
	drawingColor: function() { 
		return new UnityEngine.Color32(
			this.mColor.r * 255,
			this.mColor.g * 255,
			this.mColor.b * 255,
			this.this.finalAlpha * 255); 
	},
	Load: function(json) {
		NGUI.UIWidget.Load.call(this, json);
	},
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


NGUI.UIBasicSprite.RadialCut = function(xy, uv, fill, invert, corner) {
	if (fill < 0.001) return false;
	if ((corner & 1) == 1) invert = !invert;
	if (!invert && fill > 0.999) return true;
	
	var angle = Mathf.Clamp01(fill);
	if (invert) angle = 1 - angle;
	angle *= 90 * Mathf.Deg2Rad;

	var cos = Math.cos(angle);
	var sin = Math.sin(angle);
	NGUI.UIBasicSprite.RadialCut2(xy, cos, sin, invert, corner);
	NGUI.UIBasicSprite.RadialCut2(uv, cos, sin, invert, corner);
	return true;
}

NGUI.UIBasicSprite.RadialCut2 = function(xy, cos, sin, invert, corner) {
	var i0 = corner;
	var i1 = NGUIMath.RepeatIndex(corner + 1, 4);
	var i2 = NGUIMath.RepeatIndex(corner + 2, 4);
	var i3 = NGUIMath.RepeatIndex(corner + 3, 4);
	if ((corner & 1) == 1) {
		if (sin > cos) {
			cos /= sin;
			sin = 1;
			if (invert) {
				xy[i1].x = Mathf.Lerp(xy[i0].x, xy[i2].x, cos);
				xy[i2].x = xy[i1].x;
			}
		} else if (cos > sin) {
			sin /= cos;
			cos = 1;
			if (!invert) {
				xy[i2].y = Mathf.Lerp(xy[i0].y, xy[i2].y, sin);
				xy[i3].y = xy[i2].y;
			}
		} else {
			cos = 1;
			sin = 1;
		}
		if (!invert) xy[i3].x = Mathf.Lerp(xy[i0].x, xy[i2].x, cos);
		else xy[i1].y = Mathf.Lerp(xy[i0].y, xy[i2].y, sin);
	} else {
		if (cos > sin) {
			sin /= cos;
			cos = 1;
			if (!invert) {
				xy[i1].y = Mathf.Lerp(xy[i0].y, xy[i2].y, sin);
				xy[i2].y = xy[i1].y;
			}
		} else if (sin > cos) {
			cos /= sin;
			sin = 1;
			if (invert) {
				xy[i2].x = Mathf.Lerp(xy[i0].x, xy[i2].x, cos);
				xy[i3].x = xy[i2].x;
			}
		} else {
			cos = 1;
			sin = 1;
		}
		if (invert) xy[i3].y = Mathf.Lerp(xy[i0].y, xy[i2].y, sin);
		else xy[i1].x = Mathf.Lerp(xy[i0].x, xy[i2].x, cos);
	}
}

//
// ..\src\gui\three\GUIRenderer.js
//

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

//
// ..\src\gui\three\GUIPlugin.js
//

THREE.GUIPlugin = function(renderer, drawCalls) {
	var gl = renderer.context;
	var state = renderer.state;
	var vertexBuffer, elementBuffer;
	var programInfos;
	var texture;

	// decompose matrixWorld
	var spritePosition = new THREE.Vector3();
	var spriteRotation = new THREE.Quaternion();
	var spriteScale = new THREE.Vector3();

	this.render = function ( scene, camera ) {
		if (programInfos === undefined)
			programInfos = createProgramInfos();

		state.disable( gl.CULL_FACE );
        state.setBlending( THREE.NormalBlending );
        state.setDepthTest( false );
        state.setDepthWrite( false );
        
        for (var i in drawCalls) {
            var drawCall = drawCalls[i];
            var mesh = drawCall.mMesh;
            var programInfo = programInfos[drawCall.mClipCount];
                
            gl.useProgram( programInfo.program );
            state.initAttributes();
            state.enableAttribute( programInfo.attributes.position );
            state.enableAttribute( programInfo.attributes.uv );
            state.enableAttribute( programInfo.attributes.color );
            state.disableUnusedAttributes();

            // vertex buffers.
            mesh.SetupVertexAttribs(gl, programInfo.attributes);

            // TODO: setup the UNITY_MATRIX_MVP (ModelViewProj)
            gl.uniformMatrix4fv( programInfo.uniforms.UNITY_MATRIX_MVP, false, camera.projectionMatrix.elements );
            if (programInfo.uniforms._ClipRange0 >= 0) {
                var clipRange = drawCall.ClipRange[0],
                    clipArgs = drawCall.ClipArgs[0];
                gl.uniform4f(programInfo.uniforms._ClipRange0, clipRange.x, clipRange.y, clipRange.z, clipRange.w);
                gl.uniform4f(programInfo.uniforms._ClipArgs0, clipArgs.x, clipArgs.y, clipArgs.z, clipArgs.w);
            }
            if (programInfo.uniforms._ClipRange1 >= 0) {
                var clipRange = drawCall.ClipRange[1],
                    clipArgs = drawCall.ClipArgs[1];
                gl.uniform4f(programInfo.uniforms._ClipRange1, clipRange.x, clipRange.y, clipRange.z, clipRange.w);
                gl.uniform4f(programInfo.uniforms._ClipRange1, clipArgs.x, clipArgs.y, clipArgs.z, clipArgs.w);
            }
            if (programInfo.uniforms._ClipRange2 >= 0) {
                var clipRange = drawCall.ClipRange[2],
                    clipArgs = drawCall.ClipArgs[2];
                gl.uniform4f(programInfo.uniforms._ClipRange2, clipRange.x, clipRange.y, clipRange.z, clipRange.w);
                gl.uniform4f(programInfo.uniforms._ClipRange2, clipArgs.x, clipArgs.y, clipArgs.z, clipArgs.w);
            }

            // setup texture. 
            state.activeTexture( gl.TEXTURE0 );
            gl.uniform1i( uniforms.map, 0 );
            
			if (material.map) {
				renderer.setTexture2D( material.map, 0 );
			} else {
				renderer.setTexture2D( texture, 0 );
			}

			gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );
		}

		// restore gl
		state.enable( gl.CULL_FACE );
		renderer.resetGLState();
	};

	function createProgram(vertexShaderSrc, fragmentShaderSrc) {
		var program = gl.createProgram();
		var vertexShader = gl.createShader(gl.VERTEX_SHADER);
		var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(vertexShader, vertexShaderSrc);
		gl.shaderSource(fragmentShader,  fragmentShaderSrc);
		gl.compileShader(vertexShader);
		gl.compileShader(fragmentShader);
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program );
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
		return program;
	}

    function createProgramInfos() {
        var program0 = createProgram([
			'precision ' + renderer.getPrecision() + ' float;',
			'uniform mat4 UNITY_MATRIX_MVP;',
			'attribute vec3 vertex;',
			'attribute vec2 uv;',
			'attribute vec3 color;',
			'varying vec2 vUV;',
            'varying vec3 vColor;',
			'void main() {',
            '   vUV = uv',
            '   vColor = color',
			'   gl_Position = UNITY_MATRIX_MVP * vec4(vertex, 1.0);',
			'}'
		].join('\n'), [
			'precision ' + renderer.getPrecision() + ' float;',
			'uniform sampler2D _MainTex;',
			'varying vec2 vUV;',
            'varying vec3 vColor;',
			'void main() {',
				'gl_FragColor = texture2D(_MainTex, vUV) * vec4(vColor, 1.0);',
			'}'
		].join('\n'));
        
        var program1 = createProgram([
			'precision ' + renderer.getPrecision() + ' float;',
			'uniform mat4 UNITY_MATRIX_MVP;',
            'uniform vec4 _ClipRange0;',
			'attribute vec3 vertex;',
			'attribute vec2 uv;',
			'attribute vec3 color;',
			'varying vec2 vUV;',
            'varying vec3 vColor;',
            'varying vec2 vWorldPos;',
			'void main() {',
            '   vUV = uv',
            '   vColor = color',
            '   vWorldPos = vertex * _ClipRange0.zw + _ClipRange0.xy;',
			'   gl_Position = UNITY_MATRIX_MVP * vec4(vertex, 1.0);',
			'}'
		].join('\n'), [
			'precision ' + renderer.getPrecision() + ' float;',
			'uniform sampler2D _MainTex;',
            'uniform vec2 _ClipArgs0;',
			'varying vec2 vUV;',
            'varying vec3 vColor;',
            'varying vec2 vWorldPos;',
			'void main() {',
            '   vec2 factor = (vec2(1.0, 1.0) - abs(vWorldPos)) * _ClipArgs0;',
            '   vec4 col = texture2D(_MainTex, vUV) * vec4(vColor, 1.0);',
            '   col.a *= clamp( min(factor.x, factor.y), 0.0, 1.0);',
			'   gl_FragColor = col;',
			'}'
		].join('\n'));
        
        var program2 = createProgram([
			'precision ' + renderer.getPrecision() + ' float;',
			'uniform mat4 UNITY_MATRIX_MVP;',
            'uniform vec4 _ClipRange0;',
            'uniform vec4 _ClipRange1;',
            'uniform vec4 _ClipArgs1;',
			'attribute vec3 vertex;',
			'attribute vec2 uv;',
			'attribute vec3 color;',
			'varying vec2 vUV;',
            'varying vec3 vColor;',
            'varying vec4 vWorldPos;',
			'vec2 Rotate (vec2 v, vec2 rot) {',
			'	vec2 ret;',
			'	ret.x = v.x * rot.y - v.y * rot.x;',
			'	ret.y = v.x * rot.x + v.y * rot.y;',
			'	return ret;',
			'}',
			'void main() {',
            '   vUV = uv',
            '   vColor = color',
            '   vWorldPos.xy = vertex * _ClipRange0.zw + _ClipRange0.xy;',
            '   vWorldPos.zw = Rotate(vertex.xy, _ClipArgs1.zw) * _ClipRange1.zw + _ClipRange1.xy;',
			'   gl_Position = UNITY_MATRIX_MVP * vec4(vertex, 1.0);',
			'}'
		].join('\n'), [
			'precision ' + renderer.getPrecision() + ' float;',
			'uniform sampler2D _MainTex;',
            'uniform vec4 _ClipArgs0;',
            'uniform vec4 _ClipArgs1;',
			'varying vec2 vUV;',
            'varying vec3 vColor;',
            'varying vec4 vWorldPos;',
			'void main() {',
            '   vec2 factor = (vec2(1.0, 1.0) - abs(vWorldPos.xy)) * _ClipArgs0.xy;',
            '   float f = min(factor.x, factor.y);',
            '   factor = (vec2(1.0, 1.0) - abs(vWorldPos.zw)) * _ClipArgs1.xy;',
            '   f = min(f, min(factor.x, factor.y));',
            '   vec4 col = texture2D(_MainTex, vUV) * vec4(vColor, 1.0);',
            '   col.a *= clamp(f, 0.0, 1.0);',
			'   gl_FragColor = col;',
			'}'
		].join('\n'));
        
        var program3 = createProgram([
			'precision ' + renderer.getPrecision() + ' float;',
			'uniform mat4 UNITY_MATRIX_MVP;',
            'uniform vec4 _ClipRange0;',
            'uniform vec4 _ClipRange1;',
            'uniform vec4 _ClipArgs1;',
            'uniform vec4 _ClipArgs2;',
			'attribute vec3 vertex;',
			'attribute vec2 uv;',
			'attribute vec3 color;',
			'varying vec2 vUV;',
            'varying vec3 vColor;',
            'varying vec4 vWorldPos;',
            'varying vec2 vWorldPos2;',
			'vec2 Rotate (vec2 v, vec2 rot) {',
			'	vec2 ret;',
			'	ret.x = v.x * rot.y - v.y * rot.x;',
			'	ret.y = v.x * rot.x + v.y * rot.y;',
			'	return ret;',
			'}',
			'void main() {',
            '   vUV = uv',
            '   vColor = color',
            '   vWorldPos.xy = vertex * _ClipRange0.zw + _ClipRange0.xy;',
            '   vWorldPos.zw = Rotate(vertex.xy, _ClipArgs1.zw) * _ClipRange1.zw + _ClipRange1.xy;',
            '   vWorldPos2 = Rotate(vertex.xy, _ClipArgs2.zw) * _ClipRange2.zw + _ClipRange2.xy;',
			'   gl_Position = UNITY_MATRIX_MVP * vec4(vertex, 1.0);',
			'}'
		].join('\n'), [
			'precision ' + renderer.getPrecision() + ' float;',
			'uniform sampler2D _MainTex;',
            'uniform vec4 _ClipArgs0;',
            'uniform vec4 _ClipArgs1;',
            'uniform vec4 _ClipArgs2;',
			'varying vec2 vUV;',
            'varying vec3 vColor;',
            'varying vec4 vWorldPos;',
            'varying vec2 vWorldPos2;',
			'void main() {',
            '   vec2 factor = (vec2(1.0, 1.0) - abs(vWorldPos.xy)) * _ClipArgs0.xy;',
            '   float f = min(factor.x, factor.y);',
            '   factor = (vec2(1.0, 1.0) - abs(vWorldPos.zw)) * _ClipArgs1.xy;',
            '   f = min(f, min(factor.x, factor.y));',
            '   factor = (vec2(1.0, 1.0) - abs(vWorldPos2)) * _ClipArgs2.xy;',
            '   f = min(f, min(factor.x, factor.y));',
            '   vec4 col = texture2D(_MainTex, vUV) * vec4(vColor, 1.0);',
            '   col.a *= clamp(f, 0.0, 1.0);',
			'   gl_FragColor = col;',
			'}'
		].join('\n'));
        
        var programs = [program0, program1, program2, program3];
        var programInfos = [];
        for (var i = 0; i < programs.length; i++) {
            var program = programs[i];
            var programInfo = {
                program: program,
                attributes: {
                    position: gl.getAttribLocation ( program, 'vertex' ),
                    uv: gl.getAttribLocation ( program, 'uv' ),
                    color: gl.getAttribLocation ( program, 'color' ) 
                },
                uniforms: {
                    UNITY_MATRIX_MVP: gl.getUniformLocation( program, 'UNITY_MATRIX_MVP'),
                },
            }
            if (i >= 1) {
                programInfo.uniforms._ClipRange0 = gl.getUniformLocation( program1, '_ClipRange0');
                programInfo.uniforms._ClipArgs0 = gl.getUniformLocation( program1, '_ClipArgs0');
            } 
            if (i >= 2) {
                programInfo.uniforms._ClipRange1 = gl.getUniformLocation( program1, '_ClipRange1');
                programInfo.uniforms._ClipArgs1 = gl.getUniformLocation( program1, '_ClipArgs1');
            }
            if (i >= 3) {
                programInfo.uniforms._ClipRange2 = gl.getUniformLocation( program1, '_ClipRange2');
                programInfo.uniforms._ClipArgs2 = gl.getUniformLocation( program1, '_ClipArgs2');
            }
            programInfos.push(programInfo);
        }
        return programInfos;
    }
};

//
// ..\src\gui\ui\UIAtlas.js
//

NGUI.UIAtlas = function(gameObject) {
	this.material = undefined; // { image:{width:100, height:100}, tex: './tex/atlas.png' }
	this.mSprites = {}; // NGUI.UISpriteData
}

NGUI.UIAtlas.prototype = {
	constructor: NGUI.UIAtlas,
	GetSprite: function(name) {
		return this.mSprites[name];
	},
	Load: function(json) {
		var sprites = json.sprites; // sprites
		if (sprites !== undefined) {
			for (var key in sprites) {
				var sprite = new NGUI.UISpriteData();
				sprite.Load(sprites[key]);
				this.mSprites[sprite.name] = sprite;
			}
		}
		this.material = json.mat; // just copy
	}
};

//
// ..\src\gui\ui\UIPanel.js
//

NGUI.UIPanel = function(gameObject) {
	NGUI.UIRect.call(this, gameObject);

	this.mDepth = 0;
	this.mSortingOrder = 0;
	this.mUpdateFrame = 0;
	this.mUpdateScroll = false;
	this.mRebuild = true;
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
	this.parentPanel = undefined;
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
	get hasClipping() { return this.mClipping === Clipping.SoftClip;  },
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
	clipCount: function() {
		var count = 0;
		var p = this;
		while (p !== undefined) {
			if (p.mClipping === Clipping.SoftClip) ++count;
			p = p.parentPanel;
		}
		return count;
	},
	Load: function(json) {
		NGUI.UIRect.Load.call(this, json);
		this.FindParent();
	},
	FindParent: function() {
		var parent = this.transform.parent;
		this.parentPanel = (parent !== undefined) ? NGUITools.FindInParents(parent.gameObject, 'UIPanel') : undefined;
	},
	UpdateSelf: function(frame) {
		this.UpdateTransformMatrix(frame);
		this.UpdateLayers(frame);
		this.UpdateWidgets(frame);
		if (this.mRebuild) {
			this.mRebuild = false;
			this.FillAllDrawCalls();
		} else {
			for (var i = 0; i < this.drawCalls.length;) {
				var dc = this.drawCalls[i];
				if (dc.isDirty && !this.FillDrawCall(dc)) {
					dc.destroy();
					this.drawCalls.splice(i, 1);
					continue;
				}
				++i;
			}
		}
		if (this.mUpdateScroll) {
			this.mUpdateScroll = false;
			//UIScrollView sv = GetComponent<UIScrollView>();
			//if (sv !== undefined) sv.UpdateScrollbars();
		}
	},
	UpdateTransformMatrix: function(frame) {
		this.worldToLocal = this.transform.worldToLocalMatrix;
		var size = this.GetViewSize().multiplyScalar(0.5);
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
					if (w.drawCall !== undefined)
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
		if (parent !== undefined)
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

		var mat = undefined;
		var dc = undefined;
		var count = 0;
		for (var i in this.widgets) {
			var w = this.widgets[i];
			if (!w.isVisible() || !w.hasVertices()) {
				w.drawCall = undefined;
				continue;
			}
			var mt = w.material;
			if (mat != mt) {
				if (dc !== undefined && dc.verts.length != 0) {
					this.drawCalls.push(dc);
					dc.UpdateGeometry(count);
					count = 0;
					dc = undefined;
				}
				mat = mt;
			}

			if (mat !== undefined) {
				if (dc === undefined) {
					dc = new NGUI.UIDrawCall("", this, mat);
					dc.depthStart = w.mDepth;
					dc.depthEnd = dc.depthStart;
				} else {
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
	UnityEngine.MonoBehaviour.call(this, gameObject);
	
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
	NGUI.UIBasicSprite.call(this);
	this.mAtlas = undefined;
	this.mSpriteName = '';
	this.mSprite = undefined; // refrence to UISpriteData
};

Object.assign(NGUI.UISprite.prototype, NGUI.UIBasicSprite.prototype, {
	constructor: NGUI.UISprite,
	get material() { return this.mAtlas ? this.mAtlas.material : undefined; },
	border: function() {
		var sp = this.GetAtlasSprite();
		if (sp) return new UnityEngine.Vector4(sp.borderLeft, sp.borderBottom, sp.borderRight, sp.borderTop);
		return new UnityEngine.Vector4(0, 0, 0, 0); 
	},
	Load: function(json) {
		NGUI.UIBasicSprite.Load.call(this, json);
		// json.atlas; // TODO: find atlas with name.
		this.mSpriteName = this.sprite;
	},
	GetAtlasSprite: function() {
		if (this.mAtlas !== undefined && this.mSprite === undefined) 
			this.mSprite = this.mAtlas.GetSprite(this.mSpriteName);
		return this.mSprite;
	},
	OnFill: function(verts, uvs, cols) {
		if (this.mAtlas === undefined) return;
		var mat = this.mAtlas.material;
		if (mat === undefined || mat.image === undefined) return;

		var sprite = this.GetAtlasSprite();
		if (sprite === undefined) return;

		var outer = new NGUI.Rect(sprite.x, sprite.y, sprite.width, sprite.height);
		var inner = new NGUI.Rect(sprite.x + sprite.borderLeft, sprite.y + sprite.borderTop,
			sprite.width - sprite.borderLeft - sprite.borderRight,
			sprite.height - sprite.borderBottom - sprite.borderTop);

		var image = mat.image;
		outer = NGUIMath.ConvertToTexCoords(outer, image.width, image.height);
		inner = NGUIMath.ConvertToTexCoords(inner, image.width, image.height);
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
		this.name = json.name;
		this.x = json.x;
		this.y = json.y;
		this.width = json.w;
		this.height = json.h;
		this.borderLeft = json.bl | 0;
		this.borderRight = json.br | 0;
		this.borderTop = json.bt | 0;
		this.borderBottom = json.bb | 0;
		this.paddingLeft = json.pl | 0;
		this.paddingRight = json.pr | 0;
		this.paddingTop = json.pt | 0;
		this.paddingBottom = json.pb | 0;
		return this;
	},
};