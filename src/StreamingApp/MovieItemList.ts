import { OphInterpolate } from "../Core/OphInterpolate.js";
import { OphUtils } from "../Core/OphUtils.js";
import { OphWidget } from "../Core/OphWidget.js";
import { MovieItem } from "./MovieItem.js";
import { StreamingApp } from "./StreamingApp.js";

export class MovieItemList extends OphWidget
{
    readonly SEPARATION:number = 242;
    readonly ITEMS_OFFSET_Y:number = 52;
    static MARGIN_COUNTER:number = 158;

    data:DataList;
    title:TPIXI.Text;
    containerItems:TPIXI.Container;
    movement:OphInterpolate;
    movieItems : Array<MovieItem> = [];
    index:number = 0;
    showCounter:boolean;
    separation:number;

    constructor(x:number, y:number, data:DataList)
    {
        super(x, y);
        this.data = data;

        // Agregando el título
        this.title = new PIXI.Text(this.data.title, {fill:0xFFFFFF, fontSize: 32, fontWeight: 600});
        this.movement = new OphInterpolate();
        this.containerItems = new PIXI.Container();

        this.showCounter = parseInt(this.data.showCounter, 0) == 1;
        this.separation = this.SEPARATION + (this.showCounter ? MovieItemList.MARGIN_COUNTER : 0);

        // Creando la lista de películas
        for (let i = 0; i < this.data.movies.length; i++)
        {
            this.addItem(this.separation * i, this.ITEMS_OFFSET_Y,
                StreamingApp.getDataMovie(this.data.movies[i]), i);
        }
        this.goTo(0);

        this.container.addChild(this.title);
        this.container.addChild(this.containerItems);
    }

    update(dt:number):void
    {
        this.movement.update(dt);
        this.containerItems.x = -this.movement.value;
    }

    goTo(amount:number, exit?:OnCallback, change?:OnChangeMovieCallback):void
    {
        if (!this.movement.isBusy)
        {
            let oldIndex = this.index;
            this.index += amount;
            if (this.index == -1 && exit) { exit(); }
            this.index = OphUtils.clamp(this.index, 0, this.movieItems.length - 1);
            this.movement.start(this.movement.value, this.index * this.separation, 300);
            if (oldIndex != this.index && change) { change(this.movieItems[this.index].data); }
        }
    }

    getCurrenMovieItem():MovieItem
    {
        return this.movieItems[this.index];
    }

    addItem(x:number, y:number, dataMovie:DataMovie|null, index:number):void
    {
        if (dataMovie != null)
        {
            let item = new MovieItem(x, y, dataMovie, index, this.showCounter);
            this.containerItems.addChild(item.container);
            this.movieItems.push(item);
        }
    }
}