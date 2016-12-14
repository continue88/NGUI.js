
UnityEngine.Texture2D = function(image) {
    this.image = image;
    this.glTexture = undefined;
    this.glFormat = gl.RGBA;
    this.glType = gl.UNSIGNED_BYTE;
};

UnityEngine.Texture2D.prototype = {
    constructor: UnityEngine.Texture2D,
    destroy: function() {
        if (this.glTexture !== undefined) {
            gl.deleteTexture(this.glTexture);
            this.glTexture = undefined;
        }
    },
    SetupTexture: function(gl, state, slot) {
        if (this.glTexture === undefined) {
            this.glTexture = gl.createTexture();
            state.activeTexture(gl.TEXTURE0 + slot);
            state.bindTexture(gl.TEXTURE_2D, this.glTexture);
            state.texImage2D(gl.TEXTURE_2D, 0, this.glFormat, this.glFormat, this.glType, this.image);
            return;
        }
        state.activeTexture(gl.TEXTURE0 + slot);
        state.bindTexture(gl.TEXTURE_2D, this.glTexture);
    }
};