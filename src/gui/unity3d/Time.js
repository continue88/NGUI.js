
UnityEngine.Time = {
    captureFramerate: -1,
    deltaTime: 0,
    fixedDeltaTime: 1/60,
    fixedTime: 0,
    frameCount: 0,
    maximumDeltaTime: 0,
    realtimeSinceStartup: 0,
    renderedFrameCount: 0,
    smoothDeltaTime: 0,
    time: 0,
    timeScale: 1,
    timeSinceLevelLoad: 0,
    unscaledDeltaTime: 0,
    unscaledTime: 0,

    lastTime: (new Date()).getTime(),
    Update: function() {
        var now = (new Date()).getTime();
        this.unscaledDeltaTime = (now - this.lastTime) * 0.001;
        this.deltaTime = this.unscaledDeltaTime * this.timeScale;
        this.fixedTime += this.fixedDeltaTime;
        this.frameCount++;
        this.renderedFrameCount++;
        this.time += this.deltaTime;
        this.timeSinceLevelLoad += this.deltaTime;
        this.unscaledTime += this.unscaledDeltaTime;
        this.realtimeSinceStartup += this.unscaledDeltaTime;
        this.lastTime = now;
    }
};