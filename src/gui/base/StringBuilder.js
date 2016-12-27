
StringBuilder = function(text) {
    this.text = text || "";
}

StringBuilder.prototype = {
    constructor: StringBuilder,
    get length() { return this.text.length; }, 
    charCodeAt: function(i) { return this.text.charCodeAt(i); },
    splice: function(idx, count, append) {
        this.Append(append);
    },
    Append: function(value) {
        if (typeof(value) === 'number')
            value = String.fromCharCode(value);
        this.text += value;
    },
    AppendLine: function(value) {
        this.Append(value);
        this.Append('\n');
    },
    ToString: function() {
        return this.text;
    }
};