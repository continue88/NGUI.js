
UnityEngine.Resources = {
	resourcesList: {},
	objectLoading: 0,
	getDataRoot: function() { return _data_; },
	getUrlName: function(url) { 
		var name = url.substring(url.lastIndexOf('/') + 1);
		var ext = name.lastIndexOf('.');
		if (ext < 0) ext = undefined;
		return name.substring(0, ext);
	},
	getFromCache: function(name, typeName) {
		var typeList = this.resourcesList[typeName];
		if (typeList !== undefined) return typeList[name]; 
	},
	addToCache: function(url, typeName, obj) {
		var typeList = this.resourcesList[typeName];
		if (typeList === undefined) 
			typeList = this.resourcesList[typeName] = {};
		var name = this.getUrlName(url);
		typeList[name] = obj;
	},
	onLoadStartInternal: function(url) {
		try {
			this.objectLoading ++;
			if (this.loadStart !== undefined) this.loadStart(url);
		} catch (exception) {
		}
	},
	onLoadFinishedInternal: function(url) {
		try {
			this.objectLoading--;
			if (this.loadFinish !== undefined) this.loadFinish(url);
			if (this.objectLoading <= 0)
				if (this.loadAllFinish !== undefined) this.loadAllFinish();
		} catch (exception) {
		}
	},
	LoadWithType: function(url, type, onLoad) {
		var isScript = (type === 'script'); 
		var element = document.createElement(type);  
		if (isScript) element.type = 'text/javascript';
		element.onload = element.onreadystatechange = function() {  
			if (element.readyState && element.readyState !== 'loaded' && element.readyState !== 'complete')  
				return; 
			
			try {
				if (isScript) {
					var dataRoot = UnityEngine.Resources.getDataRoot();
					dataRoot._url_ = url; // marker the url.
					if (onLoad) onLoad(dataRoot);
				} else {
					if (onLoad) onLoad(element);
				}
			} catch (exception) {
			}
			_data_ = undefined; // clear the data root.
			UnityEngine.Resources.onLoadFinishedInternal(url);
		};  
		element.src = url;  
		// TODO: create a resources element.
		document.getElementsByTagName('head')[0].appendChild(element);
		this.onLoadStartInternal(url);
		return element;  
	},
	Load: function(url, typeName, onLoad) {
		var cacheObj = this.getFromCache(this.getUrlName(url), typeName);
		if (cacheObj !== undefined) return cacheObj;
		this.LoadWithType(url, 'script', function(data) {
			var type = UnityEngine[typeName] || NGUI[typeName];
			if (type !== undefined) {
				var obj = new type();
				obj.Load(data);
				UnityEngine.Resources.addToCache(url, typeName, obj);
				if (onLoad) onLoad(obj);
			} else {
				console.error("Type not found:" + typeName);
			}
		});
	},
	LoadImage: function(url, onLoad) {
		var cacheObj = this.getFromCache(this.getUrlName(url), 'img');
		if (cacheObj !== undefined) return cacheObj;
		this.LoadWithType(url, 'img', function(image) {
			UnityEngine.Resources.addToCache(url, 'img', image);
			if (onLoad) onLoad(image);
		});
	},
};