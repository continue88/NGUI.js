
NGUI.UIDrawCall = function (name, panel, material) {
    
    this.depthStart = 2147483647; // MaxValue = 2147483647
    this.depthEnd = -2147483648; // int.MinValue = -2147483648;

    this.baseMaterial = material;
    this.renderQueue = panel.startingRenderQueue;
    this.mSortingOrder = panel.mSortingOrder;
    this.manager = panel;
    this.panel = null; // NGUI.UIPanel
    
    this.verts = [];// Vector3
    this.uvs = [];// Vector3
    this.cols = [];// Vector3
}

NGUI.UIDrawCall.Clipping = {
    None: 0,
    SoftClip: 3,				// Alpha-based clipping with a softened edge
    ConstrainButDontClip: 4,	// No actual clipping, but does have an area
};

NGUI.UIDrawCall.prototype = {
    constructor: NGUI.UIDrawCall,
    UpdateGeometry: function(count) {
    },
};