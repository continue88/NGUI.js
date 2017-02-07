
NGUI.TweenAlpha = function(gameObject) {
    this.color = undefined;
}

NGUI.TweenAlpha.Begin = function(target, duration, alpha) {
    var widget = target.GetComponent('UIWidget');
    widget && widget.setAlpha(alpha); 
}