
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
};

UnityEngine.Shader.prototype = {
    constructor: UnityEngine.Shader,
    Load: function(json) {
        this.vertexShader = json.vs;
        this.fragmentShader = json.ps; 
    },
};