
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