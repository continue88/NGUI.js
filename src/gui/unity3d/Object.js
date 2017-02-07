UnityEngine.Object = function() {
    this.instanceID = UnityEngine.Object.StaticId++;
};

UnityEngine.Object.StaticId = 10000;
UnityEngine.Object.Map = {};
UnityEngine.Object.Queue = {
    Start: [],
    Update: {},
    OnDestroy: [],
};
UnityEngine.Object.Destroy = function(obj) {
    var Object = UnityEngine.Object; 
    var id = obj.GetInstanceID();
    var obj = Object.Map[id];
    if (obj === undefined)
        return console.log('Could not delete object with id (Not found): ' + id);
    delete Object.Map[id];
    delete Object.Queue.Update[id];
    Object.Queue.OnDestroy.push(obj);
}
UnityEngine.Object.RegisterObject = function(obj) {
    var Object = UnityEngine.Object; 
    var id = obj.GetInstanceID();
    if (id === undefined)
        return console.error('Register object failed with not id.' + obj);
    if (Object.Map[id] !== undefined)
        console.warn('Object with id already register, override it: ' + id);
    Object.Map[id] = obj;
    if (obj.Awake !== undefined) obj.Awake();
    if (obj.Start !== undefined) Object.Queue.Start.push(obj);
    if (obj.Update !== undefined) Object.Queue.Update[id] = obj;
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
UnityEngine.Object.Update = function() {
    var ObjectQueue = UnityEngine.Object.Queue;
    while (ObjectQueue.Start.length > 0) {
        var obj = ObjectQueue.Start.pop();
        obj.Start();
    }
    for (var i in ObjectQueue.Update) {
        var obj = ObjectQueue.Update[i];
        obj.Update();
    }
    while (ObjectQueue.OnDestroy.length > 0) {
        var obj = ObjectQueue.OnDestroy.pop();
        obj.OnDestroy();
    }
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
        if (typeof(func) === 'function') func.call(this, value);
     },
};