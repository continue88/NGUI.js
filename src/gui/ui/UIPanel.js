
NGUI.UIPanel = function() {
    NGUI.UIRect.call();

    this.widgets = []; // NGUI.UIWidget list
    this.drawCalls = []; // NGUI.UIDrawCall
};

Object.assign(NGUI.UIPanel.prototype, NGUI.UIRect.prototype, {
    constructor: NGUI.UIPanel,
});