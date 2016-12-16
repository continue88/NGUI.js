
UnityEngine={
    GetType: function(typeName) {
        if (typeof(typeName) === 'function') return typeName; 
        var type = NGUI[typeName] || UnityEngine[typeName];
        if (typeof(type) === 'function') return type;
    }
};

NGUI={

};

WebGL={

};