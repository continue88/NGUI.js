
UnityEngine.GameObject = function () {
	this.name = '';
	this.transform = new UnityEngine.Transform(this);
	this.components = [];
};

UnityEngine.GameObject.prototype = {
	constructor: UnityEngine.GameObject,
	GetComponent: function(typeName) {
		var componentType = NGUI[componentTypeName] || UnityEngine[componentTypeName];
		for (var i in this.components) {
			var comp = this.components[i];
			if (comp instanceof componentType)
				return comp;
		}
	},
	Load: function(json) {
		this.name = json.n;
		if (json.t) this.transform.Load(json.t);
		if (json.c) {
			for (var i in json.c) {
				var componentData = json.c[i];
				var componentTypeName = componentData.meta_type;
				var componentType = NGUI[componentTypeName] || UnityEngine[componentTypeName];
				if (componentType) {
					var component = new componentType(this);
					component.Load(componentData);
					this.components.push(component);
				}
			}
		}
		if (json.q) {
			for (var i in json.q) {
				var go = new UnityEngine.GameObject();
				go.transform.setParent(this.transform);
				go.Load(json.q[i]);
			}
		}
		// update from the root.
		if (this.transform.parent === undefined)
			this.transform.Update();
		return this;
	},
};