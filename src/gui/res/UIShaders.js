
NGUI.Shaders = {};
NGUI.Shaders['Unlit/Transparent Colored'] = {
    Cull: 'Off',
    Lighting: 'Off',
    ZWrite: 'Off',
    Fog: { Mode: 'Off' },
    Offset: [-1, -1],
    Blend: ['SrcAlpha', 'OneMinusSrcAlpha'],
    vertexShader: [
        'struct appdata_t {',
        '    float4 vertex : POSITION;',
        '    float2 texcoord : TEXCOORD0;',
        '    fixed4 color : COLOR;',
        '};',
        'struct v2f {',
        '    float4 vertex : SV_POSITION;',
        '    half2 texcoord : TEXCOORD0;',
        '    fixed4 color : COLOR;',
        '};',
        'v2f vert (appdata_t v) {',
        '    v2f o;',
        '    o.vertex = mul(UNITY_MATRIX_MVP, v.vertex);',
        '    o.texcoord = v.texcoord;',
        '    o.color = v.color;',
        '    return o;',
        '}',
    ].join('\n'),
    fragmentShader: [
        'uniform sampler2D _MainTex;',
        'uniform float4 _MainTex_ST;',
        'struct v2f {',
        '    float4 vertex : SV_POSITION;',
        '    half2 texcoord : TEXCOORD0;',
        '    fixed4 color : COLOR;',
        '};',
        'fixed4 frag (v2f IN) : COLOR {',
        '    fixed4 col = tex2D(_MainTex, IN.texcoord) * IN.color;',
        '    return col;',
        '}',
    ].join('\n'),
};
Object.assign(
    NGUI.Shaders["Unlit/Transparent Colored 1"], 
    NGUI.Shaders['Unlit/Transparent Colored'], {
});