
StringBuilder = function(text) {
    this.text = text || "";
}

StringBuilder.prototype = {
    constructor: StringBuilder,
    Append: function(value) {
        if (typeof(value) === 'number')
            value = String.fromCharCode(value);
        this.text = this.text.concat(value);
    },
    AppendLine: function(value) {
        this.Append(value);
        this.Append('\n');
    },
    ToString: function() {
        return this.text;
    }
};