
UnityEngine.GameObject = function () {
	this.name = '';
	this.transform = new UnityEngine.Transform(this);
	this.components = [];
};

UnityEngine.GameObject.prototype = {
	constructor: UnityEngine.GameObject,
	GetComponent: function(typeName) {
		var componentType = NGUI[typeName] || UnityEngine[typeName];
		for (var i in this.components) {
			var comp = this.components[i];
			if (comp instanceof componentType)
				return comp;
		}
	},
	Load: function(json) {
		this.name = json.n;
		var trans = json.t;
		var comps = json.c;
		var child = json.q;
		if (trans !== undefined) this.transform.Load(trans);
		if (comps !== undefined) {
			for (var i in comps) {
				var componentData = comps[i];
				var componentTypeName = componentData.meta_type;
				var componentType = NGUI[componentTypeName] || UnityEngine[componentTypeName];
				if (componentType) {
					var component = new componentType(this);
					component.Load(componentData);
					this.components.push(component);
				}
			}
		}
		if (child !== undefined) {
			for (var i in child) {
				var go = new UnityEngine.GameObject();
				go.transform.setParent(this.transform);
				go.Load(child[i]);
			}
		}
		// update from the root.
		if (this.transform.parent === undefined)
			this.transform.Update();
		return this;
	},
};