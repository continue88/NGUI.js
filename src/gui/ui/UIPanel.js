
NGUI.UIPanel = function() {
    NGUI.UIRect.call();
};

Object.assign(NGUI.UIPanel.prototype, NGUI.UIRect.prototype, {
    constructor: NGUI.UIPanel,
});