
WebGL.Renderer = function (parameters) {
	parameters = parameters || {};
	var canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElement('canvas');

	this.domElement = canvas; 
	this.width = this.domElement.width,
	this.height = this.domElement.height,
	this.gl = getGLContext(parameters, canvas);
	
	function onContextLost() {
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