
UnityEngine.GameObject = function () {
    this.name = '';
    this.transform = new UnityEngine.Transform(this);
    this.components = [];
};

UnityEngine.GameObject.prototype = {
	constructor: UnityEngine.GameObject,
    Load: function(json) {
        this.name = json.name;
        if (json.transform) this.transform.Load(json.transform);
        if (json.children) {
            for (var i in json.children) {
                var go = new UnityEngine.GameObject();
                go.transform.parent = this.transform;
                this.transform.children.push(go.transform);
                go.Load(json.children[i]);
            }
        }
        if (json.components) {
            for (var i in json.components) {
                var componentData = json.components[i];
                var componentTypeName = componentData.typeName;
                var componentType = NGUI[componentTypeName] | UnityEngine[componentTypeName];
                if (componentType) {
                    var component = new componentType(this);
                    component.Load(componentData);
                    this.components.push(component);
                }
            }
        }
        return this;
    },
};