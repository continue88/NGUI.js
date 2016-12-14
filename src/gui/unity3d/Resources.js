
UnityEngine.Resources = {
    LoadScript: function(url, type) {
        var script = document.createElement('script');  
        script.type = 'text/javascript';
        script.onload = script.onreadystatechange = function() {  
            if (script.readyState && script.readyState != 'loaded' && script.readyState != 'complete')  
                return; 
            console.log(data);
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

    Load: function(url, type) {
        if (url.endsWith('.js'))
            return this.LoadScript(url, type);
        
        if (url.endsWith('.png'))
            return this.LoadImage(url, type);
    }
};