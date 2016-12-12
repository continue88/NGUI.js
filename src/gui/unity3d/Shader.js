
UnityEngine.Shader = function(gl, renderer, json) {
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

	this.program = undefined;
	this.gl = undefined; // parse form the context.
	this.cachedUniforms = undefined;
	this.cachedAttributes = undefined;
}

UnityEngine.Shader.compileSource = function(gl, type, src) {
	var shader = gl.createShader( type );
	gl.shaderSource( shader, src );
	gl.compileShader( shader );
	if ( gl.getShaderParameter( shader, gl.COMPILE_STATUS ) === false )
		console.error( 'THREE.WebGLShader: Shader couldn\'t compile.' );
	return shader;
}

UnityEngine.Shader.compileShader = function(gl, vertexShader, fragmentShader) {
	var program = gl.createProgram();
	var glVertexShader = UnityEngine.Shader.compileSource(gl, gl.VERTEX_SHADER, vertexShader);
	var glFragmentShader = UnityEngine.Shader.compileSource(gl, gl.FRAGMENT_SHADER, fragmentShader);
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

UnityEngine.Shader.getUniforms = function(gl, program) {
	return new UnityEngine.ShaderUniforms(gl, program, renderer);
}

UnityEngine.Shader.getAttributes = function(gl, program) {
	var attributes = {};
	var n = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
	for (var i = 0; i < n; i ++) {
		var info = gl.getActiveAttrib(program, i);
		var name = info.name;
		attributes[name] = gl.getAttribLocation(program, name);
	}
	return attributes;
}

UnityEngine.Shader.prototype = {
	constructor: UnityEngine.Shader,
	destroy: function() {
		this.gl.deleteProgram(this.program);
		this.program = undefined;
	},
	getAttributes: function() {
		if (this.cachedAttributes === undefined)
			this.cachedAttributes = UnityEngine.Shader.getAttributes(this.gl, this.program);
		return this.cachedAttributes;
	},
	PropertyToID: function(name) {
		// parse property to id.
	},
	Load: function(json) {
		this.vertexShader = json.vs;
		this.fragmentShader = json.ps; 
	},
};