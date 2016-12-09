
UnityEngine.Rect = function(left, top, width, height) {
    this.xMin = left;
    this.xMax = left + width;
    this.yMin = top;
    this.yMax = top + height;
};

UnityEngine.Rect.prototype = {
    constructor: UnityEngine.Rect,
    get left() { return this.xMin; },
    get top() { return this.yMin; },
    get width() { return this.xMax - this.xMin; },
    get height() { return this.yMax - this.yMin; },
    copy: function(source) {
        this.xMin = source.xMin;
        this.xMax = source.xMax;
        this.yMin = source.yMin;
        this.yMax = source.yMax;
        return this;
    },
};