
UnityEngine.GameObject = function () {
	this.name = '';
	this.transform = new UnityEngine.Transform(this);
	this.components = [];
};

UnityEngine.GameObject.prototype = {
	constructor: UnityEngine.GameObject,
	GetComponent: function(typeName) {
		var componentType = UnityEngine.GetType(typeName);
		for (var i in this.components) {
			var comp = this.components[i];
			if (comp instanceof componentType)
				return comp;
		}
	},
	GetComponentInChildren: function(typeName) {
		var testList = [this.transform];
		var switchList = [];
		while (true) {
			switchList.length = 0;
			for (var i in testList) {
				var transform = testList[i]; 
				var comp = transform.gameObject.GetComponent(typeName);
				if (comp !== undefined) return comp;
				for (var c in transform.children)
					switchList.push(transform.children[c]);
			}
			if (switchList.length === 0) break;
			var tmp = testList;
			testList = switchList;
			switchList = tmp;
		}
	},
	GetComponentsInChildren: function(typeName) {
		var foundList = [];
		var testList = [this.transform];
		var switchList = [];
		while (true) {
			switchList.length = 0;
			for (var i in testList) {
				var transform = testList[i]; 
				var comp = transform.gameObject.GetComponent(typeName);
				if (comp !== undefined) foundList.push(comp);
				for (var c in transform.children)
					switchList.push(transform.children[c]);
			}
			if (switchList.length === 0) break;
			var tmp = testList;
			testList = switchList;
			switchList = tmp;
		}
		return foundList;
	},
	LoadInternal: function(datas, onCreate, onLoad) {
		if (datas === undefined) return;
		var createList = [];
		for (var i in datas) {
			var data = datas[i];
			var obj = onCreate(data);
			if (obj !== undefined) {
				obj._data_ = data;
				createList.push(obj);
			}
		}
		for (var i in createList) {
			var obj = createList[i];
			onLoad(obj, obj._data_);
			obj._data_ = undefined;
		}
	},
	Load: function(json) {
		var self = this;
		var trans = json.t;
		var comps = json.c;
		var child = json.q;
		self.name = json.n;
		if (trans !== undefined) self.transform.Load(trans);
		this.LoadInternal(comps, function(data) {
			var typeName = data.meta_type;
			var componentType = UnityEngine.GetType(typeName);
			if (componentType !== undefined) {
				var component = new componentType(self);
				self.components.push(component);
				return component;
			}
		}, function(component, data) {
			component.Load(data);
		});
		this.LoadInternal(child, function(data) {
			var go = new UnityEngine.GameObject();
			go.transform.setParent(self.transform);
			return go;
		}, function(go, data) {
			go.Load(data);
		});
		
		// update from the root.
		if (this.transform.parent === undefined)
			this.transform.Update();
		return this;
	},
};