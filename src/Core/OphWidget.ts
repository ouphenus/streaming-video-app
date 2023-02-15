export class OphWidget
{
    container:TPIXI.Container;

    constructor(x:number = 0, y:number = 0)
    {
        this.container = new PIXI.Container();
        this.setPosition(x, y);
    }

    setPosition(x:number, y:number)
    {
        this.container.x = x;
        this.container.y = y;
    }
}