export class OphInterpolate {
    constructor() {
        this.value = 0;
        this.isBusy = false;
        this.initValue = 0;
        this.endValue = 0;
        this.duration = 0.001;
        this.timeElapse = 0;
    }
    start(init, end, duration) {
        this.initValue = init;
        this.endValue = end;
        this.duration = duration;
        this.timeElapse = 0;
        this.isBusy = true;
    }
    update(dt) {
        this.value = this.initValue + ((this.endValue - this.initValue)
            * (this.timeElapse / this.duration));
        this.timeElapse += dt;
        this.timeElapse = this.timeElapse >= this.duration ? this.duration : this.timeElapse;
        this.isBusy = this.timeElapse < this.duration;
    }
}
//# sourceMappingURL=OphInterpolate.js.map