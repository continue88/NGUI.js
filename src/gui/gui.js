
UnityEngine={
    GetType: function(typeName) { 
        var type = NGUI[typeName] || UnityEngine[typeName];
        if (typeof(type) === 'function') return type;
    }
};

NGUI={

};

WebGL={

};