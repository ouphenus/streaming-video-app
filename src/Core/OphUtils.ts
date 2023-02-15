export enum Keys
{
    ArrowRight = "ArrowRight",
    ArrowLeft = "ArrowLeft",
    ArrowDown = "ArrowDown",
    ArrowUp = "ArrowUp",
    Enter = "Enter",
}

export class OphUtils
{
    public static CreateRectangle(x:number = 0, y:number = 0,
        width:number = 100, height:number = 100, color:number = 0xFFFFFF,
        gradient:boolean = false)
    {
        let sprite:TPIXI.Sprite = PIXI.Sprite.from(`./assets/images/controls/${gradient?"square-gradient":"square"}.png`);
        sprite.x = x;
        sprite.y = y;
        sprite.width = width;
        sprite.height = height;
        sprite.tint = color;
        return sprite;
    }

    public static clamp(num:number, min:number, max:number):number
    {
        return Math.min(Math.max(num, min), max);
    }
}