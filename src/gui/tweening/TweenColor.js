
NGUI.TweenColor = function(gameObject) {
    this.color = undefined;
}

NGUI.TweenColor.Begin = function(target, duration, color) {
    var widget = target.GetComponent('UIWidget');
    widget && widget.setColor(color); 
}