
UnityEngine.Texture2D = function(width, height, image) {
    this.width = width;
    this.height = height;
    this.image = image;
    this.glTexture = undefined;
    this.glFormat = undefined;// gl.RGBA;
    this.glType = undefined;//gl.UNSIGNED_BYTE;
};

UnityEngine.Texture2D.prototype = {
    constructor: UnityEngine.Texture2D,
    destroy: function() {
        if (this.glTexture !== undefined) {
            gl.deleteTexture(this.glTexture);
            this.glTexture = undefined;
        }
    },
    SetupTexture: function(gl, slot) {
        if (this.glTexture === undefined) {
            if (this.image === undefined) return; // texture not ready.
            this.glTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0 + slot);
            gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
            gl.texParameteri( type, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
            gl.texParameteri( type, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
            gl.texImage2D(gl.TEXTURE_2D, 0, this.glFormat, this.glFormat | gl.RGBA, this.glType | gl.UNSIGNED_BYTE, this.image);
            return;
        }
        gl.activeTexture(gl.TEXTURE0 + slot);
        gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
    }
};