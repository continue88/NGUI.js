
UnityEngine.Font = function() {

};

UnityEngine.FontStyle = {
    Normal: 0,
    Bold: 1,
    Italic: 2,
    BoldAndItalic: 3,
};

UnityEngine.Font.prototype = {
    HasCharacter: function(c) {
    },
    GetCharacterInfo: function(ch, info, size, style) {
        size = size || 0;
        style = style || UnityEngine.FontStyle.Normal;
        // init CharacterInfo data.
        info.flipped = false;
        info.index = 0;
        info.size = size;
        info.style = style;
        info.uv = new UnityEngine.Rect();
        info.vert = new UnityEngine.Rect();
        info.width = 0;
    },
    RequestCharactersInTexture: function(characters, size, style) {
    },
};