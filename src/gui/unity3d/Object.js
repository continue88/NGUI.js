UnityEngine.Object = function() {
    this.instanceID = UnityEngine.Object.StaticId++;
};

UnityEngine.Object.StaticId = 10000;
UnityEngine.Object.Map = {};
UnityEngine.Object.Destroy = function(obj) {
    var id = obj.GetInstanceID();
    var map = UnityEngine.Object.Map;
    var obj = map[id];
    if (obj === undefined)
        return console.log('Could not delete object with id (Not found): ' + id);
    if (obj.OnDestroy !== undefined) obj.OnDestroy(); // execute the [OnDestroy]
    delete map[id];
}
UnityEngine.Object.RegisterObject = function(obj) {
    var id = obj.GetInstanceID();
    if (id === undefined)
        return console.error('Register object failed with not id.' + obj);
    var map = UnityEngine.Object.Map;
    if (map[id] !== undefined)
        console.warn('Object with id already register, override it: ' + id);
    map[id] = obj;
    if (obj.Awake !== undefined) obj.Awake();
}
UnityEngine.Object.FindObjectWithId = function(id) {
    return UnityEngine.Object.Map[id];
}
UnityEngine.Object.FindObjectOfType = function(type) {
    type = UnityEngine.GetType(type);
    var map = UnityEngine.Object.Map;
    for (var i in map) {
        var obj = map[i];
        if (obj instanceof type) return obj;
    }
}
UnityEngine.Object.FindObjectsOfType = function(type) {
    type = UnityEngine.GetType(type);
    var map = UnityEngine.Object.Map;
    var ret = [];
    for (var i in map) {
        var obj = map[i];
        if (obj instanceof type) ret.push(obj);
    }
    return ret;
}

UnityEngine.Object.prototype = {
    constructor: UnityEngine.Object,
    GetInstanceID: function() { return this.instanceID; },
    Load: function(json) {
        if (json.meta_id != 0)
            this.instanceID = json.meta_id;
        else
            console.warn('no id found!!!');
        UnityEngine.Object.RegisterObject(this);
    },
    SendMessage: function(methodName, value) {
        var func = this[methodName];
        if (typeof(func) === 'function') func(value);
     },
};