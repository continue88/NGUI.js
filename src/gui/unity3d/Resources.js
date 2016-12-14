
UnityEngine.Resources = {
    LoadScript: function(url, onLoad) {
        var script = document.createElement('script');  
        script.type = 'text/javascript';
        script.onload = script.onreadystatechange = function() {  
            if (script.readyState && script.readyState != 'loaded' && script.readyState != 'complete')  
                return; 
            // the script data file should always begin with: data={...}
            if (onLoad) onLoad(data);
            data = undefined;
        };  
        script.src = url;  
        document.getElementsByTagName('head')[0].appendChild(script);
        return script;  
    },
    LoadImage: function(url, type) {
        var script = document.createElement('img');
        script.onload = script.onreadystatechange = function() {  
            if (script.readyState && script.readyState != 'loaded' && script.readyState != 'complete')  
                return; 
        };  
        script.src = url;  
        document.getElementsByTagName('head')[0].appendChild(script);
        return script;  
    },
    LoadInternal: function(url, onLoad) {
        if (url.endsWith('.js')) return this.LoadScript(url, onLoad);
        else if (url.endsWith('.png')) return this.LoadImage(url, onLoad);
    },
    Load: function(url, typeName) {
        this.LoadInternal(url, function(data) {
            var type = UnityEngine[typeName] || NGUI[typeName];
            if (type !== undefined) {
                var obj = new type();
                obj.Load(data);
            }
        });
    },
};