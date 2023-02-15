export class OphInterpolate
{
    value:number = 0;
    isBusy:boolean = false;
    private initValue:number = 0;
    private endValue:number = 0;
    private duration:number = 0.001;
    private timeElapse:number = 0;

    constructor() { }

    start(init:number, end:number, duration:number):void
    {
        this.initValue = init;
        this.endValue = end;
        this.duration = duration;
        this.timeElapse = 0;
        this.isBusy = true;
    }

    update(dt:number):void
    {
        this.value = this.initValue + ((this.endValue - this.initValue)
            * (this.timeElapse / this.duration));
        this.timeElapse += dt;
        this.timeElapse = this.timeElapse >= this.duration ? this.duration : this.timeElapse;
        this.isBusy = this.timeElapse < this.duration;
    }
}