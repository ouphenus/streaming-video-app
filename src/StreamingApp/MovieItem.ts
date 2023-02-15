import { OphWidget } from "../Core/OphWidget.js";

export class MovieItem extends OphWidget
{
    data:DataMovie;
    counter? : TPIXI.Sprite;
    thumbnail : TPIXI.Sprite;

    constructor(x:number, y:number, data:DataMovie,
        index:number, showCounter:boolean)
    {
        super(x, y);
        this.data = data;
        this.thumbnail = PIXI.Sprite.from(`./assets/images/movies/${data.id}_preview.jpg`);
        this.thumbnail.width = 230;
        this.thumbnail.height = 330;

        if (showCounter)
        {
            this.counter = PIXI.Sprite.from(`./assets/images/controls/counter-${index+1}.png`);
            this.container.addChild(this.counter);
            this.thumbnail.x = 158;
        }
        this.container.addChild(this.thumbnail);
    }
}