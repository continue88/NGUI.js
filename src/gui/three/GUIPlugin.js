
THREE.GUIPlugin = function(renderer, uiRoot) {
	var gl = renderer.context;
	var state = renderer.state;
	var programInfos;

	this.render = function(scene, camera) {
		if (programInfos === undefined)
			programInfos = createProgramInfos();

		state.disable( gl.CULL_FACE );
        state.setBlending( THREE.NormalBlending );
        state.setDepthTest( false );
        state.setDepthWrite( false );
        
        var drawCalls = uiRoot.GetDrawCalls();
        for (var i in drawCalls) {
            var drawCall = drawCalls[i];
            var mesh = drawCall.mMesh;
            var texture = drawCall.texture;
            var programInfo = programInfos[drawCall.mClipCount];
            if (mesh === undefined ||
                texture === undefined ||
                programInfo === undefined)
                
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
            texture.SetupTexture(gl, state, 0);

            // draw...
            if (mesh.hasIndexBuffer())
			    gl.drawElements(gl.TRIANGLES, mesh.triangleCount * 3, gl.UNSIGNED_SHORT, 0);
            else
                gl.drawArrays(gl.TRIANGLES, 0, mesh.vertexCount);
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