
NGUI.UICamera = function(gameObject) {
	UnityEngine.MonoBehaviour.call(this, gameObject);
    this.camera = undefined;
    this.hoveredObject = undefined;
    this.currentTouch = undefined;
    this.selectedObject = undefined;
    this.mouseDragThreshold = 4;
    this.mouseClickThreshold = 10;

    this.mNextRaycast = 0;
    this.mHits = [];
    this.mHover = undefined;
    this.mMouse = { 
        pressed: undefined,
        dragged: undefined,
        last: undefined,
        current: undefined,
        totalDelta: new UnityEngine.Vector2(0, 0),
     };
};

NGUI.UICamera.current = undefined;

Object.extend(NGUI.UICamera.prototype = Object.create(UnityEngine.MonoBehaviour.prototype), {
	constructor: NGUI.UICamera,
    Load: function(json) {
        UnityEngine.MonoBehaviour.prototype.Load.call(this, json);
        this.camera = this.gameObject.GetComponent('Camera');
        if (this.camera !== undefined) {
            var uiRoot = NGUITools.FindInParents(this.gameObject, 'UIRoot');
            if (uiRoot !== undefined) uiRoot.camera = this.camera;
        }
        NGUI.UICamera.current = this;
    },
    Update: function() {
        // Test hit...
        this.ProcessMouse();
    },
    Notify: function(go, funcName, obj) {
        //console.log('notify:' + (go && go.name) + ':' + funcName + '(' + obj + ')');
        go && go.SendMessage(funcName, obj);
    },
    ProcessMouse: function() {
        var Input = UnityEngine.Input;
		var isPressed = false, justPressed = false;
        if (Input.GetMouseButtonDown()) {
            justPressed = true;
            isPressed = true;
        } else if (Input.GetMouseButton()) {
            isPressed = true;
        }
        if (isPressed || this.mNextRaycast < UnityEngine.Time.unscaledTime) {
             this.mNextRaycast = UnityEngine.Time.unscaledTime + 0.02;
			if (!this.Raycast(Input.mousePosition)) 
                this.hoveredObject = undefined;
            this.mMouse.current = this.hoveredObject;
        }
		var highlightChanged = (this.mMouse.last !== this.mMouse.current);
        if (this.mHover !== undefined && highlightChanged) {
            this.Notify(this.mHover, "OnHover", false);
            this.mHover = undefined;
        }

        var pressed = Input.GetMouseButtonDown();
        var unpressed = Input.GetMouseButtonUp();
        this.currentTouch = this.mMouse;
        this.ProcessTouch(pressed, unpressed);

        if (!isPressed && highlightChanged) {
            this.mHover = this.mMouse.current;
            this.Notify(this.mHover, "OnHover", true);
        }

        this.mMouse.last = this.mMouse.current;
    },
    ProcessTouch: function(pressed, unpressed) {
        var currentTouch = this.currentTouch;
		var drag = this.mouseDragThreshold;
		var click = this.mouseClickThreshold;
        if (pressed) {
			currentTouch.pressStarted = true;
			this.Notify(currentTouch.pressed, "OnPress", false);
			currentTouch.pressed = currentTouch.current;
			currentTouch.dragged = currentTouch.current;
			currentTouch.totalDelta = UnityEngine.Vector2.zero;
			currentTouch.dragStarted = false;
			this.Notify(currentTouch.pressed, "OnPress", true);

			// Update the selection
			if (currentTouch.pressed != this.selectedObject) {
				this.selectedObject = currentTouch.pressed;
			}
        } else if (currentTouch.pressed) {
            // process dragging...
        }
		if (unpressed) {
			currentTouch.pressStarted = false;
			if (currentTouch.pressed !== undefined) {
				if (currentTouch.dragStarted) {
					this.Notify(currentTouch.last, "OnDragOut", currentTouch.dragged);
					this.Notify(currentTouch.dragged, "OnDragEnd", null);
				}
				this.Notify(currentTouch.pressed, "OnPress", false);
                this.Notify(currentTouch.current, "OnHover", true);
				this.mHover = currentTouch.current;

				if (currentTouch.dragStarted) // The button/touch was released on a different object
					this.Notify(currentTouch.current, "OnDrop", currentTouch.dragged);

                if (currentTouch.dragged === currentTouch.current || 
                    currentTouch.totalDelta.sqrMagnitude() < drag) {
                    if (currentTouch.pressed == currentTouch.current) {
                        this.Notify(currentTouch.pressed, "OnClick", null);
                        currentTouch.clickTime = UnityEngine.Time.unscaledTime;
                    }
                }
			}
			currentTouch.dragStarted = false;
			currentTouch.pressed = undefined;
			currentTouch.dragged = undefined;
        }
    },
    Raycast: function(inPos) {
        var currentCamera = this.camera;
        var dist = currentCamera.farClipPlane - currentCamera.nearClipPlane;
        var ray = currentCamera.ScreenPointToRay(inPos);
        var hits = UnityEngine.Physics.RaycastAll(ray, dist, -1);
        var targetObject = undefined;
        if (hits.length > 1) {
            var minDepth = 1000000000;
            for (var i in hits) {
                var go = hits[i].gameObject;
                var w = go.GetComponent("UIWidget");
                if (w !== undefined && w.isVisible() !== true)
                    continue;
                var depth = NGUITools.CalculateRaycastDepth(go);
                if (depth !== undefined && depth < minDepth) {
                    minDepth = depth;
                    targetObject = go;
                }
            }
        } else if (hits.length == 1) {
            targetObject = hits[0].gameObject;
        } else {
        }

        if (targetObject) {
            this.hoveredObject = targetObject;
            return true;
        }
        return false;
    },
});