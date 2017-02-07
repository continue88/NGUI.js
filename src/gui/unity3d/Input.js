
UnityEngine.Input = {
    mousePosition: new UnityEngine.Vector2(0, 0),
    lastMouseState: undefined,
    mouseState: undefined,
    mouseEvents: ['mousedown', 'mousemove'], // 'mouseup' is hookup by mousemove...
    onMouseEvent: function(event) {
        this.lastMouseState = this.mouseState;
        this.mouseState = event;
        this.mousePosition.x = event.x;
        this.mousePosition.y = event.y;
    },
    GetMouseButtonDown: function(button) {
        if (!this.lastMouseState) return false;
        var lastPress = ((button === undefined) ? this.lastMouseState.buttons : (this.lastMouseState.buttons & (1 << button))) != 0;
        var curtPress = ((button === undefined) ? this.mouseState.buttons : (this.mouseState.buttons & (1 << button))) != 0;
        return !lastPress && curtPress;
    },
    GetMouseButtonUp: function(button) {
        if (!this.lastMouseState) return false;
        var lastPress = ((button === undefined) ? this.lastMouseState.buttons : (this.lastMouseState.buttons & (1 << button))) != 0;
        var curtPress = ((button === undefined) ? this.mouseState.buttons : (this.mouseState.buttons & (1 << button))) != 0;
        return lastPress && !curtPress;
    },
    GetMouseButton: function(button) {
        if (!this.lastMouseState) return false;
        if (button === undefined) return this.mouseState.buttons != 0;
        else return (this.mouseState.buttons & (1 << button)) != 0;
    },
    Start: function() {
        for (var i in this.mouseEvents)
            document.addEventListener(this.mouseEvents[i], UnityEngineInputOnMouseEvent, false); 
    },
    Stop: function() {
        for (var i in this.mouseEvents)
            document.removeEventListener(this.mouseEvents[i], UnityEngineInputOnMouseEvent, false); 
    },
};

function UnityEngineInputOnMouseEvent(event) {
    UnityEngine.Input.onMouseEvent(event);
}

// start by default.
UnityEngine.Input.Start();