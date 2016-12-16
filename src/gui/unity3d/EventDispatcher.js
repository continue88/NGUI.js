
UnityEngine.EventDispatcher = function() {
    this._listeners = {};
}

UnityEngine.EventDispatcher.prototype = {
    constructor: UnityEngine.EventDispatcher,
	on: function(type, listener) {
		var listeners = this._listeners;
		if (listeners[ type ] === undefined) listeners[ type ] = [];
		if (listeners[ type ].indexOf(listener) === - 1)
			listeners[ type ].push(listener);
	},
	remove: function(type, listener) {
		var listeners = this._listeners;
		var listenerArray = listeners[ type ];
		if (listenerArray !== undefined) {
			var index = listenerArray.indexOf(listener);
			if (index !== - 1)
				listenerArray.splice(index, 1);
		}
	},
	emit: function(event) {
		var listeners = this._listeners;
		var listenerArray = listeners[ event.type ];
		if (listenerArray !== undefined) {
			event.target = this;
			var array = [], i = 0;
			var length = listenerArray.length;
			for (i = 0; i < length; i ++)
				array[ i ] = listenerArray[ i ];
			for (i = 0; i < length; i ++)
				array[ i ].call(this, event);
		}
	}
};