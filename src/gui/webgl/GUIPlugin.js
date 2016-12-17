
WebGL.GUIPlugin = function(renderer, uiRoot) {
	var gl = renderer.gl;
	var programInfos;
	var maxVertexAttributes = gl.getParameter( gl.MAX_VERTEX_ATTRIBS );

	const shaderPrefix = 'precision highp float;\n';

	this.render = function() {
		if (programInfos === undefined)
			programInfos = createProgramInfos();

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
			'attribute vec3 color;',
			'varying vec2 vUV;',
			'varying vec3 vColor;',
			'void main() {',
			'   vUV = uv;',
			'   vColor = color;',
			'   gl_Position = UNITY_MATRIX_MVP * vec4(vertex, 1.0);',
			'}'
		].join('\n'), [
			'uniform sampler2D _MainTex;',
			'varying vec2 vUV;',
			'varying vec3 vColor;',
			'void main() {',
				'gl_FragColor = texture2D(_MainTex, vUV) * vec4(vColor, 1.0);',
			'}'
		].join('\n'));
		
		var program1 = createProgram([
			'uniform mat4 UNITY_MATRIX_MVP;',
			'uniform vec4 _ClipRange0;',
			'attribute vec3 vertex;',
			'attribute vec2 uv;',
			'attribute vec3 color;',
			'varying vec2 vUV;',
			'varying vec3 vColor;',
			'varying vec2 vWorldPos;',
			'void main() {',
			'   vUV = uv;',
			'   vColor = color;',
			'   vWorldPos = vertex.xy * _ClipRange0.zw + _ClipRange0.xy;',
			'   gl_Position = UNITY_MATRIX_MVP * vec4(vertex, 1.0);',
			'}'
		].join('\n'), [
			'uniform sampler2D _MainTex;',
			'uniform vec4 _ClipArgs0;',
			'varying vec2 vUV;',
			'varying vec3 vColor;',
			'varying vec2 vWorldPos;',
			'void main() {',
			'   vec2 factor = (vec2(1.0, 1.0) - abs(vWorldPos)) * _ClipArgs0.xy;',
			'   vec4 col = texture2D(_MainTex, vUV) * vec4(vColor, 1.0);',
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
			'   vUV = uv;',
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
			'   vUV = uv;',
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