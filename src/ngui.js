// autogen by combine tools.


//
// ..\src\gui\gui.js
//

UnityEngine={
    GetType: function(typeName) {
        if (typeof(typeName) === 'function') return typeName; 
        var type = NGUI[typeName] || UnityEngine[typeName];
        if (typeof(type) === 'function') return type;
    }
};

NGUI={

};

WebGL={

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

const COLOR_FROM_32 = 1/255;
UnityEngine.Color.Lerp = function(a, b, t) {
	return new UnityEngine.Color(
		Mathf.Lerp(a.r, b.r, t),
		Mathf.Lerp(a.g, b.g, t),
		Mathf.Lerp(a.b, b.b, t),
		Mathf.Lerp(a.a, b.a, t));
}

UnityEngine.Color.prototype = {
	constructor: UnityEngine.Color,
	clone: function () { return new this.constructor(this.r, this.g, this.b, this.a); },
	set: function(r, g, b, a) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
		return this;
	},
	set32: function(r, g, b, a) {
		this.r = r * COLOR_FROM_32;
		this.g = g * COLOR_FROM_32;
		this.b = b * COLOR_FROM_32;
		this.a = a * COLOR_FROM_32;
		return this;
	},
	add: function(v) {
		this.r += v.r;
		this.g += v.g;
		this.b += v.b;
		this.a += v.a;
		return this;
	},
	sub: function(v) {
		this.r -= v.r;
		this.g -= v.g;
		this.b -= v.b;
		this.a -= v.a;
		return this;
	},
	mul: function(v) {
		this.r *= v.r;
		this.g *= v.g;
		this.b *= v.b;
		this.a *= v.a;
		return this;
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
// ..\src\gui\unity3d\Object.js
//
UnityEngine.Object = function() {
    this.instanceID = UnityEngine.Object.StaticId++;
};

UnityEngine.Object.StaticId = 10000;
UnityEngine.Object.Map = {};
UnityEngine.Object.Destroy = function(obj) {
    var id = obj.GetInstanceID();
    var map = UnityEngine.Object.Map;
    var obj = map[id];
    if (obj === undefined)
        return console.log('Could not delete object with id (Not found): ' + id);
    if (obj.OnDestroy !== undefined) obj.OnDestroy(); // execute the [OnDestroy]
    delete map[id];
}
UnityEngine.Object.RegisterObject = function(obj) {
    var id = obj.GetInstanceID();
    if (id === undefined)
        return console.error('Register object failed with not id.' + obj);
    var map = UnityEngine.Object.Map;
    if (map[id] !== undefined)
        console.warn('Object with id already register, override it: ' + id);
    map[id] = obj;
}
UnityEngine.Object.FindObjectWithId = function(id) {
    return UnityEngine.Object.Map[id];
}
UnityEngine.Object.FindObjectOfType = function(type) {
    type = UnityEngine.GetType(type);
    var map = UnityEngine.Object.Map;
    for (var i in map) {
        var obj = map[i];
        if (obj instanceof type) return obj;
    }
}
UnityEngine.Object.FindObjectsOfType = function(type) {
    type = UnityEngine.GetType(type);
    var map = UnityEngine.Object.Map;
    var ret = [];
    for (var i in map) {
        var obj = map[i];
        if (obj instanceof type) ret.push(obj);
    }
    return ret;
}

UnityEngine.Object.prototype = {
    constructor: UnityEngine.Object,
    GetInstanceID: function() { return this.instanceID; },
    Load: function(json) {
        if (json.meta_id != 0)
            this.instanceID = json.meta_id;
        else
            console.warn('no id found!!!');
        UnityEngine.Object.RegisterObject(this);
    },
    SendMessage: function(methodName, value) {
        var func = this[methodName];
        if (typeof(func) === 'function') func(value);
     },
};

//
// ..\src\gui\unity3d\Component.js
//

UnityEngine.Component = function(gameObject) {
	UnityEngine.Object.call(this);
	this.gameObject = gameObject;
	this.transform = gameObject.transform; // UnityEngine.Transform
};

Object.assign(UnityEngine.Component.prototype = Object.create(UnityEngine.Object.prototype), {
	constructor: UnityEngine.Component,
	Load: function(json) {
		UnityEngine.Object.prototype.Load.call(this, json);
	},
	GetComponent: function(type) { return this.gameObject.GetComponent(type); },
	GetComponentInChildren: function(type) { return this.gameObject.GetComponentInChildren(type); },
	GetComponentsInChildren: function(type) { return this.gameObject.GetComponentsInChildren(type); },
});

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
	this.rect = new UnityEngine.Rect(0, 0, 1, 1);

	this.projectionMatrix = new UnityEngine.Matrix4x4();
	this.cameraToWorldMatrix = new UnityEngine.Matrix4x4();
	this.worldToCameraMatrix = new UnityEngine.Matrix4x4();

	// cached matrix. 
	this.viewProjMatrix = undefined;
	this.invViewProjMatrix = undefined; 
};

Object.assign(UnityEngine.Camera.prototype = Object.create(UnityEngine.Component.prototype), {
	constructor: UnityEngine.Camera,
	getViewProjMatrix: function() {
		if (this.viewProjMatrix === undefined) {
			this.viewProjMatrix = new UnityEngine.Matrix4x4();
			this.viewProjMatrix.MultiplyMatrices(this.worldToCameraMatrix, this.projectionMatrix);
		}
		return this.viewProjMatrix;
	},
	getInvViewProjMatrix: function() {
		if (this.invViewProjMatrix === undefined) {
			var viewProjMatrix = this.getViewProjMatrix();
			this.invViewProjMatrix = new UnityEngine.Matrix4x4();
			this.invViewProjMatrix.getInverse(viewProjMatrix);
		}
		return this.invViewProjMatrix;
	},
	setAspect(aspect) {
		this.aspect = aspect;
		if (this.isOrthoGraphic === true)
			this.projectionMatrix.Ortho(-this.aspect, this.aspect, 1, -1, this.nearClipPlane, this.farClipPlane);
		else
			this.projectionMatrix.Perspective(this.fieldOfView, this.aspect, this.nearClipPlane, this.farClipPlane);

		this.cameraToWorldMatrix.SetTRS(this.transform.position, this.transform.rotation, new UnityEngine.Vector3(1, 1, 1));
		this.worldToCameraMatrix.getInverse(this.cameraToWorldMatrix);
		this.viewProjMatrix = undefined;
		this.invViewProjMatrix = undefined;
	},
	Load: function(json) {
		this.isOrthoGraphic = json.orth;
		this.nearClipPlane = json.near;
		this.farClipPlane = json.far;
		this.aspect = json.aspect;
		this.fieldOfView = json.fov;
		this.setAspect(json.aspect);
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
			var mat = UnityEngine.Matrix4x4.Temp;
			mat.makeRotationFromQuaternion(rot);
			mSides[0] = mat.MultiplyVector(new UnityEngine.Vector3(x0, 0, depth)).add(pos);
			mSides[1] = mat.MultiplyVector(new UnityEngine.Vector3(0, y1, depth)).add(pos);
			mSides[2] = mat.MultiplyVector(new UnityEngine.Vector3(x1, 0, depth)).add(pos);
			mSides[3] = mat.MultiplyVector(new UnityEngine.Vector3(0, y0, depth)).add(pos);
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
		return this.getInvViewProjMatrix().MultiplyPoint(screenPoint);
	},
	WorldToViewportPoint: function(worldPos) {
		var screenPos = this.getViewProjMatrix(worldPos);
		screenPos.x = (screenPos.x + 1) * 0.5;
		screenPos.y = (1 - screenPos.y) * 0.5;
		return screenPos;
	},
});


//
// ..\src\gui\unity3d\EventDispatcher.js
//

UnityEngine.EventDispatcher = function() {
    this._listeners = {};
}

UnityEngine.EventDispatcher.prototype = {
    constructor: UnityEngine.EventDispatcher,
	on: function(type, listener) {
		var listeners = this._listeners;
		if (listeners[ type ] === undefined) listeners[ type ] = [];
		if (listeners[ type ].indexOf(listener) === - 1)
			listeners[ type ].push(listener);
	},
	remove: function(type, listener) {
		var listeners = this._listeners;
		var listenerArray = listeners[ type ];
		if (listenerArray !== undefined) {
			var index = listenerArray.indexOf(listener);
			if (index !== - 1)
				listenerArray.splice(index, 1);
		}
	},
	emit: function(event) {
		var listeners = this._listeners;
		var listenerArray = listeners[ event.type ];
		if (listenerArray !== undefined) {
			event.target = this;
			var array = [], i = 0;
			var length = listenerArray.length;
			for (i = 0; i < length; i ++)
				array[ i ] = listenerArray[ i ];
			for (i = 0; i < length; i ++)
				array[ i ].call(this, event);
		}
	}
};

//
// ..\src\gui\unity3d\GameObject.js
//

UnityEngine.GameObject = function () {
	UnityEngine.Object.call(this);
	this.name = '';
	this.transform = new UnityEngine.Transform(this);
	this.components = [];
	this.activeSelf = true;
	this.layer = 0;
};

Object.assign(UnityEngine.GameObject.prototype = Object.create(UnityEngine.Object.prototype), {
	constructor: UnityEngine.GameObject,
	GetComponent: function(typeName) {
		var componentType = UnityEngine.GetType(typeName);
		for (var i in this.components) {
			var comp = this.components[i];
			if (comp instanceof componentType)
				return comp;
		}
	},
	GetComponentInChildren: function(typeName) {
		var type = UnityEngine.GetType(typeName);
		var comp = this.GetComponent(type);
		if (comp !== undefined) return comp;
		
		var switchList = [];
		var testList = [this.transform];
		while (true) {
			switchList.length = 0;
			for (var i in testList) {
				var transform = testList[i]; 
				for (var c in transform.children) {
					var child = transform.children[c];
					var comp = child.gameObject.GetComponent(type);
					if (comp !== undefined) return comp; // check child.
					if (child.children.length > 0)
						switchList.push(child);
				}
			}
			if (switchList.length === 0) break;
			var tmp = testList;
			testList = switchList;
			switchList = tmp;
		}
	},
	GetComponentsInChildren: function(typeName) {
		var foundList = [];
		var type = UnityEngine.GetType(typeName);
		var comp = this.GetComponent(type);
		if (comp !== undefined) foundList.push(comp);

		var switchList = [];
		var testList = [this.transform];
		while (true) {
			switchList.length = 0;
			for (var i in testList) {
				var transform = testList[i]; 
				for (var c in transform.children) {
					var child = transform.children[c];
					var comp = child.gameObject.GetComponent(type);
					if (comp !== undefined) foundList.push(comp);
					if (child.children.length > 0)
						switchList.push(child);
				}
			}
			if (switchList.length === 0) break;
			var tmp = testList;
			testList = switchList;
			switchList = tmp;
		}
		return foundList;
	},
	LoadInternal: function(datas, onCreate, onLoad) {
		if (datas === undefined) return;
		var createList = [];
		for (var i in datas) {
			var data = datas[i];
			var obj = onCreate(data);
			if (obj !== undefined) {
				obj._data_ = data;
				createList.push(obj);
			}
		}
		for (var i in createList) {
			var obj = createList[i];
			onLoad(obj, obj._data_);
			obj._data_ = undefined;
		}
	},
	Load: function(json) {
		UnityEngine.Object.prototype.Load.call(this, json);
		var self = this;
		var trans = json.t;
		var comps = json.c;
		var child = json.q;
		self.name = json.n;
		if (trans !== undefined) self.transform.Load(trans);
		this.LoadInternal(comps, function(data) {
			var typeName = data.meta_type;
			var componentType = UnityEngine.GetType(typeName);
			if (componentType !== undefined) {
				var component = new componentType(self);
				self.components.push(component);
				return component;
			}
		}, function(component, data) {
			component.Load(data);
		});
		this.LoadInternal(child, function(data) {
			var go = new UnityEngine.GameObject();
			go.transform.setParent(self.transform);
			return go;
		}, function(go, data) {
			go.Load(data);
		});
		return this;
	},
	SetActive: function(active) {
		this.activeSelf = active;
	},
    SendMessage: function(methodName, value) {
		for (var i in this.components)
			this.components[i].SendMessage(methodName, value);
     },
});

//
// ..\src\gui\unity3d\Mathf.js
//

Mathf = UnityEngine.Mathf = {
	Deg2Rad: 0.0174532924,
	Rad2Deg: 57.29578,
	FloorToInt: function(v) { return Math.floor(v); },
	RoundToInt: function(v) { return Math.floor(v + 0.5); },
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
	clone: function () { return new UnityEngine.Matrix4x4().fromArray( this.elements ); },
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
			gl.deleteBuffer(attrib.glBuffer);
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
		this.vertexCount = verts.length;
		this.triangleCount = (triangles !== undefined) ? triangles.length / 3 : verts.length / 3;
		this.vertices = CopyVector3sArray(verts);
		this.uv = CopyVector2sArray(uvs);
		this.colors32 = CopyColors32Array(colors32);
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

//
// ..\src\gui\unity3d\MonoBehaviour.js
//


UnityEngine.MonoBehaviour = function(gameObject) {
	UnityEngine.Component.call(this, gameObject);
	this.enabled = true;
};

Object.assign(UnityEngine.MonoBehaviour.prototype = Object.create(UnityEngine.Component.prototype), {
	constructor: UnityEngine.MonoBehaviour,
	Load: function(json) {
		UnityEngine.Component.prototype.Load.call(this, json);
	},
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
	clone: function () { return new this.constructor( this.x, this.y, this.z, this.w ); },
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
	clone: function () { return new this.constructor(this.left, this.top, this.width, this.height); },
	get left() { return this.xMin; },
	get top() { return this.yMin; },
	get width() { return this.xMax - this.xMin; },
	get height() { return this.yMax - this.yMin; },
};

//
// ..\src\gui\unity3d\Resources.js
//

UnityEngine.Resources = {
	resourcesList: {},
	objectLoading: 0,
	getDataRoot: function() { return _data_; },
	getUrlName: function(url) { 
		var name = url.substring(url.lastIndexOf('/') + 1);
		var ext = name.lastIndexOf('.');
		if (ext < 0) ext = undefined;
		return name.substring(0, ext);
	},
	getFromCache: function(name, typeName) {
		var typeList = this.resourcesList[typeName];
		if (typeList !== undefined) return typeList[name]; 
	},
	addToCache: function(url, typeName, obj) {
		var typeList = this.resourcesList[typeName];
		if (typeList === undefined) 
			typeList = this.resourcesList[typeName] = {};
		var name = this.getUrlName(url);
		typeList[name] = obj;
	},
	onLoadStartInternal: function(url) {
		try {
			this.objectLoading ++;
			if (this.loadStart !== undefined) this.loadStart(url);
		} catch (err) {
			console.error('LoadException:' + err);
		}
	},
	onLoadFinishedInternal: function(url) {
		try {
			this.objectLoading--;
			if (this.loadFinish !== undefined) this.loadFinish(url);
			if (this.objectLoading <= 0)
				if (this.loadAllFinish !== undefined) this.loadAllFinish();
		} catch (err) {
			console.error('LoadException:' + err);
		}
	},
	LoadWithType: function(url, type, onLoad) {
		var isScript = (type === 'script'); 
		var element = document.createElement(type);
		if (isScript) element.type = 'text/javascript';
		else element.crossOrigin = true;
		element.onload = element.onreadystatechange = function() {  
			if (element.readyState && element.readyState !== 'loaded' && element.readyState !== 'complete')  
				return; 
			
			if (isScript) {
				var dataRoot = UnityEngine.Resources.getDataRoot();
				dataRoot._url_ = url; // marker the url.
				if (onLoad) onLoad(dataRoot);
			} else {
				if (onLoad) onLoad(element);
			}
			_data_ = undefined; // clear the data root.
			UnityEngine.Resources.onLoadFinishedInternal(url);
		};  
		element.src = url;  
		// TODO: create a resources element.
		document.getElementsByTagName('head')[0].appendChild(element);
		this.onLoadStartInternal(url);
		return element;  
	},
	Load: function(url, typeName, onLoad) {
		var cacheObj = this.getFromCache(this.getUrlName(url), typeName);
		if (cacheObj !== undefined) return cacheObj;
		this.LoadWithType(url, 'script', function(data) {
			var type = UnityEngine.GetType(typeName);
			if (type !== undefined) {
				var obj = new type();
				obj.Load(data);
				UnityEngine.Resources.addToCache(url, typeName, obj);
				if (onLoad) onLoad(obj);
			} else {
				console.error("Type not found:" + typeName);
			}
		});
	},
	LoadImage: function(url, onLoad) {
		var cacheObj = this.getFromCache(this.getUrlName(url), 'img');
		if (cacheObj !== undefined) return cacheObj;
		this.LoadWithType(url, 'img', function(image) {
			UnityEngine.Resources.addToCache(url, 'img', image);
			if (onLoad) onLoad(image);
		});
	},
};

//
// ..\src\gui\unity3d\Texture2D.js
//

UnityEngine.Texture2D = function(width, height, image) {
	this.width = width;
	this.height = height;
	this.image = image;
	this.glTexture = undefined;
	this.glFormat = undefined;// gl.RGBA;
	this.glType = undefined;//gl.UNSIGNED_BYTE;
};

UnityEngine.Texture2D.prototype = {
	constructor: UnityEngine.Texture2D,
	destroy: function() {
		if (this.glTexture !== undefined) {
			gl.deleteTexture(this.glTexture);
			this.glTexture = undefined;
		}
	},
	SetupTexture: function(gl, slot) {
		if (this.glTexture === undefined) {
			if (this.image === undefined) return; // texture not ready.
			this.glTexture = gl.createTexture();
			gl.activeTexture(gl.TEXTURE0 + slot);
			gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);//NEAREST );
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);//NEAREST );
			gl.texImage2D(gl.TEXTURE_2D, 0, this.glFormat || gl.RGBA, this.glFormat || gl.RGBA, this.glType || gl.UNSIGNED_BYTE, this.image);
			//return;
		}
		gl.activeTexture(gl.TEXTURE0 + slot);
		gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
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
	this.hasChanged = false;
};

Object.assign(UnityEngine.Transform.prototype = Object.create(UnityEngine.Component.prototype), {
	constructor: UnityEngine.Transform,
	exec: function(action, recursive) {
		action(this); // do this action.
		if (recursive) { for (var i in this.children) this.children[i].exec(action); }
	},
	setParent: function(parent) {
		this.parent = parent;
		parent.children.push(this);
		this.setNeedUpdate(true); // update all children.
	},
	setNeedUpdate(recursive) {
		this.exec(function(self) { self.needUpdate = true; }, true); // update all children.
	},
	Load: function(json) {
		UnityEngine.Component.prototype.Load.call(this, json);
		if (json.t) this.localPosition.set(json.t.x || 0, json.t.y || 0, json.t.z || 0);
		if (json.r) this.localRotation.euler(json.r.x || 0, json.r.y || 0, json.r.z || 0);
		if (json.s) this.localScale.set(json.s.x || 1, json.s.y || 1, json.s.z || 1);
		this.needUpdate = true;
	},
	Find: function(name) {
		var sep = name.lastIndexOf('/');
		var childName = sep > 0 ? name.substring(0, sep) : name;
		for (var i in this.children) {
			var child = this.children[i];
			if (child.gameObject.name === childName)
				return sep > 0 ? child.Find(name.substring() + 1) : child;
		}
	},
	Update: function() {
		if (!this.needUpdate) return;
		this.needUpdate = false;
		this.hasChanged = true; // tell other i changed.
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
	InverseTransformPoint: function(pos) { return this.worldToLocalMatrix.MultiplyPoint3x4(pos); },
	InverseTransformDirection: function(dir) { return this.worldToLocalMatrix.MultiplyVector(dir); },
	TransformPoint: function(pos) { return this.localToWorldMatrix.MultiplyPoint3x4(pos); },
	TransformDirection: function(dir) { return this.localToWorldMatrix.MultiplyVector(dir); },
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
		return this;
	},
	sub: function(v) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
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

NGUI.AnchorPoint = function(json) {
	this.target = json.t; // UnityEngine.Transform
	this.relative = json.r || 0;
	this.absolute = json.a || 0;
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
		if (a0 < a1 && a0 < a2) this.Set(rel0 || 0, abs0);
		else if (a1 < a0 && a1 < a2) this.Set(rel1 || 0.5, abs1);
		else this.Set(rel2 || 1, abs2);
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
			// TODO: check the camera component if has.
			//if (this.target.camera !== undefined) return this.target.camera.GetSides(relativeTo);
		}
	},
	Link: function() {
		if (typeof(this.target) === 'number')
			this.target = UnityEngine.Object.FindObjectWithId(this.target);
		if (this.target === undefined) return;
		this.rect = this.target.GetComponent('UIRect');
		if (this.target === undefined || this.rect !== undefined)
			this.targetCam = undefined;
		else // Find the camera responsible for the target object
			this.targetCam = NGUITools.FindCameraForLayer(this.target.gameObject.layer);
	}
};

//
// ..\src\gui\internal\BMFont.js
//

NGUI.BMFont = function() {
    this.charSize = 16;
    this.baseOffset = 0;
    this.texWidth = 0;
    this.texHeight = 0;
    this.spriteName = undefined;
    this.glyphs = [];

    this.mDict = {};
    this.mDictCount = 0;
}

NGUI.BMFont.prototype = {
    constructor: NGUI.BMFont,
    get isValid() { return this.glyphs.length > 0; },
    get glyphCount() { return this.glyphs.length; },
    Clear: function() {
        this.glyphs.length = 0;
        this.mDict = {};
        this.mDictCount = 0;
    },
    Load: function(json) {
        this.charSize = json.charSize || 16;
        this.baseOffset = json.baseOffset || 0;
        this.texWidth = json.texWidth || 0;
        this.texHeight = json.texHeight || 0;
        this.spriteName = json.spriteName;
        for (var i in json.glyphs) {
            var glyph = new NGUI.BMGlyph();
            glyph.Load(json.glyphs[i]);
            this.glyphs.push(glyph);
        }
    },
    GetGlyph: function(index, createIfMissing) {
		var glyph = undefined;
		if (this.mDictCount === 0) {
			for (var i in this.glyphs) {
				var bmg = this.glyphs[i];
				this.mDict[bmg.index] = bmg;
                this.mDictCount++;
			}
		}
        glyph = this.mDict[index];
		if (glyph === undefined && createIfMissing) {
			glyph = new NGUI.BMGlyph();
			glyph.index = index;
			this.glyphs.push(glyph);
            this.mDict[index] = glyph;
            this.mDictCount++;
		}
		return glyph;
    },
    Trim (xMin, yMin, xMax, yMax) {
		for (var i in this.glyphs) {
            var glyph = this.glyphs[i];
            glyph.Trim(xMin, yMin, xMax, yMax);
		}
	},
}

//
// ..\src\gui\internal\BMGlyph.js
//

NGUI.BMGlyph = function() {
	this.index = 0;
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.offsetX = 0;
	this.offsetY = 0;
	this.advance = 0;
	this.channel = 0;
	this.kerning = undefined;
}

NGUI.BMGlyph.prototype = {
    constructor: NGUI.BMGlyph,
    Load: function(json) {
        this.index = json.i || 0;
        this.x = json.x || 0;
        this.y = json.y || 0;
        this.width = json.w || 0;
        this.height = json.h || 0;
        this.offsetX = json.ox || 0;
        this.offsetY = json.oy || 0;
        this.advance = json.a || 0;
        this.channel = json.c || 0;
    },
	GetKerning: function(previousChar) {
		if (this.kerning !== undefined && previousChar !== 0) {
			for (var i = 0, imax = this.kerning.length; i < imax; i += 2)
				if (this.kerning[i] == previousChar)
					return kerning[i + 1];
		}
		return 0;
	},
    SetKerning: function(previousChar, amount) {
		if (this.kerning === undefined) this.kerning = [];
		for (var i = 0, imax = this.kerning.length; i < imax; i += 2) {
			if (this.kerning[i] == previousChar) {
				kerning[i + 1] = amount;
				return;
			}
		}
		this.kerning.Add(previousChar);
		this.kerning.Add(amount);
	},
    Trim: function(xMin, yMin, xMax, yMax) {
		var x1 = this.x + this.width;
		var y1 = this.y + this.height;
		if (this.x < xMin) {
			var offset = xMin - this.x;
			this.x += offset;
			this.width -= offset;
			this.offsetX += offset;
		}
		if (this.y < yMin) {
			var offset = yMin - this.y;
			this.y += offset;
			this.height -= offset;
			this.offsetY += offset;
		}
		if (this.x1 > xMax) this.width  -= this.x1 - xMax;
		if (this.y1 > yMax) this.height -= this.y1 - yMax;
	},
}

//
// ..\src\gui\internal\BMSymbol.js
//

NGUI.BMSymbol = function() {
    this.mSprite = undefined;
    this.mIsValid = false;

    this.sequence = undefined;
    this.spriteName = undefined;
    this.length = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.width = 0;
    this.height = 0;
    this.advance = 0;
    this.uvRect = new UnityEngine.Rect();
}

NGUI.BMSymbol.prototype = {
    constructor: NGUI.BMSymbol,
    Load: function(json) {
        this.sequence = json.q;
        this.spriteName = json.s;
        this.offsetX = json.ox;
        this.offsetY = json.oy;
        this.width = json.w;
        this.height = json.h;
        this.advance = json.a;
        this.length = this.spriteName.length;
    },
    MarkAsChanged: function() { this.mIsValid = false; },
    Validate: function(atlas) {
        if (atlas === undefined) return;
        if (this.mIsValid !== true) {
            this.mSprite = atlas.GetSprite(this.spriteName);
            if (this.mSprite !== undefined) {
                var tex = atlas.texture;
                if (tex === undefined) {
                    this.mSprite = undefined;
                } else {
                    this.uvRect.set(this.mSprite.x, this.mSprite.y, this.mSprite.width, this.mSprite.height);
                    this.uvRect = NGUIMath.ConvertToTexCoords(this.uvRect, tex.width, tex.height);
                    this.offsetX = this.mSprite.paddingLeft;
                    this.offsetY = this.mSprite.paddingTop;
                    this.width = this.mSprite.width;
                    this.height = this.mSprite.height;
                    this.advance = this.mSprite.width + (this.mSprite.paddingLeft + this.mSprite.paddingRight);
                    this.mIsValid = true;
                }
            }
        }
    },
};

//
// ..\src\gui\internal\NGUIText.js
//

const CHAR_SPACE = ' '.charCodeAt(0);
const CHAR_SPACE2 = '\u2009'.charCodeAt(0);
const CHAR_0 = '0'.charCodeAt(0);
const CHAR_1 = '1'.charCodeAt(0);
const CHAR_2 = '2'.charCodeAt(0);
const CHAR_3 = '3'.charCodeAt(0);
const CHAR_4 = '4'.charCodeAt(0);
const CHAR_5 = '5'.charCodeAt(0);
const CHAR_6 = '6'.charCodeAt(0);
const CHAR_7 = '7'.charCodeAt(0);
const CHAR_8 = '8'.charCodeAt(0);
const CHAR_9 = '9'.charCodeAt(0);
const CHAR_a = 'a'.charCodeAt(0);
const CHAR_A = 'A'.charCodeAt(0);
const CHAR_b = 'b'.charCodeAt(0);
const CHAR_B = 'B'.charCodeAt(0);
const CHAR_c = 'c'.charCodeAt(0);
const CHAR_C = 'C'.charCodeAt(0);
const CHAR_d = 'd'.charCodeAt(0);
const CHAR_D = 'D'.charCodeAt(0);
const CHAR_e = 'e'.charCodeAt(0);
const CHAR_E = 'E'.charCodeAt(0);
const CHAR_f = 'f'.charCodeAt(0);
const CHAR_F = 'F'.charCodeAt(0);
const CHAR_LEFT = '['.charCodeAt(0);
const CHAR_RIGHT = ']'.charCodeAt(0);
const CHAR_SUB = '-'.charCodeAt(0);

NGUIText = {
    glyph: {
        v0: new UnityEngine.Vector2(0, 0),
        v1: new UnityEngine.Vector2(0, 0),
        u0: new UnityEngine.Vector2(0, 0),
        u1: new UnityEngine.Vector2(0, 0),
        advance: 0,
        channel: 0,
        rotatedUVs: false,
    },
    maxLines: 0,
    pixelDensity: 1,
    mColors: [],

	IsSpace: function(ch) { return (ch === CHAR_SPACE || ch === 0x200a || ch === 0x200b || ch === CHAR_SPACE2); },
	IsHex: function(ch) { return (ch >= CHAR_0 && ch <= CHAR_9) || (ch >= CHAR_a && ch <= CHAR_f) || (ch >= CHAR_A && ch <= CHAR_F); },
    ReplaceSpaceWithNewline: function(s) {
		var i = s.length - 1;
		if (i > 0 && this.IsSpace(s.charCodeAt(i))) s.splice(i, 1, '\n');
	},
    EndLine: function(s) {
		var i = s.Length - 1;
		if (i > 0 && this.IsSpace(s.charCodeAt(i))) s.splice(i, 1, '\n');
		else s.concat('\n');
	},
    Update: function(request) {
        this.finalSize = Mathf.RoundToInt(this.fontSize / this.pixelDensity);
        this.finalSpacingX = this.spacingX * this.fontScale;
        this.finalLineHeight = (this.fontSize + this.spacingY) * this.fontScale;
        this.useSymbols = (this.bitmapFont !== undefined && this.bitmapFont.hasSymbols()) && this.encoding && this.symbolStyle != SymbolStyle.None;
    },
	EncodeColor24: function(c) {
		var i = 0xFFFFFF & (NGUIMath.ColorToInt(c) >> 8);
		return NGUIMath.DecimalToHex24(i);
	},
	ParseColor24: function(text, offset) {
		var r = (NGUIMath.HexToDecimal(text.charCodeAt(offset))     << 4) | NGUIMath.HexToDecimal(text.charCodeAt(offset + 1));
		var g = (NGUIMath.HexToDecimal(text.charCodeAt(offset + 2)) << 4) | NGUIMath.HexToDecimal(text.charCodeAt(offset + 3));
		var b = (NGUIMath.HexToDecimal(text.charCodeAt(offset + 4)) << 4) | NGUIMath.HexToDecimal(text.charCodeAt(offset + 5));
		var f = 1 / 255;
		return new UnityEngine.Color(f * r, f * g, f * b);
	},
	ParseColor32: function(text, offset) {
		var r = (NGUIMath.HexToDecimal(text.charCodeAt(offset)) << 4) | NGUIMath.HexToDecimal(text.charCodeAt(offset + 1));
		var g = (NGUIMath.HexToDecimal(text.charCodeAt(offset + 2)) << 4) | NGUIMath.HexToDecimal(text.charCodeAt(offset + 3));
		var b = (NGUIMath.HexToDecimal(text.charCodeAt(offset + 4)) << 4) | NGUIMath.HexToDecimal(text.charCodeAt(offset + 5));
		var a = (NGUIMath.HexToDecimal(text.charCodeAt(offset + 6)) << 4) | NGUIMath.HexToDecimal(text.charCodeAt(offset + 7));
		var f = 1 / 255;
		return new UnityEngine.Color(f * r, f * g, f * b, f * a);
	},
    ParseSymbol: function(text, index, colors, premultiply) {
        var ret = {
            result: false,
            index: index,
        };
		var length = text.length;
		if (index + 3 > length || text.charCodeAt(index) !== CHAR_LEFT) return ret;
		if (text.charCodeAt(ret.index + 2) == CHAR_RIGHT) {
			if (text.charCodeAt(ret.index + 1) === CHAR_SUB) {
				if (colors !== undefined && colors.length > 1) colors.pop();
				ret.index += 3;
				ret.result = true;
                return ret;
			}
			var sub3 = text.substr(ret.index, 3);
			switch (sub3) {
            case "[b]":
                ret.bold = true;
                ret.index += 3;
                ret.result = true;
                return ret;
            case "[i]":
				ret.italic = true;
				ret.index += 3;
				ret.result = true;
                return ret;
            case "[u]":
				ret.underline = true;
				ret.index += 3;
				ret.result = true;
                return ret;
			case "[s]":
				ret.strike = true;
				ret.index += 3;
				ret.result = true;
                return ret;
			case "[c]":
				ret.ignoreColor = true;
				ret.index += 3;
				ret.result = true;
                return ret;
			}
		}

		if (ret.index + 4 > length) return ret;
		if (text.charCodeAt(ret.index + 3) === CHAR_RIGHT) {
			var sub4 = text.substr(index, 4);
			switch (sub4) {
			case "[/b]":
				ret.bold = false;
				ret.index += 4;
				ret.result = true;
                return ret;
            case "[/i]":
				ret.italic = false;
				ret.index += 4;
				ret.result = true;
                return ret;
            case "[/u]":
				ret.underline = false;
				ret.index += 4;
				ret.result = true;
                return ret;
            case "[/s]":
				ret.strike = false;
				ret.index += 4;
				ret.result = true;
                return ret;
            case "[/c]":
				ret.ignoreColor = false;
				ret.index += 4;
				ret.result = true;
                return ret;
            default: {
				var ch0 = text.charCodeAt(ret.index + 1);
				var ch1 = text.charCodeAt(ret.index + 2);
					if (this.IsHex(ch0) && this.IsHex(ch1)) {
						var a = (NGUIMath.HexToDecimal(ch0) << 4) | NGUIMath.HexToDecimal(ch1);
						this.mAlpha = a / 255;
						ret.index += 4;
                        ret.result = true;
                        return ret;
					}
				}
				break;
			}
		}
		if (ret.index + 5 > length) return ret;
		if (text.charCodeAt(ret.index + 4) === CHAR_RIGHT) {
			var sub5 = text.substr(ret.index, 5);
			switch (sub5) {
			case "[sub]":
				ret.sub = 1;
				ret.index += 5;
				ret.result = true;
                return ret;
			case "[sup]":
				ret.sub = 2;
				ret.index += 5;
				ret.result = true;
                return ret;
			}
		}
		if (ret.index + 6 > length) return ret;
		if (text.charCodeAt(ret.index + 5) === CHAR_RIGHT) {
			var sub6 = text.substr(index, 6);
			switch (sub6) {
			case "[/sub]":
				ret.sub = 0;
				ret.index += 6;
				ret.result = true;
                return ret;
			case "[/sup]":
				ret.sub = 0;
				ret.index += 6;
				ret.result = true;
                return ret;
			case "[/url]":
				ret.index += 6;
				ret.result = true;
                return ret;
			}
		}

		if (text.substr(ret.index + 1, 4) === 'url=') {
			var closingBracket = text.indexOf(']', ret.index + 4);
			if (closingBracket != -1) {
				ret.index = closingBracket + 1;
				ret.result = true;
                return ret;
			} else {
				ret.index = text.Length;
				ret.result = true;
                return ret;
			}
		}

		if (ret.index + 8 > length) return ret;
		if (text.charCodeAt(ret.index + 7) === CHAR_RIGHT) {
			var c = this.ParseColor24(text, ret.index + 1);
			if (this.EncodeColor24(c) != text.substr(ret.index + 1, 6).toUpperCase())
				return ret;
			if (colors != null) {
				c.a = colors[colors.length - 1].a;
				if (premultiply && c.a != 1)
					c = UnityEngine.Color.Lerp(mInvisible, c, c.a);
				colors.push(c);
			}
			ret.index += 8;
			return true;
		}
		if (ret.index + 10 > length) return ret;
		if (text.charCodeAt(ret.index + 9) === CHAR_RIGHT) {
			var c = this.ParseColor32(text, ret.index + 1);
			if (this.EncodeColor32(c) != text.substr(ret.index + 1, 8).toUpperCase())
				return ret;

			if (colors !== undefined) {
				if (premultiply && c.a != 1)
					c = UnityEngine.Color.Lerp(this.mInvisible, c, c.a);
				colors.push(c);
			}
			ret.index += 10;
			return true;
		}
		return ret;
    },
    StripSymbols: function(text) {
		if (text === undefined) text;
        for (var i = 0, imax = text.length; i < imax; ) {
            var c = text.charCodeAt(i);
            var ret = this.ParseSymbol(text, i, null, false);
            if (c == '[' && ret.result === true) {
                text = text.splice(i, ret.index - i);
                imax = text.length;
                continue;
            }
            ++i;
        }
		return text;
    },
    Prepare: function(text) {
    },
    GetSymbol: function(text, index, textLength) {
		var uiFont = this.bitmapFont;
        if (uiFont.mSymbols.length == 0) return;
		textLength -= index;
		for (var i in uiFont.mSymbols) {
			var sym = uiFont.mSymbols[i];
			var symbolLength = sym.length;
			if (symbolLength == 0 || textLength < symbolLength) continue;
			var match = true;
			for (var c = 0; c < symbolLength; ++c) {
				if (text.charCodeAt(index + c) != sym.sequence.charCodeAt(c)) {
					match = false;
					break;
				}
			}
			if (match && sym.Validate(uiFont.atlas)) 
                return sym;
		}
    },
    GetGlyph: function(ch, prev) {
        var thinSpace = false;
        if (ch == '\u2009') {
            thinSpace = true;
            ch = ' ';
        }
        var bmg = this.bitmapFont.bmFont.GetGlyph(ch);
        if (bmg !== undefined) {
            var kern = (prev !== 0) ? bmg.GetKerning(prev) : 0;
            this.glyph.v0.x = (prev !== 0) ? bmg.offsetX + kern : bmg.offsetX;
            this.glyph.v1.y = -bmg.offsetY;

            this.glyph.v1.x = this.glyph.v0.x + bmg.width;
            this.glyph.v0.y = this.glyph.v1.y - bmg.height;

            this.glyph.u0.x = bmg.x;
            this.glyph.u0.y = bmg.y + bmg.height;

            this.glyph.u1.x = bmg.x + bmg.width;
            this.glyph.u1.y = bmg.y;

            var adv = bmg.advance;
            if (thinSpace) adv >>= 1;
            this.glyph.advance = adv + kern;
            this.glyph.channel = bmg.channel;
            this.glyph.rotatedUVs = false;
            if (this.fontScale !== 1) {
                this.glyph.v0 *= this.fontScale;
                this.glyph.v1 *= this.fontScale;
                this.glyph.advance *= this.fontScale;
            }
            return this.glyph;
        }
    },
    GetGlyphWidth: function(ch, prev) {
		if (this.bitmapFont === undefined) return 0;
        var thinSpace = false;
        if (ch === '\u2009'.charCodeAt(0)) {
            thinSpace = true;
            ch = ' ';
        }
        var bmg = this.bitmapFont.mFont.GetGlyph(ch);
        if (bmg === undefined) return 0;
        var adv = bmg.advance;
        if (thinSpace) adv >>= 1;
        return this.fontScale * ((prev != 0) ? adv + bmg.GetKerning(prev) : bmg.advance);
    },
    CalculatePrintedSize: function(text) {
		var v = new UnityEngine.Vector2(0, 0);
		if (text === "") {
			if (this.encoding) text = this.StripSymbols(text);
			this.Prepare(text);
			var x = 0, y = 0, maxX = 0;
			var textLength = text.length, ch = 0, prev = 0;
			for (var i = 0; i < textLength; ++i) {
				ch = text.charCodeAt(i);
				if (ch === '\n') {
					if (x > maxX) maxX = x;
					x = 0;
					y += this.finalLineHeight;
					continue;
				}
				if (ch < ' ') continue;
				var symbol = this.useSymbols ? this.GetSymbol(text, i, textLength) : undefined;
				if (symbol == null) {
					var w = this.GetGlyphWidth(ch, prev);
					if (w !== 0) {
						w += this.finalSpacingX;
						if (Mathf.RoundToInt(x + w) > this.regionWidth) {
							if (x > maxX) maxX = x - this.finalSpacingX;
							x = w;
							y += this.finalLineHeight;
						}
						else x += w;
						prev = ch;
					}
				} else {
					var w = this.finalSpacingX + symbol.advance * this.fontScale;
					if (Mathf.RoundToInt(x + w) > this.regionWidth) {
						if (x > maxX) maxX = x - this.finalSpacingX;
						x = w;
						y += this.finalLineHeight;
					}
					else x += w;
					i += symbol.sequence.length - 1;
					prev = 0;
				}
			}
			v.x = ((x > maxX) ? x - this.finalSpacingX : maxX);
			v.y = (y + this.finalLineHeight);
		}
		return v;
    },
    Align: function(verts, indexOffset, printedWidth) {
		switch (this.alignment) {
        case TextAlignment.Right: {
            var padding = this.rectWidth - printedWidth;
            if (padding < 0) return;
            for (var i = indexOffset; i < verts.length; ++i)
                verts[i].x += padding;
            break;
        }
        case TextAlignment.Center: {
            var padding = (this.rectWidth - printedWidth) * 0.5;
            if (padding < 0) return;
            var diff = Mathf.RoundToInt(this.rectWidth - printedWidth);
            var intWidth = Mathf.RoundToInt(this.rectWidth);
            var oddDiff = (diff & 1) == 1;
            var oddWidth = (intWidth & 1) == 1;
            if ((oddDiff && !oddWidth) || (!oddDiff && oddWidth))
                padding += 0.5 * fontScale;
            for (var i = indexOffset; i < verts.length; ++i)
                verts.buffer[i].x += padding;
            break;
        }
        case TextAlignment.Justified: {
            if (printedWidth < this.rectWidth * 0.65) return;
            var padding = (this.rectWidth - printedWidth) * 0.5;
            if (padding < 1) return;
            var chars = (verts.length - indexOffset) / 4;
            if (chars < 1) return;
            var progressPerChar = 1 / (chars - 1);
            var scale = this.rectWidth / printedWidth;
            for (var i = indexOffset + 4, charIndex = 1; i < verts.length; ++charIndex) {
                var x0 = verts.buffer[i].x;
                var x1 = verts.buffer[i + 2].x;
                var w = x1 - x0;
                var x0a = x0 * scale;
                var x1a = x0a + w;
                var x1b = x1 * scale;
                var x0b = x1b - w;
                var progress = charIndex * progressPerChar;
                x0 = Mathf.Lerp(x0a, x0b, progress);
                x1 = Mathf.Lerp(x1a, x1b, progress);
                x0 = Mathf.Round(x0);
                x1 = Mathf.Round(x1);
                verts[i++].x = x0;
                verts[i++].x = x0;
                verts[i++].x = x1;
                verts[i++].x = x1;
            }
            break;
        }}
    },
    Print: function(text, verts, uvs, cols) {
		var indexOffset = verts.length;
		this.Prepare(text);
		this.mColors.push(new UnityEngine.Color(1, 1, 1, 1));
		this.mAlpha = 1;

		var ch = 0, prev = 0;
		var x = 0, y = 0, maxX = 0;
		var sizeF = this.finalSize;

		var gb = this.tint.clone().mul(this.gradientBottom);
		var gt = this.tint.clone().mul(this.gradientTop);
		var uc = this.tint.clone();
		var textLength = text.length;

		var uvRect = new UnityEngine.Rect(0, 0, 1, 1);
		var invX = 0, invY = 0;
		var sizePD = sizeF * this.pixelDensity;

		var subscript = false;
        var textProp;
        var sizeShrinkage = 0.75;

		var v0x, v1x, v1y, v0y, prevX = 0;
		if (this.bitmapFont !== undefined) {
			uvRect = this.bitmapFont.uvRect;
			invX = uvRect.width / this.bitmapFont.texWidth;
			invY = uvRect.height / this.bitmapFont.texHeight;
		}

		for (var i = 0; i < textLength; ++i) {
			ch = text.charCodeAt(i);
			prevX = x;
			if (ch == '\n') {
				if (x > maxX) maxX = x;
				if (this.alignment != TextAlignment.Left) {
					this.Align(verts, indexOffset, x - this.finalSpacingX);
					indexOffset = verts.length;
				}
				x = 0;
				y += this.finalLineHeight;
				prev = 0;
				continue;
			}
			if (ch < ' ') {
				prev = ch;
				continue;
			}

            textProp = this.encoding ? this.ParseSymbol(text, i, this.mColors, this.premultiply) : {};
			if (textProp.result) {
				var fc;
				if (textProp.ignoreColor) {
					fc = this.mColors[this.mColors.length - 1].clone();
					fc.a *= this.mAlpha * this.tint.a;
				} else {
					fc = this.tint * this.mColors[this.mColors.length - 1];
					fc.a *= this.mAlpha;
				}
				uc = fc;

				for (var b = 0, bmax = this.mColors.length - 2; b < bmax; ++b)
					fc.a *= this.mColors[b].a;

				if (this.gradient) {
					gb = this.gradientBottom * fc;
					gt = this.gradientTop * fc;
				}
				--i;
				continue;
			}
			var symbol = this.useSymbols ? this.GetSymbol(text, i, textLength) : undefined;
			if (symbol !== undefined) {
				v0x = x + symbol.offsetX * this.fontScale;
				v1x = v0x + symbol.width * this.fontScale;
				v1y = -(y + symbol.offsetY * this.fontScale);
				v0y = v1y - symbol.height * this.fontScale;
				if (Mathf.RoundToInt(x + symbol.advance * this.fontScale) > this.regionWidth) {
					if (x == 0) return;
					if (this.alignment != TextAlignment.Left && indexOffset < verts.length) {
						this.Align(verts, indexOffset, x - this.finalSpacingX);
						indexOffset = verts.length;
					}
					v0x -= x;
					v1x -= x;
					v0y -= this.finalLineHeight;
					v1y -= this.finalLineHeight;
					x = 0;
					y += this.finalLineHeight;
					prevX = 0;
				}
				verts.push(new UnityEngine.Vector3(v0x, v0y));
				verts.push(new UnityEngine.Vector3(v0x, v1y));
				verts.push(new UnityEngine.Vector3(v1x, v1y));
				verts.push(new UnityEngine.Vector3(v1x, v0y));
				x += this.finalSpacingX + symbol.advance * this.fontScale;
				i += symbol.length - 1;
				prev = 0;
				if (uvs !== undefined) {
					var uv = symbol.uvRect;
					var u0x = uv.xMin;
					var u0y = uv.yMin;
					var u1x = uv.xMax;
					var u1y = uv.yMax;
					uvs.push(new UnityEngine.Vector2(u0x, u0y));
					uvs.push(new UnityEngine.Vector2(u0x, u1y));
					uvs.push(new UnityEngine.Vector2(u1x, u1y));
					uvs.push(new UnityEngine.Vector2(u1x, u0y));
				}
				if (cols !== undefined) {
					if (symbolStyle === SymbolStyle.Colored) {
						for (var b = 0; b < 4; ++b) cols.push(uc);
					} else {
						var col = new UnityEngine.Color(1, 1, 1, 1);
						col.a = uc.a;
						for (var b = 0; b < 4; ++b) cols.push(col);
					}
				}
			} else {
				var glyph = this.GetGlyph(ch, prev);
				if (glyph === undefined) continue;
				prev = ch;
				if (subscriptMode != 0) {
					glyph.v0.x *= this.sizeShrinkage;
					glyph.v0.y *= this.sizeShrinkage;
					glyph.v1.x *= this.sizeShrinkage;
					glyph.v1.y *= this.sizeShrinkage;

					if (subscriptMode == 1) {
						glyph.v0.y -= this.fontScale * this.fontSize * 0.4;
						glyph.v1.y -= this.fontScale * this.fontSize * 0.4;
					} else {
						glyph.v0.y += this.fontScale * this.fontSize * 0.05;
						glyph.v1.y += this.fontScale * this.fontSize * 0.05;
					}
				}
				v0x = glyph.v0.x + x;
				v0y = glyph.v0.y - y;
				v1x = glyph.v1.x + x;
				v1y = glyph.v1.y - y;
				var w = glyph.advance;
				if (this.finalSpacingX < 0) w += this.finalSpacingX;
				if (Mathf.RoundToInt(x + w) > this.regionWidth) {
					if (x == 0) return;
					if (alignment != TextAlignment.Left && indexOffset < verts.length) {
						this.Align(verts, indexOffset, x - this.finalSpacingX);
						indexOffset = verts.length;
					}
					v0x -= x;
					v1x -= x;
					v0y -= this.finalLineHeight;
					v1y -= this.finalLineHeight;
					x = 0;
					y += this.finalLineHeight;
					prevX = 0;
				}
				if (this.IsSpace(ch)) {
					if (underline)
						ch = '_';
					else if (strikethrough)
						ch = '-';
				}
				x += (subscriptMode == 0) ? this.finalSpacingX + glyph.advance :
					(this.finalSpacingX + glyph.advance) * this.sizeShrinkage;
				if (this.IsSpace(ch)) continue;
				if (uvs !== undefined) {
					if (this.bitmapFont !== undefined) {
						glyph.u0.x = uvRect.xMin + invX * glyph.u0.x;
						glyph.u1.x = uvRect.xMin + invX * glyph.u1.x;
						glyph.u0.y = uvRect.yMax - invY * glyph.u0.y;
						glyph.u1.y = uvRect.yMax - invY * glyph.u1.y;
					}
					for (var j = 0, jmax = (bold ? 4 : 1); j < jmax; ++j) {
						if (glyph.rotatedUVs) {
							uvs.push(glyph.u0);
							uvs.push(new UnityEngine.Vector2(glyph.u1.x, glyph.u0.y));
							uvs.push(glyph.u1);
							uvs.push(new UnityEngine.Vector2(glyph.u0.x, glyph.u1.y));
						} else {
							uvs.push(glyph.u0);
							uvs.push(new UnityEngine.Vector2(glyph.u0.x, glyph.u1.y));
							uvs.push(glyph.u1);
							uvs.push(new UnityEngine.Vector2(glyph.u1.x, glyph.u0.y));
						}
					}
				}
				if (cols != null) {
					if (glyph.channel == 0 || glyph.channel == 15) {
						if (gradient) {
							var min = sizePD + glyph.v0.y / fontScale;
							var max = sizePD + glyph.v1.y / fontScale;
							min /= sizePD;
							max /= sizePD;
							s_c0 = Color.Lerp(gb, gt, min);
							s_c1 = Color.Lerp(gb, gt, max);
							for (var j = 0, jmax = (bold ? 4 : 1); j < jmax; ++j) {
								cols.push(s_c0);
								cols.push(s_c1);
								cols.push(s_c1);
								cols.push(s_c0);
							}
						} else {
							for (var j = 0, jmax = (bold ? 16 : 4); j < jmax; ++j)
								cols.push(uc);
						}
					} else {
						var col = uc.clone();
						col *= 0.49;
						switch (glyph.channel) {
							case 1: col.b += 0.51; break;
							case 2: col.g += 0.51; break;
							case 4: col.r += 0.51; break;
							case 8: col.a += 0.51; break;
						}
						var c = col;
						for (var j = 0, jmax = (bold ? 16 : 4); j < jmax; ++j)
							cols.push(c);
					}
				}
				if (!bold) {
					if (!italic) {
						verts.push(new UnityEngine.Vector3(v0x, v0y));
						verts.push(new UnityEngine.Vector3(v0x, v1y));
						verts.push(new UnityEngine.Vector3(v1x, v1y));
						verts.push(new UnityEngine.Vector3(v1x, v0y));
					} else {
						var slant = this.fontSize * 0.1 * ((v1y - v0y) / this.fontSize);
						verts.push(new UnityEngine.Vector3(v0x - slant, v0y));
						verts.push(new UnityEngine.Vector3(v0x + slant, v1y));
						verts.push(new UnityEngine.Vector3(v1x + slant, v1y));
						verts.push(new UnityEngine.Vector3(v1x - slant, v0y));
					}
				} else {
					for (var j = 0; j < 4; ++j) {
						var a = this.mBoldOffset[j * 2];
						var b = this.mBoldOffset[j * 2 + 1];
						var slant = (italic ? this.fontSize * 0.1 * ((v1y - v0y) / this.fontSize) : 0);
						verts.push(new UnityEngine.Vector3(v0x + a - slant, v0y + b));
						verts.push(new UnityEngine.Vector3(v0x + a + slant, v1y + b));
						verts.push(new UnityEngine.Vector3(v1x + a + slant, v1y + b));
						verts.push(new UnityEngine.Vector3(v1x + a - slant, v0y + b));
					}
				}

				// Underline and strike-through contributed by Rudy Pangestu.
				if (underline || strikethrough) {
					var dash = this.GetGlyph(strikethrough ? '-' : '_', prev);
					if (dash === undefined) continue;
					if (uvs !== undefined) {
						if (bitmapFont !== undefined) {
							dash.u0.x = uvRect.xMin + invX * dash.u0.x;
							dash.u1.x = uvRect.xMin + invX * dash.u1.x;
							dash.u0.y = uvRect.yMax - invY * dash.u0.y;
							dash.u1.y = uvRect.yMax - invY * dash.u1.y;
						}
						var cx = (dash.u0.x + dash.u1.x) * 0.5;
						for (var j = 0, jmax = (bold ? 4 : 1); j < jmax; ++j) {
							uvs.push(new UnityEngine.Vector2(cx, dash.u0.y));
							uvs.push(new UnityEngine.Vector2(cx, dash.u1.y));
							uvs.push(new UnityEngine.Vector2(cx, dash.u1.y));
							uvs.push(new UnityEngine.Vector2(cx, dash.u0.y));
						}
					}
					if (subscript && strikethrough) {
						v0y = (-y + dash.v0.y) * sizeShrinkage;
						v1y = (-y + dash.v1.y) * sizeShrinkage;
					} else {
						v0y = (-y + dash.v0.y);
						v1y = (-y + dash.v1.y);
					}
					if (bold) {
						for (var j = 0; j < 4; ++j) {
							var a = this.mBoldOffset[j * 2];
							var b = this.mBoldOffset[j * 2 + 1];
							verts.push(new UnityEngine.Vector3(prevX + a, v0y + b));
							verts.push(new UnityEngine.Vector3(prevX + a, v1y + b));
							verts.push(new UnityEngine.Vector3(x + a, v1y + b));
							verts.push(new UnityEngine.Vector3(x + a, v0y + b));
						}
					} else {
						verts.push(new UnityEngine.Vector3(prevX, v0y));
						verts.push(new UnityEngine.Vector3(prevX, v1y));
						verts.push(new UnityEngine.Vector3(x, v1y));
						verts.push(new UnityEngine.Vector3(x, v0y));
					}

					if (gradient) {
						var min = sizePD + dash.v0.y / this.fontScale;
						var max = sizePD + dash.v1.y / this.fontScale;
						min /= sizePD;
						max /= sizePD;
						s_c0 = Color.Lerp(gb, gt, min);
						s_c1 = Color.Lerp(gb, gt, max);
						for (var j = 0, jmax = (bold ? 4 : 1); j < jmax; ++j) {
							cols.push(s_c0);
							cols.push(s_c1);
							cols.push(s_c1);
							cols.push(s_c0);
						}
					} else {
						for (var j = 0, jmax = (bold ? 16 : 4); j < jmax; ++j)
							cols.push(uc);
					}
				}
			}
		}

		if (this.alignment != TextAlignment.Left && indexOffset < verts.length) {
			this.Align(verts, indexOffset, x - this.finalSpacingX);
			indexOffset = verts.length;
		}
		this.mColors.length = 0;
    },
    WrapText: function(text, keepCharCount) {
        var regionWidth = this.regionWidth;
        var regionHeight = this.regionHeight;
        var finalLineHeight = this.finalLineHeight;
		var ret = { result: false, text: "" };
		if (regionWidth < 1 || regionHeight < 1 || finalLineHeight < 1)
			return ret;

        var maxLines = this.maxLines;
        var fontScale = this.fontScale;
        var finalSpacingX = this.finalSpacingX;
		var height = (maxLines > 0) ? Math.min(regionHeight, finalLineHeight * maxLines) : regionHeight;
		var maxLineCount = (maxLines > 0) ? maxLines : 1000000;
		maxLineCount = Mathf.FloorToInt(Math.min(maxLineCount, height / finalLineHeight) + 0.01);
		if (maxLineCount === 0)
            return ret;

		if (text.length === 0) text = " ";
		this.Prepare(text);
		var sb = "";
		var textLength = text.length;
		var remainingWidth = regionWidth;
		var start = 0, offset = 0, lineCount = 1, prev = 0;
		var lineIsEmpty = true;
		var fits = true;
		var eastern = false;
		for (; offset < textLength; ++offset) {
			var ch = text.charCodeAt(offset);
			if (ch > 12287) eastern = true;
			if (ch == '\n'.charCodeAt(0)) {
				if (lineCount == maxLineCount) break;
				remainingWidth = regionWidth;

				// Add the previous word to the final string
				if (start < offset) sb.concat(text.substr(start, offset - start + 1));
				else sb.concat(ch);
				lineIsEmpty = true;
				++lineCount;
				start = offset + 1;
				prev = 0;
				continue;
			}
			if (this.encoding) {
                var ret = this.ParseSymbol(text, offset);
                if (ret.result) {
                     offset = ret.index - 1;
                     continue; 
                }
            }
			var symbol = this.useSymbols ? this.GetSymbol(text, offset, textLength) : undefined;
			var glyphWidth;
			if (symbol === undefined) {
				var w = this.GetGlyphWidth(ch, prev);
				if (w == 0) continue;
				glyphWidth = finalSpacingX + w;
			}
			else glyphWidth = finalSpacingX + symbol.advance * fontScale;
			remainingWidth -= glyphWidth;
			if (this.IsSpace(ch) && !eastern && start < offset) {
				var end = offset - start + 1;
				if (lineCount == maxLineCount && remainingWidth <= 0 && offset < textLength) {
					var cho = text.charCodeAt(offset);
					if (cho < CHAR_SPACE || this.IsSpace(cho)) --end;
				}
				sb.concat(text.substr(start, end));
				lineIsEmpty = false;
				start = offset + 1;
				prev = ch;
			}
			if (Mathf.RoundToInt(remainingWidth) < 0) {
				if (lineIsEmpty || lineCount == maxLineCount) {
					sb.concat(text.substr(start, Math.max(0, offset - start)));
					var space = this.IsSpace(ch);
					if (!space && !eastern) fits = false;
					if (lineCount++ == maxLineCount) {
						start = offset;
						break;
					}
					if (keepCharCount) this.ReplaceSpaceWithNewline(sb);
					else this.EndLine(sb);
					lineIsEmpty = true;
					if (space) {
						start = offset + 1;
						remainingWidth = regionWidth;
					} else {
						start = offset;
						remainingWidth = regionWidth - glyphWidth;
					}
					prev = 0;
				} else {
					lineIsEmpty = true;
					remainingWidth = regionWidth;
					offset = start - 1;
					prev = 0;
					if (lineCount++ == maxLineCount) break;
					if (keepCharCount) this.ReplaceSpaceWithNewline(sb);
					else this.EndLine(sb);
					continue;
				}
			}
			else prev = ch;

			// Advance the offset past the symbol
			if (symbol != undefined) {
				offset += symbol.length - 1;
				prev = 0;
			}
		}

		if (start < offset) sb.concat(text.substr(start, offset - start));
		ret.result = fits && ((offset == textLength) || (lineCount <= Math.min(maxLines, maxLineCount)));
		ret.text = sb;
		return ret;
    },
};


//
// ..\src\gui\internal\NGUIMath.js
//

NGUIMath = {
	ConvertToTexCoords: function(rect, width, height) {
		var final = rect.clone();
		if (width != 0 && height != 0) {
			final.xMin = rect.xMin / width;
			final.xMax = rect.xMax / width;
			final.yMin = 1 - rect.yMax / height;
			final.yMax = 1 - rect.yMin / height;
		}
		return final;
	},
	ConvertToPixels: function(rect, width, height, round) {
		var final = rect.clone();
		if (round) {
			final.xMin = Mathf.RoundToInt(rect.xMin * width);
			final.xMax = Mathf.RoundToInt(rect.xMax * width);
			final.yMin = Mathf.RoundToInt((1 - rect.yMax) * height);
			final.yMax = Mathf.RoundToInt((1 - rect.yMin) * height);
		} else {
			final.xMin = rect.xMin * width;
			final.xMax = rect.xMax * width;
			final.yMin = (1 - rect.yMax) * height;
			final.yMax = (1 - rect.yMin) * height;
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
	HexToDecimal: function(ch) {
		switch (ch) {
			case CHAR_0: return 0x0;
			case CHAR_1: return 0x1;
			case CHAR_2: return 0x2;
			case CHAR_3: return 0x3;
			case CHAR_4: return 0x4;
			case CHAR_5: return 0x5;
			case CHAR_6: return 0x6;
			case CHAR_7: return 0x7;
			case CHAR_8: return 0x8;
			case CHAR_9: return 0x9;
			case CHAR_a:
			case CHAR_A: return 0xA;
			case CHAR_b:
			case CHAR_B: return 0xB;
			case CHAR_c:
			case CHAR_C: return 0xC;
			case CHAR_d:
			case CHAR_D: return 0xD;
			case CHAR_e:
			case CHAR_E: return 0xE;
			case CHAR_f:
			case CHAR_F: return 0xF;
		}
		return 0xF;
	},
	DecimalToHex24: function(num) {
		num &= 0xFFFFFF;
		return num.toString(16);
	},
	IntToColor: function(val) {
		var inv = 1 / 255;
		var c = new UnityEngine.Color(0, 0, 0, 1);
		c.r = inv * ((val >> 24) & 0xFF);
		c.g = inv * ((val >> 16) & 0xFF);
		c.b = inv * ((val >> 8) & 0xFF);
		c.a = inv * (val & 0xFF);
		return c;
	},
	ColorToInt: function(c) {
		var retVal = 0;
		retVal |= Mathf.RoundToInt(c.r * 255) << 24;
		retVal |= Mathf.RoundToInt(c.g * 255) << 16;
		retVal |= Mathf.RoundToInt(c.b * 255) << 8;
		retVal |= Mathf.RoundToInt(c.a * 255);
		return retVal;
	},
};

//
// ..\src\gui\internal\NGUITools.js
//

NGUITools = {
	screenSize: new UnityEngine.Vector2(640, 480),
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
	FindCameraForLayer: function(layer) {
		// TODO: add layer supported.
		return NGUI.UICamera.current.camera;
	},
	GetImageUrl: function(atlasUrl, imageName) {
		return atlasUrl.substring(0, atlasUrl.lastIndexOf('/') + 1) + imageName;
	},
};

//
// ..\src\gui\internal\UIDrawCall.js
//

NGUI.UIDrawCall = function (name, panel, texture) {
	this.widgetCount = 0;
	this.depthStart = 2147483647; // MaxValue = 2147483647
	this.depthEnd = -2147483648; // int.MinValue = -2147483648;
	this.isDirty = false;

	this.texture = texture;
	this.renderQueue = panel.startingRenderQueue;
	this.manager = panel;
	this.panel = panel; // NGUI.UIPanel
	
	this.verts = [];// Vector3
	this.uvs = [];// Vector2
	this.cols = [];// Vector3

	this.mMesh = undefined;
	this.mSortingOrder = panel.mSortingOrder;
	this.mClipCount = panel.clipCount();

	this.localToWorldMatrix = new UnityEngine.Matrix4x4();
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
	BuildTriangles: function(vertexCount) {
		var index = 0;
		var indexCount = vertexCount / 4 * 6;
		var indexBuffer = new Uint16Array(indexCount);
		for (var i = 0; i < vertexCount; i += 4) {
			indexBuffer[index++] = i;
			indexBuffer[index++] = i + 1;
			indexBuffer[index++] = i + 2;
			indexBuffer[index++] = i + 2;
			indexBuffer[index++] = i + 3;
			indexBuffer[index++] = i;
		}
		return indexBuffer;
	},
	UpdateGeometry: function(count) {
		this.mMesh = new UnityEngine.Mesh();
		this.mMesh.CopyVertexData(this.verts, this.uvs, this.cols, this.BuildTriangles(this.verts.length));
		// clean.
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
			if (currentPanel.hasClipping()) {
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
				this.SetClipping(i++, cr, currentPanel.mClipSoftness, angle);
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
	Clear: function() {
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
			v.push(this.mRtpVerts[i]);
			u.push(this.uvs[i]);
			c.push(this.cols[i]);
		}
	},
}

//
// ..\src\gui\internal\UIRect.js
//

NGUI.UIRect = function(gameObject) {
	UnityEngine.MonoBehaviour.call(this, gameObject);

	this.leftAnchor = undefined;// new NGUI.AnchorPoint();
	this.rightAnchor = undefined;//new NGUI.AnchorPoint();
	this.bottomAnchor = undefined;//new NGUI.AnchorPoint();
	this.topAnchor = undefined;//new NGUI.AnchorPoint();
	this.finalAlpha = 1;
	
	this.mSides = [];
	this.mCam = undefined;
	this.mUpdateAnchors = true;
	this.mUpdateFrame = -1;
	this.mAnchorsCached = false;
	this.mChanged = false;
};

Object.assign(NGUI.UIRect.prototype = Object.create(UnityEngine.MonoBehaviour.prototype), {
	constructor: NGUI.UIRect,
	cameraRayDistance: function() {
		var cam = this.mCam;
		if (cam === undefined) return 0;
		if (cam.isOrthoGraphic)
			return (cam.nearClipPlane + cam.farClipPlane) * 0.5;
		var vec = this.transform.position.clone().sub(cam.transform.position);
		var forward = cam.transform.TransformDirection(new UnityEngine.Vector3(0, 0, 1));
		return forward.dot(vec);
	},
	anchorCamera: function() {
		if (!this.mAnchorsCached) this.ResetAnchors();
		return this.mCam;
	},
	Load: function(json) {
		UnityEngine.MonoBehaviour.prototype.Load.call(this, json);
		if (json.la !== undefined) this.leftAnchor = new NGUI.AnchorPoint(json.la);
		if (json.ra !== undefined) this.rightAnchor = new NGUI.AnchorPoint(json.ra);
		if (json.ba !== undefined) this.bottomAnchor = new NGUI.AnchorPoint(json.ba);
		if (json.ta !== undefined) this.topAnchor = new NGUI.AnchorPoint(json.ta);
		this.mChanged = true;
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
	ResetAnchors: function(update) {
		this.mAnchorsCached = true;
		if (this.leftAnchor !== undefined) this.leftAnchor.Link();
		if (this.bottomAnchor !== undefined) this.bottomAnchor.Link();
		if (this.rightAnchor !== undefined) this.rightAnchor.Link();
		if (this.topAnchor !== undefined) this.topAnchor.Link();
		this.mCam = NGUITools.FindCameraForLayer(this.gameObject.layer);
		//FindCameraFor(leftAnchor);
		//FindCameraFor(bottomAnchor);
		//FindCameraFor(rightAnchor);
		//FindCameraFor(topAnchor);
		this.mUpdateAnchors = true;
		if (update) this.UpdateAnchors();
	},
	UpdateAnchors: function(frame) {
		var anchored = false;
		this.mUpdateFrame = frame;
		if (this.leftAnchor !== undefined) {
			anchored = true;
			if (this.leftAnchor.rect !== undefined)
				this.leftAnchor.rect.UpdateAnchors(frame);
		}
		if (this.bottomAnchor !== undefined) {
			anchored = true;
			if (this.bottomAnchor.rect !== undefined)
				this.bottomAnchor.rect.UpdateAnchors(frame);
		}
		if (this.rightAnchor !== undefined) {
			anchored = true;
			if (this.rightAnchor.rect !== undefined)
				this.rightAnchor.rect.UpdateAnchors(frame);
		}
		if (this.topAnchor !== undefined) {
			anchored = true;
			if (this.topAnchor.rect !== undefined)
				this.topAnchor.rect.UpdateAnchors(frame);
		}
		if (anchored) this.OnAnchor();
	},
	GetLocalPos: function(ac, trans) {
		if (this.mCam === undefined || ac.targetCam === undefined)
			return this.transform.localPosition;

		var pos = this.mCam.ViewportToWorldPoint(ac.targetCam.WorldToViewportPoint(ac.target.position));
		if (trans != null) pos = trans.InverseTransformPoint(pos);
		pos.x = Math.floor(pos.x + 0.5);
		pos.y = Math.floor(pos.y + 0.5);
		return pos;
	}
});

//
// ..\src\gui\internal\UIWidget.js
//

NGUI.UIWidget = function(gameObject) {
	NGUI.UIRect.call(this, gameObject);
	
	this.mColor = new UnityEngine.Color(1, 1, 1, 1),
	this.mPivot = WidgetPivot.Center;
	this.mWidth = 100;
	this.mHeight = 100;
	this.mDepth = 0;
	this.mMoved = false;
	this.mIsInFront = true;
	this.mIsVisibleByAlpha = true;
	this.mIsVisibleByPanel = true;
	this.mDrawRegion = new UnityEngine.Vector4(0, 0, 1, 1);
	this.mLocalToPanel = new UnityEngine.Matrix4x4();
	this.mOldV0 = new UnityEngine.Vector3();
	this.mOldV1 = new UnityEngine.Vector3();
	this.mCorners = [];//

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

Object.assign(NGUI.UIWidget.prototype = Object.create(NGUI.UIRect.prototype), {
	constructor: NGUI.UIWidget,
	pivotOffset: function() { return NGUIMath.GetPivotOffset(this.mPivot); },
	texture: function() { return undefined; },
	isVisible: function() { return this.mIsVisibleByAlpha && this.mIsVisibleByPanel && this.mIsInFront && this.finalAlpha > 0.001; },
	hasVertices: function() { return this.geometry.hasVertices(); },
	border: function() { return new UnityEngine.Vector4(0, 0, 0, 0); },
	drawingDimensions: function() {
		var offset = this.pivotOffset();
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
	OnFill: function(verts, uvs, cols) { },
	Load: function(json) {
		NGUI.UIRect.prototype.Load.call(this, json);
		if (json.c !== undefined)
			this.mColor.set32(json.c.r || 0, json.c.g || 0, json.c.b || 0, json.c.a || 255);
		this.mPivot = json.p || WidgetPivot.Center;
		this.keepAspectRatio = json.k || AspectRatioSource.Free;
		this.aspectRatio = json.a || 1;
		this.finalAlpha = this.mColor.a;
		this.mWidth = json.w || 100;
		this.mHeight = json.h || 100;
		this.mDepth = json.d || 0;
		this.CreatePanel(); // ensure we have a parent panel.
	},
	CreatePanel: function() {
		if (this.panel === undefined) {
			this.panel = NGUITools.FindInParents(this.gameObject, 'UIPanel');
			this.panel.AddWidget(this);
		}
		return this.panel;
	},
	UpdateTransform: function() {
		var trans = this.transform;
		if (this.mMoved !== true && trans.hasChanged) {
			trans.hasChanged = false;
			this.mLocalToPanel.MultiplyMatrices(this.panel.worldToLocal, trans.localToWorldMatrix);
			var offset = this.pivotOffset();
			var x0 = -offset.x * this.mWidth;
			var y0 = -offset.y * this.mHeight;
			var x1 = x0 + this.mWidth;
			var y1 = y0 + this.mHeight;
			var wt = this.transform;
			var v0 = wt.TransformPoint(new UnityEngine.Vector3(x0, y0, 0));
			var v1 = wt.TransformPoint(new UnityEngine.Vector3(x1, y1, 0));
			v0 = this.panel.worldToLocal.MultiplyPoint3x4(v0);
			v1 = this.panel.worldToLocal.MultiplyPoint3x4(v1);
			if (UnityEngine.Vector3.SqrMagnitude(this.mOldV0, v0) > 0.000001 ||
				UnityEngine.Vector3.SqrMagnitude(this.mOldV1, v1) > 0.000001) {
				this.mMoved = true;
				this.mOldV0 = v0;
				this.mOldV1 = v1;
			}
		}
	},
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
		var pvt = this.pivotOffset();

		// Attempt to fast-path if all anchors match
		if (this.leftAnchor !== undefined && 
			this.rightAnchor !== undefined &&
			this.bottomAnchor !== undefined &&
			this.topAnchor !== undefined && 
			this.leftAnchor.target === this.bottomAnchor.target &&
			this.leftAnchor.target === this.rightAnchor.target &&
			this.leftAnchor.target === this.topAnchor.target) {
			var sides = this.leftAnchor.GetSides(parent);
			if (sides !== undefined) {
				lt = Mathf.Lerp(sides[0].x, sides[2].x, this.leftAnchor.relative) + this.leftAnchor.absolute;
				rt = Mathf.Lerp(sides[0].x, sides[2].x, this.rightAnchor.relative) + this.rightAnchor.absolute;
				bt = Mathf.Lerp(sides[3].y, sides[1].y, this.bottomAnchor.relative) + this.bottomAnchor.absolute;
				tt = Mathf.Lerp(sides[3].y, sides[1].y, this.topAnchor.relative) + this.topAnchor.absolute;
				this.mIsInFront = true;
			} else { // Anchored to a single transform
				var lp = this.GetLocalPos(this.leftAnchor, parent);
				lt = lp.x + this.leftAnchor.absolute;
				bt = lp.y + this.bottomAnchor.absolute;
				rt = lp.x + this.rightAnchor.absolute;
				tt = lp.y + this.topAnchor.absolute;
				this.mIsInFront = (!this.hideIfOffScreen || lp.z >= 0);
			}
		} else {
			this.mIsInFront = true;
			if (this.leftAnchor !== undefined) { // Left anchor point
				var sides = this.leftAnchor.GetSides(parent);
				if (sides !== undefined)
					lt = Mathf.Lerp(sides[0].x, sides[2].x, this.leftAnchor.relative) + this.leftAnchor.absolute;
				else
					lt = this.GetLocalPos(this.leftAnchor, parent).x + this.leftAnchor.absolute;
			}
			else lt = pos.x - pvt.x * this.mWidth;
			if (this.rightAnchor !== undefined) { // Right anchor point
				var sides = this.rightAnchor.GetSides(parent);
				if (sides !== undefined)
					rt = Mathf.Lerp(sides[0].x, sides[2].x, this.rightAnchor.relative) + this.rightAnchor.absolute;
				else
					rt = this.GetLocalPos(this.rightAnchor, parent).x + this.rightAnchor.absolute;
			}
			else rt = pos.x - pvt.x * this.mWidth + this.mWidth;
			if (this.bottomAnchor !== undefined) { // Bottom anchor point
				var sides = this.bottomAnchor.GetSides(parent);
				if (sides !== undefined)
					bt = Mathf.Lerp(sides[3].y, sides[1].y, this.bottomAnchor.relative) + this.bottomAnchor.absolute;
				else
					bt = this.GetLocalPos(this.bottomAnchor, parent).y + this.bottomAnchor.absolute;
			}
			else bt = pos.y - pvt.y * this.mHeight;
			if (this.topAnchor !== undefined) { // Top anchor point
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
		if (this.mChanged === true) {
			this.mChanged = false;
			if (this.mIsVisibleByAlpha === true && this.finalAlpha > 0.001) {
				var hadVertices = this.geometry.hasVertices();
				if (this.fillGeometry === true) {
					this.geometry.Clear();
					this.OnFill(this.geometry.verts, this.geometry.uvs, this.geometry.cols);
				}
				if (this.geometry.hasVertices() === true) {
					this.mLocalToPanel.MultiplyMatrices(this.panel.worldToLocal, this.transform.localToWorldMatrix);
					this.geometry.ApplyTransform(this.mLocalToPanel);
					this.mMoved = false;
					return true;
				}
			}
			
			if (this.fillGeometry === true) this.geometry.Clear();
			this.mMoved = false;
			return true;
		}
		else if (this.mMoved === true && this.geometry.hasVertices() === true) {
			this.mLocalToPanel.MultiplyMatrices(this.panel.worldToLocal, this.transform.localToWorldMatrix);
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
	GetSides: function(relativeTo) {
		var offset = this.pivotOffset();
		var x0 = -offset.x * this.mWidth;
		var y0 = -offset.y * this.mHeight;
		var x1 = x0 + this.mWidth;
		var y1 = y0 + this.mHeight;
		var cx = (x0 + x1) * 0.5;
		var cy = (y0 + y1) * 0.5;
		var trans = this.transform;
		this.mCorners[0] = trans.TransformPoint(new UnityEngine.Vector3(x0, cy, 0));
		this.mCorners[1] = trans.TransformPoint(new UnityEngine.Vector3(cx, y1, 0));
		this.mCorners[2] = trans.TransformPoint(new UnityEngine.Vector3(x1, cy, 0));
		this.mCorners[3] = trans.TransformPoint(new UnityEngine.Vector3(cx, y0, 0));
		if (relativeTo !== undefined) {
			for (var i in this.mCorners)
				this.mCorners[i] = relativeTo.InverseTransformPoint(this.mCorners[i]);
		}
		return this.mCorners;
	}
});

//
// ..\src\gui\internal\UIBasicSprite.js
//

NGUI.UIBasicSprite = function(gameObject) {
	NGUI.UIWidget.call(this, gameObject);
	this.mFillAmount = 1.0;
	this.mInvert = false;
	this.mType = SpriteType.Simple;
	this.mFillDirection = FillDirection.Radial360;
	this.mFlip = Flip.Nothing;
	
	this.mOuterUV = new UnityEngine.Rect(0, 0, 1, 1);
	this.mInnerUV = new UnityEngine.Rect(0, 0, 1, 1);
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

Object.assign(NGUI.UIBasicSprite.prototype = Object.create(NGUI.UIWidget.prototype), {
	constructor: NGUI.UIBasicSprite,
	pixelSize: function() { return 1; },
	texture: function() { return undefined; },
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
			this.finalAlpha * 255); 
	},
	Load: function(json) {
		NGUI.UIWidget.prototype.Load.call(this, json);
		this.mType = json.t || SpriteType.Simple;
		this.mFlip = json.f || Flip.Nothing;
		this.mFillAmount = json.fa || 1;
		this.mFillDirection = json.fd || FillDirection.Radial360;
		this.invert = json.fi || false;
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
		var br = this.border().multiplyScalar(this.pixelSize());
		if (br.x === 0 && br.y === 0 && br.z === 0 && br.w === 0)
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
				if (this.centerType == AdvancedType.Invisible && x == 1 && y == 1)
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
	TiledFill: function(verts, uvs, cols) {
		var tex = this.texture();
		if (tex === undefined) return;

		var size = new UnityEngine.Vector2(this.mInnerUV.width * tex.width, this.mInnerUV.height * tex.height);
		size.multiplyScalar(this.pixelSize());
		if (size.x < 2 || size.y < 2) return;

		var c = this.drawingColor();
		var v = this.drawingDimensions();
		var u = new UnityEngine.Vector2();
		if (this.mFlip === Flip.Horizontally || this.mFlip === Flip.Both) {
			u.x = this.mInnerUV.xMax;
			u.z = this.mInnerUV.xMin;
		} else {
			u.x = this.mInnerUV.xMin;
			u.z = this.mInnerUV.xMax;
		}
		if (this.mFlip === Flip.Vertically || this.mFlip === Flip.Both) {
			u.y = this.mInnerUV.yMax;
			u.w = this.mInnerUV.yMin;
		} else {
			u.y = this.mInnerUV.yMin;
			u.w = this.mInnerUV.yMax;
		}

		var x0 = v.x;
		var y0 = v.y;
		var u0 = u.x;
		var v0 = u.y;
		while (y0 < v.w) {
			x0 = v.x;
			var y1 = y0 + size.y;
			var v1 = u.w;
			if (y1 > v.w) {
				v1 = Mathf.Lerp(u.y, u.w, (v.w - y0) / size.y);
				y1 = v.w;
			}
			while (x0 < v.z){
				var x1 = x0 + size.x;
				var u1 = u.z;
				if (x1 > v.z){
					u1 = Mathf.Lerp(u.x, u.z, (v.z - x0) / size.x);
					x1 = v.z;
				}
				verts.push(new UnityEngine.Vector3(x0, y0));
				verts.push(new UnityEngine.Vector3(x0, y1));
				verts.push(new UnityEngine.Vector3(x1, y1));
				verts.push(new UnityEngine.Vector3(x1, y0));
				uvs.push(new UnityEngine.Vector2(u0, v0));
				uvs.push(new UnityEngine.Vector2(u0, v1));
				uvs.push(new UnityEngine.Vector2(u1, v1));
				uvs.push(new UnityEngine.Vector2(u1, v0));
				cols.push(c);
				cols.push(c);
				cols.push(c);
				cols.push(c);
				x0 += size.x;
			}
			y0 += size.y;
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
// ..\src\gui\webgl\GUIPlugin.js
//

WebGL.GUIPlugin = function(renderer, uiRoot) {
	var gl = renderer.gl;
	var programInfos;
	var maxVertexAttributes = gl.getParameter( gl.MAX_VERTEX_ATTRIBS );

	const shaderPrefix = 'precision highp float;\n';

	this.render = function() {
		if (programInfos === undefined)
			programInfos = createProgramInfos();

		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.disable( gl.CULL_FACE );
		gl.disable( gl.DEPTH_TEST );
		gl.depthMask( false );

		gl.enable( gl.BLEND );
		gl.blendEquationSeparate( gl.FUNC_ADD, gl.FUNC_ADD );
		gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA );

		// disable all the vertex attributes.
		for (var i = 0; i < maxVertexAttributes; i++)
			gl.disableVertexAttribArray( i );
		
		var camera = uiRoot.GetCamera();
		NGUI.UIPanel.Foreach(function(panel) {
			var drawCalls = panel.drawCalls;
			for (var i in drawCalls) {
				var drawCall = drawCalls[i];
				drawCall.OnWillRenderObject();

				var mesh = drawCall.mMesh;
				var texture = drawCall.texture;
				var programInfo = programInfos[drawCall.mClipCount];
				if (mesh === undefined || texture === undefined || programInfo === undefined)
					continue;

				gl.useProgram( programInfo.program ); // setup shader programs.
				mesh.SetupVertexAttribs(gl, programInfo.attributes); // setup vertex data.

				var mvp = UnityEngine.Matrix4x4.Temp;// TODO: setup the UNITY_MATRIX_MVP (ModelViewProj)
				mvp.MultiplyMatrices(camera.worldToCameraMatrix, drawCall.localToWorldMatrix);
				mvp.MultiplyMatrices(camera.projectionMatrix, mvp);
				//console.log(drawCall.localToWorldMatrix.elements);
				//console.log(camera.projectionMatrix.elements);
				//console.log(camera.worldToCameraMatrix.elements);
				//console.log(mvp.elements);
				gl.uniformMatrix4fv(programInfo.uniforms.UNITY_MATRIX_MVP, false, mvp.elements);
				if (programInfo.uniforms._ClipRange0 !== undefined) {
					var clipRange = drawCall.ClipRange[0],
						clipArgs = drawCall.ClipArgs[0];
					gl.uniform4f(programInfo.uniforms._ClipRange0, clipRange.x, clipRange.y, clipRange.z, clipRange.w);
					gl.uniform4f(programInfo.uniforms._ClipArgs0, clipArgs.x, clipArgs.y, clipArgs.z, clipArgs.w);
				}
				if (programInfo.uniforms._ClipRange1 !== undefined) {
					var clipRange = drawCall.ClipRange[1],
						clipArgs = drawCall.ClipArgs[1];
					gl.uniform4f(programInfo.uniforms._ClipRange1, clipRange.x, clipRange.y, clipRange.z, clipRange.w);
					gl.uniform4f(programInfo.uniforms._ClipRange1, clipArgs.x, clipArgs.y, clipArgs.z, clipArgs.w);
				}
				if (programInfo.uniforms._ClipRange2 !== undefined) {
					var clipRange = drawCall.ClipRange[2],
						clipArgs = drawCall.ClipArgs[2];
					gl.uniform4f(programInfo.uniforms._ClipRange2, clipRange.x, clipRange.y, clipRange.z, clipRange.w);
					gl.uniform4f(programInfo.uniforms._ClipRange2, clipArgs.x, clipArgs.y, clipArgs.z, clipArgs.w);
				}

				texture.SetupTexture(gl, 0); // setup texture.
				if (mesh.hasIndexBuffer())
					gl.drawElements(gl.TRIANGLES, mesh.triangleCount * 3, gl.UNSIGNED_SHORT, 0);
				else
					gl.drawArrays(gl.TRIANGLES, 0, mesh.vertexCount);
			}
		});

		// restore gl
		renderer.resetGLState();
	};

	function createProgram(vertexShaderSrc, fragmentShaderSrc) {
		var program = gl.createProgram();

		var vertexShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertexShader, shaderPrefix + vertexShaderSrc);
		gl.compileShader(vertexShader);
		if (gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS) === false) {
			throw gl.getShaderInfoLog(vertexShader);
		}

		var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragmentShader,  shaderPrefix + fragmentShaderSrc);
		gl.compileShader(fragmentShader);
		if (gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS) === false) {
			throw gl.getShaderInfoLog(fragmentShader);
		}

		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program );
		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);
		return program;
	}

	function createProgramInfos() {
		var program0 = createProgram([
			'uniform mat4 UNITY_MATRIX_MVP;',
			'attribute vec3 vertex;',
			'attribute vec2 uv;',
			'attribute vec4 color;',
			'varying vec2 vUV;',
			'varying vec4 vColor;',
			'void main() {',
			'   vUV = vec2(uv.x, 1.0-uv.y);',
			'   vColor = color;',
			'   gl_Position = UNITY_MATRIX_MVP * vec4(vertex, 1.0);',
			'}'
		].join('\n'), [
			'uniform sampler2D _MainTex;',
			'varying vec2 vUV;',
			'varying vec4 vColor;',
			'void main() {',
				'gl_FragColor = texture2D(_MainTex, vUV) * vColor;',
			'}'
		].join('\n'));
		
		var program1 = createProgram([
			'uniform mat4 UNITY_MATRIX_MVP;',
			'uniform vec4 _ClipRange0;',
			'attribute vec3 vertex;',
			'attribute vec2 uv;',
			'attribute vec4 color;',
			'varying vec2 vUV;',
			'varying vec4 vColor;',
			'varying vec2 vWorldPos;',
			'void main() {',
			'   vUV = vec2(uv.x, 1.0-uv.y);',
			'   vColor = color;',
			'   vWorldPos = vertex.xy * _ClipRange0.zw + _ClipRange0.xy;',
			'   gl_Position = UNITY_MATRIX_MVP * vec4(vertex, 1.0);',
			'}'
		].join('\n'), [
			'uniform sampler2D _MainTex;',
			'uniform vec4 _ClipArgs0;',
			'varying vec2 vUV;',
			'varying vec4 vColor;',
			'varying vec2 vWorldPos;',
			'void main() {',
			'   vec2 factor = (vec2(1.0, 1.0) - abs(vWorldPos)) * _ClipArgs0.xy;',
			'   vec4 col = texture2D(_MainTex, vUV) * vColor;',
			'   col.a *= clamp( min(factor.x, factor.y), 0.0, 1.0);',
			'   gl_FragColor = col;',
			'}'
		].join('\n'));
		
		var program2 = createProgram([
			'uniform mat4 UNITY_MATRIX_MVP;',
			'uniform vec4 _ClipRange0;',
			'uniform vec4 _ClipRange1;',
			'uniform vec4 _ClipArgs1;',
			'attribute vec3 vertex;',
			'attribute vec2 uv;',
			'attribute vec4 color;',
			'varying vec2 vUV;',
			'varying vec4 vColor;',
			'varying vec4 vWorldPos;',
			'vec2 Rotate (vec2 v, vec2 rot) {',
			'	vec2 ret;',
			'	ret.x = v.x * rot.y - v.y * rot.x;',
			'	ret.y = v.x * rot.x + v.y * rot.y;',
			'	return ret;',
			'}',
			'void main() {',
			'   vUV = vec2(uv.x, 1.0-uv.y);',
			'   vColor = color;',
			'   vWorldPos.xy = vertex.xy * _ClipRange0.zw + _ClipRange0.xy;',
			'   vWorldPos.zw = Rotate(vertex.xy, _ClipArgs1.zw) * _ClipRange1.zw + _ClipRange1.xy;',
			'   gl_Position = UNITY_MATRIX_MVP * vec4(vertex, 1.0);',
			'}'
		].join('\n'), [
			'uniform sampler2D _MainTex;',
			'uniform vec4 _ClipArgs0;',
			'uniform vec4 _ClipArgs1;',
			'varying vec2 vUV;',
			'varying vec4 vColor;',
			'varying vec4 vWorldPos;',
			'void main() {',
			'   vec2 factor = (vec2(1.0, 1.0) - abs(vWorldPos.xy)) * _ClipArgs0.xy;',
			'   float f = min(factor.x, factor.y);',
			'   factor = (vec2(1.0, 1.0) - abs(vWorldPos.zw)) * _ClipArgs1.xy;',
			'   f = min(f, min(factor.x, factor.y));',
			'   vec4 col = texture2D(_MainTex, vUV) * vColor;',
			'   col.a *= clamp(f, 0.0, 1.0);',
			'   gl_FragColor = col;',
			'}'
		].join('\n'));
		
		var program3 = createProgram([
			'uniform mat4 UNITY_MATRIX_MVP;',
			'uniform vec4 _ClipRange0;',
			'uniform vec4 _ClipRange1;',
			'uniform vec4 _ClipRange2;',
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
			'   vUV = vec2(uv.x, 1.0-uv.y);',
			'   vColor = color;',
			'   vWorldPos.xy = vertex.xy * _ClipRange0.zw + _ClipRange0.xy;',
			'   vWorldPos.zw = Rotate(vertex.xy, _ClipArgs1.zw) * _ClipRange1.zw + _ClipRange1.xy;',
			'   vWorldPos2 = Rotate(vertex.xy, _ClipArgs2.zw) * _ClipRange2.zw + _ClipRange2.xy;',
			'   gl_Position = UNITY_MATRIX_MVP * vec4(vertex, 1.0);',
			'}'
		].join('\n'), [
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
					_MainTex: gl.getUniformLocation( program, '_MainTex'),
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
// ..\src\gui\webgl\Renderer.js
//

WebGL.Renderer = function (parameters) {
	parameters = parameters || {};
	var canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElement('canvas');

	this.pixelRatio = 1;
	this.domElement = canvas; 
	this.gl = getGLContext(parameters, canvas);
	this.width = canvas.width;
	this.height = canvas.height;
	this.viewport = new UnityEngine.Vector4(0, 0, this.width, this.height );
	
	function onContextLost(event) {
	}

	this.setSize = function (width, height, updateStyle) {
		this.width = width;
		this.height = height;
		canvas.width = this.width * this.pixelRatio;
		canvas.height = this.height * this.pixelRatio;
		if (updateStyle !== false) {
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';
		}
		this.setViewport(0, 0, width, height);
	};

	this.setPixelRatio = function(value) {
		this.pixelRatio = value;
		this.setSize(this.viewport.z, this.viewport.w, false);
	}

	this.setViewport = function(x, y, w, h) {
		this.viewport.set(x, y, w, h);
		this.gl.viewport(x, y, w, h);
	}

	function getGLContext(parameters, canvas) {
		var glContext = undefined;
		try {
			var attributes = {
				alpha: false,
				depth: true,
				stencil: true,
				antialias: false,
				premultipliedAlpha: true,
				preserveDrawingBuffer: false };
			Object.assign(attributes, parameters);
			glContext = canvas.getContext( 'webgl', attributes ) || canvas.getContext( 'experimental-webgl', attributes );
			if (glContext === null) {
				if (canvas.getContext( 'webgl' ) !== null ) {
					throw 'Error creating WebGL context with your selected attributes.';
				} else {
					throw 'Error creating WebGL context.';
				}
			}
			if (glContext.getShaderPrecisionFormat === undefined) {
				glContext.getShaderPrecisionFormat = function () {
					return { 'rangeMin': 1, 'rangeMax': 1, 'precision': 1 };
				};
			}
			canvas.addEventListener( 'webglcontextlost', onContextLost, false );
		} catch ( error ) {
			console.error( 'THREE.WebGLRenderer: ' + error );
		}
		return glContext;
	}
};

WebGL.Renderer.prototype = {
	constructor: WebGL.Renderer,
	resetGLState: function() {
		var gl = this.gl;
	},
};

//
// ..\src\gui\ui\UIFont.js
//

NGUI.UIFont = function() {
    this.mFont = new NGUI.BMFont();
    this.mSymbols = [];
    this.mAtlas = undefined;
    this.mSprite = undefined;
    this.mUVRect = new UnityEngine.Rect(0, 0, 1, 1);

    this.bmFont = this.mFont;
}

NGUI.UIFont.prototype = {
    constructor: NGUI.UIFont,
    get texWidth() { return this.mFont !== undefined ? this.mFont.texWidth : 0; },
    get texHeight() { return this.mFont !== undefined ? this.mFont.texHeight : 0; },
    get uvRect() { return this.mUVRect; },
    defaultSize: function() { return this.mFont.charSize; },
    hasSymbols: function() { return this.mSymbols.length > 0; },
    Load: function(json) {
        if (json.font !== undefined) this.mFont.Load(json.font);
        if (json.symbols !== undefined) {
            for (var i in json.symbols) {
                var symbol = new NGUI.BMSymbol();
                symbol.Load(json.symbols[i]);
                this.mSymbols.push(symbol);
            }
        }
        if (json.atlas !== undefined)
		    this.mAtlas = UnityEngine.Resources.Load(json.atlas, 'UIAtlas');
        this.UpdateUVRect();
    },
    UpdateUVRect: function() {
        this.mSprite = this.mAtlas.GetSprite(this.mFont.spriteName);
        var tex = this.mAtlas.texture;
        if (tex === undefined) return;
        this.mUVRect = new UnityEngine.Rect(
            this.mSprite.x - this.mSprite.paddingLeft,
            this.mSprite.y - this.mSprite.paddingTop,
            this.mSprite.width + this.mSprite.paddingLeft + this.mSprite.paddingRight,
            this.mSprite.height + this.mSprite.paddingTop + this.mSprite.paddingBottom);
        this.mUVRect = NGUIMath.ConvertToTexCoords(this.mUVRect, tex.width, tex.height);
        if (this.mSprite.hasPadding) this.Trim();
    },
    Trim: function() {
		var texture = this.mAtlas.texture;
		if (texture !== undefined && this.mSprite !== undefined) {
			var full = NGUIMath.ConvertToPixels(this.mUVRect, texture.width, texture.height, true);
			var trimmed = new UnityEngine.Rect(this.mSprite.x, this.mSprite.y, this.mSprite.width, this.mSprite.height);
			var xMin = Mathf.RoundToInt(trimmed.xMin - full.xMin);
			var yMin = Mathf.RoundToInt(trimmed.yMin - full.yMin);
			var xMax = Mathf.RoundToInt(trimmed.xMax - full.xMin);
			var yMax = Mathf.RoundToInt(trimmed.yMax - full.yMin);
			this.mFont.Trim(xMin, yMin, xMax, yMax);
		}
    },
};


//
// ..\src\gui\ui\UIAtlas.js
//

NGUI.UIAtlas = function(gameObject) {
	this.mSprites = {}; // NGUI.UISpriteData
	this.mTexture = new UnityEngine.Texture2D(); // UnityEngine.Texture2D
}

NGUI.UIAtlas.prototype = {
	constructor: NGUI.UIAtlas,
	get texture() { return this.mTexture; },
	GetSprite: function(name) { return this.mSprites[name]; },
	Load: function(json) {
		var sprites = json.sprites; // sprites
		if (sprites !== undefined) {
			for (var key in sprites) {
				var sprite = new NGUI.UISpriteData();
				sprite.Load(sprites[key]);
				this.mSprites[sprite.name] = sprite;
			}
		}
		this.pixelSize = json.pixelSize || 1;
		this.mTexture.width = json.width || 0;
		this.mTexture.height = json.height || 0;

		var tex = this.mTexture;
		UnityEngine.Resources.LoadImage(
			NGUITools.GetImageUrl(json._url_, json.image), 
			function(image){
			tex.image = image; // here is a image...
			tex.width = image.width;
			tex.height = image.height;
		});
	}
};

//
// ..\src\gui\ui\UICamera.js
//

NGUI.UICamera = function(gameObject) {
	UnityEngine.MonoBehaviour.call(this, gameObject);
    this.camera = undefined;
};

NGUI.UICamera.current = undefined;

Object.assign(NGUI.UICamera.prototype = Object.create(UnityEngine.MonoBehaviour.prototype), {
	constructor: NGUI.UICamera,
    Load: function(json) {
        UnityEngine.MonoBehaviour.prototype.Load.call(this, json);
        this.camera = this.gameObject.GetComponent('Camera');
        if (this.camera !== undefined) {
            var uiRoot = NGUITools.FindInParents(this.gameObject, 'UIRoot');
            if (uiRoot !== undefined) uiRoot.camera = this.camera;
        }
        NGUI.UICamera.current = this;
    },
});

//
// ..\src\gui\ui\UIPanel.js
//

NGUI.UIPanel = function(gameObject) {
	NGUI.UIRect.call(this, gameObject);

	this.mAlpha = 1;
	this.mDepth = 0;
	this.mSortingOrder = 0;
	this.mUpdateFrame = 0;
	this.mUpdateScroll = false;
	this.mRebuild = true;
	this.mForced = false;
	this.mResized = false;
	this.mClipOffset = new UnityEngine.Vector2();
	this.mClipRange = new UnityEngine.Vector4();
	this.mClipSoftness = new UnityEngine.Vector4();
	this.mMin = new UnityEngine.Vector2();
	this.mMax = new UnityEngine.Vector2();
	this.mClipping = Clipping.None;
	this.mSortWidgets = false;

	this.startingRenderQueue = 3000;
	this.drawCallClipRange = new UnityEngine.Vector4(0, 0, 1, 1);
	this.renderQueue = RenderQueue.Automatic;
	this.widgets = []; // NGUI.UIWidget list
	this.drawCalls = []; // NGUI.UIDrawCall
	this.parentPanel = undefined;
	this.worldToLocal = undefined;
	this.anchorOffset = false;

	NGUI.UIPanel.list.push(this);
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
		if (p.renderQueue === RenderQueue.Automatic) {
			p.startingRenderQueue = rq;
			p.UpdateDrawCalls();
			rq += p.drawCalls.length + 2;
		}
		else if (p.renderQueue === RenderQueue.StartAt) {
			p.UpdateDrawCalls();
			if (p.drawCalls.length != 0)
				rq = Math.max(rq, p.startingRenderQueue + p.drawCalls.length);
		}
		else { // Explicit
			p.UpdateDrawCalls();
			if (p.drawCalls.length !== 0)
				rq = Math.max(rq, p.startingRenderQueue + 1);
		}
	}
};
NGUI.UIPanel.Foreach = function(action) {
	var list = NGUI.UIPanel.list;
	for (var i in list) action(list[i]);
};

Object.assign(NGUI.UIPanel.prototype = Object.create(NGUI.UIRect.prototype), {
	constructor: NGUI.UIPanel,
	hasClipping: function() { return this.mClipping === Clipping.SoftClip;  },
	getViewSize: function() {
		if (this.mClipping != Clipping.None)
			return new UnityEngine.Vector2(this.mClipRange.z, this.mClipRange.w);
		return NGUITools.screenSize;
	},
	finalClipRegion: function() {
		var size = this.getViewSize();
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
		NGUI.UIRect.prototype.Load.call(this, json);
		this.mAlpha = json.alpha || 1;
		this.mDepth = json.depth || 0;
		this.mClipping = json.clipping || Clipping.None;
		this.mClipOffset.set(json.clipOffset.x || 0, json.clipOffset.y || 0);
		this.mClipRange.set(json.clipRange.x || 0, json.clipRange.y || 0, json.clipRange.z || 0, json.clipRange.w || 0);
		this.mClipSoftness.set(json.clipSoftness.x || 0, json.clipSoftness.y || 0);
		this.mSortingOrder = json.sort || 0;
		this.renderQueue = json.renderQueue || RenderQueue.Automatic;
		this.startingRenderQueue = json.startingRenderQueue || 3000;
		this.mRebuild = true;
		this.FindParent();
	},
	AddWidget: function(w) {
		this.widgets.push(w);
		this.mSortWidgets = true;
	},
	FindParent: function() {
		var parent = this.transform.parent;
		this.parentPanel = (parent !== undefined) ? NGUITools.FindInParents(parent.gameObject, 'UIPanel') : undefined;
	},
	UpdateSelf: function(frame) {
		this.UpdateTransformMatrix(frame);
		this.UpdateLayers(frame);
		this.UpdateWidgets(frame);
		if (this.mRebuild === true) {
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
		var size = this.getViewSize();
		var x = this.mClipOffset.x + this.mClipRange.x;
		var y = this.mClipOffset.y + this.mClipRange.y;
		this.mMin.x = x - size.x * 0.5;
		this.mMin.y = y - size.y * 0.5;
		this.mMax.x = x + size.x * 0.5;
		this.mMax.y = y + size.y * 0.5;
	},
	UpdateLayers: function(frame) {
		// TODO: unity3d layer...
	},
	SortWidgets: function() {
		this.mSortWidgets = false;
		this.widgets.sort(function(a, b) { return a.mDepth - b.mDepth; });
	},
	UpdateWidgets: function(frame) {
		var changed = false;
		if (this.mSortWidgets === true) this.SortWidgets();
		for (var i in this.widgets) {
			var w = this.widgets[i];
			if (w.panel != this || !w.enabled)
				continue;
			
			w.ResetAnchors(true); // reset and update now.
				
			// First update the widget's transform
			if (w.UpdateTransform(frame) || this.mResized) {
				//var vis = forceVisible || (w.CalculateCumulativeAlpha(frame) > 0.001f);
				//w.UpdateVisibility(vis, forceVisible || ((clipped || w.hideIfOffScreen) ? IsVisible(w) : true));
			}
			
			// Update the widget's geometry if necessary
			if (w.UpdateGeometry(frame)) {
				changed = true;
				if (this.mRebuild !== true) {
					if (w.drawCall !== undefined)
						w.drawCall.isDirty = true;
					else
						this.FindDrawCall(w);
				}
			}
		}
		this.mResized = false;
	},
	FindDrawCall: function(w) {
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
		var pos = trans.localPosition;
		var parent = trans.parent;
		if (parent !== undefined)
			pos = parent.TransformPoint(pos);

		var rot = trans.rotation;
		var scale = trans.lossyScale;
		for (var i in this.drawCalls) {
			var dc = this.drawCalls[i];
			dc.localToWorldMatrix.SetTRS(pos, rot, scale);
			dc.renderQueue = (this.renderQueue == RenderQueue.Explicit) ? this.startingRenderQueue : this.startingRenderQueue + i;
			dc.sortingOrder = this.mSortingOrder;
		}
	},
	FillAllDrawCalls: function() {
		if (this.drawCalls.length > 0)
			this.drawCalls.length = 0; // clear drawCalls

		var texture = undefined;
		var dc = undefined;
		var count = 0;
		for (var i in this.widgets) {
			var w = this.widgets[i];
			if (!w.isVisible() || !w.hasVertices()) {
				w.drawCall = undefined;
				continue;
			}
			var mt = w.texture();
			if (texture != mt) {
				if (dc !== undefined && dc.verts.length != 0) {
					this.drawCalls.push(dc);
					dc.UpdateGeometry(count);
					count = 0;
					dc = undefined;
				}
				texture = mt;
			}

			if (texture !== undefined) {
				if (dc === undefined) {
					dc = new NGUI.UIDrawCall("", this, texture);
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

		if (dc !== undefined && dc.verts.length !== 0) {
			this.drawCalls.push(dc);
			dc.UpdateGeometry(count);
		}
	},
	GetSides: function(relativeTo) {
		if (this.mClipping !== Clipping.None) {
			var x0 = this.mClipOffset.x + this.mClipRange.x - 0.5 * this.mClipRange.z;
			var y0 = this.mClipOffset.y + this.mClipRange.y - 0.5 * this.mClipRange.w;
			var x1 = x0 + this.mClipRange.z;
			var y1 = y0 + this.mClipRange.w;
			var hx = (x0 + x1) * 0.5;
			var hy = (y0 + y1) * 0.5;
			var wt = this.transform;
			this.mSides[0] = wt.TransformPoint(new UnityEngine.Vector3(x0, hy, 0));
			this.mSides[1] = wt.TransformPoint(new UnityEngine.Vector3(hx, y1, 0));
			this.mSides[2] = wt.TransformPoint(new UnityEngine.Vector3(x1, hy, 0));
			this.mSides[3] = wt.TransformPoint(new UnityEngine.Vector3(hx, y0, 0));
			if (relativeTo !== undefined) {
				for (i in this.mSides)
					this.mSides[i] = relativeTo.InverseTransformPoint(this.mSides[i]);
			}
			return mSides;
		}
		else if (this.anchorCamera() !== undefined && this.anchorOffset) {
			var sides = this.mCam.GetSides(this.cameraRayDistance());
			var off = this.transform.position;
			for (var i in sides)
				sides[i].add(off);

			if (relativeTo !== undefined) {
				for (var i in sides)
					sides[i] = relativeTo.InverseTransformPoint(sides[i]);
			}
			return sides;
		}
		return NGUI.UIRect.prototype.GetSides.call(this, relativeTo);
	}
});

//
// ..\src\gui\ui\UIRoot.js
//

NGUI.UIRoot = function(gameObject) {
	UnityEngine.MonoBehaviour.call(this, gameObject);
	this.camera = undefined;
	this.manualWidth = 1280;
	this.manualHeight = 1280;
	this.minimumHeight = 320;
	this.maximumHeight = 1536;
	this.shrinkPortraitUI = false;
	this.fitWidth = false;
	this.fitHeight = false;
	this.scalingStyle = NGUI.Scaling.Flexible;
};

NGUI.Scaling = {
	Flexible: 0,
	Constrained: 1,
	ConstrainedOnMobiles: 2,
};

NGUI.Constraint = {
	Fit: 0,
	Fill: 1,
	FitWidth: 2,
	FitHeight: 3,
};

Object.assign(NGUI.UIRoot.prototype = Object.create(UnityEngine.MonoBehaviour.prototype), {
	constructor: NGUI.UIRoot,
	constraint: function() {
		if (this.fitWidth)
			return this.fitHeight ? NGUI.Constraint.Fit : NGUI.Constraint.FitWidth;
		return this.fitHeight ? NGUI.Constraint.FitHeight : NGUI.Constraint.Fill;
	},
	activeScaling: function() {
		if (this.scalingStyle === NGUI.Scaling.ConstrainedOnMobiles)
			return NGUI.Scaling.Constrained;
		return this.scalingStyle;
	},
	activeHeight: function() {
		var scaling = this.activeScaling();
		if (scaling === NGUI.Scaling.Flexible) {
			var screen = NGUITools.screenSize.clone();
			var aspect = screen.x / screen.y;
			if (screen.y < this.minimumHeight) {
				screen.y = this.minimumHeight;
				screen.x = screen.y * aspect;
			} else if (screen.y > this.maximumHeight) {
				screen.y = this.maximumHeight;
				screen.x = screen.y * aspect;
			}
			var height = Mathf.RoundToInt((this.shrinkPortraitUI && screen.y > screen.x) ? screen.y / aspect : screen.y);
			return height;
		} else {
			var cons = this.constraint();
			if (cons === NGUI.Constraint.FitHeight)
				return this.manualHeight;
			var screen = NGUITools.screenSize.clone();
			var aspect = screen.x / screen.y;
			var initialAspect = this.manualWidth / this.manualHeight;
			switch (cons) {
			case NGUI.Constraint.FitWidth:
				return Mathf.RoundToInt(manualWidth / aspect);
			case NGUI.Constraint.Fit:
				return (initialAspect > aspect) ? Mathf.RoundToInt(this.manualWidth / aspect) : this.manualHeight;
			case NGUI.Constraint.Fill:
				return (initialAspect < aspect) ? Mathf.RoundToInt(this.manualWidth / aspect) : this.manualHeight;
			}
			return manualHeight;
		}
	},
	Load: function(json) {
		UnityEngine.MonoBehaviour.prototype.Load.call(this, json);
		this.manualWidth = json.manualWidth | 1280;
		this.manualHeight = json.manualHeight | 720;
		this.minimumHeight = json.minimumHeight | 320;
		this.maximumHeight = json.maximumHeight | 1536;
		this.shrinkPortraitUI = json.shrinkPortraitUI | false;
		this.fitWidth = json.fitWidth | false;
		this.fitHeight = json.fitHeight | false;
		this.scalingStyle = json.scalingStyle | NGUI.Scaling.Flexible;
	},
	Update: function() {
		var calcActiveHeight = this.activeHeight();
		var floatEpsilon = 0.00001; 
		if (calcActiveHeight > 0) {
			var size = 2 / calcActiveHeight;
			var ls = this.transform.localScale;
			if (!(Math.abs(ls.x - size) <= floatEpsilon) ||
				!(Math.abs(ls.y - size) <= floatEpsilon) ||
				!(Math.abs(ls.z - size) <= floatEpsilon)) {
				this.transform.localScale.set(size, size, size);
				this.transform.setNeedUpdate(true);
			}
		}
	},
	GetDrawCalls: function() {
		return this.drawCalls;
	},
	GetCamera: function() {
		return this.camera;
	},
});

//
// ..\src\gui\ui\UISprite.js
//

NGUI.UISprite = function(gameObject) {
	NGUI.UIBasicSprite.call(this, gameObject);
	this.mAtlas = undefined;
	this.mSpriteName = '';
	this.mSprite = undefined; // refrence to UISpriteData
};

Object.assign(NGUI.UISprite.prototype = Object.create(NGUI.UIBasicSprite.prototype), {
	constructor: NGUI.UISprite,
	texture: function() { return this.mAtlas ? this.mAtlas.texture : undefined; },
	border: function() {
		var sp = this.GetAtlasSprite();
		if (sp) return new UnityEngine.Vector4(sp.borderLeft, sp.borderBottom, sp.borderRight, sp.borderTop);
		return new UnityEngine.Vector4(0, 0, 0, 0); 
	},
	Load: function(json) {
		NGUI.UIBasicSprite.prototype.Load.call(this, json);
		this.mAtlas = UnityEngine.Resources.Load(json.l, 'UIAtlas');
		this.mSpriteName = json.s;
	},
	GetAtlasSprite: function() {
		if (this.mAtlas !== undefined && this.mSprite === undefined) 
			this.mSprite = this.mAtlas.GetSprite(this.mSpriteName);
		return this.mSprite;
	},
	OnFill: function(verts, uvs, cols) {
		if (this.mAtlas === undefined) return;
		var tex = this.mAtlas.texture;
		if (tex === undefined) return;

		var sprite = this.GetAtlasSprite();
		if (sprite === undefined) return;

		var outer = new UnityEngine.Rect(sprite.x, sprite.y, sprite.width, sprite.height);
		var inner = new UnityEngine.Rect(sprite.x + sprite.borderLeft, sprite.y + sprite.borderTop,
			sprite.width - sprite.borderLeft - sprite.borderRight,
			sprite.height - sprite.borderBottom - sprite.borderTop);
		outer = NGUIMath.ConvertToTexCoords(outer, tex.width, tex.height);
		inner = NGUIMath.ConvertToTexCoords(inner, tex.width, tex.height);
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
	get hasPadding() { return (this.paddingLeft | this.paddingRight | this.paddingTop | this.paddingBottom) != 0; },
	Load: function(json) {
		this.name = json.name;
		this.x = json.x;
		this.y = json.y;
		this.width = json.w;
		this.height = json.h;
		this.borderLeft = json.bl || 0;
		this.borderRight = json.br || 0;
		this.borderTop = json.bt || 0;
		this.borderBottom = json.bb || 0;
		this.paddingLeft = json.pl || 0;
		this.paddingRight = json.pr || 0;
		this.paddingTop = json.pt || 0;
		this.paddingBottom = json.pb || 0;
		return this;
	},
};

//
// ..\src\gui\ui\UILabel.js
//

NGUI.UILabel = function(gameObject) {
    NGUI.UIWidget.call(this, gameObject);
    this.bitmapFont = undefined;
    this.fontSize = 20;
    this.value = "";
    this.overflowMethod = LabelOverflow.ShrinkContent;
    this.alignment = TextAlignment.Automatic;
    this.gradientTop = new UnityEngine.Color(1, 1, 1, 1);
    this.gradientBottom = new UnityEngine.Color(1, 1, 1, 1);
    this.effectStyle = LabelEffect.None;
    this.effectColor = new UnityEngine.Color(0, 0, 0, 1);
    this.effectDistance = new UnityEngine.Vector2(1, 1);
    this.spacingX = 0;
    this.spacingY = 0;
    this.maxLineCount = 0;
    this.supportEncoding = false;
    this.symbolStyle = SymbolStyle.Normal;
    this.fontStyle = FontStyle.Normal;
    this.applyGradient = false;

    this.mCalculatedSize = new UnityEngine.Vector2(0, 0);
    this.mScale = 1;
    this.mPrintedSize = 0;
    this.mLastWidth = 0;
    this.mLastHeight = 0;
    this.mShouldBeProcessed = false;
    this.mProcessedText = "";
    this.mPremultiply = false;
	this.mMaxLineWidth = 0;
	this.mMaxLineHeight = 0;
	this.mLineWidth = 0;
};

LabelEffect = {
    None: 0,
    Shadow: 1,
    Outline: 2,
};

LabelOverflow = {
    ShrinkContent: 0,
    ClampContent: 1,
    ResizeFreely: 2,
    ResizeHeight: 3,
};

TextAlignment ={
    Automatic : 0,
    Left: 1,
    Center: 2,
    Right: 3,
    Justified: 4,
};

SymbolStyle = {
    None: 0,
    Normal: 1,
    Colored: 2,
};

FontStyle = {
    Normal: 0,
    Bold: 1,
    Italic: 2,
    BoldAndItalic: 3,
};

Object.assign(NGUI.UILabel.prototype = Object.create(NGUI.UIWidget.prototype), {
	constructor: NGUI.UILabel,
    defaultFontSize: function() { return (this.bitmapFont !== undefined) ? this.bitmapFont.defaultSize() : 16; },
    processedText: function() {
        if (this.mLastWidth !== this.mWidth || this.mLastHeight !== this.mHeight) {
            this.mLastWidth = this.mWidth;
            this.mLastHeight = this.mHeight;
            this.mShouldBeProcessed = true;
        }
        if (this.mShouldBeProcessed) this.ProcessText(false, true);
        return this.mProcessedText;
    },
    Load: function(json) {
		NGUI.UIWidget.prototype.Load.call(this, json);
        this.bitmapFont = UnityEngine.Resources.Load(json.ft, 'UIFont');
        this.fontSize = json.fs || 20;
        this.value = json.tx || "";
        this.overflowMethod = json.of || LabelOverflow.ShrinkContent;
        this.alignment = json.al || TextAlignment.Automatic;
        this.effectStyle = json.es || LabelEffect.None;
        this.spacingX = json.sx || 0;
        this.spacingY = json.sy || 0;
        this.maxLineCount = json.ml || 0;
        this.supportEncoding = json.se || false;
        this.symbolStyle = json.ss || SymbolStyle.Normal;
        this.fontStyle = json.st || FontStyle.Normal;
        if (json.gt) this.gradientTop.set32(json.gt.r || 255, json.gt.g || 255, json.gt.b || 255, json.gt.a || 255);
        if (json.gb) this.gradientBottom.set32(json.gb.r || 255, json.gb.g || 255, json.gb.b || 255, json.gb.a || 255);
        if (json.ec) this.effectColor.set32(json.ec.r || 0, json.ec.g || 0, json.ec.b || 0, json.ec.a || 255);
        if (json.ed) this.effectDistance.set(json.ed.x || 1, json.ed.y || 1);
    },
    UpdateNGUIText: function() {
		NGUIText.fontSize = this.mPrintedSize;
		NGUIText.fontStyle = this.fontSize;
		NGUIText.rectWidth = this.mWidth;
		NGUIText.rectHeight = this.mHeight;
		NGUIText.regionWidth = Mathf.RoundToInt(this.mWidth * (this.mDrawRegion.z - this.mDrawRegion.x));
		NGUIText.regionHeight = Mathf.RoundToInt(this.mHeight * (this.mDrawRegion.w - this.mDrawRegion.y));
		NGUIText.gradient = this.applyGradient;
		NGUIText.gradientTop = this.gradientTop;
		NGUIText.gradientBottom = this.gradientBottom;
		NGUIText.encoding = this.supportEncoding;
		NGUIText.premultiply = this.mPremultiply;
		NGUIText.symbolStyle = this.symbolStyle;
		NGUIText.maxLines = this.maxLineCount;
		NGUIText.spacingX = this.spacingX;
		NGUIText.spacingY = this.spacingY;
		NGUIText.fontScale = (this.mPrintedSize / this.defaultFontSize()) * this.mScale;
        NGUIText.bitmapFont = this.bitmapFont;
		if (this.alignment === TextAlignment.Automatic) {
			var p = this.mPivot;
			if (p === WidgetPivot.Left || p === WidgetPivot.TopLeft || p === WidgetPivot.BottomLeft)
				NGUIText.alignment = TextAlignment.Left;
			else if (p === WidgetPivot.Right || p === WidgetPivot.TopRight || p === WidgetPivot.BottomRight)
				NGUIText.alignment = TextAlignment.Right;
			else 
                NGUIText.alignment = TextAlignment.Center;
		} else {
            NGUIText.alignment = this.alignment;
        }
		NGUIText.Update();
    },
    ProcessText: function(legacyMode, full) {
		this.mChanged = true;
		this.mShouldBeProcessed = false;
		var regionX = this.mDrawRegion.z - this.mDrawRegion.x;
		var regionY = this.mDrawRegion.w - this.mDrawRegion.y;
		NGUIText.rectWidth    = legacyMode ? (this.mMaxLineWidth  !== 0 ? this.mMaxLineWidth  : 1000000) : this.mWidth;
		NGUIText.rectHeight   = legacyMode ? (this.mMaxLineHeight !== 0 ? this.mMaxLineHeight : 1000000) : this.mHeight;
		NGUIText.regionWidth  = (regionX !== 1) ? Mathf.RoundToInt(NGUIText.rectWidth  * regionX) : NGUIText.rectWidth;
		NGUIText.regionHeight = (regionY !== 1) ? Mathf.RoundToInt(NGUIText.rectHeight * regionY) : NGUIText.rectHeight;
		this.mPrintedSize = Math.abs(legacyMode ? Mathf.RoundToInt(this.transform.localScale.x) : this.defaultFontSize());
		this.mScale = 1;
		if (NGUIText.regionWidth < 1 || NGUIText.regionHeight < 0) {
			this.mProcessedText = "";
			return;
		}
		if (full === true) this.UpdateNGUIText();
		if (this.overflowMethod === LabelOverflow.ResizeFreely || this.overflowMethod === LabelOverflow.ResizeHeight) {
			NGUIText.rectHeight = 1000000;
			NGUIText.regionHeight = 1000000;
		}
		if (this.mPrintedSize > 0) {
			for (var ps = this.mPrintedSize; ps > 0; --ps) {
                this.mScale = ps / this.mPrintedSize;
                NGUIText.fontScale = (this.fontSize / this.bitmapFont.defaultSize()) * this.mScale;
				NGUIText.Update(false);
                var result = NGUIText.WrapText(this.value, true); 
				var fits = result.fits;
                this.mProcessedText = result.text.replace("\\n", "\n");
				if (this.overflowMethod == LabelOverflow.ShrinkContent && fits !== true) {
					if (--ps > 1) continue;
					else break;
				} else if (this.overflowMethod == LabelOverflow.ResizeFreely) {
					this.mCalculatedSize = NGUIText.CalculatePrintedSize(this.mProcessedText);
					this.mWidth = Math.max(this.minWidth, Mathf.RoundToInt(this.mCalculatedSize.x));
					if (regionX != 1) this.mWidth = Mathf.RoundToInt(this.mWidth / regionX);
					this.mHeight = Math.max(this.minHeight, Mathf.RoundToInt(this.mCalculatedSize.y));
					if (regionY != 1) this.mHeight = Mathf.RoundToInt(this.mHeight / regionY);
					if ((this.mWidth & 1) == 1) ++this.mWidth;
					if ((this.mHeight & 1) == 1) ++this.mHeight;
				} else if (this.overflowMethod == LabelOverflow.ResizeHeight) {
					this.mCalculatedSize = NGUIText.CalculatePrintedSize(this.mProcessedText);
					this.mHeight = Math.max(this.minHeight, Mathf.RoundToInt(this.mCalculatedSize.y));
					if (regionY != 1) this.mHeight = Mathf.RoundToInt(this.mHeight / regionY);
					if ((this.mHeight & 1) == 1) ++this.mHeight;
				} else {
					this.mCalculatedSize = NGUIText.CalculatePrintedSize(this.mProcessedText);
				}
				if (legacyMode)	{
					this.width = Mathf.RoundToInt(this.mCalculatedSize.x);
					this.height = Mathf.RoundToInt(this.mCalculatedSize.y);
					this.transform.localScale.set(1, 1, 1);
				}
				break;
			}
		} else {
			this.transform.localScale.set(1, 1, 1);
			this.mProcessedText = "";
			this.mScale = 1;
		}
		if (full) NGUIText.bitmapFont = undefined;
    },
	ApplyOffset: function(verts, start) {
		var po = this.pivotOffset();
		var fx = Mathf.Lerp(0, -this.mWidth, po.x);
		var fy = Mathf.Lerp(this.mHeight, 0, po.y) + Mathf.Lerp((this.mCalculatedSize.y - this.mHeight), 0, po.y);
		fx = Mathf.RoundToInt(fx);
		fy = Mathf.RoundToInt(fy);
		for (var i = start; i < verts.length; ++i) {
			verts[i].x += fx;
			verts[i].y += fy;
		}
		return new UnityEngine.Vector2(fx, fy);
	},
    ApplyShadow: function(verts, uvs, cols, start, end, x, y) {
		var col = this.effectColor;
		col.a *= this.finalAlpha;
		for (var i = start; i < end; ++i) {
			var v = verts[i].clone();
			v.x += x;
			v.y += y;
			var uc = cols[i].clone();
			if (uc.a !== 255) uc.a = (uc.a / 255 * c.a);
			verts.push(v);
			uvs.push(uvs[i]);
			cols.push(uc);
		}
    },
	OnFill: function(verts, uvs, cols) {
        if (this.bitmapFont === undefined) return;
        var offset = verts.length;
		var col = this.mColor;
		col.a = this.finalAlpha;
		var text = this.processedText();
		var start = verts.length;
		this.UpdateNGUIText();
		NGUIText.tint = col;
		NGUIText.Print(text, verts, uvs, cols);
		NGUIText.bitmapFont = null;
		var pos = this.ApplyOffset(verts, start);
		if (this.effectStyle !== LabelEffect.None) {
			var end = verts.length;
			pos.x = this.effectDistance.x;
			pos.y = this.effectDistance.y;
			this.ApplyShadow(verts, uvs, cols, offset, end, pos.x, -pos.y);
			if (this.effectStyle == LabelEffect.Outline) {
				offset = end;
				end = verts.length;
				this.ApplyShadow(verts, uvs, cols, offset, end, -pos.x, pos.y);
				offset = end;
				end = verts.length;
				this.ApplyShadow(verts, uvs, cols, offset, end, pos.x, pos.y);
				offset = end;
				end = verts.length;
				this.ApplyShadow(verts, uvs, cols, offset, end, -pos.x, -pos.y);
			}
		}
    },
});