
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
		this.name = json.name;
		if (json.transform) this.transform.Load(json.transform);
		if (json.components) {
			for (var i in json.components) {
				var componentData = json.components[i];
				var componentTypeName = componentData.meta_type;
				var componentType = NGUI[componentTypeName] || UnityEngine[componentTypeName];
				if (componentType) {
					var component = new componentType(this);
					component.Load(componentData);
					this.components.push(component);
				}
			}
		}
		if (json.children) {
			for (var i in json.children) {
				var go = new UnityEngine.GameObject();
				go.transform.setParent(this.transform);
				go.Load(json.children[i]);
			}
		}
		return this;
	},
};