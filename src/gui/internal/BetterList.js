
NGUI.BetterList = function() {
    // better list.
    this.type = undefined;
    this.buffer = undefined;
    this.size = 0;
    this.stride = 1;
}

NGUI.BetterList.prototype = {
    constructor: NGUI.BetterList,
	allocateMore: function(type, stride, newSize) {
        if (type) { this.type = type; this.stride = stride; }
        newSize = Math.max(newSize || 32, this.buffer !== undefined ? Math.min(this.buffer.length + 1024, this.buffer.length * 2) : 32);
        var newBuffer = new type(newSize);
		if (this.buffer) newBuffer.set(this.buffer, 0);
        this.buffer = newBuffer;
	},
    get RawLength() { return this.size; },
    get Length() { return this.size / this.stride; }, 
    get Data() { return this.buffer; },
    get DataLength() { return this.buffer ? this.buffer.length : 0; },
    CopyMeta(list) { this.type = list.type; this.stride = list.stride; },
    ToArray: function() { return this.buffer ? this.buffer.subarray(0, this.size) : 0; },
    AddList: function(list) {
        var newSize = this.size + list.size;
        if (this.DataLength < newSize)
            this.allocateMore(list.type, list.stride, newSize);
        this.buffer.set(list.ToArray(), this.size);
        this.size = newSize;
    },
    Clear: function() {
        this.size = 0;
    },
    Foreach3: function(cb) {
        if (this.size === 0)  return;
        for (var i = 0, l = this.size; i < l; i+=3)
            cb(i, this.buffer[i], this.buffer[i+1], this.buffer[i+2]);
    },
    AddVector2: function(u, v) {
        var newSize = this.size + 2;
        if (this.buffer === undefined || this.buffer.length < newSize)
            this.allocateMore(Float32Array, 2);
        this.buffer[this.size++] = u;
        this.buffer[this.size++] = v;
    },
    AddVector3: function(x, y, z) {
        var newSize = this.size + 3;
        if (this.buffer === undefined || this.buffer.length < newSize)
            this.allocateMore(Float32Array, 3);
        this.buffer[this.size++] = x;
        this.buffer[this.size++] = y;
        this.buffer[this.size++] = z;
    },
    AddColor32v: function(r, g, b, a) {
        var newSize = this.size + 4;
        if (this.buffer === undefined || this.buffer.length < newSize)
            this.allocateMore(Uint8ClampedArray, 4);
        this.buffer[this.size++] = r;
        this.buffer[this.size++] = g;
        this.buffer[this.size++] = b;
        this.buffer[this.size++] = a;
    },
    AddColor32: function(color32) {
        var newSize = this.size + 4;
        if (this.buffer === undefined || this.buffer.length < newSize)
            this.allocateMore(Uint8ClampedArray, 4);
        this.buffer[this.size++] = color32.r;
        this.buffer[this.size++] = color32.g;
        this.buffer[this.size++] = color32.b;
        this.buffer[this.size++] = color32.a;
    },
};