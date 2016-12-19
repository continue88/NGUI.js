UnityEngine.Object = function() {
    this.instanceID = UnityEngine.Object.StaticId++;
};

UnityEngine.Object.StaticId = 10000;

UnityEngine.Object.prototype = {
    constructor: UnityEngine.Object,
    GetInstanceID: function() { return this.instanceID; },
    Load: function(json) {
        if (json.meta_id > 0)
            this.instanceID = json.meta_id;
    }
};