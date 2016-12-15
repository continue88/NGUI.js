
UnityEngine.Resources = {
	ResourcesList: {},
	GetDataRoot: function() { return _data_; },
	LoadWithType: function(url, type, onLoad) {
		var isScript = (type === 'script'); 
		var element = document.createElement(type);  
		if (isScript) element.type = 'text/javascript';
		element.onload = element.onreadystatechange = function() {  
			if (element.readyState && element.readyState !== 'loaded' && element.readyState !== 'complete')  
				return; 
			
			if (isScript) {
				// the script data file should always begin with: _data_={...}
				var dataRoot = UnityEngine.Resources.GetDataRoot();
				dataRoot._url_ = url; // marker the url.
				if (onLoad) onLoad(dataRoot);
				_data_ = undefined; // clear the data root.
			} else {
				if (onLoad) onLoad(element);
			}
		};  
		element.src = url;  
		document.getElementsByTagName('head')[0].appendChild(element);
		return element;  
	},
	Load: function(url, typeName, onLoad) {
		// TODO: check cache.
		this.LoadWithType(url, 'script', function(data) {
			var type = UnityEngine[typeName] || NGUI[typeName];
			if (type !== undefined) {
				var obj = new type();
				obj.Load(data);
				if (onLoad) onLoad(obj);
			} else {
				console.error("Type not found:" + typeName);
			}
		});
	},
	LoadImage: function(url, onLoad) {
		// TODO: check cache.
		this.LoadWithType(url, 'img', function(image) {
			if (onLoad) onLoad(image);
		});
	},
};