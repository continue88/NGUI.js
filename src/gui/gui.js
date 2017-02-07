
UnityEngine={
    GetType: function(typeName) {
        if (typeof(typeName) === 'function') return typeName; 
        var type = NGUI[typeName] || UnityEngine[typeName];
        if (typeof(type) === 'function') return type;
    },
    Update: function() {
        UnityEngine.Time.Update();
        UnityEngine.Object.Update();
    },
};

Object.extend = function(target, ...sources) {
  sources.forEach(source => {
    let descriptors = Object.keys(source).reduce((descriptors, key) => {
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
      return descriptors;
    }, {});

    // Object.assign 默认也会拷贝可枚举的Symbols
    Object.getOwnPropertySymbols(source).forEach(sym => {
      let descriptor = Object.getOwnPropertyDescriptor(source, sym);
      if (descriptor.enumerable) {
        descriptors[sym] = descriptor;
      }
    });
    Object.defineProperties(target, descriptors);
  });
  return target;
};

NGUI={

};

WebGL={

};